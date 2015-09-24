
import LayoutView from './layout-view';
import Notifier from '../../../helpers/notifier';
import mocks from 'angular-mocks';
import getLayoutVersion from '../mock-responses/data/getLayoutVersion.json!json';
import loadLayout from '../mock-responses/data/loadLayout.json!json';
import clientVehicleVersionList from '../mock-responses/data/vehicle.version.json.clientVehicleVersionList.action!json'
import Camera from '../layout-view-camera';
import Viewport from './viewport'
import {mainModule} from '../test';
import loadMerchandiseMap from '../mock-responses/data/getMerchandiseHierarchySuccessResponse.json!json'

describe('layout-view', () => {
	let scope;
	let API;
	let $q;
	let $translate;
	let $httpBackend;
	let viewport = null;
	let layoutViewCamera = null;
	let layoutView = null;
   	let context = {
            id: 5329,
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

	    describe('when invoking the layout-view', function() {

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

	    it('should have vehicleVersions', function() {
	       expect(layoutView.vehicleVersions.length).to.equal(2);
	       expect(layoutView.vehicleVersions[0].id).to.equal(27334);
	       expect(layoutView.vehicleVersions[0].name).to.equal('Base');
	  	});

	    it('should have a selected vehicleVersion', function() {
	       expect(layoutView.selectedVehicleVersion.id).to.equal(27334);
	       expect(layoutView.selectedVehicleVersion.name).to.equal('Base');
	    });

	    it('should have a layoutModel', function() {
	       expect(layoutView.layoutModel.id).to.equal(1128);
	  	});
	    it('should get a layout', function() {
	    	const layout = layoutView.getLayoutModel()
	       	expect(layout.id).to.equal(1128);
	  	});
	    it('should get a getMarketIdList', function() {
	    	const list = layoutView.getMarketIdList()
	       	expect(list.length).to.equal(4);
        	expect(list.toString()).to.equal('1092,1089,1090,1091');
	  	});
	    it('should addPagesToLayout', function() {
	    	const lm = layoutView.getLayoutModel()
	        expect(lm.pageList).to.have.length(4);
	        const page = [{
	            id: 702,
	            position: 5,
	            x: 200,
	            y: 300,
	            z: 3,
	            spreadId: null
	        }];
	        const gridVersionMap = {
	        	702:{
					id: 555,
					description: 'testing',
		        	pageWidth: 8,
		        	pageHeight: 11,
		        	unit: 0,
		        	name: 'gridVersionName',
		        	versionMarketIdList : [1087, 1090]	        		
	        	}
	        };

	    	layoutView.addPagesToLayout(page, gridVersionMap)
	        expect(lm.pageList).to.have.length(5);
	        let p = lm.pageList[4];
	        expect(p.id).to.equal(702);
	        expect(p.spreadId).to.equal(null);
	        expect(p.index).to.equal(5);
	        expect(p.position.x).to.equal(200);
	        expect(p.position.y).to.equal(300);
	        expect(p.position.z).to.equal(3);
	       	expect(lm.id).to.equal(1128);
	  	});
	    it('should be able to change vehicle layout versions', function() {
	    	layoutView.getNewLayoutVersionForVehicle(27399)
	       	expect(layoutView.selectedVehicleVersion.id).to.equal(27399);
	       	expect(layoutView.selectedLayoutVersionIndex).to.equal(0);
	  	});
	    it('should be able to change layout versions', function() {
	    	layoutView.getNewLayoutVersion(1)
	       	expect(layoutView.selectedVehicleVersion.id).to.equal(27334);
	       	expect(layoutView.selectedLayoutVersionIndex).to.equal(0);
	  	});
	    it('should be able to get the selected layout id', function() {
	    	layoutView.getNewLayoutVersion(1)
	       	expect(layoutView.selectedLayoutVersionId).to.equal(1);
	  	});
	    it('should be able to get a page manager', function() {
	    	const pm = layoutView.getPageUi()
	       	expect(pm.selectedLayoutVersionIndex).to.equal(0);
	  	});

	    it('should be able to get the last page number', function() {
	    	const pm = layoutView.getPageUi()
	       	expect(pm.getLastPageNumber()).to.equal(4);
	  	});
	    it('should be able to find a match within a hierarchy - hierarchyTreeSearch', function() {
	    	const match = layoutView.hierarchyTreeSearch(384, 384)
	       	expect(match).to.equal(true);
	  	});
	    it('should not find a match within a hierarchy - hierarchyTreeSearch ', function() {
	    	const match = layoutView.hierarchyTreeSearch(384, 2)
	       	expect(match).to.equal(false);
	  	});
	    it('should be able to find a match within a hierarchy - containsHierarchy', function() {
	    	const obj = {
	    		offerVersion:{
	    			hierarchyId:384
	    		}
	    	}
	    	const match = layoutView.containsHierarchy(obj, 384)
	       	expect(match).to.equal(true);
	  	});
	    it('should not find a match within a hierarchy - containsHierarchy', function() {
	    	const obj = {
	    		offerVersion:{
	    			hierarchyId:384
	    		}
	    	}
	    	const match = layoutView.containsHierarchy(obj, 2)
	       	expect(match).to.equal(false);
	  	});
	    it('should be able to find a match within a hierarchy - containsHierarchy3', function() {
	    	const obj = {hierarchyId:384}
	    	const match = layoutView.containsHierarchy(obj, 384)
	       	expect(match).to.equal(true);
	  	});
	    it('should not find a match within a hierarchy - containsHierarchy2', function() {
	    	const obj = {hierarchyId:384}
	    	const match = layoutView.containsHierarchy(obj, 2)
	       	expect(match).to.equal(false);
	  	});
	    it('should not find a match within a hierarchy - containsHierarchy', function() {
	    	const obj = {}
	    	const match = layoutView.containsHierarchy(obj, 26160)
	       	expect(match).to.equal(false);
	  	});
	    it('should find a match within a hierarchy 1- hasHierarchy', function() {
	    	const obj = layoutView.pageVersions.get(303)
	    	const match = layoutView.hasHierarchy(obj, 384)
	       	expect(match).to.equal(true);
	  	});
	    it('should not find a match within a hierarchy 2- hasHierarchy', function() {
	    	const obj = layoutView.pageVersions.get(304)
	    	const match = layoutView.hasHierarchy(obj, 384)
	       	expect(match).to.equal(false);
	  	});
	    it('should find a match within a hierarchy 1- hasHierarchy', function() {
	    	const obj = layoutView.pageVersions.get(303)
	    	const match = layoutView.hasHierarchy(obj.ui.grip, 384)
	       	expect(match).to.equal(true);
	  	});
	    it('should not find a match within a hierarchy 2- hasHierarchy', function() {
	    	const obj = layoutView.pageVersions.get(304)
	    	const match = layoutView.hasHierarchy(obj.ui.grip, 384)
	       	expect(match).to.equal(false);
	  	});
	    it('should getChannel', function() {
	    	const channel = layoutView.getChannel();
	       	expect(channel.id).to.equal(7);
	       	expect(channel.name).to.equal('Flyer');
	  	});


	});


});