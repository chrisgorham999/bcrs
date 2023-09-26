/*
======================================
; Title: app.js
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 07 September 2023
; Last Updated: 25 September 2023
; Description: This code supports the server, imports, and routing
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

"use strict";

// Require statements
const express = require("express");
const createServer = require("http-errors");
const path = require("path");
const userRoute = require("./routes/user");
const securityRoute = require("./routes/security");
const invoiceRoute = require("./routes/invoice");

// swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../user.json", "../security.json", "../invoice.json");

// https://levelup.gitconnected.com/how-to-add-swagger-ui-to-existing-node-js-and-express-js-project-2c8bad9364ce
// Link provided by Erin Brady with assistance from Chris Gorham

// Create the Express app
const app = express();

// Configure the app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../dist/bcrs")));
app.use("/", express.static(path.join(__dirname, "../dist/bcrs")));

// our routes from our routes folder
app.use("/api/users", userRoute);
app.use("/api/security", securityRoute);
app.use("/api/invoices", invoiceRoute);

// more swagger: openapi specification
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nodebucket RESTful APIs",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"], //files containing annotations for the OpenAPI Specification
};

// more swagger: wire openapiSpecification to app variable
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Do we need this code????
// app.use("/api", userRoute);

// error handler for 404 errors
app.use(function (req, res, next) {
  next(createServer(404)); // forward to error handler
});

// error handler for all other errors
app.use(function (err, req, res, next) {
  res.status(err.status || 500); // set response status code

  // send response to client in JSON format with a message and stack trace
  res.json({
    type: "error",
    status: err.status,
    message: err.message,
    stack: req.app.get("env") === "development" ? err.stack : undefined,
  });
});

module.exports = app; // export the Express application
