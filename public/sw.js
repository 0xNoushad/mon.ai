if(!self.define){let e,s={};const a=(a,i)=>(a=new URL(a+".js",i).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(i,n)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let c={};const r=e=>a(e,t),o={module:{uri:t},exports:c,require:r};s[t]=Promise.all(i.map((e=>o[e]||r(e)))).then((e=>(n(...e),c)))}}define(["./workbox-e9849328"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"830160ea85751b90760d16c2915e3467"},{url:"/_next/static/chunks/13-7785454b801f8bd8.js",revision:"n6ktyiiwDYrH2qEzleAvb"},{url:"/_next/static/chunks/134.af15d5f97ab9d712.js",revision:"af15d5f97ab9d712"},{url:"/_next/static/chunks/176-7bbaeb669b11b55b.js",revision:"n6ktyiiwDYrH2qEzleAvb"},{url:"/_next/static/chunks/392aea1c-68a43dc7f25b0ecc.js",revision:"n6ktyiiwDYrH2qEzleAvb"},{url:"/_next/static/chunks/412.32c631666ca58f2f.js",revision:"32c631666ca58f2f"},{url:"/_next/static/chunks/416.df8644d4100ae327.js",revision:"df8644d4100ae327"},{url:"/_next/static/chunks/527-d2424a61c2b8ea43.js",revision:"n6ktyiiwDYrH2qEzleAvb"},{url:"/_next/static/chunks/612-3484e7e51812f8af.js",revision:"n6ktyiiwDYrH2qEzleAvb"},{url:"/_next/static/chunks/631-62bbb761a5c9bea5.js",revision:"n6ktyiiwDYrH2qEzleAvb"},{url:"/_next/static/chunks/6dc81886.1373e84e0d5acab5.js",revision:"1373e84e0d5acab5"},{url:"/_next/static/chunks/71af2767-634a4fa73e420872.js",revision:"n6ktyiiwDYrH2qEzleAvb"},{url:"/_next/static/chunks/727.adae6622f5008a09.js",revision:"adae6622f5008a09"},{url:"/_next/static/chunks/761.1a1212237373bcdb.js",revision:"1a1212237373bcdb"},{url:"/_next/static/chunks/813.bcaf875cabec098e.js",revision:"bcaf875cabec098e"},{url:"/_next/static/chunks/app/_not-found/page-c0e35b34495b4d5d.js",revision:"n6ktyiiwDYrH2qEzleAvb"},{url:"/_next/static/chunks/app/api/chat/route-61e03acbc7b96b15.js",revision:"n6ktyiiwDYrH2qEzleAvb"},{url:"/_next/static/chunks/app/chat/page-ecc30c3d89ec304c.js",revision:"n6ktyiiwDYrH2qEzleAvb"},{url:"/_next/static/chunks/app/layout-1da1b096e5c8bebe.js",revision:"n6ktyiiwDYrH2qEzleAvb"},{url:"/_next/static/chunks/app/page-9ba04f5e6f0ace94.js",revision:"n6ktyiiwDYrH2qEzleAvb"},{url:"/_next/static/chunks/e3618ee1.7137a3f2428a187d.js",revision:"7137a3f2428a187d"},{url:"/_next/static/chunks/framework-d4e60a254c4ba30b.js",revision:"n6ktyiiwDYrH2qEzleAvb"},{url:"/_next/static/chunks/main-app-956214262a50ba40.js",revision:"n6ktyiiwDYrH2qEzleAvb"},{url:"/_next/static/chunks/main-f164a3e7bcef0eea.js",revision:"n6ktyiiwDYrH2qEzleAvb"},{url:"/_next/static/chunks/pages/_app-e1eb51a52e58766b.js",revision:"n6ktyiiwDYrH2qEzleAvb"},{url:"/_next/static/chunks/pages/_error-3fb4e26aae5f4d5d.js",revision:"n6ktyiiwDYrH2qEzleAvb"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-3b035e3064035b5a.js",revision:"n6ktyiiwDYrH2qEzleAvb"},{url:"/_next/static/css/08ef2b14635af54f.css",revision:"08ef2b14635af54f"},{url:"/_next/static/css/c171adad6134cc66.css",revision:"c171adad6134cc66"},{url:"/_next/static/media/2e1b830192b7974a-s.woff2",revision:"fb3eb2a5b724bc3de2f18496da5fbe70"},{url:"/_next/static/media/3478b6abef19b3b3-s.p.woff2",revision:"eeee8726f3b4ae9d8c710efba031ca6a"},{url:"/_next/static/media/3aa27b2eb5f698f7-s.woff2",revision:"1179dffca057f6b40e5d71311c94bd3f"},{url:"/_next/static/media/7cb331c8ee46479c-s.p.woff2",revision:"fd2ad878fd44314b779d857ae4d6cc89"},{url:"/_next/static/media/950a521f297881a3-s.woff2",revision:"daaeece4b5218319d962309a96f2461e"},{url:"/_next/static/media/9c00aaca17e573eb-s.woff2",revision:"0b223a90340aa67ac78bc6a875fa67c6"},{url:"/_next/static/media/d607327a37a507c7-s.woff2",revision:"7ea53cc9d5ec4534e4281b9723b23786"},{url:"/_next/static/media/ebec2867f40f78ec-s.woff2",revision:"efc6f6cd1a9d1db1ee8e37b34d6430df"},{url:"/_next/static/n6ktyiiwDYrH2qEzleAvb/_buildManifest.js",revision:"4f15889ee6bc04162514b0ad247b50d1"},{url:"/_next/static/n6ktyiiwDYrH2qEzleAvb/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/clever.png",revision:"4d1d5a9c798c59f2db40dac710ba63f2"},{url:"/clever.svg",revision:"6b315740cdb31153af552c1a1a1d0f5c"},{url:"/cleverwhite.svg",revision:"7aec80f7a062843b415e97261fec2193"},{url:"/favicon.ico",revision:"3042e1de36f50248d61abad3a842cfc7"},{url:"/logo.png",revision:"de5fcf69feb2de554d29218dc6561fb8"},{url:"/logo.svg",revision:"e51e4953c61cbc443d6236459ac66a11"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:i})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
