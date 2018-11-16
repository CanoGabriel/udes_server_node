const express = require('express');
const router = express.Router();

const Partie = require('../modeles/partie.js');
const Joueur = require('../modeles/joueur.js');

/* GET home page. */
router.get('/',cors({allowedHeaders:['Content-Type','Authorization']}), function (req, res, next) {

  const p = new Partie(new Joueur('Albert', 'Ramos', 28, 56, 'Espagne'), new Joueur('Milos', 'Raonic', 28, 16, 'Canada'), '1', 'hale', '12h30');
  const p2= new Partie(new Joueur('All', 'Might', 32, 1, 'USA'), new Joueur('Midorya', 'Izuku', 16, 100, 'Japon'), '2', 'MHA', '14h30');
  const tab=[p,p2];
  // res.send('Bienvenu dans le serveur du service Échanges.');
  res.send(tab);
});
module.exports = router;
