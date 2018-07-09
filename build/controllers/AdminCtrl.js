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

function createAuthUser(req, res) {
    /**
     * Crear nuevo usuario.
     * Admin Use Only.
     * @requires
     * name: Nombre del usuario.
     * lastname: apellidos.
     * email: correo del usuario.
     * password: @default: 1234abc
     * experience: Num (0-1000) nivel de experiencia
     * role:  @default user.
     * score: Num (>0) @default 0;
     * @returns
     * userRecord
     */
    var email = 'johan.leo_s@hotmail.com';
    var password = "1234abc";
    var name = "Johan";
    var lastname = "Sanchez Retiz";
    var displayName = name + " " + lastname;
    var creationDate  = getDate();
    var experience = 50;
    var emailVerified = true;
    var city = 'Bogota';


    firebase.auth().createUser({ email, password, displayName, emailVerified }).then(function (userRecord) {

        var uid = userRecord.uid;

        var db = firebase.firestore();
        var addUser = db.collection('Users').doc(uid).set({
            idUser: uid,
            role: 'User',
            name: name,
            lastname: lastname,
            experience: experience,
            score: 0,
            creationDate: creationDate,
            city: city,


        }).then(ref => {
            console.log(ref)
            res.status(200).send({ userRecord });
        }).catch(err => {
            res.status(200).send({ msg: 'ERROR: NO SE HA PODIDO CREAR EL USUARIO ' });
        });


    })
        .catch(function (error) {
            res.status(200).send({ error })
        });

}

function createMedal(req, res) {
    /**
     * Crear Medalla
     * Admin use only
     * @requires:
     * name: Nombre de la medalla;
     * description: Descripcion de la medalla;
     * requirementScore: puntaje requerido para obtenerla;
     * @returns:
     * Confirm msg + ID medal
     */
    console.log("SVC: createMedal");
    var name = "EYE OF TIGER";
    var description = "Medalla otorgada por obtener 150 puntos de experiencia"
    var requirementScore = 150;


    res.status(200).send("crear medalla");
}
function editMedal(req, res) {

}
function deleteMedal(req, res) {

}
function getMedal() {

}

module.exports = {
    createAuthUser,
    createMedal,
    editMedal,
    deleteMedal,
    getMedal,

}