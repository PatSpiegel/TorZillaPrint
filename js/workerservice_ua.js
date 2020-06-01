'use strict';

addEventListener("message", function(e) {
	let list = ['userAgent','appCodeName','appName','product','appVersion','platform'],
		res = [],
		zB1 = "script blocked [method 1]",
		zB2 = "script blocked [method 2]",
		zB3 = "script blocked [method 3]",
		r = ""
	// e.data = isFF
	for(let i=0; i < list.length; i++) {
		try {r = navigator[list[i]]} catch(e) {r = (e.name == "ReferenceError" ? zB1 : zB2)}
		if (r == "") {r = "undefined"}
		if (r == undefined && e.data) {r = zB3}
		res.push((i).toString().padStart(2,"0")+" "+r)
	}
	let channel = new BroadcastChannel("sw-ua");
	channel.postMessage({msg: res});
}, false)
