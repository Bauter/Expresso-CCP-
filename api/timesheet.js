const express = require('express');
const timesheetRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


/* Params
'''''''''*/

timesheetRouter.params('timesheetId', (req, res, next, timesheetId) => {
    const sql = `SELECT * FROM Timesheet WHERE Timesheet.id = $timesheetId`;
    const values = {
        $timesheetId: timesheetId
    };

    db.get(sql, values, (error, timesheet) => {
        if(error) {
            next(error);
        } else if (timesheet) {
            next();
        } else {
            res.sendStatus(404);
        };
    });
});


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