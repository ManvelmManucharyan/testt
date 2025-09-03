import { unauthorizedPost, get } from '@/utils/fetch';

export async function login(data) {
  return await unauthorizedPost('api/v1/auth/login/', data);
}

export async function telegramLogin(data) {
  return await unauthorizedPost('api/v1/auth/telegram/login/', data);
}

export async function getMe() {
  return await get('api/v1/auth/me/');
}
