angular.module("emerge_space", ['ui.router', 'jqform', 'ezfb', 'ngAnimate', 'mySettings', 'ui.bootstrap'])

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

					});

			    } else {

					deferred.resolve({
						connected: false,
						status: false,
						data: false
					});

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

.controller('enterYourFaceCtrl', function($scope, $FB, $q, $timeout, $http, $fbLikeStatus){
	
	$scope.nonce = "";

	$scope.fb_like = $fbLikeStatus;

	$scope.use_profile_photo = true;

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
	 	
		$FB.api('/me', function(response){
			fb_profile_data = response;

			$scope.fb_like = {
				connected: true,
				status: true,
				data: fb_profile_data
			};

		});

	};

	// In your onload handler add this call
	$FB.Event.subscribe('edge.create', page_like_callback);

	$scope.login = function(){

		var deferred = $q.defer();

		$FB.login(function(response) {
			if (response.authResponse) {

				var user_id = response.authResponse.userID;
				var page_id = "145862242107";
				var fql_query = "SELECT uid FROM page_fan WHERE page_id =" + page_id + " and uid=" + user_id;
				var the_query = FB.Data.query(fql_query);
				var fb_profile_data = false;

				$FB.api('/me', function(response){

					fb_profile_data = response;

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

				});


			} else {

				console.log('User cancelled login or did not fully authorize.');
			
			}

		}, {scope:'publish_actions,user_likes,email,user_birthday'});

		$scope.fb_like = deferred.promise;

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

	console.log($scope.$parent.fb_like.data);

	$scope.user = {
		birthday: $scope.$parent.fb_like.data.birthday,
		email: $scope.$parent.fb_like.data.email,
		full_name: $scope.$parent.fb_like.data.name,

	};
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
})

.directive('age', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {

			function _calculateAge(birthday) {
				var ageDifMs = Date.now() - birthday.getTime();
				var ageDate = new Date(ageDifMs);
				return Math.abs(ageDate.getUTCFullYear() - 1970);
			}

			ctrl.$parsers.unshift(function(viewValue) {
				viewValue = _calculateAge(viewValue);
				console.log("viewValue: " + viewValue);
				if (viewValue >= parseInt(attrs.min) && viewValue <= parseInt(attrs.max)) {
					ctrl.$setValidity('age', true);
					return viewValue;
				} else {
					ctrl.$setValidity('age', false);
					return viewValue;
				}
			});

		}
	};
});
