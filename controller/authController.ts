import { Request, Response, NextFunction, RequestHandler } from "express";
import { errorHandler, Error } from "../error/errorHandler";

import UserRegistration from "../model/userRegistration";

import {
  userRegistration_ValidatorSchema,
  update_UserRegistration_ValidatorSchema,
} from "../validator/userReg_Validators";

import {
  addNewUser,
  verifyLogin_Credentials,
  verify_AccessToken,
  verify_RefreshToken_generate_AccessToken,
  update_UserDetails_inDb,
  delete_UserDetails_inDb,
} from "../service/authService";

// sign up the user //

export const userSignUp = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { error, value } = userRegistration_ValidatorSchema.validate(
      req.body
    );

    if (error) {
      res.status(400).send({ error: error.details[0].message });
      return;
    }

    const { name, emailId, password, role } = value;

    const { userId } = await addNewUser(value);

    res.status(201).send({
      message: `Successfully created new user`,
      userId: userId,
    });
  } catch (error) {
    errorHandler(error, next);
  }
};

// //

// user login //

export const userLogin = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { emailId, password } = req.body;

    const { accessToken, refreshToken } = await verifyLogin_Credentials(
      emailId,
      password
    );

    res.status(200).send({
      message: `succesfully logged in `,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    errorHandler(error, next);
  }
};

// get profile details //

export const get_UserDetails = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.loggedInUser?.userId;
    const userDetails = await UserRegistration.findOne(
      { userId },
      { name: 1, emailId: 1, createdAt: 1 }
    );
    res.status(200).send(userDetails);
  } catch (error) {
    errorHandler(error, next);
  }
};

// //

// verify the incoming token //

export const verifyLogintoken = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) throw Error(`token not found in header`, 404);

    const accessToken = authHeader.split(" ")[1] || authHeader.split(" ")[0];
    if (!accessToken) Error("please send token", 404);
    let user = await verify_AccessToken(accessToken);
    if (!user) {
      throw Error("Please Login Again.Invalid Token");
    }
    req.loggedInUser = user;
    next();
  } catch (error) {
    errorHandler(error, next);
  }
};

// //

// generate new access token (by referesh token) //

export const generateAccessToken = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw Error(`token not found in header`, 404);

    const token = authHeader.split(" ")[1] || authHeader.split(" ")[0];

    if (!token) Error("please send token", 404);
    const accessToken = await verify_RefreshToken_generate_AccessToken(token);
    res.status(200).send(accessToken);
  } catch (error) {
    errorHandler(error, next);
  }
};

// //

// check only admin role //

export const check_AdminRole = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.loggedInUser;
    if (user && user.role !== "admin") {
      throw Error(`only admin profile is allowed`, 401);
    } else {
      next();
    }
  } catch (error) {
    errorHandler(error, next);
  }
};

// //

// get all registerd users //

export const get_AllRegisteredUsers = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Get page and limit from query parameters, set defaults if not provided
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string) || 10; // Default to 10 users per page
    const { name, emailId, role } = req.query;
    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // initialize empty query
    let query = {};

    if (name || emailId || role) {
      query = {
        $or: [{ name: name }, { emailId: emailId }, { role: role }],
      };
    }

    const userDetails = await UserRegistration.find(query, {
      name: 1,
      emailId: 1,
      createdAt: 1,
      userId: 1,
    })
      .skip(skip) // Skip the number of records based on the page
      .limit(limit); // Limit the number of records returned

    res.status(200).send(userDetails);
  } catch (error) {
    errorHandler(error, next);
  }
};

// //

// update user details //

export const update_UserDetails = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.headers.userid;
    if (!userId) {
      throw Error(`userId not found in headers`);
    }

    const { error, value } = update_UserRegistration_ValidatorSchema.validate(
      req.body
    );

    if (error) {
      res.status(400).send({ error: error.details[0].message });
      return;
    }

    const { name, emailId, role } = value;

    await update_UserDetails_inDb(value, userId);

    res.status(201).send({
      message: `Successfully updated the user details`,
      userId: userId,
    });
  } catch (error) {
    errorHandler(error, next);
  }
};

// //

// delete user details //

export const delete_UserDetails = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.headers.userid;
    if (!userId) {
      throw Error(`userId not found in headers`);
    }

    await delete_UserDetails_inDb(userId);

    res.status(200).send({
      message: `Successfully deleted user details`,
      userId: userId,
    });
  } catch (error) {
    console.log("here 1234567890");
    errorHandler(error, next);
  }
};

// //

// logger to log each request //

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} - ${req.url} - ${new Date().toISOString()}`);
  next();
};

// //
