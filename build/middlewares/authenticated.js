'use strict'
var firebase = require('firebase-admin');
var log4jsSvc = require('../services/log4jsSvc');
//******** configuración de logs ***********
var log4js = log4jsSvc.init();
const log = log4js.getLogger();

exports.verifyToken = function (req, res, next) {
  if (!req.headers.token) {
    log.debug('La peticion no contiene la cabecera de autenticacion');
    return res.status(403).send({ msg: 'La petición no contiene la cabecera de autenticación' });
  } else {
    firebase.auth().verifyIdToken(req.headers.token).then((decodedToken) => {
      req.user = decodedToken;
      next();
    }).catch(function (err) {
      return res.status(404).send({ code: 404, msg: err });
    });
  }
};