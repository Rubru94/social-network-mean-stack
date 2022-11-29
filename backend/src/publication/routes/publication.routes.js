'use strict';

const express = require('express');
const publicationController = require('@publication/controllers/publication.controller');
const authMiddleware = require('@core/middlewares/auth.middleware');
const api = express.Router();
const multipart = require('connect-multiparty');
const uploadMiddleware = multipart({ uploadDir: './src/publication/uploads' });

api.get('/all-following/:page?', authMiddleware, publicationController.getAllFromFollowing);
api.get('/:id', authMiddleware, publicationController.findById);
api.get('/image/:imageFile', publicationController.getImageFile);
api.post('/', authMiddleware, publicationController.create);
api.post('/upload-image/:publicationId', [authMiddleware, uploadMiddleware], publicationController.uploadImage);
api.delete('/:id', authMiddleware, publicationController.remove);

module.exports = api;
