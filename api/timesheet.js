const express = require('express');
const timesheetRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//===================================
// '/timesheets' ('/') path
//===================================

// GET

// POST

//===================================
// /timesheets/:timesheetId' ('/:timesheetId') *May need to be in timesheet.js?*
//===================================

// PUT

// DELETE



module.exports = timesheetRouter;