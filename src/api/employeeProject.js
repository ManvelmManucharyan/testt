import { get, post, remove, put } from '@/utils/fetch';

export async function getEmployeeProjects(params) {
  const url = `/api/v1/hr/employee-projects/`;
  return await get(url, { params });
}

export async function createEmployeeProject(data) {
  const url = `/api/v1/hr/employee-projects/`;
  return await post(url, data, {});
}

export async function deleteEmployeeProject(id) {
  const url = `/api/v1/hr/employee-projects/${id}/`;
  return await remove(url);
}

export async function getEmployeeProject(id, params) {
  const url = `/api/v1/hr/employee-projects/${id}/`;
  return await get(url, { params });
}

export async function updateEmployeeProject(id, data, params) {
  const url = `/api/v1/hr/employee-projects/${id}/`;
  return await put(url, data, { params });
}
