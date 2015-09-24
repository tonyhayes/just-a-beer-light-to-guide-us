import LayoutViewConsts from './layout-view-consts';
export default class ChangeRequest {
	constructor(data) {
		this.rfcId = data.id;
		this.changeStatusId = angular.isObject(data.changeStatus) ? data.changeStatus.id : -1;
	}
	isActive(rfcStatusMap) {
		let activeStatuses = LayoutViewConsts.RFC_CHANGE_REQUEST_STATUS_ACTIVE_LIST.join('|');
		let regex = new RegExp(`^(${activeStatuses})$`);
		return regex.test(rfcStatusMap.get(this.changeStatusId));
	}
}
