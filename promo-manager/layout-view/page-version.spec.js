import PageVersion from './page-version';
import Page from './page';
import LayoutViewConsts from './layout-view-consts';

describe('PageVersion', () => {

    const page = {
        id: 1,
        spread: {
            id: 1
        },
        position: 2,
        x: 0,
        y: 1,
        z: 1
    };
    const page2 = {
        id: 1,
        position: 2,
        x: 0,
        y: 1,
        z: 1
    };

    const blockArray = [{
        id: 1,
        blockGroupList: [{id:1}],
        u1: 34,
        u2: 53,
        v1: 32,
        v2: 76,
        name: 'blockList 1',
        color: '#889034',
        theme: 'christmas',
        merchandiseHierarchy: {
            id: 234
        },
        offerVersion:{
            id: 1,
            name: 'offer version 1',
            merchandiseHierarchy: {id:456},
            offer: {
                id: 1,
                decsription: 'christmas stuffing'
            },
            offerVersionFeaturedSku: {
                id: 1,
                sku: {
                    imageId: 23
                }
            }
        },
        changeRequest:{
            id: 1,
            changeStatus: {
                id: 1
            }
        },
        blockGroupMap:{
            1:{
                id: 1,
                name: 'AAA',
                blockIdList: [1,2,3,4,5]
            },
            2:{
                id: 2,
                name: 'BBB',
                blockIdList: [6,7,8,9,10]
            } 


        },
        "permittedActions":{
            "add-to-basket":"Add to Basket",
            "dnd-create-version":null,
            "dnd-to-ab":null,
            "dnd-to-pl-ob":null,
            "allocate":null,
            "dnd-ab-to-pl":null,
            "upload":null,
            "plan":"Plan",
            "edit-allocation":"Edit Allocation",
            "edit-theme":null
        }    
    },
    {
        id: 2,
        blockGroupList: [{id:2}],
        u1: 34,
        u2: 53,
        v1: 32,
        v2: 76,
        name: 'blockList 2',
        color: '#889034',
        theme: 'christmas in july',
        merchandiseHierarchy: {
            id: 235
        },
        offerVersion:{
            id: 2,
            name: 'offer version 2',
            hierarchyId: 453,
            offer: {
                id: 2,
                decsription: 'christmas stuff'
            },
            offerVersionFeaturedSku: {
                id: 2,
                sku: {
                    imageId: 235
                }
            }
        },
        changeRequest:{
            id: 2,
            changeStatus: {
                id: 1
            }
        },
        blockGroupMap:{
            3:{
                id: 3,
                name: 'CCC',
                blockIdList: [11,12,13,14,15]
            },
            4:{
                id: 4,
                name: 'DDD',
                blockIdList: [16,17,18,19,20]
            } 


        }
    },
    {
        id: 3,
        blockGroupList: [{id:3}],
        u1: 34,
        u2: 53,
        v1: 32,
        v2: 76,
        name: 'blockList 3',
        color: '#889034',
        theme: 'christmas in july',
        merchandiseHierarchy: {
            id: 235
        },
        changeRequest:{
            id: 2,
            changeStatus: {
                id: 1
            }
        },
        blockGroupMap:{
            3:{
                id: 3,
                name: 'CCC',
                blockIdList: [11,12,13,14,15]
            },
            4:{
                id: 4,
                name: 'DDD',
                blockIdList: [16,17,18,19,20]
            } 


        }
    }    
    ];

    const block = blockArray[0];
    const block2 = blockArray[1];
    const block3 = blockArray[2];

    const pageVersion = {
        id: 1,
        name: 'page version 1',
        description: 'mid west summer catalog page 1',
        pageWidth: 8.5,
        pageHeight: 11,
        unit: 1,
        versionMarketIdList: [1,2,3,4,5,6],
        "permittedActions":{
            "add-to-basket":"Add to Basket",
            "dnd-create-version":null,
            "dnd-to-ab":null,
            "dnd-to-pl-ob":null,
            "allocate":null,
            "dnd-ab-to-pl":null,
            "upload":null,
            "plan":"Plan",
            "edit-allocation":"Edit Allocation",
            "edit-theme":null
        },    
        blockList : blockArray
    };
    const pageVersion2 = {
        id: 1,
        name: 'page version 1',
        description: 'mid west summer catalog page 1',
        pageWidth: 8.5,
        pageHeight: 11,
        unit: 1,
        versionMarketIdList: [1,2,3,4,5,6],
        blockList : [block3]
    };

    it('should maintain a PageVersion', () => {
        const p = new Page(page);
        const pv = new PageVersion(pageVersion, p);
        expect(pv.id).to.equal(pageVersion.id);
        expect(pv.type).to.equal(LayoutViewConsts.TYPE_PAGE);
        expect(pv.name).to.equal(pageVersion.name);
        expect(pv.description).to.equal(pageVersion.description);
        expect(pv.dimension.w).to.equal(pageVersion.pageWidth);
        expect(pv.dimension.h).to.equal(pageVersion.pageHeight);
        expect(pv.unit).to.equal(1);
        expect(pv.unitToPixelRatio).to.equal(38.1);
        expect(pv.marketIds.toString()).to.equal('1,2,3,4,5,6');
    });
    it('should maintain a valid page from within the PageVersion', () => {
        const p = new Page(page);
        const pv = new PageVersion(pageVersion, p);
        expect(p.id).to.equal(1);
        expect(p.spreadId).to.equal(1);
        expect(p.index).to.equal(2);
        expect(p.position.x).to.equal(0);
        expect(p.position.y).to.equal(1);
        expect(p.position.z).to.equal(1);
        expect(pv.page.id).to.equal(1);
        expect(pv.page.spreadId).to.equal(1);
        expect(pv.page.index).to.equal(2);
        expect(pv.page.position.x).to.equal(0);
        expect(pv.page.position.y).to.equal(1);
        expect(pv.page.position.z).to.equal(1);
    });

    it('should getPageNumber', () => {
        const pg = new Page(page);
        const pv = new PageVersion(pageVersion, pg);
        const p = pg.getPageNumber(2);
        const pvp = pv.getPageNumber(2);
        expect(pvp).to.equal(2);

    });
    it('should isInSpreadGroup - true', () => {
        const pg = new Page(page);
        const pv = new PageVersion(pageVersion, pg);
        expect(pv.isInSpreadGroup()).to.equal(true);

    });
    it('should isInSpreadGroup - false', () => {
        const pg = new Page(page2);
        const pv = new PageVersion(pageVersion, pg);
        expect(pv.isInSpreadGroup()).to.equal(false);

    });
    it('should maintain actions for the page version', () => {
        const pg = new Page(page);
        const pv = new PageVersion(pageVersion, pg);
        expect(pv.permittedActions.length).to.equal(10);

    });

    it('should obtain change requests within a block', () => {

        const pg = new Page(page);
        const pv = new PageVersion(pageVersion, pg);
        const isActive = pv.isActiveChangeRequest()
        expect(isActive).to.equal(true);
    });

    it('should maintain a block within the page version', () => {

        const p = new Page(page);
        const pv = new PageVersion(pageVersion, p);
        const b = pv.blockList[0];
        expect(b.id).to.equal(block.id);
        expect(b.name).to.equal(block.name);
        expect(b.hierarchyId).to.equal(block.merchandiseHierarchy.id);
    });
    it('should maintain a multiple blocks within the page version', () => {

        const p = new Page(page);
        const pv = new PageVersion(pageVersion, p);
        const b = pv.blockList[1];
        expect(b.id).to.equal(block2.id);
        expect(b.name).to.equal(block2.name);
        expect(b.hierarchyId).to.equal(block2.merchandiseHierarchy.id);
    });
    it('should maintain change requests within a block', () => {

        const p = new Page(page);
        const pv = new PageVersion(pageVersion, p);
        const b = pv.blockList[0];
        expect(b.changeRequest.rfcId).to.equal(1);
        expect(b.changeRequest.changeStatusId).to.equal(1);
        const rfcStatusMap = new Map();     
        let isActive = b.isActiveChangeRequest(rfcStatusMap)
        expect(isActive).to.equal(false);
        isActive = b.isActiveChangeRequest()
        expect(isActive).to.equal(true);
    });

    it('should maintain an offer version within a block', () => {

        const p = new Page(page);
        const pv = new PageVersion(pageVersion, p);
        const b = pv.blockList[0];
        expect(b.offerVersion.id).to.equal(1);
        expect(b.offerVersion.name).to.equal(block.offerVersion.name);
        expect(b.offerVersion.hierarchyId).to.equal(block.offerVersion.merchandiseHierarchy.id);
        expect(b.offerVersion.getOffer().decsription).to.equal(block.offerVersion.offer.decsription);
        expect(b.offerVersion.getOfferVersionFeaturedSku().sku.imageId).to.equal(23);
    });

    it('should return true of an offer version within a block', () => {

        const p = new Page(page);
        const pv = new PageVersion(pageVersion, p);
         expect(pv.hasOffers()).to.equal(true);
    });
    it('should return false of an offer version within a block', () => {

        const p = new Page(page);
        const pv = new PageVersion(pageVersion2, p);
         expect(pv.hasOffers()).to.equal(false);
    });

    it('should maintain an blockGroupMap within a block', () => {

        const p = new Page(page);
        const pv = new PageVersion(pageVersion, p);
        const b = pv.blockList[0];
        const bg = b.blockGroupMap.getBlockGroupBlockIdSet(1);  
        const bgId = b.blockGroupMap.getBlockIds(1);  

        expect(bg.name).to.equal('AAA');
        expect(bg.ids.toString()).to.equal('1,2,3,4,5');
        expect(bgId.toString()).to.equal('1,2,3,4,5');

    });

    it('should maintain multiple blockGroups within a block', () => {

        const p = new Page(page);
        const pv = new PageVersion(pageVersion, p);
        const b = pv.blockList[0];
        const bg = b.blockGroupMap.getBlockGroupBlockIdSet(2);  
        const bgId = b.blockGroupMap.getBlockIds(2);  

        expect(bg.name).to.equal('BBB');
        expect(bg.ids.toString()).to.equal('6,7,8,9,10');
        expect(bgId.toString()).to.equal('6,7,8,9,10');

    });

        it('should maintain a valid page from within the block', () => {
        const p = new Page(page);
        const pv = new PageVersion(pageVersion, p);
        const b = pv.blockList[0];
        expect(p.id).to.equal(1);
        expect(p.spreadId).to.equal(1);
        expect(p.index).to.equal(2);
        expect(p.position.x).to.equal(0);
        expect(p.position.y).to.equal(1);
        expect(p.position.z).to.equal(1);
        expect(b.page.id).to.equal(1);
        expect(b.page.spreadId).to.equal(1);
        expect(b.page.index).to.equal(2);
        expect(b.page.position.x).to.equal(0);
        expect(b.page.position.y).to.equal(1);
        expect(b.page.position.z).to.equal(1);
    });

    it('should maintain a blockGroupMap within the page version', () => {

        const p = new Page(page);
        const pv = new PageVersion(pageVersion, p);
        let bg = pv.blockMap.getBlockGroupBlockIdSet(1);  
        let bgId = pv.blockMap.getBlockIds(1);  

        expect(bg.name).to.equal('AAA');
        expect(bg.ids.toString()).to.equal('1,2,3,4,5');
        expect(bgId.toString()).to.equal('1,2,3,4,5');

        bg = pv.blockMap.getBlockGroupBlockIdSet(2);  
        bgId = pv.blockMap.getBlockIds(2);  

        expect(bg.name).to.equal('BBB');
        expect(bg.ids.toString()).to.equal('6,7,8,9,10');
        expect(bgId.toString()).to.equal('6,7,8,9,10');

        bg = pv.blockMap.getBlockGroupBlockIdSet(4);  
        bgId = pv.blockMap.getBlockIds(4);  

        expect(bg.name).to.equal('DDD');
        expect(bg.ids.toString()).to.equal('16,17,18,19,20');
        expect(bgId.toString()).to.equal('16,17,18,19,20');

    });
    it('should maintain a world space', () => {

        const p = new Page(page);
        const pv = new PageVersion(pageVersion, p);
        pv.calculateWorldSpaceCoordinates();

        expect(pv._worldVec0[0]).to.equal(0);
        expect(pv._worldVec0[1]).to.equal(1);
        expect(pv._worldVec0[2]).to.equal(1);
        expect(pv._worldVec0[3]).to.equal(1);
        expect(pv._worldVec1[0].toFixed(0)).to.equal('324');
        expect(pv._worldVec1[1].toFixed(0)).to.equal('420');
        expect(pv._worldVec1[2].toFixed(0)).to.equal('1');
        expect(pv._worldVec1[3].toFixed(0)).to.equal('1');
        expect(pv._worldX0).to.equal(0);
        expect(pv._worldY0).to.equal(1);
        expect(pv._worldZ0).to.equal(1);
        expect(pv._worldX1.toFixed(0)).to.equal('324');
        expect(pv._worldY1.toFixed(0)).to.equal('420');
        expect(pv._worldZ1).to.equal(1);


    });  
    it('should maintain a page version grip', () => {

        const p = new Page(page);
        const pv = new PageVersion(pageVersion, p);
        expect(pv).to.have.property('ui');
        expect(pv.ui).to.have.property('grip');
        expect(pv.ui.grip.type).to.equal(LayoutViewConsts.TYPE_PAGE_GRIP);

    });
    it('should getPageId', () => {

        const p = new Page(page);
        const pv = new PageVersion(pageVersion, p);
        expect(pv.getPageId()).to.equal(1);

    });
    it('should getZindex', () => {

        const p = new Page(page);
        const pv = new PageVersion(pageVersion, p);
        expect(pv.getZindex()).to.equal(1);

    });
    it('should getPosY', () => {

        const p = new Page(page);
        const pv = new PageVersion(pageVersion, p);
        expect(pv.getPosY()).to.equal(1);

    });
    it('should getPosX', () => {

        const p = new Page(page);
        const pv = new PageVersion(pageVersion, p);
        expect(pv.getPosX()).to.equal(0);

    });
    it('should getPos', () => {

        const p = new Page(page);
        const pv = new PageVersion(pageVersion, p);
        expect(pv.getPos().x).to.equal(0);
        expect(pv.getPos().y).to.equal(1);
        expect(pv.getPos().z).to.equal(1);

    });
    it('should getPageVersionId', () => {

        const p = new Page(page);
        const pv = new PageVersion(pageVersion, p);
        expect(pv.getPageVersionId()).to.equal(1);

    });
    it('should format the updatePage object ', () => {
        const page = {
            id: 1,
            spread: {
                id: 1
            },
            position: 2,
            x: 0,
            y: 1,
            z: 1
        };
        const p = new Page(page);
        const pv = new PageVersion(pageVersion, p);
        const format = pv.prepareForExportPageUpdate(pv);
        expect(format.layoutPageList[0].id).to.equal(pv.id);
        expect(format.layoutPageList[0].position).to.equal(p.index);
        expect(format.layoutPageList[0].position).to.equal(pv.page.index);
        expect(format.layoutPageList[0].x).to.equal(pv.position.x);
        expect(format.layoutPageList[0].y).to.equal(pv.position.y);
        expect(format.layoutPageList[0].z).to.equal(pv.position.z);

    });
    it('should format the pageVersionUpdate object with all values ', () => {
        const pageGridVersion = {
            id: 5,
            name: 'page 3',
            pageWidth: 8,
            pageHeight: 10
        }
        const pageGridVersion2 = {
            id: 5,
            name: 'page 5',
            pageWidth: 8.5,
            pageHeight: 11
        }
        const page = {
            id: 1,
            spread: {
                id: 1
            },
            position: 2,
            x: 0,
            y: 1,
            z: 1
        };
        const p = new Page(page);
        const pvi = new PageVersion(pageVersion, p);
        const pv = pvi.prepareForExportPageVersionUpdate(pageGridVersion, pageGridVersion2); 
        expect(pv.pageGridVersionList[0].id).to.equal(pageGridVersion.id); 
        expect(pv.pageGridVersionList[0].name).to.equal(pageGridVersion.name); 
        expect(pv.pageGridVersionList[0].pageWidth).to.equal(pageGridVersion.pageWidth); 
        expect(pv.pageGridVersionList[0].pageWidth).to.equal(pageGridVersion.pageWidth);

    });
    it('should format the pageVersionUpdate object as null ', () => {
        const pageGridVersion = {
            id: 5,
            name: 'page 3',
            pageWidth: 8,
            pageHeight: 10
        }
        const pageGridVersion2 = {
            id: 5,
            name: 'page 3',
            pageWidth: 8,
            pageHeight: 10
        }
        const page = {
            id: 1,
            spread: {
                id: 1
            },
            position: 2,
            x: 0,
            y: 1,
            z: 1
        };
        const p = new Page(page);
        const pvi = new PageVersion(pageVersion, p);
        const pv = pvi.prepareForExportPageVersionUpdate(pageGridVersion, pageGridVersion2); 
        expect(pv).to.equal(null); 

    });
    it('should format the pageVersionUpdate object as null with MH nested object', () => {
        const pageGridVersion = {
            id: 5,
            name: 'page 3',
            pageWidth: 8,
            pageHeight: 10,
            merchandiseHierarchyList:{
                id:27
            }
        }
        const pageGridVersion2 = {
            id: 5,
            name: 'page 3',
            pageWidth: 8,
            pageHeight: 10,
            merchandiseHierarchyList:{
                id:27
            }
        }
        const page = {
            id: 1,
            spread: {
                id: 1
            },
            position: 2,
            x: 0,
            y: 1,
            z: 1
        };
        const p = new Page(page);
        const pvi = new PageVersion(pageVersion, p);
        const pv = pvi.prepareForExportPageVersionUpdate(pageGridVersion, pageGridVersion2); 
        expect(pv).to.equal(null); 

    });
    it('should format the pageVersionUpdate object as changed with MH nested object', () => {
        const pageGridVersion = {
            id: 5,
            name: 'page 3',
            pageWidth: 8,
            pageHeight: 10,
            merchandiseHierarchyList:{
                id:27
            }
        }
        const pageGridVersion2 = {
            id: 5,
            name: 'page 3',
            pageWidth: 8,
            pageHeight: 10,
            merchandiseHierarchyList:{
                id:29
            }
        }
        const page = {
            id: 1,
            spread: {
                id: 1
            },
            position: 2,
            x: 0,
            y: 1,
            z: 1
        };
        const p = new Page(page);
        const pvi = new PageVersion(pageVersion, p);
        const pv = pvi.prepareForExportPageVersionUpdate(pageGridVersion, pageGridVersion2); 
        expect(pv.pageGridVersionList[0].merchandiseHierarchyList.id).to.equal(27); 
        expect(pv.pageGridVersionList[0].name).to.equal(undefined); 
        expect(pv.pageGridVersionList[0].pageWidth).to.equal(undefined); 
        expect(pv.pageGridVersionList[0].pageHeight).to.equal(undefined); 
        expect(pv.pageGridVersionList[0].id).to.equal(pageGridVersion.id); 

    });
    it('should format the pageVersionUpdate object with 1 value', () => {
        const pageGridVersion = {
            id: 5,
            name: 'page 3',
            pageWidth: 8,
            pageHeight: 10
        }
        const pageGridVersion2 = {
            id: 5,
            name: 'page 4',
            pageWidth: 8,
            pageHeight: 10
        }
        const page = {
            id: 1,
            spread: {
                id: 1
            },
            position: 2,
            x: 0,
            y: 1,
            z: 1
        };
        const p = new Page(page);
        const pvi = new PageVersion(pageVersion, p);
        const pv = pvi.prepareForExportPageVersionUpdate(pageGridVersion, pageGridVersion2); 
        expect(pv.pageGridVersionList[0].name).to.equal(pageGridVersion.name); 
        expect(pv.pageGridVersionList[0].pageWidth).to.equal(undefined); 
        expect(pv.pageGridVersionList[0].pageHeight).to.equal(undefined); 
        expect(pv.pageGridVersionList[0].id).to.equal(pageGridVersion.id); 

    });
    it('should format the pageVersionDelete object - parking lot= true', () => {
        const page = {
            id: 1,
            spread: {
                id: 1
            },
            position: 2,
            x: 0,
            y: 1,
            z: 1
        };
        const pg = new Page(page);
        const pvi = new PageVersion(pageVersion, pg);
        const p = pvi.prepareForExportPageVersionDelete(5, true); 
        expect(p.layoutPageList[0].id).to.equal(5); 
        expect(p.moveOffersToParkingLot).to.equal(true); 

    });             
    it('should format the pageVersionDelete object - parking lot= false', () => {
        const page = {
            id: 1,
            spread: {
                id: 1
            },
            position: 2,
            x: 0,
            y: 1,
            z: 1
        };
        const pg = new Page(page);
        const pvi = new PageVersion(pageVersion, pg);
        const p = pvi.prepareForExportPageVersionDelete(5, false); 
        expect(p.layoutPageList[0].id).to.equal(5); 
        expect(p.moveOffersToParkingLot).to.equal(false); 

    });        
    it('should format the pageVersionClearTemplate object - parking lot= true', () => {
        const page = {
            id: 1,
            spread: {
                id: 1
            },
            position: 2,
            x: 0,
            y: 1,
            z: 1
        };
        const pg = new Page(page);
        const pvi = new PageVersion(pageVersion, pg);
        const p = pvi.prepareForExportPageVersionClearTemplate(5, true); 
        expect(p.pageGridVersionList[0].id).to.equal(5); 
        expect(p.moveOffersToParkingLot).to.equal(true); 

    });             
    it('should format the pageVersionClearTemplate object - parking lot= false', () => {
        const page = {
            id: 1,
            spread: {
                id: 1
            },
            position: 2,
            x: 0,
            y: 1,
            z: 1
        };
        const pg = new Page(page);
        const pvi = new PageVersion(pageVersion, pg);
        const p = pvi.prepareForExportPageVersionClearTemplate(5, false); 
        expect(p.pageGridVersionList[0].id).to.equal(5); 
        expect(p.moveOffersToParkingLot).to.equal(false); 

    });        
    it('should format the pageVersionApplyTemplate object - parking lot= true', () => {
        const page = {
            id: 1,
            spread: {
                id: 1
            },
            position: 2,
            x: 0,
            y: 1,
            z: 1
        };
        const pg = new Page(page);
        const pvi = new PageVersion(pageVersion, pg);
        const p = pvi.prepareForExportPageVersionApplyTemplate(16, 5, true); 
        expect(p.pageLayoutTemplate.id).to.equal(16); 
        expect(p.pageGridVersionList[0].id).to.equal(5); 
        expect(p.moveOffersToParkingLot).to.equal(true); 

    });             
    it('should format the pageVersionApplyTemplate object - parking lot= false', () => {
        const page = {
            id: 1,
            spread: {
                id: 1
            },
            position: 2,
            x: 0,
            y: 1,
            z: 1
        };
        const pg = new Page(page);
        const pvi = new PageVersion(pageVersion, pg);
        const p = pvi.prepareForExportPageVersionApplyTemplate(16, 5, false); 
        expect(p.pageLayoutTemplate.id).to.equal(16); 
        expect(p.pageGridVersionList[0].id).to.equal(5); 
        expect(p.moveOffersToParkingLot).to.equal(false); 

    });        

});