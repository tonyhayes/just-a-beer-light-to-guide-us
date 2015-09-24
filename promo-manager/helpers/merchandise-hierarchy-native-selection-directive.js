import MerchandiseHierarchySelection from './merchandise-hierarchy-selection';
import multidropdown from '../partials/multidropdownnativeselection.html!text';
//requires html.js plug-in in root
function merchandiseHierarchyNativeSelection () {
	return {
		restrict: 'A',
		scope: {
			'treeMap': '=',
			'ngModel': '=',
			'defaultLabels': '=',
			'disableSelection': '='
		},
		template: multidropdown,
        controllerAs: 'ctrl',
        bindToController: true,
		controller: MerchandiseHierarchySelection

	}
}
export default merchandiseHierarchyNativeSelection;
