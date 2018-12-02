$("document").ready(function(){
   console.log("details");
    let id= $(".container").attr('data-id');
    fetch('https://127.0.0.1:3500/parties/'+id)
        .then(function (response){
            return response.json();
        }).then(function (data){
            affichageMatchs(data);
        }).catch((response) => {
            console.log('Error '+response);
        });

    $("#refresh").on('click',function(){
        let id= $(".container").attr('data-id');
        fetch('https://127.0.0.1:3500/parties/'+id)
            .then(function (response){
                return response.json();
            }).then(function (data){
                affichageMatchs(data);

            }).catch((response) => {
                console.log('Error '+response);
            });
    });

    setInterval(function () {

        let id= $(".container").attr('data-id');
        fetch('https://127.0.0.1:3500/parties/'+id)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                affichageMatchs(data);
            });
    },10000);

});

function affichageMatchs(data) {
    console.log(data);

    $(".joueur1").text(data.joueur1.prenom+" "+data.joueur1.nom);
    $(".joueur2").text(data.joueur2.prenom+" "+data.joueur2.nom);
    $("#age1").text(data.joueur1.age);
    $("#age2").text(data.joueur2.age);
    $("#rang1").text(data.joueur1.rang);
    $("#rang2").text(data.joueur2.rang);
    $("#echange").text(data.pointage.echange[0]+" - "+data.pointage.echange[1]);
    $("#constestation").text(data.constestation[0]+" - "+data.constestation[1]);
    var t= data.temps_partie;
    var s = Math.floor(t / 1000) % 60;
    var m = Math.floor(t / 60000) % 60;
    var chaine = m+"'"+s;
    $("#temps").text(Math.floor(t/60)+" min");
    $("ul#jeu").children().remove();
    for(let i=0;i<data.pointage.jeu.length;i++){
        $("#jeu").append("<li>"+data.pointage.jeu[i][0]+"-"+data.pointage.jeu[i][1]+"</li>")
    }

    $("#pari-button").on("click",function(event){
        var id= $(".container").attr("data-id");
        var name= $(".container").attr("data-name");
        var montant= $("#paris").val();
       if($(".joueur1-paris input").prop("checked")){
           var j= $(".joueur1").text();
           window.location="https://127.0.0.1:3500/client-side/paris/"+id+"/"+name+"/"+montant+"/"+j;
       }
       else{
           var j= $(".joueur2").text();
           window.location="https://127.0.0.1:3500/client-side/paris/"+id+"/"+name+"/"+montant+"/"+j;
       }
    });
}