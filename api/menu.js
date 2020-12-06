const express = require('express');
const menuRouter = express.Router({mergeParams: true});
const menuItemRouter = require('./menu-item.js');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


/* Params
'''''''''*/

menuRouter.param('menuId', (req, res, next, menuId) => {
    const sql = `SELECT * FROM Menu WHERE Menu.id = $menuId`;
    const values = {
        $menuId: menuId
    };

    db.get(sql, values, (error, menu) => {
        if (error) {
            next(error);
        } else if (menu) {
            req.menu = menu;
            next();
        } else {
            res.sendStatus(404);
        };
    });
});


/* menuItems Router
'''''''''''''''''''*/

menuRouter.use('/:menuId/menu-items', menuItemRouter);


//=====================================
// '/menus' ('/') path
//=====================================


/* GET Route
''''''''''''*/

menuRouter.get('/', (req, res, next) => {
    db.all(`SELECT * FROM Menu`, (error, menus) => {
        if(error) {
            next(error);
        } else {
            return res.status(200).json({menus: menus});
        };
    });
});

/* POST Route
'''''''''''''*/

menuRouter.post('/', (req, res, next) => {

    // Define and check that all required fields are present, if not, return 400 status code

    const title = req.body.menu.title;

    if(!title) {
        return res.sendStatus(400);
    };

    // Define db query and values

    const sql = `INSERT INTO Menu(title) VALUES ($title)`;
    const values = {
        $title: title
    };

    // Run the db query, get the updated response with "this.lastID"

    db.run(sql, values, function(error) {
        if(error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Menu WHERE Menu.id = ${this.lastID}`, (error, menu) => {
                res.status(201).json({menu: menu});
            });
        };
    });
});

//=====================================
// '/menus/:menuId' ('/:menusId') path
//=====================================


/* GET Route
''''''''''''*/

menuRouter.get('/:menuId', (req, res, next) => {
    res.status(200).json({menu: req.menu});
});


/* PUT Route
''''''''''''*/

menuRouter.put('/:menuId', (req, res, next) => {

    // Define and check that all required fields are present, if not, return 400 status code

    const title = req.body.menu.title;

    if(!title) {
        return res.sendStatus(400);
    };

    // Define db query and values

    const sql = `UPDATE Menu SET title = $title WHERE Menu.id = $menuId`;
    const values = {
        $title: title,
        $menuId: req.params.menuId
    };

    // Run the db query, get the updated response

    db.run(sql, values, (error) => {
        if(error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Menu WHERE Menu.id = ${req.params.menuId}`, (error, menu) => {
                 res.status(200).json({menu: menu});
            });
        };
    });
});


/* DELETE Route
'''''''''''''''*/

menuRouter.delete('/:menuId', (req, res, next) => {

    const menuItemSql = `SELECT * FROM MenuItem WHERE MenuItem.menu_id = $menuId`;
    const menuItemValues = {
        $menuId: req.params.menuId
    };

    db.get(menuItemSql, menuItemValues, (error, menuItem) => {
        if(error) {
            next(error);
        } else if (menuItem) {
            res.sendStatus(400);
        } else {

            const sql = `DELETE FROM Menu WHERE Menu.id = $menuId`;
            const values = {
                $menuId: req.params.menuId
            };

            db.run(sql, values, (error) => {
                if(error) {
                    next(error);
                } else {
                    res.sendStatus(204);
                };
            });
        };
    });
});


module.exports = menuRouter;