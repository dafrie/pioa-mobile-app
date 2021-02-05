import { Linking } from 'expo';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

import NavigationService from '../utils/NavigationService';
import ENV from '../environment';

import { syncData } from '../utils/backgroundJob';
import {
  LOADING,
  READY,
  CHECK_TOKEN,
  GREETED,
  NO_TOKEN,
  REFRESH_TOKEN,
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGOUT_USER,
  PURGE_STATE,
  DISPLAY_WARNING,
} from './types';


/**
 * Parses the JWT ID token from Auth0 and returns a user objects with all claims read from the JWT.
 * @param {idToken} token
 * @returns {user} user
 */
function parseIdToken(token) {
  const namespace = 'https://hasura.io/jwt/claims';
  const decodedIdToken = jwtDecode(token);
  return user = {
    email: decodedIdToken.email,
    firstName: decodedIdToken[namespace].firstName,
    lastName: decodedIdToken[namespace].lastName,
    idToken: token,
    expiresAt: decodedIdToken.exp * 1000
  }
}

/**
 * Uses a refresh token (that doesn't expire) to get a fresh ID token (or access token)
 * @param {refreshToken} refreshToken 
 */
export async function refreshIdToken(refreshToken) {
  try {
    const data = { 
      grant_type: 'refresh_token',
      client_id: ENV.auth0ClientId,
      refresh_token: refreshToken
    }
    if (!refreshToken) throw Error("No refresh token, aborting!")
    const config = { headers: { 'content-type': 'application/json' } };
    const response = await axios.post(`${ENV.auth0Domain}/oauth/token`, data, config);
    const { id_token: idToken} = response.data;
    const user = parseIdToken(idToken);
    return user;
  } catch (e) {
    throw Error(e);
  }
}

export const checkLoginStatus = userObj => {
  return async dispatch => {
    try {
      dispatch({ type: LOADING });
      dispatch({ type: CHECK_TOKEN });

      // If no user set, then no check needed
      if (!userObj) return dispatch({ type: READY })
      
      // Check if token has expired or not. If yes, then refresh token
      const expired = userObj.expiresAt ? new Date().getTime() > userObj.expiresAt : true;
      if (expired) {
        const user = await refreshIdToken(userObj.refreshToken);
        dispatch({ type: REFRESH_TOKEN, payload: { user } })
      }
      await syncData();

    } catch (e) {
      if (e.response && e.response.status === 401) {
        dispatch({ type: LOGIN_USER_FAIL, payload: 'You have been logged out' });
        console.log('Authorization error');
        NavigationService.navigate('Auth');
      } else {
        console.log(e);
      }
    } finally {
      dispatch({ type: READY })
    }
  };
};

export const loginUserSuccess = tokens => {
  const { idToken, refreshToken } = tokens;
  const user = parseIdToken(idToken);
  user.refreshToken = refreshToken; // This token never expires...
  return async dispatch => {
    dispatch({ type: LOGIN_USER_SUCCESS, payload: { user } });
    dispatch({ type: READY });
    await syncData();
  };
};

export const setGreeted = () => {
  return async dispatch => {
    dispatch({ type: GREETED });
  };
};

export const logoutUser = user => {
  return async dispatch => {
    try {
      dispatch({ type: LOADING });

      const config = { headers: { Authorization: `Bearer ${user.idToken}` } };
      axios.get(`${ENV.auth0Domain}/v2/logout?${user.client_id}`, config);
      dispatch({ type: LOGOUT_USER });
      dispatch({ type: READY });
    } catch (e) {
      console.log(e);
    }
  };
};

export const purgeState = () => {
  return async dispatch => {
    try {
      dispatch({ type: PURGE_STATE });
    } catch (e) {
      console.log(e);
    }
  };
};

export const displayWarning = text => {
  return { type: DISPLAY_WARNING, payload: text };
};
