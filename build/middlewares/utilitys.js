'use strict'
exports.verifyId = function(req, res, next){
    if (!req.params.id) {
        log.debug('La peticion no contiene un id de proyecto');
        return res.status(403).send({ msg: 'La petición no contiene un id de proyecto' });
      } else {
          next();
      }
};