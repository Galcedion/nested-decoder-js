function nestedDecoder(encodedString = false, pattern = false) {
	if(!encodedString || typeof encodedString === 'undefined') {
		return nestedDecoderOptions();
	} else if(!pattern || typeof pattern === 'undefined') {
		return nestedDecoderDetection(encodedString);
	} else {
		if(typeof pattern !== 'object') {
			pattern = pattern.split(',');
		}
		return nestedDecoderDecode(encodedString, pattern);
	}
}

function nestedDecoderOptions() {
	// TODO: JSON listing params and supported encodings
	return 'nestedDecoderOptions';
}

function nestedDecoderDetection(encodedString) {
	// TODO: detect the type of encoding for a given string if possible
	return 'nestedDecoderDetection';
}

function nestedDecoderDecode(encodedString, pattern) {
	var decodedString = encodedString;
	for(let i = 0; i < pattern.length; i++) {
		switch(pattern[i]) {
			case 'base64':
				decodedString = nestedDecoderDecodeBase64(decodedString);
				break;
		}
	}
	return decodedString;
}

function nestedDecoderDecodeBase64(encodedString) {
	return atob(encodedString);
}