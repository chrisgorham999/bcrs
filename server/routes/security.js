/*
======================================
; Title: security.js
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 14 September 2023
; Last Updated: 20 September 2023
; Description: This code supports the Security Route for Sign In
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

"use strict";

// imports and requires
const express = require("express");
const { mongo } = require("../utils/mongo");
const bcrypt = require("bcryptjs");
const Ajv = require("ajv");

const router = express.Router();
const ajv = new Ajv();
const saltRounds = 10;

// the signIn schema
const signinSchema = {
  type: "object",
  properties: {
    email: { type: "string" },
    password: { type: "string" },
  },
  required: ["email", "password"],
  additionalProperties: false,
};

// security questions schema
const securityQuestionsSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      question: { type: "string" },
      answer: { type: "string" },
    },
    required: ["question", "answer"],
    additionalProperties: false,
  },
  minItems: 3, // Minimum number of items (security questions and answers)
  maxItems: 3, // Maximum number of items (security questions and answers)
};


// register schema for registering a new user
const registerSchema = {
  type: "object",
  properties: {
    email: { type: "string" },
    password: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    address: { type: "string" },
    phoneNumber: { type: "string" },
    role: { type: "string" },
    isDisabled: { type: "boolean" },
    selectedSecurityQuestions: securityQuestionsSchema,
  },
  required: [
    "email",
    "password",
    "firstName",
    "lastName",
    "address",
    "phoneNumber",
    "role",
    "isDisabled",
    "selectedSecurityQuestions",
  ],
};

// resetPassword schema
const resetPasswordSchema = {
  type: "object",
  properties: {
    password: { type: "string" },
  },
  required: ["password"],
  additionalProperties: false,
};

// signIn API
router.post("/signin", (req, res, next) => {
  try {
    const signin = req.body;
    console.log("Sign in object:", signin); // for troubleshooting purposes

    const validator = ajv.compile(signinSchema); // validates against the signinSchema
    const valid = validator(signin);

    if (!valid) {
      const err = new Error("Bad Request");
      err.status = 400;
      err.errors = validator.errors;
      console.log("signin validation errors:", validator.errors); // for troubleshooting purposes
      next(err);
      return;
    }

    mongo(async (db) => {
      const user = await db
        .collection("users")
        .findOne({ email: signin.email });

      if (!user) {
        const err = new Error("Unauthorized");
        err.status = 401;
        err.message = "Unauthorized: The email or password is invalid.";
        console.log(
          "Unauthorized: The email or password is invalid.",
          signin.email
        ); // for troubleshooting purposes
        next(err);
        return;
      }

      let passwordIsValid = bcrypt.compareSync(signin.password, user.password); // salts the password

      if (!passwordIsValid) {
        const err = new Error("Unauthorized");
        err.status = 401;
        err.message = "Unauthorized: The email or password is invalid.";
        console.log("Unauthorized: The email or password is invalid.", err); // for troubleshooting purposes
        next(err);
        return;
      }

      res.send(user);
    }, next);
  } catch (err) {
    console.log("err"); // for troubleshooting purposes
    next(err);
  }
});

// registerUser API
router.post("/register", (req, res, next) => {
  try {
    const { user } = req.body;
    console.log("User:", user); // for troubleshooting purposes
    const validate = ajv.compile(registerSchema); // validate against the registerSchema
    const valid = validate(user);

    if (!valid) {
      const err = new Error("Bad Request");
      err.status = 400;
      err.errors = validate.errors;
      console.log("user validation errors", validate.errors); // for troubleshooting purposes
      next(err);
      return;
    }

    user.password = bcrypt.hashSync(user.password, saltRounds); // salt password

    mongo(async (db) => {
      const users = await db
        .collection("users")
        .find()
        .sort({ email: 1 }) // sort by emails
        .toArray();

      console.log("User List:", users); // for troubleshooting purposes

      const userExists = users.find((usr) => usr.email === user.email);

      if (userExists) {
        const err = new Error("Bad Request");
        err.status = 400;
        err.message = "User for that email already exists";
        console.log("User already exists", err); // for troubleshooting purposes
        next(err);
        return;
      }

      // get the info for the new user
      const newUser = {
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        phoneNumber: user.phoneNumber,
        role: "standard",
        isDisabled: false,
        selectedSecurityQuestions: user.selectedSecurityQuestions,
      };
      console.log("User to be inserted into MongoDB:", newUser); // for troubleshooting purposes

      const result = await db.collection("users").insertOne(newUser);

      console.log("MongoDB Result:", result); // for troubleshooting purposes
      res.send({ id: result.insertedId });
    }, next);
  } catch (err) {
    console.log("err", err); // for troubleshooting purposes
  }
});

// verifyUser API
router.post("/verify/users/:email", (req, res, next) => {
  try {
    const email = req.params.email; // pull the email needed
    console.log("User email:", email); // for troubleshooting purposes

    mongo(async (db) => {
      const user = await db.collection("users").findOne({ email: email });

      if (!user) {
        const err = new Error("Not Found");
        err.status = 404;
        console.log("User not found", err); // for troubleshooting purposes
        next(err);
        return;
      }

      console.log("selected user", user); // for troubleshooting purposes
      res.send(user);
    }, next);
  } catch (err) {
    console.error("err", err); // for troubleshooting purposes
    next(err);
  }
});

// verifySecurityQuestions API
router.post("/verify/users/:email/security-questions", (req, res, next) => {
  try {
    const email = req.params.email; // pull the email
    const { securityQuestions } = req.body;
    console.log(`Email: ${email}\nSecurity Questions: ${securityQuestions}`); // for troubleshooting purposes
    const validate = ajv.compile(securityQuestionsSchema);
    const valid = validate(securityQuestions);

    if (!valid) {
      const err = new Error("Bad Request");
      err.status = 400;
      err.errors = validate.errors;
      console.log("securityQuestions validation errors", validate.errors); // for troubleshooting purposes
      next(err);
      return;
    }

    mongo(async (db) => {
      const user = await db.collection("users").findOne({ email: email });

      if (!user) {
        const err = new Error("Not Found");
        err.status = 404;
        console.log("User not found", err); // for troubleshooting purposes
        next(err);
        return;
      }

      console.log("Selected Email", user); // for troubleshooting purposes

      const userSecurityQuestions = user.selectedSecurityQuestions;

      // if answers match then send the new password, otherwise throw an error
      if (
        securityQuestions[0].answer !== userSecurityQuestions[0].answer ||
        securityQuestions[1].answer !== userSecurityQuestions[1].answer ||
        securityQuestions[2].answer !== userSecurityQuestions[2].answer
      ) {
        const err = new Error("Unauthorized");
        err.status = 401;
        err.message = "Unauthorized: Security Questions do not match";
        console.log("Unauthorized: security questions do not match", err); // for troubleshooting purposes
        next(err);
        return;
      }

      res.send(user);
    }, next);
  } catch (err) {
    console.log("err", err); // for troubleshooting purposes
    next(err);
  }
});

// resetPassword API
router.post("/users/:email/reset-password", (req, res, next) => {
  try {
    const email = req.params.email; // pulls the email needed
    const user = req.body;
    console.log("User email", email); // for troubleshooting purposes
    const validate = ajv.compile(resetPasswordSchema);
    const valid = validate(user);

    if (!valid) {
      const err = new Error("Bad Request");
      err.status = 400;
      err.errors = validate.errors;
      console.log("password validation errors", validate.errors); // for troubleshooting purposes
      next(err);
      return;
    }

    const hashedPassword = bcrypt.hashSync(user.password, saltRounds); // salt the password

    mongo(async (db) => {
      const user = await db.collection("users").findOne({ email: email });

      if (!user) {
        const err = new Error("Not Found");
        err.status = 404;
        console.log("User not found", err); // for troubleshooting purposes
        next(err);
        return;
      }
      console.log("Selected User", user); // for troubleshooting purposes

      const result = await db.collection("users").updateOne(
        { email: email },
        {
          $set: { password: hashedPassword },
        }
      );

      console.log("MongoDB update result", result); // for troubleshooting purposes
      res.status(204).send();
    }, next);
  } catch (err) {
    console.log("err", err); // for troubleshooting purposes
    next(err);
  }
});

// export the router
module.exports = router;
