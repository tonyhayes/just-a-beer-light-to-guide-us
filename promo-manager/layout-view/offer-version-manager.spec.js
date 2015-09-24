import OfferVersionManager from './offer-version-manager';

describe('OfferVersionManager', () => {
    it('should maintain an offer', () => {
        let offer = {
            id: 1,
            name: 'offer version 1',
            merchandiseHierarchy: {id:456},
            offer: {
                  id: 1,
                  decsription: 'christmas stuffing'
            },
            offerVersionFeaturedSku: {
                  id: 1,
                  sku: {
                        imageId: 23
                  }
            }
        };
        let o = new OfferVersionManager(offer);
        expect(o.id).to.equal(1);
        expect(o.name).to.equal(offer.name);
    });
    it('should maintain an offer merchandiseHierarchy', () => {
        let offer = {
            id: 1,
            name: 'offer version 1',
            merchandiseHierarchy: {id:456},
            offer: {
                  id: 1,
                  decsription: 'christmas stuffing'
            },
            offerVersionFeaturedSku: {
                  id: 1,
                  sku: {
                        imageId: 23
                  }
            }
        };
        let o = new OfferVersionManager(offer);
        expect(o.hierarchyId).to.equal(offer.merchandiseHierarchy.id);
    });
    it('should getOffer', () => {
        let offer = {
            id: 1,
            name: 'offer version 1',
            merchandiseHierarchy: {id:456},
            offer: {
                  id: 1,
                  decsription: 'christmas stuffing'
            },
            offerVersionFeaturedSku: {
                  id: 1,
                  sku: {
                        imageId: 23
                  }
            }
        };
        let o = new OfferVersionManager(offer);
        expect(o.getOffer().decsription).to.equal(offer.offer.decsription);
    });
    it('should getOfferVersionFeaturedSku', () => {
        let offer = {
            id: 1,
            name: 'offer version 1',
            merchandiseHierarchy: {id:456},
            offer: {
                  id: 1,
                  decsription: 'christmas stuffing'
            },
            offerVersionFeaturedSku: {
                  id: 1,
                  sku: {
                        imageId: 23
                  }
            }
        };
        let o = new OfferVersionManager(offer);
        expect(o.getOfferVersionFeaturedSku().sku.imageId).to.equal(23);
    });

});