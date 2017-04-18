var CryptoJS = require('crypto-js');

var crypto = {
	encrypt: function (password, secret) {
		return CryptoJS.AES.encrypt(password, secret).toString();
	},
	decrypt: function (cipherText, secret) {
		var bytes  = CryptoJS.AES.decrypt(cipherText, secret);
		return bytes.toString(CryptoJS.enc.Utf8); 
	}	
};

module.exports = crypto;