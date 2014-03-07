angular.module("emerge_space", ['ui.router', 'jqform', 'ezfb', 'ngAnimate', 'mySettings'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider, $FBProvider){

	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'home.html',
			controller: 'homeCtrl'
		})
		.state('entries', {
			url: '/entries',
			templateUrl: 'entries.html',
			controller: 'entriesCtrl'
		});

		$urlRouterProvider.otherwise("/home");

		//$locationProvider.hashPrefix('!');

})

.controller('homeCtrl', function($scope){
	console.log("home ctrl");
})

.controller('entriesCtrl', function($scope){
	console.log("entries ctrl");
});
