'use strict';

const express = require('express');
const publicationController = require('@publication/controllers/publication.controller');
const authMiddleware = require('@core/middlewares/auth.middleware');
const api = express.Router();
const multipart = require('connect-multiparty');
const uploadMiddleware = multipart({ uploadDir: './src/publication/uploads' });

api.get('/hello', authMiddleware, publicationController.hello);
api.post('/', authMiddleware, publicationController.create);

module.exports = api;
