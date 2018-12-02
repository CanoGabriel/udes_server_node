const express = require('express');
const app= express();
const cors= require('cors');
const Partie = require('../modeles/partie.js');
const Joueur = require('../modeles/joueur.js');
const webpush = require('web-push');
var engines = require('consolidate');
var bdd= require('../modeles/notifications');

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

  /*const p = new Partie(new Joueur('Albert', 'Ramos', 28, 56, 'Espagne'), new Joueur('Milos', 'Raonic', 28, 16, 'Canada'), '1', 'hale', '12h30');
  const p2= new Partie(new Joueur('All', 'Might', 32, 1, 'USA'), new Joueur('Midorya', 'Izuku', 16, 100, 'Japon'), '2', 'MHA', '14h30');
  const tab=[p,p2];*/


  res.render(__dirname+'/../partie-client/connexion.html');
});

app.post('/connexion',function(req,res){
    console.log(req.body);
    let name= req.body.uname;
    let pwd= req.body.psw;

    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db){
        if(err) throw err;
        var dbo= db.db("mydb");
        dbo.collection("user").findOne({name: name}, function(err, result) {
            if (err) throw err;
            var myquery={name: name};
            var newValues= {$set:{connected: true}};
            console.log(result);
            if(result != undefined){
                dbo.collection("user").updateOne(myquery,newValues, function(err, result) {
                    if (err) throw err;
                    console.log(name+" est connecte");


                    MongoClient.connect(url, { useNewUrlParser: true },function(err,db){
                        if (err) throw err;
                        var dbo = db.db("mydb");
                        var tab=dbo.collection("paris_en_attente").find({name:name.toString()}).toArray()
                        tab.then(function(res){
                            console.log("parisen attente: "+res.length)
                            for(let i=0;i<res.length;i++){
                                let msg;
                                if(res[i].resultat="true"){
                                    msg=res[i].name+" a gagné "+res[i].montant+" dollars pour la victoire de "+res[i].joueur;
                                }
                                else{
                                    msg=res[i].name+" a perdu "+res[i].montant+" dollars pour la défaite de "+res[i].joueur;
                                }
                                bdd(url,msg)
                                MongoClient.connect(url, { useNewUrlParser: true },function(err,db){
                                    if (err) throw err;
                                    var dbo = db.db("mydb");
                                    dbo.collection("paris_en_attente").deleteOne({name:res[i].name.toString(), id: res[i].id.toString()})
                                    db.close()
                                })
                            }
                        })
                        db.close()
                    })

                })
            }
            else{
                dbo.collection("user").insertOne({name: name, pwd: pwd,connected: true}, function(err, result) {
                    if (err) throw err;
                    console.log("nouveau user: "+name);
                })
            }

            db.close();
        })

    });


    res.redirect('/client-side/'+name);
})

app.get('/deconnexion/:name',function(req,res){
    var name= req.params.name;

    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db){
        if(err) throw err;
        var dbo= db.db("mydb");
        var myquery={name: name};
        var newValues= {$set:{connected: false}};
        dbo.collection("user").updateOne(myquery,newValues, function(err, result) {
            if (err) throw err;
            console.log(name+" s'est deconnecte");
            db.close();
        })

    });

    res.redirect('/');
})

app.get('/client-side/paris/:id/:name/:montant/:joueur',function (req,res) {
    console.log(req.params.j);
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db){
        if(err) throw err;
        var dbo= db.db("mydb");
        dbo.collection("paris").insertOne({name:req.params.name, id: req.params.id, montant: req.params.montant, joueur: req.params.joueur}, function(err, result) {
            if (err) throw err;
            console.log(req.params.name+" a parié "+req.params.montant+" euros sur "+req.params.joueur);
            db.close();
        })

    });


    res.redirect('/client-side/'+req.params.name);
})

app.get('/client-side/:name',cors({allowedHeaders:['Content-Type','Authorization']}),function(req,res){
    res.setHeader("Content-Type", "text/html");
    res.render(__dirname+'/../partie-client/accueil.html',{name: req.params.name});
});

app.get('/client-side/details/:id/:name',cors({allowedHeaders:['Content-Type','Authorization']}),function(req,res){
    res.setHeader("Content-Type", "text/html");
    res.render(__dirname+'/../partie-client/details.html',{id: req.params.id, name: req.params.name});
});

const saveToDatabase = async subscription => {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
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
