import pageindex from '../partials/page-index-modal.html!text';
import LayoutViewConsts from '../layout-view-consts';
export class IndexPagesModal {
	static open($scope, $modal, $translate, layoutView) {
        this.layoutView = layoutView;

	  	const updateModel = function updateModel(result){
	  		console.log(result);
	  	}

 	  	const {result, close, dismiss} = $modal.open({
		    template: pageindex,
		    controllerAs: 'ctrl',
		    controller: IndexPagesController,
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
export class IndexPagesController {
    constructor($scope, $modalInstance, $translate, layoutView) {
        this.layoutView = layoutView;
        this.$modalInstance = $modalInstance;
        this.Notifier = this.layoutView.Notifier;
        this.pageUi = this.layoutView.getPageUi();
        this.grid = this.pageUi.getPageVersionDetails();
        this.pageExporter = this.layoutView.layoutModel;
	}
   
    hasPageVersionName(){
        return this.grid.every(pageVersion => {
            return pageVersion.name;
        });
    }
    invalidePageData(){
        //it should find itself, but only once
       const seenIndexMap = {};
       const seenNameMap  = {};
       for(let pageVersion of this.grid) {
           let pageVersionIndex = pageVersion.index;
           let pageVersionName = pageVersion.name;
           // ignore if name is null
           if(seenIndexMap[pageVersionIndex] || (pageVersionName && seenNameMap[pageVersionName])) {
               // Saw a duplicate - fail validation immediately
               return true;
           }
           // Keep track of what we've seen before
           seenIndexMap[pageVersionIndex] = true;
           seenNameMap[pageVersionName] = true;
       }
       // None failed validation, so all of them have been seen exactly once
       return false
   }

    orderPages(){
        this.layoutView.updatePages(this.pageExporter.prepareForExportPagesUpdate(this.grid));
    }

    apply(){
        // ensure grid version name is populated
        if(!this.hasPageVersionName()){
            this.Notifier.error('LAYOUT_VIEW_PAGES_ERROR_MISSING_GRID');
            return;            
        }
        if(this.invalidePageData()){
            this.Notifier.error('LAYOUT_VIEW_PAGES_ERROR_DUPLICATE_PAGE');
            return;            
        }
        this.orderPages();
        this.$modalInstance.close();
    }

    dismiss(){
        this.$modalInstance.dismiss();
    }

}	