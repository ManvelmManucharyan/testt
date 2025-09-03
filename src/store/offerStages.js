import { defineStore } from 'pinia';
import { getOfferStages } from '@/api/offerStages';

export const useOfferStagesStore = defineStore('offerStages', {
  state() {
    return {
      data: [],
      isLoading: true,
    };
  },
  getters: {
    monthsAndWeeks(state) {
      if (!state.data || state.data.length === 0) return [];

      const stageStartDates = state.data.map((stage) => stage.fromDate);
      const stageEndDates = state.data.map((stage) => stage.toDate);

      const validStageStartDates = stageStartDates.filter(
        (date) => !isNaN(date),
      );
      const validStageEndDates = stageEndDates.filter((date) => !isNaN(date));

      if (
        validStageStartDates.length === 0 ||
        validStageEndDates.length === 0
      ) {
        return [];
      }

      const minDateValue = Math.min(
        ...validStageStartDates.map((date) => date.getTime()),
      );
      const maxDateValue = Math.max(
        ...validStageEndDates.map((date) => date.getTime()),
      );

      const minDate = new Date(minDateValue);
      const maxDate = new Date(maxDateValue);

      minDate.setDate(minDate.getDate() - ((minDate.getDay() + 6) % 7));

      let currentDate = new Date(minDate);

      const months = [];

      while (currentDate <= maxDate) {
        const year = currentDate.getFullYear();
        const shortYear = year % 100;
        const month = currentDate.getMonth();

        const monthName = currentDate
          .toLocaleDateString('default', { month: 'short' })
          .toLowerCase();

        const monthYear = `${monthName} ${shortYear}`;

        let monthObj = months.find((m) => m.monthYear === monthYear);
        if (!monthObj) {
          monthObj = {
            year,
            month,
            monthName,
            shortYear,
            monthYear,
            weeks: [],
          };
          months.push(monthObj);
        }

        const weekNumber = getWeekNumber(currentDate);

        const weekStartDate = new Date(currentDate);
        const weekEndDate = new Date(currentDate);
        weekEndDate.setDate(weekEndDate.getDate() + 6);

        monthObj.weeks.push({
          weekNumber,
          startDate: new Date(weekStartDate),
          endDate: new Date(weekEndDate),
        });

        currentDate.setDate(currentDate.getDate() + 7);
      }

      return months;
    },
  },
  actions: {
    async fetch(offer) {
      this.isLoading = true;
      this.data = await getOfferStages({ offer });
      this.isLoading = false;
    },
  },
});

function getWeekNumber(date) {
  const target = new Date(date.valueOf());
  const dayNr = (target.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const firstDayNr = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - firstDayNr + 3);
  const weekNumber =
    1 + Math.round(((target - firstThursday) / 86400000 - 3) / 7);
  return weekNumber;
}
