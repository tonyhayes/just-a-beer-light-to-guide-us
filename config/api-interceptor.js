export default function apiInteceptor($q, $timeout) {
	var partialPattern = /\.html$/i;
	var actionPattern  = /\.action$/;
	function isTemplateResponse(response) {
		return partialPattern.test(response.config.url);
	}
	function isActionUrl(config) {
		return actionPattern.test(config.url);
	}
	function doResolve(response) {
		if(window.testLatency && !isTemplateResponse(response)) {
			var deferred = $q.defer();
			$timeout(function() { deferred.resolve(response); }, window.testLatency);
			return deferred.promise;
		} else {
			return response;
		}
	}
	function doReject(response) {
		if(window.testLatency && !isTemplateResponse(response)) {
			var deferred = $q.defer();
			$timeout(function() { deferred.reject(response); }, window.testLatency);
			return deferred.promise;
		} else {
			return $q.reject(response);
		}
	}
	function isSuccess(response) {
		return response.data.success || !angular.isDefined(response.data.success);
	}
	function filterRequests(config) {
		if(window.useJsonFolder) {
			config = useJsonStubActions(config);
		}
		if(window.useFragmentFolder) {
			config = usePartialsFolderStructure(config);
		}
		return config;
	}
	function useJsonStubActions(config) {
		if(isActionUrl(config)) {
			var url = config.url;
			config.url = window.useJsonFolder + url.substring(url.lastIndexOf('/')+1);
		}
		return config;
	}
	function usePartialsFolderStructure(config) {
		if(partialPattern.test(config.url)) {
			config.url = config.url.replace(/.*fragments\//, window.useFragmentFolder);
		}
		return config;
	}
	var interceptor = {};
	interceptor.request = filterRequests;
	interceptor.response = function(response) {
		return isSuccess(response) ? doResolve(response) : doReject(response);
	};
	interceptor.responseError = doReject;
	return interceptor;
}
apiInteceptor.$inject = ['$q', '$timeout'];