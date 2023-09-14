/*
======================================
; Title: mongo.js
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 07 September 2023
; Last Updated: 14 September 2023
; Description: This code supports connecting to the Mongo database and server functions
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

'use strict'

const { MongoClient } = require('mongodb')
const config = require('./config')

const MONGO_URL = config.DB_URL

const mongo = async(operations, next) => {
  try {
    console.log('Connecting to MongoDB Atlas...') // for troubleshooting purposes
    console.log('MONGO_URL', MONGO_URL) // for troubleshooting purposes
    console.log('DB_NAME', config.DB_NAME) // for troubleshooting purposes

    // Connect to MongoDB cluster
    const client = await MongoClient.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    // select the database
    const db = client.db(config.DB_NAME)
    console.log('Connected to MongoDB Atlas') // for troubleshooting purposes

    // Execute the operations
    await operations(db)
    console.log('Operation was successful')

    // Close the connection
    client.close()
    console.log('Closing connection to MongoDB Atlas...')
    // catch block for error handling
  } catch (err) {
    const error = new Error('Error connecting to db', err)
    error.status = 500
    console.log('Error connecting to db', err)
    next(error)
  }
}

// exports
module.exports = { mongo }
