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
api.post('/getStoreItem', UsersCtrl.getStoreItem);
api.get('/getAllItemsStore', UsersCtrl.getAllItemsStore);
api.post('/getItemById',UsersCtrl.getItemById)
api.post('/newItemStore', UsersCtrl.newItemStore);
api.post('/getMyActivitys', UsersCtrl.getMyActivitys);
api.post('/getNotificationsGlobal', UsersCtrl.getNotificationsGlobal);
// api.post('/getNotificationsGroup', UsersCtrl.getNotificationsGroup);

module.exports = api;
