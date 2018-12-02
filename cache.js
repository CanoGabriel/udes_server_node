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
    'https://127.0.0.1:3500/scripts/connexion.html',
    'https://127.0.0.1:3500/scripts/accueil.html',
    'https://127.0.0.1:3500/scripts/details.html',

];

/*self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(function(err){
                if(err) throw err;
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
    event.respondWith(fetch(event.request));
});*/

/*self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.open('mysite-dynamic').then(function(cache) {
            return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function(response) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    )
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


