'use strict'
var express = require('express');
var multipart = require('connect-multiparty');
//Controllers:
var Coordinator_Routes = require('../controllers/CoordinatorCtrl')
var api = express.Router();
//URL:

api.post('/newActivity', Coordinator_Routes.newActivity);
api.post('/getActivity', Coordinator_Routes.getActivity);
api.post('/getAllActivityByCoordinator', Coordinator_Routes.getAllActivityByCoordinator);
api.get('/getAllActivity', Coordinator_Routes.getAllActivity);
api.post('/registerScore', Coordinator_Routes.registerScore);
api.post('/getAllScoreByActivity', Coordinator_Routes.getAllScoreByActivity);
api.post('/updateItemStore', Coordinator_Routes.updateItemStore);
api.post('/deleteItemStore', Coordinator_Routes.deleteItemStore);
api.post('/createActivity', Coordinator_Routes.createActivity);
module.exports = api; 