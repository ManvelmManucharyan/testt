import { get } from '@/utils/fetch';

export async function getEmploymentTypes() {
  const url = `/api/v1/hr/employment_types`;
  return await get(url);
}
