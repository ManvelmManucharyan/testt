import { get, put } from '@/utils/fetch';

export async function getEmployees(params) {
  const url = `/api/v1/hr/employees/`;
  return await get(url, { params });
}

export async function getEmployee(id) {
  const url = `/api/v1/hr/employees/${id}/`;
  return await get(url);
}

export async function updateEmployee(id, data) {
  const url = `/api/v1/hr/employees/${id}/`;
  return await put(url, data);
}
