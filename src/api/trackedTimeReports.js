import { get } from '@/utils/fetch';

export async function getTrackedTimeReport(params) {
  const url = `/api/v1/hr/tracked-time-report`;
  return await get(url, { params, responseType: 'blob' });
}
