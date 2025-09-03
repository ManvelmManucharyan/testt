import { get } from '@/utils/fetch';

export async function getProjectPayments(params) {
  const url = `/api/v1/reports/project-payments/`;
  return await get(url, { params });
}
