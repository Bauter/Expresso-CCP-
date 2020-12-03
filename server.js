const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const errorhandler = require('errorhandler');
const apiRouter = require('./api/api.js')

const app = express();

const PORT = process.env.PORT || 4000;

// Middleware

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

// Initial route goes here

app.use('/api', apiRouter);

// Errorhandler below

app.use(errorhandler());

// Start the server

app.listen(PORT, () => {
    console.log(`Server is now running on port: ${PORT}`);
})

module.exports = app;