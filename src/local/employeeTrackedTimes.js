const BACKEND_URL = import.meta.env.VITE_HR_BACKEND_URL;

const HOLIDAY_URL = new URL('/ru/settings/holiday/', BACKEND_URL).toString();

export default {
  en: {
    employeeTrackedTimes: 'Tracked times',
    workingDaysHelpText: `The number of working hours from offers, deduction of approved vacations, time off, and sick leaves, 
      multiplied by the number of hours defined by the role's workload. The number of working days is 
      determined from the table <a href="${HOLIDAY_URL}" target="_blank">here</a>.`,
    totalDaysHelpText: `The number of working hours from offers, without deduction of approved vacations, time off, and sick leaves, 
      multiplied by the number of hours defined by the role's workload. The number of working days is 
      determined from the table <a href="${HOLIDAY_URL}" target="_blank">here</a>.`,
    workingDaysByContractHelpText: `The number of working days determined by the employee's contract rate, excluding vacations, 
      time off, and sick leaves. The rate is specified in the "Employment Type" field on the "Finance" tab in the employee's profile. 
      The number of working days is determined from the table <a href="${HOLIDAY_URL}" target="_blank">here</a>.`,
    controls: {
      ariaLabels: {
        previousMonth: 'Previous Month',
        nextMonth: 'Next Month',
        selectMonth: 'Select Month',
        selectYear: 'Select Year',
        groupBy: 'Group By',
        efficiencyFilter: 'Efficiency',
        exportData: 'Export',
        toDate: 'To',
        fromDate: 'From',
      },
      buttons: {
        previous: '<',
        next: '>',
        export: 'Export',
        apply: 'Apply',
      },
      selectOptions: {
        groupBy: {
          project: 'Project',
          user: 'User',
          department: 'Department',
        },
        efficiency: {
          all: 'All',
          low: 'Low',
        },
      },
      labels: {
        dateLabelFormat: 'MMM/YY',
      },
    },
    userGroupTable: {
      headers: {
        userProject: 'User / Project',
        role: 'Role',
        employmentType: 'Employment type',
        workingHoursByContract: 'By contract',
        workingHoursByProject: 'By project',
        logged: 'Logged',
        hours: 'Working hours',
      },
      labels: {
        total: 'Total: ',
        noRole: '-',
      },
    },
    projectGroupTable: {
      headers: {
        projectUser: 'Project / User',
        department: 'Department',
        role: 'Role',
        workingHoursByProject: 'Working hours by project',
        byWorkingDays: 'Accounting for vacations',
        byTotalDays: 'Ingoring vacations',
        logged: 'Logged',
      },
      labels: {
        total: 'Total: ',
        noRole: '-',
      },
    },
    errors: {
      historicalDataUnavailable:
        'Historical data before Dec 1st 2024 is unavailable.',
    },
    roleIsFromProjectMessage:
      'This is a role from the project. The ability to redirect to the role page is not implemented yet.',
  },
  ru: {
    employeeTrackedTimes: 'Отслеживаемое время',
    workingDaysHelpText: `Количество проданных рабочих часов из оферов за вычетом одобренных отпусков, 
      отгулов и больничных, умноженное на количество часов, определяемое нагрузкой роли. 
      Количество рабочих дней определяется из таблицы <a href="${HOLIDAY_URL}" target="_blank">здесь</a>.`,
    totalDaysHelpText: `Количество проданных рабочих часов из оферов без учета отпусков, 
      отгулов и больничных, умноженное на количество часов, определяемое нагрузкой роли. 
      Количество рабочих дней определяется из таблицы <a href="${HOLIDAY_URL}" target="_blank">здесь</a>.`,
    workingDaysByContractHelpText: `Количество рабочих дней, определяемое ставкой сотрудника в контракте без учета отпусков, отгулов и больничных.
      Ставка определяется в поле "Тип занятости" на странице "Финансы" в профиле сотрудника.
      Количество рабочих дней определяется из таблицы <a href="${HOLIDAY_URL}" target="_blank">здесь</a>.`,
    controls: {
      ariaLabels: {
        previousMonth: 'Предыдущий месяц',
        nextMonth: 'Следующий месяц',
        selectMonth: 'Выбрать месяц',
        selectYear: 'Выбрать год',
        groupBy: 'Группировать по',
        efficiencyFilter: 'Эффективность',
        exportData: 'Экспорт',
        toDate: 'До',
        fromDate: 'С',
      },
      buttons: {
        previous: '<',
        next: '>',
        export: 'Экспорт',
        apply: 'Применить',
      },
      selectOptions: {
        groupBy: {
          project: 'Проекту',
          user: 'Пользователю',
          department: 'Департаменту',
        },
        efficiency: {
          all: 'Все',
          low: 'Низкая',
        },
      },
      labels: {
        dateLabelFormat: 'MMM/YY',
      },
    },
    userGroupTable: {
      headers: {
        userProject: 'Пользователь / Проект',
        role: 'Роль',
        employmentType: 'Тип занятости',
        workingHoursByContract: 'Kонтракту',
        workingHoursByProject: 'Проекту',
        logged: 'Факту',
        hours: 'Рабочие часы по',
      },
      labels: {
        total: 'Всего: ',
        noRole: '-',
      },
    },

    projectGroupTable: {
      headers: {
        projectUser: 'Проект / Пользователь',
        department: 'Департамент',
        role: 'Роль',
        workingHoursByProject: 'Рабочие часы по проекту',
        byWorkingDays: 'C учетом отпусков',
        byTotalDays: 'Без учета отпусков',
        logged: 'Факт',
      },
      labels: {
        total: 'Всего: ',
        noRole: '-',
      },
    },
    errors: {
      historicalDataUnavailable:
        'Исторические данные до 1 декабря 2024 недоступны.',
    },
    roleIsFromProjectMessage:
      'Это роль из проекта. Возможность перехода на страницу роли пока не реализована.',
  },
};
