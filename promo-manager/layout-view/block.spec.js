import Block from './block';
import Page from './page';
import LayoutViewConsts from './layout-view-consts';

describe('Block', () => {
       let page = {
        id: 1,
        spread: {
            id: 1
        },
        position: 2,
        x: 0.1,
        y: 1,
        z: 1
      };

        let block = {
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
        permittedActions:{
            "add-to-basket":"Add to Basket",
            "dnd-create-version":null,
            'dnd-to-ab':null,
            "dnd-to-pl-ob":null,
            "allocate":null,
            "dnd-ab-to-pl":null,
            "upload":null,
            "plan":"Plan",
            "edit-allocation":"Edit Allocation",
            "edit-theme":null
        }    

    };        
    let block2 = {
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


        }
    };

    it('should maintain a block', () => {

        let p = new Page(page);
        let b = new Block(block, p);
        expect(b.id).to.equal(1);
        expect(b.name).to.equal(block.name);
        expect(b.type).to.equal(LayoutViewConsts.TYPE_BLOCK);
        expect(b.hierarchyId).to.equal(block.merchandiseHierarchy.id);
    });
    it('should maintain change requests within a block', () => {

        let p = new Page(page);
        let b = new Block(block, p);
        expect(b.changeRequest.rfcId).to.equal(1);
        expect(b.changeRequest.changeStatusId).to.equal(1);
        let rfcStatusMap = new Map();     
        let isActive = b.isActiveChangeRequest(rfcStatusMap)
        expect(isActive).to.equal(false);
        isActive = b.isActiveChangeRequest()
        expect(isActive).to.equal(true);
    });
    it('should maintain actions within a block', () => {

        let p = new Page(page);
        let b = new Block(block, p);
        expect(b.permittedActions.length).to.equal(10);
    });

    it('should maintain an offer version within a block', () => {

        let p = new Page(page);
        let b = new Block(block, p);
        expect(b.offerVersion.id).to.equal(1);
        expect(b.offerVersion.name).to.equal(block.offerVersion.name);
        expect(b.offerVersion.hierarchyId).to.equal(block.offerVersion.merchandiseHierarchy.id);
        expect(b.offerVersion.getOffer().decsription).to.equal(block.offerVersion.offer.decsription);
        expect(b.offerVersion.getOfferVersionFeaturedSku().sku.imageId).to.equal(23);
    });
    it('should return true for an offer version within a block', () => {

        let p = new Page(page);
        let b = new Block(block, p);
        expect(b.hasOffers()).to.equal(true);
    });
    it('should return false when no offer version within a block', () => {

        let p = new Page(page);
        let b = new Block(block2, p);
        expect(b.hasOffers()).to.equal(false);
    });

    it('should maintain an blockGroupMap within a block', () => {

        let p = new Page(page);
        let b = new Block(block, p);
        let bg = b.blockGroupMap.getBlockGroupBlockIdSet(1);  
        let bgId = b.blockGroupMap.getBlockIds(1);  

        expect(bg.name).to.equal('AAA');
        expect(bg.ids.toString()).to.equal('1,2,3,4,5');
        expect(bgId.toString()).to.equal('1,2,3,4,5');

    });

    it('should maintain multiple blockGroups within a block', () => {

        let p = new Page(page);
        let b = new Block(block, p);
        let bg = b.blockGroupMap.getBlockGroupBlockIdSet(2);  
        let bgId = b.blockGroupMap.getBlockIds(2);  

        expect(bg.name).to.equal('BBB');
        expect(bg.ids.toString()).to.equal('6,7,8,9,10');
        expect(bgId.toString()).to.equal('6,7,8,9,10');

    });

    it('should maintain a valid page from within the block', () => {
        let p = new Page(page);
        let b = new Block(block, p);
        expect(p.id).to.equal(1);
        expect(p.spreadId).to.equal(1);
        expect(p.index).to.equal(2);
        expect(p.position.x).to.equal(0.1);
        expect(p.position.y).to.equal(1);
        expect(p.position.z).to.equal(1);
        expect(b.page.id).to.equal(1);
        expect(b.page.spreadId).to.equal(1);
        expect(b.page.index).to.equal(2);
        expect(b.page.position.x).to.equal(0.1);
        expect(b.page.position.y).to.equal(1);
        expect(b.page.position.z).to.equal(1);
    });
    it('should format the prepareForExportBlockList object with all values ', () => {
            const blk = {
                "id": 451,
                "name": "1",
                "u1": 0,
                "u2": 0.5,
                "v1": 0,
                "v2": 0.3336363636363636,
                "color": "0xFFFFFF",
                "theme":"dancing bears",
                "isCoop": false,
                "merchandiseHierarchy":{
                    "id": 384
                }
            }
            const blk2 = {
                "id": 456,
                "name": "11",
                "u1": 0.9,
                "u2": 0.8,
                "v1": 0.8,
                "v2": 0.3336363636363637,
                "color": "0xFFFFFg",
                "theme":"dancing bear",
                "isCoop": true,
                "merchandiseHierarchy":{
                    "id": 3846
                }
            }
        let p = new Page(page);
        let b = new Block(block, p);
        const bb = b.prepareForExportBlockList(blk, blk2); 
        expect(bb.blockList[0].id).to.equal(blk.id); 
        expect(bb.blockList[0].name).to.equal(blk.name); 
        expect(bb.blockList[0].u1).to.equal(blk.u1); 
        expect(bb.blockList[0].u2).to.equal(blk.u2);
        expect(bb.blockList[0].v1).to.equal(blk.v1);
        expect(bb.blockList[0].v2).to.equal(blk.v2);
        expect(bb.blockList[0].theme).to.equal(blk.theme);
        expect(bb.blockList[0].isCoop).to.equal(blk.isCoop);
        expect(bb.blockList[0].merchandiseHierarchy.id).to.equal(blk.merchandiseHierarchy.id);

    });
    it('should format the prepareForExportBlockList object as null ', () => {
            const blk = {
                "id": 451,
                "name": "1",
                "u1": 0,
                "u2": 0.5,
                "v1": 0,
                "v2": 0.3336363636363636,
                "color": "0xFFFFFF",
                "theme":"dancing bears",
                "isCoop": false,
            }
            const blk2 = {
                "id": 451,
                "name": "1",
                "u1": 0,
                "u2": 0.5,
                "v1": 0,
                "v2": 0.3336363636363636,
                "color": "0xFFFFFF",
                "theme":"dancing bears",
                "isCoop": false
            }
        let p = new Page(page);
        let b = new Block(block, p);
        const bb = b.prepareForExportBlockList(blk, blk2); 
        expect(bb).to.equal(null); 

    });
    it('should format the prepareForExportBlockList object as null with MH nested object', () => {
            const blk = {
                "id": 451,
                "name": "1",
                "u1": 0,
                "u2": 0.5,
                "v1": 0,
                "v2": 0.3336363636363636,
                "color": "0xFFFFFF",
                "theme":"dancing bears",
                "isCoop": false,
                "merchandiseHierarchy":{
                    "id": 384
                }
            }
            const blk2 = {
                "id": 451,
                "name": "1",
                "u1": 0,
                "u2": 0.5,
                "v1": 0,
                "v2": 0.3336363636363636,
                "color": "0xFFFFFF",
                "theme":"dancing bears",
                "isCoop": false,
                "merchandiseHierarchy":{
                    "id": 384
                }
            }
        let p = new Page(page);
        let b = new Block(block, p);
        const bb = b.prepareForExportBlockList(blk, blk2); 
        expect(bb).to.equal(null); 

    });
    it('should format the prepareForExportBlockList object as changed with MH nested object', () => {
            const blk = {
                "id": 451,
                "name": "1",
                "u1": 0,
                "u2": 0.5,
                "v1": 0,
                "v2": 0.3336363636363636,
                "color": "0xFFFFFF",
                "theme":"dancing bears",
                "isCoop": false,
                "merchandiseHierarchy":{
                    "id": 384
                }
            }
            const blk2 = {
                "id": 451,
                "name": "1",
                "u1": 0,
                "u2": 0.5,
                "v1": 0,
                "v2": 0.3336363636363636,
                "color": "0xFFFFFF",
                "theme":"dancing bears",
                "isCoop": false,
                "merchandiseHierarchy":{
                    "id": 3847
                }
            }
        let p = new Page(page);
        let b = new Block(block, p);
        const bb = b.prepareForExportBlockList(blk, blk2); 
        expect(bb.blockList[0].merchandiseHierarchy.id).to.equal(384); 
        expect(bb.blockList[0].name).to.equal(undefined); 
        expect(bb.blockList[0].color).to.equal(undefined); 
        expect(bb.blockList[0].theme).to.equal(undefined); 
        expect(bb.blockList[0].id).to.equal(blk.id); 

    });
    it('should format the prepareForExportBlockList object with 1 value', () => {
            const blk = {
                "id": 451,
                "name": "1",
                "u1": 0,
                "u2": 0.5,
                "v1": 0,
                "v2": 0.3336363636363636,
                "color": "0xFFFFFF",
                "theme":"dancing bears",
                "isCoop": false,
                "merchandiseHierarchy":{
                    "id": 384
                }
            }
            const blk2 = {
                "id": 451,
                "name": "16",
                "u1": 0,
                "u2": 0.5,
                "v1": 0,
                "v2": 0.3336363636363636,
                "color": "0xFFFFFF",
                "theme":"dancing bears",
                "isCoop": false,
                "merchandiseHierarchy":{
                    "id": 384
                }
            }
        let p = new Page(page);
        let b = new Block(block, p);
        const bb = b.prepareForExportBlockList(blk, blk2); 
        expect(bb.blockList[0].name).to.equal(blk.name); 
        expect(bb.blockList[0].color).to.equal(undefined); 
        expect(bb.blockList[0].theme).to.equal(undefined); 
        expect(bb.blockList[0].id).to.equal(blk.id); 

    });

});