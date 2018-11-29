const Partie = require('./modeles/partie');
const Joueur = require('./modeles/joueur');
const Paris = require('./modeles/paris');
var MongoClient = require('mongodb').MongoClient;;

const modificateurVitesse = Math.max(process.argv[2], 1);

const listePartie = [];
const listeParis = [];

let compteur_id = 0;
listePartie.push(new Partie(new Joueur('Albert', 'Ramos', 28, 56, 'Espagne'), new Joueur('Milos', 'Raonic', 28, 16, 'Canada'), '1', 'Hale', '12h30', 0,compteur_id++));
listePartie.push(new Partie(new Joueur('Andy', 'Murray', 28, 132, 'Angleterre'), new Joueur('Andy', 'Roddick', 36, 1000, 'États-Unis'), '2', 'Hale', '13h00', 30,compteur_id++));
listePartie.push(Partie.getPartie(compteur_id++));
listePartie.push(Partie.getPartie(compteur_id++));
listePartie.push(Partie.getPartie(compteur_id++));
listePartie.push(Partie.getPartie(compteur_id++));
listePartie.push(Partie.getPartie(compteur_id++));
listePartie.push(Partie.getPartie(compteur_id++));

listeParis.push(Paris.getParis(compteur_id++));
listeParis.push(Paris.getParis(compteur_id++));
listeParis.push(Paris.getParis(compteur_id++));
listeParis.push(Paris.getParis(compteur_id++));
listeParis.push(Paris.getParis(compteur_id++));

const demarrer = function () {
  let tick = 0;
  setInterval(function () {
    for (const partie in listePartie) {
      if (listePartie[partie].tick_debut === tick) {
        demarrerPartie(listePartie[partie]);
      }
    }

    tick += 1;
  }, Math.floor(1000 / modificateurVitesse));
};

function demarrerPartie (partie) {
  const timer = setInterval(function () {
    partie.jouerTour();
    if (partie.estTerminee()) {
      var liste = [];
      var total  = 0;
      var nb_gagnant = 0;
      for (let i = 0; i < listeParis.length; i++) {
        if(listeParis[i].id_match == partie.ident){
          liste.push(listeParis[i]);
          total += listeParis[i].montant;
          nb_gagnant++;
          if(partie.pointage.vainqueur == listeParis[i].vainqueur){
            listeParis[i].state = 1;
          }
          else{
            listeParis[i].state = -1;
          }
        }
      }
      for (let i = 0; i < liste.length; i++) {
        if(partie.pointage.vainqueur == liste[i].vainqueur){
          liste[i].gain = (0.75 * total)/nb_gagnant;
        }
      }
      console.log("Gain serveur : " + 0.25 * total + " pour le match d'id " + partie.ident);
      clearInterval(timer);
    }
  }, Math.floor(1000 / modificateurVitesse));
}

module.exports = {};
module.exports.demarrer = demarrer;
module.exports.liste_partie = listePartie;
module.exports.liste_paris = listeParis;
module.exports.compteur_id = compteur_id;
