/*
======================================
; Title: invoice.js
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 25 September 2023
; Last Updated: 25 September 2023
; Description: This code supports the Invoice Route
; Sources Used: N/A
;=====================================
*/

const express = require("express");
const router = express.Router();
const { mongo } = require("../utils/mongo");
const Ajv = require("ajv");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const ret = require("bluebird/js/release/util");

const lineItemSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    price: {
      type: "number",
    },
  },
};

const invoiceSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
    },
    fullName: {
      type: "string",
    },
    partsAmount: {
      type: "number",
    },
    laborAmount: {
      type: "number",
    },
    lineItemTotal: {
      type: "number",
    },
    invoiceTotal: {
      type: "number",
    },
    orderDate: {
      type: "string",
    },
    lineItems: lineItemSchema,
  },
};
