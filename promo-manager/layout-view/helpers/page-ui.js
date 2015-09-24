import LayoutConsts from '../layout-view-consts';
import glMatrix from 'gl-matrix';
import PageVersion from '../page-version';
import Block from '../block';
const vec4 = glMatrix.vec4;
const mat4 = glMatrix.mat4;
export default class PageUi {
	constructor(selectedLayoutVersionIndex, layoutModel, marketToPageVersionIdManager, pageVersions, viewport) {
        this.selectedLayoutVersionIndex = selectedLayoutVersionIndex;
        this.layoutModel = layoutModel;
        this.marketToPageVersionIdManager = marketToPageVersionIdManager;
        this.pageVersions = pageVersions;
        this.viewport = viewport;
	}
    movePageToTop(topPageVersion) {
        if(!topPageVersion){
            return;
        }
        const pageVersionList = this.getPageVersionsForSelectedLayoutVersion();
        pageVersionList.filter(pageVersion => {
            return pageVersion.position.z > topPageVersion.position.z;
        }).map(pageVersion => {
            return --pageVersion.position.z;
        });
        topPageVersion.position.z = pageVersionList.length-1;
    }
    updateCameraSpaceCoordinates(...objects) {
        const camera = objects.pop();
        const camMat4 = camera.getMatrix();
        (objects.length > 0 ? objects : this.getPageVersionsForSelectedLayoutVersion()).forEach(obj => {
            if(angular.isFunction(obj.calculateCameraSpaceCoordinates)){
                obj.calculateCameraSpaceCoordinates(camMat4);
            }else{
                obj.forEach(o =>{
                    o.calculateCameraSpaceCoordinates(camMat4);
                })
            }
        });
    }
    updateWorldSpaceCoordinates(...objects) {
        const camera = objects.pop();
        (objects.length > 0 ? objects : this.getPageVersionsForSelectedLayoutVersion()).forEach(obj => {
            if(angular.isFunction(obj.calculateWorldSpaceCoordinates)){
                obj.calculateWorldSpaceCoordinates();
            }else{
                obj.forEach(o =>{
                    o.calculateWorldSpaceCoordinates();
                })
            }
        });
        objects.push(camera)
        this.updateCameraSpaceCoordinates(...objects);
    }
    setPageIndex(pageVersion, camera){
        if(!pageVersion){
            return;
        }
        const pageVersions = this.getPageVersionsForSelectedLayoutVersion();
        const affectedPageVersions = this.getPageVersionsAbove(pageVersion);
        affectedPageVersions.push(pageVersion);
        this.viewport.removeRtreeObjects(affectedPageVersions);
        this.movePageToTop(pageVersion);
        this.updateWorldSpaceCoordinates(affectedPageVersions, camera);
        this.viewport.insertRtreeObjects(affectedPageVersions);
    }

    getPageVersionsForSelectedLayoutVersion() {
        const layoutVersionIndex = this.selectedLayoutVersionIndex;
        const marketId = this.layoutModel.getFirstMarketByIndex(layoutVersionIndex);
        const pageVersionIds = this.marketToPageVersionIdManager.getPageVersionIds(marketId);
        const pageVersions = pageVersionIds.map(pageVersionId => {
            const pv = this.pageVersions.get(pageVersionId);
            if(pv){
                return pv;                
            }
        });
        return pageVersions;
    }

    getPageVersionsAbove(topPageVersion){
        if(!topPageVersion){
            return;
        }
        const z = topPageVersion.position.z
        const pageVersionList = this.getPageVersionsForSelectedLayoutVersion();
        return pageVersionList.filter(pageVersion => {
            return pageVersion.position.z > topPageVersion.position.z;
        });
    }
    getLastPageNumber(){
        const max = [];
        const pageVersionList = this.getPageVersionsForSelectedLayoutVersion();
        pageVersionList.forEach(pageVersion => {
            max.push(pageVersion.getPageNumber());
        });
        // de-facto resig
        return Math.max.apply( Math, max );
    }
    getLastZindexNumber(){
        const max = [];
        const pageVersionList = this.getPageVersionsForSelectedLayoutVersion();
        pageVersionList.forEach(pageVersion => {
            max.push(pageVersion.getZindex());
        });
        // de-facto resig
        return Math.max.apply( Math, max );
    }
    getPageVersionDetails(){
        const ids = [];
        const pageVersionList = this.getPageVersionsForSelectedLayoutVersion();
        pageVersionList.forEach(pageVersion => {
            ids.push({id: pageVersion.getPageId(), index: pageVersion.getPageNumber(), name: pageVersion.getPageName(), position: pageVersion.getPos()});
        });
        return ids;
    }
    getPageVersionDetailsForVersionId(pageVersionId){
        const pageInformation = {};
        const pageVersionList = this.getPageVersionsForSelectedLayoutVersion();
        pageVersionList.forEach(pageVersion => {
            if(pageVersionId == pageVersion.id){
               pageInformation.id = pageVersion.getPageId();
               pageInformation.index = pageVersion.getPageNumber();
               pageInformation.name = pageVersion.getPageName();
               pageInformation.position = pageVersion.getPos();            
            }
        });
        return pageInformation;
    }

 
}