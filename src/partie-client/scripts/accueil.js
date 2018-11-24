$("document").ready(function(){
    console.log("chargé");

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/src/partie-client/cache.js')
            .then(function(reg) {
                // registration worked
                console.log('Registration succeeded. Scope is ' + reg.scope);
            }).catch(function(error) {
            // registration failed
            console.log('Registration failed with ' + error);
        });
    }

    fetch('https://127.0.0.1:3500/parties'
    )
        .then(function (response){
            return response.json();
        }).then(function (data){
        affichageMatchs(data);
        /*caches.open('v1').then(function(cache){
            cache.put('https://127.0.0.1:3500/parties',data);
        });*/
    }).catch((response) => {
        console.log('Error')
    });

    $("table").on("click","tr",function(e){

        window.location="https://127.0.0.1:3500/client-side/details/0";
    });

    $("#refresh").on('click',function(){
        fetch('https://127.0.0.1:3500/parties'
        )
            .then(function (response){
                return response.json();
            }).then(function (data){
            $("tbody").children().eq(0).siblings().remove();
            affichageMatchs(data);

        }).catch((response) => {
            console.log('Error')
        });
    })
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