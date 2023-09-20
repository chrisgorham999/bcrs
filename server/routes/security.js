/*
======================================
; Title: security.js
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 14 September 2023
; Last Updated: 18 September 2023
; Description: This code supports the Security Route for Sign In
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

"use strict";

// imports and requires

// imports / requires
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

// const securityQuestionsSchema = {
//   type: 'array',
//   items: {
//     type: 'object',
//     properties: {
//       question: { type: 'string' },
//       answer: { type: 'string' }
//     },
//     required: ['question', 'answer'],
//     additionalProperties: false
//   }
// }

const securityQuestionsSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      question1: { type: "string" },
      answer1: { type: "string" },
      question2: { type: "string" },
      answer2: { type: "string" },
      question3: { type: "string" },
      answer3: { type: "string" },
    },
    required: [
      "question1",
      "answer1",
      "question2",
      "answer2",
      "question3",
      "answer3",
    ],
    additionalProperties: false,
  },
};

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
    isDisabled: { type: "boolean" }, // if there's an error check here first
    selectedSecurityQuestions: securityQuestionsSchema,
  },
  required: [
    "email",
    "password",
    "firstName",
    "lastName",
    "role",
    "isDisabled",
    "selectedSecurityQuestions",
  ],
};

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
    console.log("Sign in object:", signin);

    const validator = ajv.compile(signinSchema);
    const valid = validator(signin);

    if (!valid) {
      const err = new Error("Bad Request");
      err.status = 400;
      err.errors = validator.errors;
      console.log("signin validation errors:", validator.errors);
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
        );
        next(err);
        return;
      }

      let passwordIsValid = bcrypt.compareSync(signin.password, user.password);

      if (!passwordIsValid) {
        const err = new Error("Unauthorized");
        err.status = 401;
        err.message = "Unauthorized: The email or password is invalid.";
        console.log("Unauthorized: The email or password is invalid.", err);
        next(err);
        return;
      }

      res.send(user);
    }, next);
  } catch (err) {
    console.log("err");
    next(err);
  }
});

// registerUser API
router.post("/register", (req, res, next) => {
  try {
    const { user } = req.body;
    console.log("User:", user);
    const validate = ajv.compile(registerSchema);
    const valid = validate(user);

    if (!valid) {
      const err = new Error("Bad Request");
      err.status = 400;
      err.errors = validate.errors;
      console.log("user validation errors", validate.errors);
      next(err);
      return;
    }

    user.password = bcrypt.hashSync(user.password, saltRounds);

    mongo(async (db) => {
      const users = await db
        .collection("users")
        .find()
        .sort({ email: 1 }) // sort by emails
        .toArray();

      console.log("User List:", users);

      const userExists = users.find((usr) => usr.email === user.email);

      if (userExists) {
        const err = new Error("Bad Request");
        err.status = 400;
        err.message = "User for that email already exists";
        console.log("User already exists", err);
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
        role: user.role,
        isDisabled: "false",
        selectedSecurityQuestions: user.selectedSecurityQuestions,
      };
      console.log("User to be inserted into MongoDB:", newUser);

      const result = await db.collection("users").insertOne(newUser);

      console.log("MongoDB Result:", result);
      res.send({ id: result.insertedId });
    }, next);

  } catch (err) {
    console.log("err", err);
  }
});

// verifyUser API
router.post("/verify/users/:email", (req, res, next) => {
  try {
    const email = req.params.email;
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

      console.log("selected user", user);
      res.send(user);
    }, next);
  } catch (err) {
    console.error("err", err);
    next(err);
  }
});

// verifySecurityQuestions API
router.post("/verify/users/:email/security-questions", (req, res, next) => {
  try {
    const email = req.params.email;
    const { securityQuestions } = req.body;
    console.log(`Email: ${email}\nSecurity Questions: ${securityQuestions}`);
    const validate = ajv.compile(securityQuestionsSchema);
    const valid = validate(securityQuestions);

    if (!valid) {
      const err = new Error("Bad Reqeust");
      err.status = 400;
      err.errors = validate.errors;
      console.log("securityQuestions validation errors", validate.errors);
      next(err);
      return;
    }

    mongo(async (db) => {
      const user = await db.collection("users").findOne({ email: email });

      if (!user) {
        const err = new Error("Not Found");
        err.status = 404;
        console.log("Employee not found", err);
        next(err);
        return;
      }

      console.log("Selected User", user);
      if (
        securityQuestions[0].answer !==
          user.selectedSecurityQuestions[0].answer ||
        securityQuestions[1].answer !== user.selectedSecurityQuestions[1] ||
        securityQuestions[3].answer !== user.selectedSecurityQuestions[3].answer
      ) {
        const err = new Error("Unauthorized");
        err.status = 401;
        err.message = "Unauthorized: Security Questions do not match";
        console.log("Unauthorized: security questions do not match", err);
        next(err);
        return;
      }

      res.send(user);
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

// resetPassword API
router.delete("/users/:email/reset-password", (req, res, next) => {
  try {
    const email = req.params.email;
    const user = req.body;
    console.log("User email", email);
    const validate = ajv.compile(resetPasswordSchema);
    const valid = validate(user);

    if (!valid) {
      const err = new Error("Bad Request");
      err.status = 400;
      err.errors = validate.errors;
      console.log("password validation errors", validate.errors);
      next(err);
      return;
    }

    mongo(async (db) => {
      const user = await db.collection("users").findOne({ email: email });

      if (!user) {
        const err = new Error("Not Found");
        err.status = 404;
        console.log("User not found", err);
        next(err);
        return;
      }
      console.log("Selected User", user);
      const hashedPassword = bcrypt(user.password, saltRounds);
      const result = await db.collection("users").updateOne(
        { email: email },
        {
          $set: { password: hashedPassword },
        }
      );

      console.log("MongoDB update result", result);
      res.status(204).send();
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

// export the router
module.exports = router;
