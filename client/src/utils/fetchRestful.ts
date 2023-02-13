import axios from 'axios';

import { tokenVar } from '../graphql/cache';

const baseURL = process.env.REACT_APP_BASE_API_URL || '/v1/api';

export const API_ENDPOINTS = {
  USER_LOGIN_API: '/user/login',
  SILENT_REFRESH_API: '/user/refresh_token',
  CREATE_USER_API: '/user/create-user',
  LOGOUT: '/user/logout',
  FGDC_TEXTURES: '/fgdc-textures',
  FILE_UPLOAD: '/file-upload',
  FILE_DELETE: '/file-upload/delete',
  RESET_PASSWORD: '/user/resetPassword',
  FORGOT_PASSWORD: '/user/forgotPassword',
};

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const APIPost = async (
  endpoint: string,
  data,
  onUploadProgress?: (progressEvent: any) => void,
) => {
  try {
    const res = await instance.post(endpoint, data, {
      onUploadProgress,
    });

    return res;
  } catch (err: any) {
    throw err.response;
  }
};

export const APIPatch = async (
  endpoint: string,
  data,
  onUploadProgress?: (progressEvent: any) => void,
) => {
  try {
    const res = await instance.patch(endpoint, data, {
      onUploadProgress,
    });

    return res;
  } catch (err: any) {
    throw err.response;
  }
};

export const APIPostAuth = async (
  endpoint: string,
  data,
  onUploadProgress?: (progressEvent: any) => void,
) => {
  try {
    const res = await instance.post(endpoint, data, {
      headers: {
        Authorization: `Bearer ${tokenVar()}`,
      },
      onUploadProgress,
    });

    return res;
  } catch (err: any) {
    throw err.response;
  }
};
