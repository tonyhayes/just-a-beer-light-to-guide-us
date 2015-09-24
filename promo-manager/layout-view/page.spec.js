import Page from './page';
import PageVersion from './page-version';

describe('Page', () => {

   it('should maintain a page', () => {
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
        expect(p.id).to.equal(1);
        expect(p.spreadId).to.equal(1);
        expect(p.index).to.equal(2);
        expect(p.position.x).to.equal(0);
        expect(p.position.y).to.equal(1);
        expect(p.position.z).to.equal(1);
    });
    it('should getPageNumber', () => {
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
        const p = pg.getPageNumber(2);
        expect(p).to.equal(2);

    });    
    it('should getPageId', () => {
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
        const p = pg.getPageId();
        expect(p).to.equal(1);

    });
    it('should get spread id', () => {
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
        expect(p.spreadId).to.equal(page.spread.id);
    });
    it('should return true for  spread id', () => {
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
        expect(p.isInSpreadGroup()).to.equal(true);
    });
    it('should return false for  spread id', () => {
        const page = {
            id: 1,
            position: 2,
            x: 0,
            y: 1,
            z: 1
        };
        const p = new Page(page);
        expect(p.isInSpreadGroup()).to.equal(false);
    });
    it('should create a null spread id', () => {
        const page = {
            id: 1,
            position: 2,
            x: 0,
            y: 1,
            z: 1
        };
        const p = new Page(page);
        expect(p.spreadId).to.equal(null);
    });
    it('should getZindex', () => {

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
        expect(p.getZindex()).to.equal(1);

    });
    it('should getPosY', () => {

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
        expect(p.getPosY()).to.equal(1);

    });
    it('should getPosX', () => {

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
        expect(p.getPosX()).to.equal(0);

    });
    it('should getPos', () => {

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
        expect(p.getPos().x).to.equal(0);
        expect(p.getPos().y).to.equal(1);
        expect(p.getPos().z).to.equal(1);

    });


});