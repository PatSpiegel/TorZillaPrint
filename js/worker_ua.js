'use strict';

addEventListener("message", function(e) {
	let list = ['userAgent','appCodeName','appName','product','appVersion','platform'],
		res = [],
		zBT = "<span class='bad'>[blocked]</span>",
		amFF = false
	// ToDo: only use blocked for amFF: for now extensions can't handle workers
	for (let i=0; i < list.length; i++) {
		let r = navigator[list[i]]
		if (r == "") {r = "undefined"}
		if (r == undefined && amFF) {r = zBT}
		res.push((i).toString().padStart(2,"0")+" "+r)
	}
	self.postMessage(res)
}, false)
