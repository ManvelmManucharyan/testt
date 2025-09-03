import { get, put, post } from '@/utils/fetch';

export async function getMonthlyData(params) {
  const url = `/api/v1/hr/monthly-data/`;
  return await get(url, { params });
}

export async function retrieveMonthlyData(id) {
  const url = `/api/v1/hr/monthly-data/${id}/`;
  return await get(url);
}

export async function create(data) {
  const url = `/api/v1/hr/monthly-data/`;
  return await post(url, data, {});
}

export async function update(id, data) {
  const url = `/api/v1/hr/monthly-data/${id}/`;
  return await put(url, data, {});
}
