import moment from 'moment';
import i18n from '@/local';

export function formattedDateWithSeconds(value) {
  const date = moment(value);
  if (date.isSame(moment().startOf('day'), 'day')) {
    return `${date.format('HH:mm:ss')}`;
  } else if (date.isSame(moment().startOf('year'), 'year')) {
    return date.format('DD MMM HH:mm:ss');
  }
  return date.format('DD MMM YYYY HH:mm:ss');
}

export function formattedDate(value) {
  const date = moment(value);
  if (date.isSame(moment().startOf('day'), 'day')) {
    return `${date.format('HH:mm')}`;
  } else if (date.isSame(moment().startOf('year'), 'year')) {
    return date.format('DD MMM HH:mm');
  }
  return date.format('DD MMM YYYY HH:mm');
}

export function formatSingleDate(date, placeholder = '-') {
  if (!date) return placeholder;
  const currentYear = moment().year();
  const formattedDate = moment(date).locale(i18n.global.locale);
  if (formattedDate.year() === currentYear) {
    return formattedDate.format('DD MMM');
  }
  return formattedDate.format('DD MMM YYYY');
}

export function formattedDateStartEndDate(start_date, end_date) {
  if (!start_date || !end_date) return '';

  const currentYear = moment().year();
  const startMoment = moment(new Date(start_date));
  const endMoment = moment(new Date(end_date));

  const startFormat =
    startMoment.year() === currentYear ? 'MMM D' : 'MMM D, YYYY';
  const endFormat = endMoment.year() === currentYear ? 'MMM D' : 'MMM D, YYYY';

  const formattedStart = startMoment.format(startFormat);
  const formattedEnd = endMoment.format(endFormat);

  return `${formattedStart} - ${formattedEnd}`;
}

export function formatDate(date, author) {
  if (!date) return '-';
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} ${author || 'Unknown'}`;
}

export function formatAndShortDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
