class Joueur {
  constructor (prenom, nom, age, rang, pays) {
    this.prenom = prenom;
    this.nom = nom;
    this.age = age;
    this.rang = rang;
    this.pays = pays;
  }
  static getPays(){
    return this.PAYS[Math.floor(Math.random() * this.PAYS.length)];
  }

  static getNomPrenom(){
    return this.NAME[Math.floor(Math.random() * this.NAME.length)];
  }

  static getAge(){
    return  20 + Math.floor(Math.random() * 30);
  }

  static getRang(){
    return  1 + Math.floor(Math.random() * 1000);
  }

  static getJoueur(){
    var t = this.getNomPrenom();
    var _nom = t[1];
    var _prenom = t[0];
    var _age = this.getAge();
    var _rang = this.getRang();
    var _pays = this.getPays();
    return new Joueur(_prenom,_nom,_age,_rang,_pays);
  }
}

Joueur.PAYS = [
  "Allemagne", "Albanie", "Andorre", "Arménie", "Autriche", "Azerbaïdjan", "Belgique", "Biélorussie" ,
  "Bosnie-Herzégovine", "Bulgarie", "Chypre", "Croatie", "Danemark", "Espagne", "Estonie", "Finlande", "France" ,
  "Géorgie", "Grèce", "Hongrie", "Irlande", "Islande", "Italie", "Lettonie", "Liechtenstein", "Lituanie", "Luxembourg",
  "République de Macédoine", "Malte", "Moldavie", "Monaco", "Monténégro", "Norvège", "Pays-Bas", "Pologne", "Portugal",
  "République", "tchèque", "Roumanie", "Royaume-Uni", "Russie", "Saint-Marin", "Serbie", "Slovaquie", "Slovénie", "Suède",
  "Suisse", "Ukraine", "Vatican"
];

Joueur.NAME = [
  ["Abel", "Auboisdormant"], ["Agnès", "Moitrankil"], ["Aïcha", "Fémal"], ["Alain", "Di"], ["Alain", "Proviste"],
  ["Alain", "Tuission"], ["Alain", "Verse"], ["Amar", "Di"], ["Amédée", "Bu"], ["Amédée", "Pan"], ["Anna", "Conda"],
  ["Annie", "Versaire"], ["Aude", "Javel"], ["Berthe", "Zéprofit"], ["Beth", "Rave"], ["Camille", "Honête"], ["Carry", "Bout"],
  ["Cécile", "Encieu"], ["David", "Etonsac"], ["Eddy", "Moitou"], ["Elmer", "Itmieu"], ["Elsa", "Bitacoté"], ["Eva", "Peauré"],
  ["Félicie", "Tation"], ["Gaspard", "Alizan"], ["Gérard", "Menvussa"], ["Harry", "Stocrate"], ["Ines", "Spéré"],
  ["Jacques", "Ouzi"], ["Jade", "Mire"], ["Jade", "Or"], ["Jamal", "Partout"], ["Jean", "Conépas"], ["Jean", "Tanrien"],
  ["Jerry", "Golay"], ["Juste", "Icier"], ["Justin", "Ptipeu"], ["Kelly", "Diossi"], ["Laure", "Dure"], ["Lili", "Coptère"],
  ["Luc", "Ratif"], ["Marie", "Rouana"], ["Maud", "Erateur"], ["Mehdi", "Cament"], ["Modeste", "Oma"], ["Nestor", "Ticoli"],
  ["Nordine", "Ateur"], ["Oussama", "Férir"], ["Oussama", "Lairbizar"], ["Pat", "Icier"], ["Paul", "Hémique"],
  ["Phil", "Danstachambre"], ["Ray", "Ciproque"], ["Sam", "Convient"], ["Tim", "Hagine"], ["Vishnou", "Lapaix"],
  ["Xavier", "Kafairgaf"], ["Zackary", "Amablag"]
];

module.exports = Joueur;
