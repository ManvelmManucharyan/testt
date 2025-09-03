import axios from 'axios';
import { getLocalStorageKey } from '@/utils/localStorage';
import { toast } from 'vue3-toastify';
import i18n from '@/local';

const API_URL = `${import.meta.env.VITE_HR_BACKEND_URL}`;
const getBaseUrl = () => new URL(i18n.global.locale, API_URL).href;

function _handle_400_to_499_errors(data) {
  if (Array.isArray(data?.non_field_errors)) {
    toast(data.non_field_errors, {
      type: 'error',
      position: 'bottom-right',
      pauseOnHover: false,
      pauseOnFocusLoss: false,
      autoClose: false,
      hideProgressBar: true,
      transition: 'zoom',
    });
  } else {
    const otherErrors = { ...data };

    const errorKeys = Object.keys(otherErrors);
    if (errorKeys.length) {
      errorKeys.forEach((field) => {
        const errorText = otherErrors[field];
        if (Array.isArray(errorText) && errorText.length) {
          const errorMsg = `${field}: ${errorText[0]}`;
          toast(errorMsg, {
            type: 'error',
            position: 'bottom-right',
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            autoClose: false,
            hideProgressBar: true,
            transition: 'zoom',
          });
        } else {
          toast(errorText, {
            type: 'error',
            position: 'bottom-right',
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            autoClose: false,
            hideProgressBar: true,
            transition: 'zoom',
          });
        }
      });
    }
  }

  return Promise.reject();
}

function _handle_server_errors() {
  const errorMsg = i18n.global.t('oops');
  toast(errorMsg, {
    type: 'error',
    position: 'bottom-right',
    pauseOnHover: false,
    pauseOnFocusLoss: false,
    autoClose: false,
    hideProgressBar: true,
    transition: 'zoom',
  });
}

function _handle_403_error() {
  toast(i18n.global.t('noPermission'), {
    type: 'error',
    position: 'bottom-right',
    pauseOnHover: false,
    pauseOnFocusLoss: false,
    autoClose: false,
    hideProgressBar: true,
    transition: 'zoom',
  });
}

axios.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { response } = error;

    if (response.status >= 500) {
      _handle_server_errors();
    } else if (response.status === 403) {
      _handle_403_error();
    } else if (response.status >= 400 && response.status < 500) {
      _handle_400_to_499_errors(response.data);
    } else {
      throw new Error(`Unexpected HTTP response status: ${response.status}`);
    }
    return Promise.reject(response);
  },
);

export const get = (url, options = {}) =>
  axios.get(url, createAuthorizedConfig(options));
export const post = (url, data, options = {}) =>
  axios.post(url, data, createAuthorizedConfig(options, 'POST'));
export const put = (url, data, options = {}) =>
  axios.put(url, data, createAuthorizedConfig(options, 'PUT'));
export const patch = (url, data, options = {}) =>
  axios.patch(url, data, createAuthorizedConfig(options, 'PATCH'));
export const remove = (url, options = {}) =>
  axios.delete(url, createAuthorizedConfig(options, 'DELETE'));
export const unauthorizedGet = (url, options = {}) =>
  axios.get(url, createUnauthorizedConfig('GET', options.headers));
export const unauthorizedPost = (url, data) =>
  axios.post(url, data, createUnauthorizedConfig('POST'));
const createAuthorizedConfig = (options = {}, method = 'GET') => ({
  ...options,
  paramsSerializer: {
    indexes: null,
  },
  baseURL: getBaseUrl(),
  headers: {
    Authorization: `JWT ${getLocalStorageKey('access', null)}`,
    'Content-Type': options.contentType || 'application/json',
  },
  responseType: options.responseType || 'json',
  method: method.toLowerCase(),
});
const createUnauthorizedConfig = (method = 'GET', headers = {}) => ({
  method: method.toLowerCase(),
  withCredentials: false,
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    ...headers,
  },
  responseType: 'json',
});
