import Camera from './layout-view-camera';
import Util from 'helpers/util';
import Viewport from './helpers/viewport'
import LayoutView from './helpers/layout-view'
import InputHandler from './helpers/input-handler'
import {ItemSearch} from '../helpers/item-search';
import {AddPagesModal} from './helpers/add-pages-modal';
import {IndexPagesModal} from './helpers/index-pages-modal';
import {EditPageModal} from './helpers/edit-page-modal';
import {EditBlockModal} from './helpers/edit-block-modal';
import LayoutConsts from './layout-view-consts';

const $ = angular.element;

export default class LayoutViewController {
    constructor($scope, $q, $translate, API, $uiModal) {
        this.API = API;
        this.$q = $q
        this.$modal = $uiModal;
        this.viewport = new Viewport();
        this.pageUi = null;
        this.cardObject = null;
        this.layoutViewCamera = new Camera();
        this.inputEvents = [ 'mousedown', 'wheel', 'keydown' ].sort(Util.stringComparator);
        //context is bound to the controller from outside the application
        if(!this.context){
            this.context = {};
        }
        this.merchandiseHierarchyId = null;
        this.merchandiseHierarchySelectionLabels = [
            $translate.instant('OFFERS_LIST_ALL_SBUS'),  
            $translate.instant('OFFERS_LIST_ALL_DEPARTMENTS'), 
            $translate.instant('OFFERS_LIST_ALL_CATEGORIES')
        ];
        this.merchandiseHierarchyLabels = [
            $translate.instant('OFFERS_LIST_SBU'),  
            $translate.instant('OFFERS_LIST_DEPARTMENT'), 
            $translate.instant('OFFERS_LIST_CATEGORY')
        ];
        this.merchandiseHierarchySelectionLabelFilters = [
            $translate.instant('OFFERS_LIST_ALL_SBUS_FILTER'),  
            $translate.instant('OFFERS_LIST_ALL_DEPARTMENTS'), 
            $translate.instant('OFFERS_LIST_ALL_CATEGORIES')
        ];
        this.close = false;
// TODO: Store a spatial partitioning layoutTree containing the WORLD SPACE
// location of each block in the current view.
//   On Page/Block Spatial Change:
//     Added/Move/Resize/Deleted Page
//     Added/Resize/Split/Join/Deleted Block  (Add/Delete via Apply/Delete Template)
//     Remove object from tree and re-add with new position
//   On Market Change (or mass invalidate):
//     Just rebuild from scratch when switching between
//     markets to simplify state management a bit.

        this.API = API;
        this.layoutView = new LayoutView(
            this.$q,
            this.API, 
            this.viewport,
            this.layoutViewCamera,
            this.context, // this is loaded from outside the application
            $translate
            )
    }

    handleInputs($event) {
        if(!this.pageUi){
            this.pageUi = this.layoutView.getPageUi();
            this.inputHandler = new InputHandler(
                this.pageUi, 
                this.viewport, 
                this.layoutView, 
                this.inputEvents, 
                this.layoutViewCamera
                )
        }

        switch($event.type) {
            case 'wheel':      this.inputHandler.handleWheelEvent($event);      break;
            case 'keydown':    this.inputHandler.handleKeyEvent($event);        break;
            case 'mousedown':  this.inputHandler.handleDragStartEvent($event);  break;
            case 'mousemove':  this.inputHandler.handleDragMoveEvent($event);   break;
            case 'mouseup':    this.inputHandler.handleDragStopEvent($event);   break;
        }
        this.cardObject = this.inputHandler.getCardObject();
    }

    getPagesInViewport() {
        //load root into merchandise hierarchy after data is loaded
        if(!this.merchandiseHierarchyId){
            this.merchandiseHierarchyId = this.layoutView.merchandiseHierarchy.getRootId();
        }

        return this.layoutView.getPagesInViewport();
    }

    updateSelectedVehicleVersion(selectedLayoutVersionId){
        if(selectedLayoutVersionId){
            this.layoutView.getNewLayoutVersionForVehicle(selectedLayoutVersionId);            
        }
    }
    updateSelectedLayoutVersion(selectedLayoutVersionId){
        if(selectedLayoutVersionId){
           this.layoutView.getNewLayoutVersion(selectedLayoutVersionId);            
        } 
    }

    getBlockModalHandler(action, block, pageVersion){
        //most actions at the block level are performed in the legacy code
        // check to see if the legacy context object has an entry for the action
        if(this.context.legacyHooks && this.context.legacyHooks[action]){

            // adBlockId: 810
            // channel: "printMedia"
            // displayType: NaN
            // isWorkflowLocked: "false"
            // loadFromContextMenu: true
            // merchandiseHierarchy: NaN
            // offerId: -1
            // rfcCanModify: "false"
            // rfcCanRequest: "true"
            // rfcId: NaN
            let ctxMenu = {
               adBlockId: block.id,
               channel: this.context.channelCode,
               offerId: block.offerVersion  ? block.offerVersion.getOffer().id  : -1               
            }
            this.context.legacyHooks[action](ctxMenu);
            return;
        }

        let fn = Util.camelize('open-'+action+'-modal');
        // find object (using this)
        fn = this[fn];
        // is object a function?
        if (typeof fn === "function") {
            //run it
            fn.apply(null, [block, pageVersion, this]);
        }
    }
    getPageVersionModalHandler(action, pageVersion){
        // for context menu items, read the permitted actios and find/run the required funtion
        let fn = Util.camelize('open-'+action+'-modal');
        // find object (using this)
        fn = this[fn];
        // is object a function?
        if (typeof fn === "function") {
            //run it
            fn.apply(null, [pageVersion, this]); // "this" is lost during the apply, so take it with us
        }
    }
    getPageModalHandler(action){
        // for page level actions, read the permitted actions and find/run the required funtion
        let fn = Util.camelize('open-'+action+'-modal');
        // find object (using this)
        fn = this[fn];
        // is object a function?
        if (typeof fn === "function") {
            //run it
            fn.apply(null, [this]); // "this" is lost during the apply, so take it with us
        }
    }
    // if the user has selected a filter by a specific MH, then disable non matching
    isDisabled(obj){
        if(!this.merchandiseHierarchyId || this.merchandiseHierarchyId == this.layoutView.merchandiseHierarchy.getRootId()){
            return false;            
        }
        return !this.layoutView.hasHierarchy(obj, this.merchandiseHierarchyId);    
    }
    // this is for testing only -- remove this and attach to the offer wizard 
    openItemSearchModal(){
        ItemSearch.open(this.$scope, this.$modal, this.$translate, this.layoutView);
    }
    //pages       
    openAddPageModal(self){
        AddPagesModal.open(self.$scope, self.$modal, self.$translate, self.layoutView);
    }       
    openReOrderModal(self){
        IndexPagesModal.open(self.$scope, self.$modal, self.$translate, self.layoutView);
    }

    //page versions       
    openAllocateGridModal(pageVersion, self){
        EditPageModal.open(self.$scope, self.$modal, self.$translate, self.layoutView, pageVersion, LayoutConsts.EDIT_MODE);
    }
    // dup of above, remove when actions settle down       
    openPageLevelEditModal(pageVersion, self){
        EditPageModal.open(self.$scope, self.$modal, self.$translate, self.layoutView, pageVersion, LayoutConsts.EDIT_MODE);
    }       
    openAddDeletePageModal(pageVersion, self){
        if(pageVersion.isInSpreadGroup()){
            this.layoutView.Notifier.error('LAYOUT_VIEW_DELETE_PAGE_SPREAD_GROUP_ERROR');
            return
        }
        EditPageModal.open(self.$scope, self.$modal, self.$translate, self.layoutView, pageVersion, LayoutConsts.DELETE_MODE);
    }       
    openDeletePageModal(pageVersion, self){
        if(pageVersion.isInSpreadGroup()){
            this.layoutView.Notifier.error('LAYOUT_VIEW_DELETE_PAGE_SPREAD_GROUP_ERROR');
            return
        }
        EditPageModal.open(self.$scope, self.$modal, self.$translate, self.layoutView, pageVersion, LayoutConsts.DELETE_MODE);
    }       
    openClearTemplateModal(pageVersion, self){
        EditPageModal.open(self.$scope, self.$modal, self.$translate, self.layoutView, pageVersion, LayoutConsts.TEMPLATE_CLEAR_MODE);
    }       
    openImportTemplateModal(pageVersion, self){
        EditPageModal.open(self.$scope, self.$modal, self.$translate, self.layoutView, pageVersion, LayoutConsts.TEMPLATE_APPLY_MODE);
    }
    // not used, not tested       
    openMoveOffersToParkingLotModal(pageVersion, self){
        EditPageModal.open(self.$scope, self.$modal, self.$translate, self.layoutView, pageVersion, LayoutConsts.MOVE_OFFERS_MODE);
    }
        //blocks              
    openAddToBasketModal(block, pageVersion, self){
        EditBlockModal.open(self.$scope, self.$modal, self.$translate, self.layoutView, block, pageVersion, LayoutConsts.ADD_TO_BASKET_MODE);
    }

    openEditAllocationModal(block, pageVersion, self){
        EditBlockModal.open(self.$scope, self.$modal, self.$translate, self.layoutView, block, pageVersion, LayoutConsts.EDIT_MODE);
    }       

}
LayoutViewController.$inject = ['$scope' ,'$q' ,'$translate', 'API', '$uiModal'];
