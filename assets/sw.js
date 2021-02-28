importScripts('https://cdn.ampproject.org/sw/amp-sw.js');

AMP_SW.init({
    assetCachingOptions: [{
        regexp: /\.(png|jpg|woff2|woff|css|js)/,
        cachingStrategy: 'CACHE_FIRST',
    }],
    linkPrefetchOptions: {
        maxAgeSecondsInCache: 5
    }
});

//@see: https://googlechrome.github.io/samples/service-worker/basic/
const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

const PRECACHE_URLS = [
    'index.html',
    './',
];

self.addEventListener('install', event => {
    console.log('install');
    event.waitUntil(
        caches.open(PRECACHE)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(self.skipWaiting())
    );
});

self.addEventListener('activate', async event => {
    console.log('activate');
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('message', async event => {
    // const {command} = event.data;
    // console.log(`message: ${command}`);
    // switch (command) {
    //     case 'amp-web-push-subscribe':
    //         const convertedVapidKey = urlBase64ToUint8Array("BAWrcjWdlscQOdRFf0qV3OG4_CXU0xk_qKDPVZG3pMLkRfiNBhPsGRq1jZDpwI_ualZs9cTzaNHmqicmZ8ZVkO8");
    //         const subscription = await self.registration.pushManager.subscribe({
    //             userVisibleOnly: true,
    //             applicationServerKey: convertedVapidKey
    //         });
    //         console.log(subscription);
    //         break;
    //     case 'amp-web-push-subscription-state':
    //         break;
    //     default:
    //         break;
    // }
});

self.addEventListener('fetch', event => {
    console.log(`fetch: ${event.request.url}`);
    if (event.request.url.startsWith(self.location.origin) ||
        /(algolia|shields)/.test(event.request.url) ||
        /(png|jpg)$/.test(event.request.url)
    ) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    console.log(`hit cache. ${event.request.url}`);
                    return cachedResponse;
                }

                return caches.open(RUNTIME).then(cache => {
                    return fetch(event.request).then(response => {
                        return cache.put(event.request, response.clone()).then(() => {
                            console.log(`put cache. ${event.request.url}`);
                            return response;
                        });
                    });
                });
            })
        );
    }
});

self.addEventListener('push', event => {
    const data = event.data.json();
    console.log(data);
    const title = data.title;
    const options = {
        body: data.body,
        icon: 'test.jpg'
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// self.addEventListener('notificationclick', event => {
//     event.notification.close();
// });

// const urlBase64ToUint8Array = (base64String) => {
//     const padding = '='.repeat((4 - base64String.length % 4) % 4);
//     const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
//     const rawData = self.atob(base64);
//     const outputArray = new Uint8Array(rawData.length);
//     for (let i = 0; i < rawData.length; ++i) {
//         outputArray[i] = rawData.charCodeAt(i);
//     }
//     return outputArray;
// };
