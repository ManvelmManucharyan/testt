import { createWebHistory, createRouter } from 'vue-router';
import { getLocalStorageKey } from '@/utils/localStorage';
import TheLoginPage from '@/pages/login/TheLoginPage.vue';
import TheErrorPage from '@/pages/error/TheErrorPage.vue';
import TheIndexPage from '@/pages/index/TheIndexPage.vue';
import TheOpexPage from '@/pages/opex/TheOpexPage.vue';
import OpexForm from '@/pages/opex/components/OpexForm.vue';
import TheEmployeeTrackedTimePage from '@/pages/employee_tracked_times/TheEmployeeTrackedTimePage.vue';

import TheVacationsPage from './pages/vacation_days/TheVacationsPage.vue';
import TheEmployeesPage from './pages/employees/TheEmployeesPage.vue';
import EmployeeDetailPage from './pages/employees/components/EmployeeDetailPage.vue';
import TheProjectsPage from './pages/project/TheProjectsPage.vue';
import ProjectPage from './pages/project/components/ProjectPage.vue';
import TheProjectPaymentsPage from './pages/project_payments/TheProjectPaymentsPage.vue';

import TheSalarySheetPage from './pages/salary_sheet/TheSalarySheetPage.vue';
import TheCompaniesPage from './pages/companies/TheCompaniesPage.vue';
import TheAldanFixedRatesPage from './pages/financial_models/aldan_fixed_rates/TheAldanFixedRatesPage.vue';
import TheCurrencyRatesPage from './pages/financial_models/currency_rates/TheCurrencyRatesPage.vue';
import TheCardsPage from './pages/cards/TheCardsPage.vue';
import TheTariffRatesPage from './pages/financial_models/tariff_rates/TheTariffRatesPage.vue';

import TheOffersPage from './pages/offers/TheOffersPage.vue';
import TheOfferDetailPage from './pages/offers/components/offer_detail/TheOfferDetailPage.vue';
import TheCompanyDetailPage from './pages/companies/components/company_detail/TheCompanyDetailPage.vue';

const notAuthRoutes = new Set(['/login']);

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/employees',
    component: TheIndexPage,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'vacations',
        name: 'vacations-page',
        component: TheVacationsPage,
      },
      {
        path: 'opex',
        name: 'opex-page',
        component: TheOpexPage,
      },
      {
        path: '/opex/create',
        name: 'opex-page-creation',
        component: OpexForm,
      },
      {
        path: '/opex/edit/:opexId',
        name: 'opex-page-edition',
        component: OpexForm,
      },
      {
        path: 'tracked-times',
        name: 'tracked-times-page',
        component: TheEmployeeTrackedTimePage,
      },
      {
        path: 'offers',
        name: 'offers-page',
        component: TheOffersPage,
      },
      {
        path: 'offers/:offerId',
        name: 'offers-page-detail',
        component: TheOfferDetailPage,
      },
      {
        path: 'offers/add',
        name: 'offers-page-add',
        component: TheOfferDetailPage,
      },
      {
        path: 'tariff-rates',
        name: 'tariff-rates-page',
        component: TheTariffRatesPage,
      },
      {
        path: 'aldan-fixed-rates',
        name: 'aldan-fixed-rates-page',
        component: TheAldanFixedRatesPage,
      },
      {
        path: 'currency-rates',
        name: 'currency-rates-page',
        component: TheCurrencyRatesPage,
      },
      {
        path: 'cards',
        name: 'cards-page',
        component: TheCardsPage,
      },
      {
        path: 'projects',
        name: 'projects-page',
        component: TheProjectsPage,
      },
      {
        path: '/projects/:projectId',
        name: 'projects-page-detail',
        component: ProjectPage,
      },
      {
        path: 'employees',
        name: 'employees-page',
        component: TheEmployeesPage,
      },
      {
        path: 'employees/:employeeId',
        name: 'employees-page-detail',
        component: EmployeeDetailPage,
      },
      {
        path: 'salary-sheet',
        name: 'salary-sheet-page',
        component: TheSalarySheetPage,
      },
      {
        path: 'project-payments',
        name: 'project-payments-page',
        component: TheProjectPaymentsPage,
      },
      {
        path: 'companies',
        name: 'companies-page',
        component: TheCompaniesPage,
      },
      {
        path: 'companies/:companyId',
        name: 'companies-page-detail',
        component: TheCompanyDetailPage,
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: TheLoginPage,
  },
  {
    path: '/:pathMatch(.*)*',
    component: TheErrorPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const jwt = getLocalStorageKey('access');
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !jwt) {
    next('/login');
  } else if (!requiresAuth && jwt && notAuthRoutes.has(to.path)) {
    next('/');
  } else {
    next();
  }
});

export default router;
