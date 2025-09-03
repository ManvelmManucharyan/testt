import { get } from '@/utils/fetch';

export async function getEmploymentTypes() {
  const url = `/api/v1/hr/employment-types/`;
  return await get(url);
}
