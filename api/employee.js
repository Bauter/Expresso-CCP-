const express = require('express');
const employeeRouter = express.Router({mergeParams: true});
const timesheetRouter = require('./timesheet.js');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


/* Params
'''''''''*/


employeeRouter.param('employeeId', (req, res, next, employeeId) => {
    const sql = `SELECT * FROM Employee WHERE Employee.id = $employeeId`;
    const values = {
        $employeeId: employeeId
    };

    db.get(sql, values, (error, employee) => {
        if (error) {
            next(error);
        } else if (employee) {
            req.employee = employee;
            next();
        } else {
            res.sendStatus(404);
        };
    });
});


/* timesheetRouter
''''''''''''''''''*/

employeeRouter.use('/:employeeId/timesheets', timesheetRouter);

//==================================
// '/employees' ('/') path
//==================================


/* GET Route
''''''''''''*/

employeeRouter.get('/', (req, res, next) => {
    db.all(`SELECT * FROM Employee WHERE Employee.is_current_employee = 1`, (error, employee) => {
        if(error) {
            next(error);
        } else {
            res.status(200).json({employee: employee});
        };
    });
});


/* POST Route
'''''''''''''*/

employeeRouter.post('/', (req, res, next) => {

    // Define and check that all required fields are present, if not, return 400 status code
    
    const name = req.body.employee.name;
    const position = req.body.employee.position;
    const wage = req.body.employee.wage;
    const isCurrentEmployee = req.body.employee.isCurrentlyEmployee === 0 ? 0 : 1;

    if (!name || !position || !wage) {
        return res.sendStatus(400);
    };

    // Define the query and values
    

    const sql = `INSERT INTO Employee (name, position, wage, is_current_employee) VALUES ($name, $position, $wage, $isCurrentEmployee)`;
    const values = {
        $name: name,
        $position: position,
        $wage: wage,
        $isCurrentEmployee: isCurrentEmployee
    };

    // Run the db query, get the updated response with "this.lastID"

    db.run(sql, values, function(error) {
        if (error) {
            next(error)
        } else {
            db.get(`SELECT * FROM Employee WHERE Employee.id = ${this.lastID}`, (error, employee) => {
                return res.status(201).json({employee: employee});
            });
        };
    });
});

//===================================
// '/employees/:employeeId' ('/:employeeId') path
//===================================


/* GET Route
''''''''''''*/
employeeRouter.get('/:employeeId', (req, res, next) => {
    res.status(200).json({employee : req.employee});
});


/* PUT Route
''''''''''''*/
employeeRouter.put('/:employeeId', (req, res, next) => {

    // Define and check that all required fields are present, if not, return 400 status code
    
    const name = req.body.employee.name;
    const position = req.body.employee.position;
    const wage = req.body.employee.wage;
    const isCurrentEmployee = req.body.employee.isCurrentlyEmployee === 0 ? 0 : 1;

    if (!name || !position || !wage) {
        return res.sendStatus(400);
    };

    // Define the query and values

    const sql = `UPDATE Employee SET name = $name, position = $position, wage = $wage, is_current_employee = $isCurrentEmployee WHERE Employee.id = $employeeId`;
    const values = {
        $name: name,
        $position: position,
        $wage: wage,
        $isCurrentEmployee: isCurrentEmployee,
        $employeeId: req.params.employeeId
    };

    // Run the db query, get the updated response

    db. run(sql, values, (error) => {
        if (error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Employee WHERE Employee.id = ${req.params.employeeId}`, (error, employee) => {
                return res.status(200).json({employee: employee});
            });
        };
    });
});


/* DELETE Route
'''''''''''''''*/

employeeRouter.delete('/:employeeId', (req, res, next) => {

    // Define the db query and values

    const sql = `UPDATE Employee SET is_current_employee = $isCurrentEmployee WHERE Employee.id = $employeeId`;
    const values = {
        $isCurrentEmployee: 0,
        $employeeId: req.params.employeeId
    };

    db.run(sql, values, (error) => {
        if(error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Employee WHERE Employee.id = ${req.params.employeeId}`, (error, employee) => {
                return res.status(200).json({employee: employee});
            });
        };
    });
});

module.exports = employeeRouter;