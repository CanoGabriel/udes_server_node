class Paris {

  constructor (id,ip, montant, id_match,vainqueur){
    this.id = id;
    this.ip = ip;
    this.montant = montant;
    this.id_match = id_match;
    this.state = 0;
    this.vainqueur = vainqueur;
    this.gain = undefined;
  }

  toJSON () {
    return {
      'id': this.id,
      'ip': this.ip,
      'montant': this.montant,
      'id_match': this.id_match,
      'state': this.state,
      'vainqueur': this.vainqueur,
      'gain': this.gain
    };
  }

  static getParis(id){
    var montant = Math.floor(Math.random() * 100);
    var id_match = Math.floor(Math.random() * 5);
    var vainqueur = (Math.random() > 0.5)?1:2;
    return new Paris(id,"::ffff:192.168.0.144",montant,id_match, vainqueur);
  }
}

module.exports = Paris;
