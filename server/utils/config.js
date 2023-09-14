/*
======================================
; Title: config.js
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 07 September 2023
; Last Updated: 14 September 2023
; Description: This code supports connecting to the server
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
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
