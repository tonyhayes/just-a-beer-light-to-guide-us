import Util from '../../helpers/util';
import SpreadsGroup from './spreads-group';
import Page from './page';
import LayoutViewConsts from './layout-view-consts';
import PermittedAction from './permitted-action';

export default class LayoutModel {
	constructor(data) {
		const spreadsData = data.pageGroupsMap;
		const layoutVersionData = data.layoutVersionsMap;
		const pageList = data.pageList;

		this.id = data.id;
		this.channelId = data.channelId;
		this.currentPageQuantity = data.currentPageQuantity;
		this.layoutVersionIdList = [];

        if(data.permittedActions){
            this.permittedActions = $.map(data.permittedActions, (name, action) => {
                            return new PermittedAction(name, action);
                        });         
        }

		angular.forEach(layoutVersionData, (marketList, layoutVersionId) => {
			this.layoutVersionIdList.push(layoutVersionId);
		});

		this.layoutVersionsMap = Util.objectAsMap(layoutVersionData);
		this.spreadsMap = Util.objectAsMap(spreadsData, spreadData => {
			return new SpreadsGroup(spreadData);
		});
        //supply page position if not received from host
        const adderX = LayoutViewConsts.ADD_PAGE_X_OFFSET;
        const adderY = LayoutViewConsts.ADD_PAGE_Y_OFFSET;        
        const pageGrip = LayoutViewConsts.ADD_PAGE_Y_PAGE_GRIP_OFFSET;
        const initialXpos = LayoutViewConsts.ADD_PAGE_X_INITIAL_POSITION_DEFAULT
        const initialYpos = LayoutViewConsts.ADD_PAGE_Y_INITIAL_POSITION_DEFAULT
        let k = 0;
		this.pageList = pageList.map(pageData => {
            const xPos = initialXpos + (adderX * pageData.position);
            const yPos = initialYpos + (adderY * pageData.position) + pageGrip;
			return new Page(pageData, xPos, yPos, k++);
		});
	}
	getMarketsByIndex(index) {
		if(this.layoutVersionIdList.length-1 < index || index<0){
			return
		}
		return this.layoutVersionsMap.get(this.layoutVersionIdList[index]);
	}
	getFirstMarketByIndex(index) {
		if(this.layoutVersionIdList.length-1 < index || index<0){
			return
		}
		return this.layoutVersionsMap.get(this.layoutVersionIdList[index])[0];
	}
	getLayoutVersionMap() {
		return this.layoutVersionsMap;
	}
	getLayoutVersionIdList() {
		return this.layoutVersionIdList;
	}
	getLayoutVersionList() {
		return this.layoutVersionIdList.map(id => {
			this.layoutVersionsMap.get(id);
		});
	}
	getLayoutVersionIndex(id){
		const idList = this.getLayoutVersionIdList();
		for (let index = 0; index < idList.length; ++index) {
            if(idList[index] == id){
                return index;
            }
        }
        return null;

	}
	getChannel(){
        return this.channelId;
	}
	addPageToLayout(pageData){
		this.pageList.push(new Page(pageData));
	}
    prepareForExportPageAdd(page, xPos, yPos, zPos, h , w, unit) {

        const format = {
        	position: parseInt(page.index, 10),
            x: xPos,
            y: yPos,
            z: zPos,
            gridVersionList:[{
            	pageWidth: w,
            	pageHeight: h,
            	unit: unit,
            	name: page.pageVersionName
            }]                	
        }
        return format;
    }
    prepareForExportPageLayoutList(id, pages) {

        const layoutPage = [];
        pages.forEach((page) => {
	        const format = {
                id: id,
                position: parseInt(page.index, 10),
            	x: page.x,
            	y: page.y,
            	z: page.z,
                spreadId: null
	        };
            layoutPage.push(format);
        });
        return layoutPage;
    }
    prepareForExportPagesUpdate(pages) {

        const layoutPageList = [];
        pages.forEach((page) => {
	        const format = {
                id: page.id,
                position: parseInt(page.index, 10),
                x: page.position.x,
                y: page.position.y,
                z: page.position.z
 	        };
            layoutPageList.push(format);
        });
        return {layoutPageList:layoutPageList};
    }
    

}