import{registerVersion as e,_registerComponent as t,_getProvider,getApp as n}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";class FirebaseError extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name="FirebaseError",Object.setPrototypeOf(this,FirebaseError.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ErrorFactory.prototype.create)}}class ErrorFactory{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},a=`${this.service}/${e}`,o=this.errors[e],i=o?function replaceTemplate(e,t){return e.replace(r,((e,n)=>{const r=t[n];return null!=r?String(r):`<${n}?>`}))}(o,n):"Error",s=`${this.serviceName}: ${i} (${a}).`;return new FirebaseError(a,s,n)}}const r=/\{\$([^}]+)}/g;function getModularInstance(e){return e&&e._delegate?e._delegate:e}class Component{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}let a,o;const i=new WeakMap,s=new WeakMap,c=new WeakMap,u=new WeakMap,d=new WeakMap;let p={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return s.get(e);if("objectStoreNames"===t)return e.objectStoreNames||c.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return wrap(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function wrapFunction(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?function getCursorAdvanceMethods(){return o||(o=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}().includes(e)?function(...t){return e.apply(unwrap(this),t),wrap(i.get(this))}:function(...t){return wrap(e.apply(unwrap(this),t))}:function(t,...n){const r=e.call(unwrap(this),t,...n);return c.set(r,t.sort?t.sort():[t]),wrap(r)}}function transformCachableValue(e){return"function"==typeof e?wrapFunction(e):(e instanceof IDBTransaction&&function cacheDonePromiseForTransaction(e){if(s.has(e))return;const t=new Promise(((t,n)=>{const unlisten=()=>{e.removeEventListener("complete",complete),e.removeEventListener("error",error),e.removeEventListener("abort",error)},complete=()=>{t(),unlisten()},error=()=>{n(e.error||new DOMException("AbortError","AbortError")),unlisten()};e.addEventListener("complete",complete),e.addEventListener("error",error),e.addEventListener("abort",error)}));s.set(e,t)}(e),t=e,function getIdbProxyableTypes(){return a||(a=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}().some((e=>t instanceof e))?new Proxy(e,p):e);var t}function wrap(e){if(e instanceof IDBRequest)return function promisifyRequest(e){const t=new Promise(((t,n)=>{const unlisten=()=>{e.removeEventListener("success",success),e.removeEventListener("error",error)},success=()=>{t(wrap(e.result)),unlisten()},error=()=>{n(e.error),unlisten()};e.addEventListener("success",success),e.addEventListener("error",error)}));return t.then((t=>{t instanceof IDBCursor&&i.set(t,e)})).catch((()=>{})),d.set(t,e),t}(e);if(u.has(e))return u.get(e);const t=transformCachableValue(e);return t!==e&&(u.set(e,t),d.set(t,e)),t}const unwrap=e=>d.get(e);function openDB(e,t,{blocked:n,upgrade:r,blocking:a,terminated:o}={}){const i=indexedDB.open(e,t),s=wrap(i);return r&&i.addEventListener("upgradeneeded",(e=>{r(wrap(i.result),e.oldVersion,e.newVersion,wrap(i.transaction),e)})),n&&i.addEventListener("blocked",(e=>n(e.oldVersion,e.newVersion,e))),s.then((e=>{o&&e.addEventListener("close",(()=>o())),a&&e.addEventListener("versionchange",(e=>a(e.oldVersion,e.newVersion,e)))})).catch((()=>{})),s}function deleteDB(e,{blocked:t}={}){const n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",(e=>t(e.oldVersion,e))),wrap(n).then((()=>{}))}const l=["get","getKey","getAll","getAllKeys","count"],g=["put","add","delete","clear"],f=new Map;function getMethod(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(f.get(t))return f.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,a=g.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!a&&!l.includes(n))return;const method=async function(e,...t){const o=this.transaction(e,a?"readwrite":"readonly");let i=o.store;return r&&(i=i.index(t.shift())),(await Promise.all([i[n](...t),a&&o.done]))[0]};return f.set(t,method),method}!function replaceTraps(e){p=e(p)}((e=>({...e,get:(t,n,r)=>getMethod(t,n)||e.get(t,n,r),has:(t,n)=>!!getMethod(t,n)||e.has(t,n)})));const h="@firebase/installations",w=new ErrorFactory("installations","Installations",{"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."});function isServerError(e){return e instanceof FirebaseError&&e.code.includes("request-failed")}function getInstallationsEndpoint({projectId:e}){return`https://firebaseinstallations.googleapis.com/v1/projects/${e}/installations`}function extractAuthTokenInfoFromResponse(e){return{token:e.token,requestStatus:2,expiresIn:(t=e.expiresIn,Number(t.replace("s","000"))),creationTime:Date.now()};var t}async function getErrorFromResponse(e,t){const n=(await t.json()).error;return w.create("request-failed",{requestName:e,serverCode:n.code,serverMessage:n.message,serverStatus:n.status})}function getHeaders$1({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function getHeadersWithAuth(e,{refreshToken:t}){const n=getHeaders$1(e);return n.append("Authorization",function getAuthorizationHeader(e){return`FIS_v2 ${e}`}(t)),n}async function retryIfServerError(e){const t=await e();return t.status>=500&&t.status<600?e():t}function sleep(e){return new Promise((t=>{setTimeout(t,e)}))}const m=/^[cdef][\w-]{21}$/;function generateFid(){try{const e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;const t=function encode(e){return function bufferToBase64UrlSafe(e){return btoa(String.fromCharCode(...e)).replace(/\+/g,"-").replace(/\//g,"_")}(e).substr(0,22)}(e);return m.test(t)?t:""}catch(e){return""}}function getKey$1(e){return`${e.appName}!${e.appId}`}const y=new Map;function fidChanged(e,t){const n=getKey$1(e);callFidChangeCallbacks(n,t),function broadcastFidChange(e,t){const n=function getBroadcastChannel(){!b&&"BroadcastChannel"in self&&(b=new BroadcastChannel("[Firebase] FID Change"),b.onmessage=e=>{callFidChangeCallbacks(e.data.key,e.data.fid)});return b}();n&&n.postMessage({key:e,fid:t});!function closeBroadcastChannel(){0===y.size&&b&&(b.close(),b=null)}()}(n,t)}function callFidChangeCallbacks(e,t){const n=y.get(e);if(n)for(const e of n)e(t)}let b=null;const v="firebase-installations-store";let k=null;function getDbPromise$1(){return k||(k=openDB("firebase-installations-database",1,{upgrade:(e,t)=>{if(0===t)e.createObjectStore(v)}})),k}async function set(e,t){const n=getKey$1(e),r=(await getDbPromise$1()).transaction(v,"readwrite"),a=r.objectStore(v),o=await a.get(n);return await a.put(t,n),await r.done,o&&o.fid===t.fid||fidChanged(e,t.fid),t}async function remove(e){const t=getKey$1(e),n=(await getDbPromise$1()).transaction(v,"readwrite");await n.objectStore(v).delete(t),await n.done}async function update(e,t){const n=getKey$1(e),r=(await getDbPromise$1()).transaction(v,"readwrite"),a=r.objectStore(v),o=await a.get(n),i=t(o);return void 0===i?await a.delete(n):await a.put(i,n),await r.done,!i||o&&o.fid===i.fid||fidChanged(e,i.fid),i}async function getInstallationEntry(e){let t;const n=await update(e.appConfig,(n=>{const r=function updateOrCreateInstallationEntry(e){return clearTimedOutRequest(e||{fid:generateFid(),registrationStatus:0})}(n),a=function triggerRegistrationIfNecessary(e,t){if(0===t.registrationStatus){if(!navigator.onLine){return{installationEntry:t,registrationPromise:Promise.reject(w.create("app-offline"))}}const n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},r=async function registerInstallation(e,t){try{const n=await async function createInstallationRequest({appConfig:e,heartbeatServiceProvider:t},{fid:n}){const r=getInstallationsEndpoint(e),a=getHeaders$1(e),o=t.getImmediate({optional:!0});if(o){const e=await o.getHeartbeatsHeader();e&&a.append("x-firebase-client",e)}const i={fid:n,authVersion:"FIS_v2",appId:e.appId,sdkVersion:"w:0.6.7"},s={method:"POST",headers:a,body:JSON.stringify(i)},c=await retryIfServerError((()=>fetch(r,s)));if(c.ok){const e=await c.json();return{fid:e.fid||n,registrationStatus:2,refreshToken:e.refreshToken,authToken:extractAuthTokenInfoFromResponse(e.authToken)}}throw await getErrorFromResponse("Create Installation",c)}(e,t);return set(e.appConfig,n)}catch(n){throw isServerError(n)&&409===n.customData.serverCode?await remove(e.appConfig):await set(e.appConfig,{fid:t.fid,registrationStatus:0}),n}}(e,n);return{installationEntry:n,registrationPromise:r}}return 1===t.registrationStatus?{installationEntry:t,registrationPromise:waitUntilFidRegistration(e)}:{installationEntry:t}}(e,r);return t=a.registrationPromise,a.installationEntry}));return""===n.fid?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}async function waitUntilFidRegistration(e){let t=await updateInstallationRequest(e.appConfig);for(;1===t.registrationStatus;)await sleep(100),t=await updateInstallationRequest(e.appConfig);if(0===t.registrationStatus){const{installationEntry:t,registrationPromise:n}=await getInstallationEntry(e);return n||t}return t}function updateInstallationRequest(e){return update(e,(e=>{if(!e)throw w.create("installation-not-found");return clearTimedOutRequest(e)}))}function clearTimedOutRequest(e){return function hasInstallationRequestTimedOut(e){return 1===e.registrationStatus&&e.registrationTime+1e4<Date.now()}(e)?{fid:e.fid,registrationStatus:0}:e}async function generateAuthTokenRequest({appConfig:e,heartbeatServiceProvider:t},n){const r=function getGenerateAuthTokenEndpoint(e,{fid:t}){return`${getInstallationsEndpoint(e)}/${t}/authTokens:generate`}(e,n),a=getHeadersWithAuth(e,n),o=t.getImmediate({optional:!0});if(o){const e=await o.getHeartbeatsHeader();e&&a.append("x-firebase-client",e)}const i={installation:{sdkVersion:"w:0.6.7",appId:e.appId}},s={method:"POST",headers:a,body:JSON.stringify(i)},c=await retryIfServerError((()=>fetch(r,s)));if(c.ok){return extractAuthTokenInfoFromResponse(await c.json())}throw await getErrorFromResponse("Generate Auth Token",c)}async function refreshAuthToken(e,t=!1){let n;const r=await update(e.appConfig,(r=>{if(!isEntryRegistered(r))throw w.create("not-registered");const a=r.authToken;if(!t&&function isAuthTokenValid(e){return 2===e.requestStatus&&!function isAuthTokenExpired(e){const t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+36e5}(e)}(a))return r;if(1===a.requestStatus)return n=async function waitUntilAuthTokenRequest(e,t){let n=await updateAuthTokenRequest(e.appConfig);for(;1===n.authToken.requestStatus;)await sleep(100),n=await updateAuthTokenRequest(e.appConfig);const r=n.authToken;return 0===r.requestStatus?refreshAuthToken(e,t):r}(e,t),r;{if(!navigator.onLine)throw w.create("app-offline");const t=function makeAuthTokenRequestInProgressEntry(e){const t={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},e),{authToken:t})}(r);return n=async function fetchAuthTokenFromServer(e,t){try{const n=await generateAuthTokenRequest(e,t),r=Object.assign(Object.assign({},t),{authToken:n});return await set(e.appConfig,r),n}catch(n){if(!isServerError(n)||401!==n.customData.serverCode&&404!==n.customData.serverCode){const n=Object.assign(Object.assign({},t),{authToken:{requestStatus:0}});await set(e.appConfig,n)}else await remove(e.appConfig);throw n}}(e,t),t}}));return n?await n:r.authToken}function updateAuthTokenRequest(e){return update(e,(e=>{if(!isEntryRegistered(e))throw w.create("not-registered");return function hasAuthTokenRequestTimedOut(e){return 1===e.requestStatus&&e.requestTime+1e4<Date.now()}(e.authToken)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e}))}function isEntryRegistered(e){return void 0!==e&&2===e.registrationStatus}async function getToken$2(e,t=!1){const n=e;await async function completeInstallationRegistration(e){const{registrationPromise:t}=await getInstallationEntry(e);t&&await t}(n);return(await refreshAuthToken(n,t)).token}function getMissingValueError$1(e){return w.create("missing-app-config-values",{valueName:e})}const publicFactory=e=>{const t=e.getProvider("app").getImmediate(),n=function extractAppConfig$1(e){if(!e||!e.options)throw getMissingValueError$1("App Configuration");if(!e.name)throw getMissingValueError$1("App Name");const t=["projectId","apiKey","appId"];for(const n of t)if(!e.options[n])throw getMissingValueError$1(n);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}(t);return{app:t,appConfig:n,heartbeatServiceProvider:_getProvider(t,"heartbeat"),_delete:()=>Promise.resolve()}},internalFactory=e=>{const t=e.getProvider("app").getImmediate(),n=_getProvider(t,"installations").getImmediate();return{getId:()=>async function getId(e){const t=e,{installationEntry:n,registrationPromise:r}=await getInstallationEntry(t);return r?r.catch(console.error):refreshAuthToken(t).catch(console.error),n.fid}(n),getToken:e=>getToken$2(n,e)}};!function registerInstallations(){t(new Component("installations",publicFactory,"PUBLIC")),t(new Component("installations-internal",internalFactory,"PRIVATE"))}(),e(h,"0.6.7"),e(h,"0.6.7","esm2017");const I="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4";var T,S;function arrayToBase64(e){const t=new Uint8Array(e);return btoa(String.fromCharCode(...t)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function base64ToArray(e){const t=(e+"=".repeat((4-e.length%4)%4)).replace(/\-/g,"+").replace(/_/g,"/"),n=atob(t),r=new Uint8Array(n.length);for(let e=0;e<n.length;++e)r[e]=n.charCodeAt(e);return r}!function(e){e[e.DATA_MESSAGE=1]="DATA_MESSAGE",e[e.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"}(T||(T={})),function(e){e.PUSH_RECEIVED="push-received",e.NOTIFICATION_CLICKED="notification-clicked"}(S||(S={}));const E="firebase-messaging-store";let D=null;function getDbPromise(){return D||(D=openDB("firebase-messaging-database",1,{upgrade:(e,t)=>{if(0===t)e.createObjectStore(E)}})),D}async function dbGet(e){const t=getKey(e),n=await getDbPromise(),r=await n.transaction(E).objectStore(E).get(t);if(r)return r;{const t=await async function migrateOldDatabase(e){if("databases"in indexedDB){const e=(await indexedDB.databases()).map((e=>e.name));if(!e.includes("fcm_token_details_db"))return null}let t=null;return(await openDB("fcm_token_details_db",5,{upgrade:async(n,r,a,o)=>{var i;if(r<2)return;if(!n.objectStoreNames.contains("fcm_token_object_Store"))return;const s=o.objectStore("fcm_token_object_Store"),c=await s.index("fcmSenderId").get(e);if(await s.clear(),c)if(2===r){const e=c;if(!e.auth||!e.p256dh||!e.endpoint)return;t={token:e.fcmToken,createTime:null!==(i=e.createTime)&&void 0!==i?i:Date.now(),subscriptionOptions:{auth:e.auth,p256dh:e.p256dh,endpoint:e.endpoint,swScope:e.swScope,vapidKey:"string"==typeof e.vapidKey?e.vapidKey:arrayToBase64(e.vapidKey)}}}else if(3===r){const e=c;t={token:e.fcmToken,createTime:e.createTime,subscriptionOptions:{auth:arrayToBase64(e.auth),p256dh:arrayToBase64(e.p256dh),endpoint:e.endpoint,swScope:e.swScope,vapidKey:arrayToBase64(e.vapidKey)}}}else if(4===r){const e=c;t={token:e.fcmToken,createTime:e.createTime,subscriptionOptions:{auth:arrayToBase64(e.auth),p256dh:arrayToBase64(e.p256dh),endpoint:e.endpoint,swScope:e.swScope,vapidKey:arrayToBase64(e.vapidKey)}}}}})).close(),await deleteDB("fcm_token_details_db"),await deleteDB("fcm_vapid_details_db"),await deleteDB("undefined"),function checkTokenDetails(e){if(!e||!e.subscriptionOptions)return!1;const{subscriptionOptions:t}=e;return"number"==typeof e.createTime&&e.createTime>0&&"string"==typeof e.token&&e.token.length>0&&"string"==typeof t.auth&&t.auth.length>0&&"string"==typeof t.p256dh&&t.p256dh.length>0&&"string"==typeof t.endpoint&&t.endpoint.length>0&&"string"==typeof t.swScope&&t.swScope.length>0&&"string"==typeof t.vapidKey&&t.vapidKey.length>0}(t)?t:null}(e.appConfig.senderId);if(t)return await dbSet(e,t),t}}async function dbSet(e,t){const n=getKey(e),r=(await getDbPromise()).transaction(E,"readwrite");return await r.objectStore(E).put(t,n),await r.done,t}function getKey({appConfig:e}){return e.appId}const C=new ErrorFactory("messaging","Messaging",{"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."});async function requestDeleteToken(e,t){const n={method:"DELETE",headers:await getHeaders(e)};try{const r=await fetch(`${getEndpoint(e.appConfig)}/${t}`,n),a=await r.json();if(a.error){const e=a.error.message;throw C.create("token-unsubscribe-failed",{errorInfo:e})}}catch(e){throw C.create("token-unsubscribe-failed",{errorInfo:null==e?void 0:e.toString()})}}function getEndpoint({projectId:e}){return`https://fcmregistrations.googleapis.com/v1/projects/${e}/registrations`}async function getHeaders({appConfig:e,installations:t}){const n=await t.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e.apiKey,"x-goog-firebase-installations-auth":`FIS ${n}`})}function getBody({p256dh:e,auth:t,endpoint:n,vapidKey:r}){const a={web:{endpoint:n,auth:t,p256dh:e}};return r!==I&&(a.web.applicationPubKey=r),a}async function getTokenInternal(e){const t=await async function getPushSubscription(e,t){const n=await e.pushManager.getSubscription();if(n)return n;return e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:base64ToArray(t)})}(e.swRegistration,e.vapidKey),n={vapidKey:e.vapidKey,swScope:e.swRegistration.scope,endpoint:t.endpoint,auth:arrayToBase64(t.getKey("auth")),p256dh:arrayToBase64(t.getKey("p256dh"))},r=await dbGet(e.firebaseDependencies);if(r){if(function isTokenValid(e,t){const n=t.vapidKey===e.vapidKey,r=t.endpoint===e.endpoint,a=t.auth===e.auth,o=t.p256dh===e.p256dh;return n&&r&&a&&o}(r.subscriptionOptions,n))return Date.now()>=r.createTime+6048e5?async function updateToken(e,t){try{const n=await async function requestUpdateToken(e,t){const n=await getHeaders(e),r=getBody(t.subscriptionOptions),a={method:"PATCH",headers:n,body:JSON.stringify(r)};let o;try{const n=await fetch(`${getEndpoint(e.appConfig)}/${t.token}`,a);o=await n.json()}catch(e){throw C.create("token-update-failed",{errorInfo:null==e?void 0:e.toString()})}if(o.error){const e=o.error.message;throw C.create("token-update-failed",{errorInfo:e})}if(!o.token)throw C.create("token-update-no-token");return o.token}(e.firebaseDependencies,t),r=Object.assign(Object.assign({},t),{token:n,createTime:Date.now()});return await dbSet(e.firebaseDependencies,r),n}catch(e){throw e}}(e,{token:r.token,createTime:Date.now(),subscriptionOptions:n}):r.token;try{await requestDeleteToken(e.firebaseDependencies,r.token)}catch(e){console.warn(e)}return getNewToken(e.firebaseDependencies,n)}return getNewToken(e.firebaseDependencies,n)}async function deleteTokenInternal(e){const t=await dbGet(e.firebaseDependencies);t&&(await requestDeleteToken(e.firebaseDependencies,t.token),await async function dbRemove(e){const t=getKey(e),n=(await getDbPromise()).transaction(E,"readwrite");await n.objectStore(E).delete(t),await n.done}(e.firebaseDependencies));const n=await e.swRegistration.pushManager.getSubscription();return!n||n.unsubscribe()}async function getNewToken(e,t){const n=await async function requestGetToken(e,t){const n=await getHeaders(e),r=getBody(t),a={method:"POST",headers:n,body:JSON.stringify(r)};let o;try{const t=await fetch(getEndpoint(e.appConfig),a);o=await t.json()}catch(e){throw C.create("token-subscribe-failed",{errorInfo:null==e?void 0:e.toString()})}if(o.error){const e=o.error.message;throw C.create("token-subscribe-failed",{errorInfo:e})}if(!o.token)throw C.create("token-subscribe-no-token");return o.token}(e,t),r={token:n,createTime:Date.now(),subscriptionOptions:t};return await dbSet(e,r),r.token}function externalizePayload(e){const t={from:e.from,collapseKey:e.collapse_key,messageId:e.fcmMessageId};return function propagateNotificationPayload(e,t){if(!t.notification)return;e.notification={};const n=t.notification.title;n&&(e.notification.title=n);const r=t.notification.body;r&&(e.notification.body=r);const a=t.notification.image;a&&(e.notification.image=a);const o=t.notification.icon;o&&(e.notification.icon=o)}(t,e),function propagateDataPayload(e,t){if(!t.data)return;e.data=t.data}(t,e),function propagateFcmOptions(e,t){var n,r,a,o,i;if(!t.fcmOptions&&!(null===(n=t.notification)||void 0===n?void 0:n.click_action))return;e.fcmOptions={};const s=null!==(a=null===(r=t.fcmOptions)||void 0===r?void 0:r.link)&&void 0!==a?a:null===(o=t.notification)||void 0===o?void 0:o.click_action;s&&(e.fcmOptions.link=s);const c=null===(i=t.fcmOptions)||void 0===i?void 0:i.analytics_label;c&&(e.fcmOptions.analyticsLabel=c)}(t,e),t}function _mergeStrings(e,t){const n=[];for(let r=0;r<e.length;r++)n.push(e.charAt(r)),r<t.length&&n.push(t.charAt(r));return n.join("")}function getMissingValueError(e){return C.create("missing-app-config-values",{valueName:e})}_mergeStrings("hts/frbslgigp.ogepscmv/ieo/eaylg","tp:/ieaeogn-agolai.o/1frlglgc/o"),_mergeStrings("AzSCbw63g1R0nCw85jG8","Iaya3yLKwmgvh7cF0q4");class MessagingService{constructor(e,t,n){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.logEvents=[],this.isLogServiceStarted=!1;const r=function extractAppConfig(e){if(!e||!e.options)throw getMissingValueError("App Configuration Object");if(!e.name)throw getMissingValueError("App Name");const t=["projectId","apiKey","appId","messagingSenderId"],{options:n}=e;for(const e of t)if(!n[e])throw getMissingValueError(e);return{appName:e.name,projectId:n.projectId,apiKey:n.apiKey,appId:n.appId,senderId:n.messagingSenderId}}(e);this.firebaseDependencies={app:e,appConfig:r,installations:t,analyticsProvider:n}}_delete(){return Promise.resolve()}}async function registerDefaultSw(e){try{e.swRegistration=await navigator.serviceWorker.register("/firebase-messaging-sw.js",{scope:"/firebase-cloud-messaging-push-scope"}),e.swRegistration.update().catch((()=>{}))}catch(e){throw C.create("failed-service-worker-registration",{browserErrorMessage:null==e?void 0:e.message})}}async function getToken$1(e,t){if(!navigator)throw C.create("only-available-in-window");if("default"===Notification.permission&&await Notification.requestPermission(),"granted"!==Notification.permission)throw C.create("permission-blocked");return await async function updateVapidKey(e,t){t?e.vapidKey=t:e.vapidKey||(e.vapidKey=I)}(e,null==t?void 0:t.vapidKey),await async function updateSwReg(e,t){if(t||e.swRegistration||await registerDefaultSw(e),t||!e.swRegistration){if(!(t instanceof ServiceWorkerRegistration))throw C.create("invalid-sw-registration");e.swRegistration=t}}(e,null==t?void 0:t.serviceWorkerRegistration),getTokenInternal(e)}async function logToScion(e,t,n){const r=function getEventType(e){switch(e){case S.NOTIFICATION_CLICKED:return"notification_open";case S.PUSH_RECEIVED:return"notification_foreground";default:throw new Error}}(t);(await e.firebaseDependencies.analyticsProvider.get()).logEvent(r,{message_id:n["google.c.a.c_id"],message_name:n["google.c.a.c_l"],message_time:n["google.c.a.ts"],message_device_time:Math.floor(Date.now()/1e3)})}const M="@firebase/messaging",WindowMessagingFactory=e=>{const t=new MessagingService(e.getProvider("app").getImmediate(),e.getProvider("installations-internal").getImmediate(),e.getProvider("analytics-internal"));return navigator.serviceWorker.addEventListener("message",(e=>async function messageEventListener(e,t){const n=t.data;if(!n.isFirebaseMessaging)return;e.onMessageHandler&&n.messageType===S.PUSH_RECEIVED&&("function"==typeof e.onMessageHandler?e.onMessageHandler(externalizePayload(n)):e.onMessageHandler.next(externalizePayload(n)));const r=n.data;(function isConsoleMessage(e){return"object"==typeof e&&!!e&&"google.c.a.c_id"in e})(r)&&"1"===r["google.c.a.e"]&&await logToScion(e,n.messageType,r)}(t,e))),t},WindowMessagingInternalFactory=e=>{const t=e.getProvider("messaging").getImmediate();return{getToken:e=>getToken$1(t,e)}};async function isWindowSupported(){try{await function validateIndexedDBOpenable(){return new Promise(((e,t)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",a=self.indexedDB.open(r);a.onsuccess=()=>{a.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},a.onupgradeneeded=()=>{n=!1},a.onerror=()=>{var e;t((null===(e=a.error)||void 0===e?void 0:e.message)||"")}}catch(e){t(e)}}))}()}catch(e){return!1}return"undefined"!=typeof window&&function isIndexedDBAvailable(){try{return"object"==typeof indexedDB}catch(e){return!1}}()&&function areCookiesEnabled(){return!("undefined"==typeof navigator||!navigator.cookieEnabled)}()&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&"fetch"in window&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}function getMessagingInWindow(e=n()){return isWindowSupported().then((e=>{if(!e)throw C.create("unsupported-browser")}),(e=>{throw C.create("indexed-db-unsupported")})),_getProvider(getModularInstance(e),"messaging").getImmediate()}async function getToken(e,t){return getToken$1(e=getModularInstance(e),t)}function deleteToken(e){return async function deleteToken$1(e){if(!navigator)throw C.create("only-available-in-window");return e.swRegistration||await registerDefaultSw(e),deleteTokenInternal(e)}(e=getModularInstance(e))}function onMessage(e,t){return function onMessage$1(e,t){if(!navigator)throw C.create("only-available-in-window");return e.onMessageHandler=t,()=>{e.onMessageHandler=null}}(e=getModularInstance(e),t)}!function registerMessagingInWindow(){t(new Component("messaging",WindowMessagingFactory,"PUBLIC")),t(new Component("messaging-internal",WindowMessagingInternalFactory,"PRIVATE")),e(M,"0.12.9"),e(M,"0.12.9","esm2017")}();export{deleteToken,getMessagingInWindow as getMessaging,getToken,isWindowSupported as isSupported,onMessage};

//# sourceMappingURL=firebase-messaging.js.map
