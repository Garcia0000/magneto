export const SITE_CONFIG = {

  // ── Video ─────────────────────────────────────────────────────
  //
  // videoProvider controla cuál player se usa:
  //   'youtube'  → embed normal de YouTube (gratis, sin analytics)
  //   'vplay'    → VPlay smart player  (autoplay, CTA en min 21, analytics)
  //   'iframe'   → cualquier iframe externo (vturb, converteai, wistia…)
  //
  videoProvider: 'youtube' as 'youtube' | 'vplay' | 'iframe',

  // YouTube (usado cuando videoProvider = 'youtube')
  youtubeVideoId: 'SOLJwnp2p3M',

  // VPlay (usado cuando videoProvider = 'vplay')
  // Pega aquí SOLO la URL del src del iframe que te da VPlay.
  // Ejemplo: https://vplay.com.br/embed/abc123
  vplayEmbedUrl: '',

  // Iframe genérico (converteai / vturb / wistia / etc.)
  // Pega aquí la URL completa del src del iframe.
  iframeEmbedUrl: '',

  // ── TikTok hook video ─────────────────────────────────────────
  tiktokUrl: 'https://vt.tiktok.com/ZSQe45Jpo/',
  tiktokVideoId: '',

  // ── Producto / Oferta ─────────────────────────────────────────
  hotmartUrl: '#HOTMART_URL_AQUI',
  siteName: 'Magneto',
  pageTitle: '¿Por qué estos jóvenes están ganando miles con solo 3 comandos de IA?',
  metaDescription: 'El sistema que está generando resultados reales — sin experiencia previa.',

  ctaButtonText: 'QUIERO ACCESO AHORA →',
  ctaGuarantee: 'Garantía de satisfacción. Sin riesgos.',

  // Countdown en horas (0 = desactivado)
  countdownHours: 24,

  // Opt-in
  optinCTA: 'DESBLOQUEAR ACCESO →',
}
