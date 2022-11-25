'use strict';

const express = require('express');
const userController = require('@user/controllers/user.controller');
const api = express.Router();
const ensureAuth = require('@core/middlewares/auth.middleware');

api.get('/:id', ensureAuth, userController.findById);
api.get('/all/:page?', ensureAuth, userController.getAll);
api.get('/hello', ensureAuth, userController.hello);
api.post('/register', userController.register);
api.post('/login', userController.login);

module.exports = api;
