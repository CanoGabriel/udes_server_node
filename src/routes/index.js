const express = require('express');
const app= express();
const cors= require('cors');
const Partie = require('../modeles/partie.js');
const Joueur = require('../modeles/joueur.js');
const webpush = require('web-push');
var engines = require('consolidate');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

app.use('/scripts',express.static(__dirname+'/../partie-client'));
app.use('/src',express.static(__dirname+'/..'));
app.use(express.static(__dirname+'/../..'));
app.set('views', __dirname + '/../partie-client');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

/* GET home page. */
app.get('/',cors({allowedHeaders:['Content-Type','Authorization']}), function (req, res, next) {

  const p = new Partie(new Joueur('Albert', 'Ramos', 28, 56, 'Espagne'), new Joueur('Milos', 'Raonic', 28, 16, 'Canada'), '1', 'hale', '12h30');
  const p2= new Partie(new Joueur('All', 'Might', 32, 1, 'USA'), new Joueur('Midorya', 'Izuku', 16, 100, 'Japon'), '2', 'MHA', '14h30');
  const tab=[p,p2];
  res.send(tab);
});

app.get('/client-side',cors({allowedHeaders:['Content-Type','Authorization']}),function(req,res){
    res.setHeader("Content-Type", "text/html");
    res.render(__dirname+'/../partie-client/accueil.html');
});

app.get('/client-side/details/:id',cors({allowedHeaders:['Content-Type','Authorization']}),function(req,res){
    res.setHeader("Content-Type", "text/html");
    res.render(__dirname+'/../partie-client/details.html',{id: req.params.id});
});

const saveToDatabase = async subscription => {

    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        //var myobj = { name: "Company Inc", address: "Highway 37" };
        dbo.collection("subscription").insertOne(subscription, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
};
const vapidKeys = {
    publicKey:
        'BJ2J5EmxJBHWEgkIQ6wT5-fhmLeQszDFnCPoSvYU7xNg4jA-5qiPYWTZKyK5R3fIvCXeKuyRAmsGV_QHJH0Yc_w',
    privateKey: 'Eb0M-Jj4RM3jP_g2uXN_Wdn4LDAK3huuZIwd9jTn_C8'
};

webpush.setVapidDetails(
    'mailto:alex.couppoussamy@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);
const sendNotification = (subscription, dataToSend='') => {
    webpush.sendNotification(subscription, dataToSend).catch(function(err){
        console.log('Error activation', err)
    })
};

app.post('/client-side/save-subscription',cors({allowedHeaders:['Content-Type','Authorization']}),async (req,res)=>{

    const subscription = req.body
    await saveToDatabase(subscription) //Method to save the subscription to Database
    res.json({ message: 'success' })
});

app.get('/send-notification',cors({allowedHeaders:['Content-Type','Authorization']}), (req, res) => {
    let sub;
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("subscription").findOne({}, function(err, result) {
            if (err) throw err;
            sub=result;
            const message = 'Hello World';
            sendNotification(sub, message);
            console.log(sub);
            res.json({ message: 'message sent' });
            db.close();
        });
    });

});

module.exports = app;
