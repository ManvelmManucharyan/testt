import { get } from '@/utils/fetch';

export async function getRoles() {
  const url = `/api/v1/hr/roles/`;
  return await get(url);
}
