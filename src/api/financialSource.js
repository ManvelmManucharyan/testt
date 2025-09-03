import { get, post, put, remove } from '@/utils/fetch';

export async function getFinancialSources(params) {
  const url = `/api/v1/hr/financial-sources/`;
  return await get(url, { params });
}

export async function createFinancialSource(data) {
  const url = `/api/v1/hr/financial-sources/`;
  return await post(url, data, {});
}

export async function fetch(id, params) {
  const url = `/api/v1/hr/financial-sources/${id}/`;
  return await get(url, { params });
}

export async function updateFinancialSource(id, data, params) {
  const url = `/api/v1/hr/financial-sources/${id}/`;
  return await put(url, data, { params });
}

export async function removeFinancialSource(id, params) {
  const url = `/api/v1/hr/financial-sources/${id}/`;
  return await remove(url, { params });
}
