import Util from '../../helpers/util';

export default class MarketToPageVersionIdManager {
	constructor() {
		this.marketPageVersions = new Map();
	}

	getMarketPageVersionIdSet(marketId) {
		let mpv = this.marketPageVersions;
		return mpv.get(marketId) || mpv.set(marketId, []).get(marketId);
	}
	add(pageVersion) {
		pageVersion.marketIds.forEach(marketId => {
			const pageVersionIdList = this.getMarketPageVersionIdSet(marketId);
			Util.insertIntoUniqueSortedArray(pageVersionIdList, pageVersion.id);
		});
	}
	remove(pageVersion) {
		pageVersion.marketIds.forEach(marketId => {
			const pageVersionIdList = this.getMarketPageVersionIdSet(marketId);
			Util.removeFromSortedArray(pageVersionIdList, pageVersion.id);
		});
	}
	getPageVersionIds(marketId) {
		return this.getMarketPageVersionIdSet(marketId);
	}
}