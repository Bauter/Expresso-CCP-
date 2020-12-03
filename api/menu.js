const express = require('express');
const menuRouter = express.Router({mergeParams: true});
const menuItemRouter = require('./menu-item.js');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Params

// menuItems Router

menuRouter.use('/:menuId/menu-items', menuItemRouter);

//=====================================
// '/menus' ('/') path
//=====================================

// GET Route

// POST Route

//=====================================
// '/menus/:menuId' ('/:menusId') path
//=====================================

// GET Route

// PUT Route

// DELETE Route




module.exports = menuRouter;