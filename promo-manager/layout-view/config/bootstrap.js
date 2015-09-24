import {mainModule} from '../test';

angular.element(document).ready(function() {
	angular.module('crosscapAngular.common', ['ui.bootstrap'])
	.service('$uiModal', function($modal) {
    	return $modal;
  });

  angular.bootstrap(document.querySelector('[data-main-app]'), [
    mainModule.name
  ], {
//    strictDi: true
  });
});





