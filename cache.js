//private key: Eb0M-Jj4RM3jP_g2uXN_Wdn4LDAK3huuZIwd9jTn_C8
const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
};

// saveSubscription saves the subscription to the backend
const saveSubscription = async subscription => {
    const SERVER_URL = '/client-side/save-subscription';
    const response = await fetch(SERVER_URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
    });
    console.log(response);
    return response.json()
};


var CACHE_NAME = 'TennisParis-v1';
var urlsToCache = [
    /*'/scripts/details.html',
    '/scripts/scripts/details.js',
    '/scripts/scripts/accueil.js',*/
    '/scripts/connexion.html',
    /*'/scripts/accueil.html',
    '/scripts/css/style.css',
    '/scripts/css/connexion.css'*/
];

/*self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});*/


self.addEventListener('activate', async () => {
    // This will be called only once when the service worker is activated.
    console.log('activation');
    try {
        const applicationServerKey = urlB64ToUint8Array(
            'BJ2J5EmxJBHWEgkIQ6wT5-fhmLeQszDFnCPoSvYU7xNg4jA-5qiPYWTZKyK5R3fIvCXeKuyRAmsGV_QHJH0Yc_w'
        );
        const options = { applicationServerKey, userVisibleOnly: true };
        const subscription = await self.registration.pushManager.subscribe(options);
        console.log(subscription);
        const response = await saveSubscription(subscription);
        console.log("response: ");
        console.log(response);
    } catch (err) {
        console.log('Error activation', err)
    }
});

/*self.addEventListener('fetch', function(event) {
    console.log('Gestion de l\'évènement de fetch pour', event.request.url);

    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                console.log('Réponse trouvée en cache:', response);

                return response;
            }
            console.log('Pas de réponse trouvée en cache. Sur le point de la récupérer via le réseau...');

            return fetch(event.request).then(function(response) {
                console.log('La réponse du réseau est:', response);

                return response;
            }).catch(function(error) {
                console.error('Récupération échouée:', error);

                throw error;
            });
        })
    );
});*/

self.addEventListener('push', function(event) {
    console.log("poussé");
    if (event.data) {
        showLocalNotification("TennisParis", event.data.text(),  self.registration);
    } else {
        console.log('Push event but no data')
    }
});
const showLocalNotification = (title, body, swRegistration) => {
    const options = {
        body
        // here you can add more properties like icon, image, vibrate, etc.
    };
    swRegistration.showNotification(title, options);
};


