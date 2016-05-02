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

    .state('menu', {
      url: '/menu',
      templateUrl: 'menu.html',
      controller: 'menuCtrl'
    })

    .state('menu.select', {
      url: '/select',
      templateUrl: 'select.html',
      controller: 'selectCtrl'
    })

    .state('menu.selectcart', {
      url: '/selectcart',
      templateUrl: 'selectcart.html',
      controller: 'selectCartCtrl'
    })

    .state('menu.mapsearch', {
      url: '/mapsearch',
      templateUrl: 'mapsearch.html',
      controller: 'mapSearchCtrl'
    })

    .state('menu.paq1', {
      url: '/paq1',
      templateUrl: 'paq1.html',
      controller: 'paq1Ctrl'
    })

    .state('menu.paq2', {
      url: '/paq2',
      templateUrl: 'paq2.html',
      controller: 'paq2Ctrl'
    })

    .state('menu.paq3', {
      url: '/paq3',
      templateUrl: 'paq3.html',
      controller: 'paq3Ctrl'
    })

    .state('menu.paq4', {
      url: '/paq4',
      templateUrl: 'paq4.html',
      controller: 'paq4Ctrl'
    })

    .state('menu.registerpaq', {
      url: '/registerpaq',
      templateUrl: 'registerpaq.html',
      controller: 'registerpaqCtrl'
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