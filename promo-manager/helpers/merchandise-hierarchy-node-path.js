export default function merchandiseHierarchyNodePath () {
	return function (hierarchyId, merchandiseHierarchy){
		if(!merchandiseHierarchy){
			return
		}
		const node = merchandiseHierarchy.getNode(hierarchyId);
		const path = node.getPath();
		let pathName = '';
		angular.forEach(path, (treeNode, i) => {
			if (i + 1 == path.length) {
				pathName += treeNode.name;
			} else {
				pathName += treeNode.name + ' > ';
			}
		});
		return pathName; 
	};
}
