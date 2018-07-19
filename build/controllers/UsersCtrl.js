'use strict'
var firebase = require('firebase-admin');

function getUserData(req, res) {
    /**
     * servicio para consultar la informacion del perfil del usuario.
     * @requires: id: id identificador del usuario en la base de datos
     * @returns: userDto: Dto con la informacion encontrada del usuario
     */
    var id = req.body.id;
    var userDto;
    console.log("SVC: getUserData");
    var db = firebase.firestore();
    var projectRef = db.collection('Users').doc(id);
    var getCollection = projectRef.get().then(doc => {
        if (!doc.exists) {
            res.status(404).send({ msg: 'Usuario No Encontrado' })
        } else {
            userDto = doc.data();
            res.status(200).send(userDto);
        }
    })
        .catch(err => {
            console.log('ERROR: NO SE PUDO OBTENER EL USUARIO', err);
        });

}
function getUsers(req, res) {
    /**
     * pendiente probar si es necesario implementar array promises para el caso de tener varias medallas un mismo usuario
     * 
     */

    var db = firebase.firestore();
    var projectRef = db.collection('Users');
    let promises = [];
    promises.push(projectRef.get());
    promises.push(projectRef.doc(id).collection('WinedMedals').get());

    var user = {};
    var medal = {};
    var medals = new Array();
    var users = new Array();
    var result = new Array();

    return Promise.all(promises).then(promiseResult => {
        let userData = promiseResult[0];
        userData.forEach(function (doc) {
            var id = doc.id;
            user = doc.data();
            users.push(user);
            projectRef.doc(id).collection('WinedMedals').get().then(function (snapshot) {
                snapshot.forEach(function (doc2) {
                    medal = doc2.data();
                    medals.push(medal);
                })
                users.push(medals);
                result.push(users)
                res.status(200).send({ result });
            });


        });
        //  res.status(200).send({ users, medals });
    }
    )

}
function createUserInDB(req, res) {
    /**
     * servicio que crea en firestore con el uid que retorno al registrar un usuario.
     *  se utiliza para que los uid de auth y de firestore coincidan
     */
    console.log('SVC: createUserInDB')
    var db = firebase.firestore();
    var uid = req.body.uid;

    var addUser = db.collection('Users').doc(uid).set({
        id: uid,
        Role: "Usuario"

    }).then(ref => {
        console.log('new user created: ', uid);
        res.status(200).send({ uid });
    }).catch(err => {
        res.status(404).send({ msg: 'ERROR:', error: err });
    });


}
function getStoreItem(req, res) {
    /**
     * servicio para comprar un item de la tienda
     * @requires
     * uid= user id
     * idItem =  id del articulo que esta adquiriendo el usuario 
     */

    // var dateScore = getDate();
    var uid = req.body.uid;
    var idItem = req.body.idItem;

if(uid==undefined || uid ==null || uid =="" ){
    res.status(200).send("no has enviado el parametro uid")
}
if(idItem==undefined || idItem ==null || idItem =="" ){
    res.status(200).send("no has enviado el parametro idItem")
}
    var db = firebase.firestore();
    var getScore = db.collection('Store').doc(idItem)
    var getUser = db.collection('Users').doc(uid);

    var newItemAmount;
    var newUserScore;
    let promises = [];
    promises.push(getScore.get());
    promises.push(getUser.get());
    return Promise.all(promises).then(promiseResult => {
        let itemData = promiseResult[0].data();
        let userData = promiseResult[1].data();


        newItemAmount = itemData.amount - 1;
        newUserScore = userData.score - itemData.scorePrice;
        let promisesSend = [];
        if (newUserScore >= 0 && newItemAmount >= 0) {
            console.log("NEW SCORE OK")
            promisesSend.push(getScore.update({
                amount: newItemAmount,
            }
            ));
            promisesSend.push(getUser.update({
                score: newUserScore,
            })
            );

            return Promise.all(promisesSend).then(promisesResult2 => {
                let res1 = promisesResult2[0];
                let res2 = promisesResult2[1];
                var newItem = db.collection('ItemsAdquired');
                var create = newItem.add({
                    uid: uid,
                    idItem: idItem,
                }).then(ref => {
                    res.status(200).send("Has Adquirido un nuevo Item");
                }).catch(err => {
                    res.status(404).send("ha ocurrido un error, no hemos podido validar tu compra");
                });
                //

                //                res.status(200).send("Has Adquirido el item correctamente");
            });
        }
        else if (newItemAmount < 0) {
            res.status(200).send("Lo sentimos, el item que estas tratando de adquirir ya no lo tenemos disponible");
        }
        else if (newUserScore < 0) {
            res.status(200).send("No tienes aun el score necesario para adquirir el item");
        }

    });
}
function getAllItemsStore(req, res) {

    var db = firebase.firestore();
    var projectRef = db.collection('Store');
    var item = {};
    var itemDto = new Array();
    projectRef.get().then(function (snapshot) {
        snapshot.forEach(function (doc) {
            item = {};

            item = doc.data();
            item.id = doc.id;

            itemDto.push(item);
        });

        res.status(200).send(itemDto);
    }).catch(function (error) {
        res.status(500).send({ msg: "Error. No se encontraron datos. Reintenta" });
    });
}

function getItemById(req, res) {
    var itemId = req.body.itemId;
    var itemDto;
    console.log("SVC: getItemById");
    var db = firebase.firestore();
    var projectRef = db.collection('Store').doc(itemId);
    var getCollection = projectRef.get().then(doc => {
        if (!doc.exists) {
            res.status(404).send({ msg: 'Actividad no encontrada' })
        } else {
            itemDto = doc.data();
            res.status(200).send(itemDto);
        }
    })
        .catch(err => {
            console.log('ERROR: NO SE PUDO OBTENER EL PROYECTO', err);
        });
}

function newItemStore(req, res) {

    var db = firebase.firestore();
    var amount = req.body.amount;
    var description = req.body.description;
    var name = req.body.name;
    var scorePrice = req.body.scorePrice;

    var addItem = db.collection('Store').add({
        amount: amount,
        description: description,
        name: name,
        scorePrice: scorePrice,

    }).then(ref => {
        console.log('new Item Created: ', ref.id);
        res.status(200).send({ itemId: ref.id });
    }).catch(err => {
        res.status(404).send({ msg: 'ERROR:', error: err });
    });



}

module.exports = {
    getUserData,
    getUsers,
    createUserInDB,
    getStoreItem,
    getAllItemsStore,
    getItemById,
    newItemStore,

}