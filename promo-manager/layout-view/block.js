import ChangeRequest from './change-request';
import OfferVersionManager from './offer-version-manager';
import BlockGroupToBlockIdManager from './block-group-to-blockId-manager';
import Util from '../../helpers/util';
import glMatrix from 'gl-matrix';
import LayoutViewConsts from './layout-view-consts';
import PermittedAction from './permitted-action';

const vec4 = glMatrix.vec4;
const mat4 = glMatrix.mat4;

export default class Block {
	constructor(data, page) {
		this.id = data.id;
		this.name = data.name;
		this.color = data.color;
		this.theme = data.theme;
		this.type = LayoutViewConsts.TYPE_BLOCK;
		//context menu
		this.open = false;

		this.u1 = data.u1;
		this.u2 = data.u2;
		this.v1 = data.v1;
		this.v2 = data.v2;
		this.page = page;
		this.hierarchyId = angular.isObject(data.merchandiseHierarchy) ? data.merchandiseHierarchy.id : -1;

// FIXME - this should be a single unique value and not a list???
// double check API spec
		this.blockGroupId = null
		if(data.blockGroupList && data.blockGroupList.length){
			this.blockGroupId = data.blockGroupList[0].id;
		}
		if(data.offerVersion){
			this.offerVersion = new OfferVersionManager(data.offerVersion);
		}
		if(data.changeRequest){
			this.changeRequest = new ChangeRequest(data.changeRequest);
		}
		this.blockGroupMap = new BlockGroupToBlockIdManager();
		angular.forEach(data.blockGroupMap, (bgm, k) => {
			 this.blockGroupMap.addBlockGroup(bgm.id, bgm.name, bgm.blockIdList );
		});
		if(data.permittedActions){
	        this.permittedActions = $.map(data.permittedActions, (name, action) => {
	                        return new PermittedAction(name, action);
	                    });			
		}

	}
	isActiveChangeRequest(rfcStatusMap) {
		let status = null;
		if(!rfcStatusMap){
			if(this.changeRequest) {
				status = this.changeRequest.changeStatusId 
			}
	      	rfcStatusMap = Util.arrayAsMap([status]);      
		}

		return this.changeRequest.isActive(rfcStatusMap);
	}
	hasOffers() {
		if(this.offerVersion){
			return true;
		}
		return false;
	}
	// [ObjectVec4]
	getObjectSpacePoints() {
		return [
			vec4.fromValues(this.u1, this.v1, 0, 1),
			vec4.fromValues(this.u2, this.v2, 0, 1)
		];
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
	calculateWorldSpaceCoordinates(worldTransformMat4) {
		const objectSpacePoints = this.getObjectSpacePoints();
		[ this._worldVec0, this._worldVec1 ] = this.getTransformedPoints(objectSpacePoints, worldTransformMat4);
		[ this._worldX0, this._worldY0, this._worldZ0, ] = this._worldVec0;
		[ this._worldX1, this._worldY1, this._worldZ1, ] = this._worldVec1;
	}
	calculateCameraSpaceCoordinates(cameraMat4) {
		// [Block's CameraVec4] = [CameraMat4] * [Block's WorldVec4]
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
			'z-index': Math.floor(v0[2])
		};
		this.setBlockBorder();
		// FIXME - if subpixel blurring/aliasing is not a problem and all
		// supported browsers can handle the 2d/3d transforms, use that
	}
	setBlockBorder() {
		if(this.u1 == 0){
			this._cameraSpaceStyles['border-left-color'] = 'transparent';
		}
		if(this.u2 == 1){
			this._cameraSpaceStyles['border-right-color'] = 'transparent';
		}
		if(this.v1 == 0){
			this._cameraSpaceStyles['border-top-color'] = 'transparent';
		}
		if(this.v2 == 1){
			this._cameraSpaceStyles['border-bottom-color'] = 'transparent';
		}
	}
    prepareForExportBlockList(newBlock, originalBlock) {
        let dataChange = false;
        let blockToExport = {
            id: newBlock.id
        }
        let x;
        for (x in newBlock) {
            if(originalBlock[x] != newBlock[x] && x != 'merchandiseHierarchy' && x != 'layoutPageGridVersion'){
                dataChange = true;
                blockToExport[x] = newBlock[x];
            }
            if( x == 'merchandiseHierarchy' && originalBlock[x] && originalBlock[x].id != newBlock[x].id){
                dataChange = true;
                blockToExport[x] = newBlock[x];
            }
        }
        if(!dataChange){
            return null;
        }

        return {blockList: [blockToExport]};
    }


}
