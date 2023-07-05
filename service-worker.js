!function(){"use strict";try{self["workbox:core:6.4.1"]&&_()}catch(t){}const t=(t,...e)=>{let s=t;return e.length>0&&(s+=` :: ${JSON.stringify(e)}`),s};class e extends Error{constructor(e,s){super(t(e,s)),this.name=e,this.details=s}}try{self["workbox:routing:6.4.1"]&&_()}catch(t){}const s=t=>t&&"object"==typeof t?t:{handle:t};class n{constructor(t,e,n="GET"){this.handler=s(e),this.match=t,this.method=n}setCatchHandler(t){this.catchHandler=s(t)}}class r extends n{constructor(t,e,s){super((({url:e})=>{const s=t.exec(e.href);if(s&&(e.origin===location.origin||0===s.index))return s.slice(1)}),e,s)}}class i{constructor(){this.t=new Map,this.i=new Map}get routes(){return this.t}addFetchListener(){self.addEventListener("fetch",(t=>{const{request:e}=t,s=this.handleRequest({request:e,event:t});s&&t.respondWith(s)}))}addCacheListener(){self.addEventListener("message",(t=>{if(t.data&&"CACHE_URLS"===t.data.type){const{payload:e}=t.data,s=Promise.all(e.urlsToCache.map((e=>{"string"==typeof e&&(e=[e]);const s=new Request(...e);return this.handleRequest({request:s,event:t})})));t.waitUntil(s),t.ports&&t.ports[0]&&s.then((()=>t.ports[0].postMessage(!0)))}}))}handleRequest({request:t,event:e}){const s=new URL(t.url,location.href);if(!s.protocol.startsWith("http"))return;const n=s.origin===location.origin,{params:r,route:i}=this.findMatchingRoute({event:e,request:t,sameOrigin:n,url:s});let a=i&&i.handler;const o=t.method;if(!a&&this.i.has(o)&&(a=this.i.get(o)),!a)return;let c;try{c=a.handle({url:s,request:t,event:e,params:r})}catch(t){c=Promise.reject(t)}const h=i&&i.catchHandler;return c instanceof Promise&&(this.o||h)&&(c=c.catch((async n=>{if(h)try{return await h.handle({url:s,request:t,event:e,params:r})}catch(t){t instanceof Error&&(n=t)}if(this.o)return this.o.handle({url:s,request:t,event:e});throw n}))),c}findMatchingRoute({url:t,sameOrigin:e,request:s,event:n}){const r=this.t.get(s.method)||[];for(const i of r){let r;const a=i.match({url:t,sameOrigin:e,request:s,event:n});if(a)return r=a,(Array.isArray(r)&&0===r.length||a.constructor===Object&&0===Object.keys(a).length||"boolean"==typeof a)&&(r=void 0),{route:i,params:r}}return{}}setDefaultHandler(t,e="GET"){this.i.set(e,s(t))}setCatchHandler(t){this.o=s(t)}registerRoute(t){this.t.has(t.method)||this.t.set(t.method,[]),this.t.get(t.method).push(t)}unregisterRoute(t){if(!this.t.has(t.method))throw new e("unregister-route-but-not-found-with-method",{method:t.method});const s=this.t.get(t.method).indexOf(t);if(!(s>-1))throw new e("unregister-route-route-not-registered");this.t.get(t.method).splice(s,1)}}let a;const o=()=>(a||(a=new i,a.addFetchListener(),a.addCacheListener()),a);function c(t,s,i){let a;if("string"==typeof t){const e=new URL(t,location.href);a=new n((({url:t})=>t.href===e.href),s,i)}else if(t instanceof RegExp)a=new r(t,s,i);else if("function"==typeof t)a=new n(t,s,i);else{if(!(t instanceof n))throw new e("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});a=t}return o().registerRoute(a),a}const h={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},u=t=>[h.prefix,t,h.suffix].filter((t=>t&&t.length>0)).join("-"),f=t=>t||u(h.runtime);function l(t,e){const s=new URL(t);for(const t of e)s.searchParams.delete(t);return s.href}class w{constructor(){this.promise=new Promise(((t,e)=>{this.resolve=t,this.reject=e}))}}const d=new Set;function p(t){return new Promise((e=>setTimeout(e,t)))}try{self["workbox:strategies:6.4.1"]&&_()}catch(t){}function y(t){return"string"==typeof t?new Request(t):t}class m{constructor(t,e){this.h={},Object.assign(this,e),this.event=e.event,this.u=t,this.l=new w,this.p=[],this.m=[...t.plugins],this.g=new Map;for(const t of this.m)this.g.set(t,{});this.event.waitUntil(this.l.promise)}async fetch(t){const{event:s}=this;let n=y(t);if("navigate"===n.mode&&s instanceof FetchEvent&&s.preloadResponse){const t=await s.preloadResponse;if(t)return t}const r=this.hasCallback("fetchDidFail")?n.clone():null;try{for(const t of this.iterateCallbacks("requestWillFetch"))n=await t({request:n.clone(),event:s})}catch(t){if(t instanceof Error)throw new e("plugin-error-request-will-fetch",{thrownErrorMessage:t.message})}const i=n.clone();try{let t;t=await fetch(n,"navigate"===n.mode?void 0:this.u.fetchOptions);for(const e of this.iterateCallbacks("fetchDidSucceed"))t=await e({event:s,request:i,response:t});return t}catch(t){throw r&&await this.runCallbacks("fetchDidFail",{error:t,event:s,originalRequest:r.clone(),request:i.clone()}),t}}async fetchAndCachePut(t){const e=await this.fetch(t),s=e.clone();return this.waitUntil(this.cachePut(t,s)),e}async cacheMatch(t){const e=y(t);let s;const{cacheName:n,matchOptions:r}=this.u,i=await this.getCacheKey(e,"read"),a=Object.assign(Object.assign({},r),{cacheName:n});s=await caches.match(i,a);for(const t of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await t({cacheName:n,matchOptions:r,cachedResponse:s,request:i,event:this.event})||void 0;return s}async cachePut(t,s){const n=y(t);await p(0);const r=await this.getCacheKey(n,"write");if(!s)throw new e("cache-put-with-no-response",{url:(i=r.url,new URL(String(i),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var i;const a=await this.v(s);if(!a)return!1;const{cacheName:o,matchOptions:c}=this.u,h=await self.caches.open(o),u=this.hasCallback("cacheDidUpdate"),f=u?await async function(t,e,s,n){const r=l(e.url,s);if(e.url===r)return t.match(e,n);const i=Object.assign(Object.assign({},n),{ignoreSearch:!0}),a=await t.keys(e,i);for(const e of a)if(r===l(e.url,s))return t.match(e,n)}(h,r.clone(),["__WB_REVISION__"],c):null;try{await h.put(r,u?a.clone():a)}catch(t){if(t instanceof Error)throw"QuotaExceededError"===t.name&&await async function(){for(const t of d)await t()}(),t}for(const t of this.iterateCallbacks("cacheDidUpdate"))await t({cacheName:o,oldResponse:f,newResponse:a.clone(),request:r,event:this.event});return!0}async getCacheKey(t,e){const s=`${t.url} | ${e}`;if(!this.h[s]){let n=t;for(const t of this.iterateCallbacks("cacheKeyWillBeUsed"))n=y(await t({mode:e,request:n,event:this.event,params:this.params}));this.h[s]=n}return this.h[s]}hasCallback(t){for(const e of this.u.plugins)if(t in e)return!0;return!1}async runCallbacks(t,e){for(const s of this.iterateCallbacks(t))await s(e)}*iterateCallbacks(t){for(const e of this.u.plugins)if("function"==typeof e[t]){const s=this.g.get(e),n=n=>{const r=Object.assign(Object.assign({},n),{state:s});return e[t](r)};yield n}}waitUntil(t){return this.p.push(t),t}async doneWaiting(){let t;for(;t=this.p.shift();)await t}destroy(){this.l.resolve(null)}async v(t){let e=t,s=!1;for(const t of this.iterateCallbacks("cacheWillUpdate"))if(e=await t({request:this.request,response:e,event:this.event})||void 0,s=!0,!e)break;return s||e&&200!==e.status&&(e=void 0),e}}class g{constructor(t={}){this.cacheName=f(t.cacheName),this.plugins=t.plugins||[],this.fetchOptions=t.fetchOptions,this.matchOptions=t.matchOptions}handle(t){const[e]=this.handleAll(t);return e}handleAll(t){t instanceof FetchEvent&&(t={event:t,request:t.request});const e=t.event,s="string"==typeof t.request?new Request(t.request):t.request,n="params"in t?t.params:void 0,r=new m(this,{event:e,request:s,params:n}),i=this.D(r,s,e);return[i,this.q(i,r,s,e)]}async D(t,s,n){let r;await t.runCallbacks("handlerWillStart",{event:n,request:s});try{if(r=await this.R(s,t),!r||"error"===r.type)throw new e("no-response",{url:s.url})}catch(e){if(e instanceof Error)for(const i of t.iterateCallbacks("handlerDidError"))if(r=await i({error:e,event:n,request:s}),r)break;if(!r)throw e}for(const e of t.iterateCallbacks("handlerWillRespond"))r=await e({event:n,request:s,response:r});return r}async q(t,e,s,n){let r,i;try{r=await t}catch(i){}try{await e.runCallbacks("handlerDidRespond",{event:n,request:s,response:r}),await e.doneWaiting()}catch(t){t instanceof Error&&(i=t)}if(await e.runCallbacks("handlerDidComplete",{event:n,request:s,response:r,error:i}),e.destroy(),i)throw i}}const v={cacheWillUpdate:async({response:t})=>200===t.status||0===t.status?t:null};try{self["workbox:broadcast-update:6.4.1"]&&_()}catch(t){}const D=["content-length","etag","last-modified"],b=/^((?!chrome|android).)*safari/i.test(navigator.userAgent);function q(t){return{cacheName:t.cacheName,updatedURL:t.request.url}}class E{constructor({generatePayload:t,headersToCheck:e,notifyAllClients:s}={}){this.I=e||D,this.C=t||q,this.B=null==s||s}async notifyIfUpdated(t){var e,s,n;if(t.oldResponse&&(e=t.oldResponse,s=t.newResponse,(n=this.I).some((t=>e.headers.has(t)&&s.headers.has(t)))&&!n.every((t=>{const n=e.headers.has(t)===s.headers.has(t),r=e.headers.get(t)===s.headers.get(t);return n&&r})))){const e={type:"CACHE_UPDATED",meta:"workbox-broadcast-update",payload:this.C(t)};if("navigate"===t.request.mode){let e;t.event instanceof FetchEvent&&(e=t.event.resultingClientId);const s=await async function(t){if(!t)return;let e=await self.clients.matchAll({type:"window"});const s=new Set(e.map((t=>t.id)));let n;const r=performance.now();for(;performance.now()-r<2e3&&(e=await self.clients.matchAll({type:"window"}),n=e.find((e=>t?e.id===t:!s.has(e.id))),!n);)await p(100);return n}(e);s&&!b||await p(3500)}if(this.B){const t=await self.clients.matchAll({type:"window"});for(const s of t)s.postMessage(e)}else if(t.event instanceof FetchEvent){const s=await self.clients.get(t.event.clientId);null==s||s.postMessage(e)}}}}function R(t){t.then((()=>{}))}let x,I;const C=new WeakMap,B=new WeakMap,k=new WeakMap,N=new WeakMap,O=new WeakMap;let U={get(t,e,s){if(t instanceof IDBTransaction){if("done"===e)return B.get(t);if("objectStoreNames"===e)return t.objectStoreNames||k.get(t);if("store"===e)return s.objectStoreNames[1]?void 0:s.objectStore(s.objectStoreNames[0])}return W(t[e])},set:(t,e,s)=>(t[e]=s,!0),has:(t,e)=>t instanceof IDBTransaction&&("done"===e||"store"===e)||e in t};function j(t){return t!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(I||(I=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(t)?function(...e){return t.apply(A(this),e),W(C.get(this))}:function(...e){return W(t.apply(A(this),e))}:function(e,...s){const n=t.call(A(this),e,...s);return k.set(n,e.sort?e.sort():[e]),W(n)}}function M(t){return"function"==typeof t?j(t):(t instanceof IDBTransaction&&function(t){if(B.has(t))return;const e=new Promise(((e,s)=>{const n=()=>{t.removeEventListener("complete",r),t.removeEventListener("error",i),t.removeEventListener("abort",i)},r=()=>{e(),n()},i=()=>{s(t.error||new DOMException("AbortError","AbortError")),n()};t.addEventListener("complete",r),t.addEventListener("error",i),t.addEventListener("abort",i)}));B.set(t,e)}(t),e=t,(x||(x=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some((t=>e instanceof t))?new Proxy(t,U):t);var e}function W(t){if(t instanceof IDBRequest)return function(t){const e=new Promise(((e,s)=>{const n=()=>{t.removeEventListener("success",r),t.removeEventListener("error",i)},r=()=>{e(W(t.result)),n()},i=()=>{s(t.error),n()};t.addEventListener("success",r),t.addEventListener("error",i)}));return e.then((e=>{e instanceof IDBCursor&&C.set(e,t)})).catch((()=>{})),O.set(e,t),e}(t);if(N.has(t))return N.get(t);const e=M(t);return e!==t&&(N.set(t,e),O.set(e,t)),e}const A=t=>O.get(t);const T=["get","getKey","getAll","getAllKeys","count"],P=["put","add","delete","clear"],S=new Map;function L(t,e){if(!(t instanceof IDBDatabase)||e in t||"string"!=typeof e)return;if(S.get(e))return S.get(e);const s=e.replace(/FromIndex$/,""),n=e!==s,r=P.includes(s);if(!(s in(n?IDBIndex:IDBObjectStore).prototype)||!r&&!T.includes(s))return;const i=async function(t,...e){const i=this.transaction(t,r?"readwrite":"readonly");let a=i.store;return n&&(a=a.index(e.shift())),(await Promise.all([a[s](...e),r&&i.done]))[0]};return S.set(e,i),i}U=(t=>({...t,get:(e,s,n)=>L(e,s)||t.get(e,s,n),has:(e,s)=>!!L(e,s)||t.has(e,s)}))(U);try{self["workbox:expiration:6.4.1"]&&_()}catch(t){}const F="cache-entries",$=t=>{const e=new URL(t,location.href);return e.hash="",e.href};class H{constructor(t){this._=null,this.k=t}N(t){const e=t.createObjectStore(F,{keyPath:"id"});e.createIndex("cacheName","cacheName",{unique:!1}),e.createIndex("timestamp","timestamp",{unique:!1})}O(t){this.N(t),this.k&&function(t,{blocked:e}={}){const s=indexedDB.deleteDatabase(t);e&&s.addEventListener("blocked",(()=>e())),W(s).then((()=>{}))}(this.k)}async setTimestamp(t,e){const s={url:t=$(t),timestamp:e,cacheName:this.k,id:this.U(t)},n=(await this.getDb()).transaction(F,"readwrite",{durability:"relaxed"});await n.store.put(s),await n.done}async getTimestamp(t){const e=await this.getDb(),s=await e.get(F,this.U(t));return null==s?void 0:s.timestamp}async expireEntries(t,e){const s=await this.getDb();let n=await s.transaction(F).store.index("timestamp").openCursor(null,"prev");const r=[];let i=0;for(;n;){const s=n.value;s.cacheName===this.k&&(t&&s.timestamp<t||e&&i>=e?r.push(n.value):i++),n=await n.continue()}const a=[];for(const t of r)await s.delete(F,t.id),a.push(t.url);return a}U(t){return this.k+"|"+$(t)}async getDb(){return this._||(this._=await function(t,e,{blocked:s,upgrade:n,blocking:r,terminated:i}={}){const a=indexedDB.open(t,e),o=W(a);return n&&a.addEventListener("upgradeneeded",(t=>{n(W(a.result),t.oldVersion,t.newVersion,W(a.transaction))})),s&&a.addEventListener("blocked",(()=>s())),o.then((t=>{i&&t.addEventListener("close",(()=>i())),r&&t.addEventListener("versionchange",(()=>r()))})).catch((()=>{})),o}("workbox-expiration",1,{upgrade:this.O.bind(this)})),this._}}class K{constructor(t,e={}){this.j=!1,this.M=!1,this.W=e.maxEntries,this.A=e.maxAgeSeconds,this.T=e.matchOptions,this.k=t,this.P=new H(t)}async expireEntries(){if(this.j)return void(this.M=!0);this.j=!0;const t=this.A?Date.now()-1e3*this.A:0,e=await this.P.expireEntries(t,this.W),s=await self.caches.open(this.k);for(const t of e)await s.delete(t,this.T);this.j=!1,this.M&&(this.M=!1,R(this.expireEntries()))}async updateTimestamp(t){await this.P.setTimestamp(t,Date.now())}async isURLExpired(t){if(this.A){const e=await this.P.getTimestamp(t),s=Date.now()-1e3*this.A;return void 0===e||e<s}return!1}async delete(){this.M=!1,await this.P.expireEntries(1/0)}}addEventListener("install",(()=>{skipWaiting()}));const G=new class extends g{async R(t,s){let n,r=await s.cacheMatch(t);if(!r)try{r=await s.fetchAndCachePut(t)}catch(t){t instanceof Error&&(n=t)}if(!r)throw new e("no-response",{url:t.url,error:n});return r}}({cacheName:"assets",plugins:[new class{constructor(t={}){this.cachedResponseWillBeUsed=async({event:t,request:e,cacheName:s,cachedResponse:n})=>{if(!n)return null;const r=this.S(n),i=this.L(s);R(i.expireEntries());const a=i.updateTimestamp(e.url);if(t)try{t.waitUntil(a)}catch(t){}return r?n:null},this.cacheDidUpdate=async({cacheName:t,request:e})=>{const s=this.L(t);await s.updateTimestamp(e.url),await s.expireEntries()},this.F=t,this.A=t.maxAgeSeconds,this.$=new Map,t.purgeOnQuotaError&&function(t){d.add(t)}((()=>this.deleteCacheAndMetadata()))}L(t){if(t===f())throw new e("expire-custom-caches-only");let s=this.$.get(t);return s||(s=new K(t,this.F),this.$.set(t,s)),s}S(t){if(!this.A)return!0;const e=this.H(t);if(null===e)return!0;return e>=Date.now()-1e3*this.A}H(t){if(!t.headers.has("date"))return null;const e=t.headers.get("date"),s=new Date(e).getTime();return isNaN(s)?null:s}async deleteCacheAndMetadata(){for(const[t,e]of this.$)await self.caches.delete(t),await e.delete();this.$=new Map}}({maxEntries:100})]});c(/(\/|\.html)$/,new class extends g{constructor(t={}){super(t),this.plugins.some((t=>"cacheWillUpdate"in t))||this.plugins.unshift(v)}async R(t,s){const n=s.fetchAndCachePut(t).catch((()=>{}));let r,i=await s.cacheMatch(t);if(i);else try{i=await n}catch(t){t instanceof Error&&(r=t)}if(!i)throw new e("no-response",{url:t.url,error:r});return i}}({cacheName:"pages",plugins:[new class{constructor(t){this.cacheDidUpdate=async t=>{R(this.K.notifyIfUpdated(t))},this.K=new E(t)}}]})),c(/\.(css|m?js|svg|woff2|png|jpg|gif|json|xml)$/,G)}();