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
			case 'base2':
				decodedString = nestedDecoderDecodeMultiBase(decodedString, 2);
				break;
			case 'duodec':
			case 'base12':
				decodedString = nestedDecoderDecodeMultiBase(decodedString, 12);
				break;
			case 'hex':
			case 'base16':
				decodedString = nestedDecoderDecodeMultiBase(decodedString, 16);
				break;
			case 'oct':
			case 'base8':
				decodedString = nestedDecoderDecodeMultiBase(decodedString, 8);
				break;
			case 'pental':
			case 'base5':
				decodedString = nestedDecoderDecodeMultiBase(decodedString, 5);
				break;
			case 'quaternary':
			case 'base4':
				decodedString = nestedDecoderDecodeMultiBase(decodedString, 4);
				break;
			case 'senary':
			case 'base6':
				decodedString = nestedDecoderDecodeMultiBase(decodedString, 6);
				break;
			case 'septenary':
			case 'base7':
				decodedString = nestedDecoderDecodeMultiBase(decodedString, 7);
				break;
			case 'trinary':
			case 'base3':
				decodedString = nestedDecoderDecodeMultiBase(decodedString, 3);
				break;
			case 'unary':
			case 'base1':
				decodedString = nestedDecoderDecodeUnary(decodedString);
				break;
			case 'vigesimal':
			case 'base20':
				decodedString = nestedDecoderDecodeMultiBase(decodedString, 20);
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

function nestedDecoderDecodeMultiBase(encodedString, base) {
	encodedString = encodedString.split(' ');
	var decodedString = '';
	for(let i = 0; i < encodedString.length; i++) {
		decodedString += parseInt(encodedString[i], base).toString() + ' ';
	}
	return decodedString.slice(0, -1);
}

function nestedDecoderDecodeUnary(encodedString) {
	encodedString = encodedString.split(' ');
	var decodedString = '';
	for(let i = 0; i < encodedString.length; i++) {
		decodedString += encodedString[i].length + ' ';
	}
	return decodedString.slice(0, -1);
}