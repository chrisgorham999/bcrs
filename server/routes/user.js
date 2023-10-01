/*
======================================
; Title: user.js
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 07 September 2023
; Last Updated: 19 September 2023
; Description: This code supports the User Route
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

"use strict";

// imports and requires
const express = require("express");
const router = express.Router();
const { mongo } = require("../utils/mongo");
const Ajv = require("ajv");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const saltRounds = 10; // number of salt rounds for hashing
const ajv = new Ajv(); //creates a new instance of Ajv class

// userSchema
const userSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
    },
    password: {
      type: "string",
    },
    firstName: {
      type: "string",
    },
    lastName: {
      type: "string",
    },
    address: {
      type: "string",
    },
    phoneNumber: {
      type: "string",
    },
    role: {
      type: "string",
    },
    isDisabled: {
      type: "boolean",
    },
    selectedSecurityQuestions: {
      type: "array",
    },
  },
  required: [
    "email",
    "password",
    "firstName",
    "lastName",
    "phoneNumber",
    "address",
    "isDisabled",
    "role",
  ],
  additionalProperties: false,
};

// updateUserSchema
const updateUserSchema = {
  type: "object",
  properties: {
    firstName: {
      type: "string",
    },
    lastName: {
      type: "string",
    },
    address: {
      type: "string",
    },
    phoneNumber: {
      type: "string",
    },
    role: {
      type: "string",
    },
    isDisabled: {
      type: "boolean",
    },
  },
  required: [
    "firstName",
    "lastName",
    "phoneNumber",
    "address",
    "role",
    "isDisabled",
  ],
  additionalProperties: false,
};

// updateProfileSchema
const updateProfileSchema = {
  type: "object",
  properties: {
    user: {
      type: "object",
      properties: {
        firstName: {
          type: "string",
        },
        lastName: {
          type: "string",
        },
        address: {
          type: "string",
        },
        phoneNumber: {
          type: "string",
        },
      },
      required: ["firstName", "lastName", "phoneNumber", "address"],
      additionalProperties: false,
    },
  },
};

// findAllUsers API
router.get("/", (req, res, next) => {
  try {
    mongo(async (db) => {
      const users = await db
        .collection("users")
        .find(
          { isDisabled: false },
          {
            projection: {
              email: 1,
              firstName: 1,
              lastName: 1,
              role: 1,
              phoneNumber: 1,
              address: 1,
            },
          }
        )
        .sort({ email: 1 })
        .toArray();

      console.log("users", users); // for troubleshooting purposes
      res.send(users);
    }, next);
  } catch (err) {
    console.log("err", err); // for troubleshooting purposes
    next(err);
  }
});


// findUserById API
router.get("/:email", (req, res, next) => {
  try {
    console.log("email", req.params.email);
    let { email } = req.params; //get the email from the req.params object

    // connection to mongo, to find collection of users, then find one empId.
    mongo(
      async (db) => {
        const user = await db.collection("users").findOne(
          { email },
          {
            projection: {
              email: 1,
              firstName: 1,
              lastName: 1,
              role: 1,
              phoneNumber: 1,
              address: 1,
            },
          }
        ); //find user by ID

        //another early return method
        if (!user) {
          // if user does not exist
          const err = new Error("Unable to find users with email ", email);
          err.status = 404;
          console.log("err", err); // for troubleshooting purposes
          next(err);
          return;
        }

        res.send(user);
      },
      // err handling
      next
    );
  } catch (err) {
    console.log("err", err); // for troubleshooting purposes
    next(err);
  }
});


// createUser API
router.post("/", (req, res, next) => {
  try {
    const { user } = req.body; // get the user object from the request body
    console.log("user", user);

    const validator = ajv.compile(userSchema); // compile the schema
    const valid = validator(user); // test the user object against the schema
    if (!valid) {
      const err = new Error("Bad Request");
      err.status = 400;
      err.errors = validator.errors;
      console.log("req.body validation failed", err); // for troubleshooting purposes
      next(err);
      return;
    }

    user.password = bcrypt.hashSync(user.password, saltRounds); // hash the password

    mongo(async (db) => {
      const result = await db.collection("users").insertOne(user); // insert the user object into the employees collection
      console.log("result", result); // for troubleshooting purposes
      res.status(201).json({ id: result.insertedId });
    }, next);
  } catch (err) {
    console.log("err", err); // for troubleshooting purposes
    next(err);
  }
});

// updateUser
router.put("/:email", (req, res, next) => {
  try {
    let { email } = req.params;

    const { user } = req.body;

    const validator = ajv.compile(updateUserSchema);
    const valid = validator(user);
    console.log(user); // for troubleshooting purposes

    if (!valid) {
      const err = new Error("Bad Request");
      err.status = 400;
      err.errors = validator.errors;
      console.log("updatedUserSchema validation failed", err); // for troubleshooting purposes
      next(err);
      return;
    }

    mongo(async (db) => {
      const result = await db.collection("users").updateOne(
        { email },
        {
          $set: {
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            role: user.role,
            isDisabled: user.isDisabled,
          },
        }
      );

      console.log("update user result: ", result); // for troubleshooting purposes

      res.status(204).send();
    });
  } catch (err) {
    console.log("err", err); // for troubleshooting purposes
    next(err);
  }
});

// disableUser
router.delete("/:email", (req, res, next) => {
  try {
    let { email } = req.params;

    mongo(async (db) => {
      const result = await db.collection("users").updateOne(
        { email },
        {
          $set: {
            isDisabled: true,
          },
        }
      );

      if (result.modifiedCount !== 1) {
        const err = new Error("User not found");
        err.status = 404;
        console.log("err", err); // for troubleshooting purposes
        next(err);
        return;
      }

      console.log("update user result: ", result);
      if (result.modifiedCount !== 1) {
        const err = new Error("User not found");
        err.status = 404;
        console.log("err", err); // for troubleshooting purposes
        next(err);
        return;
      }
      res.status(204).send();
    });
  } catch (err) {
    console.log("err", err); // for troubleshooting purposes
    next(err);
  }
});

// findSelectedSecurityQuestions API
router.get("/:email/security-questions", (req, res, next) => {
  try {
    const email = req.params.email; // pulls email value from route
    console.log("Email address:", email); // for troubleshooting purposes

    mongo(async (db) => {
      const user = await db
        .collection("users")
        .findOne(
          { email: email },
          { projection: { email: 1, selectedSecurityQuestions: 1 } }
        );

      console.log("Selected security questions", user);

      if (!user) {
        const err = new Error("Unable to find user with email" + email);
        err.status = 404;
        console.log("err", err); // for troubleshooting purposes
        next(err);
        return;
      }

      res.send(user);
    }, next);
  } catch (err) {
    console.log("err", err); // log for troubleshooting
    next(err);
  }
});

// updateProfile API
router.put("/:email/profile", (req, res, next) => {
  try {
    let { email } = req.params;

    const { user } = req.body;

    const validator = ajv.compile(updateProfileSchema); // validates against the updateProfileSchema
    const valid = validator(user);
    console.log(user); // for troubleshooting purposes

    if (!valid) {
      const err = new Error("Bad Request");
      err.status = 400;
      err.errors = validator.errors;
      console.log("updateProfile validation failed", err); // for troubleshooting purposes
      next(err);
      return;
    }

    mongo(async (db) => {
      const result = await db.collection("users").updateOne(
        { email },
        {
          $set: {
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
          },
        }
      );

      console.log("update user result: ", result); // for troubleshooting purposes

      res.status(204).send();
    });
  } catch (err) {
    console.log("err", err); // for troubleshooting purposes
    next(err);
  }
});

// exporting router module
module.exports = router;
