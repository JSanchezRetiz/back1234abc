'use strict'
var firebase = require('firebase-admin');

function getDate() {
    /**
     * Funcion local para:
     * captura de hora exacta y retornarla al servicio donde se llame
     * NO @requires;
     * @returns:
     * date: "año/mes/dia, hora:minutos:segundos";
     */
    var clock = new Date();
    var year = clock.getFullYear();
    var month = clock.getMonth();
    var day = clock.getDate();
    var hour = clock.getHours();
    var minutes = clock.getMinutes();
    var seconds = clock.getSeconds();
    var date = year + "/" + month + "/" + day + "," + hour + ":" + minutes + ":" + seconds
    return date;
}

function newActivity(req, res) {
    /**
         * Servicio de Coordinador:
         * Crear una nueva actividad
         * @requires
         * description : descripcion de la actividad
         * id: id de la actividad que estamos creando
         * enTime: fecha-hora fin de la actividad
         * idCoordinator: UID Coordinador que esta creando la actividad
         * name: nombre de la actividad
         * reward: id recompensa 
         * startTime: fecha-hora inicio de la actividad
         * title: Titulo de la actividad
         * typeScore: ID tipo de puntaje a dar
         * @returns:
         * id: ID identificador del documento
         */
    var fecha = getDate();

    console.log('SVC: newActivity')
    var db = firebase.firestore();
    
    var description = req.body.description;
    var endTime = req.body.endTime;
    var idCoordinator = req.body.idCoordinator;
    var name = req.body.name;
    var reward = req.body.reward;
    var startTime = req.body.startTime;
    var title = req.body.title;
    var typeScore = req.body.typeScore;

    var addActivity = db.collection('Activity').add({
        description: description,
        endTime: endTime,
        id: id,
        idCoordinator: idCoordinator,
        name: name,
        reward: reward,
        startTime: startTime,
        title: title,
        typeScore: typeScore,
        creationTime: fecha,


    }).then(ref => {
        console.log('new Activity Created: ', ref.id);
        res.status(200).send({ id: ref.id });
    }).catch(err => {
        res.status(404).send({ msg: 'ERROR:', error: err });
    });





}
function getActivity(req, res) {
    /**
     * Obtener una actividad en especifico.
     * @requires: 
     * id: ID identificador de la actividad
     * @returns:
     * activityDto: Contenedor del documento encontrado.
     */
    var id = req.body.id;
    //var id = 'VEPFnrwuyzV3pVQQikDA';
    var activityDto;
    console.log("SVC: getActivity");
    var db = firebase.firestore();
    var projectRef = db.collection('Activity').doc(id);
    var getCollection = projectRef.get().then(doc => {
        if (!doc.exists) {
            res.status(404).send({ msg: 'Actividad no encontrada' })
        } else {
            activityDto = doc.data();
            res.status(200).send({ activityDto });
        }
    })
        .catch(err => {
            console.log('ERROR: NO SE PUDO OBTENER EL PROYECTO', err);
        });

}
function getAllActivityByCoordinator(req, res) {
    /**
     * crear array con la informacion de todas las actividades que ha creado un Coordinador
     * @requires: 
     * uid: Coordinador id
     * @returns:
     * activityDto [];
     * 
     */
    console.log("SVC: getAllActivityByCoordinator");
    var uid = req.body.uid;
    var db = firebase.firestore();
    var projectRef = db.collection('Activity');
    var activity = {};
    var activityDto = new Array();
    projectRef.where('idCoordinator', "==", uid).get().then(function (snapshot) {
        snapshot.forEach(function (doc) {
            activity = {};
            console.log(doc.data())
            //activity.id = doc.id();
            activity = doc.data();
            activityDto.push(activity);
        });

        res.status(200).send({ activityDto });
    }).catch(function (error) {
        res.status(500).send({ msg: "Error. No se encontraron datos. Reintenta" });
    });
}

function getAllActivity(req, res) {
    /**
     * crear array con la informacion de todas las actividades 
     * @requires: 
     *
     * @returns:
     * activityDto [];
     * 
     */
    console.log("SVC: getAllActivity");
    var uid = req.body.uid;
    var db = firebase.firestore();
    var projectRef = db.collection('Activity');
    var activity = {};
    var activityDto = new Array();
    projectRef.get().then(function (snapshot) {
        snapshot.forEach(function (doc) {
            activity = {};
            console.log(doc.data())
     
            activity = doc.data();
            activityDto.push(activity);
        });

        res.status(200).send(activityDto);
    }).catch(function (error) {
        res.status(500).send({ msg: "Error. No se encontraron datos. Reintenta" });
    });
}

module.exports = {
    newActivity,
    getActivity,
    getAllActivityByCoordinator,
    getAllActivity,
    
}