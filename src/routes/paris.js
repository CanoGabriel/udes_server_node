const express = require('express');
const router = express.Router();

const gen = require('../generateur');
const Paris = require('../modeles/paris');
const Partie = require('../modeles/partie');


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

function partieExist(listePartie, id){
  for (i = 0; i < listePartie.length; i++) {
    if(listePartie[i].ident == ''+id){
      return true;
    }
  }
  return false;
}
/* GET parties listing. */
router.get('/', function (req, res, next) {
  res.send(gen.liste_paris);
});

router.get('/my', function (req, res, next) {
  var ip = (req.headers['x-forwarded-for'] ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  req.connection.socket.remoteAddress).split(",")[0];
  var liste = [];
  for (i = 0; i < gen.liste_paris.length; i++) {
    console.log(ip + ' | '+gen.liste_paris[i].ip);
    if(gen.liste_paris[i].ip == ''+ip){
      let p ={
        'id': gen.liste_paris[i].id,
        'montant': gen.liste_paris[i].montant,
        'id_match':gen.liste_paris[i].id_match,
        'state':gen.liste_paris[i].state,
        'gain':gen.liste_paris[i].gain
      };
      liste.push(p);
    }
  }
  res.send(liste);
});

router.post('/',function(req,res,next){
  var montant = req.body.montant;
  var id_match = req.body.id_match;
  var vainqueur = req.body.vainqueur;
  var ip = (req.headers['x-forwarded-for'] ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  req.connection.socket.remoteAddress).split(",")[0];
  var paris = new Paris(gen.compteur_id++,ip,montant,id_match,vainqueur);
  if(!partieExist(gen.liste_partie,paris.id_match)){
    res.status(500).send('Ce match n\'existe pas');
  }
  else{
    var partie = new Partie(0,0,0,0,0,0,0);
    partie.joueur1 =                       gen.liste_partie[paris.id_match].joueur1;
    partie.joueur2 =                       gen.liste_partie[paris.id_match].joueur2;
    partie.terrain =                       gen.liste_partie[paris.id_match].terrain;
    partie.tournoi =                       gen.liste_partie[paris.id_match].tournoi;
    partie.heure_debut =                   gen.liste_partie[paris.id_match].heure_debut;
    partie.pointage =                      gen.liste_partie[paris.id_match].pointage;
    partie.temps_partie =                  gen.liste_partie[paris.id_match].temps_partie;
    partie.joueur_au_service =             gen.liste_partie[paris.id_match].joueur_au_service;
    partie.vitesse_dernier_service =       gen.liste_partie[paris.id_match].vitesse_dernier_service;
    partie.nombre_coup_dernier_echange =   gen.liste_partie[paris.id_match].nombre_coup_dernier_echange;
    partie.constestation =                 gen.liste_partie[paris.id_match].constestation;
    partie.tick_debut =                    gen.liste_partie[paris.id_match].tick_debut;
    partie.nombre_tentative_contestation = gen.liste_partie[paris.id_match].nombre_tentative_contestation;
    partie.ident =                         gen.liste_partie[paris.id_match].ident;

    if(partie.isPariable()){
      gen.liste_paris.push(paris);
      res.send({
        'id': paris.id,
        'ip': paris.ip,
        'montant': paris.montant,
        'id_match':paris.id_match
      });
    }
    else{
      res.status(500).send('Tu ne peux pas parier sur ce match');
    }
  }
});

router.get('/:id', function (req, res, next) {
  var liste = searchByPartieId(gen.liste_paris,req.params.id)
  res.send(liste);
});

module.exports = router;
