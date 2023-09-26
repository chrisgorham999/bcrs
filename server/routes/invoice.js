const express = require("express");
const router = express.Router();
const { mongo } = require("../utils/mongo");
const Ajv = require("ajv");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const ret = require("bluebird/js/release/util");

const ajv = new Ajv(); //creates a new instance of Ajv class

const lineItemSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: {
        type: "string",
      },
      price: {
        type: "number",
      },
    },
    required: ["name", "price"],
    additionalProperties: false,
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
  required: [
    "email",
    "fullName",
    "partsAmount",
    "laborAmount",
    "lineItemTotal",
    "invoiceTotal",
    "orderDate",
    "lineItems",
  ],
  additionalProperties: false,
};

// createInvoice
router.post("/", async (req, res, next) => {
  try {
    const { invoice } = req.body;
    console.log("invoice", invoice);

    const validator = ajv.compile(invoiceSchema);
    const valid = validator(invoice);

    if (!valid) {
      const err = new Error("Bad Request");
      err.status = 400;
      err.errors = validator.errors;
      console.log("req.body validation failed", err);
      next(err);
      return;
    }
    mongo(async (db) => {
      const result = await db.collection("invoices").insertOne(invoice);
      console.log("result", result);
      res.status(200).json({ id: result.insertedId });
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

//findPurchasesByService

// exporting router module
module.exports = router;
