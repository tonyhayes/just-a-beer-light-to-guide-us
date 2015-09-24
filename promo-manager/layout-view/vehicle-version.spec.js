import VehicleVersion from './vehicle-version';

describe('VehicleVersion', () => {
   	it('should maintain the current vehicle version', () => {
      	let vehicleVersion = {
	        id: 'V1',
	        name: 'version 1',
      	};
  		let vv = new VehicleVersion(vehicleVersion);
      	expect(vv.id).to.equal('V1');
      	expect(vv.name).to.equal('version 1');
   	});

});