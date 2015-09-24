import PageVersionGripUi from './page-version-grip-ui';
import PageVersion from '../page-version';
import Page from '../page';
import Viewport from './viewport';

describe('Viewport', () => {

    let page = {
        id: 1,
        spread: {
          id: 1
        },
        position: 2,
        x: 300,
        y: 400,
        z: 2
    };

    let blockArray = [{
        id: 1,
        blockGroupList: [{id:1}],
        u1: 34,
        u2: 53,
        v1: 32,
        v2: 76,
        _worldX0: 307.822998046875,
        _worldX1: 416.0270080566406,
        _worldY0: 300,
        _worldY1: 509.54998779296875,
        _worldZ0: 0,
        _worldZ1: 0,
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


        }
    },
    {
        id: 2,
        blockGroupList: [{id:2}],
        u1: 34,
        u2: 53,
        v1: 32,
        v2: 76,
        _worldX0: 200,
        _worldX1: 307.822998046875,
        _worldY0: 300,
        _worldY1: 509.54998779296875,
        _worldZ0: 0,
        _worldZ1: 0,
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
    }];

    let block = blockArray[0];
    let block2 = blockArray[1];

    let pageVersion = {
        id: 1,
        name: 'page version 1',
        description: 'mid west summer catalog page 1',
        pageWidth: 8,
        pageHeight: 11,
        dimension:{ 
                d: 0,
                h: 11,
                w: 8     
        },  
        unit: 1,
        ui:{grip:{
          _worldX0: 200,
          _worldX1: 523.8499755859375,
          _worldY0: 279.0450134277344,
          _worldY1: 300,
          _worldZ0: 0,
          _worldZ1: 0          
        }},
        versionMarketIdList: [1,2,3,4,5,6],
        blockList : blockArray,
        _worldX0: 300,
        _worldX1: 604.7999877929688,
        _worldY0: 400,
        _worldY1: 819.0999755859375,
        _worldZ0: 2,
        _worldZ1: 2,
        _cameraSpaceStyles:{ 
            height: 420.0999755859375,
            transform: "translate(376px, 188px)",
            width: 305.79998779296875,
            "z-index": 2
        }
    };

    it('should process a PageVersion', () => {
        let p = new Page(page);
        let pv = new PageVersion(pageVersion, p);
        let ui = new PageVersionGripUi(pv);
        expect(ui.pageVersion.id).to.equal(pageVersion.id);
        expect(ui.pageVersion.name).to.equal(pageVersion.name);
        expect(ui.pageVersion.description).to.equal(pageVersion.description);
        expect(ui.pageVersion.dimension.w).to.equal(pageVersion.pageWidth);
        expect(ui.pageVersion.dimension.h).to.equal(pageVersion.pageHeight);
        expect(ui.pageVersion.unit).to.equal(1);
        expect(ui.pageVersion.unitToPixelRatio).to.equal(38.1);
        expect(ui.pageVersion.marketIds.toString()).to.equal('1,2,3,4,5,6');
    });   
    it('should calculate a world position based on page position', () => {
        let p = new Page(page);
        let pv = new PageVersion(pageVersion, p);
        pv.calculateWorldSpaceCoordinates();
        expect(pv.ui.grip._worldX0).to.equal(300);
        expect(pv.ui.grip._worldX1).to.equal(604.7999877929688);
        expect(pv.ui.grip._worldY0).to.equal(379.0450134277344);
        expect(pv.ui.grip._worldY1).to.equal(400);
        expect(pv.ui.grip._worldZ0).to.equal(2);
        expect(pv.ui.grip._worldZ1).to.equal(2);
    });
    it('should create a tree with pages, blocks and grips', () => {
        let p = new Page(page);
        let pv = new PageVersion(pageVersion, p);
        pv.calculateWorldSpaceCoordinates();
        let tree = new Viewport();
        tree.insertRtreeObjects(pv);
        let records = tree.contains([300, 400, 0, 35000])
        expect(records.length).to.equal(2);

    });
});