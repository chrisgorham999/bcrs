/*
======================================
; Title: mongo.js
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 07 September 2023
; Last Updated: 14 September 2023
; Description: This code supports connecting to the server and server functions
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

'use strict'

const { MongoClient } = require('mongodb')
const config = require('./config')

const MONGO_URL = config.DB_URL

const mongo = async(operations, next) => {
  try {
    console.log('Connecting to MongoDB Atlas...')

    console.log('MONGO_URL', MONGO_URL)
    console.log('DB_NAME', config.DB_NAME)

    // Connect to MongoDB cluster
    const client = await MongoClient.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    // select the database
    const db = client.db(config.DB_NAME)
    console.log('Connected to MongoDB Atlas')

    // Execute the operations
    await operations(db)
    console.log('Operation was successful')

    // Close the connection
    client.close()
    console.log('Closing connection to MongoDB Atlas...')
  } catch (err) {
    const error = new Error('Error connecting to db', err)
    error.status = 500
    console.log('Error connecting to db', err)
    next(error)
  }
}

module.exports = { mongo }
