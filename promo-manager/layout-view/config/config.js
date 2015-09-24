import labels from './labels-en_US.json!json';
//import angular from 'angular';

export default function onConfig($provide, $translateProvider, $httpProvider) {
    $translateProvider.translations('en', labels);
    $translateProvider.preferredLanguage('en');
    $httpProvider.defaults.headers.common["NG_X-Requested-With"] = 'XMLHttpRequest';
// FIXME - See if we can pass in this from context
	if(angular.isObject(window.emmFn) && angular.isFunction(window.emmFn.tokenFromSession)) {
    	$httpProvider.defaults.headers.common["NG_OWASP_CSRFTOKEN"] = emmFn.tokenFromSession();
	}
    $httpProvider.interceptors.push('apiInterceptor');
}
onConfig.$inject = ['$provide', '$translateProvider', '$httpProvider'];

