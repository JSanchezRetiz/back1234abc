

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
    var month = 1 + clock.getMonth();
    var day = clock.getDate();
    var hour = clock.getHours();
    var minutes = clock.getMinutes();
    var seconds = clock.getSeconds();
    var date = year + "/" + month + "/" + day + "," + hour + ":" + minutes + ":" + seconds
    return date;
}
function updateNotification(req, res) {
    var db = firebase.firestore();
    var id = req.body.id;
    console.log("variable del id");
    console.log(id);

    var projectRef = db.collection('Notify').doc(id).update({
        endTime: req.body.endTime,
        startTime: req.body.startTime,
        title: req.body.title,
        message: req.body.message,
        activity: req.body.activity,

    }).then(ref => {
        console.log('Se modifico exitosamente la notificacion');
        res.status(200).send(req.body.id);
    }).catch(err => {
        res.status(404).send({ msg: 'Error no se ha podido modificar la notificacion' })
    })
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
    var status = req.body.status;
    var description = req.body.description;
    var endTime = req.body.endTime;
    var idCoordinator = req.body.idCoordinator;
    var name = req.body.name;
    var reward = req.body.reward;
    var startTime = req.body.startTime;
    var title = req.body.title;
    var prize = req.body.prize;
    var typeScore = req.body.typeScore;

    var addActivity = db.collection('Activity').add({
        description: description,
        endTime: endTime,
        idCoordinator: idCoordinator,
        name: name,
        reward: reward,
        startTime: startTime,
        title: title,
        prize: prize,
        typeScore: typeScore,
        creationTime: fecha,
        status: status,

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
            res.status(200).send(activityDto);
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
            activity.id = doc.id;
            activityDto.push(activity);
        });

        res.status(200).send(activityDto);
    }).catch(function (error) {
        res.status(500).send({ msg: "Error. No se encontraron datos. Reintenta" });
    });
}


function registerScore(req, res) {
    /**
 * capturar data de actividad, y usuario,
 * almacenar data ok,
 * incrementar score y experiencia pte
 * bloquear participar en la actividad cuando se quiera ingresar nuevamente pte
 * 
 * 
 *   var activityId = req.body.activityId;
    var score = req.body.score;
    var experience = req.body.experience;
    var userId = req.body.uid;
    var idCoordinator = req.body.idCoordinator;
 * 
 */
    var dateScore = getDate();
    var userName = req.body.userName;
    var activityName = req.body.activityName;
    var activityId = req.body.activityId;
    var sco = req.body.score;
    var exp = req.body.experience;
    var uid = req.body.uid;
    // var idCoordinator = req.body.idCoordinator;
    var db = firebase.firestore();
    var guardarScore = db.collection('ActivityScore')
    var docRef = db.collection('Users').doc(uid);
    let promises = [];
    promises.push(guardarScore.add({

        activityId: activityId,
        score: sco,
        experience: exp,
        uid: uid,
        userName: userName,
        activityName: activityName,
        dateScore: dateScore,
    })
    );
    promises.push(docRef.get());
    return Promise.all(promises).then(promiseResult => {
        let res1 = promiseResult[0].id;
        let getUserData = promiseResult[1].data();
        var newExperience = 0;
        var newScore = 0;
        newExperience = parseInt(getUserData.experience) + parseInt(exp);
        newScore = parseInt(getUserData.score) + parseInt(sco);
        var setUser = docRef.update({
            experience: newExperience,
            score: newScore
        }).then(ref => {
            res.status(200).send({ msg: 'Puntaje Registrado exitosamente' });
        }).catch(err => {
            res.status(404).send({ msg: 'ERROR: NO SE HA PODIDO REGISTRAR', error: err });
        })

    })


}
function getAllScoreByActivity(req, res) {
    /**
     * consultar el puntaje almacenado de una actividad.
     * 
     * @requires activityId
     * @return activityScoreDto
     * 
     */
    var activityId = req.body.activityId;
    console.log(activityId);
    console.log("SVC: getAllScoreByActivity");

    var db = firebase.firestore();
    var projectRef = db.collection('ActivityScore');
    var activityScore = {};
    var activityScoreDto = new Array();
    var consult = projectRef.orderBy("score", "desc");
    var result = consult.get().then(function (snapshot) {
        snapshot.forEach(function (doc) {
            if (doc.data().activityId = activityId) {
                activityScore = {};
                activityScore = doc.data();
                activityScoreDto.push(activityScore);
            }
        });
        res.status(200).send(activityScoreDto);
    }).catch(function (error) {
        res.status(500).send({ msg: "Error. No se encontraron datos. Reintenta" });
    });
}
function updateItemStore(req, res) {
    var db = firebase.firestore();
    var itemId = req.body.itemId;
    console.log("variable del id");
    console.log(itemId);

    var projectRef = db.collection('Store').doc(itemId).update({
        amount: req.body.amount,
        description: req.body.description,
        name: req.body.name,
        scorePrice: req.body.scorePrice,

    }).then(ref => {
        console.log('Se modifico exitosamente la recompensa');
        res.status(200).send(req.body.itemId);
    }).catch(err => {
        res.status(404).send({ msg: 'Error no se ha podido modificar la recompensa' })
    })
}
function deleteItemStore(req, res) {
    var db = firebase.firestore();
    var itemId = req.body.itemId;
    console.log("el id del proyecto a eliminar es:");
    console.log(itemId);
    var projectRef = db.collection('Store');
    var deleteDoc = projectRef.doc(itemId).delete().then(function () {
        console.log("se elimino la recompensa correctamente");
        res.status(200).send({ msg: 'SE ELIMINO CORRECTAMENTE la Recompensa' });
    }).catch(function (error) {
        res.status(404).send({ msg: 'ERROR: NO SE PUDO ELIMINAR' });
    });

}
function getAllNotification(req, res) {

    console.log("SVC: getAllNotification");
    var id = req.body.id;
    var db = firebase.firestore();
    var projectRef = db.collection('Notify');
    var notification = {};
    var notificationDto = new Array();
    projectRef.get().then(function (snapshot) {
        snapshot.forEach(function (doc) {
            notification = {};
            console.log(doc.data())
            notification = doc.data();
            notification.id = doc.id;
            notificationDto.push(notification);
        });

        res.status(200).send(notificationDto);
    }).catch(function (error) {
        res.status(500).send({ msg: "Error. No se encontraron datos. Reintenta" });
    });
}

function getAllMedals(req, res) {

    console.log("SVC: getAllMedals");
    var id = req.body.id;
    var db = firebase.firestore();
    var projectRef = db.collection('Medals');
    var medals = {};
    var medalsDto = new Array();
    projectRef.get().then(function (snapshot) {
        snapshot.forEach(function (doc) {
            medals = {};
            console.log(doc.data())
            medals = doc.data();
            medals.id = doc.id;
            medalsDto.push(medals);
        });

        res.status(200).send(medalsDto);
    }).catch(function (error) {
        res.status(500).send({ msg: "Error. No se encontraron datos. Reintenta" });
    });
}
function deleteMedal(req, res) {
    var db = firebase.firestore();
    var id = req.body.id;
    console.log("el id de la medalla a eliminar es:");
    console.log(id);
    var projectRef = db.collection('Medals');
    var deleteDoc = projectRef.doc(id).delete().then(function () {
        console.log("se elimino la medalla correctamente");
        res.status(200).send({ msg: 'SE ELIMINO CORRECTAMENTE la medalla' });
    }).catch(function (error) {
        res.status(404).send({ msg: 'ERROR: NO SE PUDO ELIMINAR' });
    });
}

function updateMedal(req, res) {
    var db = firebase.firestore();
    var id = req.body.id;
    console.log("variable del id");
    console.log(id);

    var projectRef = db.collection('Medals').doc(id).update({
        name: req.body.name,
        description: req.body.description,
        requirementScore: req.body.requirementScore,

    }).then(ref => {
        console.log('Se modifico exitosamente la medalla');
        res.status(200).send(req.body.id);
    }).catch(err => {
        res.status(404).send({ msg: 'Error no se ha podido modificar la medalla' })
    })

}

function createMedal(req, res) {
    var db = firebase.firestore();
    var name = req.body.name;
    var description = req.body.description;
    var requirementScore = req.body.requirementScore;

    var addMedal = db.collection('Medals').add({
        name: name,
        description: description,
        requirementScore: requirementScore
    }).then(ref => {
        console.log('new created medal: ', ref.id);
        res.status(200).send({ id: ref.id });
    }).catch(err => {
        res.status(404).send({ msg: 'ERROR:', error: err });
    });


}
function deleteNotification(req, res) {
    var db = firebase.firestore();
    var id = req.body.id;
    console.log("el id de la notificacion a eliminar es:");
    console.log(id);

    var projectRef = db.collection('Notify');
    var deleteDoc = projectRef.doc(id).delete().then(function () {
        console.log("se elimino la notificacion correctamente");
        res.status(200).send({ msg: 'SE ELIMINO CORRECTAMENTE LA NOTIFICACION' });
    }).catch(function (error) {
        res.status(404).send({ msg: 'ERROR: NO SE PUDO ELIMINAR' });
    });
}
function getMedalById(req, res) {
    console.log("SVC getMedalById")
    var id = req.body.id;
    console.log(id)
    if (id == undefined || id == null || id == "") {
        res.status(200).send("no has enviado el parametro id")
    }
    var medalDto;
    console.log("SVC: getMedalById");
    var db = firebase.firestore();
    var projectRef = db.collection('Medals').doc(id);
    var getCollection = projectRef.get().then(doc => {
        if (!doc.exists) {
            res.status(404).send({ msg: 'Medalla no encontrada' })
        } else {
            medalDto = doc.data();
            medalDto.id = doc.id;
            res.status(200).send(medalDto);
        }
    })
        .catch(err => {
            console.log('ERROR: NO SE PUDO OBTENER EL PROYECTO', err);
        });
}
function deleteActivity(req, res) {
    var db = firebase.firestore();

    var id = req.body.id;
    console.log("el id de la actividad a eliminar es:");
    console.log(id);

    var projectRef = db.collection('Activity');
    var deleteDoc = projectRef.doc(id).delete().then(function () {
        console.log("se elimino la actividad correctamente");
        res.status(200).send({ msg: 'SE ELIMINO CORRECTAMENTE la actividad' });
    }).catch(function (error) {
        res.status(404).send({ msg: 'ERROR: NO SE PUDO ELIMINAR' });
    });
}

function updateActivity(req, res) {
    var db = firebase.firestore();
    var id = req.body.id;
    console.log("variable del id");
    console.log(id);

    var projectRef = db.collection('Activity').doc(id).update({
        name: req.body.name,
        description: req.body.description,
        endTime: req.body.endTime,
        reward: req.body.reward,
        rules: req.body.rules,
        startTime: req.body.startTime,
        prize: req.body.prize,
        medal: req.body.medal,
        title: req.body.title,
        dificulty: req.body.dificulty,

    }).then(ref => {
        console.log('Se modifico exitosamente la actividad');
        res.status(200).send(req.body.id);
    }).catch(err => {
        res.status(404).send({ msg: 'Error no se ha podido modificar la actividad' })
    })



}
// function getRewards(req,res){
//     var db=firebase.firestore();
//     var projectRef =db.collection('Activity');

//     let promise = []
//     promises.push(projectRef.get());
//     promise.push(firebase.auth().listUsers());

// }

function getTypeOfScore(req, res) {
    console.log("SVC: getTypeOfScore");
    var id = req.body.id;
    var db = firebase.firestore();
    var projectRef = db.collection('TypeScore');
    var score = {};
    var scoreDto = new Array();
    projectRef.get().then(function (snapshot) {
        snapshot.forEach(function (doc) {
            score = {};
            console.log(doc.data())
            score = doc.data();
            score.id = doc.id;
            scoreDto.push(score);
        });
        res.status(200).send(scoreDto);
    }).catch(function (error) {
        res.status(500).send({ msg: "Error. No se encontraron datos. Reintenta" });
    });
}
function deleteMedal(req, res) {
    var db = firebase.firestore();
    var id = req.body.id;
    console.log("el id de la actividad a eliminar es:");
    console.log(id);
    var projectRef = db.collection('Medals');
    var deleteDoc = projectRef.doc(id).delete().then(function () {
        console.log("se elimino la medalla correctamente");
        res.status(200).send({ msg: 'se elimino la medalla correctamente' });
    }).catch(function (error) {
        res.status(404).send({ msg: 'ERROR: NO SE PUDO ELIMINAR' });
    });
}

function createNotification(req, res) {
    var fecha = getDate();
    var db = firebase.firestore();
    var allUser = req.body.allUser;
    var title = req.body.title;
    var message = req.body.message;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var activity = req.body.activity;
    var addNotificacion = db.collection('Notify').add({
        allUser: allUser,
        title: title,
        message: message,
        startTime: startTime,
        creationTime: fecha,
        endTime: endTime,
        activity: activity,

    }).then(ref => {
        console.log('new created notification: ', ref.id);
        res.status(200).send({ id: ref.id });
    }).catch(err => {
        res.status(404).send({ msg: 'ERROR:', error: err });
    });
}

function saveActivity(req, res) {
    var fecha = getDate();
    var db = firebase.firestore();
    var id = req.body.id;
    var idActivity = req.body.id;
    var uid = req.body.uid;
    var description = req.body.description;
    var endTime = req.body.endTime;
    var idCoordinator = req.body.idCoordinator;
    var name = req.body.name;
    var reward = req.body.reward;
    var startTime = req.body.startTime;
    var status = req.body.status;
    var title = req.body.title;
    var typeScore = req.body.typeScore;
    var prize = req.body.prize;
    var medal = req.body.medal;
    var rules = req.body.rules;


    var addItem = db.collection('registerActivitys').add({
        id: id,
        idActivity:idActivity,
        uid: uid,
        creationTime: fecha,
        description: description,
        endTime: endTime,
        idCoordinator: idCoordinator,
        name: name,
        reward: reward,
        startTime: startTime,
        status: status,
        title: title,
        prize: prize,
        medal: medal,
        typeScore: typeScore,
        rules: rules,
    }).then(ref => {
        console.log('new created activity: ', ref.id);
        res.status(200).send({ id: ref.id });
    }).catch(err => {
        res.status(404).send({ msg: 'ERROR:', error: err });
    });

}
function getAllParticipatingUsers(req,res){
    var db = firebase.firestore();
    var projectRef = db.collection('ActivityScore');
    var activity = {};
    var activityDto = new Array();
    projectRef.get().then(function (snapshot) {
        snapshot.forEach(function (doc) {
            activity = {};
            console.log(doc.data())
            activity = doc.data();
            activity.id = doc.id;
         
            activityDto.push(activity);
        });

        res.status(200).send(activityDto);
    }).catch(function (error) {
        res.status(500).send({ msg: "Error. No se encontraron datos. Reintenta" });
    });

}

function getAllUsers(req, res) {
    console.log("SVC: getAllUsers");
    var id = req.body.id;
    var db = firebase.firestore();
    var projectRef = db.collection('Users');
    var user = {};
    var users = new Array();
    projectRef.get().then(function (snapshot) {
        snapshot.forEach(function (doc) {
            user = {};
            console.log(doc.data())
            user = doc.data();
            user.id = doc.id;
            users.push(user);
        });

        res.status(200).send(users);
    }).catch(function (error) {
        res.status(500).send({ msg: "Error. No se encontraron datos. Reintenta" });
    });
}

function updateUsers(req, res) {
    var db = firebase.firestore();
    var id = req.body.id;
    console.log("variable del id");
    console.log(id);

    var projectRef = db.collection('Users').doc(id).update({
        city: req.body.city,
        experience: req.body.experience,
        job: req.body.job,
        lastname: req.body.lastname,
        name: req.body.name,
        role: req.body.role,
        score: req.body.score,
        email: req.body.email,

    }).then(ref => {
        console.log('Se modifico exitosamente el usuario');
        res.status(200).send(req.body.id);
    }).catch(err => {
        res.status(404).send({ msg: 'Error no se ha podido modificar el usuario' })
    })

}
function getActivitiesParticipatingById(req,res){
    var activityId = req.body.activityId;
    console.log(activityId);
    var db = firebase.firestore();
    var projectRef = db.collection('ActivityScore');
    var activity = {};
    var activitys = new Array();
    projectRef.where("activityId", "==", activityId  ).get().then(function (snapshot) {
        snapshot.forEach(function (doc) {
            activity = {}
            activity.activityName = doc.data().activityName;
            activity.dateScore = doc.data().dateScore;
            activity.experience = doc.data().experience;
            activity.score = doc.data().score;
            activity.uid = doc.data().uid;
            activity.userName = doc.data().userName;
            activitys.push(activity);
        });
        res.status(200).send(activitys);
    }).catch(function (error) {
        res.status(500).send({ Error: error });
        console.log("Error getting documents: ", error);
    });
}
function getAllActivityRegister(req, res) {
    var db = firebase.firestore();
    var projectRef = db.collection('registerActivitys');
    var activity = {};
    var activityDto = new Array();
    projectRef.get().then(function (snapshot) {
        snapshot.forEach(function (doc) {
            activity = {};
            console.log(doc.data())
            activity = doc.data();
            activity.id = doc.id;
         
            activityDto.push(activity);
        });

        res.status(200).send(activityDto);
    }).catch(function (error) {
        res.status(500).send({ msg: "Error. No se encontraron datos. Reintenta" });
    });
}
function deleteUsers(req, res) {
    var db = firebase.firestore();
    var id = req.body.id;
    console.log("el id del usuario a eliminar es:");
    console.log(id);
    var projectRef = db.collection('Users');
    var deleteDoc = projectRef.doc(id).delete().then(function () {
        console.log("se elimino el usuario  correctamente");
        res.status(200).send({ msg: 'se elimino el usuario correctamente' });
    }).catch(function (error) {
        res.status(404).send({ msg: 'ERROR: NO SE PUDO ELIMINAR' });
    });
}
function createActivity(req, res) {
    var fecha = getDate();
    var db = firebase.firestore();

    var description = req.body.description;
    var endTime = req.body.endTime;
    var idCoordinator = req.body.idCoordinator;
    // var name = req.body.name;
    var dificulty = req.body.dificulty;
    var reward = req.body.reward;
    var startTime = req.body.startTime;
    var status = req.body.status;
    var title = req.body.title;
    var typeScore = req.body.typeScore;
    var prize = req.body.prize;
    var medal = req.body.medal;
    var rules = req.body.rules;

    var addItem = db.collection('Activity').add({
        creationTime: fecha,
        description: description,
        endTime: endTime,
        idCoordinator: idCoordinator,
        // name: name,
        dificulty: dificulty,
        reward: reward,
        startTime: startTime,
        status: status,
        title: title,
        prize: prize,
        medal: medal,
        typeScore: typeScore,
        rules: rules,
    }).then(ref => {
        console.log('new created activity: ', ref.id);
        res.status(200).send({ id: ref.id });
    }).catch(err => {
        res.status(404).send({ msg: 'ERROR:', error: err });
    });

}


module.exports = {
    newActivity,
    getActivity,
    getAllActivityByCoordinator,
    getAllActivity,
    registerScore,
    getAllScoreByActivity,
    updateItemStore,
    deleteItemStore,
    createActivity,
    createMedal,
    updateMedal,
    deleteMedal,
    getAllMedals,
    getMedalById,
    deleteActivity,
    updateActivity,
    getTypeOfScore,
    createNotification,
    updateNotification,
    deleteNotification,
    getAllNotification,
    saveActivity,
    getAllUsers,
    deleteUsers,
    updateUsers,
    getAllActivityRegister,
    getAllParticipatingUsers,
    getActivitiesParticipatingById,


}