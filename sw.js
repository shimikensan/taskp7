// Tên bộ nhớ đệm - Mỗi lần bạn sửa file index.html, hãy đổi v1 thành v2, v3...
const CACHE_NAME = 'pro-tasks-vb-v5'; 

// Danh sách các tài nguyên cần lưu trữ để chạy Offline
const assets = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'
];

// 1. Sự kiện Cài đặt (Install): Lưu các file vào bộ nhớ đệm
self.addEventListener('install', e => {
  console.log('[Service Worker] Đang cài đặt...');
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Đang lưu trữ tài nguyên vào cache...');
      return cache.addAll(assets);
    })
  );
});

// 2. Sự kiện Kích hoạt (Activate): Dọn dẹp các bộ nhớ đệm cũ khi có bản mới
self.addEventListener('activate', e => {
  console.log('[Service Worker] Đang kích hoạt...');
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
});

// 3. Sự kiện Truy xuất (Fetch): Giúp ứng dụng hoạt động ngay cả khi mất mạng
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});

// 4. Lắng nghe thông điệp "skipWaiting" để cập nhật phiên bản ngay lập tức
self.addEventListener('message', e => {
  if (e.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});