import glMatrix from 'gl-matrix';
import LayoutViewConsts from './layout-view-consts';
import Block from './block';
import BlockGroupToBlockIdManager from './block-group-to-blockId-manager';
import PageVersionGripUi from './helpers/page-version-grip-ui';
import PermittedAction from './permitted-action';

const vec3 = glMatrix.vec3;
const vec4 = glMatrix.vec4;
const mat4 = glMatrix.mat4;

export default class PageVersion {
	constructor(data, page) {
		let blockList = [];
		if(data.blockList){
			blockList = data.blockList;
		}
		this.type = LayoutViewConsts.TYPE_PAGE;
		this.id = data.id;
		this.name = data.name;
		this.description = data.description;
		this.position = page.position;   // Remember to modify BY REFERENCE
		this.dimension = { w: data.pageWidth, h: data.pageHeight, d: 0 };
		this.unit = data.unit;
		this.unitToPixelRatio = LayoutViewConsts.LAYOUT_VIEW_UNITS[this.unit];
		this.marketIds = data.versionMarketIdList;
		this.page = page;  // Parent reference
		this.blockMap = new BlockGroupToBlockIdManager();
		this.blockList = blockList.map(blockData => {
			const block = new Block(blockData, this.page);
			angular.forEach(blockData.blockGroupMap, (bgm, k) => {
			 	this.blockMap.addBlockGroup(bgm.id, bgm.name, bgm.blockIdList);
			});
			return block;
		});
		if(data.permittedActions){
	        this.permittedActions = $.map(data.permittedActions, (name, action) => {
	                        return new PermittedAction(name, action);
	                    });			
		}

		if(this.position.x || this.position.y){
			this.ui = {
				grip: new PageVersionGripUi(this)
			};
		}
	}
	isActiveChangeRequest() {
		return this.blockList.some(block => {
			return block.isActiveChangeRequest();
		});
	}
	hasOffers() {
		return this.blockList.some(block => {
			return block.hasOffers();
		});
	}

	// [ObjectVec4]
	getObjectSpacePoints() {
		return [ vec4.fromValues(0, 0, 0, 1), vec4.fromValues(1, 1, 0, 1) ];
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

	// Calculate world space coordinates for the page and underlying entities 
	// Full calculation:
	//     [CameraVec4] = [CameraMat4] * [TranslateMat4] * [ScaleMat4] * [ObjectVec4]
	// World space step:
	//     [WorldTransformMat4] = [TranslateMat4] * [ScaleMat4]
	//     [WorldVec4] = [WorldTransformMat4] * [ObjectVec4]
	// Camera space step:
	//     [CameraVec4] = [CameraMat4] * [WorldVec4]
	// Note: ObjectVec4 represents the two Vec4's representing the
	// top-left and bottom-right of the entity's rectangle
	calculateWorldSpaceCoordinates(){
		const pos = this.position;
		const dim = this.dimension;
		const unitRatio = this.unitToPixelRatio;
		const worldTransformMat4 = mat4.identity(mat4.create());
		// [WorldTransformMat4] = [TranslateMat4] * [ScaleMat4]
		mat4.translate(worldTransformMat4, worldTransformMat4, vec4.fromValues(pos.x, pos.y, pos.z, 1));
		mat4.scale(worldTransformMat4, worldTransformMat4, vec3.fromValues(dim.w * unitRatio, dim.h * unitRatio, 1));

		// Calculate world space coordinates for [Blocks]
		// [Block's WorldVec4] = [WorldTransformMat4] * [BlockVec4]
		this.blockList.forEach(block => {
			block.calculateWorldSpaceCoordinates(worldTransformMat4);
		});

		// Calculate world space coordinates for the [Page]
		// [Page's WorldVec4] = [WorldTransformMat4] * [PageVec4]
		const objectSpacePoints = this.getObjectSpacePoints();
		[ this._worldVec0, this._worldVec1 ] = this.getTransformedPoints(objectSpacePoints, worldTransformMat4);
		[ this._worldX0, this._worldY0, this._worldZ0, ] = this._worldVec0;
		[ this._worldX1, this._worldY1, this._worldZ1, ] = this._worldVec1;

		//Recalculate Page Version Grip UI World space coordinates
		this.ui.grip.calculateWorldSpaceCoordinates(worldTransformMat4);

	}
	calculateCameraSpaceCoordinates(cameraMat4) {
		// [Block's CameraVec4] = [CameraMat4] * [Block's WorldVec4]
		this.blockList.forEach(block => {
			block.calculateCameraSpaceCoordinates(cameraMat4);
		});

		// [Page's CameraVec4] = [CameraMat4] * [Page's WorldVec4]
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
			// FIXME - if subpixel blurring/aliasing is not a problem and all
			// supported browsers can handle the 2d/3d transforms, use that
		};

		//Recalculate Page Version Grip UI Camera space coordinates
		this.ui.grip.calculateCameraSpaceCoordinates(cameraMat4);
	}
	updateStyles(cameraMat4) {
		this.calculateCameraSpaceCoordinates(cameraMat4);
	}
	getPageNumber() {
		return this.page.getPageNumber();
	}
	isInSpreadGroup() {
		return this.page.isInSpreadGroup();
	}
	getPageName() {
		return this.name;
	}
	getPageId() {
		return this.page.getPageId();
	}
	getPageVersionId() {
		return this.id;
	}
	getZindex() {
		return this.position.z;
	}
	getPosX() {
		return this.position.x;
	}
	getPosY() {
		return this.position.y;
	}
	getPos() {
		return this.position;
	}
    prepareForExportPageUpdate(pageVersion) {

        const format = {
            layoutPageList: [{
                id: pageVersion.page.id,
                position: pageVersion.page.index,
                x: pageVersion.position.x,
                y: pageVersion.position.y,
                z: pageVersion.position.z
            }]

        };
        return format;
    }
    prepareForExportPageVersionUpdate(pageGridVersion, originalPageGridVersion) {
        let dataChange = false;
        let gridVersion = {
            id: pageGridVersion.id
        }
        let x;
        for (x in pageGridVersion) {
            if(originalPageGridVersion[x] != pageGridVersion[x] && x != 'merchandiseHierarchyList' && x != 'layoutPage'){
                dataChange = true;
                gridVersion[x] = pageGridVersion[x];
            }
            if( x == 'merchandiseHierarchyList' && originalPageGridVersion[x] && originalPageGridVersion[x].id != pageGridVersion[x].id){
                dataChange = true;
                gridVersion[x] = pageGridVersion[x];
            }
        }
        if(!dataChange){
            return null;
        }

        return {pageGridVersionList: [gridVersion]};
    }
    prepareForExportPageVersionDelete(pageId, moveOffers){
        const format = {
            layoutPageList:[{
                id: pageId
            }],
            moveOffersToParkingLot : moveOffers
        }
        return format
    }
    prepareForExportPageVersionClearTemplate(pageVersionId, moveOffers){
        const format = {
            pageGridVersionList:[{
                id: pageVersionId
            }],
            moveOffersToParkingLot : moveOffers
        }
        return format
    }
    prepareForExportPageVersionApplyTemplate(template, pageVersionId, moveOffers){
        const format = {
            pageLayoutTemplate:{
              id: template  
            },
            pageGridVersionList:[{
                id: pageVersionId
            }],
            moveOffersToParkingLot : moveOffers
        }
        return format
    }
}