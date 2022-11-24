'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
config();

function config() {
    app.use(bodyParser.json({ limit: '1mb' }));
    app.use(bodyParser.text({ type: 'text/html' }));
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
}

app.get('/', (req, res) => {
    res.status(200).send({ msg: 'hello world !' });
});

module.exports = app;
