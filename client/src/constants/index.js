export const GLOBAL_ERROR = "GLOBAL_ERROR";
export const GLOBAL_SUCCESS = "GLOBAL_SUCCESS";
export const GLOBAL_SUCCESS_WITH_IMG = "GLOBAL_SUCCESS_WITH_IMG";

export const WEBSITE_LOAD = "WEBSITE_LOAD";

export const USER_AUTH_TYPES = {
  LOGIN: {
    LOAD_LOGIN: "LOAD_LOGIN",
    LOAD_LOGGGED_USER: "LOAD_LOGGED_USER",
  },
  SIGNUP: {
    LOAD_SIGNUP: "LOAD_SIGNUP",
    LOAD_SIGNED_UP_USER: "LOAD_SIGNED_UP_USER",
  },
  MESSAGE: {
    LOAD_AUTH_SUCCESS_MESSAGE: "LOAD_AUTH_SUCCESS_MESSAGE",
    LOAD_AUTH_FAILURE_MESSAGE: "LOAD_AUTH_FAILURE_MESSAGE",
  },
  USER_STATUS: {
    LOAD_ACCREDITATION: "LOAD_ACCREDITATION",
    IS_LOGGED_IN: "IS_LOGGED_IN",
  },

  USER_LOGOUT: {
    LOAD_LOGOUT: "LOAD_LOGOUT",
  },
};

export const COOKIE_NAMES = {
  AUTH_TOKEN: "AUTH_TOKEN",
};

export const PRODUCT_TYPES = {
  GET_ALL_CATEGORIES: "GET_ALL_CATEGORIES",
  LOAD_GET_PRODUCTS_BASED_ON_QUERY: "LOAD_GET_PRODUCTS_BASED_ON_QUERY",
  GET_PRODUCTS_BASED_ON_QUERY: "GET_PRODUCTS_BASED_ON_QUERY",
  HOLD_PREVIOUS_REQUESTED_QUERY: "HOLD_PREVIOUS_REQUESTED_QUERY",
  SET_NUMBER_OF_RESULTS_PERPAGE: "SET_NUMBER_OF_RESULTS_PERPAGE",
  SET_PAGE_NUMBER: "SET_PAGE_NUMBER",
  NO_MORE_RESULTS_FOUND: "NO_MORE_RESULTS_FOUND",
  ADD_PRODUCT_TO_CART: "ADD_PRODUCT_TO_CART",
  REMOVE_PRODUCT_FROM_CART: "REMOVE_PRODUCT_FROM_CART",
};
