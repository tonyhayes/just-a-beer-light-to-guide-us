import itemsearch from '../partials/itemsearch.html!text';
import LayoutViewConsts from '../layout-view/layout-view-consts';
import LayoutVersionFormatter from '../layout-view/helpers/layout-version-formatter';
export class ItemSearch {
	static open($scope, $modal, $translate, layoutView) {
        this.layoutView = layoutView;

	  	const updateModel = function updateModel(result){
	  		console.log(result);
	  	}
 	  	const {result, close, dismiss} = $modal.open({
		    template: itemsearch,
		    controllerAs: 'ctrl',
		    controller: ItemSearchController,
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
export class ItemSearchController {
    constructor($scope, $modalInstance, $translate, layoutView) {
        this.layoutView = layoutView;
        this.$modalInstance = $modalInstance;
        this.Notifier = this.layoutView.Notifier;
        this.itemSelections = [];
        this.itemTree = [];
        this.itemSelectionTree = this.layoutView.merchandiseHierarchy;
        this.hierarchyId = this.layoutView.merchandiseHierarchy.getRootId();
        this.rootId = this.layoutView.merchandiseHierarchy.getRootId();
        this.defaultLabels = [
            $translate.instant('OFFERS_LIST_SBU'),  
            $translate.instant('OFFERS_LIST_DEPARTMENT'), 
            $translate.instant('OFFERS_LIST_CATEGORY')
        ];
        this.itemTreeLabel = $translate.instant('ITEM_SEARCH_TREE_LABEL');
        this.itemSearch = {};
        this.search = {
            itemSearch:{}
        };
        this.defaultLabels.forEach((label, idx)=>{
            this.itemSearch[idx] = '';
            this.search.itemSearch[idx] = (value)=>{
                    if(angular.isDefined(value)){
                        return this.itemQuery(idx, value);           
                    }
                    return this.itemSearch[idx];                   
                };
        });
        this.init(); 
	}

    itemQuery(idx, value){
        this.itemSearch[idx] = value;
        this.loadItems();
        return this.itemSearch[idx];           
    }

    loadItems(){
        const items = $.map(this.itemSearch, (value, index) => {
                        return [value];
                    });
        let error = false;
        for (let i = items.length - 1; i >= 0; i--) {
            const currentItem = items[i];
            if(i>0 && currentItem){
                if(!items[i-1]){
                    this.Notifier.error('ITEM_SEARCH_MISSING_SEARCH_PARM');
                    error = true;
                    return;                    
                }
            }
        };
        if(error){
            return;
        }
        this.searchItems(items);
    }

    searchItems(items){
        this.itemTree[0].nodes.forEach(node => {
            if(node.nodes){
                this.delete(node);
            }
            if(items[0] && items[0] == node.id){
                this.open(node);
                if(items[1]){
                    node.nodes.some(nd =>{
                        if(nd.id == items[1]){
                            this.open(nd);
                            if(items[2]){
                                nd.nodes.forEach(n=>{
                                    if(n.id == items[2]){
                                        //this is the selected item level
                                        // do something here to indicate we found it
                                        n.searched = true;
                                    }else{
                                        n.searched = false;
                                    }
                                });
                            }
                            return true;
                        }
                        return false;
                    });
                }
            }
        });
    }

    delete(data) {
        data.nodes = [];
    }

    add(name, nodes) {
        this.itemTree.push({name: name, nodes: nodes});
    }

    init() {
        let node = this.itemSelectionTree.getNode(this.hierarchyId);
        if(node){
            const path = node.getPath();
            // Root parent
            const parentNode = this.itemSelectionTree.getRootNode();
            const options = parentNode.getChildren();
            this.add(this.itemTreeLabel, options);
       }
    }

    open(data) {
        let node = this.itemSelectionTree.getNode(data.id);
        if(node){
            const path = node.getPath();
            // Defined parent
            const parentNode = path.pop();
            const options = parentNode.getChildren();
            data.nodes = options;
       }
    }

    itemSelection(item){
        const selection = this.formatSelectedItem(item);
        if(this.hasSelectedItem(selection)){
            this.Notifier.error('ITEM_SEARCH_SELECTED_ITEMS_DUPLICATE_ERROR');
            return;
        }
        this.itemSelections.push(selection);               
    }

    formatSelectedItem(item){
        let selection = {
            ids: new Array(this.defaultLabels.length),
            name: null
        }
        const node = this.itemSelectionTree.getNode(item.id);
        const path = node.getPath();
        path.forEach( (el, idx) => {
            selection.ids[idx] = el.id;
            selection.name = el.name;
        });
        return selection;
    }

    hasSelectedItem(selection){
        return this.itemSelections.some(selected => {
            return JSON.stringify(selected.ids) == JSON.stringify(selection.ids);
        });
    }

    isSelectedItem(item){
        if(item && item.id){
            return this.hasSelectedItem(this.formatSelectedItem(item));
        }
    }

    openSelection(item){
        this.searchItems(item.ids);
    }

    deleteSelection(item){
        this.itemSelections = this.itemSelections
                .filter( el => {
                    return JSON.stringify(el.ids) !== JSON.stringify(item.ids);
                    });
    }

    close(){
        this.$modalInstance.close();
    }

    dismiss(){
        this.$modalInstance.dismiss();
    }

}	