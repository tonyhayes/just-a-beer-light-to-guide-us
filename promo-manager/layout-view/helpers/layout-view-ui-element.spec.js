import LayoutViewUiElement from './layout-view-ui-element';

describe('LayoutViewUiElement', () => {
	it('should maintain the current LayoutViewUiElement', () => {
		let ui = new LayoutViewUiElement();
		expect(ui).to.have.property('_worldVec0');
		expect(ui).to.have.property('_worldVec1');
		expect(ui).to.have.property('_cameraSpaceStyles');
		expect(ui).to.have.property('updateStyles');
		expect(ui).to.have.property('getObjectSpacePoints');
		expect(ui).to.have.property('calculateWorldSpaceCoordinates');
	});

});