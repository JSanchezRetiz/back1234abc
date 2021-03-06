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
api.post('/saveActivity', Coordinator_Routes.saveActivity);
api.post('/createMedal', Coordinator_Routes.createMedal);
api.post('/updateMedal', Coordinator_Routes.updateMedal);
api.post('/deleteMedal', Coordinator_Routes.deleteMedal);
api.get('/getAllMedals', Coordinator_Routes.getAllMedals);
api.post('/getMedalById', Coordinator_Routes.getMedalById);
api.post('/deleteActivity', Coordinator_Routes.deleteActivity);
api.post('/updateActivity', Coordinator_Routes.updateActivity);
api.get('/getTypeOfScore', Coordinator_Routes.getTypeOfScore);
api.post('/createNotification', Coordinator_Routes.createNotification);
api.post('/updateNotification', Coordinator_Routes.updateNotification);
api.post('/deleteNotification', Coordinator_Routes.deleteNotification);
api.get('/getAllNotification', Coordinator_Routes.getAllNotification);
api.get('/getAllUsers', Coordinator_Routes.getAllUsers);
api.post('/deleteUsers', Coordinator_Routes.deleteUsers);
api.post('/updateUsers', Coordinator_Routes.updateUsers);
api.get('/getAllActivityRegister', Coordinator_Routes.getAllActivityRegister);
api.get('/getAllParticipatingUsers', Coordinator_Routes.getAllParticipatingUsers);
api.post('/getActivitiesParticipatingById',Coordinator_Routes.getActivitiesParticipatingById);

 module.exports = api; 