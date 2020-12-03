const express = require('express');
const menuItemRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Params

//=========================================================
// '/:menuId/menu-items' ('/') path
//=========================================================

// GET Route

// POST Route

//=========================================================
// '/menuId/menu-items/:menuItemId' ('/:menuItemId') path
//=========================================================

// PUT Route

// DELETE Route


module.exports = menuItemRouter;