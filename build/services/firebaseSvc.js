'use strict'

var admin = require("firebase-admin");

var serviceAccount = require("../resources/gamificacion-e452f-firebase-adminsdk-fjwe1-9d564568a3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gamificacion-e452f.firebaseio.com"
});