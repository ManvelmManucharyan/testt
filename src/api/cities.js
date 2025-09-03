import { get } from '@/utils/fetch';

export async function getCities(params) {
  const url = `/api/v1/cities_light/cities/`;
  return await get(url, { params });
}

export async function getCity(id) {
  const url = `/api/v1/cities_light/cities/${id}/`;
  return await get(url);
}

export async function getCountries(params) {
  const url = `/api/v1/cities_light/countries/`;
  return await get(url, { params });
}

export async function getCountry(id) {
  const url = `/api/v1/cities_light/countries/${id}/`;
  return await get(url);
}
