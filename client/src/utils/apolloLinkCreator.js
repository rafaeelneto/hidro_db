import { ApolloClient, createHttpLink, ApolloLink, gql, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

import { cache } from '../graphql/cache';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPH_QL_ENDPOINT || '/v1/graphql',
});

// TODO implementation of subscription

// const wsLink = new WebSocketLink({
//   uri: `ws://${(process.env.REACT_APP_GRAPH_QL_ENDPOINT || '/v1/graphql').replace(
//     /^(https?:|)\/\//,
//   )}`,
//   options: {
//     reconnect: true,
//   },
// });

// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
//   },
//   wsLink,
//   httpLink,
// );

const authLink = new ApolloLink(async (operation, forward) => {
  const { data } = await client.query({
    query: gql`
      query getToken {
        token @client
      }
    `,
  });

  const { token } = data;
  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  credentials: 'same-origin',
  cache,
});

export default client;
