export default function onConfig($provide) {

    $provide.decorator('API', $delegate => {
        var API = {
            PromoManager: {
                LayoutView: {},
            }
        };

        API.PromoManager.LayoutView.getLayoutVersion = function(layoutId, layoutMarketsList) {
            return $delegate.post('layout-view/layout.getLayoutVersion.action', {
                layout: {
                    id: layoutId
                },
                marketList: layoutMarketsList
            });
        };
        API.PromoManager.LayoutView.getLayout = function(vehicleId) {
            return $delegate.post('layout-view/layout.loadLayout.action', {
                vehicleVersion:{
                    id: vehicleId                    
                }
            });
        };
        API.PromoManager.LayoutView.addPages = function(layoutId, pageList) {
            return $delegate.post('layout-view/layout.addPagesToLayout.action', {
                layout: {
                    id: layoutId
                },
                pageList: pageList
            });
        };
        API.PromoManager.LayoutView.haveOffers = function(layoutPageList) {
            return $delegate.post('layout-view/page.haveOffers.action', {
                layoutPageList
            });
        };
        API.PromoManager.LayoutView.haveChangeRequestAssociations = function(layoutPageList) {
            return $delegate.post('layout-view/page.haveChangeRequestAssociations.action', {
                layoutPageList
            });
        };
        API.PromoManager.LayoutView.moveOffersToParkingLot = function(pageGridId) {
            return $delegate.post('layout-view/page.moveOffersToParkingLot.action', {
                layoutPageList: pageGridId
            });
        };
        API.PromoManager.LayoutView.removePages = function(pages) {
            return $delegate.post('layout-view/page.removePages.action', {
                layoutPageList: pages.layoutPageList,
                moveOffersToParkingLot: pages.moveOffersToParkingLot

            });
        };
        API.PromoManager.LayoutView.updatePages = function(pagelist) {
            const layoutPageList = pagelist.layoutPageList;
            return $delegate.post('layout-view/page.updatePages.action', {
                layoutPageList
            });
        };
        API.PromoManager.LayoutView.getPageVersion = function(layoutPageList, marketList) {
            return $delegate.post('layout-view/page.getPageVersion.action', {
                layoutPageList: layoutPageList,
                marketList: marketList
            });
        };
        API.PromoManager.LayoutView.loadPageGridVersion = function(pageVersionId) {
            return $delegate.post('layout-view/grid.loadPageGridVersion.action', {
                pageGridVersion: {
                    id: pageVersionId
                }
            });
        };
        API.PromoManager.LayoutView.updatePageGridVersions = function(pageGrid) {
            const pageGridVersionList = pageGrid.pageGridVersionList;
            return $delegate.post('layout-view/grid.updatePageGridVersions.action', {
                pageGridVersionList
            });
        };
        API.PromoManager.LayoutView.haveChangeRequestAssociationsGrid = function(pageGridId) {
            return $delegate.post('layout-view/grid.haveChangeRequestAssociations.action', {
                pageGridVersionList: pageGridId
            });
        };
        API.PromoManager.LayoutView.moveOffersToParkingLotGrid = function(pageGridId) {
            return $delegate.post('layout-view/grid.moveOffersToParkingLot.action', {
                pageGridVersionList: pageGridId
            });
        };
        API.PromoManager.LayoutView.clearTemplates = function(pageGrid) {
            return $delegate.post('layout-view/grid.clearTemplates.action', {
                pageGridVersionList: pageGrid.pageGridVersionList,
                moveOffersToParkingLot: pageGrid.moveOffersToParkingLot
            });
        };
        API.PromoManager.LayoutView.applyTemplate = function(pageGrid) {
            return $delegate.post('layout-view/grid.applyTemplate.action', {
                pageLayoutTemplate: pageGrid.pageLayoutTemplate,
                pageGridVersionList: pageGrid.pageGridVersionList,
                moveOffersToParkingLot: pageGrid.moveOffersToParkingLot
            });
        };
        API.PromoManager.LayoutView.loadTemplates = function(qry) {
            return $delegate.post('layout-view/pagetemplate.loadTemplates.action', {
                startingIndex: qry.startingIndex,
                limit: qry.limit,
                channel: {
                    id: qry.channel
                },
                templateNameSearchString: qry.templateNameSearchString

            });
        };
        API.PromoManager.LayoutView.loadGridVersionBlock = function(blockId) {
            return $delegate.post('layout-view/block.loadGridVersionBlock.action', {
                block: {
                    id: blockId
                }
            });
        };
        API.PromoManager.LayoutView.updateGridVersionBlocks = function(blockList) {
            return $delegate.post('layout-view/block.updateGridVersionBlocks.action', {
                blockList: blockList.blockList
            });
        };

        angular.element.extend(true, $delegate, API);
        return $delegate;
    });


}
onConfig.$inject = ['$provide'];