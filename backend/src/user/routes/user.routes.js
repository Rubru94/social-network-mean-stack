'use strict';

const express = require('express');
const userController = require('@user/controllers/user.controller');
const api = express.Router();
const ensureAuth = require('@core/middlewares/auth.middleware');

api.get('/hello', ensureAuth, userController.hello);
api.post('/register', userController.create);
api.post('/login', userController.login);

module.exports = api;
