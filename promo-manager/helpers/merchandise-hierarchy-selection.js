export default class MerchandiseHierarchySelection {
    constructor($scope) {
		this.shadowModel = [];
		$scope.$watch(() => {
			return this.ngModel;
		}, (newVal, oldVal) => {
			this.update();
		});
		$scope.$watch(() => {
			return this.treeMap;
		}, (newVal, oldVal) => {
			this.update();
		});
	}

	update() {
		if(!this.treeMap){
			return;
		}
		let node = this.treeMap.getNode(this.ngModel);
		if(node){
			let path = node.getPath();
			this.dropdowns = this.defaultLabels.map((defaultLabel, i) => {
				let options = [];
				let parentNode = null;
				if(i==0) {
					// Root parent
					parentNode = this.treeMap.getRootNode();
					options = parentNode.getChildren();
					options.unshift({ id: parentNode.id, name: defaultLabel });
				} else if(i <= path.length) {
					// Defined parent
					parentNode = path[i-1];
					options = parentNode.getChildren();
					options.unshift({ id: parentNode.id, name: defaultLabel });
				} else {
					// Wildcard parent
					options.unshift({ id: this.ngModel, name: defaultLabel });
				}
				return options;
			});
			this.shadowModel = path.map((ele) => { return ele.id });
			if(this.shadowModel.length != this.defaultLabels.length) {
				for(let i=this.shadowModel.length; i<this.defaultLabels.length; ++i) {
					this.shadowModel[i] = this.ngModel;
				}
			}
		}
	}
	getSelectedName(dropdownIndex) {
		let path = this.treeMap.getNode(this.ngModel).getPath();
		if(dropdownIndex < path.length) {
			// Dropdown has a selected value
			return path[dropdownIndex].name;
		}
		// Dropdown doesn't have a selected value - show the default
		return this.dropdowns[dropdownIndex][0].name;
	}
	updateModel(value, callback) {
		// Update the value
		this.ngModel = value;
	}
}
MerchandiseHierarchySelection.$inject = ['$scope'];
