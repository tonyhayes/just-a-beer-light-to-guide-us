import {EditPageController} from './edit-page-modal';
import {EditPageModal} from './edit-page-modal';
import {mainModule} from '../test';
import mocks from 'angular-mocks';
import labels from '../config/labels-en_US.json!json';
import LayoutConsts from '../layout-view-consts';
import LayoutView from './layout-view';
import getLayoutVersion from '../mock-responses/data/getLayoutVersion.json!json';
import loadLayout from '../mock-responses/data/loadLayout.json!json';
import loadtemplate from '../mock-responses/data/loadTemplate.json!json';
import clientVehicleVersionList from '../mock-responses/data/vehicle.version.json.clientVehicleVersionList.action!json'
import Camera from '../layout-view-camera';
import Viewport from './viewport'
import loadMerchandiseMap from '../mock-responses/data/getMerchandiseHierarchySuccessResponse.json!json'
import loadTemplates from '../mock-responses/data/loadTemplate.json!json'

describe('edit page Modal', () => {
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
    let data = {};
    let data2 = {};
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

        describe('when invoking the page-edit modal', function() {

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
            pageVersion = layoutView.pageVersions.get(303)
            data.data = {
                pageGridVersion: {
                    id: 562,
                    name: 'test page version load',
                    description: 'test page version load',
                    pageWidth: 8.5,
                    pageHeight: 11,
                    unit: 1,
                    isCoop: 0,
                    pageTypeCode: 'big splashy page',
                    plannedBy: 'alfred',
                    theme: 'alfred',
                    notes: 'alfred',
                    merchandiseHierarchyList: {
                        id: 384
                    }
                }
            }
            data2.data = {
                pageGridVersion: {
                    id: 562,
                    // name: 'test page version load',
                    // description: 'test page version load',
                }
            }

        });

        it('should send an HTTP get request', function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should run a page modal instance', () => {
            const mySpy = sinon.spy(EditPageModal, 'open');
            EditPageModal.open($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data);
            expect(mySpy.calledOnce).to.be.true;
        });
        it('should run a page modal controller - edit', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data);
            expect(ctrl.mode).to.equal(LayoutConsts.EDIT_MODE);
        });
        it('should run a page modal controller - delete', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.DELETE_MODE, data);
            expect(ctrl.mode).to.equal(LayoutConsts.DELETE_MODE);
        });
        it('should run a page modal controller - TEMPLATE_CLEAR_MODE', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_CLEAR_MODE, data);
            expect(ctrl.mode).to.equal(LayoutConsts.TEMPLATE_CLEAR_MODE);
        });
        it('should run a page modal controller - TEMPLATE_APPLY_MODE', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_APPLY_MODE, data);
            expect(ctrl.mode).to.equal(LayoutConsts.TEMPLATE_APPLY_MODE);
        });
        it('should run a page modal controller - MOVE_OFFERS_MODE', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.MOVE_OFFERS_MODE, data);
            expect(ctrl.mode).to.equal(LayoutConsts.MOVE_OFFERS_MODE);
        });
        it('should translate the title - edit', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data);
            expect(ctrl.title).to.equal($translate.instant('LAYOUT_VIEW_PAGES_EDIT_PAGE_TITLE'));
        });
        it('should translate the title - delete', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.DELETE_MODE, data);
            expect(ctrl.title).to.equal($translate.instant('LAYOUT_VIEW_PAGES_DELETE_PAGE_TITLE'));
        });
        it('should translate the title - TEMPLATE_CLEAR_MODE', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_CLEAR_MODE, data);
            expect(ctrl.title).to.equal($translate.instant('LAYOUT_VIEW_PAGES_DELETE_TEMPLATE_TITLE'));
        });
        it('should translate the title - MOVE_OFFERS_MODE', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.MOVE_OFFERS_MODE, data);
            expect(ctrl.title).to.equal($translate.instant('LAYOUT_VIEW_PAGES_MOVE_OFFERS_TO_PARKING_LOT_TITLE'));
        });
        it('should translate the title - TEMPLATE_APPLY_MODE', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_APPLY_MODE, data);
            expect(ctrl.title).to.equal($translate.instant('LAYOUT_VIEW_PAGES_APPLY_TEMPLATE_TITLE'));
        });
        it('should have the page id - DELETE_MODE', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.DELETE_MODE, data);
            expect(ctrl.pageId).to.equal(266);
        });
        it('should find the height for the page version - delete', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.DELETE_MODE, data);
            expect(ctrl.pageVersion.dimension.h).to.equal(ctrl.h);
        });
        it('should find the width for the page version - delete', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.DELETE_MODE, data);
            expect(ctrl.pageVersion.dimension.w).to.equal(ctrl.w);
        });
        it('should find the name for the page version - delete', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.DELETE_MODE, data);
            expect(ctrl.pageVersion.name).to.equal(ctrl.name);
        });
        it('should find the height for the page version - TEMPLATE_CLEAR_MODE', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_CLEAR_MODE, data);
            expect(ctrl.pageVersion.dimension.h).to.equal(ctrl.h);
        });
        it('should find the width for the page version - TEMPLATE_CLEAR_MODE', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_CLEAR_MODE, data);
            expect(ctrl.pageVersion.dimension.w).to.equal(ctrl.w);
        });
        it('should find the name for the page version - TEMPLATE_CLEAR_MODE', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_CLEAR_MODE, data);
            expect(ctrl.pageVersion.name).to.equal(ctrl.name);
        });
        it('should find the height for the page version - TEMPLATE_APPLY_MODE', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_APPLY_MODE, data);
            expect(ctrl.pageVersion.dimension.h).to.equal(ctrl.h);
        });
        it('should find the width for the page version - TEMPLATE_APPLY_MODE', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_APPLY_MODE, data);
            expect(ctrl.pageVersion.dimension.w).to.equal(ctrl.w);
        });
        it('should find the name for the page version - TEMPLATE_APPLY_MODE', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_APPLY_MODE, data);
            expect(ctrl.pageVersion.name).to.equal(ctrl.name);
        });
        it('should find the height for the page version', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data);
            expect(ctrl.pageVersion.dimension.h).to.equal(11);
        });
        it('should find the width for the page gridversion', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data);
            expect(ctrl.pageGridVersion.pageWidth).to.equal(8.5);
        });
        it('should find the height for the page gridversion', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data);
            expect(ctrl.pageGridVersion.pageHeight).to.equal(11);
        });
        it('should not track the changes made to width', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data);
            ctrl.w = 87;
            expect(ctrl.pageGridVersion.pageWidth).to.equal(8.5);
        });
        it('should not track the changes made to height', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data);
            ctrl.h = 43;
            expect(ctrl.pageGridVersion.pageHeight).to.equal(11);
        });
        it('should find the height for the page gridversion', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data);
            expect(ctrl.pageGridVersion.pageHeight).to.equal(11);
        });
        it('should find the width for the page version', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data);
            expect(ctrl.pageVersion.dimension.w).to.equal(8.5);
        });
        it('should hold height for the page version', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data);
            expect(ctrl.h).to.equal(11);
        });
        it('should hold the width for the page version', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data);
            expect(ctrl.w).to.equal(8.5);
        });
        it('should return true if gridversion name exsits', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data);
            expect(ctrl.hasGridVersionName()).to.equal(true);
        });
        it('should return false if gridversion name is empty', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data);
            ctrl.name = '';
            expect(ctrl.hasGridVersionName()).to.equal(false);
        });
        it('should return false if gridversion name is unique', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data);
            ctrl.name = 'tony';
            expect(ctrl.hasDuplicateIdentifiers()).to.equal(false);
        });
        it('should return true if gridversion name is not unique', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data);
            ctrl.name = 'Page 4';
            expect(ctrl.hasDuplicateIdentifiers()).to.equal(true);
        });
        it('should return true if gridversion name is not unique, regardless of case', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data);
            ctrl.name = 'page 4';
            expect(ctrl.hasDuplicateIdentifiers()).to.equal(true);
        });
        it('should create default value if height is missing', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data2);
            expect(ctrl.h).to.equal(11);
        });
        it('should create default value if width is missing', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data2);
            expect(ctrl.w).to.equal(8.5);
        });
        it('should create default value if name is missing', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data2);
            expect(ctrl.name).to.equal(null);
        });
        it('should create default value if isCoop is missing', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data2);
            expect(ctrl.isCoop).to.equal(0);
        });
        it('should create default value if theme is missing', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data2);
            expect(ctrl.theme).to.equal(null);
        });
        it('should create default value if notes is missing', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data2);
            expect(ctrl.notes).to.equal(null);
        });
        it('should create default value if hierarchyId is missing', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data2);
            expect(ctrl.hierarchyId).to.equal(1);
        });
        it('should init moveOffers to false', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data);
            expect(ctrl.moveOffers).to.equal(false);
        });
        it('should init moveOffers to false', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data);
            expect(ctrl.index).to.equal(2);
        });
        it('should have pageVersionId', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data);
            expect(ctrl.pageVersionId).to.equal(303);
        });
        it('should have hasPageVersionOffers as true', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.EDIT_MODE, data);
            expect(ctrl.hasPageVersionOffers).to.equal(true);
        });
        it('should have channel id and name for TEMPLATE_APPLY_MODE', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_APPLY_MODE, data);
            expect(ctrl.channels.id).to.equal(7);
            expect(ctrl.channels.name).to.equal('Flyer');
        });
        it('should have the default channel id', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_APPLY_MODE, data);
            expect(ctrl.channel).to.equal(7);
        });
        it('should have disabled = true', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_APPLY_MODE, data);
            expect(ctrl.disabled).to.equal(true);
        });
        it('should have dateformat of MM/dd/yyyy', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_APPLY_MODE, data);
            expect(ctrl.dateFormat).to.equal('MM/dd/yyyy');
        });
        it('should have pagination controls', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_APPLY_MODE, data);
            expect(ctrl.offset).to.equal(0);
            expect(ctrl.limit).to.equal(0);
            expect(ctrl.firstRead).to.equal(true);
            expect(ctrl.totalRecords).to.equal(0);
            expect(ctrl.startingIndex).to.equal(0);
            expect(ctrl.numPerPage).to.equal(LayoutConsts.LAYOUT_PAGE_VERSION_TEMPLATE_RECORDS_REQUEST);
        });
        it('should update selected template on radio click', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_APPLY_MODE, data);
            const template = {
                id: 'batman'
            }
            expect(ctrl.disabled).to.equal(true);
            expect(ctrl.selectedTemplate).to.equal(null);
            ctrl.handleRadioClick(template)
            expect(ctrl.selectedTemplate).to.equal('batman');
            expect(ctrl.disabled).to.equal(false);
        });
        it('should getPage', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_APPLY_MODE, data);
            ctrl.numPerPage = 3;
            ctrl.pageLayoutTemplates = loadTemplates.data.data.pageLayoutTemplates;
            ctrl.totalRecords = loadTemplates.data.data.pageLayoutTemplateCount;
            ctrl.startingIndex += ctrl.numPerPage;
            const records = ctrl.getPage(ctrl.offset, 3)
            expect(ctrl.offset).to.equal(1);
            expect(ctrl.limit).to.equal(3);
            expect(records.length).to.equal(3);
        });
        it('should setPage', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_APPLY_MODE, data);
            ctrl.numPerPage = 3;
            ctrl.pageLayoutTemplates = loadTemplates.data.data.pageLayoutTemplates;
            ctrl.totalRecords = loadTemplates.data.data.pageLayoutTemplateCount;
            ctrl.startingIndex += ctrl.numPerPage;
            ctrl.currentPage = 1;
            ctrl.setPage(3);
            expect(ctrl.offset).to.equal(1);
            expect(ctrl.limit).to.equal(3);
            expect(ctrl.templates.length).to.equal(3);
        });
        it('should initPage', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_APPLY_MODE, data);
            ctrl.numPerPage = 3;
            ctrl.pageLayoutTemplates = loadTemplates.data.data.pageLayoutTemplates;
            ctrl.totalRecords = loadTemplates.data.data.pageLayoutTemplateCount;
            ctrl.startingIndex += ctrl.numPerPage;
            ctrl.initPage(3);
            expect(ctrl.noOfPages).to.equal(2);
            expect(ctrl.currentPage).to.equal(1);
            expect(ctrl.offset).to.equal(1);
            expect(ctrl.limit).to.equal(3);
            expect(ctrl.templates.length).to.equal(3);
        });
        it('should readNextPage', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_APPLY_MODE, data);
            ctrl.numPerPage = 3;
            ctrl.pageLayoutTemplates = loadTemplates.data.data.pageLayoutTemplates;
            ctrl.totalRecords = loadTemplates.data.data.pageLayoutTemplateCount;
            ctrl.startingIndex += ctrl.numPerPage;
            ctrl.initPage(3);
            ctrl.readNextPage(3);
            expect(ctrl.noOfPages).to.equal(2);
            expect(ctrl.currentPage).to.equal(2);
            expect(ctrl.offset).to.equal(4);
            expect(ctrl.limit).to.equal(6);
            expect(ctrl.templates.length).to.equal(3);
        });
        it('should getNextPage', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_APPLY_MODE, data);
            ctrl.numPerPage = 3;
            ctrl.pageLayoutTemplates = loadTemplates.data.data.pageLayoutTemplates;
            ctrl.totalRecords = loadTemplates.data.data.pageLayoutTemplateCount;
            ctrl.startingIndex = loadTemplates.data.data.pageLayoutTemplateCount +1;
            ctrl.initPage(3);
            ctrl.getNextPage(3);
            expect(ctrl.noOfPages).to.equal(2);
            expect(ctrl.currentPage).to.equal(2);
            expect(ctrl.offset).to.equal(4);
            expect(ctrl.limit).to.equal(6);
            expect(ctrl.templates.length).to.equal(3);
        });
        it('should getPreviousPage', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_APPLY_MODE, data);
            ctrl.numPerPage = 3;
            ctrl.pageLayoutTemplates = loadTemplates.data.data.pageLayoutTemplates;
            ctrl.totalRecords = loadTemplates.data.data.pageLayoutTemplateCount;
            ctrl.startingIndex = loadTemplates.data.data.pageLayoutTemplateCount +1;
            ctrl.initPage(3);
            ctrl.getNextPage(3);
            ctrl.getPreviousPage(3);
            expect(ctrl.noOfPages).to.equal(2);
            expect(ctrl.currentPage).to.equal(1);
            expect(ctrl.offset).to.equal(1);
            expect(ctrl.limit).to.equal(3);
            expect(ctrl.templates.length).to.equal(3);
        });
        it('should handle multiple getNextPages', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_APPLY_MODE, data);
            ctrl.numPerPage = 3;
            ctrl.pageLayoutTemplates = loadTemplates.data.data.pageLayoutTemplates;
            ctrl.totalRecords = loadTemplates.data.data.pageLayoutTemplateCount;
            ctrl.startingIndex = loadTemplates.data.data.pageLayoutTemplateCount +1;
            ctrl.initPage(3);
            ctrl.getNextPage(3);
            ctrl.getNextPage(3);
            ctrl.getNextPage(3);
            ctrl.getNextPage(3);
            ctrl.getNextPage(3);
            ctrl.getNextPage(3);
            expect(ctrl.noOfPages).to.equal(2);
            expect(ctrl.currentPage).to.equal(2);
            expect(ctrl.offset).to.equal(4);
            expect(ctrl.limit).to.equal(6);
            expect(ctrl.templates.length).to.equal(3);
        });
        it('should handle multipe getPreviousPages', () => {
            const ctrl = new EditPageController($scope, $modal, $translate, layoutView, pageVersion, LayoutConsts.TEMPLATE_APPLY_MODE, data);
            ctrl.numPerPage = 3;
            ctrl.pageLayoutTemplates = loadTemplates.data.data.pageLayoutTemplates;
            ctrl.totalRecords = loadTemplates.data.data.pageLayoutTemplateCount;
            ctrl.startingIndex = loadTemplates.data.data.pageLayoutTemplateCount +1;
            ctrl.initPage(3);
            ctrl.getNextPage(3);
            ctrl.getPreviousPage(3);
            ctrl.getPreviousPage(3);
            ctrl.getPreviousPage(3);
            ctrl.getPreviousPage(3);
            ctrl.getPreviousPage(3);
            expect(ctrl.noOfPages).to.equal(2);
            expect(ctrl.currentPage).to.equal(1);
            expect(ctrl.offset).to.equal(1);
            expect(ctrl.limit).to.equal(3);
            expect(ctrl.templates.length).to.equal(3);
        });

    });


});