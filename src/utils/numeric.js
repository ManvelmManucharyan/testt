export function formatNumber(value, roundTo) {
  if (value === null || value === undefined) return '-';

  if (roundTo === undefined) {
    return new Intl.NumberFormat('ru-RU').format(value);
  }
  const roundedValue = Math.round(value / roundTo) * roundTo;

  return roundedValue.toLocaleString('ru-RU');
}
