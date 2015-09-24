export default class LayoutVersionFormatter {

	static out(page) {
		const blocks = page.blockList.map(block => {

			const output = {
				id: block.id,
				name: block.name,
				color: block.color,
				theme: block.theme,
				u1: block.u1,
				u2: block.u2,
				v1: block.v1,
				v2: block.v2,
		        merchandiseHierarchy: {
		          id: block.hierarchyId
		        },
		        blockGroupList: [{id: block.blockGroupId}]

			}
			if (block.offerVersion){
				output.offerVersion = {
		        	id: block.offerVersion.id,
		        	name: block.offerVersion.name,
			        merchandiseHierarchy: {
			          id: block.offerVersion.hierarchyId
			        },
			        offer: block.offerVersion.offer,
			        offerVersionFeaturedSku: block.offerVersion.offerVersionFeaturedSku
		        };
			}
			if (block.changeRequest){
				output.changeRequest = {
		        	id : block.changeRequest.rfcId,
		        	changeStatus : {id: block.changeRequest.changeStatusId}
		        };
			}
			if(block.blockGroupMap.blockGroups.size){
				output.blockGroupMap = {}
			    for (let [key, value] of block.blockGroupMap.blockGroups.entries()) {
			        output.blockGroupMap[key] = {
			        	id: key,
			        	name: value.name,
			        	blockIdList: value.ids
			        }
			    }				
			}
			return output;
		});

		const format = {
	        "gridVersionMap": {
	        	page: page.id,
	        	name : page.name,
	        	description: page.description,
	        	pageWidth: page.dimension.w,
	        	pageHeight: page.dimension.h,
	        	unit: page.unit,
	        	versionMarketIdList: page.marketIds,
	        	blockList: blocks
	        }

		};
	    return format;
	}

	static gridVersionMap(gridVersionMap, id, page, h, w, unit, marketList){
		gridVersionMap[id] = {
			id: null,
			description: null,
        	pageWidth: w,
        	pageHeight: h,
        	unit: unit,
        	name: page.gridVersionName,
        	versionMarketIdList : marketList
		}
		return gridVersionMap
	}
    static pageVersionUpdate(pageGridVersion, originalPageGridVersion) {
        let dataChange = false;
        let gridVersion = {
            id: pageGridVersion.id
        }
        let x;
        for (x in pageGridVersion) {
            if(originalPageGridVersion[x] != pageGridVersion[x] && x != 'merchandiseHierarchyList'){
                dataChange = true;
                gridVersion[x] = pageGridVersion[x];
            }
            if( x == 'merchandiseHierarchyList' && originalPageGridVersion[x].id != pageGridVersion[x].id){
                dataChange = true;
                gridVersion[x] = pageGridVersion[x];
            }
        }
        if(!dataChange){
            return null;
        }

        return {pageGridVersionList: [gridVersion]};
    }
    static pageVersionDelete(pageId, moveOffers){
        const format = {
            layoutPageList:[{
                id: pageId
            }],
            moveOffersToParkingLot : moveOffers
        }
        return format
    }
    static pageVersionClearTemplate(pageVersionId, moveOffers){
        const format = {
            pageGridVersionList:[{
                id: pageVersionId
            }],
            moveOffersToParkingLot : moveOffers
        }
        return format
    }
    static pageVersionApplyTemplate(template, pageVersionId, moveOffers){
        const format = {
            pageLayoutTempate:{
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
