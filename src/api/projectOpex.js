import { get, post, put, remove } from '@/utils/fetch';

export async function getProjectOperationalExpenses(params) {
  const url = `/api/v1/finance/project-operational-expenses/`;
  return await get(url, { params });
}

export async function getProjectOperationalExpense(id) {
  const url = `/api/v1/finance/project-operational-expenses/${id}/`;
  return await get(url);
}

export async function createProjectOperationalExpense(data) {
  const url = `/api/v1/finance/project-operational-expenses/`;
  return await post(url, data, {});
}

export async function updateProjectOperationalExpense(id, data) {
  const url = `/api/v1/finance/project-operational-expenses/${id}/`;
  return await put(url, data, {});
}

export async function deleteProjectOperationalExpense(id) {
  const url = `/api/v1/finance/project-operational-expenses/${id}/`;
  return await remove(url);
}
