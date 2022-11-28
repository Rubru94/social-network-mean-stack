'use strict';

const express = require('express');
const followController = require('@follow/controllers/follow.controller');
const authMiddleware = require('@core/middlewares/auth.middleware');
const api = express.Router();

api.get('/following/:page?', authMiddleware, followController.getFollowingUsers);
api.get('/follower/:page?', authMiddleware, followController.getFollowers);
api.get('/', authMiddleware, followController.getFollows);
api.post('/', authMiddleware, followController.create);
api.delete('/:id', authMiddleware, followController.remove);

module.exports = api;
