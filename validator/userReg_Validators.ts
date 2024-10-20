import Joi from "joi";

export const userRegistration_ValidatorSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .pattern(/^[A-Za-z0-9 ]+$/)
    .message(
      "Invalid characters in name || It should contain at least one alphabet, one number, and one of these special characters: underscore (_) or @ symbol"
    ),
  emailId: Joi.string().email().required(),
  password: Joi.string()
    .trim()
    .required()
    .pattern(/^[a-zA-Z0-9_@#$%^&*()-]+$/)
    .message(
      "Invalid name || It should contain only alphabets, numbers, underscore, and the following special characters: @#$%^&*()-"
    ),
  role: Joi.string().valid("user", "admin"),
});

export const update_UserRegistration_ValidatorSchema = Joi.object({
  name: Joi.string()
    .trim()
    .pattern(/^[A-Za-z0-9 ]+$/)
    .message(
      "Invalid characters in name || It should contain at least one alphabet, one number, and one of these special characters: underscore (_) or @ symbol"
    ),
  emailId: Joi.string().email(),
  role: Joi.string().valid("user", "admin"),
});

export const email_Validator_Schema = Joi.object({
  emailId: Joi.string().email().required(),
});
