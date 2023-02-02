import { ApolloClient, InMemoryCache } from "@apollo/client";

const graphClient = new ApolloClient({
  uri: "http://127.0.0.1:8000/subgraphs/name/lookeey/canvas-subgraph",
  cache: new InMemoryCache(),
});

export default graphClient;
