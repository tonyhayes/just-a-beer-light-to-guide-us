import getLayoutVersion from './data/getLayoutVersion.json!json';
import loadLayout from './data/loadLayout.json!json';
import loadtemplate from './data/loadTemplate.json!json';
import clientVehicleVersionList from './data/vehicle.version.json.clientVehicleVersionList.action!json'
import getMerchandiseHierarchySuccessResponse from './data/getMerchandiseHierarchySuccessResponse.json!json'
import channels from './data/promo.planning.getAllImplTypeChannels.action!json'
import gridVersionMap from './data/gridVersionMap.json!json'
import loadGridVersionBlock from './data/block.loadGridVersionBlock.json!json'
//import addedPageList from './data/addedPageList.json!json'
export
default
function layoutViewMockResponse($q) {
    let interceptor = {};
    let page = {};
    let k = 288;
    let j = 500;
    let r = 7;
    interceptor.request = function(config) {
        page = config.data;
        return config;
    };
    interceptor.response = function(response) {
        let url = response.config.url;
        if (url.includes('getLayoutVersion')) {
            response = getLayoutVersion;
        } else if (url.includes('loadLayout')) {
            response = loadLayout;
        } else if (url.includes('getMerchandiseHierarchy')) {
            response = getMerchandiseHierarchySuccessResponse;
        } else if (url.includes('getAllImplTypeChannels')) {
            response = channels;
        } else if (url.includes('loadTemplates')) {
            response = loadtemplate;
        } else if (url.includes('loadGridVersionBlock')) {
            response = loadGridVersionBlock;
        } else if (url.includes('updatePages')) {
            console.log(page);
            response = {
                "data":{
                    "data": {
                        updatedPageIdList: [{
                            id: page.layoutPageList[0].id,
                            x: page.layoutPageList[0].x,
                            y: page.layoutPageList[0].y,
                            z: page.layoutPageList[0].z
                        }]
                    }
                }
            };
        } else if (url.includes('loadPageGridVersion')) {
            console.log(page);
            response = {
                "data":{
                    "data": {
                        pageGridVersion: {
                            id: page.pageGridVersion,
                            name: 'test page version load',
                            description: 'test page version load',
                            pageWidth: 8.5,
                            pageHeight: 11,
                            unit: 1,
                            isCoop: true,
                            pageTypeCode: 'big splashy page',
                            plannedBy: 'alfred',
                            theme: 'alfred',
                            notes: 'alfred has made notes',
                            merchandiseHierarchyList: {
                                id: 384
                            }
                        }
                    }
                }
            };
        } else if (url.includes('updatePageGridVersions')) {
            console.log(page);
            response = {
                "data":{
                    "data": {
                        updatedPageGridVersionIdList: [{
                            id: page.pageGridVersionList[0].id
                        }]
                    }
                }
            };
        } else if (url.includes('updateGridVersionBlocks')) {
            console.log(page);
            response = {
                "data":{
                    "data": {
                        updatedBlockIdList: [{
                            id: page.blockList[0].id
                        }]
                    }
                }
            };
        } else if (url.includes('clearTemplates')) {
            console.log(page);
            response = {
                "data":{
                    "data": {
                        updatedPageGridVersionIdList: [{
                            id: page.pageGridVersionList[0].id
                        }]
                    }
                }
            };
        } else if (url.includes('applyTemplates')) {
            console.log(page);
            response = {
                "data":{
                    "data": {
                        updatedPageGridVersionIdList: [{
                            id: page.pageGridVersionList[0].id
                        }]
                    }
                }
            };
        } else if (url.includes('moveOffersToParkingLot')) {
            console.log(page);
            response = {
                "data":{
                    "data": {
                        updatedPageGridVersionIdList: [{
                            id: page.pageGridVersionList[0].id
                        }]
                    }
                }
            };
        } else if (url.includes('addPagesToLayout')) {
            console.log(page);
            const pageList = [];
            page.layout.pageList.forEach(p => {
                pageList.push({
                    id: k++,
                    position: p.position,
                    x: p.x,
                    y: p.y,
                    z: p.z
                })
            });
            response = {
                "data":{
                    "data": {
                        addedPageList: pageList
                    }
                }
            };
        } else if (url.includes('getPageVersion')) {
            console.log(page);
            const pageList = [];
            page.layoutPageList.forEach(p => {
                pageList[p.id] = {
                    "blockGroupMap": {},
                    "description": "G1",
                    "id": j++,
                    "merchandiseHierarchyList": [],
                    "name": "Page " + r++,
                    "pageHeight": 11,
                    "pageWidth": 8.5,
                    "unit": 1,
                    "versionMarketIdList": [
                        1086,
                        1087,
                        1088,
                        1089,
                        1090,
                        1091,
                        1092,
                        1093,
                        1094,
                        1095
                    ]

                }
            });
            response = {
                "data":{
                    "data": {
                        gridVersionMap: pageList
                    }
                }
            };
        } else if (url.includes('haveChangeRequestAssociations')) {
            console.log(page);
            response = {
                "data":{
                    "data": {
                        haveChangeRequestAssociations: false
                    }
                }
            };
        } else if (url.includes('removePages')) {
            console.log(page);
            response = {
                "data":{
                    "data": {
                        deletedPageIdList: [268]
                    }
                }
            };
        } else if (url.includes('clientVehicleVersionList')) {
            response = clientVehicleVersionList;
        }
        return response;
    };
    return interceptor;

}
layoutViewMockResponse.$inject = ['$q'];