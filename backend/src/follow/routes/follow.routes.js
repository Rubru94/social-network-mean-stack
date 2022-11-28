'use strict';

const express = require('express');
const followController = require('@follow/controllers/follow.controller');
const authMiddleware = require('@core/middlewares/auth.middleware');
const api = express.Router();

api.get('/hello', authMiddleware, followController.hello);
api.get('/:id', followController.findById);
api.get('/all/:page?', authMiddleware, followController.getAll);
api.post('/', authMiddleware, followController.create);

module.exports = api;
