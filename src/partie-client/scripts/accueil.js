$("document").ready(function(){
    console.log("chargé");


    fetch('https://127.0.0.1:3500/parties'
    )
        .then(function (response){
            return response.json();
        }).then(function (data){
            affichageMatchs(data);
            console.log(data);
        }).catch((response) => {
            console.log('Error')
        });

    $("table").on("click","tr",function(e){
        let id= $(this).attr('data-id');
        window.location="https://127.0.0.1:3500/client-side/details/"+id;
    });

    $("#refresh").on('click',function(){
        fetch('https://127.0.0.1:3500/parties')
            .then(function (response){
                return response.json();
            }).then(function (data){
            $("tbody").children().eq(0).siblings().remove();
            affichageMatchs(data);

        }).catch((response) => {
            console.log('Error')
        });
    });
    setTimeout(function () {

        fetch('https://127.0.0.1:3500/parties')
            .then(function (response) {
                return response.json();
            }).then(function (data) {
            $("tbody").children().eq(0).siblings().remove();
            affichageMatchs(data);
        });
    },60000);
    main();
});

function affichageMatchs(data){
    console.log(data);
    for(var i=0;i<data.length;i++){
        var ligne=$("<tr data-id="+data[i].id+"></tr>");

        var contenu= "<td>"+data[i].joueur1.prenom+" "+data[i].joueur1.nom +"</td><td>"+data[i].joueur2.prenom+" "+data[i].joueur2.nom+"</td>"
            +"<td>echange: "+data[i].pointage.echange[0]+" - "+ data[i].pointage.echange[1]+"jeu: "+data[i].pointage.jeu[0]+" - "+data[i].pointage.jeu[1]+"manches: "+data[i].pointage.manches[0]+" - "+data[i].pointage.manches[1]+"</td>";
        //lien.append(contenu);
        ligne.append(contenu);
        $("#tableOfAllMatchs tbody").append(ligne);
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

