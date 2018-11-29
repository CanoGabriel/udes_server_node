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

self.addEventListener('fetch', function(event) {

    event.respondWith(
        fetch(event.request).catch(function() {
            return caches.match(event.request);
        })
    );
});

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


self.addEventListener('fetch', function(event) {
    console.log("fetched!");
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response.
                var fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function(response) {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});


