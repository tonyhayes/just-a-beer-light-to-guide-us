import {IndexPagesController} from './index-pages-modal';
import {IndexPagesModal} from './index-pages-modal';
import {mainModule} from '../test';
import mocks from 'angular-mocks';
import labels from '../config/labels-en_US.json!json';
import LayoutViewConsts from '../layout-view-consts';
import LayoutView from './layout-view';
import getLayoutVersion from '../mock-responses/data/getLayoutVersion.json!json';
import loadLayout from '../mock-responses/data/loadLayout.json!json';
import clientVehicleVersionList from '../mock-responses/data/vehicle.version.json.clientVehicleVersionList.action!json'
import Camera from '../layout-view-camera';
import Viewport from './viewport'
import loadMerchandiseMap from '../mock-responses/data/getMerchandiseHierarchySuccessResponse.json!json'

describe('index pages Modal', () => {
    let $scope;
    let $modal;
    let $translate;
    let API;
    let $q;
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
    beforeEach(angular.mock.inject(function($rootScope, _$modal_ , _$translate_, _$httpBackend_, _$q_, _API_){
        $scope = $rootScope.$new();
        $modal = _$modal_;
        $translate = _$translate_;
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        API = _API_;
        viewport = new Viewport();
        layoutViewCamera = new Camera();
        sinon.stub($modal, 'open', function() {
            return {
                result : {
                  then: function(callback) {
                      callback("item1");
                  }
                },
                close: function( item ) {
                    //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
                    this.result( item );
                },
                dismiss: function( type ) {
                    //The user clicked cancel on the modal dialog, call the stored cancel callback
                    this.result( type );
                }            
            };
        });
    }));

    it('should invoke itself succesfully', function(){
        expect(1).to.equal(1);
    });

        describe('when invoking the page-order modal', function() {

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

        it('should run a page modal instance', () => {
            let mySpy = sinon.spy(IndexPagesModal, 'open');
            IndexPagesModal.open($scope, $modal, $translate, layoutView);
            expect(mySpy.calledOnce).to.be.true;
        });
        it('should return true if gridversion name exsits', () => {
            let ctrl = new IndexPagesController($scope, $modal, $translate, layoutView);
            expect(ctrl.hasPageVersionName()).to.equal(true);
        });
        it('should return true if name exsits', () => {
            let ctrl = new IndexPagesController($scope, $modal, $translate, layoutView);
            ctrl.grid[0].name = '';
            expect(ctrl.hasPageVersionName()).to.equal(false);
        });
        it('should return false if name is unique', () => {
            let ctrl = new IndexPagesController($scope, $modal, $translate, layoutView);
            ctrl.grid[0].name = 'tony';
            expect(ctrl.invalidePageData()).to.equal(false);
        });
        it('should return true if gridversion name is not unique', () => {
            let ctrl = new IndexPagesController($scope, $modal, $translate, layoutView);
            ctrl.grid[0].name = 'Page 4';
            expect(ctrl.invalidePageData()).to.equal(true);
        });

    });


});