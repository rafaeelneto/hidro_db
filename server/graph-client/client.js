const { execute, makePromise } = require('apollo-link');
const { createHttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');

//SET THIS TO ENVIROMENT VARIABLE
const uri =
  process.env.GRAPH_QL_ADRESS || 'http://graphql-engine:3000/v1/graphql';
const link = createHttpLink({
  uri,
  fetch,
  //headers: { 'X-Hasura-Admin-Secret': 'myadminsecretkey' },
});

exports.query = (operation) => {
  return makePromise(execute(link, operation))
    .then((res) => {
      if (res.errors) {
        throw res;
      }
      return res.data;
    })
    .catch((error) => {
      return error;
    });
};
