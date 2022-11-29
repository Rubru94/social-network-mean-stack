'use strict';

const express = require('express');
const userController = require('@user/controllers/user.controller');
const api = express.Router();
const authMiddleware = require('@core/middlewares/auth.middleware');
const multipart = require('connect-multiparty');
const uploadMiddleware = multipart({ uploadDir: './src/user/uploads' });

api.get('/all/:page?', authMiddleware, userController.getAll);
api.get('/follow-counters', authMiddleware, userController.followCounters);
api.get('/hello', authMiddleware, userController.hello);
api.get('/image/:imageFile', userController.getImageFile);
api.get('/:id', authMiddleware, userController.findById);
api.post('/register', userController.register);
api.post('/login', userController.login);
api.put('/update/:id', authMiddleware, userController.update);
api.post('/upload-image/:id', [authMiddleware, uploadMiddleware], userController.uploadImage);

module.exports = api;
