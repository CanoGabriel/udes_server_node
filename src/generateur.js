const Partie = require('./modeles/partie');
const Joueur = require('./modeles/joueur');
const Paris = require('./modeles/paris');
var MongoClient = require('mongodb').MongoClient;
var bdd= require('./modeles/notifications');
const url= "mongodb://localhost:27017/";
var assert= require('assert')

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

        MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            console.log("partie.ident: "+partie.ident);
            var tab= dbo.collection("paris").find({id: partie.ident.toString()}).toArray();
            tab.then(function (res) {
                console.log("res.length: "+res.length);
                for(let i=0;i<res.length;i++){
                    console.log(res[i].name.toString())
                    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db){
                        if (err) throw err;
                        var dbo = db.db("mydb");

                        dbo.collection("user").findOne({name: res[i].name.toString()}, function(err, result) {
                            if (err) throw err;
                            console.log("user trouvé "+res[i].name);
                            if(result.connected){
                                let nom;
                                if(partie.pointage.vainqueur==0){
                                    nom= partie.joueur1.prenom+" "+partie.joueur1.nom;
                                }
                                else{
                                    nom= partie.joueur2.prenom+" "+partie.joueur2.nom;
                                }

                                if(res[i].joueur.toString()=== nom.toString()){
                                    var msg= res[i].name+" a gagné "+res[i].montant+" dollars pour la victoire de "+res[i].joueur;
                                    bdd(url, msg)
                                    console.log(msg);
                                }
                                else{
                                    var msg= res[i].name+" a perdu "+res[i].montant+" dollars pour la défaite de "+res[i].joueur;
                                    bdd(url, msg)
                                    console.log(msg);
                                }
                                MongoClient.connect(url, { useNewUrlParser: true },function(err,db){
                                    if (err) throw err;
                                    var dbo = db.db("mydb");
                                    dbo.collection("paris").deleteOne({name:res[i].name.toString(), id: partie.ident.toString()})
                                    db.close()
                                })
                            }
                            else{
                                MongoClient.connect(url, { useNewUrlParser: true },function(err,db){
                                    if (err) throw err;
                                    var dbo = db.db("mydb");
                                    var resultat;
                                    if(partie.pointage.vainqueur==0){
                                        resultat= partie.joueur1.prenom+" "+partie.joueur1.nom;
                                    }
                                    else{
                                        resultat= partie.joueur2.prenom+" "+partie.joueur2.nom;
                                    }
                                    if(resultat== res[i].joueur.toString()){
                                        resultat="true"
                                    }
                                    else{
                                        resultat="false"
                                    }
                                    res[i].resultat= resultat;
                                    dbo.collection("paris_en_attente").insertOne(res[i])
                                    console.log("paris en attente")
                                    db.close()
                                })

                                MongoClient.connect(url, { useNewUrlParser: true },function(err,db){
                                    if (err) throw err;
                                    var dbo = db.db("mydb");
                                    dbo.collection("paris").deleteOne({name:res[i].name.toString(), id: partie.ident.toString()})
                                    db.close()
                                })

                            }
                            db.close();
                        })
                        db.close();
                    })

                }
            }).catch(function(err){
                if(err) throw err;
            })


            console.log("paris parcouru")
            db.close();
        });

      clearInterval(timer);
    }
  }, Math.floor(1000 / modificateurVitesse));
}

module.exports = {};
module.exports.demarrer = demarrer;
module.exports.liste_partie = listePartie;
module.exports.liste_paris = listeParis;
module.exports.compteur_id = compteur_id;
