
var directives = angular.module('jqform', ['mySettings']);
directives.directive('uploader', ['imgCrop', '$timeout', 'mySettings', function(imgCrop, $timeout, mySettings) {

	return {

		restrict: 'E',

		scope: {
			action: '@'
		},

		controller: ['$scope', 'mySettings', function ($scope, mySettings) {

			$scope.progress = 0;
			$scope.avatar = '';
			
			$scope.sendFile = function(el) {

				var $form = $(el).parents('form');

				if ($(el).val() == '') {
					return false;
				}

				$form.attr('action', $scope.action);

				$scope.$apply(function() {
					$scope.progress = 0;
				});				

				$scope.filename = "";

				$form.ajaxSubmit({
					
					type: 'POST',
					data: { option: 'img_upload' },
					uploadProgress: function(event, position, total, percentComplete) { 

						$scope.$apply(function() {
							// upload the progress bar during the upload
							$scope.progress = percentComplete;
						});

					},
					error: function(event, statusText, responseText, form) { 

						console.log("error");

						// remove the action attribute from the form
						$form.removeAttr('action');

						/*
							handle the error ...
						*/

					},
					success: function(responseText, statusText, xhr, form) { 
						
						$scope.filename = JSON.parse( responseText );

						// remove the action attribute from the form
						$form.removeAttr('action');

						$scope.$apply(function() {

							$scope.progress = 100;

							$scope.avatar = mySettings.wp_base_path + "/wp-content/plugins/space_competition/uploads" + "/" + $scope.filename;
							$scope.$parent.avatar = $scope.avatar;
							$scope.$parent.use_profile_photo = false;
							//$('input[name="img_crop"]').val( $scope.filename );
							//$('input[name="img_crop"]').scope().user.img_crop = $scope.filename;
							//console.log( "img_crop: " + ( $('input[name="img_crop"]').scope().user.img_crop ) );

							function setCropDefaultValues(){

								$scope.$parent.user.crop.width = $scope.$parent.user.crop.height = parseInt( $('#avatar').css('width') );
								$scope.$parent.user.crop.scale = 1;
								$scope.$parent.user.crop.pos_x = 0;		    
								$scope.$parent.user.crop.pos_y = 0;
								$scope.$parent.user.crop.image = $scope.filename;

								/* default form values for cropping
								$('input[name="img_crop_scale"]').val(1);
								$('input[name="img_crop_pos_x"]').val(0);
								$('input[name="img_crop_pos_y"]').val(0);
								$('input[name="img_crop_deg"]').val(0);
								$('input[name="img_crop_width"], input[name="img_crop_height"]').val( parseInt( $('#avatar').css('width') ) );
								*/

							};

							setCropDefaultValues();

							window.addEventListener('resize', function(event){

								// the crop values etc should change when window resizes
								console.log("on window resize, crop values should change");

							});

						});

					}
			
				});

			}

			$scope.$watch(function(){

				return $scope.avatar;

			}, function(newValue, oldValue) {

				if (newValue === oldValue) { 

					return;

				};

				$timeout(function(){

					imgCrop.init($scope);

				}, 0);

			});

		}],

		link: function(scope, elem, attrs, ctrl) {

			elem.find('.fake-uploader').click(function() {
				elem.find('input[type="file"]').click();
			});

			/*
			$('.fake-uploader').on('click', function(){
				$('.uploader input[type="file"]').trigger('click');
			});
			*/

		},

		replace: false,    
		
		templateUrl: 'uploader.html'

	};

}]);