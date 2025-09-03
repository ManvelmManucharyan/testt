import { post } from '@/utils/fetch';

export async function syncRates(from, to) {
  const payload = { from: from, to: to };
  const url = `/api/v1/actions/sync_rates/`;
  return await post(url, payload);
}

export async function syncJira(since, deletedSince) {
  const payload = { since: since, deletedSince: deletedSince };
  const url = `/api/v1/actions/sync_jira/`;
  return await post(url, payload);
}
