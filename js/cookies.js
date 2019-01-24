/* TABLE:  Cookies & Storage */

'use strict';

// functions
function getCookie(cname) {
  var name = cname + "="; var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {c = c.substring(1);}
    if (c.indexOf(name) == 0) {return c.substring(name.length, c.length);}
  }
  return "";
};
function rndString() {return Math.random().toString(36).substring(2, 15);};
var rndStr = "";

// cookie support
if (navigator.cookieEnabled == true) {dom.nCookieEnabled="enabled"} else {dom.nCookieEnabled="disabled"};
// cookie test
rndStr = rndString(); document.cookie = rndStr+"="+rndStr;
if (getCookie(rndStr) != ""){dom.cookieTest="yes"} else { dom.cookieTest="no"};

// localStorage support
try {
  if (typeof(localStorage) != "undefined") {dom.storageLSupport="enabled";}
  else {dom.storageLSupport="disabled: undefined"};}
catch(err) {dom.storageLSupport="disabled: catch(err)"};
// localStorage test
rndStr = rndString();
try {localStorage.setItem(rndStr, rndStr);
  if(!localStorage.getItem(rndStr)) {dom.storageLTest="no"} else {dom.storageLTest="yes"};}
catch(err) {dom.storageLTest="no: catch(err)"};

// sessionStorage support
try {
  if (typeof(sessionStorage) != "undefined") {dom.storageSSupport="enabled"}
  else {dom.storageSSupport="disabled: undefined"};}
catch(err) {dom.storageSSupport="disabled: catch(err)"};
// sessionStorage test
rndStr = rndString();
try {sessionStorage.setItem(rndStr, rndStr);
  if(!sessionStorage.getItem(rndStr)) {dom.storageSTest="no"} else {dom.storageSTest="yes"};}
catch(err) {dom.storageSTest="no: catch(err)"};

// indexedDB support
try {if (!window.indexedDB) {dom.IDBSupport="disabled"} else {dom.IDBSupport="enabled"};}
catch(err) {dom.IDBSupport="disabled: catch(err)"};
// indexedDB test
rndStr = rndString();
try {
  var requestIDB = indexedDB.open(rndStr);
  requestIDB.onerror = function() {dom.IDBTest = "no: onerror"};
  requestIDB.onsuccess = function() {
    // success, now store some data and read it back
    dom.IDBTest="yes: test to come";
    };}
catch(err) {dom.IDBTest="no: catch(err)"};

// appCache support
if ("applicationCache" in window) {
  dom.appCacheSupport="enabled";
  // appCache test
  dom.appCacheTest="yes: test to come";}
else {dom.appCacheSupport="disabled"; dom.appCacheTest="no"};

// worker support
if (typeof(Worker) !== "undefined") {
  dom.workerSupport="enabled";
  // web worker test
  var wwt;
  try {
    wwt = new Worker("worker.js");
    wwt.onmessage = dom.webWTest="yes";
    wwt.terminate();}
  catch(err) {dom.webWTest="no: catch(err)"};
  // shared worker test
  if ((location.protocol) !== "file:") {
    var swt;
    try {
      swt = new SharedWorker("workershared.js");
      swt.port.start();
      swt.port.postMessage("are you there");
      swt.port.onmessage = dom.sharedWTest="yes";}
    catch(err) {dom.sharedWTest="no: catch(err)"};
  }
  else {dom.sharedWTest="no: file:/// not allowed"};
}
else {dom.workerSupport="disabled"; dom.webWTest="no"; dom.sharedWTest="no"};

// service worker support
if ((location.protocol) === "https:") {
  if ('serviceWorker' in navigator) {
    dom.serviceWSupport="enabled";
    // service worker test
    dom.serviceWTest="yes: test to come"
    // service worker cache support (dom.caches.enabled)
    dom.serviceWCacheSupport="sw supported but dom.caches.enabled not checked"
    // service cache test
    dom.serviceWCacheTest="sw supported but dom.caches.enabled not checked"
  }
  else {dom.serviceWSupport="disabled"; dom.serviceWTest="no";
    dom.serviceWCacheSupport="no"; dom.serviceWCacheTest="no"};
}
else {var swMsg="no: insecure context"; dom.serviceWSupport=swMsg; dom.serviceWTest=swMsg;
  dom.serviceWCacheSupport=swMsg; dom.serviceWCacheTest=swMsg};

// notifications / push
navigator.permissions.query({name:"notifications"}).then(e => dom.pNotifications=e.state);
navigator.permissions.query({name:"push"}).then(e => dom.pPush=e.state);

// storage manager support (dom.storageManager.enabled)
var smSupport= "";
if ("storage" in navigator) {smSupport="enabled"} else {smSupport="disabled"};
dom.storageMSupport = smSupport;
// storage manager properties
if ((location.protocol) !== "file:") {
  if (smSupport == "enabled") {
    try {
      navigator.storage.persist().then(function(persistent) {
        if (persistent) dom.storageMProp = "persistent";
        else dom.storageMProp = "not persistent";
        navigator.storage.estimate().then(estimate => {
          dom.storageMProp.textContent += ` (${estimate.usage} of ${estimate.quota} bytes)`;
        });
      });
    }
    catch (err) {dom.storageMProp = "no: catch(err)"};
  }
  else {dom.storageMProp = "no"};
};
// storage manager test
if ((location.protocol) !== "file:") {
  if (smSupport == "enabled") {
    try {
      // store some data, get usage/quota
      dom.storageMTest = "yes: test to come"
    }
    catch (err) {dom.storageMTest = "no: catch(err)"};
  }
  else {dom.storageMTest = "no"};
};
// permission persistent-storage
navigator.permissions.query({name:"persistent-storage"}).then(e => dom.pPersistentStorage=e.state);

// storage access support (dom.storage_access.enabled)
// FF65+ https://developer.mozilla.org/en-US/docs/Web/API/Storage_Access_API
// this is for embedded cross-origin content
try {Document.hasStorageAccess().then(e => e.state);
      //console.log("enabled");
    }
catch (err) { };
// storage access test: use Document.requestStorageAccess()
