'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const handleError = require('@core/middlewares/error-handler.middleware');

const userRoutes = require('@user/routes/user.routes');

const app = express();
config();
build();
capture();

function build() {
    app.use('/api/user', userRoutes);
}

function config() {
    app.use(bodyParser.json({ limit: '1mb' }));
    app.use(bodyParser.text({ type: 'text/html' }));
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
}

function capture() {
    app.use(handleError);
}

module.exports = app;
