angular.module("emerge_space", ['ui.router', 'jqform', 'ezfb', 'ngAnimate', 'mySettings'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider, $FBProvider){

	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'home.html',
			controller: 'homeCtrl'
		})
		.state('enter-your-face', {
			url: '/enter-your-face',
			templateUrl: 'enter-your-face.html',
			controller: 'enterYourFaceCtrl'
		})
		.state('entries', {
			url: '/entries',
			templateUrl: 'entries.html',
			controller: 'entriesCtrl'
		})
		.state('terms-and-conditions', {
			url: '/terms-and-conditions',
			templateUrl: 'terms-and-conditions.html',
			controller: 'termsAndConditionsCtrl'
		});

		$urlRouterProvider.otherwise("/home");

		//$locationProvider.hashPrefix('!');

})

.controller('navigationCtrl', function($scope, $location){

	$scope.isActive = function (viewLocation) {
		return viewLocation !== '/home' && viewLocation === $location.path() ? 'active' : null;
	};

})

.controller('enterYourFaceCtrl', function($scope){

})

.controller('termsAndConditionsCtrl', function($scope){

})

.controller('homeCtrl', function($scope){
	console.log("home ctrl");
})

.controller('entriesCtrl', function($scope){
	console.log("entries ctrl");
	
	$scope.entries = [{
		full_name: "Michael Moore",
		description: "Lorem ipsum dolor cassumi zoko para lara dolarem sukuvi wazi. Mappo to lolikoto pozianova uatianpida.",
		photo: "https://fbcdn-sphotos-d-a.akamaihd.net/hphotos-ak-frc3/t1/31013_3540463685355_1622922072_n.jpg?lvh=1"
	},
	{
		full_name: "Robert Patrick",
		description: "Lorem ipsum dolor cassumi zoko para lara dolarem sukuvi wazi. Mappo to lolikoto pozianova uatianpida.",
		photo: "https://fbcdn-sphotos-d-a.akamaihd.net/hphotos-ak-frc3/t1/31013_3540463685355_1622922072_n.jpg?lvh=1"
	},
	{
		full_name: "Lucie Sapsiatti",
		description: "Lorem ipsum dolor cassumi zoko para lara dolarem sukuvi wazi. Mappo to lolikoto pozianova uatianpida.",
		photo: "https://fbcdn-sphotos-d-a.akamaihd.net/hphotos-ak-frc3/t1/31013_3540463685355_1622922072_n.jpg?lvh=1"
	},
	{
		full_name: "Didier Mizanbongo",
		description: "Lorem ipsum dolor cassumi zoko para lara dolarem sukuvi wazi. Mappo to lolikoto pozianova uatianpida.",
		photo: "https://fbcdn-sphotos-d-a.akamaihd.net/hphotos-ak-frc3/t1/31013_3540463685355_1622922072_n.jpg?lvh=1"
	}];

});
