import LayoutConsts from '../layout-view-consts';
import glMatrix from 'gl-matrix';
import PageVersion from '../page-version';
import Block from '../block';
const vec4 = glMatrix.vec4;
const mat4 = glMatrix.mat4;
export default class CardUi {
	constructor(viewportTarget, originalEvent, src, type, camera, viewport) {
        this.type = type;
        this.src = src;
		this.viewport = viewport;
        this.updateWorldCoordEndVector(viewportTarget, originalEvent, camera);
        this.worldCoordStartVec4 = angular.copy(this.worldCoordEndVec4);
        this.update(camera); 
	}

    move(viewportTarget, originalEvent, camera) {
        this.updateWorldCoordEndVector(viewportTarget, originalEvent, camera);
        this.update(camera);
        const pageVersion = this.updateHoverState(this.viewport);
        return pageVersion;
    }
    drop(viewportTarget, originalEvent, camera) {
        this.update(camera);
        this.dropCard(viewportTarget, originalEvent, camera)
    }
    update(camera) {

        const worldToCameraMat4 = camera.getMatrix();
        const cameraSpaceCursorVec4 = vec4.transformMat4(vec4.create(), this.worldCoordEndVec4, worldToCameraMat4);
        const cameraSpaceCardTopLeftVec4 = vec4.fromValues(-0.5*LayoutConsts.DRAGCARD_WIDTH, -0.5*LayoutConsts.DRAGCARD_HEIGHT, LayoutConsts.INT_32_MAX, 0);
        const c0 = vec4.add(cameraSpaceCardTopLeftVec4, cameraSpaceCardTopLeftVec4, cameraSpaceCursorVec4);

        this._cameraSpaceStyles = {
            'transform': `translate(${c0[0]}px, ${c0[1]}px)`,
            '-ms-transform': `translate(${c0[0]}px, ${c0[1]}px)`,
            '-webkit-transform': `translate(${c0[0]}px, ${c0[1]}px)`,
    //        'z-index': `${c0[2]}`
        };
    }
    /*
    On resolving card action:
      Perform rtree search on worldCoordEndVec4 +/- hitbox depending on the initiated action (i.e. 'type')
        usually this will be a single point (x, y, w=0~1, h=0~1) directly under the cursor
      Dispatch to an appropriate handler based on source object logic (e.g. PageVersion or Offer)
        Dispatch provides a function which takes 'hitboxX', 'hitboxY' as parameters and returns the
        search results around the worldCoordEndVec4 which the handler can sort (e.g. z-position) and
        filter by type (e.g. only interested in PageVersions) to decide whether the target is a valid
        destination
        If handler finds a valid destination, execute the action
          e.g. copy offer, move offer, replace offer, copy to clipboard
          Also update the rtree if any object was moved/relocated
          Update styles on modified objects
        If handler finds no valid destination, revert the action (e.g. same as escape)
      // Future: queue up an animation show revert of the card back to original location fading to opacity: 0

     */
    dropCard(viewportTarget, originalEvent, camera){
        this.updateWorldCoordEndVector(viewportTarget, originalEvent, camera);

        const v = this.worldCoordEndVec4;
        const contains = this.viewport.contains(v);

        if(!contains.length){
            return;
        }
        // determine if target is an eligible drop candidate
        const target = this.selectCardDropTarget(contains);
        if(target){
            //transfer the content contained in the card to the the new home
            // and send to server
            this.transferCardContents(target);
        }
    }
    updateHoverState(){
        const v = this.worldCoordEndVec4;
        const contains = this.viewport.contains(v);

        if(!contains.length){
            return;
        }
        const pageVersion = contains.filter(page =>{
            return page instanceof PageVersion;
        });
        if(!pageVersion.length){
            return;
        }
        pageVersion.sort((a,b)=>{
            return a._worldZ1 < b._worldZ1;
        })
        // if more than one, select the page with the highest z-index
        return pageVersion[0];        
    }
    /*
    On card dragging:
      Project camera-space coordinates (pageX, pageY) minus viewport offset (top,left) multiplied by cameraInverse
        to get updated world space coordinates of cursor
      set drag-action object's worldCoordEndVec4
      // Future: screen-edge panning
      // Future: page-stack reordering based on user dragging over an object

     */

    // Calculate camera-space extent of the drag card centered around the cursor
    updateWorldCoordEndVector(viewportTarget, originalEvent, camera){
        const viewportOffset = viewportTarget.offset();
        const cameraToWorldMat4 = camera.getInverse();
        const viewportX = originalEvent.pageX - viewportOffset.left;
        const viewportY = originalEvent.pageY - viewportOffset.top;
        const cameraSpaceCursorVec4 = vec4.fromValues(viewportX, viewportY, 0, 1);
        const worldSpaceCursorVec4 = vec4.transformMat4(vec4.create(), cameraSpaceCursorVec4, cameraToWorldMat4);
        this.worldCoordEndVec4 = worldSpaceCursorVec4;
    }
    selectCardDropTarget(dropZone) {
        //currently only offers are dropped, and are dropped into a block
        if(!dropZone){
            return;
        }
        // get card content type;
        // offer can be dropped into a block
        const type = this.type;
        if(type == LayoutConsts.MODE_OFFER_DRAG){
            const offer = this.src.offerVersion;
            //filter blocks only
            const blocks = dropZone.filter(block =>{
                return block instanceof Block;
            });
            if(!blocks.length){
                return;
            }
            blocks.sort((a,b)=>{
                return a._worldZ1 < b._worldZ1;
            })
            const block = blocks[0];
            if(block.hierarchyId != -1 && block.hierarchyId != offer.hierarchyId){
                return;
            }
            if(block.offerVersion && block.offerVersion.id){
                return;
            }
            return block;
        }
 
    }
    transferCardContents(target){
        const offer = angular.copy(this.src.offerVersion);
        delete this.src.offerVersion;
        target.offerVersion = offer;

        //updating the block hierarchy leave the problem of what to do if the offer is
        //moved (has implications for filtering)
//        target.hierarchyId = offer.hierarchyId;

        //send to server
        

    }
}