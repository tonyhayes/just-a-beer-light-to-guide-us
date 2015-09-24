import pageadd from '../partials/page-add-modal.html!text';
import LayoutViewConsts from '../layout-view-consts';
import LayoutModel from '../layout-model';
export class AddPagesModal {
	static open($scope, $modal, $translate, layoutView) {
        this.layoutView = layoutView;

	  	const updateModel = function updateModel(result){
	  		console.log(result);
	  	}

 	  	const {result, close, dismiss} = $modal.open({
		    template: pageadd,
		    controllerAs: 'ctrl',
		    controller: AddPagesController,
            resolve: {
                layoutView:  () => {
                    return this.layoutView;
                }
            }
		});
	  	result.then((data) => {
        	updateModel(data);
		}, (data) => {
			console.log("dismiss: ",data)
		});
  	}

}
export class AddPagesController {
    constructor($scope, $modalInstance, $translate, layoutView) {
        this.layoutView = layoutView;
        this.$modalInstance = $modalInstance;
        this.Notifier = this.layoutView.Notifier;
        this.h = LayoutViewConsts.LAYOUT_VIEW_PAGE_GRID_VERSION_HEIGHT_DEFAULT;
        this.w = LayoutViewConsts.LAYOUT_VIEW_PAGE_GRID_VERSION_WIDTH_DEFAULT;
    	this.count = 1;
    	this.previousCount = 1;
        this.pageUi = this.layoutView.getPageUi();
        this.lastPageNumber = this.pageUi.getLastPageNumber() + 1;
    	this.pagePrefix = $translate.instant('LAYOUT_VIEW_PAGE_GRID_VERSION_NAME_DEFAULT')
    	this.grid = [{
			index: this.lastPageNumber, 
			pageVersionName: this.pagePrefix + ' ' + this.lastPageNumber 
    	}];
        this.pageExporter = this.layoutView.layoutModel;
	}

    createGrid() {
        if(!this.count){
            return;
        }
        if(isNaN(parseFloat(this.count)) || !isFinite(this.count)){
            this.Notifier.error('LAYOUT_VIEW_PAGES_ERROR_INVALID_PAGE');
            this.count = angular.copy(this.previousCount);
            return;
        }
        if(this.previousCount != this.count){
            if(this.previousCount < this.count){
                for (let i = parseInt(this.previousCount); i < this.count; i++) {
                    this.grid.push({index: this.lastPageNumber+i, pageVersionName: this.pagePrefix + ' ' + (this.lastPageNumber + i)})
                };
            }else{
                for (let i = this.previousCount - this.count; i > 0; i--) {
                    this.grid.pop();
                };
            }
        }
        this.previousCount = angular.copy(this.count);
    }
    
    hasPageVersionName(){
        return this.grid.every(pageVersion => {
            return pageVersion.pageVersionName;
        });
    }
    invalidPageData(){
        const uniqueIds = this.pageUi.getPageVersionDetails();
        const seenIndexMap = {};
        const seenNameMap = {};
        uniqueIds.forEach(id => {
            seenIndexMap[id.index] = true; 
            seenNameMap[id.name] = true; 
        });
        for(let pageVersion of this.grid) {
            let pageVersionIndex = pageVersion.pageNumber;
            let pageVersionName = pageVersion.pageVersionName;
            if(seenIndexMap[pageVersionIndex] || (pageVersionName && seenNameMap[pageVersionName])) {
                // Saw a duplicate - fail validation immediately
                return true;
            }
        }
        // None failed validation, so all of them have been seen exactly once
        return false
    }

    createPages(){
        // get viewport top left x, y
        const viewport = this.layoutView.getViewport();
        const adderX = LayoutViewConsts.ADD_PAGE_X_OFFSET;
        const adderY = LayoutViewConsts.ADD_PAGE_Y_OFFSET;        
        const id = this.layoutView.getLayoutModel().id;
        const pageGrip = LayoutViewConsts.ADD_PAGE_Y_PAGE_GRIP_OFFSET;
        const layoutPage = [];
        let z = this.pageUi.getLastZindexNumber()+1;
        this.grid.forEach((page, index, array) => {
            const xPos = viewport[0] + (adderX * index);
            const yPos = viewport[1] + (adderY * index) + pageGrip;
            const zPos = z++;
            layoutPage.push(this.pageExporter.prepareForExportPageAdd(page, xPos, yPos, zPos, this.h, this.w, LayoutViewConsts.LAYOUT_VIEW_UNIT_DEFAULT));
        });
        this.layoutView.addPages(id, layoutPage);
    }

    apply(){
        if(isNaN(parseFloat(this.count)) || !isFinite(this.count) || this.count < 1){
            this.Notifier.error('LAYOUT_VIEW_PAGES_ERROR_INVALID_PAGE');
            return;
        }
        if(isNaN(parseFloat(this.h)) || !isFinite(this.h)|| this.h < 1){
            this.Notifier.error('LAYOUT_VIEW_PAGES_ERROR_HEIGHT_MISSING');
            return;
        }
        if(isNaN(parseFloat(this.w)) || !isFinite(this.w)|| this.w < 1){
            this.Notifier.error('LAYOUT_VIEW_PAGES_ERROR_WIDTH_MISSING');
            return;
        }
        // ensure grid version name is populated
        if(!this.hasPageVersionName()){
            this.Notifier.error('LAYOUT_VIEW_PAGES_ERROR_MISSING_GRID');
            return;            
        }
        if(this.invalidPageData()){
            this.Notifier.error('LAYOUT_VIEW_PAGES_ERROR_DUPLICATE_GRID');
            return;            
        }
        this.createPages();
        this.$modalInstance.close();
    }

    dismiss(){
        this.$modalInstance.dismiss();
    }
}	