const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fs =require('fs');
const https= require('https');

const indexRouter = require('./src/routes/index');
const partiesRouter = require('./src/routes/partie');
const parisRouter = require('./src/routes/paris');



const mongo= require('mongodb');
const mongoClient= mongo.MongoClient;
var url="mongodb://localhost:27017/mydb";

/*mongoClient.connect(url, { useNewUrlParser: true },function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("subscription").drop(function(err, delOK) {
        if (err) throw err;
        if (delOK) console.log("Collection deleted");
        db.close();
    });
});*/

mongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("subscription", function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
        //db.close();
    });
    /*dbo.collection("subscription").deleteMany({},function(err, obj) {
        if (err) throw err;
        console.log(obj.result.n + " document(s) deleted");
        db.close();
    })*/
});



const app = express();

https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}, app).listen(3500);

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/parties', partiesRouter);
app.use('/paris', parisRouter);

const generateur = require('./src/generateur');
generateur.demarrer();

module.exports = app;