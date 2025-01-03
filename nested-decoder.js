/**
 * Entry function for nestedDecoder to decode a given string by a given pattern.
 *
 * @param encodedString The encoded string to decode.
 * @param pattern       The pattern by which the string is to be decoded.
 *
 * @return JSON with results, errors and options (depending on the given parameters).
 */
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

	/**
	 * Provides all parameters and available decodings of nestedDecoder.
	 *
	 * @return JSON with all parameters and available encodings.
	 */
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
			'rot<x>': 'rotate the characters by x (can be negative); only rotates the base latin letters in the ASCII table',
			'rot<x>a': 'building onto rot (see rot<x>) the string is rotated regardless of the position on the ASCII / Unicode table',
			'senary': 'see base6',
			'septenary': 'see base7',
			'trinary': 'see base3',
			'unary': 'see base1',
			'unicode': 'Unicode based encoding',
			'vigesimal': 'see base20',
		};
		return options;
	}

	/**
	 * Detector function to provide a possible encoding of a given string.
	 *
	 * @param encodedString The encoded string to check.
	 *
	 * @return JSON with a suggested encoding.
	 */
	function nestedDecoderDetection(encodedString) {
		encodedString = encodedString.trim();
		var suggestion = null;
		if(encodedString.match(/^(&#x[a-f0-9]+;)+$/) !== null)
			suggestion = 'html';
		else if(encodedString.match(/^(\\\u[a-f0-9]{4})+$/) !== null)
			suggestion = 'unicode';
		else if(encodedString.match(/^([A-Za-z0-9=]+)$/) !== null)
			suggestion = 'base64';
		else if(encodedString.match(/^([0-9 ]+)$/) !== null)
			suggestion = 'ascii';
		else if(encodedString.match(/^([0-9a-f ]+)$/) !== null)
			suggestion = 'hex';
		else if(encodedString.match(/^([0-1 ]+)$/) !== null)
			suggestion = 'binary';
		else if(encodedString.match(/^([1 ]+)$/) !== null)
			suggestion = 'unary';
		return {'suggestion': suggestion};
	}

	/**
	 * Main decode function to run through the pattern and call different decoders.
	 *
	 * @param encodedString The encoded string to decode.
	 * @param pattern       The pattern by which the string is to be decoded.
	 *
	 * @return JSON with results and errors.
	 */
	function nestedDecoderDecode(encodedString, pattern) {
		var alias = {'binary': 'base2', 'duodec': 'base12', 'hex': 'base16', 'oct': 'base8', 'pental': 'base5', 'quaternary': 'base4', 'senary': 'base6', 'septenary': 'base7', 'trinary': 'base3', 'unary': 'base1', 'vigesimal': 'base20'};
		var decodedString = encodedString;
		for(let i = 0; i < pattern.length; i++) {
			/* resolving alias if necessary */
			if(Object.keys(alias).indexOf(pattern[i]) != -1)
				pattern[i] = (alias[pattern[i]]);
			/* process all base<x> decodings */
			if(pattern[i].startsWith('base')) {
				let base = 0;
				if(pattern[i].slice(-1) == 'a')
					base = pattern[i].substring(4, pattern[i].length - 1);
				else
					base = pattern[i].substring(4);
				if(base == 1)
					decodedString = nestedDecoderDecodeUnary(decodedString);
				else if(base == 64)
					decodedString = nestedDecoderDecodeBase64(decodedString);
				else
					decodedString = nestedDecoderDecodeMultiBase(decodedString, base);
				if(pattern[i].slice(-1) == 'a')
					decodedString = nestedDecoderDecodeAscii(decodedString);
				continue;
			} /* process all ROT decodings */
			else if(pattern[i].startsWith('rot')) {
				let move = 0;
				let fullCharset = false;
				if(pattern[i].slice(-1) == 'a') {
					move = pattern[i].substring(3, pattern[i].length - 1);
					fullCharset = true;
				} else {
					move = pattern[i].substring(3);
				}
				move = parseInt(move) * -1;
				decodedString = nestedDecoderDecodeRot(decodedString, move, fullCharset);
				continue;
			}
			/* process all other available decodings */
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

	/**
	 * ASCII decoder.
	 *
	 * @param encodedString The ASCII-encoded string to decode.
	 *
	 * @return The decoded string.
	 */
	function nestedDecoderDecodeAscii(encodedString) {
		return String.fromCharCode.apply(null, encodedString.split(' '));
	}

	/**
	 * Base64 decoder.
	 *
	 * @param encodedString The Base64-encoded string to decode.
	 *
	 * @return The decoded string.
	 */
	function nestedDecoderDecodeBase64(encodedString) {
		return atob(encodedString);
	}

	/**
	 * HTML decoder.
	 *
	 * @param encodedString The HTML-encoded string to decode.
	 *
	 * @return The decoded string.
	 */
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

	/**
	 * Base<x> decoder for any Base except Base1 and Base64.
	 *
	 * @param encodedString The Base<x>-encoded string to decode.
	 *
	 * @return The decoded string.
	 */
	function nestedDecoderDecodeMultiBase(encodedString, base) {
		encodedString = encodedString.split(' ');
		var decodedString = '';
		for(let i = 0; i < encodedString.length; i++) {
			decodedString += parseInt(encodedString[i], base).toString() + ' ';
		}
		return decodedString.slice(0, -1);
	}

	/**
	 * ROT cipher unshifter.
	 *
	 * @param encodedString The shifted string to unshift.
	 * @param move          The rotation for the characters as int.
	 * @param fullCharset   Whether to rotate only latin characters or any characters.
	 *
	 * @return The unshifted string.
	 */
	function nestedDecoderDecodeRot(encodedString, move, fullCharset) {
		if(!fullCharset)
			move = move % 26;
		if(move == 0)
			return encodedString;
		move = parseInt(move);
		var decodedString = '';
		for(let i = 0; i < encodedString.length; i++) {
			let charCode = parseInt(encodedString.charCodeAt(i));
			if(!fullCharset) {
				if(charCode < 65 || charCode > 122 || (charCode > 90 && charCode < 97))
					null;
				else if(charCode < 91 && charCode + move >= 91)
					charCode += move - 26;
				else if(charCode > 96 && charCode + move <= 96)
					charCode += move + 26;
				else if(charCode + move < 65)
					charCode += move + 26;
				else if(charCode + move > 122)
					charCode += move - 26;
				else
					charCode += move;
			} else {
				charCode += move;
			}
			decodedString += String.fromCharCode.apply(null, [charCode]);
		}
		return decodedString;
	}

	/**
	 * Base1 decoder.
	 *
	 * @param encodedString The Base1-encoded string to decode.
	 *
	 * @return The decoded string.
	 */
	function nestedDecoderDecodeUnary(encodedString) {
		encodedString = encodedString.split(' ');
		var decodedString = '';
		for(let i = 0; i < encodedString.length; i++) {
			decodedString += encodedString[i].length + ' ';
		}
		return decodedString.slice(0, -1);
	}

	/**
	 * Unicode decoder.
	 *
	 * @param encodedString The Unicode-encoded string to decode.
	 *
	 * @return The decoded string.
	 */
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
}