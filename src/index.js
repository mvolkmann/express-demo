// @flow

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const serveStatic = require('serve-static');
const userService = require('./user-service');

const app = express();

// Parse JSON request bodies to JavaScript objects.
app.use(bodyParser.json());

// Logging
// The provided options are combined, common, dev, short, and tiny.
// For more details, browse https://github.com/expressjs/morgan.
app.use(morgan('dev'));

// Serve static files from the public directory.
app.use(serveStatic('public'));

userService(app);

const PORT = 3001;
app.listen(PORT, () => console.log('listening on', PORT));
