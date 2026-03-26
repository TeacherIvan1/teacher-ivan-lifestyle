const CACHE_NAME = 'teacher-ivan-v1';

// Lista de archivos que queremos que se guarden en el celular del usuario
const urlsToCache = [
  './',
  './index.html',
  './onboarding.html',
  './auth.html',
  './dashboard.html',
  './workouts.html',
  './exercise-detail.html',
  './habits.html',
  './nutrition.html',
  './profile.html',
  './manifest.json',
  './Chibi_Flotante_con_Movimiento_de_Viento.mp4' // Guardamos el video para que no gaste datos cada vez
];

// EVENTO DE INSTALACIÓN: Guarda los archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caché abierto con éxito');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// EVENTO DE ACTIVACIÓN: Limpia cachés antiguos si actualizas la app
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// EVENTO FETCH: Intercepta las peticiones y responde con caché si no hay internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el archivo está en caché, lo devuelve súper rápido
        if (response) {
          return response;
        }
        // Si no está, lo va a buscar a internet (Ej. llamadas a la API de Google Sheets)
        return fetch(event.request);
      })
  );
});
