export default class Page {
	constructor(data, xPos, yPos, zPos) {

		if(!xPos){			
			xPos = 0;
		}
		if(!yPos){			
			yPos = 0;
		}
		if(!zPos){			
			zPos = 0;
		}

		this.id = data.id;
		this.spreadId = null;
		if(data.spread){
			this.spreadId = angular.isObject(data.spread) ? data.spread.id : null;
		}
		this.index = data.position;
		this.position = {
			x: data.x ? data.x  : xPos,     // Make sure to modify by reference regardless of
			y: data.y ? data.y  : yPos,     // which layout or page version is being manipulated
			z: data.z ? data.z  : zPos       	// so the value is shared across all dependents
		};
	}
	getPageNumber() {
		return this.index;
	}
	getPageId() {
		return this.id;
	}
	getZindex() {
		return this.position.z;
	}
	getPosX() {
		return this.position.x;
	}
	getPosY() {
		return this.position.y;
	}
	getPos() {
		return this.position;
	}	
	isInSpreadGroup() {
		if(this.spreadId){
			return true
		}
		return false;
	}

}