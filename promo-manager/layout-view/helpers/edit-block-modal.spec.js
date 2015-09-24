import {EditBlockController} from './edit-block-modal';
import {EditBlockModal} from './edit-block-modal';
import {mainModule} from '../test';
import mocks from 'angular-mocks';
import labels from '../config/labels-en_US.json!json';
import LayoutConsts from '../layout-view-consts';
import LayoutView from './layout-view';
import getLayoutVersion from '../mock-responses/data/getLayoutVersion.json!json';
import loadLayout from '../mock-responses/data/loadLayout.json!json';
import clientVehicleVersionList from '../mock-responses/data/vehicle.version.json.clientVehicleVersionList.action!json'
import Camera from '../layout-view-camera';
import Viewport from './viewport'
import loadMerchandiseMap from '../mock-responses/data/getMerchandiseHierarchySuccessResponse.json!json'

describe('edit EditBlockController Modal', () => {
    let $scope;
    let $modal;
    let $translate;
    let API;
    let $q;
    let block = null;
    let pageVersion = null;
    let $httpBackend;
    let viewport = null;
    let layoutViewCamera = null;
    let layoutView = null;
    let data = {};
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
                close: function(item) {
                    //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
                    this.result(item);
                },
                dismiss: function(type) {
                    //The user clicked cancel on the modal dialog, call the stored cancel callback
                    this.result(type);
                }            
            };
        });
    }));

    it('should invoke itself succesfully', function(){
        expect(1).to.equal(1);
    });

        describe('when invoking the block-edit modal', function() {

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
//            pageVersion = LayoutView.pageVersions.get(303)
            data.data = {
                block: {
                    id: 562,
                    name: 'test block loads',
                }
            }
            block = {
                id: 562,
                name: 'test block load'
            };
            pageVersion = layoutView.pageVersions.get(303)


        });


        it('should send an HTTP get request', function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should run a block modal instance', () => {
            const mySpy = sinon.spy(EditBlockModal, 'open');
            EditBlockModal.open($scope, $modal, $translate, layoutView, block, pageVersion, LayoutConsts.EDIT_MODE, data);
            expect(mySpy.calledOnce).to.be.true;
        });
        it('should run a block modal controller - EDIT_MODE', () => {
            const ctrl = new EditBlockController($scope, $modal, $translate, layoutView, block, pageVersion, LayoutConsts.EDIT_MODE, data);
            expect(ctrl.mode).to.equal(LayoutConsts.EDIT_MODE);
        });

        it('should translate the title - EDIT_MODE', () => {
            const ctrl = new EditBlockController($scope, $modal, $translate, layoutView, block, pageVersion, LayoutConsts.EDIT_MODE, data);
            expect(ctrl.title).to.equal($translate.instant('LAYOUT_VIEW_BLOCK_EDIT_TITLE'));
        });
        it('should have the block name - EDIT_MODE', () => {
            const ctrl = new EditBlockController($scope, $modal, $translate, layoutView, block, pageVersion, LayoutConsts.EDIT_MODE, data);
            expect(ctrl.name).to.equal(block.name);
        });
        it('should run a block modal controller - ADD_TO_BASKET_MODE', () => {
            const ctrl = new EditBlockController($scope, $modal, $translate, layoutView, block, pageVersion, LayoutConsts.ADD_TO_BASKET_MODE, data);
            expect(ctrl.mode).to.equal(LayoutConsts.ADD_TO_BASKET_MODE);
        });

        it('should translate the title - ADD_TO_BASKET_MODE', () => {
            const ctrl = new EditBlockController($scope, $modal, $translate, layoutView, block, pageVersion, LayoutConsts.ADD_TO_BASKET_MODE, data);
            expect(ctrl.title).to.equal($translate.instant('LAYOUT_VIEW_ADD_TO_BASKET'));
        });
        it('should have the block name - ADD_TO_BASKET_MODE', () => {
            const ctrl = new EditBlockController($scope, $modal, $translate, layoutView, block, pageVersion, LayoutConsts.ADD_TO_BASKET_MODE, data);
            expect(ctrl.name).to.equal(block.name);
        });

    });


});