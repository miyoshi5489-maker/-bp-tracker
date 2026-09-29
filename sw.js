// ネット優先（新しい版をすぐ反映）＋オフライン時はキャッシュ
const CACHE='yohei-training-v6';
const CORE=['./','./index.html','./app.js','./plan.js','./exercises.js','./theme.js','./actual.js','./app.css','./manifest.json','./icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).catch(()=>{}));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.hostname.endsWith('supabase.co'))return; // 記録データは常にネットから
  const isImg=url.origin===location.origin&&url.pathname.includes('/img/');
  if(isImg){ // 写真はキャッシュ優先
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp));return res;})));
    return;
  }
  e.respondWith(fetch(req).then(res=>{if(res.ok&&(url.origin===location.origin||url.hostname.includes('tailwindcss')||url.hostname.includes('gstatic')||url.hostname.includes('googleapis'))){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return res;}).catch(()=>caches.match(req)));
});
