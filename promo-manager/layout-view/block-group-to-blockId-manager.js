import Util from '../../helpers/util';
export default class BlockGroupToBlockIdManager {
	constructor() {
		this.blockGroups = new Map();
	}
	addBlockGroup(groupId, groupName, blockIds) {
		this.removeBlockGroup(groupId);
		this.blockGroups.set(groupId, {
			name: groupName,
			ids: blockIds
		});
	}

	addBlockId(blockGroupId, blockId) {
		this.removeBlockId(blockGroupId, blockId);
		this.getBlockIds(blockGroupId).push(blockId);
	}

	removeBlockId(blockGroupId, blockId) {
		let blockIds = this.getBlockIds(blockGroupId)
		Util.removeFromUnsortedArray(blockIds, blockId);
	}

	removeBlockGroup(blockGroupId) {
		this.blockGroups.delete(blockGroupId);
	}

	removeAllBlockGroups(blockGroupId) {
		this.blockGroups.clear();
	}

	getBlockGroupBlockIdSet(blockGroupId) {
		return this.blockGroups.get(blockGroupId);
	}

	getBlockIds(blockGroupId) {
		return this.getBlockGroupBlockIdSet(blockGroupId).ids;
	}
	// (the order of the block list may potentially
	// be rendered as useful information)
}
