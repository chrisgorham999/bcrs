/*
======================================
; Title: invoice.js
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 25 September 2023
; Last Updated: 29 September 2023
; Description: This code supports the Invoice Route
; Sources Used: N/A
;=====================================
*/

// imports
const express = require("express");
const router = express.Router();
const { mongo } = require("../utils/mongo");
const Ajv = require("ajv");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const ret = require("bluebird/js/release/util");
const ajv = new Ajv(); //creates a new instance of Ajv class

// line item schema
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

// invoice schema
const invoiceSchema = {
  type: "object",
  properties: {
    invoiceNumber: {
      type: "string",
    },
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
    "invoiceNumber",
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

// createInvoice API
router.post("/", async (req, res, next) => {
  try {
    const { invoice } = req.body;
    console.log("invoice", invoice);

    const validator = ajv.compile(invoiceSchema); // validate against the invoiceSchema
    const valid = validator(invoice);

    if (!valid) {
      const err = new Error("Bad Request"); // if its not valid, throw an error
      err.status = 400;
      err.errors = validator.errors;
      console.log("req.body validation failed", err); // for troubleshooting purposes
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

//findPurchasesByService API
router.get("/graph", async (req, res, next) => {
  try {
    console.log("findAllServices API");

    mongo(async (db) => {
      // chart query
      const aggregationPipeline = [
        { $unwind: "$lineItems" },
        {
          $group: {
            _id: {
              title: "$lineItems.title",
              price: "$lineItems.price",
              name: "$lineItems.name",
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.title": 1 } },
      ];

      const result = await db
        .collection("invoices") // pull from the invoices collection
        .aggregate(aggregationPipeline)
        .toArray();

      res.status(200).json(result);
    }, next);
  } catch (err) {
    console.error("err:", err); // for troubleshooting purposes
    next(err);
  }
});


// getAllInvoices API
router.get("/", (req, res, next) => {
  try {
    mongo(async (db) => {
      const invoices = await db
        .collection("invoices")
        .find(
          {},
          {
            projection: { // sets the info that will be pulled
              invoiceNumber: 1,
              email: 1,
              fullName: 1,
              partsAmount: 1,
              laborAmount: 1,
              lineItemTotal: 1,
              invoiceTotal: 1,
              orderDate: 1,
              lineItems: 1,
            },
          }
        )
        .sort({ orderDate: -1 })
        .toArray();

      console.log("invoices", invoices);
      res.send(invoices);
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

// getInvoiceByInvoiceNumber API
router.get("/:invoiceNumber", (req, res, next) => {
  try {
    console.log("invoiceNumber", req.params.invoiceNumber);
    let { invoiceNumber } = req.params; //get the invoiceNumber from the req.params object

    // connection to mongo, to find collection of users, then find one empId.
    mongo(
      async (db) => {
        const invoice = await db.collection("invoices").findOne(
          { invoiceNumber },
          {
            projection: { // sets the info that will be pulled
              email: 1,
              fullName: 1,
              partsAmount: 1,
              laborAmount: 1,
              lineItemTotal: 1,
              invoiceTotal: 1,
              orderDate: 1,
              lineItems: 1,
            },
          }
        ); //find invoice by invoiceNumber

        //another early return method
        if (!invoice) {
          // if user does not exist
          const err = new Error("Unable to find invoice with id ", _id);
          err.status = 404;
          console.log("err", err);
          next(err);
          return;
        }

        res.send(invoice);
      },
      // err handling
      next
    );
  } catch (err) {
    console.log("err", err); // for troubleshooting purposes
    next(err);
  }
});

// exporting router module
module.exports = router;
