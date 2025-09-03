import { get, put, post, remove } from '@/utils/fetch';

export async function getCards() {
  const url = `/api/v1/finance/cards/`;
  return await get(url);
}

export async function getCard(id) {
  const url = `/api/v1/finance/cards/${id}/`;
  return await get(url);
}

export async function removeCard(id) {
  const url = `/api/v1/finance/cards/${id}/`;
  return await remove(url);
}

export async function updateCard(id, data) {
  const url = `/api/v1/finance/cards/${id}/`;
  return await put(url, data);
}

export async function createCard(data) {
  const url = `/api/v1/finance/cards/`;
  return await post(url, data);
}
