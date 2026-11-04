/* Guarda la app para abrirla al instante; la voz de cada nivel se baja una vez y se queda. */
const CACHE="susurro-1";
const BASE=["./","index.html","manifest.webmanifest","icono-192.png","icono-512.png"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(BASE)))});
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==location.origin)return;
  if(u.pathname.includes("/voz/")){
    e.respondWith(caches.open(CACHE).then(async c=>{
      const h=await c.match(e.request);if(h)return h;
      const r=await fetch(e.request);
      if(r.ok){for(const k of await c.keys()){const q=new URL(k.url);if(q.pathname===u.pathname&&q.search!==u.search)c.delete(k)}c.put(e.request,r.clone())}
      return r;
    }));
    return;
  }
  /* La app: primero intenta la versión nueva; sin internet usa la guardada. */
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const k=r.clone();caches.open(CACHE).then(c=>c.put(e.request,k))}return r}).catch(()=>caches.match(e.request).then(h=>h||caches.match("index.html"))));
});
