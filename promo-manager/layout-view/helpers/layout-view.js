import VehicleVersion from '../vehicle-version';
import LayoutModel from '../layout-model';
import PageVersion from '../page-version';
import PageUi from './page-ui';
import MarketToPageVersionIdManager from '../market-to-page-versionId-manager';
import TreeMap from '../../../helpers/tree-map';
import Notifier from '../../../helpers/notifier';
import Util from 'helpers/util';

export
default class LayoutView {
    constructor($q, API, viewport, layoutViewCamera, context, $translate) {
        this.done = false;
        this.API = API;
        this.Notifier = new Notifier($translate);
        this.$translate = $translate;
        this.vehicleId = context.vehicleId;
        this.vehicleVersions = null; // VehicleVersions[]
        this.selectedVehicleVersion = null; // VehicleVersion
        this.selectedLayoutVersionIndex = 0;
        this.selectedLayoutVersionId = null;
        this.viewport = viewport;
        this.layoutViewCamera = layoutViewCamera;
        this.$q = $q;
        this.context = context;

        this.getLayout();
    }

    initLayout(){

    }

    getLayout() {
        this.loadVehicleVersions(this.vehicleId).then(() => {
            this.loadLayoutModel().then(() => {
                this.loadLayoutPageVersions().then(() => {
                    this.loadMerchandiseHierarchies().then(()=>{
                        this.done = true;
                    });
                });
            });
        }).then(null, (...args) => {
            this.reportProblems(...args);
        });

    }
    getPageUi() {
        return this.pageUi;
    }
    getNewLayoutVersionForVehicle(selectedLayoutVersionId) {
        if(!selectedLayoutVersionId){
            return;
        }
        angular.forEach(this.vehicleVersions, (version, k) => {
            if (version.id == selectedLayoutVersionId) {
                this.selectedVehicleVersion = version; // VehicleVersion
                this.selectedLayoutVersionIndex = 0; // reset to first layout version
            }
        });
        this.getLayout();
    }
    getNewLayoutVersion(selectedLayoutVersionId) {
        if(!selectedLayoutVersionId){
            return;
        }
        this.selectedLayoutVersionId = selectedLayoutVersionId;
        this.selectedLayoutVersionIndex = this.layoutModel.getLayoutVersionIndex(selectedLayoutVersionId);
        this.loadLayoutPageVersions();
    }

    loadVehicleVersions() {
        if (this.vehicleVersions) {
            return this.$q.when(this.vehicleVersions);
        }
        const promise = this.API.PromoManager.Common.getVehicleVersionList(this.vehicleId)
            .then(result => {
                this.vehicleVersions = result.data.data.map(vehicleVersion => {
                    return new VehicleVersion(vehicleVersion);
                });
                // Data constraint: vehicleVersions.length > 0
                this.selectedVehicleVersion = angular.copy(this.vehicleVersions[0]);
             }, reason => {
                 this.Notifier.warn(this.$translate.instant('LAYOUT_VIEW_DATA_ERROR_PAGE_VERSION'));
            });
        return promise;

    }

    loadLayoutModel() {
        this.pageUi = null;
        this.pageVersions = new Map(); // Map<pageVersionId, PageVersion> 
        this.layoutModel = null;
        this.marketToPageVersionIdManager = new MarketToPageVersionIdManager(); // MarketToPageVersionIdManager (Map<marketId,Set<pageVersionId>>)
        const promise = this.API.PromoManager.LayoutView.getLayout(this.selectedVehicleVersion.id)
            .then(result => {
                this.layoutModel = new LayoutModel(result.data.data.layout);
                this.selectedLayoutVersionId = this.layoutModel.getLayoutVersionIdList()[0];
            }, reason => {
                this.Notifier.warn(this.$translate.instant('LAYOUT_VIEW_DATA_ERROR_PAGE_LAYOUT'));
            });
        return promise;

    }

    loadLayoutPageVersions() {
        // FIXME
        // verify ASSERT that version numbers in layout.layoutsVersionMap is [0...n-1]
        // i.e. CONTIGUOUS, otherwise we need a way to specify a default selection
        // layout-view/layout.getLayoutVersion.action
        const layoutId = this.layoutModel.id;
        const layoutMarketsList = this.layoutModel.getMarketsByIndex(this.selectedLayoutVersionIndex);
        const list = [];
        if(layoutMarketsList.length){
            layoutMarketsList.forEach(market => {
                list.push({id: market});
            });
        }
        const promise = this.API.PromoManager.LayoutView.getLayoutVersion(layoutId, list)
            .then(result => {
                const gridVersionMap = result.data.data.gridVersionMap;
                this.pageBuider(gridVersionMap);
            }, reason => {
                this.Notifier.warn(this.$translate.instant('LAYOUT_VIEW_DATA_ERROR_PAGE_LAYOUT_VERSION'));
            });

        return promise;
    }
    updatePages(page) {
        if(!page){
            return;
        }
        const promise = this.API.PromoManager.LayoutView.updatePages(page)
            .then(result => {
                const updatedPageList = result.data.data.updatedPageIdList[0];
                const updatePageList = page.layoutPageList[0];
                if (updatedPageList != updatePageList.id) {
                    this.Notifier.warn(this.$translate.instant('LAYOUT_VIEW_DATA_ERROR_PAGE_UPDATE'));
                }
                this.getLayout();
            }, reason => {
                this.Notifier.warn(this.$translate.instant('LAYOUT_VIEW_DATA_ERROR_PAGE_UPDATE_ERROR'));
                this.getLayout();
            });
        return promise;
    }


    addPages(id, pages) {
        const promise = this.API.PromoManager.LayoutView.addPages(id, pages)
            .then(result => {
                this.addPagesToLayout(result.data.data.addedPageList);
            }, reason => {
                this.Notifier.warn(this.$translate.instant('LAYOUT_VIEW_DATA_ERROR_PAGE_UPDATE_ERROR'));
                this.getLayout();
            });
        return promise;
    }
    deletePages(pages) {
        if(!pages){
            return;
        }
        const promise = this.API.PromoManager.LayoutView.removePages(pages)
            .then(result => {
                this.getLayout();
            }, reason => {
                this.Notifier.warn(this.$translate.instant('LAYOUT_VIEW_DATA_ERROR_PAGE_DELETE_ERROR'));
                this.getLayout();
            });
        return promise;
    }
    clearTemplate(pages) {
        if(!pages){
            return;
        }
        const promise = this.API.PromoManager.LayoutView.clearTemplates(pages)
            .then(result => {
                    this.getPagesForVersions(result.data.data.updatedPageGridVersionIdList);
            }, reason => {
                this.Notifier.warn(this.$translate.instant('LAYOUT_VIEW_DATA_ERROR_PAGE_CLEAR_TEMPLATE_ERROR'));
                this.getLayout();
            });
        return promise;
    }
    applyTemplate(pages) {
        if(!pages){
            return;
        }
        const promise = this.API.PromoManager.LayoutView.applyTemplate(pages)
            .then(result => {
                    this.getPagesForVersions(result.data.data.updatedPageGridVersionIdList);
            }, reason => {
                this.Notifier.warn(this.$translate.instant('LAYOUT_VIEW_DATA_ERROR_PAGE_CLEAR_TEMPLATE_ERROR'));
                this.getLayout();
            });
        return promise;
    }
    updatePageVersions(pages) {
        if(!pages){
            return;
        }
        const promise = this.API.PromoManager.LayoutView.updatePageGridVersions(pages)
            .then(result => {
                this.getPagesForVersions(result.data.data.updatedPageGridVersionIdList);
            }, reason => {
                this.Notifier.warn(this.$translate.instant('LAYOUT_VIEW_DATA_ERROR_PAGE_VERSION_UPDATE_ERROR'));
                this.getLayout();
            });
        return promise;            
    }
    loadPageVersion(pageVersionId) {
        const promise = this.API.PromoManager.LayoutView.loadPageGridVersion(pageVersionId)
            .then(result => {
                return result.data;
            }, reason => {
                this.Notifier.warn(this.$translate.instant('LAYOUT_VIEW_DATA_ERROR_PAGE_VERSION_LOAD_ERROR'));
                this.getLayout();
            });
        return promise;
    }
    updateBlock(blocks, pageVersionId) {
        if(!blocks){
            return;
        }
        const promise = this.API.PromoManager.LayoutView.updateGridVersionBlocks(blocks)
            .then(result => {
                //load the revised page
                this.getPagesForVersions([{id: pageVersionId}]);
            }, reason => {
                this.Notifier.warn(this.$translate.instant('LAYOUT_VIEW_DATA_ERROR_BLOCK_UPDATE_ERROR'));
                this.getLayout();
            });
        return promise;            
    }
    loadBlock(blockId) {
        const promise = this.API.PromoManager.LayoutView.loadGridVersionBlock(blockId)
            .then(result => {
                return result.data;
            }, reason => {
                this.Notifier.warn(this.$translate.instant('LAYOUT_VIEW_DATA_ERROR_BLOCK_LOAD_ERROR'));
                this.getLayout();
            });
        return promise;
    }
    getChannels() {
        const promise = this.API.PromoManager.Common.getChannelList()
            .then(result => {
                return result.data;
            }, reason => {
                this.Notifier.warn(this.$translate.instant('DATA_ERROR_CHANNEL_LOAD_ERROR'));
            });
        return promise;
    }

    loadMerchandiseHierarchies() {
        if (this.merchandiseHierarchy) {
            return this.$q.when(this.merchandiseHierarchy);
        }
        const promise = this.API.Common.getMerchandiseHierarchy({
                filter: {
                    excludeDeleted: true,
                    currentUserOnly: true
                }
            })
            .then(result => {
                const hm = result.data.data.merchandiseHierarchy;
                const rt = result.data.data.merchandiseHierarchyRootId;
                const sl = result.data.data.showLevels.sort();
                const df = result.data.data.displayFormat;

                this.merchandiseHierarchy = new TreeMap(hm, rt, (node) => {
                    return (Util.binarySearch(sl, node.level) < 0);
                }, (a, b) => {
                    return (a.name).localeCompare(b.name);
                });

                this.merchandiseHierarchy.displayFormat = df;
                this.merchandiseHierarchy.showLevels = sl;

                this.hierarchyId = this.merchandiseHierarchy.getRootId();
            }, reason => {
                this.Notifier.warn(this.$translate.instant('MERCHANDISE_HIERARCHY_MAP_LOAD_ERROR'));
            });
        return promise;
    }

    pageBuider(gridVersionMap) {
        const pageList = this.layoutModel.pageList;
        this.viewport.clearRtreeObjects();
        const gridVersions = []
        for (const pageId in gridVersionMap) {
            pageList.forEach(page => {
                if (page.id == pageId) {
                    gridVersions[page.id] = page;
                }
            });

            const pageVersion = new PageVersion(gridVersionMap[pageId], gridVersions[pageId]);
            this.pageVersions.set(pageVersion.id, pageVersion);
            this.marketToPageVersionIdManager.add(pageVersion);
            // FIXME: Think about how world coordinates for spread groups
            // will be handled - the depedencies might not necessarily
            // be loaded in order - perhaps a second pass after all
            // PageVersion objects have been created might be in order...
        }
        // Initialize the camera coordinates for all PageVersion entities
        this.pageUi = new PageUi(
            this.selectedLayoutVersionIndex,
            this.layoutModel,
            this.marketToPageVersionIdManager,
            this.pageVersions,
            this.viewport
        );
        this.pageUi.updateWorldSpaceCoordinates(this.layoutViewCamera);
        this.viewport.insertRtreeObjects(this.pageUi.getPageVersionsForSelectedLayoutVersion());
    }


    hasHierarchy(obj, filter) {

        if (obj.pageVersion && obj.pageVersion.blockList && obj.pageVersion.blockList.length) {
            return obj.pageVersion.blockList.some(this.blockContainsHierarchy, [this, filter]);
        } else if (obj.blockList && obj.blockList.length) {
            return obj.blockList.some(this.blockContainsHierarchy, [this, filter]);
        } else {
            return this.containsHierarchy(obj, filter);
        }
    }

    blockContainsHierarchy(block, index, array) {
        const self = this[0];
        const filter = this[1];
        return self.containsHierarchy(block, filter);
    }

    containsHierarchy(obj, filter) {
        let has = false;
        if (obj.offerVersion && obj.offerVersion.hierarchyId > 1) {
            has = this.hierarchyTreeSearch(obj.offerVersion.hierarchyId, filter);
        }
        if (!has && obj.hierarchyId && obj.hierarchyId > 1) {
            has = this.hierarchyTreeSearch(obj.hierarchyId, filter);
        }
        return has;
    }

    hierarchyTreeSearch(hierarchyId, filter) {
        const node = this.merchandiseHierarchy.getNode(hierarchyId);
        const filterNode = this.merchandiseHierarchy.getNode(filter);
        const path = node.getPath();
        let found = false
        angular.forEach(path, (treeNode, i) => {
            if (treeNode.level == filterNode.level && filter == treeNode.id) {
                found = true;
            }
        });
        return found;
    }
    getPagesInViewport() {
        const cameraToWorldMat4 = this.layoutViewCamera.getInverse();
        const vp = $('#layout-viewport');
        const pages = this.viewport.getPagesInViewport(cameraToWorldMat4, vp);
        return pages;
    }
    getViewport() {
        const cameraToWorldMat4 = this.layoutViewCamera.getInverse();
        const viewport = $('#layout-viewport');
        return this.viewport.getViewport(cameraToWorldMat4, viewport);
    }
    getLayoutModel() {
        return this.layoutModel;
    }
    getMarketIdList() {
        return this.layoutModel.getMarketsByIndex(this.selectedLayoutVersionIndex);
    }
    addPagesToLayout(pages) {
        pages.forEach(page => {
            this.layoutModel.addPageToLayout(page);
        });
        this.getPageVersions(pages);
    }
    getPagesForVersions(pageVersionList) {
        const layoutPageList = [];
        pageVersionList.forEach(pageVersionId => {
            const pvId = angular.isObject(pageVersionId) ? pageVersionId.id :pageVersionId;
            const page = this.pageUi.getPageVersionDetailsForVersionId(pvId);
            layoutPageList.push(page);
        });
        this.getPageVersions(layoutPageList)

    }
    getPageVersions(pages) {
        const layoutPageList = [];
        const marketIdList = [];
        const markets = this.getMarketIdList();
        markets.forEach(market => {
            marketIdList.push({
                id: market
            });
        });
        pages.forEach(page => {
            layoutPageList.push({
                id: page.id,
            });
        });

        const promise = this.API.PromoManager.LayoutView.getPageVersion(layoutPageList, marketIdList)
            .then(result => {
                this.pageBuider(result.data.data.gridVersionMap);
            },reason => {
                this.Notifier.warn(this.$translate.instant('LAYOUT_VIEW_DATA_ERROR_PAGE_VERSION_GET_ERROR'));
                this.getLayout();
            });
        return promise;
    }
    haveChangeRequestAssociations(id) {
        const layoutPageList = [{
                    id: id
                }]
        const promise = this.API.PromoManager.LayoutView.haveChangeRequestAssociations(layoutPageList)
            .then(result => {
                return result.data;
            }, reason => {
                this.Notifier.warn(this.$translate.instant('LAYOUT_VIEW_DATA_ERROR_PAGE_HAS_CHANGE_ASSOCIATIONS_ERROR'));
            });
        return promise;
    }
    haveChangeRequestAssociationsGrid(id) {
        const pageGridVersionList = [{
                    id: id
                }]
        const promise = this.API.PromoManager.LayoutView.haveChangeRequestAssociationsGrid(pageGridVersionList)
            .then(result => {
                return result.data;
            }, reason => {
                this.Notifier.warn(this.$translate.instant('LAYOUT_VIEW_DATA_ERROR_PAGE_HAS_CHANGE_ASSOCIATIONS_GRID_ERROR'));
            });
        return promise;
    }
    haveOffers(id) {
        const layoutPageList = [{
                    id: id
                }]
        const promise = this.API.PromoManager.LayoutView.haveOffers(layoutPageList)
            .then(result => {
                return result.data;
            }, reason => {
                this.Notifier.warn(this.$translate.instant('LAYOUT_VIEW_DATA_ERROR_PAGE_HAS_OFFERS_ERROR'));
            });
        return promise;
    }
    haveOffersGrid(id) {
        const pageGridVersionList = [{
                    id: id
                }]
        const promise = this.API.PromoManager.LayoutView.haveOffersGrid(pageGridVersionList)
            .then(result => {
                return result.data;
            }, reason => {
                this.Notifier.warn(this.$translate.instant('LAYOUT_VIEW_DATA_ERROR_PAGE_HAS_OFFERS_GRID_ERROR'));
            });
        return promise;
    }
    moveOffersToParkingLot(id) {
        const layoutPageList = [{
                    id: id
                }]
        const promise = this.API.PromoManager.LayoutView.moveOffersToParkingLot(layoutPageList)
            .then(result => {
                return result.data;
            },reason => {
                this.Notifier.warn(this.$translate.instant('LAYOUT_VIEW_DATA_ERROR_PAGE_MOVE_OFFERS_TO_PARKING_LOT_ERROR'));
            });
        return promise;
    }
    moveOffersToParkingLotGrid(id) {
        const pageGridVersionList = [{
                    id: id
                }]
        const promise = this.API.PromoManager.LayoutView.moveOffersToParkingLotGrid(pageGridVersionList)
            .then(result => {
                    this.getPagesForVersions(result.data.data.updatedPageGridVersionIdList);
            }, reason => {
                this.Notifier.warn(this.$translate.instant('LAYOUT_VIEW_DATA_ERROR_PAGE_MOVE_OFFERS_TO_PARKING_LOT_GRID_ERROR'));
            });
        return promise;
    }
    getTemplates(templateNameSearchString, channel, startingIndex, limit) {
        let qry={};
        qry.startingIndex = startingIndex || 0;
        qry.limit = limit || null;
        qry.channel = channel || this.getChannel();
        qry.templateNameSearchString = templateNameSearchString || null;
        const promise = this.API.PromoManager.LayoutView.loadTemplates(qry)
            .then(result => {
                return result.data;
            }, reason => {
                this.Notifier.warn(this.$translate.instant('DATA_ERROR_TEMPLATE_LOAD_ERROR'));
            });
        return promise;
    }

    getChannel(){
        return {id: this.layoutModel.getChannel(), name: this.context.channelCode};
    }
    reportProblems(reason) {
        console.log(reason);
    }

}