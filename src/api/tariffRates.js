import { get, put, post, remove } from '@/utils/fetch';

export async function getTariffRates(params) {
  const url = `/api/v1/finance/tariff-rates/`;
  return await get(url, { params });
}

export async function getTariffRate(id, params) {
  const url = `/api/v1/finance/tariff-rates/${id}/`;
  return await get(url, { params });
}

export async function updateTariffRate(id, data, params) {
  const url = `/api/v1/finance/tariff-rates/${id}/`;
  return await put(url, data, { params });
}

export async function createTariffRate(data, params) {
  const url = `/api/v1/finance/tariff-rates/`;
  return await post(url, data, { params });
}

export async function removeTariffRate(id, params) {
  const url = `/api/v1/finance/tariff-rates/${id}/`;
  return await remove(url, { params });
}
