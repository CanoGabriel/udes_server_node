$("document").ready(function(){
   console.log("details");
    let id= $(".match").attr('data-id');
    fetch('https://127.0.0.1:3500/parties/'+id)
        .then(function (response){
            return response.json();
        }).then(function (data){
            affichageMatchs(data);
        }).catch((response) => {
            console.log('Error')
        });

    $("#refresh").on('click',function(){
        $("ul").children().remove();
        let id= $(".match").attr('data-id');
        fetch('https://127.0.0.1:3500/parties/'+id)
            .then(function (response){
                return response.json();
            }).then(function (data){
            affichageMatchs(data);

            }).catch((response) => {
                console.log('Error '+response);
            });
    });

    setTimeout(function () {

        let id= $(".match").attr('data-id');
        fetch('https://127.0.0.1:3500/parties/'+id)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                $("ul").children().remove();
                affichageMatchs(data);
            });
    },60000);

});

function affichageMatchs(data) {
    console.log(data);
    var joueur1= ""+data.joueur1.prenom+" "+data.joueur1.nom+" agé de "+data.joueur1.age+", orginiaire de "+data.joueur1.pays+" au rang "+data.joueur1.rang;
    var joueur2= ""+data.joueur2.prenom+" "+data.joueur2.nom+" agé de "+data.joueur2.age+", orginiaire de "+data.joueur2.pays+" au rang "+data.joueur2.rang;
    var score= "echange: "+data.pointage.echange[0]+" - "+ data.pointage.echange[1]+" jeu: "+data.pointage.jeu[0]+" - "+data.pointage.jeu[1]+" manches: "+data.pointage.manches[0]+" - "+data.pointage.manches[1];
    $("ul").append("<li>"+joueur1+"</li>");
    $("ul").append("<li>"+joueur2+"</li>");
    $("ul").append("<li> nombre de coups pendant le dernier échange: "+data.nombre_coup_dernier_echange+"</li>");
    $("ul").append("<li>tentatives de contestations:"+data.nombre_tentative_contestation[0]+' - '+data.nombre_tentative_contestation[1]+"</li>");
    $("ul").append("<li>"+score+"</li>");
    $("ul").append("<li>serveur: "+data.serveur+"</li>");
    $("ul").append("<li>temps partie: "+data.temps_partie+"</li>");
    $("ul").append("<li>terrain n°"+data.terrain+"</li>");
    $("ul").append("<li>tickDebut: "+data.tickDebut+"</li>");
    $("ul").append("<li>tournoi: "+data.tournoi+"</li>");
    $("ul").append("<li>vitesse dernier service: "+data.vitesse_dernier_service+"</li>");
}