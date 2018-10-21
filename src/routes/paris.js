const express = require('express');
const router = express.Router();

const gen = require('../generateur');
const Paris = require('./paris');


function searchByPartieId(listeParis, id){
  var liste = [];
  for (i = 0; i < listeParis.length; i++) {
    if(listeParis[i].id_match == ''+id){
      console.log(listeParis[i].id_match + " : " + id);
      liste.push(listeParis[i]);
    }
  }
  return liste;
}
/* GET parties listing. */
router.get('/', function (req, res, next) {
  res.send(gen.liste_paris);
});

router.get('/:id', function (req, res, next) {
  var liste = searchByPartieId(gen.liste_paris,req.params.id)
  res.send(liste);
});

module.exports = router;
