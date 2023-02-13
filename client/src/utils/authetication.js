import jwt from 'jsonwebtoken';

import { APIPost, APIPostAuth, API_ENDPOINTS } from './fetchRestful';
import {
  tokenVar,
  tokenExpiresInVar,
  userLoggedInVar,
  userVisitanteVar,
  userInfoVar,
} from '../graphql/cache';

// SAVE AUTHETICATION INFO AND SET SILENT REFRESH
const saveAutheticationInfo = (token) => {
  // DECODE TOKEN
  const decodedToken = jwt.decode(token);
  const expiresIn = new Date(decodedToken.exp * 1000).getTime() - new Date().getTime();

  // SET TIMER TO REFRESH TOKEN 30s BEFORE IT EXPIRES
  // eslint-disable-next-line no-use-before-define
  setSilentRefreshTimer(expiresIn - (process.env.REACT_APP_REFRESH_TOKEN_TIME_BEFORE || 30000));

  // SAVE TOKEN TO LOCAL STATE CACHE AND USER LOGGED VARIABLE
  const { id, role } = decodedToken;

  userInfoVar({ id, role });
  tokenVar(token);
  tokenExpiresInVar(expiresIn);
  userLoggedInVar(true);
  userVisitanteVar(false);

  return true;
};

// TRY TO MAKE THE SILENT REFRESH OF THE AUTHETICATION TOKEN
export const refreshToken = async () => {
  try {
    const res = await APIPost(API_ENDPOINTS.SILENT_REFRESH_API, JSON.stringify({}));
    const { token } = await res.data;

    if (!token) {
      throw new Error('Error on authetication');
    }

    saveAutheticationInfo(token);

    return true;
  } catch (err) {
    logout();
    return false;
  }
};

// MAKE THE LOGIN REQUEST TO NODE SERVER TO AUTHETICATE USER
export const autheticate = async (loginId, password) => {
  const userInfo = JSON.stringify({
    login_id: loginId,
    password,
  });

  const res = await APIPost(API_ENDPOINTS.USER_LOGIN_API, userInfo);

  const { data, status } = await res;

  if (status !== 200) {
    throw new Error(status);
  }

  const { token } = data;

  if (!token) {
    throw new Error('no token');
  }

  saveAutheticationInfo(token);

  return token;
};

export const logout = async () => {
  try {
    const res = await APIPostAuth(API_ENDPOINTS.LOGOUT, {});
    if (res) await res.data;
  } finally {
    tokenVar(null);
    tokenExpiresInVar(null);
    userLoggedInVar(false);
  }
};

// SET TIMER TO SILENT REFRESH
const setSilentRefreshTimer = (time) => {
  setTimeout(() => {
    // console.log('SILENT REFRESH');
    refreshToken();
  }, time);
};
