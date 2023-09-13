/**
 * Title: mongo.js
 * Author: Shane Hingtgen
 * Date: 9/12/23
 */

"use strict";
const { MongoClient } = require("mongodb");

// production example, we would replace the mongo url with the one from the config file
// const CONFIG  = require("./config");
// const MONGO_URL = CONFIG.DB_URL;

const MONGO_URL =
  "mongodb+srv://bcrs_user:s3cret@bellevueuniversity.up6klva.mongodb.net/bcrsDB?retryWrites=true&w=majority";

const mongo = async (operations, next) => {
  try {
    console.log("Connecting to MongoDB Atlas...", MONGO_URL);

    //connect to mongodb cluster
    const client = await MongoClient.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // select the db
    const db = client.db("bcrsDB"); //if production change to CONFIG.DB_NAME
    console.log("Connected to MongoDB Atlas", db);

    // execute the operations
    await operations(db);
    console.log("Operation was successful");

    // close the connection
    client.close();
    console.log("Closing connection to MongoDB Atlas...");
  } catch (err) {
    // this is called ErrBack, node.js term for handling errors in a node.js environment
    const error = new Error("Error connecting to db", err);
    error.status = 500;

    console.log("Error connecting to db", err);

    next(error);
  }
};

module.exports = { mongo };
