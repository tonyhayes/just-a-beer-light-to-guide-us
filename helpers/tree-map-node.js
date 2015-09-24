import moment from 'moment'
export default class TreeMapNode {
	constructor(treeMap, node, parentId) {

		// Copy over arbitrary metadata
		angular.extend(this, node);

		this.parentId = parentId;
		this._treeMap = treeMap;

		if(node.effectiveTime) {
			// Prefer long format
			this.effectiveMoment = moment(node.effectiveTime);
		} else if(node.effectiveTs) {
			// temporary since effectiveTime is not available from action call yet
			this.effectiveMoment = moment(node.effectiveTs);
		}
	}
	getDepth () {
		return this.getPath().length;
	}
	getPosition () {
		return this._position;
	};
	getChildren () {
		return this.childIdList.map((childId) => {
			return this._treeMap.getNode(childId);
		});
	}
	getParent () {
		return this._treeMap.getNode(this.parentId);
	}
	getPath () {
		let path = [];
		let rootId = this._treeMap.getRootId();

		for(let node = this; node && node.id != rootId; node = node.getParent()) {
			path.push(node);
		}
		return path.reverse();
	}
	setPosition (position) {
		let self = this;
		return self._position = position;
	}
	compareTo (that) {
		let a = this;
		let b = that;
		let aPositions = a.getPath().map(function(node) { return node._position });
		let bPositions = b.getPath().map(function(node) { return node._position });

		for(let i=0; i<aPositions.length && i<bPositions.length; ++i) {
			if(aPositions[i] != bPositions[i]) {
				return aPositions[i] - bPositions[i];
			}
		}
		return aPositions.length - bPositions.length;
	}
}
