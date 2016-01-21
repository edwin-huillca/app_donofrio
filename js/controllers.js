angular.module('app.controllers', [])

.controller('modalCtrl', function($scope, $ionicPopup) {
	$scope.showterm = function(){
		var terms = $ionicPopup.alert({
			title: 'Términos y condiciones',
			templateUrl: 'modterms.html',
			cssClass: 'modalspopup',
			buttons:[
				{
					text : 'Aceptar',
					type: 'button-positive'
				}
			]
		});
	}
})

.controller('homeCtrl', function($scope, $cordovaDevice, $state, $q, FBService, $ionicLoading, UserService, $http) {
	/*comprovate uuid*/
	var userDevice = UserService.getUser('userdevice');
	if(userDevice.uuid){
		var link = 'http://stag.chocolatesublime.pe/validdevice';
		$ionicLoading.show({
	        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Enviando...'
	    });

		$http.post(link, {
			uuid: userDevice.uuid
	    }).then(function (res){
	    	$ionicLoading.hide();
	    	console.log(res);
	        $scope.response = res.data.response;
	        if(res.data.response == 1){
	        	$state.go('select');
	        } 
	    });
	}
	/*en comprove*/

	var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      	fbLoginError("Cannot find the authResponse");
      	return;
    }

    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
    	.then(function(profileInfo) {
      		// For the purpose of this example I will store user data on local storage
      		FBService.setUser({
        		authResponse: authResponse,
				userID: profileInfo.id,
				name: profileInfo.name,
				email: profileInfo.email,
        		picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
      		});
      		$ionicLoading.hide();
      		$state.go('register');
    	}, function(fail){
      		// Fail get profile info
      		console.log('profile info fail', fail);
    	});
  	};

  	// This is the fail callback from the login method
  	var fbLoginError = function(error){
    	console.log('fbLoginError', error);
    	$ionicLoading.hide();
  	};

  	// This method is to get the user profile info from the facebook api
  	var getFacebookProfileInfo = function (authResponse) {
    	var info = $q.defer();

    	facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      		function (response) {
				console.log(response);
        		info.resolve(response);
      		},
      		function (response) {
				console.log(response);
        		info.reject(response);
      		}
    	);
    	return info.promise;
  	};

	$scope.facebookSignIn = function() {
	    facebookConnectPlugin.getLoginStatus(function(success){
	      	if(success.status === 'connected'){
		        // The user is logged in and has authenticated your app, and response.authResponse supplies
		        // the user's ID, a valid access token, a signed request, and the time the access token
		        // and signed request each expire
		        console.log('getLoginStatus', success.status);

	    		// Check if we have our user saved
	    		var user = FBService.getUser('facebook');

	    		if(!user.userID){
					getFacebookProfileInfo(success.authResponse)
					.then(function(profileInfo) {
						// For the purpose of this example I will store user data on local storage
						FBService.setUser({
							authResponse: success.authResponse,
							userID: profileInfo.id,
							name: profileInfo.name,
							email: profileInfo.email,
							picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
						});

						$state.go('register');
					}, function(fail){
						// Fail get profile info
						console.log('profile info fail', fail);
					});
				}else{
					$state.go('register');
				}
	      	}else{
	        // If (success.status === 'not_authorized') the user is logged in to Facebook,
					// but has not authenticated your app
	        // Else the person is not logged into Facebook,
					// so we're not sure if they are logged into this app or not.

				console.log('getLoginStatus', success.status);

				$ionicLoading.show({
	          		template: 'Logging in...'
	        	});

				// Ask the permissions you need. You can learn more about
				// FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
	        	facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
	      	}
	    });
	};
})

.controller('registerCtrl', function($scope, FBService, UserService, $state, $http, $ionicLoading, $cordovaDevice) {
	var user = FBService.getUser('facebook');
	if(user.userID){
		$('#txtName').val(user.name);
		$('#txtMail').val(user.email);
	}

	$scope.ubigeos = [
        {'id': 'Santiago de surco', 'label': 'Santiago de surco'},
        {'id': 'Miraflores', 'label': 'Miraflores'},
        {'id': 'Barranco', 'label': 'Barranco'},
    ]

    $scope.ubigeo = {
    	'id': 'Santiago de surco'
    }

	$scope.validateRegister = function(userform){
		var link = 'http://stag.chocolatesublime.pe/register';
 		if(userform.name != undefined &&
 			userform.phone != undefined &&
 			userform.ubigeo != undefined &&
 			userform.doc != undefined &&
 			userform.birthdate != undefined &&
 			userform.email != undefined){

 			$ionicLoading.show({
	            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Enviando...'
	        });
			$http.post(link, {
				uuid: $cordovaDevice.getUUID(),
	        	fbid: 'default',//userform.userID,
	           	name: userform.name,
	           	phone: userform.phone,
	           	ubigeo: userform.ubigeo,
	           	doc: userform.doc,
	           	birthdate: userform.birthdate,
	           	email: userform.email,
	           	password: 'default2016'
	        }).then(function (res){
	        	$ionicLoading.hide();
	        	console.log(res);
	            $scope.response = res.data.response;
	            if(res.data.response == 1){
	            	UserService.setUser({
	            		uuid: $cordovaDevice.getUUID(),
						name: userform.name,
						ubigeo: userform.ubigeo,
						phone: userform.phone,
						email: userform.email
					});
	            	$state.go('select');
	            }else{
	            	if(res.data.response == 2) alert('Debe usar una dirección de correo distinta.');
	            	if(res.data.response == 4) alert('El correo es inválido!');
	            } 
	        });

 		}else alert('Todos los campos son obligatorios');
	}
})

.controller('selectCtrl', function($scope) {

})

.controller('mapSearchCtrl', function($scope, $state, $ionicSideMenuDelegate, $cordovaGeolocation, $ionicLoading, UserService) {
	$scope.toggleLeft = function(){
		$ionicSideMenuDelegate.toggleLeft();
	}

	$scope.home = function(){
		$state.go('select');
	}

	$scope.close = function(){
		$state.go('login');
		UserService.setUser({});
	}

	ionic.Platform.ready(function(){        
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Adquiriendo información'
        });

		var posOptions = {
	        enableHighAccuracy: true,
	        timeout: 20000,
	        maximumAge: 0
	    };
	    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
	        var lat  = position.coords.latitude;
	        var long = position.coords.longitude;
	         
	        var myLatlng = new google.maps.LatLng(lat, long);

	        var mapOptions = {
	            center: myLatlng,
	            zoom: 16,
	            mapTypeId: google.maps.MapTypeId.ROADMAP
	        };          
	         
	        var map = new google.maps.Map(document.getElementById("map"), mapOptions); 
	        var infowindow = new google.maps.InfoWindow(), marker = []; 

	        /*socket.io*/
	        var socket = io.connect('http://stag.chocolatesublime.pe:80', { 'forceNew': true });

			socket.on('allClients', function(data) {
				//google.maps.event.clearInstanceListeners(marker);
				for(i2 = 0; i2 < Object.keys(marker).length; i2++){
					marker[i2].setMap(null);
				}
			    for (i = 0; i < Object.keys(data).length; i++) {  
			      	marker[i] = new google.maps.Marker({
			        	position: new google.maps.LatLng(data[i].cart.locate.lat, data[i].cart.locate.long),
			        	map: map,
			        	icon: 'img/geoIcoDon.png'
			      	});

			      	/*google.maps.event.addListener(marker, 'click', (function(marker, i) {
			        		return function() {
			          		infowindow.setContent('Hola');
			          		infowindow.open(map, marker);
			        	}
			      	})(marker, i));*/
			    }
			});
	                
	         
	        $scope.map = map;


	        $ionicLoading.hide();           
	         
	    }, function(err) {
	        $ionicLoading.hide();
	        console.log(err);
	    });
	});
})

.controller('selectCartCtrl', function($scope, $state) {
	$scope.sendPaq = function(paquete){
		if(paquete.address != undefined &&
			paquete.address != undefined &&
			paquete.address != undefined &&
			paquete.address != undefined){
			$state.go('thanks');
		}else alert('Todos los campos son obligatorios');
	}
})

.controller('ThanksCtrl', function($scope) {

})