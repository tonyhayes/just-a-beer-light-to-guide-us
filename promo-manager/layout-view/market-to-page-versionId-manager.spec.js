import MarketToPageVersionIdManager from './market-to-page-versionId-manager';

describe('MarketToPageVersionIdManager', () => {
    it('should add a new page version', () => {
        let pageVersion = {
            id: 'V1',
            marketIds: ['M1'],
            pageId: 'P1',
        };
        let marketId = 'M1'
        let mpv = new MarketToPageVersionIdManager();
        mpv.add(pageVersion);
        let pageVersions = mpv.getPageVersionIds(marketId);
        expect(pageVersions[0]).to.equal('V1');
    });
    it('should remove a page version', () => {
        let pageVersion = {
            id: 'V1',
            marketIds: ['M1'],
            pageId: 'P1',
        };
        let marketId = 'M1'
        let mpv = new MarketToPageVersionIdManager();
        mpv.remove(pageVersion);
        let pageVersions = mpv.getPageVersionIds(marketId);
        expect(pageVersions.length).to.equal(0);
    });
    it('should getMarketPageVersionIdSet', () => {
        let pageVersion = {
            id: 'V1',
            marketIds: ['M1'],
            pageId: 'P1',
        };
        let marketId = 'M1'
        let mpv = new MarketToPageVersionIdManager();
        mpv.add(pageVersion);
        let pageVersions = mpv.getMarketPageVersionIdSet(marketId);
        expect(pageVersions.length).to.equal(1);
        expect(pageVersions[0].toString()).to.equal('V1');
    });
    it('should getPageVersionIds', () => {
        let pageVersion = {
            id: 'V1',
            marketIds: ['M1'],
            pageId: 'P1',
        };
        let marketId = 'M1'
        let mpv = new MarketToPageVersionIdManager();
        mpv.add(pageVersion);
        let pageVersions = mpv.getPageVersionIds(marketId);
        expect(pageVersions.length).to.equal(1);
        expect(pageVersions[0]).to.equal('V1');
    });

});