import { get, post, put, remove } from '@/utils/fetch';

export async function getVacation(id) {
  const url = `/api/v1/hr/vacations/${id}/`;
  return await get(url);
}

export async function createVacation(data) {
  const url = `/api/v1/hr/vacations/`;
  return await post(url, data);
}

export async function updateVacation(id, data) {
  const url = `/api/v1/hr/vacations/${id}/`;
  return await put(url, data);
}

export async function removeVacation(id) {
  const url = `/api/v1/hr/vacations/${id}/`;
  return await remove(url);
}
