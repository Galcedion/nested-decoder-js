# nested-decoder-js

This is a JavaScript decoder for encoded strings. It supports nested encoding.

## Usage

To use nested-decoder-js call its master function in your own JavaScript code.
```javascript
nestedDecoder();
```

### Parameters

Parameters for nested-decoder-js
```
encodedString - The encoded string that is to be decoded. Default: false
pattern       - A comma separated string list of encodings to use for decoding. The decoding process will go through the list step by step. Default: false
```

If the pattern parameter is not given, nested-decoder-js will suggest an encoding based on the contents of the parameter encodedString.

If the encodedString parameter is not given, nested-decoder-js will return a JSON containing the required parameters as well as all available encodings.

### Output

The master function will return a JSON containing following keys
```
result     - The decoded string. Will contain the value 'false' when encodedString was not provided.
suggestion - The suggested pattern for the given encodedString. Only set when pattern was not provided.
parameters - A list of parameters that can be provided when using nested-decoder-js. Only set when encodedString was not provided.
encodings  - A dict of available encodings. Only set when encodedString was not provided.
```

## License

[The Unlicense](https://unlicense.org/)