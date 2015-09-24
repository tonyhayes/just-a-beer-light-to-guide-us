import LayoutVersionFormatter from './layout-version-formatter';
import PageVersionGripUi from './page-version-grip-ui';
import PageVersion from '../page-version';
import Page from '../page';

describe('LayoutVersionFormatter', () => {

        const page = {
            id: 1,
            spread: {
                id: 1
            },
            position: 2,
            x: 300,
            y: 400,
            z: 2
        };


        const blockArray = [{
            id: 1,
            blockGroupList: [{
                id: 1
            }],
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
            offerVersion: {
                id: 1,
                name: 'offer version 1',
                merchandiseHierarchy: {
                    id: 456
                },
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
            changeRequest: {
                id: 1,
                changeStatus: {
                    id: 1
                }
            },
            blockGroupMap: {
                1: {
                    id: 1,
                    name: 'AAA',
                    blockIdList: [1, 2, 3, 4, 5]
                },
                2: {
                    id: 2,
                    name: 'BBB',
                    blockIdList: [6, 7, 8, 9, 10]
                }


            }
        }, {
            id: 2,
            blockGroupList: [{
                id: 2
            }],
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
            offerVersion: {
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
            changeRequest: {
                id: 2,
                changeStatus: {
                    id: 1
                }
            },
            blockGroupMap: {
                3: {
                    id: 3,
                    name: 'CCC',
                    blockIdList: [11, 12, 13, 14, 15]
                },
                4: {
                    id: 4,
                    name: 'DDD',
                    blockIdList: [16, 17, 18, 19, 20]
                }


            }
        }];

        const block = blockArray[0];
        const block2 = blockArray[1];

        const pageVersion = {
            id: 1,
            name: 'page version 1',
            description: 'mid west summer catalog page 1',
            pageWidth: 8,
            pageHeight: 11,
            dimension: {
                d: 0,
                h: 11,
                w: 8
            },
            unit: 1,
            versionMarketIdList: [1, 2, 3, 4, 5, 6],
            blockList: blockArray,
            _worldX0: 300,
            _worldX1: 604.7999877929688,
            _worldY0: 400,
            _worldY1: 819.0999755859375,
            _worldZ0: 2,
            _worldZ1: 2,
            _cameraSpaceStyles: {
                height: 420.0999755859375,
                transform: "translate(376px, 188px)",
                width: 305.79998779296875,
                "z-index": 2
            }
        };

        it('should receive a PageVersion', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            const ui = new PageVersionGripUi(pv);
            expect(ui.pageVersion.id).to.equal(pageVersion.id);
            expect(ui.pageVersion.name).to.equal(pageVersion.name);
            expect(ui.pageVersion.description).to.equal(pageVersion.description);
            expect(ui.pageVersion.dimension.w).to.equal(pageVersion.pageWidth);
            expect(ui.pageVersion.dimension.h).to.equal(pageVersion.pageHeight);
            expect(ui.pageVersion.unit).to.equal(1);
            expect(ui.pageVersion.unitToPixelRatio).to.equal(38.1);
            expect(ui.pageVersion.marketIds.toString()).to.equal('1,2,3,4,5,6');
        });
        it('should be a valid page - calculate a world position based on page position', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            pv.calculateWorldSpaceCoordinates();
            expect(pv.ui.grip._worldX0).to.equal(300);
            expect(pv.ui.grip._worldX1).to.equal(604.7999877929688);
            expect(pv.ui.grip._worldY0).to.equal(379.0450134277344);
            expect(pv.ui.grip._worldY1).to.equal(400);
            expect(pv.ui.grip._worldZ0).to.equal(2);
            expect(pv.ui.grip._worldZ1).to.equal(2);
        });
        it('should format the page id', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            const format = LayoutVersionFormatter.out(pv);
            expect(format.gridVersionMap.page).to.equal(pv.id);

        });
        it('should format the page name', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            const format = LayoutVersionFormatter.out(pv);
            expect(format.gridVersionMap.name).to.equal(pv.name);

        });
        it('should format the page description', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            const format = LayoutVersionFormatter.out(pv);
            expect(format.gridVersionMap.description).to.equal(pv.description);

        });
        it('should format the page pageWidth,pageHeight,unit ', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            const format = LayoutVersionFormatter.out(pv);
            expect(format.gridVersionMap.pageWidth).to.equal(pv.dimension.w);
            expect(format.gridVersionMap.pageHeight).to.equal(pv.dimension.h);
            expect(format.gridVersionMap.unit).to.equal(pv.unit);

        });
        it('should format the page versionMarketIdList ', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            const format = LayoutVersionFormatter.out(pv);
            expect(format.gridVersionMap.versionMarketIdList.toString()).to.equal(pv.marketIds.toString());

        });
        it('should format the page blocks ', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            const format = LayoutVersionFormatter.out(pv);
            expect(format.gridVersionMap.blockList.length).to.equal(2);

        });
        it('should format the page block id, name, color, theme ', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            const format = LayoutVersionFormatter.out(pv);
            const blk = format.gridVersionMap.blockList[0];
            const b = pv.blockList[0];
            expect(blk.id).to.equal(b.id);
            expect(blk.name).to.equal(b.name);
            expect(blk.color).to.equal(b.color);
            expect(blk.theme).to.equal(b.theme);

        });
        it('should format the page block u1, u2, v1, v2 ', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            const format = LayoutVersionFormatter.out(pv);
            const blk = format.gridVersionMap.blockList[0];
            const b = pv.blockList[0];
            expect(blk.u1).to.equal(b.u1);
            expect(blk.u2).to.equal(b.u2);
            expect(blk.v1).to.equal(b.v1);
            expect(blk.v2).to.equal(b.v2);

        });
        it('should format the page merchandiseHierarchy ', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            const format = LayoutVersionFormatter.out(pv);
            const blk = format.gridVersionMap.blockList[0];
            const b = pv.blockList[0];
            expect(blk.merchandiseHierarchy.id).to.equal(b.hierarchyId);

        });
        it('should format the page blockGroupList ', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            const format = LayoutVersionFormatter.out(pv);
            const blk = format.gridVersionMap.blockList[0];
            const b = pv.blockList[0];
            expect(blk.blockGroupList[0].id).to.equal(b.blockGroupId);

        });
        it('should format the page block id 2, name, color, theme ', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            const format = LayoutVersionFormatter.out(pv);
            const blk = format.gridVersionMap.blockList[1];
            const b = pv.blockList[1];
            expect(blk.id).to.equal(b.id);
            expect(blk.name).to.equal(b.name);
            expect(blk.color).to.equal(b.color);
            expect(blk.theme).to.equal(b.theme);

        });
        it('should format the page block2 u1, u2, v1, v2 ', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            const format = LayoutVersionFormatter.out(pv);
            const blk = format.gridVersionMap.blockList[1];
            const b = pv.blockList[1];
            expect(blk.u1).to.equal(b.u1);
            expect(blk.u2).to.equal(b.u2);
            expect(blk.v1).to.equal(b.v1);
            expect(blk.v2).to.equal(b.v2);

        });
        it('should format the page 2 merchandiseHierarchy ', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            const format = LayoutVersionFormatter.out(pv);
            const blk = format.gridVersionMap.blockList[1];
            const b = pv.blockList[1];
            expect(blk.merchandiseHierarchy.id).to.equal(b.hierarchyId);

        });
        it('should format the page 2 blockGroupList ', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            const format = LayoutVersionFormatter.out(pv);
            const blk = format.gridVersionMap.blockList[1];
            const b = pv.blockList[1];
            expect(blk.blockGroupList[0].id).to.equal(b.blockGroupId);

        });
        it('should format the page offerversion ', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            const format = LayoutVersionFormatter.out(pv);
            const offer = format.gridVersionMap.blockList[0].offerVersion;
            const o = pv.blockList[0].offerVersion;
            expect(offer.id).to.equal(o.id);
            expect(offer.name).to.equal(o.name);

        });
        it('should format the page offerversion merchandiseHierarchy ', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            const format = LayoutVersionFormatter.out(pv);
            const offer = format.gridVersionMap.blockList[0].offerVersion;
            const o = pv.blockList[0].offerVersion;
            expect(offer.merchandiseHierarchy.id).to.equal(o.hierarchyId);

        });
        it('should format the page offerversion offer ', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            const format = LayoutVersionFormatter.out(pv);
            const offer = format.gridVersionMap.blockList[0].offerVersion.offer;
            const o = pv.blockList[0].offerVersion.offer;
            expect(offer.id).to.equal(o.id);
            expect(offer.description).to.equal(o.description);

        });
        it('should format the page offerversion offerVersionFeaturedSku ', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            const format = LayoutVersionFormatter.out(pv);
            const offer = format.gridVersionMap.blockList[0].offerVersion.offerVersionFeaturedSku;
            const o = pv.blockList[0].offerVersion.offerVersionFeaturedSku;
            expect(offer.id).to.equal(o.id);
            expect(offer.sku.imageId).to.equal(o.sku.imageId);

        });
        it('should format the page block changeRequest ', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            const format = LayoutVersionFormatter.out(pv);
            const changeRequest = format.gridVersionMap.blockList[0].changeRequest;
            const cr = pv.blockList[0].changeRequest;
            expect(changeRequest.id).to.equal(cr.rfcId);
            expect(changeRequest.changeStatus.id).to.equal(cr.changeStatusId);

        });
        it('should format the blockGroupMap ', () => {
            const p = new Page(page);
            const pv = new PageVersion(pageVersion, p);
            const format = LayoutVersionFormatter.out(pv);
            const blockGroupMap = format.gridVersionMap.blockList[0].blockGroupMap;
            const brm = pv.blockList[0].blockGroupMap.blockGroups;
            const entry = brm.get(1);
            expect(blockGroupMap[1].name).to.equal(entry.name);
            expect(blockGroupMap[1].blockIdList.toString()).to.equal(entry.ids.toString());

        });
        it('should format the gridVersionMap object ', () => {
            const page = {
                pageNumber: 5,
                gridVersionName: 'page 5'
            };
            const id = 507;
            const xPos = 200;
            const yPos = 500;
            const zPos = 5;
            const h = 11;
            const w = 8;
            const unit = 0;
            const layoutPage = [];
            const marketList = ['M1'];
            let gridVersionMap = {};
            gridVersionMap = LayoutVersionFormatter.gridVersionMap(gridVersionMap, id, page, h, w, unit, marketList);
            expect(gridVersionMap[id].description).to.equal(null);
            expect(gridVersionMap[id].id).to.equal(null);
            expect(gridVersionMap[id].name).to.equal(page.gridVersionName);
            expect(gridVersionMap[id].pageHeight).to.equal(h);
            expect(gridVersionMap[id].pageWidth).to.equal(w);
            expect(gridVersionMap[id].unit).to.equal(unit);
            expect(gridVersionMap[id].versionMarketIdList.toString()).to.equal(marketList.toString());

        });
});