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
			case 'ascii':
				decodedString = nestedDecoderDecodeAscii(decodedString);
				break
			case 'base64':
				decodedString = nestedDecoderDecodeBase64(decodedString);
				break;
			case 'binary':
				decodedString = nestedDecoderDecodeBinary(decodedString);
				break;
		}
	}
	return decodedString;
}

function nestedDecoderDecodeAscii(encodedString) {
	return String.fromCharCode.apply(null, encodedString.split(' '));
}

function nestedDecoderDecodeBase64(encodedString) {
	return atob(encodedString);
}

function nestedDecoderDecodeBinary(encodedString) {
	encodedString = encodedString.split(' ');
	var decodedString = '';
	for(let i = 0; i < encodedString.length; i++) {
		decodedString += parseInt(encodedString[i], 2).toString() + ' ';
	}
	return decodedString.slice(0, -1);
}