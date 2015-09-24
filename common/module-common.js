angular.module('crosscapAngular.common', [])
.constant('ProgressStatus', {
	// Configure internal constants to identify asynchronous states
	'INIT': '',
	'LOAD': 'load',
	'SAVE': 'save',
	'DELETE': 'delete',
	'DONE': ''
})
.config(function($translateProvider) {
	// Configure $translate to use our custom loader
	$translateProvider.useLoader('localeLoader', {
		responseFilter: function(response) {
			var responseBody = angular.fromJson(response);
			return responseBody.data || responseBody;
		}
	});

	// Configure MessageFormat interpolation
	$translateProvider.addInterpolation('$translateMessageFormatInterpolation');
});