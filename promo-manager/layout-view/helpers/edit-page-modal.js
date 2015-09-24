import pageedit from '../partials/page-edit-modal.html!text';
import pagedelete from '../partials/page-delete-modal.html!text';
import pagecleartemplate from '../partials/page-template-clear-modal.html!text';
import pageapplytemplate from '../partials/page-template-apply-modal.html!text';
import pagemoveofferstoparkinglot from '../partials/page-move-offers-to-parking-lot-modal.html!text';
import LayoutViewConsts from '../layout-view-consts';

export class EditPageModal {
    static open($scope, $modal, $translate, layoutView, pageVersion, mode) {
        this.layoutView = layoutView;
        this.pageVersion = pageVersion;
        this.mode = mode;
        this.$translate = $translate;
        this.Notifier = this.layoutView.Notifier;

        const updateModel = function updateModel(result) {
            console.log(result);
        }

        let template = null;
        switch (this.mode) {
            case LayoutViewConsts.EDIT_MODE:
                template = pageedit;
                break;
            case LayoutViewConsts.DELETE_MODE:
                if(this.pageVersion.isInSpreadGroup()){
                    this.Notifier.error('LAYOUT_VIEW_DELETE_PAGE_SPREAD_GROUP_ERROR');
                    return
                }
                template = pagedelete;
                break;
            case LayoutViewConsts.TEMPLATE_CLEAR_MODE:
                template = pagecleartemplate;
                break;
            case LayoutViewConsts.TEMPLATE_APPLY_MODE:
                template = pageapplytemplate;
                break;
            case LayoutViewConsts.MOVE_OFFERS_MODE:
                template = pagemoveofferstoparkinglot;
                break;
        }

        const {
            result, close, dismiss
        } = $modal.open({
            template: template,
            controllerAs: 'ctrl',
            controller: EditPageController,
            resolve: {
                layoutView: () => {
                    return this.layoutView;
                },
                pageVersion: () => {
                    return this.pageVersion;
                },
                mode: () => {
                    return this.mode;
                },
                data: () => {
                    if (this.mode == LayoutViewConsts.EDIT_MODE) {
                        return this.layoutView.loadPageVersion(this.pageVersion.getPageVersionId())
                    } else {
                        return null;
                    }
                }
            }
        });
        result.then((data) => {
            updateModel(data);
        }, (data) => {
            console.log("dismiss: ", data)
        });
    }

}
export class EditPageController {
    constructor($scope, $modalInstance, $translate, layoutView, pageVersion, mode, data) {
        this.layoutView = layoutView;
        this.$modalInstance = $modalInstance;
        this.$translate = $translate;
        this.Notifier = this.layoutView.Notifier;
        this.pageVersion = pageVersion;
        this.mode = mode;
        this.title = null;
        this.h = this.pageVersion.dimension.h || 11;
        this.w = this.pageVersion.dimension.w || 8.5;
        this.name = this.pageVersion.name || null;
        this.disabled = true;
        this.dateFormat = LayoutViewConsts.LAYOUT_VIEW_DATE_FORMAT;
        switch (this.mode) {
            case LayoutViewConsts.EDIT_MODE:
                this.title = this.$translate.instant('LAYOUT_VIEW_PAGES_EDIT_PAGE_TITLE');
                this.pageGridVersion = data.data.pageGridVersion;
                this.h = this.pageGridVersion.pageHeight || 11;
                this.w = this.pageGridVersion.pageWidth || 8.5;
                this.name = this.pageGridVersion.name || null;
                this.isCoop = this.pageGridVersion.isCoop || 0;
                this.theme = this.pageGridVersion.theme || null;
                this.notes = this.pageGridVersion.notes || null;
                this.hierarchyId = this.pageGridVersion.merchandiseHierarchyList  ? this.pageGridVersion.merchandiseHierarchyList.id : this.layoutView.merchandiseHierarchy.getRootId();
                this.merchandiseHierarchyTreeMap = this.layoutView.merchandiseHierarchy
                this.merchandiseHierarchySelectionLabels = [
                    $translate.instant('OFFERS_LIST_ALL_SBUS'),  
                    $translate.instant('OFFERS_LIST_ALL_DEPARTMENTS'), 
                    $translate.instant('OFFERS_LIST_ALL_CATEGORIES')
                ];
                break;
            case LayoutViewConsts.DELETE_MODE:
                this.title = this.$translate.instant('LAYOUT_VIEW_PAGES_DELETE_PAGE_TITLE');
                break;
            case LayoutViewConsts.MOVE_OFFERS_MODE:
                this.title = this.$translate.instant('LAYOUT_VIEW_PAGES_MOVE_OFFERS_TO_PARKING_LOT_TITLE');
                break;
            case LayoutViewConsts.TEMPLATE_CLEAR_MODE:
                this.title = this.$translate.instant('LAYOUT_VIEW_PAGES_DELETE_TEMPLATE_TITLE');
                break;
            case LayoutViewConsts.TEMPLATE_APPLY_MODE:
                this.title = this.$translate.instant('LAYOUT_VIEW_PAGES_APPLY_TEMPLATE_TITLE');
                this.numPerPage = LayoutViewConsts.LAYOUT_PAGE_VERSION_TEMPLATE_RECORDS_REQUEST;
                this.startingIndex = 0;
                this.totalRecords = 0;
                this.offset = 0;
                this.limit = 0;
                this.firstRead = true;
                this.currentPage = null;
                this.channels = this.layoutView.getChannel();
                this.selectedTemplate = null;
                this.templates = null;
                this.templateSearch = null;
                this.templatePreviousSearch = null;                
                this.search = {
                    disabled: false,
                    templateSearch: (value)=>{
                        if(angular.isDefined(value)){
                            this.templateSearch = value;
                            this.loadTemplates();
                            return this.templateSearch;           
                        }
                        return this.templateSearch;                   
                    }
                };
                break;
        }

        this.moveOffers = false;
        this.hasPageVersionOffers = this.pageVersion.hasOffers();
        this.index = this.pageVersion.getPageNumber();
        this.pageId = this.pageVersion.getPageId();
        this.pageVersionId = this.pageVersion.getPageVersionId();
        this.pageUi = this.layoutView.getPageUi();
        this.channel = this.layoutView.getChannel().id;
    }

    hasGridVersionName() {
        if (this.name) {
            return true
        }
        return false;
    }
    hasPageNumber() {
        return this.index;
    }
    hasDuplicateIdentifiers() {
        const uniqueIds = this.pageUi.getPageVersionDetails();
        return uniqueIds.some(id => {
            //if name is null, ignore dup test
            if(this.name && id.name.toLowerCase() == this.name.toLowerCase() && id.index != this.index){
                return true;
            }
            return false;
        });
    }

    loadTemplates(){
        if(this.currentPage == 1 && this.templateSearch == this.templatePreviousSearch){
            return;
        }
        this.templatePreviousSearch = this.templateSearch;
        this.startingIndex = 0;
        this.firstRead = true;
        this.getTemplates();
    }

    getTemplates() {
        this.search.disabled = true;
        this.layoutView.getTemplates(this.templateSearch, this.channel, this.startingIndex, this.numPerPage).then((data) => {
            this.pageLayoutTemplates = data.data.pageLayoutTemplates;
            this.totalRecords = data.data.pageLayoutTemplateCount;
            this.startingIndex += this.numPerPage;
            this.search.disabled = false;
            if(this.firstRead){
                this.initPage(this.numPerPage);
                this.firstRead = false;
            }else{
                this.readNextPage();
            }
        });
    }
    initPage(numPerPage) {
        this.noOfPages = Math.ceil(this.totalRecords / numPerPage);
        this.currentPage = 1;
        this.setPage(numPerPage);
    }
    getNextPage(numPerPage) {
        if(this.currentPage < this.noOfPages){
            if(this.startingIndex <= this.totalRecords){ // starting index = # records on client
                this.getTemplates();
            }else{
                this.readNextPage(numPerPage);
            }
        }
    }
    readNextPage(numPerPage){
        this.templates = this.getPage( (this.currentPage) * numPerPage, numPerPage );
        this.currentPage++                        
    }
    getPreviousPage(numPerPage) {
        if(this.currentPage - 2 >= 0){
            this.templates = this.getPage( (this.currentPage - 2) * numPerPage, numPerPage );
            this.currentPage--
        }
    }
    setPage(numPerPage) {
        this.templates = this.getPage( (this.currentPage - 1) * numPerPage, numPerPage );
    }
    getPage(offset, numToRead) {
        this.offset = offset + 1;
        numToRead = parseInt(numToRead);
        var rec = offset + numToRead;
        this.limit = rec < this.totalRecords ? rec : this.totalRecords;
        return this.pageLayoutTemplates.slice( offset, offset + numToRead );
    }
    handleRadioClick(template){
        this.selectedTemplate = template.id;
        this.disabled = false;
    }        

    updatePageVersion() {
        switch (this.mode) {
            case LayoutViewConsts.EDIT_MODE:
                const originalPageGridVersion = angular.copy(this.pageGridVersion)
                if(!this.pageGridVersion.merchandiseHierarchyList){
                    this.pageGridVersion.merchandiseHierarchyList = {};  
                }

                this.pageGridVersion.pageHeight = this.h;
                this.pageGridVersion.pageWidth = this.w;
                this.pageGridVersion.name = this.name;
                if(this.isCoop && (this.isCoop != false || this.isCoop != 'false')){
                    this.isCoop = true;
                }else{
                    this.isCoop = false;
                }
                this.pageGridVersion.isCoop = this.isCoop;
                this.pageGridVersion.theme = this.theme;
                this.pageGridVersion.notes = this.notes;
                this.pageGridVersion.merchandiseHierarchyList.id = this.hierarchyId;
                this.layoutView.updatePageVersions(this.pageVersion.prepareForExportPageVersionUpdate(this.pageGridVersion, originalPageGridVersion));
                break;
            case LayoutViewConsts.DELETE_MODE:
                this.layoutView.deletePages(this.pageVersion.prepareForExportPageVersionDelete(this.pageId, this.moveOffers));
                break;
             case LayoutViewConsts.MOVE_OFFERS_MODE:
                this.layoutView.moveOffersToParkingLotGrid(this.pageVersionId);
                break;
            case LayoutViewConsts.TEMPLATE_APPLY_MODE:
                console.log(this.selectedTemplate)
                this.layoutView.applyTemplate(this.pageVersion.prepareForExportPageVersionApplyTemplate(this.selectedTemplate, this.pageVersionId));
                break;
            case LayoutViewConsts.TEMPLATE_CLEAR_MODE:
                this.layoutView.clearTemplate(this.pageVersion.prepareForExportPageVersionClearTemplate(this.pageVersionId, this.moveOffers));
                break;
        }
    }

    apply() {
        if (isNaN(parseFloat(this.h)) || !isFinite(this.h) || this.h < 1) {
            this.Notifier.error('LAYOUT_VIEW_PAGES_ERROR_HEIGHT_MISSING');
            return;
        }
        if (isNaN(parseFloat(this.w)) || !isFinite(this.w) || this.w < 1) {
            this.Notifier.error('LAYOUT_VIEW_PAGES_ERROR_WIDTH_MISSING');
            return;
        }
        // ensure grid version name is populated
        if (!this.hasGridVersionName()) {
            this.Notifier.error('LAYOUT_VIEW_PAGES_ERROR_MISSING_GRID');
            return;
        }
        if (this.hasDuplicateIdentifiers()) {
            this.Notifier.error('LAYOUT_VIEW_PAGES_ERROR_DUPLICATE_GRID');
            return;
        }
        this.updatePageVersion();
        this.$modalInstance.close();
    }

    dismiss() {
        this.$modalInstance.dismiss();
    }

}