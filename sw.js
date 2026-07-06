const CACHE = "equivet-v15";
const FILES = [
  "./",
  "./index.html",
  "./equivet-clinica.html",
  "./equivet-clinica.js",
  "./equivet-uti.html",
  "./hero-equivet.png",
  "./manifest-clinica.json",
  "./manifest-uti.json",
  "./icon-equivet.svg",
  "./icon-512.png",
  "./icon-192.png",
  "./icon-180.png",
  "https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"
];

// Instala e faz cache de todos os arquivos essenciais
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      // allSettled: a falha de um arquivo (ex.: CDN fora do ar) nao impede a instalacao
      .then(c => Promise.allSettled(FILES.map(f => c.add(f))))
      .then(() => self.skipWaiting())
  );
});

// Remove caches antigos ao ativar nova versão
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Estratégia: cache primeiro, rede como fallback
// Para arquivos do próprio app: cache first (garante offline)
// Para chamadas ao Supabase/API: rede first, silencia erros
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);

  // APIs (Supabase, backend Railway) e QUALQUER requisicao nao-GET (POST/PUT/...):
  // rede-primeiro, NUNCA cache nem fallback de HTML. Evita servir index.html numa
  // chamada de API que demora/falha (o app faria res.json() num HTML e quebraria).
  if (e.request.method !== "GET"
      || url.hostname.includes("supabase.co")
      || url.hostname.includes("anthropic.com")
      || url.hostname.includes("railway.app")) {
    e.respondWith(
      fetch(e.request).catch(() => new Response(
        JSON.stringify({error: "offline"}),
        {status: 503, headers: {"Content-Type":"application/json"}}
      ))
    );
    return;
  }

  // Tudo mais: cache primeiro
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (!resp || resp.status !== 200 || resp.type === "opaque") return resp;
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return resp;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
