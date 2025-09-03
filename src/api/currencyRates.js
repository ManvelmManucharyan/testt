import { get, put } from '@/utils/fetch';

export async function getCurrencyRates(params) {
  const url = `/api/v1/finance/currency-rates/`;
  return await get(url, { params });
}

export async function getCurrencyRate(id) {
  const url = `/api/v1/finance/currency-rates/${id}/`;
  return await get(url);
}

export async function updateCurrencyRate(id, data) {
  const url = `/api/v1/finance/currency-rates/${id}/`;
  return await put(url, data, {});
}
