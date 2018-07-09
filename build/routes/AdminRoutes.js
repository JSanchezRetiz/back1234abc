'use strict'
var express = require('express');
var multipart = require('connect-multiparty');
//Controllers:
var AdminCtrl = require('../controllers/AdminCtrl')
var api = express.Router();
//URL:

api.post('/createMedal', AdminCtrl.createMedal);
api.post('/editMedal', AdminCtrl.editMedal);
api.post('/deleteMedal', AdminCtrl.deleteMedal);
api.post('/getMedal', AdminCtrl.getMedal);
api.post('/createAuthUser', AdminCtrl.createAuthUser);
module.exports = api; 