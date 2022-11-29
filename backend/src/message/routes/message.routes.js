'use strict';

const express = require('express');
const messageController = require('@message/controllers/message.controller');
const authMiddleware = require('@core/middlewares/auth.middleware');
const api = express.Router();

api.post('/', authMiddleware, messageController.create);

module.exports = api;
