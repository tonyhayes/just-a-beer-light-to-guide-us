import {ItemSearchController} from './item-search';
import {ItemSearch} from './item-search';
import {mainModule} from '../layout-view/test';
import mocks from 'angular-mocks';
import labels from '../layout-view/config/labels-en_US.json!json';
import LayoutConsts from '../layout-view/layout-view-consts';
import LayoutView from '../layout-view/helpers/layout-view';
import getLayoutVersion from '../layout-view/mock-responses/data/getLayoutVersion.json!json';
import loadLayout from '../layout-view/mock-responses/data/loadLayout.json!json';
import loadtemplate from '../layout-view/mock-responses/data/loadTemplate.json!json';
import channels from '../layout-view/mock-responses/data/promo.planning.getAllImplTypeChannels.action!json';
import clientVehicleVersionList from '../layout-view/mock-responses/data/vehicle.version.json.clientVehicleVersionList.action!json'
import Camera from '../layout-view/layout-view-camera';
import Viewport from '../layout-view/helpers/viewport'
import loadMerchandiseMap from '../layout-view/mock-responses/data/getMerchandiseHierarchySuccessResponse.json!json'
import loadTemplates from '../layout-view/mock-responses/data/loadTemplate.json!json'

describe('item Modal', () => {
    let $scope;
    let $modal;
    let $translate;
    let API;
    let $q;
    let pageVersion = null;
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

        describe('when invoking the item search modal', function() {

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

        it('should run an item search modal instance', () => {
            const mySpy = sinon.spy(ItemSearch, 'open');
            ItemSearch.open($scope, $modal, $translate, layoutView);
            expect(mySpy.calledOnce).to.be.true;
        });
        it('should run an item search modal controller', () => {
            const ctrl = new ItemSearchController($scope, $modal, $translate, layoutView);
            expect(ctrl.hierarchyId).to.equal(1);
        });
        it('should populate the itemTree', () => {
            const ctrl = new ItemSearchController($scope, $modal, $translate, layoutView);
            expect(ctrl.itemTree.length).to.equal(1);
        });
        it('should populate the itemTree nodes', () => {
            const ctrl = new ItemSearchController($scope, $modal, $translate, layoutView);
            expect(ctrl.itemTree[0].nodes.length).to.equal(6);
        });
        it('should not populate the itemTree nodes below the current level', () => {
            const ctrl = new ItemSearchController($scope, $modal, $translate, layoutView);
            expect(ctrl.itemTree[0].nodes[0].nodes).to.equal(undefined);
        });
        it('should populate the itemTree nodes below the current level on open', () => {
            const ctrl = new ItemSearchController($scope, $modal, $translate, layoutView);
            ctrl.open(ctrl.itemTree[0].nodes[0])
            expect(ctrl.itemTree[0].nodes[0].nodes.length).to.equal(1);
        });
        it('should populate the next itemTree nodes below the current level on open', () => {
            const ctrl = new ItemSearchController($scope, $modal, $translate, layoutView);
            ctrl.open(ctrl.itemTree[0].nodes[0])
            expect(ctrl.itemTree[0].nodes[0].nodes.length).to.equal(1);
        });
        it('should not populate beyond the last itemTree node on open', () => {
            const ctrl = new ItemSearchController($scope, $modal, $translate, layoutView);
            ctrl.open(ctrl.itemTree[0].nodes[0])
            expect(ctrl.itemTree[0].nodes[0].nodes.length).to.equal(1);
        });
        it('should remove the last itemTree node on delete', () => {
            const ctrl = new ItemSearchController($scope, $modal, $translate, layoutView);
            ctrl.open(ctrl.itemTree[0].nodes[0])
            expect(ctrl.itemTree[0].nodes[0].nodes.length).to.equal(1);
        });
        it('should format the item search query', () => {
            const ctrl = new ItemSearchController($scope, $modal, $translate, layoutView);
            ctrl.open(ctrl.itemTree[0].nodes[0])
            expect(ctrl.itemTree[0].nodes[0].nodes.length).to.equal(1);
            let h = ctrl.itemQuery(0, 'tony');
            expect(ctrl.itemSearch[0]).to.equal('tony');
            expect(h).to.equal('tony');
            h = ctrl.itemQuery(2, 'carson');
            expect(ctrl.itemSearch[2]).to.equal('carson');
            expect(h).to.equal('carson');
        });
        // it('should find candy from the item search query', () => {
        //     const ctrl = new ItemSearchController($scope, $modal, $translate, layoutView);
        //     ctrl.searchItems([11880]);
        //     expect(ctrl.itemTree[0].nodes[0].length).to.equal(1);
        //     expect(ctrl.itemTree[0].nodes[0].searched).to.equal(true);
        // });
        // it('should find candy from the loadItems function', () => {
        //     const ctrl = new ItemSearchController($scope, $modal, $translate, layoutView);
        //     ctrl.itemSearch = [11880];
        //     ctrl.loadItems();
        //     expect(ctrl.itemTree[0].nodes[0].length).to.equal(1);
        //     expect(ctrl.itemTree[0].nodes[0].searched).to.equal(true);
        // });
        // it('should add an item from the itemSelection function', () => {
        //     const ctrl = new ItemSearchController($scope, $modal, $translate, layoutView);
        //     ctrl.itemSearch = [11880];
        //     ctrl.loadItems();
        //     expect(ctrl.itemTree[0].nodes[0].searched).to.equal(true);
        //     ctrl.itemSelection(ctrl.itemTree[0].nodes[0].nodes[0]);
        //     expect(ctrl.itemSelections[0].ids[0]).to.equal(2);
        //     expect(ctrl.itemSelections[0].ids[1]).to.equal(11880);
        //      expect(ctrl.itemSelections[0].name).to.equal('11880 list');
        // });
        // it('should not add a duplicate item from the itemSelection function', () => {
        //     const ctrl = new ItemSearchController($scope, $modal, $translate, layoutView);
        //     ctrl.itemSearch = [2];
        //     ctrl.loadItems();
        //     expect(ctrl.itemTree[0].nodes[0].searched).to.equal(true);
        //     ctrl.itemSelection(ctrl.itemTree[0].nodes[0].nodes[0]);
        //     expect(ctrl.itemSelections[0].ids[0]).to.equal(2);
        //     expect(ctrl.itemSelections[0].ids[1]).to.equal(11880);
        //     expect(ctrl.itemSelections[0].name).to.equal('11880 list');
        //     expect(ctrl.itemSelections.length).to.equal(1);
        // });
        // it('should delete an item using deleteSelection function', () => {
        //     const ctrl = new ItemSearchController($scope, $modal, $translate, layoutView);
        //     ctrl.itemSearch = [2, 11880];
        //     ctrl.loadItems();
        //     expect(ctrl.itemTree[0].nodes[0].nodes[0].searched).to.equal(true);
        //     ctrl.itemSelection(ctrl.itemTree[0].nodes[0].nodes[0]);
        //     expect(ctrl.itemSelections[0].ids[0]).to.equal(2);
        //     expect(ctrl.itemSelections[0].ids[1]).to.equal(11880);
        //     ctrl.deleteSelection(ctrl.itemSelections[0]);
        //     expect(ctrl.itemSelections.length).to.equal(0);
        // });
        // it('should return a valid format from formatSelectedItem function', () => {
        //     const ctrl = new ItemSearchController($scope, $modal, $translate, layoutView);
        //     const item = {
        //         id: 11880
        //     }
        //     const selection = ctrl.formatSelectedItem(item);
        //     expect(selection.ids[0]).to.equal(2);
        //     expect(selection.ids[1]).to.equal(11880);
        //     expect(selection.name).to.equal('11880 list');
        // });
        // it('should return false from hasSelectedItem function', () => {
        //     const ctrl = new ItemSearchController($scope, $modal, $translate, layoutView);
        //     const item = {
        //         id: 11880
        //     }
        //     const selection = ctrl.formatSelectedItem(item);
        //     expect(selection.ids[0]).to.equal(2);
        //     expect(selection.ids[1]).to.equal(11880);
        //     expect(selection.name).to.equal('11880 list');
        //     const has = ctrl.hasSelectedItem(selection);
        //     expect(has).to.equal(false);
        // });
        // it('should return true from hasSelectedItem function', () => {
        //     const ctrl = new ItemSearchController($scope, $modal, $translate, layoutView);
        //     ctrl.itemSearch = [2, 11880];
        //     ctrl.loadItems();
        //     expect(ctrl.itemTree[0].nodes[0].nodes[0].searched).to.equal(true);
        //     ctrl.itemSelection(ctrl.itemTree[0].nodes[0].nodes[0]);
        //     expect(ctrl.itemSelections[0].ids[0]).to.equal(2);
        //     expect(ctrl.itemSelections[0].ids[1]).to.equal(11880);
        //     expect(ctrl.itemSelections[0].name).to.equal('11880 list');
        //     const item = {
        //         id: 11880
        //     }
        //     const selection = ctrl.formatSelectedItem(item);
        //     expect(selection.ids[0]).to.equal(2);
        //     expect(selection.ids[1]).to.equal(11880);
        //     expect(selection.name).to.equal('11880 list');
        //     const has = ctrl.hasSelectedItem(selection);
        //     expect(has).to.equal(true);
        // });
        // it('should return true for isSelectedItem function', () => {
        //     const ctrl = new ItemSearchController($scope, $modal, $translate, layoutView);
        //     ctrl.itemSearch = [2, 11880];
        //     ctrl.loadItems();
        //     expect(ctrl.itemTree[0].nodes[0].nodes[0].searched).to.equal(true);
        //     ctrl.itemSelection(ctrl.itemTree[0].nodes[0].nodes[0]);
        //     expect(ctrl.itemSelections[0].ids[0]).to.equal(2);
        //     expect(ctrl.itemSelections[0].ids[1]).to.equal(11880);
        //     expect(ctrl.itemSelections[0].name).to.equal('11880 list');
        //     const has = ctrl.isSelectedItem(ctrl.itemTree[0].nodes[0].nodes[0]);
        //     expect(has).to.equal(true);
        // });
        // it('should return false for isSelectedItem function', () => {
        //     const ctrl = new ItemSearchController($scope, $modal, $translate, layoutView);
        //     ctrl.itemSearch = [2, 11880];
        //     ctrl.loadItems();
        //     expect(ctrl.itemTree[0].nodes[0].nodes[0].searched).to.equal(true);
        //     ctrl.itemSelection(ctrl.itemTree[0].nodes[0].nodes[0]);
        //     expect(ctrl.itemSelections[0].ids[0]).to.equal(2);
        //     expect(ctrl.itemSelections[0].ids[1]).to.equal(11880);
        //     expect(ctrl.itemSelections[0].name).to.equal('11880 list');
        //     const has = ctrl.isSelectedItem(ctrl.itemTree[0].nodes[0]);
        //     expect(has).to.equal(false);
        // });
    });
});