import { get, post, put, remove } from '@/utils/fetch';

export async function getOfferStages(params) {
  const url = `/api/v1/hr/offer-stages/`;
  return await get(url, { params });
}

export async function createOfferStage(data) {
  const url = `/api/v1/hr/offer-stages/`;
  return await post(url, data);
}

export async function getOfferStage(id, params) {
  const url = `/api/v1/hr/offer-stages/${id}/`;
  return await get(url, { params });
}

export async function updateOfferStage(id, data, params) {
  const url = `/api/v1/hr/offer-stages/${id}/`;
  return await put(url, data, { params });
}

export async function removeOfferStage(id, params) {
  const url = `/api/v1/hr/offer-stages/${id}/`;
  return await remove(url, { params });
}
