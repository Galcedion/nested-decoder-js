function nestedDecoder(encodedString = false, pattern = false) {
	if(!encodedString || typeof encodedString === 'undefined') {
		return nestedDecoderOptions();
	} else if(!pattern || typeof pattern === 'undefined') {
		return nestedDecoderDetection(encodedString);
	} else {
		pattern = pattern.toLowerCase();
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
		'ascii': 'ASCII encoding',
		'base<x>': 'different numbering systems where x is the base of the numbering system; x can be one of: 1, 2, 3, 4, 5, 6, 7, 8, 12, 16, 20, 64',
		'base<x>a': 'building onto base (see base<x>) aditionally an ASCII decoding (see ascii) is performed after the base',
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
	var alias = {'binary': 'base2', 'duodec': 'base12', 'hex': 'base16', 'oct': 'base8', 'pental': 'base5', 'quaternary': 'base4', 'senary': 'base6', 'septenary': 'base7', 'trinary': 'base3', 'unary': 'base1', 'vigesimal': 'base20'};
	var decodedString = encodedString;
	for(let i = 0; i < pattern.length; i++) {
		if(Object.keys(alias).indexOf(pattern[i]) != -1)
			pattern[i] = (alias[pattern[i]]);
		if(pattern[i].startsWith('base')) {
			let base = 0;
			if(pattern[i].slice(-1) == 'a') {
				base = pattern[i].substring(4, pattern[i].length - 1);
			} else {
				base = pattern[i].substring(4);
			}
			if(base == 1)
				decodedString = nestedDecoderDecodeUnary(decodedString);
			else if(base == 64)
				decodedString = nestedDecoderDecodeBase64(decodedString);
			else
				decodedString = nestedDecoderDecodeMultiBase(decodedString, base);
			if(pattern[i].slice(-1) == 'a')
				decodedString = nestedDecoderDecodeAscii(decodedString);
			continue;
		}
		switch(pattern[i]) {
			case 'ascii':
				decodedString = nestedDecoderDecodeAscii(decodedString);
				break
			case 'html':
				decodedString = nestedDecoderDecodeHTML(decodedString);
				break;
			case 'unicode':
				decodedString = nestedDecoderDecodeUnicode(decodedString);
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