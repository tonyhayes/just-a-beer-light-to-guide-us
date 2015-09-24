import MerchandiseHierarchySelection from './merchandise-hierarchy-selection';
import multidropdown from './partials/multidropdownselectionform.html!text';
//requires html.js plug-in in root
export default function merchandiseHierarchySelectionForm () {
	return {
		restrict: 'A',
		scope: {
			'treeMap': '=',
			'ngModel': '=',
			'defaultLabels': '=',
			'formLabels': '=',
			'disableSelection': '='
		},
		template: multidropdown,
		controller: MerchandiseHierarchySelection,
        controllerAs: 'ctrl',
        bindToController: true,
	}
}
