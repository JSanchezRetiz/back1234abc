'use strict'
var express = require('express');
var multipart = require('connect-multiparty');
//Controllers:
var Coordinator_Routes = require('../controllers/CoordinatorCtrl')
var api = express.Router();
//URL:

api.post('/newActivity', Coordinator_Routes.newActivity);
api.post('/getActivity', Coordinator_Routes.getActivity);
api.post('/getAllActivityByCoordinator',Coordinator_Routes.getAllActivityByCoordinator);
module.exports = api; 