import glMatrix from 'gl-matrix';
import Storage from 'helpers/storage';
import LayoutConsts from './layout-view-consts';

const vec3 = glMatrix.vec3;
const vec4 = glMatrix.vec4;
const mat4 = glMatrix.mat4;

class Camera {
	constructor() {
		const restoreMatrix = this.restore();
		if(restoreMatrix){
			this.cameraSpaceMat4 = restoreMatrix;
		}else{
			this.cameraSpaceMat4 = mat4.identity(mat4.create());
		}
	}
	translate(tx, ty, tz) {
		const transform1 = mat4.identity(mat4.create());
		mat4.translate(transform1, transform1, vec4.fromValues(-tx, -ty, -tz, 1));
		mat4.multiply(this.cameraSpaceMat4, transform1, this.cameraSpaceMat4);
	}
	scale(sx, sy, sz) {
		const transform1 = mat4.identity(mat4.create());
		mat4.scale(transform1, transform1, vec4.fromValues(sx, sy, sz, 1));
		mat4.multiply(this.cameraSpaceMat4, transform1, this.cameraSpaceMat4);
	}
	scaleAbout(sx, sy, sz, tx, ty, tz) {
		this.translate(tx, ty, tz);
		this.scale(sx, sy, sz);
		this.translate(-tx, -ty, -tz);
	}
	setPosition(tx, ty, tz) {
		mat4.identity(this.cameraSpaceMat4);
		this.translate(tx, ty, tz);
	}
	getMatrix() {
		return this.cameraSpaceMat4;
	}
    // UPDATE LOCAL STORAGE (jStorage?)
    // WITH THE NEW CAMERA POSITION
	save(){
		Storage.setRecord(LayoutConsts.MODE_CAMERA, this.getMatrix());
	}
	restore(){
		const matrix = Storage.getRecord(LayoutConsts.MODE_CAMERA);
		if (matrix){
			return matrix;
		}
		return null;
	}
	delete(){
		Storage.deleteRecord(LayoutConsts.MODE_CAMERA);
	}
	getInverse(){
		let inverse = mat4.identity(mat4.create());
		mat4.invert(inverse, this.getMatrix());
		return inverse;
	}

	static printMatrix(m) {
		console.log(m[4*0+0], m[4*1+0], m[4*2+0], m[4*3+0])
		console.log(m[4*0+1], m[4*1+1], m[4*2+1], m[4*3+1])
		console.log(m[4*0+2], m[4*1+2], m[4*2+2], m[4*3+2])
		console.log(m[4*0+3], m[4*1+3], m[4*2+3], m[4*3+3])
		console.log('---------------------');
	}
}


export default Camera;