import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import naive from 'naive-ui';
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import i18n from '@/local';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import '@/assets/main.css';
import 'moment/dist/locale/ru';
import moment from 'moment';

const app = createApp(App);
const pinia = createPinia();

app.config.globalProperties.$backendUrl = import.meta.env.VITE_HR_BACKEND_URL;

app.config.globalProperties.$formatDate = (dateStr) => {
  if (!dateStr) return '-';

  const date = moment(dateStr);
  const currentYear = moment().year();
  const year = date.year();
  const formattedDate = date.format('D MMMM');

  return year !== currentYear ? `${formattedDate} ${year}` : formattedDate;
};

app.config.globalProperties.$formatDateRange = (start, end) => {
  const startDate = start ? moment(start) : null;
  const endDate = end ? moment(end) : null;

  if (!startDate) return '-';

  const formattedStart = app.config.globalProperties.$formatDate(start);

  if (!endDate) {
    return `${formattedStart} - ${i18n.global.t('present')}`;
  }

  const formattedEnd = app.config.globalProperties.$formatDate(end);

  return `${formattedStart} - ${formattedEnd}`;
};

app.component('VueMultiselect', Multiselect);

app.use(pinia);
app.use(Vue3Toastify);
app.use(router);
app.use(naive);
app.use(i18n);

app.mount('#app');
