angular.module('crosscapAngular.common').provider('localeLoader', function() {
	// Define configuration state
	var localeUrl = {};
	var fallbackStack = null;

	var apiResponseFilter = function(response) {
		var responseBody = angular.fromJson(response);
		return responseBody.data || responseBody;
	};
	var apiSuccessCallback = null;
	var apiErrorCallback = null;

	// Define configuration options
	this.registerLocaleUrl = function(locale, url) {
		localeUrl[locale] = url;
		return this;
	};
	this.unregisterLocaleUrl = function(locale) {
		delete localeUrl[locale];
		return this;
	};
	this.registerLocaleUrlMap = function(localeUrlMap) {
		angular.extend(localeUrl, localeUrlMap);
		return this;
	};

	this.setWorkaroundFallbackStack = function(localePreferenceList) {
		fallbackStack = localePreferenceList;
		return this;
	};
	this.addWorkaroundFallback = function(localePreference) {
		fallbackStack = fallbackStack || [];
		fallbackStack.push(localePreference);
		return this;
	};
	this.setResponseFilter = function(responseFilter) {
		apiResponseFilter = responseFilter;
	};
	this.setSuccessCallback = function(callback) {
		apiSuccessCallback = callback;
	};
	this.setErrorCallback = function(callback) {
		apiErrorCallback = callback;
	};

	// Define the factory
	this.$get = [ '$http', '$q', '$injector', function($http, $q, $injector) {
		return function(options) {
			var deferred = $q.defer();

			// Migrate away from DataService so just $inject it so it becomes an optional dependency
			// and is only included for the modules that still use it
			var DataService = null;
			if($injector.has('DataService')) {
				DataService = $injector.get('DataService');
			}

			var httpOptions = {
				params: angular.extend({}, options.params, { locale: options.key })
			};
			if(angular.isFunction(options.responseFilter)) {
				httpOptions.transformResponse = options.responseFilter;
			} else if(angular.isFunction(apiResponseFilter)) {
				httpOptions.transformResponse = apiResponseFilter;
			}

			// FIXME
			// Workaround implementation for known bug in $translate where a missing
			// translation does not check against an asynchronously loaded fallback language
			var url = null;
			var defaultUrl = "/emm/rfc.getLabels.action";
			if(angular.isArray(fallbackStack)) {
				var fallbackStackPromises = angular.element.map(fallbackStack, function(localeKey) {
					if(DataService) {
						url = localeUrl[localeKey] || DataService.get(localeKey) || defaultUrl;
					} else {
						url = localeUrl[localeKey] || defaultUrl;
					}
					
					var promise = $http.get(url, httpOptions);
					if(angular.isFunction(apiSuccessCallback)) promise.success(apiSuccessCallback);
					if(angular.isFunction(apiErrorCallback)) promise.error(apiErrorCallback);
					return promise;
				});
				$q.all(fallbackStackPromises).then(function(responses) {
					var translationList = angular.element.map(responses, function(response) {
						return response.data;
					});
					var combined = angular.extend.apply(null, translationList.reverse());
					deferred.resolve(combined);
				});
				return deferred.promise;
			}

			// Use registered localization url with deprecated fallback to DataService if undefined
			if(DataService) {
				url = localeUrl[options.key] || DataService.get(options.key) || defaultUrl;
			} else {
				url = localeUrl[options.key] || defaultUrl;
			}
			
			var promise = $http.get(url, httpOptions);
			if(angular.isFunction(apiSuccessCallback)) promise.success(apiSuccessCallback);
			if(angular.isFunction(apiErrorCallback)) promise.error(apiErrorCallback);
			promise.success(deferred.resolve);
			return deferred.promise;
		};
	}];
});