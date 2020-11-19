importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js')
const pesanConsoleBerhasil = () => console.log(`Workbox berhasil dimuat`);
const pesanConsoleGagal = () => console.log(`Workbox gagal dimuat`);
workbox ? pesanConsoleBerhasil() : pesanConsoleGagal();

workbox.precaching.precacheAndRoute([
    { url:'/', revision: '1' },
    { url:'/index.html', revision: '1' },
    { url:'/manifest.json', revision: '1' },
    { url:'/push.js', revision: '1' },
    { url:'/service-worker.js', revision: '1' },
    { url:'/css/icons.css', revision: '1' },
    { url:'/css/materialize.css', revision: '1' },
    { url:'/css/style.css', revision: '1' },
    { url:'/font/MaterialIcons-Regular.ttf', revision: '1' },
    { url:'/pages/fav-team.html', revision: '1' },
    { url:'/pages/home.html', revision: '1' },
    { url:'/pages/match.html', revision: '1' },
    { url:'/pages/team.html', revision: '1' },
    { url:'/pages/nav.html', revision: '1' },
    { url:'/js/api.js', revision: '1' },
    { url:'/js/db.js', revision: '1' },
    { url:'/js/functions.js', revision: '1' },
    { url:'/js/idb.js', revision: '1' },
    { url:'/js/init.js', revision: '1' },
    { url:'/js/materialize.js', revision: '1' },
    { url:'/js/script.js', revision: '1' },
    { url:'/img/android-72x72.png', revision: '1' },
    { url:'/img/apple-icon-180x180.png', revision: '1' },
    { url:'/img/icon192x192.png', revision: '1' },
    { url:'/img/icon512x512.png', revision: '1' },
    { url:'/img/laliga.png', revision: '1' }
])

workbox.routing.registerRoute(
  new RegExp("js/"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "js",
  })
);

workbox.routing.registerRoute(
  new RegExp("css/"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "css",
  })
);

workbox.routing.registerRoute(
  new RegExp("pages/"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "pages",
  })
);

workbox.routing.registerRoute(
  new RegExp("img/"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "img",
  })
);

workbox.routing.registerRoute(
  new RegExp("font/"),
  workbox.strategies.cacheFirst({
    cacheName: "img",
  })
);

workbox.routing.registerRoute(
  new RegExp("/"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "depan",
  })
);

workbox.routing.registerRoute(
  /^https:\/\/api\.football-data\.org\/v2/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "https://api.football-data.org/",
  })
);

workbox.routing.registerRoute(
    /.*(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ]
    })
);


// * push notification
self.addEventListener('push', event => {
    console.log(event);
    let body;
    if (event.data) {
        body = event.data.text()
    }else{
        body = "push message no payload"
    }

    let opt ={
        body,
        icon : './img/pwa-512x512.png',
        vibrate : [100,50,100],
        data : {
            dateOfArrival : Date.now(),
            primaryKey : 1
        }
    }

    event.waitUntil(
        self.registration.showNotification('Push notification',opt)
    )
})