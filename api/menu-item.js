const express = require('express');
const menuItemRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

/* Params
'''''''''*/

menuItemRouter.param('menuItemId', (req, res, next, menuItemId) => {

    const sql = `SELECT * FROM MenuItem WHERE MenuItem.id = $menuItemId`;
    const values = {
        $menuItemId: menuItemId
    };

    db.run(sql, values, (error, menuItem) => {
        if(error) {
            next(error);
        } else if (menuItem) {
            next();
        } else {
            res.sendStatus(404);
        };
    });
});


//=========================================================
// '/:menuId/menu-items' ('/') path
//=========================================================


/* GET Route
''''''''''''*/

menuItemRouter.get('/', (req, res, next) => {

    const sql = `SELECT * FROM MenuItem WHERE MenuItem.id = $menuItemId`;
    const values = {
        $menuItemId: req.params.menuItemId
    };

    db.run(sql, values, (error, menuItem) => {
        if(error) {
            next(error);
        } else {
            return res.status(200).json({menuItem: menuItem});
        };
    });
});


/* POST Route
'''''''''''''*/

menuItemRouter.post('/', (req, res, next) => {

    const name = req.body.menuItem.name;
    const description = req.body.menuItem.description;
    const inventory = req.body.menuItem.inventory;
    const price = req.body.menuItem.price;
    const menuId = req.body.menuItem.menuId; /// params or body????

    const menuSql = `SELECT * FROM Menu WHERE Menu.id = $menuId`;
    const menuValues = {
        $menuId: menuId
    };

    db.get(menuSql, menuValues, (error, menu) => {
        if (error) {
            next(error);
        } else {

            if(!name || !description || !inventory || !price || !menu) {
                return res.sendStatus(400);
            };

            const sql = `INSERT INTO MenuItem(name, description, inventory, price, menu_id) VALUES($name, $description, $inventory, $price, $menuId)`;
            const values = {
                $name: name,
                $description: description,
                $inventory: inventory,
                $price: price,
                $menuId: req.params.menuId
            };

            db.run(sql, values, function(error) {
                if(error) {
                    next(error);
                } else {
                    db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${this.lastID}`, (error, menuItem) => {
                        return res.status(201).json({menuItem: menuItem});
                    });
                };
            });
        };
    });
});


//=========================================================
// '/menuId/menu-items/:menuItemId' ('/:menuItemId') path
//=========================================================


/* PUT Route
''''''''''''*/

menuItemRouter.put('/:menuItemId', (req, res, next) => {

    const name = req.body.menuItem.name;
    const description = req.body.menuItem.description;
    const inventory = req.body.menuItem.inventory;
    const price = req.body.menuItem.price;
    const menuId = req.body.menuItem.menuId; /// params or body????

    const menuSql = `SELECT * FROM Menu WHERE Menu.id = $menuId`;
    const menuValues = {
        $menuId: menuId
    };

    db.get(menuSql, menuValues, (error, menu) => {
        if (error) {
            next(error);
        } else {
        
            if(!name || !description || !inventory || !price || !menu) {
                return res.sendStatus(400);
            };

            const sql = `UPDATE MenuItem SET name = $name, description = $description, inventory = $inventory, price = $price, menu_id = $menuId WHERE MenuItem.id = $menuItemId`;
            const values = {
                $name: name,
                $description: description,
                $inventory: inventory,
                $price: price,
                $menuId: menuId,
                $menuItemId: req.params.menuItemId
            };

            db.run(sql, values, (error) => {
                if(error) {
                    next(error);
                } else {
                    db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${req.params.menuItemId}`, (error, menuItem) => {
                        return res.status(200).json({menuItem: menuItem});
                    });
                };
            });
        };
    });
});


/* DELETE Route
'''''''''''''''*/

menuItemRouter.delete('/:menuItemId', (req, res, next) => {

    const sql = `DELETE FROM MenuItem WHERE MenuItem.id = $menuItemId`;
    const values = {
        $menuItemId: req.params.menuItemId
    };

    db.run(sql, values, (error) => {
        if(error) {
            next(error);
        } else {
            return res.sendStatus(204);
        };
    });
});


module.exports = menuItemRouter;