export default function onConfig($provide) {
 
	$provide.decorator('API', $delegate => {
		var API = {
			Common: {}
		};

		// Common Calls
		API.Common.getChannelList = function() {
			return $delegate.get('vehicle.channel.getChannelListByUser.action');
		};
		API.Common.getChangeTypeList = function() {
			return $delegate.get('promo.lock.getAllChangeTypes.action');
		};
		API.Common.getMerchandiseHierarchyTreeMap = function(options) {
			return $delegate.post('vehicle.promoMgr.loadMerchandiseMap.action', angular.extend({
				excludeDeleted: true
			}, options));
		};
		API.Common.getMerchandiseHierarchy = function(options) {
			return $delegate.post('merchandisehierarchy.getMerchandiseHierarchy.action', angular.extend({
			}, options));
		};
		API.Common.getUsers = function(userIdList) {
			return $delegate.post('common.user.getUsersById.action', {
				userIdList: userIdList
			});
		};
		API.Common.getUserDepartmentMap = function(userIdList) {
			return $delegate.post('common.user.getUserDepartmentsMap.action');
		};
		API.Common.postMerchandiseHierarchyTreeMap = function(options) {
			return $delegate.post('vehicle.promoMgr.loadMerchandiseMap.action', options);
		};
		API.Common.getStoreMap = function(vehicle) {
			return $delegate.post('vehicle.promoMgr.cpp.json.smd.loadStoreMap.action', {
				vehicleVersionId: vehicle.vehicleVersionId
			});
		};

		angular.element.extend(true, $delegate, API);
		return $delegate;
	});

}
onConfig.$inject = ['$provide'];