angular.module("emerge_space", ['ui.router', 'jqform', 'ezfb', 'ngAnimate', 'mySettings'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider, $FBProvider, mySettings){

	var myInitFunction = function ($window, $rootScope, $fbInitParams) {
		$window.FB.init({
			appId: mySettings.app_id
		});

		$rootScope.$broadcast('$onFBInit');
	};

	$FBProvider.setInitFunction(myInitFunction);

	var fbLikeStatus = function() {

		return function ($timeout, $q, $FB) {

			var deferred = $q.defer();

			$FB.getLoginStatus(function(response) {

			    if (response.status == 'connected') {

			        var user_id = response.authResponse.userID;
			        var page_id = "145862242107";
			        var fql_query = "SELECT uid FROM page_fan WHERE page_id =" + page_id + " and uid=" + user_id;
			        var the_query = FB.Data.query(fql_query);
			        var fb_profile_data = false;

					$FB.api('/me', function(response){
						fb_profile_data = response;
					});

			        the_query.wait(function(rows) {

			            if (rows.length == 1 && rows[0].uid == user_id) {

							deferred.resolve({
								connected: true,
								status: true,
								data: fb_profile_data
							});
			            
			            } else {

							deferred.resolve({
								connected: true,
								status: false,
								data: false
							});

			            };

			        });

			    } else {

					$FB.login(function(response) {

						if (response.authResponse) {
							
							// user is logged in and granted some permissions.

							// recursive fn wasn't working, so...
							$FB.getLoginStatus(function(response) {

							    if (response.status == 'connected') {

							        var user_id = response.authResponse.userID;
							        var page_id = "145862242107";
							        var fql_query = "SELECT uid FROM page_fan WHERE page_id =" + page_id + " and uid=" + user_id;
							        var the_query = FB.Data.query(fql_query);

							        the_query.wait(function(rows) {

							            if (rows.length == 1 && rows[0].uid == user_id) {
							            	
											deferred.resolve({
												connected: true,
												status: true,
												data: fb_profile_data
											});
							            
							            } else {

											deferred.resolve({
												connected: true,
												status: false,
												data: false
											});

							            };

							        });

							    }

							});

						} else {
							
							// User cancelled login or did not fully authorize.
							console.log("User not fully authorize!");

						};

					}, {scope:'publish_actions,user_likes,email,user_birthday'});

			    }

			});

			return deferred.promise;
		
		};

	};

	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'home.html',
			controller: 'homeCtrl'
		})
		.state('enter-your-face', {
			url: '/enter-your-face',
			templateUrl: 'enter-your-face.html',
			controller: 'enterYourFaceCtrl',
			resolve: {
				$fbLikeStatus: fbLikeStatus()
			}
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

.controller('enterYourFaceCtrl', function($scope, $FB, $http, $fbLikeStatus){
	
	$scope.nonce = "";

	$scope.fb_like = $fbLikeStatus;

	/*
	 *	get nonce
	 */
	$http({
		method: 'GET',
		url : 'wordpress/api/get_nonce/?controller=posts&method=create_post'
	}).success(function(data){
		$scope.nonce = data.nonce;
	});

	// callback that logs arguments
	var page_like_callback = function(url, html_element) {
	  $scope.fb_like = true;
	}

	// In your onload handler add this call
	$FB.Event.subscribe('edge.create', page_like_callback);

	$scope.login = function(){

		$FB.login(function(response) {
			if (response.authResponse) {
				console.log('Authenticated!');
				// location.reload(); //or do whatever you want
			} else {
				console.log('User cancelled login or did not fully authorize.');
			}
		});

	};

})

.controller('termsAndConditionsCtrl', function($scope){

})

.controller('homeCtrl', function($scope){
	console.log("home ctrl");
})

.controller('entriesCtrl', function($scope, myEntries, mySettings){

	console.log("entries ctrl");

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

})

.controller('uploadPhotoCtrl', function($scope, $http, $FB, mySettings, $q) {

	$scope.user = {};
	$scope.wp_base_path = mySettings.wp_base_path;
	var lock = false;

	$scope.submit = function(){

		console.log( $scope.myForm.$valid );

		if ( ! $scope.myForm.$valid || lock) {
			console.log("Form not valid!");
			lock = false;
			return;
		};

		lock = true;

		// ng ignores hidden fields, so it's set manually
		$scope.user.option = "new_entry";
		$scope.user.img_crop_scale = $('input[name="img_crop_scale"]').val();
		$scope.user.img_crop_pos_x = $('input[name="img_crop_pos_x"]').val();
		$scope.user.img_crop_pos_y = $('input[name="img_crop_pos_y"]').val();		
		$scope.user.nonce = $('input[name="nonce"]').val();
		$scope.user.fb_profile_uid = false;

		var deferred = $q.defer();

		deferred.promise.then(function(){

			$.post(
				mySettings.wp_base_path + '/wp-admin/admin-ajax.php?action=space_competition',
				$scope.user,
				function( data ){
					
					lock = false;
					$scope.$apply(function(){

						$scope.user = {};

						$('form[name="myForm"]').scope().template_data.success_page = true;

					});

				}
			);

		});

	};

})

.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
                elem.on('click', function(e){
                    e.preventDefault();
                    if(attrs.ngClick){
                        scope.$eval(attrs.ngClick);
                    }
                });
            }
        }
   };
});
