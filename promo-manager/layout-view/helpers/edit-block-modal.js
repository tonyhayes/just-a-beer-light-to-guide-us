import blockmoveofferstobasketmodal from '../partials/block-move-offers-to-basket-modal.html!text';
import blockeditmodal from '../partials/block-edit-modal.html!text';
import LayoutViewConsts from '../layout-view-consts';

export class EditBlockModal {
    static open($scope, $modal, $translate, layoutView, block, pageVersion, mode) {
        this.layoutView = layoutView;
        this.block = block;
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
                template = blockeditmodal;
                break;
            case LayoutViewConsts.ADD_TO_BASKET_MODE:
                template = blockmoveofferstobasketmodal;
                break;
        }

        const {
            result, close, dismiss
        } = $modal.open({
            template: template,
            controllerAs: 'ctrl',
            controller: EditBlockController,
            resolve: {
                layoutView: () => {
                    return this.layoutView;
                },
                block: () => {
                    return this.block;
                },
                pageVersion: () => {
                    return this.pageVersion;
                },
                mode: () => {
                    return this.mode;
                },
                data: () => {
                    if (this.mode == LayoutViewConsts.EDIT_MODE) {
                        return this.layoutView.loadBlock(this.block.id)
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
export class EditBlockController {
    constructor($scope, $modalInstance, $translate, layoutView, block, pageVersion, mode, data) {
        this.layoutView = layoutView;
        this.$modalInstance = $modalInstance;
        this.$translate = $translate;
        this.Notifier = this.layoutView.Notifier;
        this.blockVersion = block;
        this.pageVersion = pageVersion;
        this.mode = mode;
        this.title = null;
        this.name = this.blockVersion.name || null;
        this.disabled = true;
        this.dateFormat = LayoutViewConsts.LAYOUT_VIEW_DATE_FORMAT;
        switch (this.mode) {
            case LayoutViewConsts.EDIT_MODE:
                this.title = this.$translate.instant('LAYOUT_VIEW_BLOCK_EDIT_TITLE');
                this.block = data.data.block;
                this.userDefinedName = this.block.userDefinedName || null;
                this.isCoop = this.block.isCoop || 0;
                this.theme = this.block.theme || null;
                this.color = this.block.color || null;
                this.hierarchyId = this.block.merchandiseHierarchy  ? this.block.merchandiseHierarchy.id : this.layoutView.merchandiseHierarchy.getRootId();
                this.merchandiseHierarchy = this.layoutView.merchandiseHierarchy
                this.merchandiseHierarchySelectionLabels = [
                    $translate.instant('OFFERS_LIST_ALL_SBUS'),  
                    $translate.instant('OFFERS_LIST_ALL_DEPARTMENTS'), 
                    $translate.instant('OFFERS_LIST_ALL_CATEGORIES')
                ];
                break;
            case LayoutViewConsts.ADD_TO_BASKET_MODE:
                this.title = this.$translate.instant('LAYOUT_VIEW_ADD_TO_BASKET');
                break;
        }

    }


    updateBlock() {
        switch (this.mode) {
             case LayoutViewConsts.EDIT_MODE:
                if(!this.block.merchandiseHierarchy){
                    this.block.merchandiseHierarchy = {
                        id: 1
                    };  
                }
                const originalBlock = angular.copy(this.block)

                if(this.isCoop && (this.isCoop != false || this.isCoop != 'false')){
                    this.isCoop = true;
                }
                this.block.isCoop = this.isCoop;
                this.block.theme = this.theme;
                this.block.color = this.color;
                this.block.userDefinedName = this.userDefinedName;
                this.block.merchandiseHierarchy.id = this.hierarchyId;
                this.layoutView.updateBlock(this.blockVersion.prepareForExportBlockList(this.block, originalBlock), this.pageVersion.id);
                break;
             case LayoutViewConsts.ADD_TO_BASKET_MODE:
//                this.layoutView.moveOffersToParkingLotGrid(this.blockId);
                break;
        }
    }

    apply() {
        this.updateBlock();
        this.$modalInstance.close();
    }

    dismiss() {
        this.$modalInstance.dismiss();
    }

}