import { call, put, select, takeLatest } from "redux-saga/effects";

import { getProductReviews, productReviewLoading } from "../../actions";
import { PRODUCT_TYPES, COOKIE_NAMES } from "../../constants";

import {
  getListOfProductReviewsEndPoint,
  reviewFoundHelpfulEndpoint,
} from "../../api";

import { globalErrorMessageHandler } from "../HandleAlertSagas";

import { useSessionStorage } from "../../utils/useSessionStorage";
import { useCookies } from "../../utils/useCookies";

const {
  LOAD_PRODUCT_REVIEWS,
  REVIEW_FOUND_HELPFUL,
  LOAD_NEW_PRODUCT_REVIEW,
} = PRODUCT_TYPES;
const { AUTH_TOKEN } = COOKIE_NAMES;

const { getSessionItem } = useSessionStorage;
const { getCookie } = useCookies;

const getProductIdFromStore = ({ productDetail }) => productDetail;
const getCurrentReviewFromStore = ({ productReview }) => productReview;

function* handleGetProductReviewWorker() {
  const {
    productType: { productId },
  } = yield select(getProductIdFromStore);

  // Check if the product review already exist for current product!!
  const { reviewForProduct } = yield select(getCurrentReviewFromStore);

  if (reviewForProduct) {
    if (reviewForProduct === productId) return;
  }

  try {
    yield put(productReviewLoading(true));
    const { data } = yield call(getListOfProductReviewsEndPoint, productId);
    data.reviewForProduct = productId;
    yield put(productReviewLoading(false));
    yield put(getProductReviews(data));
  } catch (err) {
    // yield console.clear();
    let data = {};
    yield put(productReviewLoading(false));
    data.reviewForProduct = productId;
    yield put(getProductReviews(data));
    // Clear API FETCH LOG
    // yield console.clear();
  }
}

export function* loadProductReviewWatcher() {
  yield takeLatest(LOAD_PRODUCT_REVIEWS, handleGetProductReviewWorker);
}

function* handleReviewFoundHelpfulWorker() {
  const authTokenCookie = yield call(getCookie, AUTH_TOKEN);
  const authTokenSession = yield call(getSessionItem, AUTH_TOKEN);
  const {
    reviewHelpfulId,
    productReviewsList,
    reviewForProduct,
  } = yield select(getCurrentReviewFromStore);
  try {
    const { data } = yield call(
      reviewFoundHelpfulEndpoint,
      authTokenCookie || authTokenSession,
      reviewHelpfulId
    );

    // if success find the document from store and update it instead of calling api again for count refresh

    const newUnstructuredReview = [...productReviewsList].map((each) => {
      if (each._id === reviewHelpfulId) {
        each.foundHelpful.push(data.details);
        return each;
      }
      return each;
    });

    // Struct new data with current data;
    const newStructuredReview = {
      details: newUnstructuredReview,
      reviewForProduct,
    };
    yield put(getProductReviews(newStructuredReview));
  } catch (err) {
    yield call(
      globalErrorMessageHandler,
      "Something went wrong 🤯 Please try again later"
    );
  }
}

export function* reviewFoundHelfulWatcher() {
  yield takeLatest(REVIEW_FOUND_HELPFUL, handleReviewFoundHelpfulWorker);
}

function* addNewProductReviewWorker() {
  yield console.log("ok");
}

export function* addNewProductReviewWatcher() {
  yield takeLatest(LOAD_NEW_PRODUCT_REVIEW, addNewProductReviewWorker);
}
