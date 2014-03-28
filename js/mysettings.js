// settings for two different environments
angular.module('mySettings', [])
.constant('mySettings', {
	base_path: window.location.hostname.indexOf('tlnscompetitions') > -1 ? '/emerge_space' : '/',
	wp_base_path: window.location.hostname.indexOf('tlnscompetitions') > -1 ? '/emerge_space/wordpress' : '/wordpress',
	app_id: 804111199618373
});