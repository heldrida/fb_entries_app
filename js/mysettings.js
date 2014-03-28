angular.module('mySettings', [])
.constant('mySettings', {
	base_path: window.location.hostname.indexOf('tlnscompetitions') > -1 ? '/emerge_space' : '/',
	wp_base_path: window.location.hostname.indexOf('tlnscompetitions') > -1 ? '/emerge_space/wordpress' : '/wordpress',
	app_id: window.location.hostname.indexOf('tlnscompetitions') > -1 ? 804111199618373 : 1422154128027791
});