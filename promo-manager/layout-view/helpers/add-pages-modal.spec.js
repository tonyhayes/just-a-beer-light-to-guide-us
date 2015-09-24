import {AddPagesController} from './add-pages-modal';
import {AddPagesModal} from './add-pages-modal';
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

describe('add pages Modal', () => {
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

        describe('when invoking the page-add modal', function() {

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
            let mySpy = sinon.spy(AddPagesModal, 'open');
            AddPagesModal.open($scope, $modal, $translate, layoutView);
            expect(mySpy.calledOnce).to.be.true;
        });
        it('should run a page modal controller', () => {
            let addPagesController = new AddPagesController($scope, $modal, $translate, layoutView);
            expect(addPagesController.count).to.equal(1);
        });
        it('should translate', () => {
            let addPagesController = new AddPagesController($scope, $modal, $translate, layoutView);
            expect(addPagesController.pagePrefix).to.equal(labels.LAYOUT_VIEW_PAGE_GRID_VERSION_NAME_DEFAULT);
        });
        it('should find the height constant', () => {
            let addPagesController = new AddPagesController($scope, $modal, $translate, layoutView);
            expect(addPagesController.h).to.equal(LayoutViewConsts.LAYOUT_VIEW_PAGE_GRID_VERSION_HEIGHT_DEFAULT);
        });
        it('should find the width constant', () => {
            let addPagesController = new AddPagesController($scope, $modal, $translate, layoutView);
            expect(addPagesController.w).to.equal(LayoutViewConsts.LAYOUT_VIEW_PAGE_GRID_VERSION_WIDTH_DEFAULT);
        });
        it('should add lines to the grid', () => {
            let addPagesController = new AddPagesController($scope, $modal, $translate, layoutView);
            addPagesController.count = 5;
            addPagesController.createGrid();
            expect(addPagesController.previousCount).to.equal(5);
            expect(addPagesController.grid.length).to.equal(5);
        });
        it('should subtract lines from the grid', () => {
            let addPagesController = new AddPagesController($scope, $modal, $translate, layoutView);
            addPagesController.count = 5;
            addPagesController.createGrid();
            expect(addPagesController.previousCount).to.equal(5);
            expect(addPagesController.grid.length).to.equal(5);
            addPagesController.count = 3;
            addPagesController.createGrid();
            expect(addPagesController.previousCount).to.equal(3);
            expect(addPagesController.grid.length).to.equal(3);
        });
        it('should have different values for previous and current count', () => {
            let addPagesController = new AddPagesController($scope, $modal, $translate, layoutView);
            addPagesController.count = 5;
            addPagesController.createGrid();
            addPagesController.count = 15;
            expect(addPagesController.previousCount).to.not.equal(AddPagesController.count);
            expect(addPagesController.previousCount).to.equal(5);
        });
        it('should retreive the last page for the vechicle version and add 1', () => {
            let addPagesController = new AddPagesController($scope, $modal, $translate, layoutView);
            expect(addPagesController.lastPageNumber).to.equal(5);
        });
        it('should retreive the last page for the vechicle version and add 1 - test 2', () => {
            let addPagesController = new AddPagesController($scope, $modal, $translate, layoutView);
            expect(addPagesController.grid[0].index).to.equal(5);
        });
        it('should return true if pageversion name exsits', () => {
            let addPagesController = new AddPagesController($scope, $modal, $translate, layoutView);
            expect(addPagesController.hasPageVersionName()).to.equal(true);
        });
        it('should return true if pageversion name exsits', () => {
            let addPagesController = new AddPagesController($scope, $modal, $translate, layoutView);
            addPagesController.grid[0].pageVersionName = '';
            expect(addPagesController.hasPageVersionName()).to.equal(false);
        });
        it('should return false if pageversion name is unique', () => {
            let addPagesController = new AddPagesController($scope, $modal, $translate, layoutView);
            addPagesController.grid[0].pageVersionName = 'tony';
            expect(addPagesController.invalidPageData()).to.equal(false);
        });
        it('should return true if pageversion name is not unique', () => {
            let addPagesController = new AddPagesController($scope, $modal, $translate, layoutView);
            addPagesController.grid[0].pageVersionName = 'Page 4';
            expect(addPagesController.invalidPageData()).to.equal(true);
        });

    });


});