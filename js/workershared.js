/* SHARED WORKER SCRIPT */

'use strict';

var ports = [];
onconnect = function(e) {
  var port = e.ports[0];
  ports.push(port);
  port.start();
  port.onmessage = function(e) {
    port.postMessage("TZP-"+e.data);
  };
};
