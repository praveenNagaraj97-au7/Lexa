import {
  call,
  select,
  put,
  delay,
  takeLatest,
  takeEvery,
} from "redux-saga/effects";

import { USER_AUTH_TYPES, COOKIE_NAMES } from "../constants";
import history from "../history";
import {
  loginUser,
  authSuccessMessage,
  authFailueMessage,
  signUpUser,
  userAccredited,
  getUser,
} from "../actions";
import {
  UserLogger,
  UserSigner,
  AuthAccreditation,
  forgotPassword,
  resetPassword,
  getUser as getUserApi,
} from "../api";
import { useCookies } from "../utils/useCookies";
import { useSessionStorage } from "../utils/useSessionStorage";

const { setAuthCookie, getCookie, removeCookie } = useCookies;
const { setSessionItem, getSessionItem, removeSessionItem } = useSessionStorage;
const {
  LOGIN: { LOAD_LOGIN },
  SIGNUP: { LOAD_SIGNUP },
  USER_STATUS: { LOAD_ACCREDITATION, LOAD_USER },
  USER_LOGOUT: { LOAD_LOGOUT },
  USER_PASSWORD: { LOAD_FORGOT_PASSWORD, LOAD_RESET_PASSWORD },
} = USER_AUTH_TYPES;

const { AUTH_TOKEN } = COOKIE_NAMES;

const getFormValues = ({ form }) => form;

function* handleUserLoginWorker() {
  // Get Form Values for Store
  const {
    SignUpOrLogin: { values },
  } = yield select(getFormValues);
  //   Check If the form is filled with valid details.
  // API has this error handling feature
  // But we are doing this on client side to avoid over fetching.
  if (values) {
    if (!values.hasOwnProperty("email")) {
      yield put(authFailueMessage("Please Enter Email👻"));
      yield delay(3200);
      yield put(authFailueMessage(null));
      return;
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      yield put(authFailueMessage("Please Enter Valid Email👻"));
      yield delay(3200);
      yield put(authFailueMessage(null));
      return;
    } else if (!values.hasOwnProperty("password")) {
      yield put(authFailueMessage("Please Enter Password👻"));
      yield delay(3200);
      yield put(authFailueMessage(null));
      return;
    }
  } else {
    yield put(authFailueMessage("Please Enter Email and Password 👻"));
    yield delay(3200);
    yield put(authFailueMessage(null));
    return;
  }

  //   Once Field Check is done call API!
  try {
    const { data } = yield call(
      UserLogger,
      values.email,
      values.password,
      values.signedIn ? "infinite" : "24h"
    );

    yield put(loginUser(data));
    yield put(authSuccessMessage("Logged In Successfully🐱‍🏍"));

    // If keep-logged in checked store as cookie else in session-storage
    if (values.signedIn) {
      yield call(
        setAuthCookie,
        AUTH_TOKEN,
        data.token,
        values.signedIn ? "infinite" : "24"
      );
    } else {
      // set auth_token under session storage.
      yield call(setSessionItem, AUTH_TOKEN, data.token);
    }

    yield history.goBack();
    yield call(handleUserAccreditationWorker);
    yield delay(3200);
    yield put(authSuccessMessage(null));
  } catch (err) {
    try {
      yield put(authFailueMessage(err.response.data.message + "🙃"));
      yield delay(3200);
      yield put(authFailueMessage(null));
    } catch (err) {
      yield put(authFailueMessage("Something went wrong🤯 try again later⌛"));
      yield delay(3200);
      yield put(authFailueMessage(null));
      // Mail if uncaught error occurs
    }
  }
}

export function* userLoginWatcher() {
  yield takeLatest(LOAD_LOGIN, handleUserLoginWorker);
}

function* handleUserSignUpWorker() {
  const {
    SignUpOrLogin: { values },
  } = yield select(getFormValues);
  if (values) {
    if (!values.hasOwnProperty("name")) {
      yield put(authFailueMessage("Please Enter Name👻"));
      yield delay(3200);
      yield put(authFailueMessage(null));
      return;
    } else if (!values.hasOwnProperty("signUpemail")) {
      yield put(authFailueMessage("Please Enter Email"));
      yield delay(3200);
      yield put(authFailueMessage(null));
      return;
    } else if (!/\S+@\S+\.\S+/.test(values.signUpemail)) {
      yield put(authFailueMessage("Please Enter Valid Email👻"));
      yield delay(3200);
      yield put(authFailueMessage(null));
      return;
    } else if (!values.hasOwnProperty("phoneNumber")) {
      yield put(authFailueMessage("Please Enter Phone Number"));
      yield delay(3200);
      yield put(authFailueMessage(null));
      return;
    } else if (
      String(values.phoneNumber).length !== 10 ||
      !String(values.phoneNumber).charAt(0) > 6 ||
      !Number.isInteger(Number(values.phoneNumber))
    ) {
      yield put(authFailueMessage("Please Enter Valid Phone Number"));
      yield delay(3200);
      yield put(authFailueMessage(null));
      return;
    } else if (!values.hasOwnProperty("signUppassword")) {
      yield put(authFailueMessage("Please Enter Password👻"));
      yield delay(3200);
      yield put(authFailueMessage(null));
      return;
    } else if (!values.hasOwnProperty("confirmPassword")) {
      yield put(authFailueMessage("Please Enter Password👻"));
      yield delay(3200);
      yield put(authFailueMessage(null));
      return;
    } else if (values.signUppassword !== values.confirmPassword) {
      yield put(authFailueMessage("Password Didn't match👻"));
      yield delay(3200);
      yield put(authFailueMessage(null));
      return;
    }
  } else {
    yield put(authFailueMessage("Please Fill the Form👻"));
    yield delay(3200);
    yield put(authFailueMessage(null));
    return;
  }

  try {
    const { data } = yield call(
      UserSigner,
      values.name,
      values.signUpemail,
      values.signUppassword,
      values.confirmPassword,
      values.phoneNumber
    );

    yield put(signUpUser(data));
    yield put(authSuccessMessage("Thank You ,keep shopping!🐱‍🏍"));
    yield call(setSessionItem, AUTH_TOKEN, data.token);
    yield history.goBack();
    yield call(handleUserAccreditationWorker);
    yield delay(3200);
    yield put(authSuccessMessage(null));
  } catch (err) {
    try {
      yield put(authFailueMessage(err.response.data.message + "🙃"));
      yield delay(3200);
      yield put(authFailueMessage(null));
    } catch (err) {
      yield put(authFailueMessage("Something went wrong🤯 try again later⌛"));
      yield delay(3200);
      yield put(authFailueMessage(null));
      // Mail if uncaught error occurs
    }
  }
}

export function* userSignUpWatcher() {
  yield takeLatest(LOAD_SIGNUP, handleUserSignUpWorker);
}

function* handleUserAccreditationWorker() {
  const authCookie = yield call(getCookie, AUTH_TOKEN);
  const sessionCookie = yield call(getSessionItem, AUTH_TOKEN);

  if (!authCookie && !sessionCookie) return yield put(userAccredited(false));

  try {
    const { data } = yield call(AuthAccreditation, authCookie || sessionCookie);
    yield put(userAccredited(data.message));
  } catch (err) {
    yield put(userAccredited(false));
    yield removeCookie(AUTH_TOKEN);
  }
}

export function* userAccreditationWatcher() {
  yield takeEvery(LOAD_ACCREDITATION, handleUserAccreditationWorker);
}

function* handleUserLogoutWorker() {
  yield call(removeCookie, AUTH_TOKEN);
  yield call(removeSessionItem, AUTH_TOKEN);
  yield call(handleUserAccreditationWorker);
  yield put(authSuccessMessage("Logged Out Successfully, come back soon!🐱‍"));
  yield delay(3200);
  yield put(authSuccessMessage(null));
}

export function* userLogoutWatcher() {
  yield takeEvery(LOAD_LOGOUT, handleUserLogoutWorker);
}

// Forgot Password
function* handleUserForgorPasswordWorker() {
  const {
    SignUpOrLogin: { values },
  } = yield select(getFormValues);

  if (values) {
    try {
      const { data } = yield call(forgotPassword, values.forgotemail);

      if (data) {
        yield put(
          authSuccessMessage(`Reset link sent to ${values.forgotemail}`)
        );
        yield delay(3200);
        yield put(authSuccessMessage(null));
      }
    } catch (error) {
      yield put(authFailueMessage(`Something went wrong try again later!!!`));
      yield delay(3200);
      yield put(authFailueMessage(null));
    }
  } else {
    yield put(authFailueMessage("Enter Email to get reset link!! 😇"));
    yield delay(3200);
    yield put(authFailueMessage(null));
  }
}

export function* userForgotPasswordWatcher() {
  yield takeEvery(LOAD_FORGOT_PASSWORD, handleUserForgorPasswordWorker);
}

// Password reset

function* handleUserPasswordResetWorker() {
  const {
    resetForm: { values },
  } = yield select(getFormValues);
  const resetToken = yield history.location.pathname.split("user_auth/")[1];
  if (values) {
    if (!values.password) {
      yield put(authFailueMessage("Enter Password"));
      yield delay(3200);
      yield put(authFailueMessage(null));
      return;
    }

    if (!values.confirmPassword) {
      yield put(authFailueMessage("Confirm Your Password"));
      yield delay(3200);
      yield put(authFailueMessage(null));
      return;
    }

    if (values.password !== values.confirmPassword) {
      yield put(authFailueMessage("Password didn't match 😬"));
      yield delay(3200);
      yield put(authFailueMessage(null));
      return;
    }
    try {
      const { data } = yield call(
        resetPassword,
        resetToken,
        values.password,
        values.confirmPassword
      );

      yield put(authSuccessMessage(data.message));
      yield call(setSessionItem, AUTH_TOKEN, data.token);
      yield history.push("/");
      yield call(handleUserAccreditationWorker);
      yield delay(3200);
      yield put(authSuccessMessage(null));

      console.log(data);
    } catch (err) {
      try {
        if (err.response.data.message) {
          yield put(authFailueMessage(err.response.data.message));
          yield delay(3200);
          yield put(authFailueMessage(null));
        }
      } catch (e) {
        yield put(
          authFailueMessage(
            "Reset Token Expired 😒, Please request for new reset link!!!"
          )
        );
        yield delay(3200);
        yield put(authFailueMessage(null));
      }
    }
  } else {
    yield put(authFailueMessage("Enter Password and Confirm Password"));
    yield delay(3200);
    yield put(authFailueMessage(null));
  }
}

export function* userResetPasswordWatcher() {
  yield takeLatest(LOAD_RESET_PASSWORD, handleUserPasswordResetWorker);
}

// Manage User data

const getUserDataFromStore = ({ userDetails }) => userDetails;

function* handleUserManageDataWorker() {
  const userData = yield select(getUserDataFromStore);
  if (userData.hasOwnProperty("user")) {
    return;
  }

  try {
    // If user details already in store don't call the api!!
    const { data } = yield call(getUserApi);
    yield put(getUser(data.user));
  } catch (err) {
    yield put(authFailueMessage("Something went wrong🤯!!!"));
    yield delay(3200);
    yield put(authFailueMessage(null));
  }
}

export function* userManagaDataWatcher() {
  yield takeLatest(LOAD_USER, handleUserManageDataWorker);
}
