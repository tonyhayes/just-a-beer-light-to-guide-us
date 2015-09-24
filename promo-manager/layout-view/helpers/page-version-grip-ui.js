import glMatrix from 'gl-matrix';
import LayoutViewConsts from '../layout-view-consts';
import LayoutViewUiElement from './layout-view-ui-element';

const vec3 = glMatrix.vec3;
const vec4 = glMatrix.vec4;
const mat4 = glMatrix.mat4;

export default class PageVersionGripUi extends LayoutViewUiElement {
	constructor(pageVersion) {
		super();
		this.pageVersion = pageVersion;
		this.type = LayoutViewConsts.TYPE_PAGE_GRIP;
		//context menu
		this.open = false;
		this.header = this.pageVersion.name;

	}
	calculateWorldSpaceCoordinates(worldTransformMat4) {
		const objectSpacePoints = this.getObjectSpacePoints();
		[ this._worldVec0, this._worldVec1 ] = this.getTransformedPoints(objectSpacePoints, worldTransformMat4);
		[ this._worldX0, this._worldY0, this._worldZ0, ] = this._worldVec0;
		[ this._worldX1, this._worldY1, this._worldZ1, ] = this._worldVec1;
	}
	calculateCameraSpaceCoordinates(cameraMat4) {
		// [Grips's CameraVec4] = [CameraMat4] * [Grip's WorldVec4]
		const worldSpacePoints = this.getWorldSpacePoints();
		[ this._cameraVec0, this._cameraVec1 ] = this.getTransformedPoints(worldSpacePoints, cameraMat4);

		// Convert CameraVec4 into css styles
		const [ v0, v1 ] = [ this._cameraVec0, this._cameraVec1 ];
		this._cameraSpaceStyles = {
			'transform': `translate(${v0[0]}px, ${v0[1]}px)`,
			'-ms-transform': `translate(${v0[0]}px, ${v0[1]}px)`,
			'-webkit-transform': `translate(${v0[0]}px, ${v0[1]}px)`,
			'width':  v1[0] - v0[0] + 1,
			'height': v1[1] - v0[1] + 1,
			'z-index': Math.floor(v0[2]+1)
		};
		// FIXME - if subpixel blurring/aliasing is not a problem and all
		// supported browsers can handle the 2d/3d transforms, use that
	}
	// [ObjectVec4]
	getObjectSpacePoints() {
		const h = LayoutViewConsts.PAGE_GRIP_HEIGHT_FACTOR;
		return [ vec4.fromValues(0, -h, 0, 1), vec4.fromValues(1, 0, 0, 1) ];
	}
	// [WorldVec4]
	getWorldSpacePoints() {
		return [ vec4.clone(this._worldVec0), vec4.clone(this._worldVec1) ];
	}
	// [TransformMat4] * [PointVec4]
	getTransformedPoints(points, transformMat4) {
		return points.map(pointVec4 => {
			return vec4.transformMat4(pointVec4, pointVec4, transformMat4);
		});
	}
	updateStyles(cameraMat4) {
		// based on this.pageVersion, update coordinates
	}
}