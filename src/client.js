import React from 'react';
import ApolloClient from 'apollo-boost';

import { store } from './store';
import ENV from './environment';
import { refreshIdToken } from './actions';
import NavigationService from './utils/NavigationService';
import timeout from './utils/timeout';
import { REFRESH_TOKEN } from './actions/types';

/**
 * Handles GraphQL error. Note that you can not use async/await... https://github.com/apollographql/apollo-link/issues/646#issuecomment-423279220
 * @param {} e
 */
function handleGraphQLError(graphQLErrors) {
  graphQLErrors.map(({ message, locations, path }) => {
    return console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
  });
}

/**
 * Handles Network errors such as token expired, invalid etc...
 */
function handleNetworkError(networkError) {
  const { statusCode, result } = networkError;
  if (statusCode === 400) {
    // Handle case when token has expired...
    if (result && result.errors && result.errors[0] && result.errors[0].message === 'Could not verify JWT: JWTExpired') {
      console.log('ID Token has expired! Attempting to refresh...');
      const currentStore = store.getState();
      const refreshToken = currentStore.auth.user.refreshToken;
      try {
        refreshIdToken(refreshToken).then(user => {
          store.dispatch({ type: REFRESH_TOKEN, payload: { user } });
          return undefined;
        });
      } catch (e) {
        console.log('INNER ERROR HAPPENED');
        throw new Error(e);
      }
    } else {
      console.log(networkError);
    }
  }
}

/**
 * Initialize Apollo Client
 *
 * */
function initializeApolloClient() {
  const client = new ApolloClient({
    uri: ENV.graphqlUrl,
    request: async operation => {
      const currentStore = store.getState();
      const idToken = currentStore.auth.user.idToken;
      operation.setContext({
        headers: { Authorization: `Bearer ${idToken}` }
      });
    },
    onError: ({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        handleGraphQLError(graphQLErrors);
      }
      if (networkError) {
        handleNetworkError(networkError);
      }
    }
  });
  return client;
}

export default initializeApolloClient();
