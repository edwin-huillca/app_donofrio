angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
    .state('home', {
      url: '/home',
      templateUrl: 'home.html',
      controller: 'homeCtrl'
    })

    .state('register', {
      url: '/register',
      templateUrl: 'register.html',
      controller: 'registerCtrl'
    })

    .state('select', {
      url: '/select',
      templateUrl: 'select.html',
      controller: 'selectCtrl'
    })
    
    .state('mapsearch', {
      url: '/mapsearch',
      templateUrl: 'mapsearch.html',
      controller: 'mapSearchCtrl'
    })

    .state('selectcart', {
      url: '/selectcart',
      templateUrl: 'selectcart.html',
      controller: 'selectCartCtrl'
    })

    .state('thanks', {
      url: '/thanks',
      templateUrl: 'thanks.html',
      controller: 'ThanksCtrl'
    })
      
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');

});