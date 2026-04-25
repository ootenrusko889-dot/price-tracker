const CACHE_NAME = 'price-tracker-v2'; 

const urlsToCache = [
    './',
    './index.html',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
    'https://unpkg.com/pinyin-pro'
];

self.addEventListener('install', event => {
    self.skipWaiting(); // 强制立即接管
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', event => {
    // 清除旧版本的顽固缓存
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 核心：网络优先策略 (Network First)
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).then(response => {
            // 如果有网，不仅返回新网页，还顺便把新网页存入缓存
            return caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, response.clone());
                return response;
            });
        }).catch(() => {
            // 如果断网了，才去缓存里找存货
            return caches.match(event.request);
        })
    );
});
