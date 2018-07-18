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
api.post('/getStoreItem', UsersCtrl.getStoreItem)
module.exports = api; 