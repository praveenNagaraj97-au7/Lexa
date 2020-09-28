import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";

import { useSessionStorage } from "../utils/useSessionStorage";
import { useCookies } from "../utils/useCookies";
import { COOKIE_NAMES } from "../constants";

const { AUTH_TOKEN } = COOKIE_NAMES;
const { getCookie } = useCookies;
const { getSessionItem } = useSessionStorage;

const cache = new InMemoryCache({});

let httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "https://lexa-api-v1.herokuapp.com/graphql"
      : "http://localhost:8080/graphql",
});

const authTokenFromCookie = () => getCookie(AUTH_TOKEN);
const authTokenFromSession = () => getSessionItem(AUTH_TOKEN);

const authLink = setContext((_, { headers }) => {
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${
        authTokenFromCookie() || authTokenFromSession()
      }`,
    },
  };
});

httpLink = authLink.concat(httpLink);

const wsLink = new WebSocketLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "wss://lexa-api-v1.herokuapp.com/graphql"
      : "ws://localhost:8080/graphql",
  options: {
    reconnect: true,
  },
  connectionParams: {
    authorization: `Bearer ${authTokenFromCookie() || authTokenFromSession()}`,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  cache,
  link: splitLink,
});
