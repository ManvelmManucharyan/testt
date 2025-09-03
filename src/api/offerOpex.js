import { get, post, put, remove } from '@/utils/fetch';

export async function getOfferOperationalExpenses(params) {
  const url = `/api/v1/finance/offer-operational-expenses/`;
  return await get(url, { params });
}

export async function getOfferOperationalExpense(id) {
  const url = `/api/v1/finance/offer-operational-expenses/${id}/`;
  return await get(url);
}

export async function createOfferOperationalExpense(data) {
  const url = `/api/v1/finance/offer-operational-expenses/`;
  return await post(url, data, {});
}

export async function updateOfferOperationalExpense(id, data) {
  const url = `/api/v1/finance/offer-operational-expenses/${id}/`;
  return await put(url, data, {});
}

export async function deleteOfferOperationalExpense(id) {
  const url = `/api/v1/finance/offer-operational-expenses/${id}/`;
  return await remove(url);
}
