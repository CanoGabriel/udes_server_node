const express = require('express');
const app= express();
const cors= require('cors');
const Partie = require('../modeles/partie.js');
const Joueur = require('../modeles/joueur.js');


app.use('/scripts',express.static(__dirname+'/../partie-client'));

/* GET home page. */
app.get('/',cors({allowedHeaders:['Content-Type','Authorization']}), function (req, res, next) {

  const p = new Partie(new Joueur('Albert', 'Ramos', 28, 56, 'Espagne'), new Joueur('Milos', 'Raonic', 28, 16, 'Canada'), '1', 'hale', '12h30');
  const p2= new Partie(new Joueur('All', 'Might', 32, 1, 'USA'), new Joueur('Midorya', 'Izuku', 16, 100, 'Japon'), '2', 'MHA', '14h30');
  const tab=[p,p2];
  res.send(tab);
});

app.get('/client-side',function(req,res,next){
    res.setHeader("Content-Type", "text/html");
    res.sendFile('/accueil.html',{"root": __dirname+'/../partie-client'});
});

app.get('/client-side/details/:id',function(req,res,next){
    res.setHeader("Content-Type", "text/html");
    res.sendFile('/details.html',{"root": __dirname+'/../partie-client'});
});

module.exports = app;
