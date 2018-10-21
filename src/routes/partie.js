const express = require('express');
const router = express.Router();

const gen = require('../generateur');

function getPartieById(id){
  for (i = 0; i < gen.liste_partie.length; i++) {
    if(''+gen.liste_partie[i].ident == ''+id){
      return gen.liste_partie[i];
    }
  }
}

/* GET parties listing. */
router.get('/', function (req, res, next) {
  res.send(gen.liste_partie);
});

router.get('/:id', function (req, res, next) {
  res.send(getPartieById(req.params.id));
});

module.exports = router;
