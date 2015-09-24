import Util from '../../helpers/util';
export default class SpreadsGroup {
	constructor(data) {
		this.pageIds = data;
		this.pageToIndexMap = Util.arrayAsMap(this.pageIds);
	}
	getPageIdFromIndex(index) {
		return this.pageIds[index];
	}
	getIndexFromPageId(pageId) {
		return this.pageToIndexMap.get(pageId);
	}

	// Also we have to be careful about deleting or
	// invalidating removed assets since we are
	// scattering references to them all over
}