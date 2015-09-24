angular.module('crosscapApp').run([ '$rootScope', '$compile',
//angular.module('crosscapAngular.common').run([ '$rootScope', '$compile',
	function($rootScope, $compile) {
		window.angularLateBinding = function(initEle, initCtx) {
			var initScope = $rootScope.$new(true);
			initScope.context = initCtx;
			$compile(initEle)(initScope);
			$rootScope.$digest();

			return {
				update: function(updateCtx) {
					initScope.context = updateCtx;
					initScope.$digest();
				},
				destroy: function() {
					initScope.$destroy();
					$rootScope.$digest();
				}
			};
		};
	}
]);

// Temporarily putting the fix here for repeated manual
// angular bootstrapping bootstrapping here while we
// migrate to the late binding approach
angular.module('crosscapApp').run(function($rootScope) {
	window.teardownAngular = function() {
		if($rootScope.$$destroyed) return;

		console.log("Tearing down rootScope", $rootScope.$id);
		$rootScope.$broadcast('$destroy');
		$rootScope.$$destroyed = true;

		if(angular.isObject($rootScope.$$listeners)) {
			for(eventName in $rootScope.$$listeners) {
				delete $rootScope.$$listeners[eventName];
			}
		}

		$rootScope.$$watchers = null;
	};
});
