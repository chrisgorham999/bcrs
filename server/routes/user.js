/*
======================================
; Title: user.js
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 12 September 2023
; Last Updated: 14 September 2023
; Description: This code supports the User Route
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

"use strict";

// imports
const express = require("express");
const router = express.Router();
const { mongo } = require("../utils/mongo");
const Ajv = require("ajv");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const ret = require("bluebird/js/release/util");

const saltRounds = 10; // number of salt rounds for hashing

const ajv = new Ajv(); //creates a new instance of Ajv class

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
    phoneNumber: {
      type: "string",
    },
    address: {
      type: "string",
    },
    isDisabled: {
      type: "boolean",
    },
    role: {
      type: "string",
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
    "selectedSecurityQuestions",
  ],
  additionalProperties: false,
};

/*const updateUserSchema = {
    type: "object",
    properties: {
      firstName: {
        type: "string",
      },
      lastName: {
        type: "string",
      },
      role: {
        type: "string",
      },
    },
    required: ["firstName", "lastName", "role"],
    additionalProperties: false,
  };*/

/**
 * findAllUsers
 * * @openapi
 * /api/users
 *   get:
 *     tags:
 *       - Users
 *     description:  API for returning an user document
 *     summary: returns all user documents
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         description: user document email
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: user document found
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Not found
 *       '500':
 *         description: Server Error
 */

router.get("/", (req, res, next) => {
  try {
    mongo(async (db) => {
      const users = await db
        .collection("users")
        .find(
          {},
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

      console.log("users", users);
      res.send(users);
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

/**
 * findUserById
 * @openapi
 * /api/users/{email}:
 *   get:
 *     tags:
 *       - Users
 *     description:  API for returning an user document
 *     summary: returns an user document
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         description: user document email
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User document found
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Not found
 *       '500':
 *         description: Server Error
 */

router.get("/:email", (req, res, next) => {
  try {
    let { email } = req.params; //get the empId from the req.params object
    // email = parseInt(email, 10); // try to determine if email is numerical value

    //an early return method
    // if (isNaN(email)) {
    //   // if empId is not a number
    //   const err = new Error("input must be a number");
    //   err.status = 400;
    //   console.log("err", err);
    //   next(err);
    //   return;
    // }

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
          // if empId does not exist
          const err = new Error("Unable to find users with email ", email);
          err.status = 404;
          console.log("err", err);
          next(err);
          return;
        }

        res.send(user);
      },
      // err handling
      next
    );
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

/**
 * createUser
 *  * @openapi
 * /api/:
 *   post:
 *     tags:
 *       - Users
 *     description:  API for creating an user document
 *     summary: creates an user document
 *     parameters:
 *       - name: ----------TODO
 *         in: path
 *         required: true
 *         description: user document id
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: User document found
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Not found
 *       '500':
 *         description: Server Error
 */

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
      console.log("req.body validation failed", err);
      next(err);
      return;
    }

    user.password = bcrypt.hashSync(user.password, saltRounds); // hash the password

    mongo(async (db) => {
      const result = await db.collection("users").insertOne(user); // insert the user object into the employees collection
      console.log("result", result);
      res.json({ id: result.insertedId });
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

// exporting router module
module.exports = router;
