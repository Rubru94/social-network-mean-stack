'use strict';

const express = require('express');
const userController = require('@user/controllers/user.controller');
const api = express.Router();
const authMiddleware = require('@core/middlewares/auth.middleware');
const userUploads = require('@user/models/uploads.model');
const multipart = require('connect-multiparty');
const uploadMiddleware = multipart({ uploadDir: userUploads.path });

api.get('/all/:page?', authMiddleware, userController.getAll);
api.get('/counters', authMiddleware, userController.getCounters);
api.get('/hello', authMiddleware, userController.hello);
api.get('/image/:imageFile', userController.getImageFile);
api.get('/:id', authMiddleware, userController.findById);
api.post('/register', userController.register);
api.post('/login', userController.login);
api.post('/upload-image/:userId', [authMiddleware, uploadMiddleware], userController.uploadImage);
api.put('/update/:id', authMiddleware, userController.update);

module.exports = api;
