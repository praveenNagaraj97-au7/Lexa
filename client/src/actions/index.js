import { GLOBAL_ERROR, WEBSITE_LOAD } from "../constants";

export const globalFailureMessenger = (error) => ({
  type: GLOBAL_ERROR,
  error,
});
export const websiteLoad = () => ({ type: WEBSITE_LOAD });

export {
  // Global Auth Messenger
  authSuccessMessage,
  authFailueMessage,
  // Login
  loadLogin,
  loginUser,
  // signUp
  loadSignUp,
  signUpUser,
  // accreditation
  loadAccreditation,
  userAccredited,
  // LogoutUser
  loadLogout,
} from "./userAuthActions";

export {
  // Get all categories on website load
  getAllCategories,
  // Load products related to categories clicked
  loadGetProductsOnQuery,
  holdPreviousProductQuery,
  getProductsOnQuery,
} from "./productsAction";
