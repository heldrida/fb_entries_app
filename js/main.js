angular.module("space_competition", ['ui.router', 'jqform', 'ezfb', 'ngAnimate', 'mySettings'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider, $FBProvider){

	var myInitFunction = function ($window, $rootScope, $fbInitParams) {
		$window.FB.init({
			appId: '1422154128027791'
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
						console.log(response);
						fb_profile_data = response;
					});

			        the_query.wait(function(rows) {

			            if (rows.length == 1 && rows[0].uid == user_id) {

							deferred.resolve({
								status: true,
								data: fb_profile_data
							});
			            
			            } else {

							deferred.resolve({
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
												status: true,
												data: fb_profile_data
											});
							            
							            } else {

											deferred.resolve({
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

	var fbProfileId = function($FB){

		$FB.getLoginStatus(function(response) {

		    if (response.status == 'connected') {

		    	return response.authResponse.userID;
		    };

		});

	};

	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'home.html',
			controller: 'homeCtrl',
			resolve: {
				$fbLikeStatus: fbLikeStatus()
			}
		})
		.state('enter_competition', {
			url: '/enter_competition',
			templateUrl: 'enter_competition.html',
			controller: 'enterCompetitionCtrl',
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
		.state('terms_and_conditions', {
			url: '/terms_and_conditions',
			templateUrl: 'terms_and_conditions.html',
			controller: 'termsAndConditionsCtrl'
		});
	
		$urlRouterProvider.otherwise("/home");

		//$locationProvider.hashPrefix('!');

})

.run(function($rootScope, $FB){
	
	$rootScope
		.$on('$stateChangeStart', 
			function(event, toState, toParams, fromState, fromParams){ 
				console.log("State Change: transition begins!");
		});

	$rootScope
		.$on('$stateChangeSuccess',
			function(event, toState, toParams, fromState, fromParams){ 
				console.log("State Change: State change success!");
		});

	$rootScope
		.$on('$stateChangeError',
			function(event, toState, toParams, fromState, fromParams){ 
				console.log("State Change: Error!");
		});

	$rootScope
		.$on('$stateNotFound',
			function(event, toState, toParams, fromState, fromParams){ 
				console.log("State Change: State not found!");
		});

	$rootScope
		.$on('$viewContentLoading',
			function(event, viewConfig){ 
				console.log("View Load:  view begins loading (before DOM is rendered");
		});

	$rootScope
		.$on('$viewContentLoaded',
			function(event, viewConfig){ 
				console.log("View Load: the view is loaded, and DOM rendered!");
		});

})

.controller('homeCtrl', function($scope, $fbLikeStatus){

	$scope.fb_like = $fbLikeStatus;

})

.controller('enterCompetitionCtrl', function($scope, $FB, $fbLikeStatus, $http, $q, myHelper){

	$scope.nonce = "";

	$scope.fb_like = $fbLikeStatus;

	$scope.user = {};
	$scope.template_data = {};

	$scope.$watch(function(){
		
		return $fbLikeStatus;

	}, function(status){
		
		$scope.fb_like = $fbLikeStatus;
		console.log( "scope.fb_like: ");
		console.log( $scope.fb_like );
	});

	/*
	 * Default personal data
	$FB.api('/me', function(response){
		//$('input[name="name"]').val( response.name );
		//$('input[name="email"]').val( response.email );
		var scope = $('form[name="myForm"]').scope();
		scope.user.full_name = response.name;
		scope.user.email = response.email;
	});
	 */


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

	$scope.selected = function(cords) {

		$scope.cropped=true;

	    var rx = 150 / cords.w;

	    var ry = 150 / cords.h;          

	       $('#preview').css({

	        width: Math.round(rx * boundx) + 'px',

	        height: Math.round(ry * boundy) + 'px',

	        marginLeft: '-' + Math.round(rx * cords.x) + 'px',

	        marginTop: '-' + Math.round(ry * cords.y) + 'px'

	    });
	};

	$scope.$on('someEvent', function(event, data) { console.log(data); });

})

.controller('entriesCtrl', function($scope, myEntries, mySettings){

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

.controller('termsAndConditionsCtrl', function($scope){

})

.controller('uploadPhotoCtrl', function($scope, $http, $FB, mySettings, $q) {

	$scope.user = {};
	$scope.wp_base_path = mySettings.wp_base_path;
	var lock = false;

	$scope.submit = function(){

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

		$FB.api('/me', function(response){
			$scope.user.fb_profile_uid = response.id;
			deferred.resolve(true);
		});

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

.directive('integer', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {

			var INTEGER_REGEXP = /^\-?\d+$/;

			ctrl.$parsers.unshift(function(viewValue) {
				if (INTEGER_REGEXP.test(viewValue)) {
					// it is valid
					ctrl.$setValidity('integer', true);
					return viewValue;
				} else {
					// it is invalid, return undefined (no model update)
					ctrl.$setValidity('integer', false);
					return undefined;
				}
			});

		}
	};
})

.directive('age', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {

			ctrl.$parsers.unshift(function(viewValue) {
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
})

.directive('maxcharlength', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {

			ctrl.$parsers.unshift(function(viewValue) {
				if (viewValue.length > attrs.max || viewValue.length < attrs.min) {
					ctrl.$setValidity('description', false);
					return undefined;
				} else {
					ctrl.$setValidity('description', true);
					return viewValue;
				}
			});

		}
	};
})

.service('imgCrop', function () {

	function init() {

		// If no touch device, show touches
		if(!Hammer.HAS_TOUCHEVENTS && !Hammer.HAS_POINTEREVENTS) {
			Hammer.plugins.showTouches();
		}
		// If no touch device, emulate
		if(!Hammer.HAS_TOUCHEVENTS && !Hammer.HAS_POINTEREVENTS) {
			Hammer.plugins.fakeMultitouch();
		}
		//
		var hammertime = Hammer(document.getElementById('avatar'), {
			transform_always_block: true,
			transform_min_scale: 0,
			drag_block_horizontal: true,
			drag_block_vertical: true,
			drag_min_distance: 0
		});

		var posX=0, posY=0,
			lastPosX=0, lastPosY=0,
			bufferX=0, bufferY=0,
		    scale=1, last_scale,
		    rotation= 1, last_rotation, dragReady=0;

		hammertime.on('touch drag dragend transform', function(ev) {
		    elemRect = document.getElementById('myImg');
			manageMultitouch(ev);
		});

		function manageMultitouch(ev){

			var el = ev.target.parentNode;
			
			switch(ev.type) {
		        case 'touch':
		            last_scale = scale;
		            last_rotation = rotation;
		        break;

		        case 'drag':
		            	posX = ev.gesture.deltaX + lastPosX;
		            	posY = ev.gesture.deltaY + lastPosY;
		        break;

		        case 'transform':
		            rotation = last_rotation + ev.gesture.rotation;
		            scale = Math.max(0.25, Math.min(last_scale * ev.gesture.scale, 10));
		        break;

				case 'dragend':
					lastPosX = posX;
					lastPosY = posY;
				break;
		    }
			/*
		    var transform =
		            "translate3d("+posX+"px,"+posY+"px, 0) " +
		            "scale3d("+scale+","+scale+", 1) " +
		            "rotate("+rotation+"deg) ";
			*/

		    var transform =
		            "translate("+posX+"px,"+posY+"px) " +
		            "scale("+scale+","+scale+") ";

		    elemRect.style.transform = transform;
		    elemRect.style.oTransform = transform;
		    elemRect.style.msTransform = transform;
		    elemRect.style.mozTransform = transform;
		    elemRect.style.webkitTransform = transform;

		    $('input[name="img_crop_scale"]').val(scale);
		    $('input[name="img_crop_pos_x"]').val(posX);
		    $('input[name="img_crop_pos_y"]').val(posY);
		    $('input[name="img_crop_deg"]').val(rotation);

		};

        //scope.$on('$destroy', rmImage);

	};

	return {
		init: init
	};

})

.factory('myHelper', function(){

	return {

		calculateAge: function(birthday){

			if ( !isNaN( _.has(birthday, 'getDate') && typeof birthday === "string" ) ){

				birthday = new Date( birthday );

			};

			var ageDifMs = Date.now() - birthday.getTime();
			var ageDate = new Date( ageDifMs );

			return Math.abs( ageDate.getUTCFullYear() - 1970 );

		}

	};

})

.directive('imgPreload', function() {
		return {
			restrict: 'A',
			scope: {
			ngSrc: '@'
		},
		link: function(scope, element) {

			element.on('load', function() {
				// Set visibility: true + remove spinner overlay
				console.log("load");
				$(element).css('display', '');				
			});
			
			scope.$watch('ngSrc', function() {
				// Set visibility: false + inject temporary spinner overlay
				console.log("ngSrc");
				$(element).css('display', 'none');
			});

		}
    };
});
