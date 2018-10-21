class Paris {
  constructor (id, montant, id_match,vainqueur){
    this.id = id;
    this.montant = montant;
    this.id_match = id_match;
    this.state = 0;
    this.vainqueur
  }

  ajouterParisListe(){

  }

  isPariable(){
    return (this.pointage.manches[0]+this.pointage.manches[1] < 1);
  }

}
