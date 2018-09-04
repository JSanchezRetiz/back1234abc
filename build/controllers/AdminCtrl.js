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
    var month =1+ clock.getMonth();
    var day = clock.getDate();
    var hour = clock.getHours();
    var minutes = clock.getMinutes();
    var seconds = clock.getSeconds();
    var date = year + "/" + month + "/" + day + "," + hour + ":" + minutes + ":" + seconds
    return date;
}

function updateStatusUser(req, res){
    var db = firebase.firestore();
    var userRef= db.collection('Users').doc(req.body.uid);
    var getDoc = userRef.get().then(doc=>{
        if (!doc.exists){
            res.status(500).send('error usuario no encontrado');
        }else{
            if(doc.data().role=="administrador"){
                console.log("usuario autorizado para modificar informacion")
                firebase.auth().updateUser(req.body.uid,{
                    disabled:req.body.status}).then(function (userRecord){
                    console.log('actualizacion realizada');
                    res.status(200).send({msg:'se modifico correctmente el estado del usuario' + req.body.idUser });
                }).catch(function (error){
                    res.status(404).send({
                        msg:'error no se logro cambiar el stado de  la cuenta'
                    });
                })
            }else{
                res.status(500).send("rol que envia la solicitud no esta autorizado")
            }
        }
    })
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
console.log('SVC CREATE AUTH USER')
console.log(req.body);
    var email = req.body.email;//correo del usuario
    var password = "1234abc";//contraseña. no enviar
    var name = req.body.name;//nombre
    var lastname = req.body.lastname;//apellido
    var displayName = name + " " + lastname; //no enviar, lo guarda solo
    var creationDate  = getDate();//no enviar
    var experience = req.body.experience;// experiencia.. es un numero
    var emailVerified = true;//no enviar este
    var city = req.body.city;//ciudad
    var job = req.body.job; //cargo
    var role = req.body.role;//rol


   
    firebase.auth().createUser({ email, password, displayName, emailVerified }).then(function (userRecord) {

        var uid = userRecord.uid;

        var db = firebase.firestore();
        var addUser = db.collection('Users').doc(uid).set({
            idUser: uid,
            role: role,
            name: name,
            lastname: lastname,
            experience: experience,
            score: 0,
            creationDate: creationDate,
            city: city,
            job: job,
            email:email,


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
    updateStatusUser,

}