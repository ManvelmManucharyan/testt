import moment from 'moment';
import i18n from '@/local';

export function parseSecondToHours(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  let result = '';

  if (hours > 0) {
    result += `${hours}h `;
  }
  if (minutes > 0) {
    result += `${minutes}m `;
  }
  if (remainingSeconds > 0 || (!hours && !minutes)) {
    result += `${remainingSeconds}s`;
  }

  return result.trim();
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${day}/${month}/${year}`;
}

export function generateMonthsArray(year) {
  const monthNames = Array.from({ length: 12 }, (_, index) =>
    moment().locale(i18n.global.locale).month(index).format('MMMM'),
  );

  return monthNames.map((name, index) => ({
    name,
    days: Array.from({ length: getDaysInMonth(year, index) }, (_, i) => i + 1),
  }));
}

export function getFormattedDate(date) {
  return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
}

export function formatHours(input) {
  if (input == null) return '';
  const v =
    typeof input === 'string' && input.trim().toLowerCase().endsWith('h')
      ? parseFloat(input.replace(/h$/i, ''))
      : Number(input);
  if (!Number.isFinite(v)) return '';
  let hours = Math.floor(v);
  let minutes = Math.round((v - hours) * 60);
  if (minutes === 60) {
    hours++;
    minutes = 0;
  }
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}
