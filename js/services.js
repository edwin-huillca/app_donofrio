angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('FBService', [function(){
	var setUser = function(user_data) {
		var encrypted = CryptoJS.AES.encrypt(JSON.stringify(user_data), key, {iv: iv});
		var ciphertext = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
		window.localStorage.starter_facebook_user = ciphertext;	    
	};

	var getUser = function(){
		if(window.localStorage.starter_facebook_user){
			var ciphertext = CryptoJS.enc.Base64.parse(window.localStorage.starter_facebook_user);
			var key_str = CryptoJS.enc.Hex.stringify(key);
			var HMAC = CryptoJS.HmacSHA256(window.localStorage.starter_facebook_user + iv, key_str);
			var HMAC_str = CryptoJS.enc.Hex.stringify(HMAC);

			var _cp = CryptoJS.lib.CipherParams.create({
                ciphertext: ciphertext
            });
    
		    var decrypted = CryptoJS.AES.decrypt(_cp,key,{iv: iv});

			return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
		}
	    else
	    	return JSON.parse('{}');
	};

	return {
	    getUser: getUser,
	    setUser: setUser
	};
}])

.service('UserService', [function(){
	var setUser = function(user_data) {
		var encrypted = CryptoJS.AES.encrypt(JSON.stringify(user_data), key, {iv: iv});
		var ciphertext = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
		window.localStorage.starter_donofrio_user = ciphertext;
	};

	var getUser = function(){
		if(window.localStorage.starter_donofrio_user){
			var ciphertext = CryptoJS.enc.Base64.parse(window.localStorage.starter_donofrio_user);
			var key_str = CryptoJS.enc.Hex.stringify(key);
			var HMAC = CryptoJS.HmacSHA256(window.localStorage.starter_donofrio_user + iv, key_str);
			var HMAC_str = CryptoJS.enc.Hex.stringify(HMAC);

			var _cp = CryptoJS.lib.CipherParams.create({
                ciphertext: ciphertext
            });
    
		    var decrypted = CryptoJS.AES.decrypt(_cp,key,{iv: iv});

			return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
		}
	    else
	    	return JSON.parse('{}');
	};

	return {
	    getUser: getUser,
	    setUser: setUser
	};
}]);