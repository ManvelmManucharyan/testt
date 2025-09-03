import { get } from '@/utils/fetch';

export async function getStaticChoices() {
  const url = `/api/v1/hr/static_choices`;
  return await get(url);
}
