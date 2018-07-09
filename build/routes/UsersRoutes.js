'use strict'
var express = require('express');
var multipart = require('connect-multiparty');
//Controllers:
var UsersCtrl = require('../controllers/UsersCtrl')
var api = express.Router();
//URL:

api.post('/getUserData', UsersCtrl.getUserData);
api.get('/getUsers', UsersCtrl.getUsers);
api.post('/createUserInDB', UsersCtrl.createUserInDB);

module.exports = api; 