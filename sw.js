/* sw.js */
const CACHE_NAME = 'cookie-game-cache-v1';

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './main.js',
  './ajax.js',
  './base64.js',
  './dungeons.js',

  // Images (every file you listed)
  './img/alchemylab.png',
  './img/alchemylabBackground.png',
  './img/alchemylabIcon.png',
  './img/alteredGrandma.png',
  './img/antiGrandma.png',
  './img/antimattercondenser.png',
  './img/antimattercondenserBackground.png',
  './img/antimattercondenserIcon.png',
  './img/bgBlue.jpg',
  './img/blackGradient.png',
  './img/chocolateMilkWave.png',
  './img/control.png',
  './img/cookieShower1.png',
  './img/cookieShower2.png',
  './img/cookieShower3.png',
  './img/cosmicGrandma.png',
  './img/cursor.png',
  './img/cursoricon.png',
  './img/darkNoise.png',
  './img/factory.png',
  './img/factoryBackground.png',
  './img/factoryIcon.png',
  './img/farm.png',
  './img/farmBackground.png',
  './img/farmIcon.png',
  './img/farmerGrandma.png',
  './img/goldCookie.png',
  './img/grandma.png',
  './img/grandmaBackground.png',
  './img/grandmaIcon.png',
  './img/grandmas1.jpg',
  './img/grandmas2.jpg',
  './img/grandmas3.jpg',
  './img/grandmasGrandma.png',
  './img/icons.png',
  './img/imperfectCookie.png',
  './img/infoBG.png',
  './img/infoBGfade.png',
  './img/mapBG.jpg',
  './img/mapIcons.png',
  './img/mapTiles.png',
  './img/marshmallows.png',
  './img/milk.png',
  './img/milkWave.png',
  './img/mine.png',
  './img/mineBackground.png',
  './img/mineIcon.png',
  './img/minerGrandma.png',
  './img/money.png',
  './img/mysteriousHero.png',
  './img/mysteriousOpponent.png',
  './img/panelHorizontal.png',
  './img/panelVertical.png',
  './img/perfectCookie.png',
  './img/portal.png',
  './img/portalBackground.png',
  './img/portalIcon.png',
  './img/raspberryWave.png',
  './img/shine.png',
  './img/shipment.png',
  './img/shipmentBackground.png',
  './img/shipmentIcon.png',
  './img/smallCookies.png',
  './img/storeTile.jpg',
  './img/timemachine.png',
  './img/timemachineBackground.png',
  './img/timemachineIcon.png',
  './img/transmutedGrandma.png',
  './img/upgradeFrame.png',
  './img/workerGrandma.png',
  './img/wrathCookie.png'
];

// During install, cache everything we need for offline
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Clean up old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// Fetch handler: cache-first for full offline operation
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // For navigation requests, always try cache first, then fall back to index.html
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html', { ignoreSearch: true })
        .then((cached) => cached || fetch(req))
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // For everything else, cache-first, then network, then nothing.
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      // If not in cache, try network and cache it for next time (nice-to-have)
      return fetch(req).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
        return resp;
      }).catch(() => {
        // Remain silent if totally unavailable
        return new Response('', { status: 404, statusText: 'Offline asset not found' });
      });
    })
  );
});
