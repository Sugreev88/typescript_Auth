import express from "express";
const router = express.Router();

import {
  userSignUp,
  userLogin,
  get_UserDetails,
  verifyLogintoken,
  generateAccessToken,
  check_AdminRole,
  get_AllRegisteredUsers,
  update_UserDetails,
  delete_UserDetails,
} from "../controller/authController";

// user signup //
router.route("/api/register").post(userSignUp);
// //

// login //
router.route("/api/login").post(userLogin);
// //

// get user details //
router.route("/api/profile").get(verifyLogintoken, get_UserDetails);
// //

// add user (admin will create user) //
router
  .route("/api/admin/users")
  .post(verifyLogintoken, check_AdminRole, userSignUp);
// //

// get all registered user (admin route) //
router
  .route("/api/admin/users")
  .get(verifyLogintoken, check_AdminRole, get_AllRegisteredUsers);
// //

// update registered user details (admin route) //
router
  .route("/api/admin/users")
  .put(verifyLogintoken, check_AdminRole, update_UserDetails);
// //

// delete registered user details (admin route) //
router
  .route("/api/admin/users")
  .delete(verifyLogintoken, check_AdminRole, delete_UserDetails);
// //

// refersh token //
router.route("/refresh/token").post(generateAccessToken);
// //

export default router;
