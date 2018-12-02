const Pointage = require('./pointage.js');
const Joueur = require('./joueur');
var url = "mongodb://localhost:27017/";
const bdd= require('./notifications');


class Partie {



  constructor (joueur1, joueur2, terrain, tournoi, heureDebut, tickDebut, ident) {
    this.joueur1 = joueur1;
    this.joueur2 = joueur2;
    this.terrain = terrain;
    this.tournoi = tournoi;
    this.heure_debut = heureDebut;
    this.pointage = new Pointage(this);
    this.temps_partie = 0;
    this.joueur_au_service = Math.floor(Math.random() * 2);
    this.vitesse_dernier_service = 0;
    this.nombre_coup_dernier_echange = 0;
    this.constestation = [3, 3];
    this.tick_debut = tickDebut;
    this.nombre_tentative_contestation = [0, 0];
    this.ident = ident;
  }

  jouerTour () {
    let contestationReussi = false;
    if ((Math.random() * 100) < 3) { // 3% de contestation
      const contestant = Math.floor(Math.random() * 2);
      this.nombre_tentative_contestation[contestant]++;
      if (!Partie.contester()) {
        //cas ou le joueur effectuant une contestation n'est pas pris en compte...
        this.constestation[contestant] = Math.max(0, this.constestation[contestant] - 1);
        console.log('contestation echouee');
        if(contestant==0)
        {
            const j= "La contestation de "+this.joueur1.prenom+" "+this.joueur1.nom+" a echouee"
            bdd(url,j);
        }
        else{
            const j= "La contestation de "+this.joueur2.prenom+" "+this.joueur2.nom+" a echouee"
            bdd(url,j);
        }


      } else {
        contestationReussi = true;
        console.log('contestation reussie');
        if(contestant==0)
        {
            const j= "La contestation de "+this.joueur1.prenom+" "+this.joueur1.nom+" a reussi"
            bdd(url,j);
        }
        else{
            const j= "La contestation de "+this.joueur2.prenom+" "+this.joueur2.nom+" a reussi"
            bdd(url,j);
        }
      }
    }

    if (!contestationReussi) {
      let j= (Math.floor(Math.random() * 2));
      if(j==0){
        let name= this.joueur1.prenom+" "+this.joueur1.nom;
        this.pointage.ajouterPoint(j,name);
      }
      else{
          let name= this.joueur2.prenom+" "+this.joueur2.nom;
          this.pointage.ajouterPoint(name);
      }

    }
    this.temps_partie += Math.floor(Math.random() * 60); // entre 0 et 60 secondes entre chaque point
    this.vitesse_dernier_service = Math.floor(Math.random() * (250 - 60 + 1)) + 60; // entre 60 et 250 km/h
    this.nombre_coup_dernier_echange = Math.floor(Math.random() * (30 - 1 + 1)) + 1; // entre 1 et 30 coups par échange
  }

  static contester () {
    return (Math.random() * 100) > 25; // 75% de chance que la contestation passe
  }

  changerServeur () {
    this.joueur_au_service = (this.joueur_au_service + 1) % 2;
  }

  nouvelleManche () {
    this.constestation = [3, 3];
  }

  estTerminee () {
    return this.pointage.final;
  }

  toJSON () {
    return {
      'id': this.ident,
      'joueur1': this.joueur1,
      'joueur2': this.joueur2,
      'terrain': this.terrain,
      'tournoi': this.tournoi,
      'heure_debut': this.heure_debut,
      'pointage': this.pointage,
      'temps_partie': this.temps_partie,
      'serveur': this.joueur_au_service,
      'vitesse_dernier_service': this.vitesse_dernier_service,
      'nombre_coup_dernier_echange': this.nombre_coup_dernier_echange,
      'constestation': this.constestation,
      'nombre_tentative_contestation': this.nombre_tentative_contestation,
	  'tickDebut': this.tick_debut
    };
  }

  static getHeureDebut(){
    var heure = Math.floor(Math.random() * 24);
    var minute = Math.floor(Math.random() * 12) * 5;
    return ''+heure+'h'+minute;
  }

  static getPartie(ident){
    var terrain = Math.floor(Math.random() * 10);
    var tournoi = this.TOURNOI[Math.floor(Math.random() * this.TOURNOI.length)];
    var heureDebut = this.getHeureDebut();
    var tickDebut = Math.floor(Math.random() * 200);
    return new Partie(Joueur.getJoueur(), Joueur.getJoueur(), terrain, tournoi, heureDebut, tickDebut,ident)
  }

  isPariable(){
    return (this.pointage.manches[0]+this.pointage.manches[1] < 1);
  }
}

Partie.TOURNOI = [
  "Aircel Chennai Open", "Qatar ExxonMobil Open", "Apia International Sydney",
  "ASB Classic", "Australian Open", "Open Sud de France", "Ecuador Open",
  "Garanti Koza Sofia Open", "ABN AMRO World Tennis Tournament", "Argentina Open",
  "Memphis Open"
];

module.exports = Partie;
