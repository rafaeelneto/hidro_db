import { makeVar, InMemoryCache } from '@apollo/client';

export const sideBarHiddenVar = makeVar(false);
export const tokenVar = makeVar('');
export const tokenExpiresInVar = makeVar('');
export const userLoggedInVar = makeVar(false);
export const userVisitanteVar = makeVar(false);
export const userInfoVar = makeVar({ id: '', role: '' });
export const dataStateVar = makeVar({});
export const isOnEditVar = makeVar(false);

export const tableUserStateVar = makeVar({});

export const isLoadingVar = makeVar(false);
export const isSucessVar = makeVar(false);
export const sucessMsgVar = makeVar('');

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        sideBarHidden: {
          read() {
            return sideBarHiddenVar();
          },
        },
        token: {
          read() {
            return tokenVar();
          },
        },
        tokenExpiresIn: {
          read() {
            return tokenExpiresInVar();
          },
        },
        userLoggedIn: {
          read() {
            return userLoggedInVar();
          },
        },
        userVisitante: {
          read() {
            return userVisitanteVar();
          },
        },
        tableUserState: {
          read() {
            return tableUserStateVar();
          },
        },
        userInfo: {
          read() {
            return userInfoVar();
          },
        },
        dataState: {
          read() {
            console.log(dataStateVar());
            return dataStateVar();
          },
        },
        isOnEdit: {
          read() {
            return isOnEditVar();
          },
        },
        isLoading: {
          read() {
            return isLoadingVar();
          },
        },
        isSucess: {
          read() {
            return isSucessVar();
          },
        },
        sucessMsg: {
          read() {
            return sucessMsgVar();
          },
        },
      },
    },
  },
});
