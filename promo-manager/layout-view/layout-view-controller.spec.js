import {mainModule} from './test';
import LayoutViewController from './layout-view-controller';
import mocks from 'angular-mocks';
import getLayoutVersion from './mock-responses/data/getLayoutVersion.json!json';
import loadLayout from './mock-responses/data/loadLayout.json!json';
import clientVehicleVersionList from './mock-responses/data/vehicle.version.json.clientVehicleVersionList.action!json'
import loadMerchandiseMap from './mock-responses/data/getMerchandiseHierarchySuccessResponse.json!json'

describe('LayoutViewController', () => {
    let scope;
    let ctrl;
    let API;
    let $translate;
    let $q;
    let $httpBackend;
    let $interval;
    let $timeout;
    let context = {
            id: 5328,
            vehicleVersionId:'Ook.',
            vehicleId:'Ook.',
            channelCode: 'Flyer'
        };

    beforeEach(angular.mock.module(mainModule.name));

    beforeEach(angular.mock.inject(function($rootScope, $controller, _$timeout_, _$interval_, _$httpBackend_, _$q_, _API_, _$translate_){
        scope = $rootScope.$new();
        scope.context = {
            id: 5328,
            vehicleVersionId:'Ook.',
            vehicleId:'Ook.',
        };
         $httpBackend = _$httpBackend_;
        $q = _$q_;
        $interval = _$interval_;
        $timeout = _$timeout_;
        $translate = _$translate_;
//        $translate = _$translate_;
        API = _API_;
        this.sinon = sinon.sandbox.create();
    //      this.sinon.stub(Notifier, 'info', function() {});
//      this.sinon.stub(Notifier, 'warnWith', function() {});
//      this.sinon.stub($translate, function() {});
//      $translate = this.sinon.stub();
    }));

    it('should invoke itself succesfully', function(){
        expect(1).to.equal(1);
    });

    describe('when invoking the layout view controller', function() {

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

            ctrl = new LayoutViewController(scope, $q, $translate, API);
            $httpBackend.flush();
        });

        it('should send an HTTP get request', function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should have vehicleVersions', function() {
            expect(ctrl.layoutView.vehicleVersions.length).to.equal(2);
            expect(ctrl.layoutView.vehicleVersions[0].id).to.equal(27334);
            expect(ctrl.layoutView.vehicleVersions[0].name).to.equal('Base');
        });

        it('should have a selected vehicleVersion', function() {
            expect(ctrl.layoutView.selectedVehicleVersion.id).to.equal(27334);
            expect(ctrl.layoutView.selectedVehicleVersion.name).to.equal('Base');
        });

        it('should have a layoutModel', function() {
            expect(ctrl.layoutView.layoutModel.id).to.equal(1128);
        });
        it('should be able to assess disable charateristic', function() {
            let disable = ctrl.isDisabled()
            expect(disable).to.equal(false);
        });
    });
    describe('when perfroming dynamic actions on the layout view controller', function() {

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

            ctrl = new LayoutViewController(scope, $q, $translate, API);
            $httpBackend.flush();
            // A call to $apply() must be performed, otherwise the
            // scope's watchers won't be run through.
            scope.$apply(function () {
                ctrl.merchandiseHierarchyId = 5;
            });
        });

        it('should send an HTTP get request', function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should watch for merchandiseHierarchyId event', function() {
            expect(ctrl.merchandiseHierarchyId).to.equal(5);
        });
        it('should be able to change vehicle layout versions', function() {
            ctrl.updateSelectedVehicleVersion(27399)
            expect(ctrl.layoutView.selectedVehicleVersion.id).to.equal(27399);
            expect(ctrl.layoutView.selectedLayoutVersionIndex).to.equal(0);
        });
         it('should be able to change layout versions', function() {
            ctrl.updateSelectedLayoutVersion(1)
            expect(ctrl.layoutView.selectedVehicleVersion.id).to.equal(27334);
            expect(ctrl.layoutView.selectedLayoutVersionIndex).to.equal(0);
        });
        it('should be able to assess disable charateristic 1 - dynamic', function() {
            let disable = ctrl.isDisabled({id:1})
            expect(disable).to.equal(true);
            expect(ctrl.merchandiseHierarchyId).to.equal(5);
        });
        it('should be able to assess disable charateristic 2 - dynamic', function() {
            ctrl.merchandiseHierarchyId = 384;
            let disable = ctrl.isDisabled({hierarchyId:2})
            expect(disable).to.equal(true);
        });
        it('should be able to assess disable charateristic 3 - dynamic', function() {
            ctrl.merchandiseHierarchyId = 384;
            let disable = ctrl.isDisabled({hierarchyId:384})
            expect(disable).to.equal(false);
        });
        it('should be able to assess disable charateristic 4 - dynamic', function() {
            ctrl.merchandiseHierarchyId = 384;
            const obj = {
                offerVersion:{
                    hierarchyId:384
                }
            }
            let disable = ctrl.isDisabled(obj);
            expect(disable).to.equal(false);
        });

  });
});