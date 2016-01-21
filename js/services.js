angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('FBService', [function(){
	var setUser = function(user_data) {
	    window.localStorage.starter_facebook_user = JSON.stringify(user_data);
	};

	var getUser = function(){
	    return JSON.parse(window.localStorage.starter_facebook_user || '{}');
	};

	return {
	    getUser: getUser,
	    setUser: setUser
	};
}])

.service('UserService', [function(){
	var setUser = function(user_data) {
	    window.localStorage.starter_donofrio_user = JSON.stringify(user_data);
	};

	var getUser = function(){
	    return JSON.parse(window.localStorage.starter_donofrio_user || '{}');
	};

	return {
	    getUser: getUser,
	    setUser: setUser
	};
}]);