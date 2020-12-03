const express = require('express');
const employeeRouter = express.Router({mergeParams: true});
const timesheetRouter = require('./timesheet.js');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Params

// timesheetRouter

employeeRouter.use('/:employeeId/timesheets', timesheetRouter);

//==================================
// '/employees' ('/') path
//==================================

// GET Route

// POST Route

//===================================
// '/employees/:employeeId' ('/:employeeId') path
//===================================

// GET Route

// PUT Route

// DELETE Route


module.exports = employeeRouter;