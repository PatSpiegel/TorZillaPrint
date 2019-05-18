/* TABLES: Screen, User Agent, Math */

'use strict';

/* FUNCTIONS */

function getVerNo() {
	//<59
	var verNo="59 or lower";
	//60
	try {(Object.getOwnPropertyDescriptor(Document.prototype, "body")
		|| Object.getOwnPropertyDescriptor(HTMLDocument.prototype, "body")).get.call((new DOMParser).parseFromString(
			"<html xmlns='http://www.w3.org/1999/xhtml'><body/></html>","application/xhtml+xml")) !== null; verNo="60";}
	catch(e) {};
	//61
	var str61=" meh";
	try {str61 = str61.trimStart(); verNo="61"} catch(e) {};
	//62
	console.time("ver62");
	try {console.timeLog("ver62"); verNo="62"} catch(e) {};
	console.timeEnd("ver62");
	//63
	if (Symbol.for(`foo`).description == "foo"){ verNo="63"};
	//64
	if (window.screenLeft == undefined){} else { verNo="64"};
	//65
	try {const rtf = new Intl.RelativeTimeFormat("en", {style: "long",}); verNo="65"} catch(e) {};
	//66
	try {
		const string66 = "this is a test for firefox 66";
		const textEncoder = new TextEncoder();
		const utf8 = new Uint8Array(string66.length);
		let encodedResults = textEncoder.encodeInto(string66, utf8);
		verNo="66"}
	catch(e) {};
	//67
	if (!Symbol.hasOwnProperty('matchAll')) {} else { verNo="67+" };
	//68
	// reminder: append + on last test
	return verNo;
};
function getVW() {
	var e=document.createElement( "div" );
	e.style.cssText="position:fixed;top:0;left:0;bottom:0;right:0;";
	document.documentElement.insertBefore(e,document.documentElement.firstChild);
	var vw=e.offsetWidth;
	var vh=e.offsetHeight;
	document.documentElement.removeChild(e);
	dom.Viewport = vw + " x " + vh;
	return vw;
};
function getZoom() {
	// js dpi
	const devicePixelRatio = window.devicePixelRatio || 1;
	const dpi_x = Math.round(dom.testdpi.offsetWidth * devicePixelRatio);
	const dpi_y = Math.round(dom.testdpi.offsetHeight * devicePixelRatio);
	dom.jsDPI = dpi_x;
	// matchmedia dpi: handles FF default zoom levels 30%-300%
	const varDPI = (function () {
	for (var i = 27; i < 2000; i++) {
			if (matchMedia("(max-resolution: " + i + "dpi)").matches === true) {
					return i;}}return i;})();
	dom.mmDPI = varDPI;
	// zoom: calculate from js dpi vs mediaMatch dpi
		// use devicePixelRatio if RFP is off
	if (window.devicePixelRatio == 1) {
		var jsZoom = Math.round((varDPI/dpi_x)*100).toString();
	} else {
		var jsZoom = Math.round(window.devicePixelRatio*100).toString();
	};
	// fixup some numbers
	if (jsZoom == 79) {jsZoom=80};
	if (jsZoom == 92) {jsZoom=90};
	if (jsZoom == 109) {jsZoom=110};
	if (jsZoom == 111) {jsZoom=110};
	if (jsZoom == 121) {jsZoom=120};
	if (jsZoom == 131) {jsZoom=133};
	if (jsZoom == 167) {jsZoom=170};
	if (jsZoom == 171) {jsZoom=170};
	if (jsZoom == 172) {jsZoom=170};
	if (jsZoom == 241) {jsZoom=240};
	if (jsZoom == 250) {jsZoom=240};
	dom.jsZoom = jsZoom;
	return jsZoom;
};

/* OUTPUT */

function outputScreen() {
	// screen/window
	dom.ScrRes = screen.width+" x "+screen.height+" ("+screen.left+","+screen.top+")";
	dom.ScrAvail = screen.availWidth+" x "+screen.availHeight+" ("+screen.availLeft+","+screen.availTop+")";
	dom.WndOut = window.outerWidth+" x "+window.outerHeight+" ("+window.screenX+","+window.screenY+")";
	dom.WndIn = window.innerWidth+" x "+window.innerHeight+" ("+window.mozInnerScreenX+","+window.mozInnerScreenY+")";
	dom.PixDepth = screen.pixelDepth;
	dom.ColDepth = screen.colorDepth;
	dom.fsState = window.fullScreen;
	dom.DevPR = window.devicePixelRatio;
	// viewport
	getVW();
	// full-screen-api.enabled
	try {
		if (document.mozFullScreenEnabled) {dom.fsSupport="enabled"}
		else {dom.fsSupport="disabled"; dom.fsLeak="no"}
	} catch(e) {dom.fsSupport="no: " + e.name; dom.fsLeak="no"};
	// private window
	try {
		var db = indexedDB.open("IsPBMode");
		db.onerror = function() {dom.IsPBMode="true"};
		db.onsuccess = function() {dom.IsPBMode="false"};
	} catch(e) {dom.IsPBMode="unknown: "+e.name};
	// orientation
	dom.ScrOrient = (function () {
		var orientation = screen.msOrientation || (screen.orientation || screen.mozOrientation || {}).type;
		if (orientation === "landscape-primary") return "landscape";
		if (orientation === "landscape-secondary") return "landscape upside down";
		if (orientation === "portrait-secondary" || orientation === "portrait-primary") return "portrait";
		if (orientation === undefined) return "undefined";
	})();
	dom.mmOrient = (function () {
		if (window.matchMedia("(orientation: portrait)").matches) return "portrait";
		if (window.matchMedia("(orientation: landscape)").matches) return "landscape";
	})();
	dom.mathOrient = (function () {
		// dirty hack: doesn't always work e.g. if a smartphone keyboard reduces the height
		if (window.innerHeight === window.innerWidth) return "no idea, you're square!";
		if (window.innerHeight < window.innerWidth) return "landscape";
		return "portrait";
	})();
	// zoom related items
	getZoom(); 

	/* DEVICEPIXELRATIO LEAKS */
	// code based on work by Alex Catarineu
	// https://acatarineu.github.io/fp/devicePixelRatio.html
	function closest(a, b, x) {
		return Math.abs((a[0] / a[1]) - x) < Math.abs((b[0] / b[1]) - x) ? a : b;
	}
	function closestFrac(x, maxDen) {
		let a = [0, 1];
		let b = [1, 1];
		let A = closest(a, b, x);
		for (;;) {
			let c = [a[0] + b[0], a[1] + b[1]];
			const g = gcd(c[0], c[1]);
			c[0] /= g;
			c[1] /= g;
			if (c[1] > maxDen) {
				return A;
			}
			A = closest(A, c, x);
			if (x >= (a[0] / a[1]) && x <= (c[0] / c[1])) {
				b = c;
			} else {
				a = c;
			}
		}
	}
	function gcd(a, b) {
		if (!b) {
			return a;
		}
		return gcd(b, a % b);
	}
	function lcm(a, b) {
		return (a * b) / gcd(a, b);
	}
	function gcdFraction([a, b], [c, d]) {
		return [gcd(a, c), lcm(b, d)];
	}
	function addFraction([a, b], [c, d]) {
		return [a * d + c * b, b * d];
	}
	function toFraction(x) {
		if (!x) {
			return [0, 1];
		}
		const floor = Math.floor(x);
		const rest = x - floor;
		return addFraction([floor, 1], closestFrac(rest, 70));
	}
	const measurements = {
		scrollY: { maxVal: null, lastSeen: null },
		clientRect: { maxVal: null, lastSeen: null },
	};
	var dprCounter = 0;
	function render() {
		for (let key in measurements) {
			document.getElementById("devPR"+key).innerHTML = `${measurements[key].maxVal}`;
			dprCounter++;
			if (dprCounter == 500) {
				window.removeEventListener('scroll', dprScroll);
			};
		};
	};
	window.addEventListener('scroll', dprScroll)
	function dprScroll() {
		// Currently can be measured via window.scrollY or getBoundingClientRect().
		const values = {
			scrollY: window.scrollY,
			clientRect: 8 + document.body.getBoundingClientRect().height - document.body.getBoundingClientRect().bottom,
		};
		// This finds the gcd of the measurements to calculate devicePixelRatio.
		// I have the feeling there must be a much easier way to do this though.
		for (let key in values) {
			const value = values[key];
			const measurement = measurements[key];
			if (value) {
				let frac = toFraction(value);
				if (measurement.lastSeen) {
					const gcd = gcdFraction(measurement.lastSeen, frac);
					measurement.lastSeen = gcd;
					measurement.maxVal = Math.max(gcd[1] / gcd[0], measurement.maxVal);
					render();
				} else {
					measurement.lastSeen = frac;
				}
			}
		}
	};
};

function outputUA() {
	/* NAVIGATOR */
	dom.nAppName = navigator.appName;
	dom.nAppVersion = navigator.appVersion;
	dom.nBuildID = navigator.buildID;
	dom.nCodeName = navigator.appCodeName;
	dom.nOscpu = navigator.oscpu;
	dom.nPlatform = navigator.platform;
	dom.nProduct = navigator.product;
	dom.nProductSub = navigator.productSub;
	dom.nUserAgent = navigator.userAgent;

	/* USER AGENT */

	// chrome:// and resource:// tests only work on Firefox, no need to check first
	// browser: chrome: Firefox
	// about:logo: desktop 300x236 vs 258x99 android dimensions
	var imgLogoA = new Image();
	imgLogoA.src = "about:logo";
	imgLogoA.style.visibility = "hidden";
	document.body.appendChild(imgLogoA);
	imgLogoA.addEventListener("load", function() {
		var imgLogoAW = imgLogoA.width;
		if (imgLogoAW == 300) {
			// change displayed resource to icon64 (not on android)
			dom.fdResourceCss.style.backgroundImage="url('chrome://branding/content/icon64.png')";
		};
		if (imgLogoAW > 0) {dom.fdResource = "Firefox"};
		document.body.removeChild(imgLogoA);
	});
	// browser: chrome: refine if Tor Browser
	var imgLogoB = new Image();
	imgLogoB.src = "resource://onboarding/img/tor-watermark.png";
	imgLogoB.style.visibility = "hidden";
	document.body.appendChild(imgLogoB);
	imgLogoB.addEventListener("load", function() {
		var imgLogoBW = imgLogoB.width;
		if (imgLogoBW > 0) {dom.fdResource = "Tor Browser"};
		document.body.removeChild(imgLogoB);
	});
	// browser: errors
		var errh = "";
		// InternalError
		try { var err1 = new Array(1);
			function recurse(err1){
				err1[0] = new Array(1);
				recurse(err1[0]);
			}
		recurse(err1);
		} catch(e) {dom.err1=e; errh = errh+e};
		// RangeError
		try { var foodate = new Date(); var bar = new Date(foodate.endDate).toISOString();
		} catch(e) {dom.err2=e; errh = errh+e};
		// ReferenceError
		try {foo=2} catch(e) {dom.err3=e; errh = errh+e};
		// TypeError
		try {
			function foobar() {
				var foo = document.getElementById("bar");
				foo.value = screen.width;
			}
			window.onload = foobar();
		} catch(e) {dom.err4=e; errh = errh+e};
		// TypeError
		try {var bar = new Date(bar[0].endDate).toISOString()} catch(e) {dom.err5=e; errh = errh+e};
		// URIError
		try {decodeURIComponent("%")} catch(e) {dom.err6=e; errh = errh+e};
		// error hash
		errh = sha1(errh); dom.errh = errh;
		if (errh == "7f5472aff63b6ed45eae2af94d1db8b729738d8b") {dom.fdError = "Firefox"};

	// only run these subsequent tests for Firefox
	if (isNaN(window.mozPaintCount) === false){
		// feature detection	
		dom.fdPaintCount="Firefox";
			// if (isNaN(window.mozInnerScreenX) === false) {"FF"};
			// if (isNaN(window.window.scrollMaxX) === false) {"FF"};
			// if (navigator.oscpu == undefined){} else {"FF"};
		// browser: version
		dom.versionNo = getVerNo();
		// os: chrome://
		var b = "chrome://branding/content/";
		var c = "chrome://browser/content/";
		var s = "chrome://browser/skin/";
		var imgUris = [b+'icon64.png', s+'Toolbar-win7.png', s+'sync-horizontalbar-XPVista7.png'];
		var cssUris = [c+'extension-win-panel.css', c+'extension-mac-panel.css'];
		var chromeOS = "Linux"; // default if we can't detect Windows/Android/Mac
			// chrome:// images
			imgUris.forEach(function(imgUri) {
				var img = document.createElement("img");
				img.src = imgUri; img.style.height = "20px"; img.style.width = "20px";
				img.onload = function() {
					if (imgUri === s+"Toolbar-win7.png" || imgUri === s+"sync-horizontalbar-XPVista7.png") {chromeOS ="Windows"};
				};
				img.onerror = function() {if (imgUri === b+"icon64.png") {chromeOS = "Android"};};
			});
			// chrome:// css
			cssUris.forEach(function(cssUri) {
				var css = document.createElement("link");
				css.href = cssUri; css.type = "text/css"; css.rel = "stylesheet";
				document.head.appendChild(css);
				css.onload = function() {
					if (cssUri === c+"extension-win-panel.css") {chromeOS ="Windows"}
					else if (cssUri === c+"extension-mac-panel.css") {chromeOS ="Mac"};
				};
				document.head.removeChild(css);
			});
			// chrome:// results: wait for all the resources to succeed/fail
			setTimeout(function() {dom.fdChromeOS = chromeOS;}, 2000);

		// os: font: use width of the fdCssOS* elements
		// wait for font + slow Android + don't do on rerun css-based
		if (dom.fontOS.textContent == "") {
			setTimeout(function(){
				var elCount = 0; var elCssOS = "Android";
				if (dom.fdCssOSW.offsetWidth > 0) {elCount = elCount+1; elCssOS = "Windows"};
				if (dom.fdCssOSL.offsetWidth > 0) {elCount = elCount+1; elCssOS = "Linux"};
				if (dom.fdCssOSM.offsetWidth > 0) {elCount = elCount+1; elCssOS = "Mac"};
				if (elCount == 2 || elCount == 3) {elCssOS = "unknown"};
				dom.fontOS = elCssOS;
			}, 3000);
		};

		// os: strings
		var strW = "[Windows]"; var strWL = "[Windows or Linux]";
		var strWM = "[Windows or Mac]"; var strWLM = "[Windows, Linux or Mac]";
		var strL = "[Linux]"; var strLM = "[Linux or Mac]";
		var strM = "[Mac]"; var strA = "[Android]";
		// get zoom value for scrollbar + css-lineheight
		var jsZoom = getZoom();
		// os: scrollbar width
		var sbWidth = (window.innerWidth- getVW());
		var sbWidthZoom = sbWidth;
		var sbOS = ""; var sbZoom = "";
		// note: only Mac OS X (el capitan or lower) have zero width?
		if (sbWidth == 0) {sbOS= "[Mac OS X, mobile or floating scrollbars]";}
		else if (sbWidth < 0) {sbOS= "[mobile]";}
		else {
		// start with known metrics at preset FF zoom levels
			if (jsZoom == 300) {
				if (sbWidth==6) {sbOS=strWL};
				if (sbWidth==5) {sbOS=strWM};
				if (sbWidth==4) {sbOS=strL};
			} else if (jsZoom == 240) {
				if (sbWidth==7) {sbOS=strWM};
				if (sbWidth==6) {sbOS=strL};
				if (sbWidth==5) {sbOS=strL};
			} else if (jsZoom == 200) {
				if (sbWidth==9) {sbOS=strW};
				if (sbWidth==8) {sbOS=strWLM};
				if (sbWidth==7) {sbOS=strM};
				if (sbWidth==6) {sbOS=strL};
			} else if (jsZoom == 170) {
				if (sbWidth==10) {sbOS=strWL};
				if (sbWidth==8) {sbOS=strM};
				if (sbWidth==7) {sbOS=strL};
			} else if (jsZoom == 150) {
				if (sbWidth==12) {sbOS=strW};
				if (sbWidth==11) {sbOS=strW};
				if (sbWidth==10) {sbOS=strLM};
				if (sbWidth==8) {sbOS=strL};
			} else if (jsZoom == 133) {
				if (sbWidth==13) {sbOS=strW};
				if (sbWidth==12) {sbOS=strL};
				if (sbWidth==11) {sbOS=strM};
				if (sbWidth==9) {sbOS=strL};
			} else if (jsZoom == 120) {
				if (sbWidth==14) {sbOS=strWL};
				if (sbWidth==12) {sbOS=strM};
				if (sbWidth==10) {sbOS=strL};
			} else if (jsZoom == 110) {
				if (sbWidth==16) {sbOS=strW};
				if (sbWidth==15) {sbOS=strW};
				if (sbWidth==14) {sbOS=strLM};
				if (sbWidth==11) {sbOS=strL};
			} else if (jsZoom == 100) {
				if (sbWidth==17) {sbOS=strW};
				if (sbWidth==16) {sbOS=strL};
				if (sbWidth==15) {sbOS=strM};
				if (sbWidth==12) {sbOS=strL};
			} else if (jsZoom == 90) {
				if (sbWidth==19) {sbOS=strW};
				if (sbWidth==18) {sbOS=strL};
				if (sbWidth==17) {sbOS=strM};
				if (sbWidth==16) {sbOS=strM};
				if (sbWidth==13) {sbOS=strL};
			} else if (jsZoom == 80) {
				if (sbWidth==21) {sbOS=strW};
				if (sbWidth==20) {sbOS=strL};
				if (sbWidth==19) {sbOS=strM};
				if (sbWidth==15) {sbOS=strL};
			} else if (jsZoom == 67) {
				if (sbWidth==26) {sbOS=strW};
				if (sbWidth==25) {sbOS=strW};
				if (sbWidth==24) {sbOS=strL};
				if (sbWidth==23) {sbOS=strM};
				if (sbWidth==22) {sbOS=strM};
				if (sbWidth==18) {sbOS=strL};
			} else if (jsZoom == 50) {
				if (sbWidth==34) {sbOS=strW};
				if (sbWidth==32) {sbOS=strL};
				if (sbWidth==30) {sbOS=strM};
				if (sbWidth==24) {sbOS=strL};
			} else if (jsZoom == 30) {
				if (sbWidth==57) {sbOS=strW};
				if (sbWidth==56) {sbOS=strW};
				if (sbWidth==54) {sbOS=strL};
				if (sbWidth==50) {sbOS=strM};
				if (sbWidth==40) {sbOS=strL};
			};
			if (sbOS == "") {
				// not a preset FF zoom and known metric
				if (jsZoom == 100) {}
				else {
					// recalculate width based on zoom: this is not perfect
					if (window.devicePixelRatio == 1) {
						sbWidthZoom = sbWidth * (((varDPI/dpi_x)*100)/100);
					} else {
						sbWidthZoom = sbWidth * window.devicePixelRatio;
					};
				};
				// os logic: need more Mac / Android data
				// for now at least always return Linux as a minimum
				if (sbWidthZoom>=16.5) {sbOS=strW} else {sbOS=strL};
				// add in notation if this is a best guess
				sbOS = sbOS+" [logical guess]"
			} else {
				// add in notation if this is a known metric
				sbOS = sbOS+" [known metric]"
			};
		};
		// add in zoom info if relevant
		if (jsZoom == 100) {} else { sbZoom = " at "+jsZoom+"% "};
		dom.scrollbarWidth = sbWidth+"px " + sbZoom + sbOS;

		// os: css line-height
		// get line-height
		var myLHElem = document.getElementById("testLH");
		var lh = getComputedStyle(myLHElem).getPropertyValue("line-height")
		lh = lh.slice(0, -2);
		var lhOS = "";
		var strTBL = " [Linux]" + TBy;
		var myLHFont = getComputedStyle(myLHElem).getPropertyValue("font-family");
		if (myLHFont.slice(1,16) !== "Times New Roman") {
			// document fonts blocked: TNR might not be used
			lhOS = " <span class='bad'> [you are blocking document fonts]</span>";
		} else if (lh == "19.2") {
			// TB: 19.2px seems to be unique to TB at any zoom on any platform
			lhOS= TBy;
		} else {
			// using TNR and not TB's 19.2
			// detect WINDOWS / LINUX
			if (jsZoom == 300) {
				if (lh=="19") {lhOS=strW};
				if (lh=="18.6667") {lhOS=strW};
				if (lh=="18") {lhOS=strL};
				if (lh=="17.6667") {lhOS=strL};
			} else if (jsZoom == 240) {
				if (lh=="19.1667") {lhOS=strW};
				if (lh=="19") {lhOS=strTBL};
				if (lh=="18.3333") {lhOS=strWL};
				if (lh=="17.5") {lhOS=strL};
			} else if (jsZoom == 200) {
				if (lh=="19") {lhOS=strW};
				if (lh=="18") {lhOS=strL};
			} else if (jsZoom == 170) {
				if (lh=="19.25") {lhOS=strW};
				if (lh=="18.9") {lhOS=strTBL};
				if (lh=="18.6667") {lhOS=strW};
				if (lh=="18.0833") {lhOS=strL};
				if (lh=="17.5") {lhOS=strL};
			} else if (jsZoom == 150) {
				if (lh=="20") {lhOS=strW};
				if (lh=="18.6667") {lhOS=strWL};
				if (lh=="17.3333") {lhOS=strL};
			} else if (jsZoom == 133) {
				if (lh=="19.5") {lhOS=strW};
				if (lh=="18.9") {lhOS=strTBL};
				if (lh=="18") {lhOS=strL};
				if (lh=="18.75") {lhOS=strW};
			} else if (jsZoom == 120) {
				if (lh=="20") {lhOS=strW};
				if (lh=="19.1667") {lhOS=strL};
				if (lh=="19") {lhOS=strTBL};
				if (lh=="18.3333") {lhOS=strW};
				if (lh=="17.5") {lhOS=strL};
			} else if (jsZoom == 110) {
				if (lh=="19.25") {lhOS=strW};
				if (lh=="18.7") {lhOS=strTBL};
				if (lh=="18.3333") {lhOS=strL};
				if (lh=="17.4167") {lhOS=strL};
			} else if (jsZoom == 100) {
				if (lh=="20") {lhOS=strW};
				if (lh=="19") {lhOS=strL};
				if (lh=="18") {lhOS=strW};
				if (lh=="17") {lhOS=strL};
			} else if (jsZoom == 90) {
				if (lh=="20.1") {lhOS=strW};
				if (lh=="18.9833") {lhOS=strWL};
				if (lh=="18.7667") {lhOS=strTBL};
				if (lh=="16.75") {lhOS=strL};
			} else if (jsZoom == 80) {
				if (lh=="20") {lhOS=strW};
				if (lh=="19.5") {lhOS=strTBL};
				if (lh=="18.75") {lhOS=strWL};
			} else if (jsZoom == 67) {
				if (lh=="21") {lhOS=strW};
				if (lh=="19.8") {lhOS=strTBL};
				if (lh=="19.5") {lhOS=strWL};
				if (lh=="18") {lhOS=strL};
			} else if (jsZoom == 50) {
				if (lh=="22") {lhOS=strW};
				if (lh=="20") {lhOS=strWL};
				if (lh=="18") {lhOS=strL};
			} else if (jsZoom == 30) {
				if (lh=="20") {lhOS=strWL};
				if (lh=="26.6667") {lhOS=strW};
			};
		};
		// detect MAC
		if (lhOS == "") {
		/*	mac unique: .0167 .05 .0833 .1833 .35 .4333 .6833 .8333 .85
		mac not unique: .7667 .6667 (but unique at those zoom values)
		19.5167 : from old hackernews */
			var lhDec = (lh+"").split(".")[1];
			if (lhDec=="0167" | lhDec=="05" | lhDec=="0833" | lhDec=="1833" | lhDec=="35" | lhDec=="4333" | lhDec=="6833"
				| lhDec=="8333" | lhDec=="85" | lhDec=="7667" | lhDec=="6667" | lhDec=="5167") {lhOS=strM};
		};
		// detect ANDROID
		if (lhOS == "") {if (lh == "19.5") {lhOS = strA}};
		// still blank? and add logical guess or known metric
		if (lhOS == "") {
			lhOS = "[Linux] [logical guess]"
		} else {
			if (myLHFont.slice(1,16) == "Times New Roman") {
				lhOS = lhOS + " [known metric]"
			};
		};
		// output: sbZoom was already set in scrollbar width code
		dom.cssLH.innerHTML = lh + "px " + sbZoom + lhOS;

		// widgets
		const iframeWD = document.getElementById("iframeWD");
		iframeWD.src = "iframes/widgets.html";
		iframeWD.addEventListener("load", function(){
			// varibles: 7 alt output, CS compare size, CF compare font, BS, boolean size, BF boolean font
			var wdA = 1; var wdFFN = ""; var wdFSZ = ""; var wdS = ""; var wdH = ""; var wdOS = ""; 
			var wd7 = ""; var wdCS = ""; var wdCF = ""; var wdBS = false; var wdBF = false;
			// loop 9 elements
			while (wdA < 10) {
				var wdItem = iframeWD.contentWindow.document.getElementById("widget"+wdA);
				wdFFN = getComputedStyle(wdItem).getPropertyValue("font-family");
				wdFSZ = getComputedStyle(wdItem).getPropertyValue("font-size");
				wdS = wdFFN + ", " + wdFSZ;
				// OS logic: just use the first item to detect OS
				if (wdA == 1) {
					if (wdFFN.slice(0,12) == "MS Shell Dlg") {wdOS = "Windows"}
					else if (wdFFN == "Roboto") {wdOS="Android"}
					else if (wdFFN == "-apple-system") {wdOS="Mac"}
					else {wdOS="Linux"};
				};
				// compare: values 1 to 7: should always be the same: track state
				if (wdA < 8) {
					// store previous values to compare: not even sure if these can be different
					wdCS = wdFSZ; wdCF = wdFFN;
					// build detailed output
						// test: trigger differences
						// if (wdA == 3) {wdFFN = "-apple-system"; wdFSZ="11px"}; // a: font + size change
						// if (wdA == 3) {wdFFN = "-apple-system";}; // b: font changes
						// if (wdA == 3) {wdFSZ="13px"}; // c: size changes
					if (wdA == 1) {wd7 = "        button: "+wdFFN + ", " + wdFSZ}
					else if (wdA == 2) {wd7 = wd7+"<br>"+"      checkbox: "+wdFFN + ", " + wdFSZ}
					else if (wdA == 3) {wd7 = wd7+"<br>"+"         color: "+wdFFN + ", " + wdFSZ}
					else if (wdA == 4) {wd7 = wd7+"<br>"+"      combobox: "+wdFFN + ", " + wdFSZ}
					else if (wdA == 5) {wd7 = wd7+"<br>"+"datetime-local: "+wdFFN + ", " + wdFSZ}
					else if (wdA == 6) {wd7 = wd7+"<br>"+"         radio: "+wdFFN + ", " + wdFSZ}
					else if (wdA == 7) {wd7 = wd7+"<br>"+"          text: "+wdFFN + ", " + wdFSZ};
					// track if first seven items have any size or font differences
					if (wdA > 1) {if (wdFSZ == wdCS) {} else {wdBS = true}};
					if (wdA > 1) {if (wdFFN == wdCF) {} else {wdBF = true}};
				};
				// output individual results: concatenate string for hash
				document.getElementById("wid"+wdA).innerHTML = wdS;
				if (wdA == 1) {wdH = wdS} else {wdH = wdH + " - "+wdS};
				wdA++;
			};
			// output: detailed or combined
			if ( wdBF + wdBS > 0 ) {
				document.getElementById("widfirst").innerHTML = "various"
				document.getElementById("wid1").innerHTML = wd7;
				document.getElementById("wid1").style.fontFamily = "monospace, monospace";
			} else {
				document.getElementById("widfirst").innerHTML = "button|checkbox|color|combobox|datetime-local|radio|text";
				document.getElementById("wid1").style.fontFamily = "";
			};
			// cleanup os string
			if (wdBF == true) {wdOS = "unknown [font: mixed values]"} else {wdOS = wdOS + " [font: " + wdCF + "]"};
			// output OS and hash
			dom.widgetOS = wdOS;
			dom.widgetH = sha1(wdH);
		});
	};
};

function outputMath() {
	// ECMASCript 1st edtion
	var strR = ""; var strH = "";
	strR = Math.cos(1e251); dom.cos1 = strR; strH = strR;
	strR = Math.cos(1e140); dom.cos2 = strR; strH = strH + "-" + strR;
	strR = Math.cos(1e12); dom.cos3 = strR; strH = strH + "-" + strR;
	strR = Math.cos(1e130); dom.cos4 = strR; strH = strH + "-" + strR;
	strR = Math.cos(1e272); dom.cos5 = strR; strH = strH + "-" + strR;
	strR = Math.cos(1e0); dom.cos6 = strR; strH = strH + "-" + strR;
	strR = Math.cos(1e284); dom.cos7 = strR; strH = strH + "-" + strR;
	strR = Math.cos(1e75); dom.cos8 = strR; strH = strH + "-" + strR;
	var math1hash = sha1(strH);
	var str1math = strH;
	// ECMASCript 6th edtion
	strR = ""; strH = ""; let x; let y;
	x = 0.5; strR = Math.log((1 + x) / (1 - x)) / 2; // atanh(0.5)
	dom.math1 = strR; strH = strR;
	x=1; strR = Math.exp(x) - 1;	 // expm1(1)
	dom.math2 = strR; strH = strH + "-" + strR;
	x = 1; y = Math.exp(x); strR = (y - 1 / y) / 2; // sinh(1)
	dom.math3 = strR; strH = strH + "-" + strR;
	var math6hash = sha1(strH);
	var str6math = strH;
	// build math6
	var fdMath6 = "";
	if (math6hash == "7a73daaff1955eef2c88b1e56f8bfbf854d52486") {fdMath6="Firefox"}
	else if (math6hash == "0eb76fed1c087ebb8f80ce1c571b2f26a8724365") {fdMath6="Firefox [32-bit]"};
	// build math1, refine math6
	var fdMath1 = "";
	if (math1hash == "46f7c2bbe55a2cd28252d059604f8c3bac316c23") {
		fdMath1="Windows [64-bit]"; fdMath6="Firefox [64-bit]";
	}
	else if (math1hash == "97eee44856b0d2339f7add0d22feb01bcc0a430e") {
		fdMath1="Windows"; fdMath6="Firefox [32-bit]";
	}
	else if (math1hash == "96895e004b623552b9543dcdc030640d1b108816") {
		fdMath1="Linux";
		if (math6hash == "7a73daaff1955eef2c88b1e56f8bfbf854d52486") {fdMath1="Linux [64-bit]"}
		else if (math6hash == "0eb76fed1c087ebb8f80ce1c571b2f26a8724365") {fdMath1="Linux [32-bit]"};
	}
	else if (math1hash == "19df0b54c852f35f011187087bd3a0dce12b4071") {
		fdMath1="Linux";
	}
	else if (math1hash == "06a01549b5841e0ac26c875b456a33f95b5c5c11") {
		fdMath1="Mac"; fdMath6="Firefox [64-bit]";
	}
	else if (math1hash == "ae434b101452888b756da5916d81f68adeb2b6ae") {
		fdMath1="Android";
	}
	else if (math1hash == "8464b989070dcff22c136e4d0fe21d466b708ece") {
		fdMath1="Windows";
		if (math6hash == "7a73daaff1955eef2c88b1e56f8bfbf854d52486") {
			fdMath6="Tor Browser [64-bit]"; fdMath1="Windows [64-bit]";
		};
	}
	else if (math6hash == "0eb76fed1c087ebb8f80ce1c571b2f26a8724365") {
		fdMath6="Tor Browser [32-bit]";
	};
	// combo codes (so I can keep track)
	var mc = "";
	var mathhash = sha1(str1math+"-"+str6math);
	if (mathhash == "9ab50329860d78507df28df51fda54642f404733") {mc ="1A"}
	else if (mathhash == "1d6dc24f9e801f27616dcfb6c0b4332655c2994b") {mc ="1B"}
	else if (mathhash == "ef63673d97cbcd37189980bf9d0b966599777d40") {mc ="1C"}
	else if (mathhash == "ce6750e5d0ccc37e7221f12b71d11660f752ddcd") {mc ="2B"}
	else if (mathhash == "046d5d382f775e9357bc9d926d487a21abb5af1a") {mc ="1D"}
	else if (mathhash == "3f5ff67e8c1ce7d0831631792183efdb20c57f4f") {mc ="2D"}
	else if (mathhash == "9ccf49e6225453f5478c207bd162202d7520c7e3") {mc ="1E"}
	else if (mathhash == "e9570e400896bc6821bb7eeae0f179e52cf86c44") {mc ="1F"}
	else if (mathhash == "3fccdbc80f1f4a269c2c253d612d1958f7aed39d") {mc ="1G"};
	// output
	var strNewHash = "";
	if (amFF == true) {strNewHash = "<span class='bad'>I haven't seen this Firefox math combo before</span>"};
	if (mc !== "") {mathhash = mathhash + " ["+mc+"]"};
	dom.math1hash = math1hash;
	dom.math6hash = math6hash;
	dom.mathhash = mathhash;
	if (fdMath1 == "") {dom.fdMathOS.innerHTML=strNewHash} else {dom.fdMathOS = fdMath1};
	if (fdMath6 == "") {dom.fdMath.innerHTML=strNewHash} else {dom.fdMath = fdMath6};
};

outputScreen();
outputMath();
outputUA();

/* USER TESTS */

function getFS() {
	if ( document.mozFullScreen ) {
		let winFSw = document.mozFullScreenElement.clientWidth;
		let winFSh = document.mozFullScreenElement.clientHeight;
		dom.fsLeak = screen.width+" x "+screen.height+" [screen] "+winFSw+" x "+winFSh+" [mozFullScreenElement client]";
		if (getVerNo() > 63) {
			document.exitFullscreen();
		} else {
			document.mozCancelFullScreen();
		};
		document.removeEventListener("mozfullscreenchange", getFS)
	};
};
function goFS() {
	if (amFF == true) {
		if (document.mozFullScreenEnabled) {
			var elFS = document.getElementById("elFS");
			elFS.mozRequestFullScreen();
			document.addEventListener("mozfullscreenchange", getFS)
		}
	};
};
function goNW() {
	var newWin = window.open("","","width=9000,height=9000");
	var newWinLeak = newWin.outerWidth +" x "+ newWin.outerHeight + " [outer] "
		+ newWin.innerWidth +" x "+ newWin.innerHeight + " [inner]";
	if (newWinLeak == "10 x 10 [outer] 10 x 10 [inner]") {newWinLeak = newWinLeak+TBy};
	dom.newWinLeak.innerHTML = newWinLeak;
};
