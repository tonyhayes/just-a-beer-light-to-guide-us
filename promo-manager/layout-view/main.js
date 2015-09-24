//import angular from 'angular';
//import 'angular-translate';
//import 'angular-ui/ui-bootstrap-tpls';
//import 'bootstrap-css-only/css/bootstrap.css!';
import './styles/layout-styles.css!';
import LayoutViewController from './layout-view-controller';
//import apiInterceptor from '../../config/api-interceptor';
//import API from '../../api/api';
import toggleState from '../../helpers/toggle-state';
import merchandiseHierarchyNativeSelection from '../helpers/merchandise-hierarchy-native-selection-directive';
import merchandiseHierarchyNodePath from '../helpers/merchandise-hierarchy-node-path';


// import CommonConfig from '../../config/config';
import CommonApiDecorator from '../../api/api-configurator';
import PromoManagerApiDecorator from '../api/promo-manager-api-configurator';
import LayoutViewApiDecorator from './api/layout-view-api-configurator';


//import onLayoutViewConfig from './config/config';
//import onTranslateConfig from './config/translate-config';
import layoutView from './layout-view-directive';
import layoutViewInput from './layout-view-input-directive';
import thumbnailCanvasRenderer from './helpers/thumbnail-canvas-renderer';

// dev testing only
 // import onMockConfig from './mock-responses/mock-config';
 // import layoutViewMockResponse from './mock-responses/layout-view-mock-response-inteceptor';

//const angularRef = ((angular && angular.module) ? angular : window.angular);
const angularRef = window.angular;
export let mainModule = angularRef.module('layout-view', [
	// angular modules
	// third party modules
	'pascalprecht.translate',
	'ui.bootstrap',
	// core modules	
	//component modules
	//state modules	
	]);
//dev testing only
// mainModule.factory('layoutViewMockResponse', layoutViewMockResponse)
// mainModule.config(onMockConfig)
//app

mainModule.controller('layoutViewController', LayoutViewController);
mainModule.directive('layoutView', layoutView);
mainModule.directive('layoutViewInput', layoutViewInput);
mainModule.directive('toggleState', toggleState);
mainModule.directive('thumbnailCanvasRenderer', thumbnailCanvasRenderer);
mainModule.directive('merchandiseHierarchyNativeSelection', merchandiseHierarchyNativeSelection);
mainModule.filter('merchandiseHierarchyNodePath', merchandiseHierarchyNodePath);

var legacyModule = angularRef.module('crosscapApp');
// legacyModule.config(CommonConfig)
legacyModule.config(CommonApiDecorator)
legacyModule.config(PromoManagerApiDecorator)
legacyModule.config(LayoutViewApiDecorator)
//legacyModule.config(onLayoutViewConfig)

// TODO: When separated from synchronous codem 
//mainModule.service('API', API);
//mainModule.config(onTranslateConfig)
//mainModule.factory('apiInterceptor', apiInterceptor)


console.log("Module prepared: layout-view");
