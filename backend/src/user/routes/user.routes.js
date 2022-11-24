'use strict';

const express = require('express');
const userController = require('@user/controllers/user.controller');
const api = express.Router();

api.get('/hello', userController.hello);
api.post('/register', userController.create);
api.post('/login', userController.login);

module.exports = api;
