import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { ServerToken } from '@/types/api';
import { handleApiError } from '@/utils/handleApiError';

export function getUrl() {
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api';
}

const logoutUser = () => {
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    if (currentPath !== '/auth/login') {
      window.location.href = `/auth/login?redirectTo=${encodeURIComponent(
        currentPath,
      )}`;
    }
    localStorage.removeItem('bluto_user');
    Cookies.remove('bluto_token');
  }
};

type PayloadTypes<T> = {
  [key: string]: T;
};

const apiClient = axios.create({
  baseURL: getUrl(),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const getAuthToken = (serverToken: ServerToken | null = null) => {
  if (serverToken) {
    const token = serverToken?.get('bluto_token')?.value;
    if (token) {
      return { headers: { Authorization: `Bearer ${token}` } };
    }
  } else if (typeof window !== 'undefined') {
    const token = Cookies.get('bluto_token');
    if (token) {
      return { headers: { Authorization: `Bearer ${token}` } };
    }
  }
  return null;
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response && error?.response?.status === 401) {
      logoutUser();
    }
    if (axios.isAxiosError(error) && error?.response) {
      return Promise.reject(error?.response);
    }
    return Promise.reject(error);
  },
);

async function makeGetRequest(
  url: string,
  config: AxiosRequestConfig = {},
  withToken = false,
  serverToken?: ServerToken,
) {
  try {
    const tokenHeaders = withToken ? getAuthToken(serverToken) : { headers: {} };
    const response = await apiClient.get(url, {
      ...config,
      headers: {
        ...tokenHeaders?.headers,
        ...(config?.headers || {}),
      },
    });
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

async function makePostRequest<T>(
  url: string,
  bodyFormData: PayloadTypes<T> | FormData | string | null,
  config: AxiosRequestConfig = {},
  withToken = false,
) {
  try {
    const isFormData = bodyFormData instanceof FormData;
    const tokenHeaders = withToken ? getAuthToken() : { headers: {} };

    const response = await apiClient.post(url, bodyFormData, {
      ...config,
      headers: {
        ...tokenHeaders?.headers,
        ...(config?.headers || {}),
        ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
      },
    });
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

async function makeDeleteRequest(
  url: string,
  config: AxiosRequestConfig = {},
  withToken = false,
) {
  try {
    const tokenHeaders = withToken ? getAuthToken() : { headers: {} };
    const response = await apiClient.delete(url, {
      ...config,
      ...tokenHeaders,
    });
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export {
  makePostRequest,
  makeGetRequest,
  makeDeleteRequest,
  apiClient,
};
