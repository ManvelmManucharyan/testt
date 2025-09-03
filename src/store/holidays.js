import { defineStore } from 'pinia';
import { getHolidays } from '@/api/holidays';

export const useHolidaysStore = defineStore('holidays', {
  state() {
    return {
      data: [],
      isLoading: true,
    };
  },
  actions: {
    async fetch(year, month) {
      try {
        this.data = await getHolidays({ year, month });
      } catch (error) {
        alert(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  getters: {
    getHolidaysList() {
      return this.data.reduce((acc, item) => {
        const [month, day, year] = item.date.split('/');

        const formattedDay = day.padStart(2, '0');
        const formattedMonth = month.padStart(2, '0');

        const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;

        acc[formattedDate] = item.is_holiday;
        return acc;
      }, {});
    },
  },
});
