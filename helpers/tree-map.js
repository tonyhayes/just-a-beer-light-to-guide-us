import TreeMapNode from './tree-map-node';
export default class TreeMap {
	// initNodeMap:
	//   contains a map of id -> { id, parentId, childIdList }
	//   contains one well-defined key 'root' -> id of the rooted tree
	constructor (initNodeMap, rootId, collapseFn, comparatorFn) {
		this.rootId = rootId;
		this.nodeMap = {};
		this.init(initNodeMap, this.rootId, null, collapseFn, comparatorFn);
	}
	// Recursively walk the tree for all connected elements and return array containing current node
	// at each step if a node is collapsed, instead return the nodes created by the children
	init (initNodeMap, nodeId, parentId, collapseFn, comparatorFn) {
		var node = initNodeMap[nodeId];
		if(nodeId == this.rootId){
			this.nodeMap[this.rootId] = new TreeMapNode(this, node, parentId);
		}

		if(angular.isFunction(collapseFn) && collapseFn(node)) {
			if (!node.childIdList){
				node.childIdList = [];
			}
			// If it's a collapse node, just return the initialized children results instead
			return angular.element.map(node.childIdList, (childId) =>{
				// childId represents the child id under a collapsed parent we want to init
				return this.init(initNodeMap, childId, parentId, collapseFn, comparatorFn);
			});
		}

		var tmNode = this.nodeMap[node.id] = new TreeMapNode(this, node, parentId);
		this.initChildren(initNodeMap, tmNode, collapseFn, comparatorFn);
		return tmNode;

	}
	initChildren(initNodeMap, parentNode, collapseFn, comparatorFn) {
		if (!parentNode.childIdList){
			parentNode.childIdList = [];
		}
		// For each child, initialize them and get their TreeMapNode(s) back
		// Use jQuery's map to flatten list of each child node/nodes
		var includedChildNodes = angular.element.map(parentNode.childIdList, (childId) => {
			return this.init(initNodeMap, childId, parentNode.id, collapseFn, comparatorFn);
		});

		// Sort child nodes if a compareFn is provided
		if(angular.isFunction(comparatorFn)) {
			includedChildNodes.sort(comparatorFn);
		}

		// Index nodes according to their final position
		includedChildNodes.forEach((node, i) => {
			return node.setPosition(i);
		});

		// Resync the childrenId list
		parentNode.childIdList = includedChildNodes.map((node) => {
			return node.id;
		});
	}
	// Get tree root id
	getRootId() {
		return this.rootId;
	}
	// Get a promise to root node
	getRootNode () {
		return this.getNode(this.rootId);
	}
	// Get promise to arbitrary tree node
	getNode(nodeId) {
		return this.nodeMap[nodeId];
	}

}

