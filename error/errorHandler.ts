// const { default: mongoose } = require("mongoose");
import mongoose from "mongoose";
import ValidationError from "../error/validationError";
import { NextFunction } from "express";

export const errorHandler = async function (error: any, next: NextFunction) {
  if (error instanceof mongoose.Error.ValidationError) {
    next(new ValidationError(error.message));
  } else if (error.code == 11000) {
    next(new ValidationError(error.message));
  }
  next(error);
};

export const Error = function (error: any, status: number = 400) {
  const errorStatus = status;
  throw new ValidationError(error, errorStatus);
};
