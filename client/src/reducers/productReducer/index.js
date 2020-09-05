import { PRODUCT_TYPES } from "../../constants";

const {
  GET_ALL_CATEGORIES,
  LOAD_GET_PRODUCTS_BASED_ON_QUERY,
  GET_PRODUCTS_BASED_ON_QUERY,
  HOLD_PREVIOUS_REQUESTED_QUERY,
  SET_NUMBER_OF_RESULTS_PERPAGE,
  SET_PAGE_NUMBER,
  NO_MORE_RESULTS_FOUND,
  ADD_PRODUCT_TO_CART,
  REMOVE_PRODUCT_FROM_CART,
  LOAD_PRODUCT_CART,
  GET_PRODUCTS_IN_CART,
  LOAD_VIEW_PRODUCT_DETAIL,
  PRODUCT_DETAIL,
} = PRODUCT_TYPES;

export const categoriesReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ALL_CATEGORIES:
      return { ...state, categories: action.response };
    default:
      return state;
  }
};

const getProductsrelatedToQuery = {
  products: [],
  query: { pageNumber: 1, limit: 8 },
};

export const getProductsReducer = (
  state = getProductsrelatedToQuery,
  action
) => {
  switch (action.type) {
    case LOAD_GET_PRODUCTS_BASED_ON_QUERY:
      state.query["current"] = action.query;
      return { ...state };

    case HOLD_PREVIOUS_REQUESTED_QUERY:
      state.query["prev"] = action.prevQuery;
      return { ...state };

    case GET_PRODUCTS_BASED_ON_QUERY:
      return { ...state, products: action.response };

    case SET_PAGE_NUMBER:
      state.query["pageNumber"] = action.pageNumber;
      return { ...state };

    case SET_NUMBER_OF_RESULTS_PERPAGE:
      state.query["limit"] = action.noOfResults;
      return { ...state };

    case NO_MORE_RESULTS_FOUND:
      state.query["moreResultsAvailable"] = action.isAvailable;
      return { ...state };
    default:
      return state;
  }
};

export const productCartReducer = (state = { cart: [] }, action) => {
  switch (action.type) {
    case ADD_PRODUCT_TO_CART:
      state["addedItem"] = action.item;
      state.cart.push(action.item);
      return { ...state };

    case REMOVE_PRODUCT_FROM_CART:
      state.cart.splice(
        state.cart.findIndex((item) => item === action.item),
        1
      );
      if (state.cart.length === 0) delete state["productsInCart"];
      return { ...state };

    case LOAD_PRODUCT_CART:
      state["loadProductCart"] = true;
      return { ...state };
    case GET_PRODUCTS_IN_CART:
      state["productsInCart"] = action.details;
      return { ...state };
    default:
      return state;
  }
};

export const viewProductReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_VIEW_PRODUCT_DETAIL:
      state["productType"] = {
        productCategory: action.productDetail.category,
        productId: action.productDetail.id,
      };
      return { ...state };

    case PRODUCT_DETAIL:
      // What if no images were found ?
      // Assign images when data contains object!!
      // as it is virtual field data will be inside array so take the first item

      //what if productImagesAndDesc has only description but no images?

      // No worries server is designed to have set of 5 images description !!
      // what type of description does send?
      // server send different type of description for different category !

      state["images"] =
        action.data.productImagesAndDesc.length > 0
          ? action.data.productImagesAndDesc[0].productImages
          : [];
      state["productInfo"] =
        action.data.productDetails.length > 0
          ? {
              productName: action.data.productName,
              productPrice: action.data.productPrice,
              featuresList: action.data.productDetails[0].featuresList,
              similarProducts: action.data.productDetails[0].productId,
            }
          : [];

      state["productVideo"] =
        action.data.productDetails.length > 0
          ? action.data.productDetails[0].productVideo
          : null;

      return { ...state };
    default:
      return state;
  }
};