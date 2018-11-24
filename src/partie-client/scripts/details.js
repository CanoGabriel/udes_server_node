$("document").ready(function(){
   console.log("details");

    fetch('https://127.0.0.1:3500/parties/0'
    )
        .then(function (response){
            return response.json();
        }).then(function (data){
            //affichageMatchs(data);
            /*caches.open('v1').then(function(cache){
                cache.put('https://127.0.0.1:3500/parties',data);
            });*/
            console.log(data);

    }).catch((response) => {
        console.log('Error')
    });

});