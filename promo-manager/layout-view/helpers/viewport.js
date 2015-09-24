import rbush from 'rbush';
import glMatrix from 'gl-matrix';
import PageVersion from '../page-version';
import PageVersionGripUi from './page-version-grip-ui';
import LayoutViewConsts from '../layout-view-consts';

const vec4 = glMatrix.vec4;
const mat4 = glMatrix.mat4;

export default class Viewport {
	constructor() {
        this.layoutTree = new rbush(9, [
            '._worldX0', '._worldY0',
            '._worldX1', '._worldY1'
        ]);
	}
    getPagesInViewport(cameraToWorldMat4, viewport) {
        const pages = this.layoutTree.search(this.getViewport(cameraToWorldMat4, viewport));
        return pages.filter(page =>{
           return page instanceof PageVersion || page instanceof PageVersionGripUi;
        });

    }
    getViewport(cameraToWorldMat4, viewport) {
        //calculate the area x and y
        const w = viewport.width();
        const h = viewport.height();
        const viewportP0Vec4 = vec4.fromValues(0, 0, 0, 1);
        const viewportP1Vec4 = vec4.fromValues(w, h, 0, 1);

        const [ vx0, vy0 ] = vec4.transformMat4(viewportP0Vec4, viewportP0Vec4, cameraToWorldMat4);
        const [ vx1, vy1 ] = vec4.transformMat4(viewportP1Vec4, viewportP1Vec4, cameraToWorldMat4);
        return[ vx0, vy0, vx1, vy1 ];


    }
	contains(v){
        return this.layoutTree.search([v[0], v[1], v[0], v[1]]);
	}
    insertRtreeObjects(...objects) {
    	const layoutTree = this.layoutTree;
        objects.forEach(obj => {
            if(angular.isFunction(obj.calculateWorldSpaceCoordinates)){
                if(obj.type == LayoutViewConsts.TYPE_PAGE){
                    layoutTree.insert(obj);
                    layoutTree.insert(obj.ui.grip);
                    obj.blockList.forEach(block => {
                        layoutTree.insert(block);
                    });
                }

            }else{
                obj.forEach(o =>{
                    if(o.type == LayoutViewConsts.TYPE_PAGE){
                        layoutTree.insert(o);
                   		layoutTree.insert(o.ui.grip);
                        o.blockList.forEach(block => {
                            layoutTree.insert(block);
                        });
                    }
                })
            }
        });
    }
    removeRtreeObjects(...objects) {
    	const layoutTree = this.layoutTree;
        objects.forEach(obj => {
            if(angular.isFunction(obj.calculateWorldSpaceCoordinates)){
                if(obj.type == LayoutViewConsts.TYPE_PAGE){
                    layoutTree.remove(obj);
                   	layoutTree.remove(obj.ui.grip);
                    obj.blockList.forEach(block => {
                        layoutTree.insert(block);
                    });
                }
            }else{
                obj.forEach(o =>{
                    if(o.type == LayoutViewConsts.TYPE_PAGE){
                        layoutTree.remove(o);
                   		layoutTree.remove(o.ui.grip);
                        o.blockList.forEach(block => {
                            layoutTree.remove(block);
                        });
                    }
                })
            }
        });
    }
    clearRtreeObjects () {
        this.layoutTree.clear();
    }

}