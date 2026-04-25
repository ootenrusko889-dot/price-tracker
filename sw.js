const CACHE_NAME = 'price-tracker-v1';
// 把核心文件存进手机本地
const urlsToCache = [
    './',
    './index.html',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
    'https://unpkg.com/pinyin-pro'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // 如果手机本地有缓存，直接一秒加载！如果没有，再去求助网络。
            return response || fetch(event.request);
        })
    );
});
