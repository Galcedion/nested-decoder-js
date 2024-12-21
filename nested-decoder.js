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
	var options = {};
	options['parameters'] = ['encodedString', 'pattern'];
	options['encodings'] = {
		'ascii': 'ASCII',
		'base<x>': 'different numbering systems where x is the base of the numbering system; x can be one of: 1, 2, 3, 4, 5, 6, 7, 8, 12, 16, 20, 64',
		'binary': 'see base2',
		'duodec': 'see base12',
		'hex': 'see base16',
		'html': 'HTML based encoding',
		'oct': 'see base8',
		'pental': 'see base5',
		'quaternary': 'see base4',
		'senary': 'see base6',
		'septenary': 'see base7',
		'trinary': 'see base3',
		'unary': 'see base1',
		'unicode': 'Unicode based encoding',
		'vigesimal': 'see base20',
	};
	return options;
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
			case 'html':
				decodedString = nestedDecoderDecodeHTML(decodedString);
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
			case 'unicode':
				decodedString = nestedDecoderDecodeUnicode(decodedString);
				break;
			case 'vigesimal':
			case 'base20':
				decodedString = nestedDecoderDecodeMultiBase(decodedString, 20);
				break;
		}
	}
	return {'result': decodedString};
}

function nestedDecoderDecodeAscii(encodedString) {
	return String.fromCharCode.apply(null, encodedString.split(' '));
}

function nestedDecoderDecodeBase64(encodedString) {
	return atob(encodedString);
}

function nestedDecoderDecodeHTML(encodedString) {
	encodedString = encodedString.trim();
	var decodedString = '';
	var marker = encodedString.indexOf('&#');
	while(marker > -1) {
		decodedString += nestedDecoderDecodeAscii(nestedDecoderDecodeMultiBase(encodedString.substring(marker + 3, encodedString.indexOf(';', marker + 3)), 16));
		marker = encodedString.indexOf('&#', marker + 3);
	}
	return decodedString;
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

function nestedDecoderDecodeUnicode(encodedString) {
	encodedString = encodedString.trim();
	var decodedString = '';
	var marker = encodedString.indexOf('\\u');
	while(marker > -1) {
		decodedString += nestedDecoderDecodeAscii(nestedDecoderDecodeMultiBase(encodedString.substring(marker + 2, marker + 6), 16));
		marker = encodedString.indexOf('\\u', marker + 6);
	}
	return decodedString;
}