// // import { Request } from "express";
// import UserRegistration, { IUserRegistration } from "../model/userRegistration";

// declare global {
//   namespace Express {
//     interface Request {
//       loggedInUser?: IUserRegistration;
//     }
//   }
// }

// // In @types/express.d.ts or a similar file
// // import { Request } from "express";

// // declare module "express" {
// //   export interface Request {
// //     loggedInUser?: {
// //       userId: string;
// //       token: string;
// //       // Add any other properties related to loggedInUser if needed
// //     };
// //   }
// // }

// @types/express/index.d.ts
import { Request } from "express";

declare module "express" {
  export interface Request {
    loggedInUser?: {
      userId: string;
      token?: string;
      role: string;
      // Add any other properties you need
    };
  }
}
