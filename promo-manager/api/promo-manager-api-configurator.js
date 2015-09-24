export default function onConfig($provide) {
 
	$provide.decorator('API', $delegate => {
		var API = {
			PromoManager: {
				Common: {},
			}
		};

		API.PromoManager.Common.getVehicleVersionList = function(vehicleId) {
			return $delegate.get('vehicle.version.json.clientVehicleVersionList.action', {
				vehicleId: vehicleId
			});
		};
		API.PromoManager.Common.getChannelList = function() {
			return $delegate.get('promo.planning.getAllImplTypeChannels.action');
		};

		angular.element.extend(true, $delegate, API);
		return $delegate;
	});

}
onConfig.$inject = ['$provide'];