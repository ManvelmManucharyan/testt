import { get, post, put, remove } from '@/utils/fetch';

export async function getVacationsYear(params) {
  const url = `/api/v1/hr/vacations-year-view/`;
  return await get(url, { params });
}

export async function getVacation(id) {
  const url = `/api/v1/hr/vacations-deprecated/${id}/`;
  return await get(url);
}

export async function createVacation(data) {
  const url = `/api/v1/hr/vacations-deprecated/`;
  return await post(url, data);
}

export async function updateVacation(id, data) {
  const url = `/api/v1/hr/vacations-deprecated/${id}/`;
  return await put(url, data);
}

export async function removeVacation(id) {
  const url = `/api/v1/hr/vacations-deprecated/${id}/`;
  return await remove(url);
}

export async function getNonWorkingEmployeeDays(params) {
  const url = `/api/v1/hr/non-working-employee-days/`;
  return await get(url, { params });
}
