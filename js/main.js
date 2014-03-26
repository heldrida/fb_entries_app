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

				            	console.log("user connected true, fb like is true");

								deferred.resolve({
									connected: true,
									status: true,
									data: fb_profile_data
								});
				            
				            } else {

				            	console.log("user connected true, fb like is false");

								deferred.resolve({
									connected: true,
									status: false,
									data: false
								});

				            };

				        });

					});

			    } else {

				    console.log("user connected false, fb like is false");

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

		if ( $('.mobile-nav-open').length > 0 ) {

			$('.nav-mobile').removeClass('mobile-nav-open');

		};
		
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

        $('.animatable-elements .cat-foo').animo({animation: "swinging", iterate: "infinite", duration: 0.8 });

        $('.row-enter-your-face .elem-b').animo({animation: "vanish", iterate: "infinite", duration: 4.7 });

        $('.row-enter-your-face .elem-c').animo({animation: "vanish", iterate: "infinite", duration: 5.8 });

        //$('.row-enter-your-face .elem-d').animo({animation: "swinger", iterate: "infinite", duration: 8.8 });

	});

})

.controller('navigationCtrl', function($scope, $location){

	$scope.isActive = function (viewLocation) {
		return viewLocation !== '/home' && viewLocation === $location.path() ? 'active' : null;
	};

})

.controller('enterYourFaceCtrl', function($scope, $FB, $q, $timeout, $http, $fbLikeStatus, mySettings){
	
	$scope.nonce = "";

	$scope.wp_base_path = mySettings.wp_base_path;

	$scope.fb_like = $fbLikeStatus;

	// check if user is in approval process
	user_approval_pending( $fbLikeStatus.data.id );

	$scope.use_profile_photo = true;

	$scope.template_data = { success_page: false };

	/*
	 *	get nonce
	 */
	$http({
		method: 'GET',
		url : 'wordpress/api/get_nonce/?controller=posts&method=create_post'
	}).success(function(data){
		$scope.nonce = data.nonce;
	});

	function user_approval_pending(user_profile_id){

			var data = {
				option: "user_approval_status",
				user_profile_id: user_profile_id
			};

			$.post(
				mySettings.wp_base_path + '/wp-admin/admin-ajax.php?action=space_competition',
				data,
				function( data ){
		
					data = JSON.parse(data);
					
					console.log(data);

					if ( typeof data === "object" ) {
					
						$scope.$apply(function(){

							$scope.template_data.success_page = false;
							$scope.template_data.approval_process = true;
							$scope.template_data.approval_status = data[0].approved === "1" ? true : false;
							
							console.log("approved");
							console.log(data.approved);

							$scope.entry = data[0];

						});

					} else {

						$scope.$apply(function(){

							$scope.template_data.success_page = false;
							$scope.template_data.approval_process = false;

						});

					};

			});

	};

	// callback that logs arguments
	var page_like_callback = function(url, html_element) {
	 	
		$FB.api('/me', function(response){

			// check if user already submited entry
			// show approval status page
			//user_approval_pending( response.id );

			$scope.fb_like = {
				connected: true,
				status: true,
				data: response
			};

		});

	};

	// In your onload handler add this call
	$FB.Event.subscribe('edge.create', page_like_callback);

	var login_callback = function(response){
		response.status === "connected" ? page_like_callback() : function() { $scope.fb_like.connected = false; };
	};

	$FB.Event.subscribe('auth.statusChange', login_callback);

	$scope.login = function(){

		var deferred = $q.defer();

		$FB.login(function(response) {

			if (response.authResponse) {

				// check if user already submited entry
				// show approval status page
				//user_approval_pending( response.authResponse.userID );

				var user_id = response.authResponse.userID;
				var page_id = "145862242107";
				var fql_query = "SELECT uid FROM page_fan WHERE page_id =" + page_id + " and uid=" + user_id;
				var the_query = FB.Data.query(fql_query);
				var fb_profile_data = false;

				$FB.api('/me', function(response){

					fb_profile_data = response;

					the_query.wait(function(rows) {

					    if (rows.length == 1 && rows[0].uid == user_id) {

			            	console.log("user connected true, fb like is true");

							$scope.fb_like = {
								connected: true,
								status: true,
								data: fb_profile_data
							};
					    
					    } else {

			            	console.log("user connected true, fb like is false");

							$scope.fb_like = {
								connected: true,
								status: false,
								data: false
							};

					    };

					});

				});


			} else {

			    console.log("user connected false, fb like is false");

				$scope.fb_like = {
					connected: false,
					status: false,
					data: false
				};

			}

		}, {scope:'publish_actions,user_likes,email,user_birthday'});

	};

	$scope.calculateAge = function(birthday) {
		birthday = new Date(birthday);
		var ageDifMs = Date.now() - birthday.getTime();
		var ageDate = new Date(ageDifMs);
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}

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

})

.controller('uploadPhotoCtrl', function($scope, $http, $FB, mySettings, $q) {

	function getFacebookProfilePhoto(){
		return "http://graph.facebook.com/" + $scope.$parent.fb_like.data.id + "/picture?width=300&height=300";
	};

	$scope.user = {
		fb_profile_uid: $scope.$parent.fb_like.data.id,
		birthday: $scope.$parent.fb_like.data.birthday,
		email: $scope.$parent.fb_like.data.email,
		full_name: $scope.$parent.fb_like.data.name,
		description: "",
		user_profile_picture: getFacebookProfilePhoto(),
		crop: {
			image: "",
			width: "",
			height: "",
			pos_x: "",
			pos_y: ""
		}
	};

	$scope.wp_base_path = mySettings.wp_base_path;
	
	var lock = false;

	$scope.submit = function(){

		console.log("scope.user");
		console.log($scope.user);

		if ( ! $scope.myForm.$valid || lock) {
			console.log("Form not valid!");
			lock = false;
			return;
		};

		lock = true;

		// ng ignores hidden fields, so it's set manually
		$scope.user.option = "new_entry";	
		$scope.user.nonce = $('input[name="nonce"]').val();
		$scope.user.fb_profile_uid = false;

		var deferred = $q.defer();

		$FB.api('/me', function(response){
			$scope.user.fb_profile_uid = response.id;
			deferred.resolve(true);
		});
		
		deferred.promise.then(function(){

			console.log("$scope.user");
			console.log($scope.user);

			$.post(
				mySettings.wp_base_path + '/wp-admin/admin-ajax.php?action=space_competition',
				$scope.user,
				function( data ){
					
					console.log("data:");
					console.log(data);

					lock = false;
					$scope.$apply(function(){

						//$scope.user = {};

						//$('form[name="myForm"]').scope().template_data.success_page = true;
						$scope.$parent.template_data.success_page = true;

					});

				}
			);

		});

	};

	$scope.charactersCounter = function() {

		var max_chars = 150;

		if ( $scope.user.description === undefined ) {
				
			console.log("$scope.user.description");
			console.log($scope.user.description);

			return "0";
	
		} else if ( !$scope.user.description.hasOwnProperty(length) ) {

			return max_chars;

		} else {

			return max_chars - $scope.user.description.length;

		}

	};

	$scope.useProfilePhoto = function(){
		console.log("useProfilePhoto");
		$scope.user.crop = {};
		$scope.use_profile_photo = true;
		$scope.user.user_profile_picture = getFacebookProfilePhoto();
		console.log($scope.user);
	};

})

.controller('termsAndConditionsCtrl', function($scope){

})

.controller('homeCtrl', function($scope, $state){
	
	$scope.navigateTo = function(page){
		$state.go(page);
	};

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

				if ( !data ){
					
					$('.row-entries button.space').animo({
						animation: "vanish-rotate",
						duration: 0.8 
					}, function(){
						$('.row-entries button.space').hide();
					});

				};
				
		        $('.animatable-elements .cat-foo').animo({
		        	animation: "vanish-cat",
		        	duration: 1.2 
		        }, function(){

					$scope.$apply(function(){

						angular.forEach(data, function(value, key){
							
							$scope.entries.push(value);

						});

					});

       				$('.animatable-elements .cat-foo').animo({animation: "swinging", iterate: "infinite", duration: 0.8 });

		        });

			}
		);

	};

})

.service('imgCrop', function () {

	function init(scope) {

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
 
			scope.$parent.user.crop = {
				pos_x: posX,
				pos_y: posY,
				scale: scale,
				width: parseInt( $('#avatar').css('width') ),
				height: parseInt( $('#avatar').css('width') )
			};


			//user_scope.crop.deg = deg;

			/*
		    $('input[name="img_crop_scale"]').val(scale);
		    $('input[name="img_crop_pos_x"]').val(posX);
		    $('input[name="img_crop_pos_y"]').val(posY);
		    $('input[name="img_crop_deg"]').val(rotation);

			$('input[name="img_crop_width"], input[name="img_crop_height"]').val( parseInt( $('#avatar').css('width') ) );
			*/
		};

        //scope.$on('$destroy', rmImage);

	};

	return {
		init: init
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
		link: function(scope, elem, attrs, ctrl) {

			function _calculateAge(birthday) {
				birthday = new Date(birthday);
				var ageDifMs = Date.now() - birthday.getTime();
				var ageDate = new Date(ageDifMs);
				return Math.abs(ageDate.getUTCFullYear() - 1970);
			}


			var min_age = 16;
			var max_age = 150;

			ctrl.$parsers.unshift(function(viewValue) {
				viewValue = _calculateAge(viewValue);
				console.log("calculateAge viewValue: " + viewValue);
				if (viewValue >= min_age && viewValue <= max_age) {
					console.log("age is valid");
					ctrl.$setValidity('age', true);
				} else {
					console.log("age is not valid!");
					ctrl.$setValidity('age', false);
				}
			});

		}
	};
})

.directive('maxcharlength', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {

			var chars_max = 150;
			var chars_min = 0;

			ctrl.$parsers.unshift(function(viewValue) {
				if (viewValue.length > chars_max || viewValue.length < chars_min) {
					ctrl.$setValidity('maxcharlength', false);
					return undefined;
				} else {
					ctrl.$setValidity('maxcharlength', true);
					return viewValue;
				}
			});

		}
	};
})

.directive('mobileNavSwitch', function(){
	return {
		restrict: 'A',
		link: function(scope, elem, attrs, ctrl){

			var $navMobile = $('.nav-mobile');

			elem.on('click', function(e){

				e.preventDefault();

				$navMobile.toggleClass( "mobile-nav-open" );

			});

		}
	};
})

.directive('disableKeyboard', function(){
	return {
		link: function(scope, elem, attrs, ctrl){

			$(elem).focus(function() {
			  this.blur();
			});

		}
	}
});
