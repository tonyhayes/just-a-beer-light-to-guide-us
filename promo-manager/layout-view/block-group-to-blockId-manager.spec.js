import BlockGroupToBlockIdManager from './block-group-to-blockId-manager';

describe('BlockGroupToBlockIdManager', () => {
    let bm = null;
    let groupId = 1;
    let groupName = 'Group Block Name';
    let blockIdList = [1,2,3,4,5,6];

    beforeEach(function() { 
        bm = new BlockGroupToBlockIdManager();
        bm.addBlockGroup(groupId, groupName, blockIdList);  
    });

    it('should addBlockGroup', function() {
        expect(bm.blockGroups.size).to.equal(1);
    });

    it('should removeBlockGroup', function() {
        bm.removeBlockGroup(groupId);  
        expect(bm.blockGroups.size).to.equal(0);
    });

    it('should tolerate non existant removeBlockGroup', function() {
        bm.removeBlockGroup(groupId);  
        bm.removeBlockGroup(groupId);  
        expect(bm.blockGroups.size).to.equal(0);
    });

    it('should removeAllBlockGroups', function() {
        bm.removeAllBlockGroups();  
        expect(bm.blockGroups.size).to.equal(0);
    });

    it('should getBlockGroupBlockIdSet', function() {
        let bg = bm.getBlockGroupBlockIdSet(groupId);  
        expect(bg.name).to.equal(groupName);
        expect(bg.ids.toString()).to.equal('1,2,3,4,5,6');
    });

    it('should getBlockIds', function() {
        let bg = bm.getBlockIds(groupId);  
        expect(bg.toString()).to.equal('1,2,3,4,5,6');
    });

    it('should addBlockId', function() {
        bm.addBlockId(groupId, 7);  
        let bg = bm.getBlockIds(groupId);  
        expect(bg.toString()).to.equal('1,2,3,4,5,6,7');
    });

    it('should not duplicate addBlockId', function() {
        bm.addBlockId(groupId, 7);  
        let bg = bm.getBlockIds(groupId);  
        expect(bg.toString()).to.equal('1,2,3,4,5,6,7');
    });

    it('should removeBlockId', function() {
        bm.removeBlockId(groupId, 6);  
        let bg = bm.getBlockIds(groupId);  
        expect(bg.toString()).to.equal('1,2,3,4,5,7');
    });

    it('should tolerate non existant removeBlockId', function() {
        bm.removeBlockId(groupId, 6);  
        let bg = bm.getBlockIds(groupId);  
        expect(bg.toString()).to.equal('1,2,3,4,5,7');
    });


});  