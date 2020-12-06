const express = require('express');
const timesheetRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


/* Params
'''''''''*/

timesheetRouter.param('timesheetId', (req, res, next, timesheetId) => {
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


/* GET Route
''''''''''''*/

timesheetRouter.get('/', (req, res, next) => {

    const sql = `SELECT * FROM Timesheet WHERE Timesheet.employee_id = $employeeId`;
    const values = {
        $employeeId: req.params.employeeId
    };

    db.run(sql, values, (error, timesheets) => {
        if (error) {
            next(error);
        } else if (!timesheets) {
            timesheets = [];
            res.status(200).json({timesheets: timesheets});    
        } else {
             res.status(200).json({timesheets: timesheets});
        };
    });
});


/* POST Route
'''''''''''''*/

timesheetRouter.post('/', (req, res, next) => {

    // Define and check that all required fields and employee are present, if not, return 400 status code

    const hours = req.body.timesheet.hours;
    const rate = req.body.timesheet.rate;
    const date = req.body.timesheet.date;
    const employeeId = req.params.employeeId;

    // db query and values to find employee

    const employeeSql = `SELECT * FROM Employee WHERE Employee.id = $employeeId`;
    const employeeValues = {
        $employeeId: employeeId
    };

    // Run the get query

    db.get(employeeSql, employeeValues, (error, employee) => {
        if(error) {
            next(error);
        } else {

            if (!hours || !rate || date || !employee) {
                return res. sendStatus(400);
            };

            // Define query and values

            const sql = `INSERT INTO Timesheet(hours, rate, date, employee_id) VALUES($hours, $rate, $date, $employeeId)`;
            const values = {
                $hours: hours,
                $rate: rate,
                $date: date,
                $employeeId: employeeId
            };

            // Run the create db query, get the updated response with "this.lastID" and return

            db.run(sql, values, function(error) {
                if(error) {
                    next(error);
                } else {
                    db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${this.lastID}`, (error, timesheet) => {
                        res.status(201).json({timesheet: timesheet});
                    });
                };
            });
        };
    });
});


//===================================
// /timesheets/:timesheetId' ('/:timesheetId') *May need to be in timesheet.js?*
//===================================


/* PUT Route
''''''''''''*/

timesheetRouter.put('/:timesheetId', (req, res, next) => {

    // Define and check that all required fields and employee are present, if not, return 400 status code

    const hours = req.body.timesheet.hours;
    const rate = req.body.timesheet.rate;
    const date = req.body.timesheet.date;
    const employeeId = req.params.employeeId;

    // db query and values to find employee

    const employeeSql = `SELECT * FROM Employee WHERE Employee.id = $employeeId`;
    const employeeValues = {
        $employeeId: employeeId
    };

    // Run the get query

    db.get(employeeSql, employeeValues, (error, employee) => {
        if(error) {
            next(error);
        } else {

            if (!hours || !rate || date || !employee) {
                return res. sendStatus(400);
            };

            const sql = `UPDATE Timesheet SET hours = $hours, rate = $rate, date = $date, employee_id = $employeeId WHERE Timesheet.id = $timesheetId`;
            const values = {
                $hours: hours,
                $rate: rate,
                $date: date,
                $employeeId: employeeId,
                $timesheetId: req.params.timesheetId
            };

            db.run(sql, values, (error) => {
                if(error) {
                    next(error);
                } else {
                    db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${req.params.timesheetId}`, (error, timesheet) => {
                        return res.status(200).json({timesheet: timesheet});
                    });
                };
            });
        };
    });
});


/* DELETE Route
'''''''''''''''*/

timesheetRouter.delete('/:timesheetId', (req, res, next) => {

    // Define query string and values

    const sql = `DELETE FROM Timesheet WHERE Timesheet.id = $timesheetId`;
    const values = {
        $timesheetId: req.params.timesheetId
    };

    // Run delete query

    db.run(sql, values, (error) => {
        if(error) {
            next(error);
        } else {
            return res.sendStatus(204);
        };
    });
});


module.exports = timesheetRouter;