import { get } from '@/utils/fetch';

export async function getCurrencies() {
  const url = `/api/v1/finance/currencies/`;
  return await get(url);
}

export async function getCategories() {
  const url = `/api/v1/finance/categories/`;
  return await get(url);
}
