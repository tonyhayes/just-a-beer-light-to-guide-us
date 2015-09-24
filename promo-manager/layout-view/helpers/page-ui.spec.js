
import PageUi from './page-ui';
import LayoutView from './layout-view';
import mocks from 'angular-mocks';
import getLayoutVersion from '../mock-responses/data/getLayoutVersion.json!json';
import loadLayout from '../mock-responses/data/loadLayout.json!json';
import clientVehicleVersionList from '../mock-responses/data/vehicle.version.json.clientVehicleVersionList.action!json'
import Camera from '../layout-view-camera';
import Viewport from './viewport'
import {mainModule} from '../test';
import loadMerchandiseMap from '../mock-responses/data/getMerchandiseHierarchySuccessResponse.json!json'

describe('page-ui', () => {
	let scope;
	let API;
	let $q;
	let $translate;
	let $httpBackend;
	let viewport = null;
	let layoutViewCamera = null;
	let layoutView = null;
	let pageUi = null;
   	let context = {
            id: 5329,
            cache:{
            },
            vehicleVersionId:'Ook.',
            vehicleId:'Ook.',
        	channelCode: 'Flyer'
        };
	beforeEach(angular.mock.module(mainModule.name));

		beforeEach(angular.mock.inject(function( _$httpBackend_, _$q_, _API_, _$translate_){
			$httpBackend = _$httpBackend_;
			$q = _$q_;
			API = _API_;
			$translate = _$translate_;
			this.sinon = sinon.sandbox.create();
			viewport = new Viewport();
			layoutViewCamera = new Camera();

		}));

		it('should invoke itself succesfully', function(){
			expect(1).to.equal(1);
		});

	    describe('when invoking the page-ui', function() {

	      	beforeEach(function() {
            $httpBackend.whenPOST(/getLayoutVersion/).respond(function(method, url, params) {
                return [200, getLayoutVersion];
            });
            $httpBackend.whenPOST(/loadLayout/).respond(function(method, url, params) {
                return [200, loadLayout];
            });
            $httpBackend.whenGET(/clientVehicleVersionList/).respond(clientVehicleVersionList);
            $httpBackend.whenPOST(/getMerchandiseHierarchy/).respond(function(method, url, params) {
                return [200, loadMerchandiseMap];
            });

	      	layoutView = new LayoutView($q, API, viewport, layoutViewCamera, context, $translate);
	      	$httpBackend.flush();
	  	});

	  	it('should send an HTTP get request', function() {
	        $httpBackend.verifyNoOutstandingExpectation();
	        $httpBackend.verifyNoOutstandingRequest();
	    });

	    it('should be able to get the last page number', function() {
	    	const pm = layoutView.getPageUi()
	       	expect(pm.getLastPageNumber()).to.equal(4);
	  	});

	    it('should be able to get the last page number - 2', function() {
            pageUi = new PageUi(
            	layoutView.selectedLayoutVersionIndex, 
            	layoutView.layoutModel, 
            	layoutView.marketToPageVersionIdManager, 
            	layoutView.pageVersions, 
            	layoutView.Viewport
            	);
	       	expect(pageUi.getLastPageNumber()).to.equal(4);
	  	});
	    it('should be able to get the getPageVersionDetails', function() {
            pageUi = new PageUi(
            	layoutView.selectedLayoutVersionIndex, 
            	layoutView.layoutModel, 
            	layoutView.marketToPageVersionIdManager, 
            	layoutView.pageVersions, 
            	layoutView.Viewport
            	);
            const ids = pageUi.getPageVersionDetails();
	       	expect(ids.length).to.equal(3);
	       	expect(ids[0].index).to.equal(2);
	       	expect(ids[1].index).to.equal(4);
	       	expect(ids[2].index).to.equal(3);
	       	expect(ids[0].id).to.equal(266);
	       	expect(ids[1].id).to.equal(267);
	       	expect(ids[2].id).to.equal(271);
	       	expect(ids[0].name).to.equal('Page 3');
	       	expect(ids[1].name).to.equal('Page 4');
	       	expect(ids[2].name).to.equal('Page 6');
	       	expect(ids[0].position.x).to.equal(50);
	       	expect(ids[0].position.y).to.equal(260);
	       	expect(ids[0].position.z).to.equal(1);
	  	});
	    it('should be able to get the getLastZindexNumber', function() {
            pageUi = new PageUi(
            	layoutView.selectedLayoutVersionIndex, 
            	layoutView.layoutModel, 
            	layoutView.marketToPageVersionIdManager, 
            	layoutView.pageVersions, 
            	layoutView.Viewport
            	);
            const z = pageUi.getLastZindexNumber();
	       	expect(z).to.equal(2);
	  	});
	    it('should be able to get the getPageVersionDetailsForVersionId', function() {
            pageUi = new PageUi(
            	layoutView.selectedLayoutVersionIndex, 
            	layoutView.layoutModel, 
            	layoutView.marketToPageVersionIdManager, 
            	layoutView.pageVersions, 
            	layoutView.Viewport
            	);
            const info = pageUi.getPageVersionDetailsForVersionId(303);
	       	expect(info.id).to.equal(266);
	  	});



	});


});