angular.module('app.controllers', [])

.controller('generalCtrl', function($scope, $ionicPopup, $state) {
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

.controller('homeCtrl', function($scope, $cordovaDevice, $state, $q, FBService, $ionicLoading, UserService, $http, $ionicPopup) {
	var fbLoginSuccess = function(response) {// IF LOGIN FB IS SUCCESS
		    if (!response.authResponse){
		      	fbLoginError("Cannot find the authResponse");
		      	return;
		    }

		    var authResponse = response.authResponse;

		    getFacebookProfileInfo(authResponse).then(function(profileInfo) {

	      		FBService.setUser({
	        		authResponse: authResponse,
					userID: profileInfo.id,
					name: profileInfo.name,
					email: profileInfo.email,
	        		picture : "https://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
	      		});
	      		$ionicLoading.hide();
	      		console.log(skipRegister);

	    	}, function(fail){

	      		console.log('profile info fail', fail);
	    	});
		},
		fbLoginError = function(error){//IF LOGIN FB IS ERROR
	    	console.log('fbLoginError', error);
	    	$ionicLoading.hide();
	  	},
	  	getFacebookProfileInfo = function (authResponse) {//GET DATA FB LOGIN
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
	  	},
	  	myPopup = $ionicPopup.show({//ALERT
	        template: '',
	        title: 'Uso de la aplicación Heladero Dnofrio',
	        subTitle: 'Al activar el botón Usted acepta que la aplicación puede usar las cordenadas de ubicación de su dispositivo móvil para poder ser encontrado por los clientes de D\'nofrio.<br><b>ESTA APLICACIÓN SOLO ESTARÁ DISPONIBLE PARA LOS DISTRITOS DE MIRAFLORES Y SAN ISIDRO.</b>',
	        buttons: [
	            { 	text: 'Cancelar', 
	            	type: 'button-negative', 
	            	onTap: function(e) {
						ionic.Platform.exitApp();
	                }
	            }, 
	            {
	               	text: 'Aceptar',
	               	type: 'button-positive',
	               	onTap: function(e) {

	               	}
	            }
	        ]
	    });

	$scope.facebookSignIn = function() {
	    facebookConnectPlugin.getLoginStatus(function(success){
	      	if(success.status === 'connected'){

		        console.log('getLoginStatus', success.status);

	    		var user = FBService.getUser('facebook');
	    		console.log(user);

	    		if(!user.userID){
	    			console.log('storage vacio fb');
					getFacebookProfileInfo(success.authResponse)
					.then(function(profileInfo) {

						FBService.setUser({
							authResponse: success.authResponse,
							userID: profileInfo.id,
							name: profileInfo.name,
							email: profileInfo.email,
							picture : "https://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
						});
						console.log(skipRegister);

						$state.go('menu.select');

					}, function(fail){
						console.log('profile info fail', fail);
					});
				}else{
					$state.go('register');
				}
	      	}else{
				console.log('getLoginStatus', success.status);

				$ionicLoading.show({
	          		template: 'Autenticando...'
	        	});

	        	facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
	      	}
	    });
	};
})

.controller('registerCtrl', function($scope, FBService, UserService, $state, $http, $ionicLoading, $cordovaDevice) {
	var userfb = FBService.getUser('facebook');
	var fbid = 'default';
	if(userfb.userID){
		$scope.user = {'name':userfb.name, 'email': userfb.email};
		fbid = userfb.userID;
	}

	$scope.ubigeos = [
        {'id': 'Miraflores', 'label': 'Miraflores'},
        {'id': 'San Isidro', 'label': 'San Isidro'},
    ]

    $scope.ubigeo = {
    	'id': 'Miraflores'
    }

	$scope.validateRegister = function(userform){
		var link = 'https://www.chocolatesublime.pe/register';
		
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
	        	fbid: fbid,
	           	name: userform.name,
	           	phone: userform.phone,
	           	ubigeo: userform.ubigeo,
	           	doc: userform.doc,
	           	birthdate: userform.birthdate,
	           	email: userform.email,
	           	password: 'default2016'//default pass for all comsumer
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
	            	$state.go('menu.select');
	            }else{
	            	if(res.data.response == 2) alert('Debe usar una dirección de correo distinta.');
	            	if(res.data.response == 4) alert('El correo es inválido!');
	            }
	        });
 		}else alert('Todos los campos son obligatorios');
	}
})

.controller('selectCtrl', function($scope, $state) {
	$scope.mapsearch = function(){
		$state.go('menu.mapsearch');
	}
	$scope.menu = function(){
		$state.go('menu.selectcart');
	}
})

.controller('mapSearchCtrl', function($scope, $state, $cordovaGeolocation, $ionicLoading) {
	ionic.Platform.ready(function(){
		/*$ionicLoading.show({
	        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Adquiriendo ubicación'
	    });*/

		var posOptions = {enableHighAccuracy: true, timeout: 20000, maximumAge: 0};

	    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
	    	
	        var lat  = position.coords.latitude;
	        var long = position.coords.longitude;
	         
	        var myLatlng = new google.maps.LatLng(lat, long);

	        var mapOptions = {
	            center: myLatlng,
	            zoom: 16,
	            mapTypeId: google.maps.MapTypeId.ROADMAP
	        };
	         
	        var map = new google.maps.Map(document.getElementById("map"), mapOptions), markerstoreti = [], markerStore = {};
	        /*list stores*/
	        if(Object.keys(liststores).length > 0){
	        	for(i=0; i< Object.keys(liststores).length; i++){
		            markerstoreti[i] = new google.maps.Marker({
		              position: new google.maps.LatLng(liststores[i].geoloca.split(',')[0], liststores[i].geoloca.split(',')[1]),
		              map: map,
		              icon: 'img/geoIcoDon.png'
		            });
		        }
	        }
		    
	        /*socket.io*/
			socket.on('allClients', function(data) {
				//console.log(data);
				$.each(data, function(){
					if(this.status == 0){
						if(markerStore[this.id]) markerStore[this.id].setMap(null);
					}
					else{
						var nlocate = Geohash.decode(this.locate);
						if(markerStore.hasOwnProperty(this.id)) {
			                markerStore[this.id].setPosition(new google.maps.LatLng(nlocate.lat,nlocate.lon));
			            } else {
			                var marker = new google.maps.Marker({
			                    position: new google.maps.LatLng(nlocate.lat,nlocate.lon),
			                    map:map,
			                    icon: 'img/geoIcoCart.png'
			                });
			                markerStore[this.id] = marker;
			            }
					}
				});
			});

			$scope.map = map;

			$ionicLoading.hide();
	         
	    }, function(err) {
	        $ionicLoading.hide();
	        console.log(err);
	        alert('Debe activar el GPS de su dispositivo móvil');
	    });
	});
})

.controller('menuCtrl', function($scope, $state, $ionicPopup, FBService) {
	var userfb = FBService.getUser('facebook');
	console.log(userfb);
	$scope.namefb = userfb.name;
	$scope.picturefb = userfb.picture;

	$scope.home = function(){
		$state.go('menu.select');
	}
	$scope.select = function(){
		$state.go('menu.select');
	}
	$scope.mapsearch = function(){
		$state.go('menu.mapsearch');
	}
	$scope.selectcart = function(){
		$state.go('menu.selectcart');
	}
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

	$scope.showpol = function(){
		var pol = $ionicPopup.alert({
			title: 'POlítica de privacidad',
			templateUrl: 'modpols.html',
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

.controller('selectCartCtrl', function($scope, $state) {
	$scope.paq1 = function(){
		$state.go('menu.paq1');
	}
	$scope.paq2 = function(){
		$state.go('menu.paq2');
	}
	$scope.paq3 = function(){
		$state.go('menu.paq3');
	}
	$scope.paq4 = function(){
		$state.go('menu.paq4');
	}
})

.controller('paq1Ctrl', function($scope, $state) {
	$scope.delivery = function(paq){
		$state.go('menu.registerpaq', {paq:paq});
	}
})

.controller('paq2Ctrl', function($scope, $state) {
	$scope.delivery = function(paq){
		$state.go('menu.registerpaq', {paq:paq});
	}
})

.controller('paq3Ctrl', function($scope, $state) {
	$scope.delivery = function(paq){
		$state.go('menu.registerpaq', {paq:paq});
	}
})

.controller('paq4Ctrl', function($scope, $state) {
	$scope.delivery = function(paq){
		$state.go('menu.registerpaq', {paq:paq});
	}
})

.controller('registerpaqCtrl', function($scope, $state, FBService, $ionicLoading, $cordovaDevice, $http, $stateParams) {
	var userfb = FBService.getUser('facebook');
	var fbid = 'default';
	if(userfb.userID){
		$scope.user = {'name':userfb.name, 'email': userfb.email};
		fbid = userfb.userID;
	}

	$scope.ubigeos = [
        {'id': 'Miraflores', 'label': 'Miraflores'},
        {'id': 'San Isidro', 'label': 'San Isidro'},
    ]

    $scope.ubigeo = {
    	'id': 'Miraflores'
    }

    $scope.sendPaq = function(userform){
		var link = 'https://www.chocolatesublime.pe/registerpaq';
		
 		if(userform.name != undefined &&
 			userform.phone != undefined &&
 			userform.ubigeo != undefined &&
 			userform.address != undefined &&
 			userform.datedelivery != undefined){

 			$ionicLoading.show({
	            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Enviando...'
	        });

			$http.post(link, {
				uuid: $cordovaDevice.getUUID(),
	        	fbid: fbid,
	           	name: userform.name,
	           	phone: userform.phone,
	           	ubigeo: userform.ubigeo,
	           	address: userform.address,
	           	datedelivery: userform.datedelivery,
	           	pack: $stateParams.paq
	        }).then(function (res){
	        	$ionicLoading.hide();
	        	console.log(res);
	            $scope.response = res.data.response;
	            if(res.data.response == 1){
	            	$state.go('thanks');
	            }else{
	            	if(res.data.response == 0) alert('El usuario no está registrado');
	            } 
	        });
 		}else alert('Todos los campos son obligatorios');
	}
})

.controller('ThanksCtrl', function($scope) {

})