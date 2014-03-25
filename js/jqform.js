
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
							$scope.avatar = mySettings.wp_base_path + "/wp-content/plugins/space_competition/uploads" + "/" + $scope.filename;
							$scope.$parent.avatar = $scope.avatar;
							$scope.$parent.use_profile_photo = false;
							//$('input[name="img_crop"]').val( $scope.filename );
							$('input[name="img_crop"]').scope().user.img_crop = $scope.filename;
							console.log( "img_crop: " + ( $('input[name="img_crop"]').scope().user.img_crop ) );
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

					imgCrop.init();

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