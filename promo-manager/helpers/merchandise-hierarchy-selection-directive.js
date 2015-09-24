import MerchandiseHierarchySelection from './merchandise-hierarchy-selection';
import multidropdown from './partials/multidropdownselection.html!text';
//requires html.js plug-in in root
export default function merchandiseHierarchySelection () {
	return {
		restrict: 'A',
		scope: {
			'treeMap': '=',
			'ngModel': '=',
			'defaultLabels': '=',
			'disableSelection': '='
		},
		template: multidropdown,
		controller: MerchandiseHierarchySelection,
        controllerAs: 'ctrl',
        bindToController: true,
	}
}
