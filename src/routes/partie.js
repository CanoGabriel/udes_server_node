const express = require('express');
const router = express.Router();
const cors= require('cors');
const gen = require('../generateur');
const app= express();

function getPartieById(id){
  for (i = 0; i < gen.liste_partie.length; i++) {
    if(''+gen.liste_partie[i].ident == ''+id){
      return gen.liste_partie[i];
    }
  }
}

/* GET parties listing. */
app.get('/',cors({allowedHeaders:['Content-Type','Authorization']}), function (req, res, next) {
  res.send(gen.liste_partie);
});

app.get('/:id', function (req, res, next) {
  res.send(getPartieById(req.params.id));
});

module.exports = app;
