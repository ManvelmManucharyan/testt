import { get, put } from '@/utils/fetch';

export async function getAldanFixedRates(params) {
  const url = `/api/v1/finance/aldan-fixed-rates/`;
  return await get(url, { params });
}

export async function getAldanFixedRate(id) {
  const url = `/api/v1/finance/aldan-fixed-rates/${id}/`;
  return await get(url);
}

export async function updateAldanFixedRate(id, data) {
  const url = `/api/v1/finance/aldan-fixed-rates/${id}/`;
  return await put(url, data, {});
}
