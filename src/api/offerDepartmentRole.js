import { get, post, put, remove } from '@/utils/fetch';

export async function getOfferDepartmentRoles(params) {
  const url = `/api/v1/hr/offer-department-roles/`;
  return await get(url, { params });
}

export async function createOfferDepartmentRole(data) {
  const url = `/api/v1/hr/offer-department-roles/`;
  return await post(url, data, {});
}

export async function bulkCreateOfferDepartmentRoles(data) {
  const url = `/api/v1/hr/offer-department-roles/bulk-create`;
  return await post(url, data, {});
}

export async function updateOfferDepartmentRole(id, data) {
  const url = `/api/v1/hr/offer-department-roles/${id}/`;
  return await put(url, data, {});
}

export async function deleteOfferDepartmentRole(id) {
  const url = `/api/v1/hr/offer-department-roles/${id}/`;
  return await remove(url);
}
