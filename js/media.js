/* TABLE: Media */

'use strict';

function outputMedia() {
	// media.media-capabilities.enabled
	if ("mediaCapabilities" in navigator) {dom.nMediaCapabilities="enabled"}
		else {if (Symbol.for(`foo`).description == "foo"){dom.nMediaCapabilities="disabled"}
			else {dom.nMediaCapabilities="not supported"};};
};

outputMedia();
