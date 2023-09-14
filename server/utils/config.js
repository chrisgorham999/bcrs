/*
======================================
; Title: config.js
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 07 September 2023
; Last Updated: 14 September 2023
; Description: This code supports variables for connecting to the Mongo database
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

"use strict";

const {
  DB_USERNAME = "bcrs_user",
  DB_PASSWORD = "s3cret",
  DB_NAME = "bcrsDB",
} = process.env;

const CONFIG = {
  DB_URL: `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@bellevueuniversity.up6klva.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
  DB_NAME: DB_NAME,
};

module.exports = CONFIG;
