/* TABLE: Fonts */

'use strict';

/* unicode glyph globals */
var ugStyles = ["default", "sans-serif", "serif", "monospace", "cursive", "fantasy"];
var ugCodepoints = ['0x20B9','0x2581','0x20BA','0xA73D','0xFFFD','0x20B8','0x05C6','0x1E9E','0x097F','0xF003',
	'0x1CDA','0x17DD','0x23AE','0x0D02','0x0B82','0x115A','0x2425','0x302E','0xA830','0x2B06','0x21E4','0x20BD',
	'0x2C7B','0x20B0','0xFBEE','0xF810','0xFFFF','0x007F','0x10A0','0x1D790','0x0700','0x1950','0x3095','0x532D',
	'0x061C','0x20E3','0xFFF9','0x0218','0x058F','0x08E4','0x09B3','0x1C50','0x2619'];
var ugHeader = "  glyph        default     sans-serif          serif      monospace        cursive        fantasy<br>  -----";

function stringFromCodePoint(n) {
	// String.fromCharCode doesn't support code points outside the BMP (it treats them as mod 0x10000)
	// String.fromCodePoint isn't supported.
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint
	if (n <= 0xffff) {
		return String.fromCharCode(n);
	} else {
		n -= 0x10000;
		return String.fromCharCode(0xd800 + (n >> 10), 0xdc00 + (n % 0x400));
	}
};

function reset_unicode() {
	// resets the display with no measurements
	let str = "";
	for (let i = 0 ; i < ugCodepoints.length; i++) {
		let ugCode = "U+" + ugCodepoints[i].substr(2);
		str = str + '<br>' + ugCode.padStart(7, ' ');
	};
	dom.fontUGFound1.innerHTML = ugHeader + str;
};

function output_unicode(n) {
	/* UNICODE GLYPHS
	code based on work by David Fifield and Serge Egelman (2015)
	https://www.bamsoftware.com/talks/fc15-fontfp/fontfp.html#demo
	*/

	// reset display on first test (we can do a second test to detect randomizing)
	if (n == "1") {
		reset_unicode();
	};

	// initiate variables
	let ugDiv = dom.ugDiv,
		ugSpan = dom.ugSpan,
		ugSlot = dom.ugSlot,
		ugWide = "",
		ugHigh = "",
		ugCode = "",
		ugHashOffset = "", // the string we hash
		ugHashClientRect = "",
		ugOutputOffset = "", // the string we display
		ugOutputClientRect = "";

	// cycle each unicode (i)
	for (let i = 0 ; i < ugCodepoints.length; i++) {
		let n = ugCodepoints[i]; // codepoint
		let c = stringFromCodePoint(n); // character

		// add unicode to outputs: e.g U+20B9
		let ugCode = "U+" + n.substr(2);
		ugHashOffset = ugHashOffset + "-" + ugCode;
		ugHashClientRect = ugHashClientRect + "-" + ugCode;
		ugCode = ugCode.padStart(7, ' ');
		ugOutputOffset = ugOutputOffset + "<br>" + ugCode;
		ugOutputClientRect = ugOutputClientRect + "<br>" + ugCode;

		// cycle each style (j)
		for (let j = 0 ; j < ugStyles.length; j++) {
			let style = ugStyles[j];
			ugSlot.style.fontFamily = style === "default" ? "" : style;
			ugSlot.textContent = c;

			// Read the span width, but the div height. Firefox always reports the same value
			// for the span's offsetHeight, even if the div around it is changing size

			// offset measurement + concatenate hash string
			ugWide = ugSpan.offsetWidth; ugHigh = ugDiv.offsetHeight;
			ugHashOffset = ugHashOffset + "-"+ugWide+"-"+ugHigh+"-";
			// offset output
			ugWide = ugWide.toString(); ugWide = ugWide.padStart(4, ' ');
			ugHigh = ugHigh.toString(); ugHigh = ugHigh.padStart(4, ' ');
			ugOutputOffset = ugOutputOffset + "    " + ugWide + " × " + ugHigh;

			// clientrect measurement + concatenate hash string
			let elementDiv = ugDiv.getBoundingClientRect();
			let elementSpan = ugSpan.getBoundingClientRect();
			ugWide = elementSpan.width;
			ugHigh = elementDiv.height;
			ugHashClientRect = ugHashClientRect + "-"+ugWide+"-"+ugHigh+"-";
			// clientrect output
			// ugOutputClientRect = ugOutputClientRect + " " + ugWide + " × " + ugHigh + " | ";
		}
	}
	// output results
	dom.fontUGFound1.innerHTML = ugHeader + ugOutputOffset;
	dom.fontUG1 = sha1(ugHashOffset);
	dom.fontUG2 = sha1(ugHashClientRect);

};

/* arthur's spawn code */
let spawn = (function () {
	// Declare ahead
	let promiseFromGenerator;
	// Returns true if aValue is a generator object.
	let isGenerator = aValue => {
		return Object.prototype.toString.call(aValue) === "[object Generator]";
	};
	// Converts the right-hand argument of yield or return values to a Promise,
	// according to Task.jsm semantics.
	let asPromise = yieldArgument => {
		if (yieldArgument instanceof Promise) {
			return yieldArgument;
		} else if (isGenerator(yieldArgument)) {
			return promiseFromGenerator(yieldArgument);
		} else if (yieldArgument instanceof Function) {
			return asPromise(yieldArgument());
		} else if (yieldArgument instanceof Error) {
			return Promise.reject(yieldArgument);
		} else if (yieldArgument instanceof Array) {
			return Promise.all(yieldArgument.map(asPromise));
		} else {
			return Promise.resolve(yieldArgument);
		}
	};
	// Takes a generator object and runs it as an asynchronous task,
	// returning a Promise with the result of that task.
	promiseFromGenerator = generator => {
		return new Promise((resolve, reject) => {
			let processPromise;
			let processPromiseResult = (success, result) => {
				try {
					let {value, done} = success ? generator.next(result)
						: generator.throw(result);
					if (done) {
						asPromise(value).then(resolve, reject);
					} else {
						processPromise(asPromise(value));
					}
				} catch (error) {
					reject(error);
				}
			};
			processPromise = promise => {
				promise.then(result => processPromiseResult(true, result),
					error => processPromiseResult(false, error));
			};
			processPromise(asPromise(undefined));
		});
	};
	// __spawn(generatorFunction)__.
	return generatorFunction => promiseFromGenerator(generatorFunction());
})();

function output_enumerate(){
	/* ARTHUR'S TEST: ENUMERATE FONTS
	https://github.com/arthuredelstein/tordemos
	*/

	// xhrerror
	var xhrerror = false;

	// change font color to hide results: try not to shrink/grow elements
	dom.fontFBFound.style.color = "#1a1a1a";

	// initialize test
	let fontFBTest = dom.fontFBTest;
	dom.fontFB = "test is running... please wait";
	fontFBTest.style.fontSize = "256px";

	// return width of the element with a given fontFamily
	let measureWidthForFont = function (fontFamily) {
		fontFBTest.style.fontFamily = fontFamily;
		return fontFBTest.offsetWidth;
	};

	// standard width for the text string with fallback font
	let width0 = null;

	// determines whether a code point is available
	let isFontPresent = function (fontName) {
		// Measure the font width twice: once with serif as fallback and once with sans-serif
		// as fallback. Under the assumption that serif and sans-serif have different widths,
		// only if the font is present will the resulting widths be equal.
		width0 = width0 || measureWidthForFont("fontFallback");
		let width1 = measureWidthForFont("'" + fontName + "', fontFallback");
		return width0 !== width1;
	};

	// Takes a list of possible fonts, and returns fonts present
	let fontfbYes = 0, fontfbAll = 0;
	let enumerateFonts = function (possibleFonts) {
		let fontsPresent = [];
		for (let font of possibleFonts) {
			if (isFontPresent(font)) {
				fontsPresent.push(font);
				fontfbYes++;
			}
			fontfbAll++;
		}
		return [fontsPresent];
	};

	// return a list
	let htmlFontList = function (fonts) {
		let list = "";
		for (let font of fonts) {list += font + ", ";}
		return list;
	};

	// read a text file and returns a promise resolving to the contents.
	let readTextFile = function (filename) {
		return new Promise(function (resolve) {
			let xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					resolve(xhr.responseText);
				}
			};
			xhr.onerror = function() {
				xhrerror = true;
			};
			xhr.overrideMimeType("text/plain; charset=utf-8");
			xhr.open("GET", filename);
			xhr.send();
		});
	};

	// retrieves a set of code points that are representative
	// of the various unicode blocks.xf
	let retrieveCodePoints = function* () {
		let text = yield readTextFile("txt/fontFallbackUnicodeBlocks.txt");
		let codePoints = text
			.split("\n")
			.map(s => s.trim())
			.filter(s => s.length > 0)
			.map(x => parseInt(x))
			.map(x => x + 1);
		codePoints[0] = 77;
		return codePoints;
	};

	// return promise resolving to an array of fonts from a predefined list
	let retrieveFontList = function* () {
		let text = yield readTextFile("txt/fontFallbackList.txt");
		// exclude blank lines by filtering length
		return text.split("\n").filter(s => s.length > 0);
	};

	// run the test
	spawn(function* () {
		let codePoints = yield retrieveCodePoints();
		let testString = codePoints.map(x => String.fromCodePoint(x)).join("</span>\n<span>");
		fontFBTest.innerHTML = testString;
		let fontList = yield retrieveFontList();

		// allow time to make sure list/fallback font are loaded
		setTimeout(function(){
			// don't bother if we couldn't read the file(s)
			if (xhrerror == false) {
				// sort fonts and remove duplicates
				fontList.sort();
				fontList = fontList.filter(function (font, position) {
					return fontList.indexOf(font) === position
				});
				let [fontsPresent] = enumerateFonts(fontList);
				let strFontFB = htmlFontList(fontsPresent);
				// output detected fonts
				if (fontfbYes > 0) {
					// trim trailing comma + space
					strFontFB = strFontFB.slice(0, -2);
					dom.fontFBFound.innerHTML = strFontFB;
				}	else {
					dom.fontFBFound.innerHTML = "no fonts detected"
				};
				// output hash and counters
				dom.fontFB = sha1(strFontFB) + " ["+fontfbYes+"/"+fontfbAll+"]";
				// note if file:// since this affects the result
				if ((location.protocol) == "file:") {
					dom.fontFB.innerHTML = dom.fontFB.textContent + note_file
				}
			} else {
				// couldn't read the file
				if ((location.protocol) == "file:") {
					// file: Cross-Origin Request Blocked
					dom.fontFB.innerHTML = error_file_cors
				} else {
					// xhr blocked
					dom.fontFB.innerHTML = error_file_xhr;
				};
				dom.fontFBFound = "";
			}
			// reset color, update button
			dom.fontFBFound.style.color = "#b3b3b3";
			dom.fontRun = "[ re-run tests ]";
		}, 1500);
	});

};

function outputFonts1(){
	/* auto-run */

	// unicode glyphs
	// run consecutive tests to detect clientrect randomizing
	output_unicode("1");
	setTimeout(function(){
		// grab first test results, run second test
		let result1 = dom.fontUG2.textContent;
		output_unicode("2");
		setTimeout(function(){
			let result2 = dom.fontUG2.textContent;
			if (result1 !== result2) {
				dom.fontUG2.innerHTML = dom.fontUG2.textContent + note_random;
			}
		}, 900);
	}, 900);

	// default proportional font
	dom.fontFCprop = window.getComputedStyle(document.body,null).getPropertyValue("font-family");

	// default font sizes
	let font_item = dom.df1;
	let font_property = "serif/sans-serif: " + getComputedStyle(font_item).getPropertyValue("font-size");
	font_item = dom.df3;
	font_property = font_property + " | monospace: " + getComputedStyle(font_item).getPropertyValue("font-size");
	dom.fontFCsize = font_property;

	// gfx.downloadable_fonts.woff2.enabled
	setTimeout(function() {
		let woff_item = dom.woff_fnt0;
		let woff_property = woff_item.offsetWidth;
		woff_item = dom.woff_fnt1;
		if (woff_property == woff_item.offsetWidth) {
			dom.fontWoff2="disabled [or blocked]"
		} else {
			dom.fontWoff2="enabled"
		};
	}, 500);

	// document fonts
	let element = document.getElementById("SPAN_LINEHEIGHT");
	let fontfamily = getComputedStyle(element).getPropertyValue("font-family");
	if (fontfamily.slice(1,16) !== "Times New Roman") {
		dom.fontDoc="disabled"
	} else {
		dom.fontDoc="enabled"
	};

	// layout.css.font-loading-api.enabled
	dom.fontCSS = 'FontFace' in window ? 'enabled' : 'disabled';

};

outputFonts1();

function outputFonts2(){
	/* not auto-run */
	output_enumerate();
};
