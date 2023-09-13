/**
 * Title: app.js
 * Author: Shane Hingtgen
 * Date: 9/12/2023
 */

//this is only a production example
"use strict";

const {
  DB_USERNAME = "bcrs_user",
  DB_PASSWORD = "s3cret",
  DB_NAME = "nodebucket",
} = process.env;

const CONFIG = {
  DB_URL: `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@bellevueuniversity.up6klva.mongodb.net/?retryWrites=true&w=majority`,
  DB_NAME: DB_NAME,
};

module.exports = CONFIG;
