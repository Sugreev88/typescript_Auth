import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { subDays } from "date-fns";

import UserRegistration, { IUserRegistration } from "../model/userRegistration";
import ValidationError from "../error/validationError";
import { errorHandler, Error } from "../error/errorHandler";

// jwt secret key //
const jwtSecretKey = process.env.SECRET_JWT as string;

// Define the interface for the token payload
interface TokenPayload {
  userId: string; // Adjust based on what properties are included in your JWT payload
  iat?: number; // Optional property for issued at timestamp
  exp?: number; // Optional property for expiration timestamp
}

// add new user //

export const addNewUser = async function (value: any) {
  try {
    const { name, emailId, password, role } = value;
    const userId = uuidv4();

    //--create tokens and hash the password--//
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    //--//

    //- add the new user details -//
    const user = await UserRegistration.create({
      name,
      emailId,
      role,
      password: hashedPassword,
      userId,
    });
    //--//

    return { userId };
  } catch (err) {
    throw err;
  }
};

// //

// generate new access token ( by referesh token )  //

export const verify_RefreshToken_generate_AccessToken = async function (
  refreshToken: string
) {
  try {
    const tokenDetails = (await jwt.verify(
      refreshToken,
      jwtSecretKey
    )) as TokenPayload;

    // Find the user by userId from the token details
    const userDetails = await UserRegistration.findOne({
      userId: tokenDetails.userId,
    });

    // Check if userDetails exists and if the refreshToken matches
    if (!userDetails || userDetails.refreshToken !== refreshToken) {
      throw new ValidationError(
        `UserDetails not found for the refreshToken: ${refreshToken}`
      );
    }

    const userId = tokenDetails.userId;

    // Generate a new access token
    const accessToken = jwt.sign({ userId }, jwtSecretKey, {
      expiresIn: "10h",
    });

    // Update the user's access token
    userDetails.accessToken = accessToken;
    await userDetails.save();

    return { accessToken };
  } catch (error: any) {
    // Handle token verification errors and other potential errors
    throw Error(error.message);
  }
};

// //

// verify the incoming name and password //

export const verifyLogin_Credentials = async function (
  emailId: string,
  password: string
) {
  const userDetails = await UserRegistration.findOne({ emailId: emailId });
  if (!userDetails)
    throw Error(`emailId:${emailId} does not exists please signup`);

  const checkPassword = await bcrypt.compare(password, userDetails.password);
  if (!checkPassword) Error(`Invalid password:${password}`);

  //--create tokens and save token--//
  const userId = userDetails.userId;
  const accessToken = jwt.sign({ userId }, jwtSecretKey, { expiresIn: "10h" });
  const refreshToken = jwt.sign({ userId }, jwtSecretKey, { expiresIn: "30d" });

  userDetails.accessToken = accessToken;
  userDetails.refreshToken = refreshToken;
  await userDetails.save();
  //--//
  return { accessToken, refreshToken };
};

// //

// verify the incoming token (logged in user token) with saved token //

export const verify_AccessToken = async function (accessToken: string) {
  const tokenDetails = (await jwt.verify(
    accessToken,
    jwtSecretKey
  )) as TokenPayload;

  let userDetails = await UserRegistration.findOne({
    userId: tokenDetails.userId,
  });

  const user = userDetails;
  return user;
};

// //

// update user details in db //

export const update_UserDetails_inDb = async function (
  value: any,
  userId: any
) {
  try {
    const { name, emailId, role } = value;

    //- update user details -//
    const userDetails = await UserRegistration.updateOne(
      {
        userId: userId,
      },
      {
        $set: {
          name,
          emailId,
          role,
        },
      }
    );
    //--//

    if (userDetails.matchedCount === 0) {
      throw Error(`invalid userId:${userId}`);
    } else {
      return;
    }
  } catch (err) {
    throw err;
  }
};

// //

// update user details in db //

export const delete_UserDetails_inDb = async function (userId: any) {
  try {
    //- update user details -//
    const userDetails = await UserRegistration.deleteOne({
      userId: userId,
    });
    //--//

    if (userDetails.deletedCount === 0) {
      throw Error(`invalid userId:${userId}`);
    } else {
      return;
    }
  } catch (err) {
    throw err;
  }
};

// //

// user registered in the last 7 days //

export const fetchRecentUsers = async () => {
  const sevenDaysAgo = subDays(new Date(), 7);

  try {
    const recentUsers = await UserRegistration.find({
      createdAt: { $gte: sevenDaysAgo }, // Query for users created after or on the sevenDaysAgo date
    });

    if (recentUsers.length > 0) {
      console.log("Users registered within the last 7 days:");
      recentUsers.forEach((user) => {
        console.log(
          `Name: ${user.name}, Email: ${user.emailId}, Registered At: ${user.createdAt}`
        );
      });
    }
  } catch (error) {
    console.error("Error fetching recent users:", error);
  }
};

// //
