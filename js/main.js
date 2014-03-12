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
			controller: 'entriesCtrl',
			resolve: {
				myEntries: function($q, mySettings){

					var deferred = $q.defer();

					$.post(
						mySettings.wp_base_path + '/wp-admin/admin-ajax.php?action=space_competition',
						{ option: "approved_entries" },
						function( data ){

							console.log("approved_entries data: " + data);

							data = JSON.parse(data);
							
							deferred.resolve(data);			

						}
					);

					return deferred.promise;

				}
			}
		})
		.state('terms-and-conditions', {
			url: '/terms-and-conditions',
			templateUrl: 'terms-and-conditions.html',
			controller: 'termsAndConditionsCtrl'
		});

		$urlRouterProvider.otherwise("/home");

		//$locationProvider.hashPrefix('!');

})

.run(function($rootScope, $timeout){

	$rootScope.isViewLoading = true;

	$rootScope.$on('$stateChangeStart', function(){

		$rootScope.isViewLoading = true;

	});

	$rootScope.$on('$stateChangeSuccess', function(){

		$timeout(function() {
			
			$rootScope.isViewLoading = false;

		}, 1000);

	});

	$rootScope.$on('$viewContentLoaded', function(){

        $('.lady').animo({animation: ["bounce"], iterate: "infinite", duration: 4 });

        $('.can-cat').animo({animation: "bounce", iterate: "infinite", duration: 4.3, delay: -1 });

        $('.spacecat').animo({animation: "swinging", iterate: "infinite", duration: 2.2 });

        $('.balloons .first').animo({animation: "vanish",
            iterate: "infinite", duration: 6 });

        $('.balloons .second').animo({animation: "vanish",
            iterate: "infinite", duration: 6.9, delay: -1.5 });

        $('.animatable-elements .cat-foo').animo({animation: "vanish_longer",
            iterate: "infinite", duration: 4 });

	});

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

.controller('entriesCtrl', function($scope, myEntries, mySettings){

	console.log("entries ctrl");

	/*
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
	*/

	$scope.entries = myEntries;

	$scope.wp_base_path = mySettings.wp_base_path;

	$scope.page = $scope.page || 1;
	
	console.log("scope.page: " + $scope.page);

	$scope.load_more = function(){

		$scope.page += 1;

		$.post(
			mySettings.wp_base_path + '/wp-admin/admin-ajax.php?action=space_competition',
			{ option: "approved_entries", page: $scope.page },
			function( data ){

				console.log("approved_entries data: " + data);

				data = JSON.parse(data);
				
				$scope.$apply(function(){

					angular.forEach(data, function(value, key){
						
						$scope.entries.push(value);

					});

				});

			}
		);

	};

});
