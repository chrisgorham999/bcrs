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
    invoiceNumber: {
      type: "string"
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
router.get("/graph", async (req, res, next) => {
  try {
    console.log("findAllServices API");

    mongo(async (db) => {
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
        .collection("invoices")
        .aggregate(aggregationPipeline)
        .toArray();

      res.status(200).json(result);
    }, next);
  } catch (err) {
    console.error("err:", err);
    next(err);
  }
});

/**
 * getAllInvoices
 * * @openapi
 * /api/invoices
 *   get:
 *     tags:
 *       - Invoices
 *     description:  API for returning an invoice document
 *     summary: returns all invoice documents
 *     parameters:
 *       - name: email (FIX)
 *         in: path
 *         required: true
 *         description: ????
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Invoice document found
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
      const invoices = await db
        .collection("invoices")
        .find(
          {},
          {
            projection: {
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

// getInvoiceByInvoiceNumber
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
            projection: {
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
    console.log("err", err);
    next(err);
  }
});

// exporting router module
module.exports = router;
