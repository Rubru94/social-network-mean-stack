'use strict';

const express = require('express');
const messageController = require('@message/controllers/message.controller');
const authMiddleware = require('@core/middlewares/auth.middleware');
const api = express.Router();

api.get('/received/:page?', authMiddleware, messageController.getReceivedMessages);
api.get('/sent/:page?', authMiddleware, messageController.getSentMessages);
api.get('/unviewed/', authMiddleware, messageController.getUnviewedCount);
api.post('/', authMiddleware, messageController.create);
api.put('/set-viewed', authMiddleware, messageController.setViewed);

module.exports = api;
