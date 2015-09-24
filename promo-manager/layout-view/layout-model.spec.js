import LayoutModel from './layout-model';
import Page from './page';
import PageVersion from './page-version';

describe('LayoutModel', () => {
    let layoutModel = null;
    beforeEach(function() {
        layoutModel = {
            id: 1,
            channelId: 236,
            currentPageQuantity: 5,
            pageGroupsMap:{        
                1: [1,2,3,4,5],
                2: [6,7,8,9,10]         
            },
            layoutVersionsMap:{
                'V1': ['M1','M2','M3','M4','M5'],
                'V2': ['M6','M7','M8','M9','M10'],         
                'V3': ['M11','M12','M13','M14','M15'],
                'V4': ['M16','M17','M18','M19','M20']         
            },
            "permittedActions":{
                "add-page":"Add page",
                "re-order":"re-order pages",
            },    
            pageList:[
                {
                    id: 1,
                    spread: {
                        id: 1
                    },
                    position: 2,
                    x: 0,
                    y: 1,
                    z: 1
                },
                {
                    id: 2,
                    spread: {
                        id: 2
                    },
                    position: 1,
                    x: 5,
                    y: 4,
                    z: 7
                }
            ]
        };
    });
    it('should maintain a LayoutModel', () => {
        let lm = new LayoutModel(layoutModel);
        expect(lm.id).to.equal(1);
        expect(lm.channelId).to.equal(236);
        expect(lm.currentPageQuantity).to.equal(5);
    });
    it('should maintain a layoutVersionsMap', () => {
        let lm = new LayoutModel(layoutModel);
        expect(lm.layoutVersionsMap.has('V1')).to.equal(true);
        expect(lm.layoutVersionsMap.has('V2')).to.equal(true);
        expect(lm.layoutVersionsMap.has('V3')).to.equal(true);
        expect(lm.layoutVersionsMap.has('V4')).to.equal(true);
        expect(lm.layoutVersionsMap.size).to.equal(4);
        expect(lm.layoutVersionsMap.get('V1')).to.have.length(5);
        expect(lm.layoutVersionsMap.get('V2')).to.have.length(5);
        expect(lm.layoutVersionsMap.get('V3')).to.have.length(5);
        expect(lm.layoutVersionsMap.get('V4')).to.have.length(5);
        expect(lm.layoutVersionsMap.get('V1')[0]).to.equal('M1');
        expect(lm.layoutVersionsMap.get('V2')[2]).to.equal('M8');
        expect(lm.layoutVersionsMap.get('V3')[2]).to.equal('M13');
        expect(lm.layoutVersionsMap.get('V4')[2]).to.equal('M18');
    });
    it('should maintain a spreadsMap', () => {
        let lm = new LayoutModel(layoutModel);
        expect(lm.spreadsMap.has('1')).to.equal(true);
        expect(lm.spreadsMap.has('2')).to.equal(true);
        expect(lm.spreadsMap.size).to.equal(2);
        let sm = lm.spreadsMap.get('1');
        expect(sm.pageIds).to.have.length(5);
        expect(sm.pageToIndexMap.size).to.equal(5);
        expect(sm.pageToIndexMap.get(1)).to.equal(0);

    });
    it('should maintain a pageList', () => {
        let lm = new LayoutModel(layoutModel);
        expect(lm.pageList).to.have.length(2);
        let p = lm.pageList[0];
        expect(p.id).to.equal(1);
        expect(p.spreadId).to.equal(1);
        expect(p.index).to.equal(2);
        expect(p.position.x).to.equal(50);
        expect(p.position.y).to.equal(1);
        expect(p.position.z).to.equal(1);
    });
    it('should getMarketsById', () => {
        let lm = new LayoutModel(layoutModel);
        let market = lm.getMarketsByIndex(0);
        expect(market).to.have.length(5);
        expect(market.toString()).to.equal('M1,M2,M3,M4,M5');
        market = lm.getMarketsByIndex(-1);
        expect(market).to.equal(undefined);
        market = lm.getMarketsByIndex(18);
        expect(market).to.equal(undefined);
    });   
    it('should getLayoutVersionIndex', () => {
        let lm = new LayoutModel(layoutModel);
        let index = lm.getLayoutVersionIndex('V2');
        expect(index).to.equal(1);
     });   
    it('should getChannel', () => {
        let lm = new LayoutModel(layoutModel);
        let channel = lm.getChannel();
        expect(channel).to.equal(236);
     });   
    it('should getFirstMarketByIndex', () => {
        let lm = new LayoutModel(layoutModel);
        let first = lm.getFirstMarketByIndex(0);
        expect(first).to.equal('M1');
        first = lm.getFirstMarketByIndex(-1);
        expect(first).to.equal(undefined);
        first = lm.getFirstMarketByIndex(18);
        expect(first).to.equal(undefined);
    });
    it('should addPageToLayout', () => {
        let lm = new LayoutModel(layoutModel);
        expect(lm.pageList).to.have.length(2);
        const page = {
            id: 702,
            position: 5,
            x: 200,
            y: 300,
            z: 3,
            spreadId: null
        };

        lm.addPageToLayout(page)
        expect(lm.pageList).to.have.length(3);
        let p = lm.pageList[2];
        expect(p.id).to.equal(702);
        expect(p.spreadId).to.equal(null);
        expect(p.index).to.equal(5);
        expect(p.position.x).to.equal(200);
        expect(p.position.y).to.equal(300);
        expect(p.position.z).to.equal(3);
    });


    it('should format the addPage object ', () => {
        const page = {
            pageNumber: 5,
            index: 10,
            pageVersionName: 'page 5'
        };
        const pp = {
            id: 1,
            spread: {
                id: 1
            },
            position: 2,
            x: 0,
            y: 1,
            z: 1
        };
        let lm = new LayoutModel(layoutModel);
        const id = 507;
        const xPos = 200;
        const yPos = 500;
        const zPos = 5;
        const h = 11;
        const w = 8;
        const unit = 0;
        const format = lm.prepareForExportPageAdd(page, xPos, yPos, zPos, h, w, unit);
        expect(format.position).to.equal(page.index);
        expect(format.x).to.equal(xPos);
        expect(format.y).to.equal(yPos);
        expect(format.z).to.equal(zPos);
        expect(format.gridVersionList[0].pageHeight).to.equal(h);
        expect(format.gridVersionList[0].pageWidth).to.equal(w);
        expect(format.gridVersionList[0].unit).to.equal(unit);
        expect(format.gridVersionList[0].name).to.equal(page.pageVersionName);

    });

    it('should format the updatePages object ', () => {
        const pages = [{
            id: 1,
            index: 1,
            position: {
                x: 300,
                y: 400,
                z: 2
            }
        }, {
            id: 2,
            index: 2,
            position: {
                x: 500,
                y: 600,
                z: 1
            }

        }];
        let lm = new LayoutModel(layoutModel);
        const format = lm.prepareForExportPagesUpdate(pages);
        expect(format.layoutPageList[0].id).to.equal(pages[0].id);
        expect(format.layoutPageList[0].position).to.equal(pages[0].index);
        expect(format.layoutPageList[0].x).to.equal(pages[0].position.x);
        expect(format.layoutPageList[0].y).to.equal(pages[0].position.y);
        expect(format.layoutPageList[0].z).to.equal(pages[0].position.z);
        expect(format.layoutPageList[1].id).to.equal(pages[1].id);
        expect(format.layoutPageList[1].position).to.equal(pages[1].index);
        expect(format.layoutPageList[1].x).to.equal(pages[1].position.x);
        expect(format.layoutPageList[1].y).to.equal(pages[1].position.y);
        expect(format.layoutPageList[1].z).to.equal(pages[1].position.z);

    });
    it('should maintain actions for the layout', () => {
        let lm = new LayoutModel(layoutModel);
        expect(lm.permittedActions).to.have.length(2);

    });


});