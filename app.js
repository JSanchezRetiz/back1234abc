'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
require("./build/services/firebaseSvc")
var user_routes = require('./build/routes/UsersRoutes');
var coordinator_routes = require('./build/routes/CoordinatorRoutes');
var admin_Routes = require('./build/routes/AdminRoutes');
var fachada = "/prueba"
//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// configuracion de cabeceras http
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
app.use(fachada, user_routes);
app.use(fachada, coordinator_routes);
app.use(fachada, admin_Routes)
module.exports = app;