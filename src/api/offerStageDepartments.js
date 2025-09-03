import { get, put } from '@/utils/fetch';

export async function getOfferStageDepartments(offer) {
  const url = `/api/v1/hr/offers/${offer}/stage-departments`;
  return await get(url);
}

export async function updateOfferStageDepartment(id, data) {
  const url = `api/v1/hr/offer-stage-departments/${id}/`;
  return await put(url, data);
}
