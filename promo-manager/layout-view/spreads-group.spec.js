import SpreadsGroup from './spreads-group';
describe('SpreadsGroup', () => {
    it('should maintain the spreads group', () => {
        let pageGroupsMap = 
        {
            1: [1,2,3,4,5],
            2: [6,7,8,9,10]
        };
        let sg = new SpreadsGroup([1,2,3,4,5]);
        expect(sg.pageIds.toString()).to.equal('1,2,3,4,5');
    });

    it('sg should be 5', function() {
        let sg = new SpreadsGroup([1,2,3,4,5]);
        expect(sg.pageToIndexMap.size).to.equal(5);
    });
    it('sg should be 1, 2', function() {
        let sg = new SpreadsGroup([1,2,3,4,5]);
        expect(sg.pageToIndexMap.has(1)).to.equal(true);
        expect(sg.pageToIndexMap.has(2)).to.equal(true);
    });
    it('sg value should be original array index', function() {
        let sg = new SpreadsGroup([1,2,3,4,5]);
        expect(sg.pageToIndexMap.get(1)).to.equal(0);
        expect(sg.pageToIndexMap.get(2)).to.equal(1);
        expect(sg.pageToIndexMap.get(3)).to.equal(2);
        expect(sg.pageToIndexMap.get(4)).to.equal(3);
        expect(sg.pageToIndexMap.get(5)).to.equal(4);
    });

    it('getPageIdFromIndex should be 5', function() {
        let sg = new SpreadsGroup([1,2,3,4,5]);
        expect(sg.getPageIdFromIndex(4)).to.equal(5);
    });
    it('getIndexFromPageId should be 4', function() {
        let sg = new SpreadsGroup([1,2,3,4,5]);
        expect(sg.getIndexFromPageId(5)).to.equal(4);
    });

});
