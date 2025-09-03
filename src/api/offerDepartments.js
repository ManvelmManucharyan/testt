import { get, remove } from '@/utils/fetch';

export async function getOfferDepartments(offer) {
  const url = `/api/v1/hr/offer-departments/${offer}`;
  return await get(url);
}

export async function deleteOfferDepartment(params) {
  const url = `api/v1/hr/offer-departments`;
  return await remove(url, { params });
}
