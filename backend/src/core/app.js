'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const handleError = require('@core/middlewares/error-handler.middleware');

const userRoutes = require('@user/routes/user.routes');
const followRoutes = require('@follow/routes/follow.routes');
const publicationRoutes = require('@publication/routes/publication.routes');
const messageRoutes = require('@message/routes/message.routes');

const app = express();
config();
build();
capture();

function build() {
    app.use('/api/user', userRoutes);
    app.use('/api/follow', followRoutes);
    app.use('/api/publication', publicationRoutes);
    app.use('/api/message', messageRoutes);
}

function config() {
    app.use(bodyParser.json({ limit: '1mb' }));
    app.use(bodyParser.text({ type: 'text/html' }));
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
}

function capture() {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header(
            'Access-Control-Allow-Headers',
            'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
        );
        res.header('Access-Control-Expose-Headers', 'Authorization');
        res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

        next();
    });
    app.use(handleError);
}

module.exports = app;
