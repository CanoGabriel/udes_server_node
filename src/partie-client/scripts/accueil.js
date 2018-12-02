$("document").ready(function(){
    console.log("chargé");


    fetch('https://127.0.0.1:3500/parties')
        .then(function (response){
            return response.json();
        }).then(function (data){
            affichageMatchs(data);
            console.log(data);
        }).catch((response) => {
            console.log('Error '+response)
        });

    $("table").on("click","tr",function(e){
        let id= $(this).attr('data-id');
        window.location="https://127.0.0.1:3500/client-side/details/"+id+"/"+$(".container").attr("data-name");
    });

    $("#refresh").on('click',function(){
        console.log("refresh")
        fetch('https://127.0.0.1:3500/parties')
            .then(function (response){
                return response.json();
            }).then(function (data){
                affichageMatchs(data);

        }).catch((response) => {
            console.log('Error '+response)
        });
    });
    setInterval(function () {

        fetch('https://127.0.0.1:3500/parties')
            .then(function (response) {
                return response.json();
            }).then(function (data) {
            $("tbody").children().eq(0).siblings().remove();
            affichageMatchs(data);
        }).catch((response) => {
            console.log('Error '+response)
        });
    },60000);
    main();
});

function affichageMatchs(data){
    $(".container").children().remove();
    var name= $(".container").attr("data-name");
    for(var i=0;i<data.length;i++){
        let match= "<div class=\"contenu col-xs-12\"><a href=\"/client-side/details/"+data[i].id+"/"+name+"\">" +
        "<div class=\"bordure col-sm-8 col-sm-offset-2\"><p>Match "+data[i].id+
        "</p><li class=\"col-sm-6 col-xs-6\" class=\"joueur1\">"+data[i].joueur1.prenom+" "+data[i].joueur1.nom+"</li>" +
        "<li class=\"col-sm-6 col-xs-6\" class=\"joueur2\">"+ data[i].joueur2.prenom+" "+data[i].joueur2.nom +"</li>"+
        "</ul>\n" +
        "<h3>Score</h3>\n" +
        " <ul class=\"list-inline titre\">\n" +
        "<li class=\"col-sm-6 col-xs-6\">Jeu</li>\n" +
        "<li class=\"col-sm-6 col-xs-6\">Echange</li>\n" +
        "</ul>\n" +
        "<ul class=\"list-inline\">\n" +
        "<ul class=\"list-inline col-sm-6 col-xs-6\" class=\"jeu\">";
        for(let j=0;j<data[i].pointage.jeu.length;j++){
            match= match +"<li>"+data[i].pointage.jeu[j][0]+"-"+data[i].pointage.jeu[j][1]+"</li>";
        }
        match= match+
        "</ul>\n" +
        "<li class=\"col-sm-6 col-xs-6\" class=\"echange\">"+data[i].pointage.echange[0]+"-"+data[i].pointage.echange[1]+"</li>\n" +
        "</ul>\n" +
        "</div>\n" +
        "</a>\n" +
        "</div>";

        $(".container").append(match);
    }














}

const check = () => {
    if (!('serviceWorker' in navigator)) {
        throw new Error('No Service Worker support!')
    }
    if (!('PushManager' in window)) {
        throw new Error('No Push API Support!')
    }
}

const registerServiceWorker = async () => {
    const swRegistration = await navigator.serviceWorker.register('/cache.js'); //notice the file name
    return swRegistration;
}

const requestNotificationPermission = async () => {
    const permission = await window.Notification.requestPermission();
    // value of permission can be 'granted', 'default', 'denied'
    // granted: user has accepted the request
    // default: user has dismissed the notification permission popup by clicking on x
    // denied: user has denied the request.
    if(permission !== 'granted'){
        throw new Error('Permission not granted for Notification');
    }
}

const showLocalNotification = (title, body, swRegistration) => {
    const options = {
        body,
        // here you can add more properties like icon, image, vibrate, etc.
    };
    swRegistration.showNotification(title, options);

}

const main = async () => {
    check();
    const swRegistration = await registerServiceWorker();
    const permission =  await requestNotificationPermission();
    //showLocalNotification('This is title', 'this is the message', swRegistration);
}

