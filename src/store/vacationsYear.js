import { defineStore } from 'pinia';
import { getVacationsYear } from '@/api/vacationsDeprecated';
import { getNonWorkingEmployeeDays } from '@/api/vacationsDeprecated';
import { getLocalDateString } from '@/utils/dateUtils';

export const useVacationsYearStore = defineStore('vacationsYear', {
  state() {
    return {
      data: [],
      year: null,
      dayMap: new Map(),
      polymorphic_data: [],
      vacationType: null,
      isLoading: true,
    };
  },
  actions: {
    async fetch(year, vacationType, projectId, employeeId) {
      try {
        this.vacationType = vacationType;
        this.year = year;
        this.data = await getVacationsYear({
          year,
          vacation_type: vacationType,
          project: projectId,
          employee: employeeId,
        });
        this.polymorphic_data = await getNonWorkingEmployeeDays({
          year,
          vacation_type: vacationType,
          project: projectId,
          employee: employeeId,
        });
      } catch (error) {
        alert(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  getters: {
    getDailyFlags() {
      const year = this.year;
      if (!year) {
        return [];
      }

      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);

      for (
        let date = new Date(startDate);
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const dayString = getLocalDateString(date);

        const dayEntry = {
          day: dayString,
          anyone_on_vacations_flag: false,
          anyone_on_dayoff_flag: false,
          anyone_on_workoff_flag: false,
          anyone_on_sick_leave_flag: false,
          items: [],
        };

        this.dayMap.set(dayString, dayEntry);
      }

      const updateFlags = (from, to, flagType, item) => {
        const fromDate = new Date(from);
        const toDate = new Date(to);

        for (
          let date = new Date(fromDate);
          date <= toDate;
          date.setDate(date.getDate() + 1)
        ) {
          const dayString = getLocalDateString(date);
          const dayEntry = this.dayMap.get(dayString);

          if (dayEntry) {
            dayEntry[flagType] = true;
            const itemCopy = { ...item };

            if (flagType === 'anyone_on_workoff_flag') {
              itemCopy.type = 'workoff';
            }
            dayEntry.items.push(itemCopy);
          }
        }
      };

      for (const item of this.data) {
        if (item.type === 'vacation') {
          updateFlags(
            item.from_timestamp,
            item.to_timestamp,
            'anyone_on_vacations_flag',
            item,
          );
        }
        if (
          (item.type === 'day-off' || item.type === 'half-day-off') &&
          (this.vacationType === 'day-off' || !this.vacationType)
        ) {
          updateFlags(
            item.from_timestamp,
            item.to_timestamp,
            'anyone_on_dayoff_flag',
            item,
          );
        }
        if (
          item.work_off_from_timestamp &&
          item.work_off_to_timestamp &&
          (this.vacationType === 'work-off' || !this.vacationType)
        ) {
          updateFlags(
            item.work_off_from_timestamp,
            item.work_off_to_timestamp,
            'anyone_on_workoff_flag',
            item,
          );
        }
      }
      for (const item of this.polymorphic_data) {
        if (item.type === 'sickleave') {
          updateFlags(
            item.from_date,
            item.to_date,
            'anyone_on_sick_leave_flag',
            item,
          );
        }
      }
      return this.dayMap;
    },
  },
});
