import { get, put, post, remove } from '@/utils/fetch';

export async function getOffers(params) {
  const url = `/api/v1/hr/offers/`;
  return await get(url, { params });
}

export async function getOffer(id) {
  const url = `/api/v1/hr/offers/${id}/`;
  return await get(url);
}

export async function getOfferOpexTotals(params) {
  const url = `/api/v1/finance/offer-opex-totals/`;
  return await get(url, { params });
}

export async function updateOffer(id, data) {
  const url = `/api/v1/hr/offers/${id}/`;
  return await put(url, data);
}

export async function getOfferAggregates(id, params) {
  const url = `/api/v1/hr/offers/${id}/aggregates`;
  return await get(url, { params });
}

export async function getOfferAggregatesDetails(id, params) {
  const url = `/api/v1/hr/offers/${id}/aggregates-detail`;
  return await get(url, { params });
}

export async function createOffer(data) {
  const url = `/api/v1/hr/offers/`;
  return await post(url, data, {});
}

export async function removeOffer(id, params) {
  const url = `/api/v1/hr/offers/${id}/`;
  return await remove(url, { params });
}
