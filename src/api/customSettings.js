import { get } from '@/utils/fetch';

export async function getCustomSettings(params) {
  const url = `/api/v1/settings/custom-settings/`;
  return await get(url, { params });
}
