import { defineStore } from 'pinia';
import {
  getMonthlyData,
  retrieveMonthlyData,
  create,
  update,
} from '@/api/monthlyData';
import moment from 'moment';
export const useMonthlyDataStore = defineStore('monthlyData', {
  state() {
    return {
      data: [],
      isLoading: true,
      isCreating: false,
      monthlyData: [],
    };
  },
  actions: {
    async fetchMonthlyData(params) {
      this.isLoading = true;
      this.data = await getMonthlyData(params);
      this.isLoading = false;
    },
    async fetch(id) {
      this.isLoading = true;
      this.monthlyData = await retrieveMonthlyData(id);
      this.isLoading = false;
    },
    async create(data, params) {
      this.isCreating = true;
      await create(data);
      this.fetchMonthlyData(params);
      this.isCreating = false;
    },
    async update(id, data, params) {
      this.isUpdating = true;
      await update(id, data);
      this.fetchMonthlyData(params);
      this.isUpdating = false;
    },
  },
  getters: {
    getMonthlyDataInfo(state) {
      const formattedData = {};

      state.data.forEach((entry) => {
        const monthKey = moment(entry.date, 'MM/DD/YYYY').month() + 1;

        if (!formattedData[monthKey]) {
          formattedData[monthKey] = { id: entry.id };
        }

        formattedData[monthKey] = {
          ...formattedData[monthKey],
          remuneration: entry.calculated_remuneration
            ? Math.round(entry.calculated_remuneration).toLocaleString('ru-RU')
            : '-',
          currency: entry.currency,
          payment_type: entry.payment_type,
          employment_type: entry.employment_type_name,
          company: entry.company,
        };
      });

      return formattedData;
    },
  },
});
