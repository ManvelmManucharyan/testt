export default {
  en: {
    newOperationalExpense: 'New Operational Expense',
    name: 'Name',
    category: 'Category',
    link: 'Link to the Google Drive',
    oneTimePayment: 'One-time payment',
    recurrence_period: 'Recurrence',
    currency: 'Currency',
    amortizeAcrossMonths: 'Amortize among months',
    card: 'Card',
    comment: 'Comment',
    amount: 'Amount per period',
    amountPerPeriod: 'Amount per period',
    start_date: 'First payment date',
    last_date: 'Last payment date',
    save: 'Save',
    delete: 'Delete',
    linkHelpText:
      'A link to the service subject to payment. For example, if the operational expense is related to the payment for AWS server services, the value of this field should be a link to the AWS website page where the payment can be made most easily.',
    recurrenceHelpText:
      "A whole positive number indicating how often the payment should be repeated. For example, to create an expense that recurs every three months, the value of this field should be the number '3'.",
    amortizeAcrossMonthsHelpText:
      "A number that represents the amortization (breakdown) of a one-time payment over months. For example, there is an expense of 90,000 rubles, created with a start date of January 2024 and an end date of March 2024. If the 'Amortize monthly' option is enabled, an expense of 30,000 rubles will be created for January, February, and March.",
  },
  ru: {
    newOperationalExpense: 'Новые Операционные Расходы',
    name: 'Название',
    category: 'Категория',
    link: 'Cсылка на папку в гугл диске',
    oneTimePayment: 'Единоразовый платеж',
    recurrence_period: 'Период рекуррентности',
    currency: 'Валюта',
    amortizeAcrossMonths: 'Амортизировать по месяцам',
    card: 'Карта',
    comment: 'Комментарий',
    amount: 'Сумма за период',
    amountPerPeriod: 'Сумма за период',
    start_date: 'Дата первого платежа',
    last_date: 'Дата последнего платежа',
    save: 'Сохранить',
    delete: 'Удалить',
    linkHelpText:
      'Ссылка на сервис, подлежащего оплате. Например, если операциооный расход связан с оплатой услуг за сервера AWS, то значением данного поля должна быть ссылка на страницу сайта AWS, откуда проще всего произвести оплату',
    recurrenceHelpText:
      'Целое положительное число, обозначающее насколько часто должна повторяться оплата. Например, для создания расхода, который повторяется раз в три месяца, значением данного поля должно быть число “3”',
    amortizeAcrossMonthsHelpText:
      'Число, которое обозначает амортизацию (разбиение) единоразовой оплаты по месяцам. Например, есть расход в 90 000 рублей,  созданный с датой начала, равной январю 2024 года и датой окончания, равной марту 2024 года. При включенной опции “Амортизировать по месяцам” будет создан расход на 30 000 рублей на январь, февраль и мар',
  },
};
