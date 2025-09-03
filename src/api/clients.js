import { get, post, remove, put } from '@/utils/fetch';

export async function getClients() {
  const url = `/api/v1/hr/clients/`;
  return await get(url);
}

export async function getClient(id) {
  const url = `/api/v1/hr/clients/${id}/`;
  return await get(url);
}

export async function createClient(data) {
  const url = `/api/v1/hr/clients/`;
  return await post(url, data);
}

export async function removeClient(id) {
  const url = `/api/v1/hr/clients/${id}/`;
  return await remove(url);
}

export async function updateClient(id, data) {
  const url = `/api/v1/hr/clients/${id}/`;
  return await put(url, data);
}
