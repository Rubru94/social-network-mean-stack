'use strict';

const express = require('express');
const userController = require('@user/controllers/user.controller');
const api = express.Router();

api.get('/hello', userController.hello);

module.exports = api;
