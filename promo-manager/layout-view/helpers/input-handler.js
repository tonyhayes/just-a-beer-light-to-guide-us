import MathUtil from './math-util';
import Util from 'helpers/util';
import Consts from 'helpers/consts';
import LayoutConsts from '../layout-view-consts';
import CardUi from './card-ui';
import LayoutVersionFormatter from './layout-version-formatter';
//import angular from 'angular';

// const angularRef = window.angular;
// const $ = angularRef.element;

export default class InputHandler {
	constructor(pageUi, viewport, layoutView, inputEvents, layoutViewCamera) {
		this.pageUi = pageUi;
		this.viewport = viewport;
		this.layoutView = layoutView
		this.inputEvents = inputEvents;
		this.layoutViewCamera = layoutViewCamera;
        this.dragState = null;
        this.cardObject = null;
        this.X = 0;
        this.Y = 1;


	}

    handleWheelEvent($event) {
        const originalEvent = $event.originalEvent;
        // minor movements - which seems to be around these numbers are ignored
        if(originalEvent.wheelDelta < 4 && originalEvent.wheelDelta > -4){
            return;
        }
        const delta = Math.max(-1, Math.min(1, (originalEvent.wheelDelta || -originalEvent.detail)));
        const containerOffset = $($event.currentTarget).offset();
        const cursorX = originalEvent.pageX - containerOffset.left;
        const cursorY = originalEvent.pageY - containerOffset.top;

        const deltaAmount = LayoutConsts.DELTA_AMOUNT_WHEEL;
        const invDeltaAmount = 1/deltaAmount;

        const camera = this.layoutViewCamera;
        const scaleFactor = (delta < 0) ? invDeltaAmount : deltaAmount;
        camera.scaleAbout(scaleFactor, scaleFactor, 1, cursorX, cursorY, 0);

        if(delta) {
            this.pageUi.updateCameraSpaceCoordinates(this.layoutViewCamera);   // update all page versions
        }
    }

    handleKeyEvent($event) {
        const deltaAmount = LayoutConsts.DELTA_AMOUNT_KEY;
        switch($event.keyCode) {
            case 37:  // left
                this.layoutViewCamera.translate(-deltaAmount, 0, 0);
                break;
            case 39:  // right
                this.layoutViewCamera.translate(deltaAmount, 0, 0);
                break;
            case 38:  // up
                this.layoutViewCamera.translate(0, -deltaAmount, 0);
                break;
            case 40:  // down
                this.layoutViewCamera.translate(0, deltaAmount, 0);
                break;
            default:
                return;
        }
        this.pageUi.updateCameraSpaceCoordinates(this.layoutViewCamera);   // update all page versions
    }

    handleDragStartEvent($event) {
        const originalEvent = $event.originalEvent;
        const target = $event.target;
    // Based on what was selected:
    //   If page grip, then this is a page move
    //   If offer grip (or content?), then this is a offer drag/drop (either cell or global/local clipboard)
    //   If within the hitbox for a draggable cell division (UX tbd)
    //   If null space, then this is a camera drag        
        const viewportTarget = $(target.closest('.viewport'));
        const pageTarget = $(target.closest('.layoutview-pageversion'));
        const blockTarget = $(target.closest('.layoutview-block'));
        const pageGripTarget = $(target.closest('.pageversion-grip'));
        const pageGripMenuTarget = $(target.closest('.pageversion-grip .grip-menu'));
        const offerGripTarget = $(target.closest('.block-offer-grip'));

        if(pageGripMenuTarget.length > 0) {
            const pageVersion = pageGripMenuTarget.scope().pageVersion.pageVersion;
            // increase the z-index of the page
            this.pageUi.setPageIndex(pageVersion, this.layoutViewCamera);

        }else if(pageGripTarget.length > 0) {
            const pageVersion = pageGripTarget.scope().pageVersion.pageVersion;
            this.dragState = {
                origin: [ originalEvent.pageX, originalEvent.pageY ],
                delta: [ 0, 0 ],
                mode: LayoutConsts.MODE_PAGE_DRAG,
                target: pageVersion
            };
            // Moving an object in the z-stack affects ALL pages of a higher z-index
            this.pageUi.setPageIndex(pageVersion, this.layoutViewCamera);

        } else if(offerGripTarget.length > 0) {
            const block = offerGripTarget.scope().block;
            const pageVersion = offerGripTarget.scope().pageVersion;
            // increase the z-index of the page
            this.pageUi.setPageIndex(pageVersion, this.layoutViewCamera);
            this.cardObject = new CardUi(
            	viewportTarget, 
            	originalEvent, 
            	block, 
            	LayoutConsts.MODE_OFFER_DRAG, 
            	this.layoutViewCamera, 
            	this.viewport 
            	);

        } else if(blockTarget.length > 0) {
            const pageVersion = blockTarget.scope().pageVersion;
            // increase the z-index of the page
            this.pageUi.setPageIndex(pageVersion, this.layoutViewCamera);

        } else if(pageTarget.length > 0) {
            const pageVersion = pageTarget.scope().pageVersion;
            // increase the z-index of the page
            this.pageUi.setPageIndex(pageVersion, this.layoutViewCamera);

        } else if(viewportTarget.length > 0) {
            this.dragState = {
                origin: [ originalEvent.pageX, originalEvent.pageY ],
                delta: [ 0, 0 ],
                mode: LayoutConsts.MODE_CAMERA
            };
        }

        Util.insertIntoUniqueSortedArray(this.inputEvents, 'mousemove',  Consts.STRING_COMPARATOR_FUNCTION);
        Util.insertIntoUniqueSortedArray(this.inputEvents, 'mouseleave', Consts.STRING_COMPARATOR_FUNCTION);
        Util.insertIntoUniqueSortedArray(this.inputEvents, 'mouseup',    Consts.STRING_COMPARATOR_FUNCTION);
//      this.clearEvent($event); // causes keydown to be consumed
    }

    handleDragMoveEvent($event) {
        if(this.dragState) {
            this.handleDragState($event);
        }else if(this.cardObject) {
            this.handleCardMove($event);
        }
        this.clearEvent($event);
    }    
    handleDragState($event) {
        const ds = this.dragState;
        if(!ds) return;

        const originalEvent = $event.originalEvent;
        const target = $event.target;

        const dx = originalEvent.pageX - (ds.origin[0] + ds.delta[0]);
        const dy = originalEvent.pageY - (ds.origin[1] + ds.delta[1]);
        ds.delta[0] += dx;
        ds.delta[1] += dy;

        switch(ds.mode) {
            case LayoutConsts.MODE_PAGE_DRAG:
                this.viewport.removeRtreeObjects(ds.target);
                ds.target.position.x += dx;
                ds.target.position.y += dy;
                this.pageUi.updateWorldSpaceCoordinates(ds.target, this.layoutViewCamera);
                this.viewport.insertRtreeObjects(ds.target);
                break;
            case LayoutConsts.MODE_CAMERA:
                this.layoutViewCamera.translate(-dx, -dy, 0);
                this.pageUi.updateCameraSpaceCoordinates(this.layoutViewCamera);
                break;
        }
    }
    handleCardMove($event) {
        const originalEvent = $event.originalEvent;
        const target = $event.target;
        const viewportTarget = $(target.closest('.viewport'));

        switch(this.cardObject.type) {
            case LayoutConsts.MODE_OFFER_DRAG:
                const pageVersion = this.cardObject.move(viewportTarget, originalEvent, this.layoutViewCamera)
                this.pageUi.setPageIndex(pageVersion, this.layoutViewCamera);
                break;
        }
    }
    handleDragStopEvent($event) {
        const originalEvent = $event.originalEvent;
        const target = $event.target;
        const viewportTarget = $(target.closest('.viewport'));

        const ds = this.dragState;
        const card = this.cardObject;
        if (ds){
            switch(ds.mode) {
                case LayoutConsts.MODE_PAGE_DRAG:
                    // UPDATE THE SERVER WITH THE NEW PAGE X,Y,Z position
                    this.layoutView.updatePages(ds.target.prepareForExportPageUpdate(ds.target))
                    break;
                case LayoutConsts.MODE_CAMERA:
                    // UPDATE LOCAL STORAGE (jStorage?)
                    // WITH THE NEW CAMERA POSITION
                    this.layoutViewCamera.save();
                    break;
            }            
        }else if(card){
            card.drop(viewportTarget, originalEvent, this.layoutViewCamera);
        }

        this.cardObject = null;
        this.dragState = null;
        this.clearEvent($event);

        Util.removeFromSortedArray(this.inputEvents, 'mousemove',  Consts.STRING_COMPARATOR_FUNCTION);
        Util.removeFromSortedArray(this.inputEvents, 'mouseleave', Consts.STRING_COMPARATOR_FUNCTION);
        Util.removeFromSortedArray(this.inputEvents, 'mouseup',    Consts.STRING_COMPARATOR_FUNCTION);
    }
    clearEvent(e) {
        e.stopPropagation();
        e.preventDefault();
    }
    getCardObject(){
    	return this.cardObject;
    }

}