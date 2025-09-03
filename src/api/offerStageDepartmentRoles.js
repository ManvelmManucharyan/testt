import { get, post, put, remove } from '@/utils/fetch';

export async function getOfferStageDepartmentRoles(offer) {
  const params = new URLSearchParams();
  params.append('offer', offer);
  const url = `/api/v1/hr/offer-stage-department-roles/`;
  return await get(url, { params });
}

export async function createOfferStageDepartmentRole(params, data) {
  const url = `/api/v1/hr/offer-stage-department-roles/`;
  return await post(url, data, { params });
}

export async function updateOfferStageDepartmentRole(id, params, data) {
  const url = `/api/v1/hr/offer-stage-department-roles/${id}/`;
  return await put(url, data, { params });
}

export async function getOfferStageDepartmentRole(id, params) {
  const url = `/api/v1/hr/offer-stage-department-roles/${id}/`;
  return await get(url, { params });
}

export async function removeOfferStageDepartmentRole(id, params) {
  const url = `/api/v1/hr/offer-stage-department-roles/${id}/`;
  return await remove(url, { params });
}
