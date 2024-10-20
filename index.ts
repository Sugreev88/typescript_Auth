import express from "express";
import body from "body-parser";

import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//-connect db-//
import { connectDb } from "./utils/dbUtils";
connectDb();
//--//

//-log all requests-//
import { logger } from "./controller/authController";
app.use(logger);
//--//

//--fetch all the last 7 days registerd users--//
import { fetchRecentUsers } from "./service/authService";
fetchRecentUsers();
//--//

//--Middleware to parse JSON requests--//
app.use(express.json());

app.use(
  body.json({
    limit: "500kb",
  })
);
//--//

//-call routes-//
import authRoute from "./route/authRoute";
app.use("/", authRoute);
//--//

//-global error handler-//
const error = async function (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.status) {
    // console.log(err);
    res.status(err.status).send({ Error: err.message });
  } else {
    // console.log(err);
    res.status(500).send({ Error: err.message });
  }
};

app.use(error);
//--//

// Sample route for testing
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
