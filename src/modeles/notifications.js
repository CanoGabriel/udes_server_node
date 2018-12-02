var mongoClient = require('mongodb').MongoClient;
var url="mongodb://localhost:27017/mydb";
const webpush = require('web-push');

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
    /*console.log("sub")
    console.log(subscription)*/
    webpush.sendNotification(subscription, dataToSend).catch(function(err){
        console.log('Error activation', err)
    })
};

const notifications= function(url, options){
    mongoClient.connect(url,{ useNewUrlParser: true }, function(err, db){
        if(err) throw err;
        var dbo= db.db("mydb");
        dbo.collection("subscription").findOne({}, function(err, result) {
            if (err) throw err;
            const sub=result;
            const message = options;
            sendNotification(sub, message);
            db.close();
        })
    });
};

module.exports= notifications;