export class API {
	constructor($http) {
		this.$http = $http;
	}
	get(url, data, options) {
		return this.$http.get(url, angular.extend({}, { params: data }, options));
	}
	post(url, data, options) {
		return this.$http.post(url, data, options);
	}
}

import LayoutViewAPI from './layout-view-api';
class MyLayoutView {
	constructor() {

	}
	loadLayoutView() {
		LayoutViewAPI.getLayout(this.vehicleVersionId).then(response => {
			this.layoutModel = new LayoutModel(response.data.data.layout);
			this.selectedLayoutVersionId = this.layoutModel.getLayoutVersionIdList()[0];
		});
	}
}

import API from './api';
export class LayoutViewAPI extends API {
	constructor($http) {
		super($http);
	}
	getLayout(vehicleVersionId, options) {
		return super.post('layout.getLayoutVersion.action', vehicleVersionId, options);
	}
}

ErrorReportingInterceptor.$inject = [ '$q' ];
export function ErrorReportingInterceptor($q, errorHandlerFn) {
	if(!angular.isFunction(errorHandlerFn)) return {};

	return {
		responseError: function(response) {
			errorHandlerFn(response);
			return $q.reject(response);
		}
	};
}
angular.module('myModule').config([ '$q', '$httpProvider', ($q, $httpProvider) => {
	$httpProvider.interceptor.push(ErrorReportingInterceptor($q, layoutViewApiErrorHandler);
}]);

function layoutViewApiErrorHandler(response) {
	const errorMessage = API_ERROR_MESSAGES[response.config.url];
	if(errorMessage)  Notifier.warnWith(errorMessage);
}

const API_ERROR_MESSAGES = {
	'layout.getLayoutVersion.action': 'LAYOUT_VIEW_DATA_ERROR_PAGE_LAYOUT',
	'layout.some_other.action':       'LAYOUT_VIEW_DATA_BLABLABLA',
};



JsonWrapperInteceptor.$inject = [ '$q' ];
export function JsonWrapperInteceptor($q) {
	return {
		response: function(response) {
			return isSuccess(response) ? response : $q.reject(response);
		},
		responseError: function(response) {
			return $q.reject(response);
		}
	};

	function isSuccess(response) {
		return response.data.success || !angular.isDefined(response.data.success);
	}
}
