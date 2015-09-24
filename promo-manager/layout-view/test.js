import angular from 'angular';
import 'angular-translate';
import 'angular-ui/ui-bootstrap-tpls';
import 'bootstrap-css-only/css/bootstrap.css!';
import './styles/layout-styles.css!';
import LayoutViewController from './layout-view-controller';
import apiInterceptor from '../../config/api-interceptor';
import API from '../../api/api';
import toggleState from '../../helpers/toggle-state';
import merchandiseHierarchyNativeSelection from '../helpers/merchandise-hierarchy-native-selection-directive';
import merchandiseHierarchyNodePath from '../helpers/merchandise-hierarchy-node-path';
import onConfig from '../../config/config';
import onAPIConfig from '../../api/api-configurator';
import onPromoManagerAPIConfig from '../api/promo-manager-api-configurator';
import onLayoutViewAPIConfig from './api/layout-view-api-configurator';
import onLayoutViewConfig from './config/config';
import onTranslateConfig from './config/translate-config';
import layoutView from './layout-view-directive';
import layoutViewInput from './layout-view-input-directive';
import thumbnailCanvasRenderer from './helpers/thumbnail-canvas-renderer';

// dev testing only
import onMockConfig from './mock-responses/mock-config';
import layoutViewMockResponse from './mock-responses/layout-view-mock-response-inteceptor';
const angularRef = window.angular;

angularRef.module('crosscapAngular.common', ['ui.bootstrap'])
.service('$uiModal', function($modal) {
	return $modal;
});

export let mainModule = angularRef.module('layout-view', [
	// angular modules
	

	// third party modules
	'pascalprecht.translate',
    'ui.bootstrap',

	// core modules
	'crosscapAngular.common',
	//component modules

	//state modules
	
	]);
//dev testing only
mainModule.factory('layoutViewMockResponse', layoutViewMockResponse)
mainModule.config(onMockConfig)
//app
mainModule.service('API', API);
mainModule.config(onConfig)
mainModule.config(onAPIConfig)
mainModule.config(onPromoManagerAPIConfig)
mainModule.config(onLayoutViewAPIConfig)
mainModule.config(onLayoutViewConfig)
mainModule.config(onTranslateConfig)
mainModule.controller('layoutViewController', LayoutViewController);
mainModule.factory('apiInterceptor', apiInterceptor)
mainModule.directive('layoutView', layoutView);
mainModule.directive('layoutViewInput', layoutViewInput);
mainModule.directive('toggleState', toggleState);
mainModule.directive('thumbnailCanvasRenderer', thumbnailCanvasRenderer);
mainModule.directive('merchandiseHierarchyNativeSelection', merchandiseHierarchyNativeSelection);
mainModule.filter('merchandiseHierarchyNodePath', merchandiseHierarchyNodePath);
