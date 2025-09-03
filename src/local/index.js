import { createI18n } from 'vue-i18n';
import loginMessages from './login';
import sidebarMessages from './sidebar';
import errorMessages from './error';
import navbarMessages from './navbar';
import opexMessages from './opex';
import otherMessages from './main';
import createOpexMessages from './createOpex';

import employeeTrackedTimesMessages from './employeeTrackedTimes';
import financialModelsMessages from './financialModels';
import vacationsMessages from './vacations';

import offerRolesMessages from './offers';
import offerStagesMessages from './offerStages';
import departmentPageMessages from './departmentPage';
import employeeMessages from './employee';
import projectsMessages from './projects';
import salarySheetMessages from './salarySheet';
import offerAggregatesMessages from './offerAggregates';
import clientMessages from './client';
import tariffRates from './tariffRates';
import cardsMessages from './cards';
import projectRolesMessages from './projectRoles';

const messages = {
  en: {
    ...loginMessages.en,
    ...sidebarMessages.en,
    ...errorMessages.en,
    ...navbarMessages.en,
    ...opexMessages.en,
    ...otherMessages.en,
    ...createOpexMessages.en,
    ...employeeTrackedTimesMessages.en,
    ...offerRolesMessages.en,
    ...offerStagesMessages.en,
    ...departmentPageMessages.en,
    ...financialModelsMessages.en,
    ...vacationsMessages.en,
    ...employeeMessages.en,
    ...projectsMessages.en,
    ...salarySheetMessages.en,
    ...offerAggregatesMessages.en,
    ...clientMessages.en,
    ...tariffRates.en,
    ...cardsMessages.en,
    ...projectRolesMessages.en,
  },
  ru: {
    ...loginMessages.ru,
    ...sidebarMessages.ru,
    ...errorMessages.ru,
    ...navbarMessages.ru,
    ...opexMessages.ru,
    ...otherMessages.ru,
    ...createOpexMessages.ru,
    ...employeeTrackedTimesMessages.ru,
    ...offerRolesMessages.ru,
    ...offerStagesMessages.ru,
    ...departmentPageMessages.ru,
    ...financialModelsMessages.ru,
    ...vacationsMessages.ru,
    ...employeeMessages.ru,
    ...projectsMessages.ru,
    ...salarySheetMessages.ru,
    ...offerAggregatesMessages.ru,
    ...clientMessages.ru,
    ...tariffRates.ru,
    ...cardsMessages.ru,
    ...projectRolesMessages.ru,
  },
};

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});

export default i18n;
