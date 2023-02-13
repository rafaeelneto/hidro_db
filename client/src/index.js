import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import { StylesProvider } from '@material-ui/core/styles';

import './index.css';
import App from './App';
import client from './utils/apolloLinkCreator';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <StylesProvider injectFirst>
        <App />
      </StylesProvider>
    </ApolloProvider>
  </React.StrictMode>,
);

// ReactDOM.render(
//   <React.StrictMode>
//     <ApolloProvider client={client}>
//       <StylesProvider injectFirst>
//         <App />
//       </StylesProvider>
//     </ApolloProvider>
//   </React.StrictMode>,
//   document.getElementById('root'),
// );

// ReactDOM.render(
//   <ApolloProvider client={client}>
//     <App />
//   </ApolloProvider>,
//   document.getElementById('root')
// );
