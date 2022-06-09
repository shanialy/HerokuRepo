// lib/withApollo.js
import withApollo from "next-with-apollo";
import { InMemoryCache, ApolloProvider, ApolloClient } from "@apollo/client";
const PORT = process.env.PORT || 3000;
export default withApollo(
  ({ initialState }) => {
    return new ApolloClient({
      uri: `/api/graphql`,
      cache: new InMemoryCache().restore(initialState || {}),
    });
  },
  {
    render: ({ Page, props }) => {
      return (
        <ApolloProvider client={props.apollo}>
          <Page {...props} />
        </ApolloProvider>
      );
    },
  }
);
