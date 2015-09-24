export default class OfferVersionManager {

  constructor(data) {
    let offer = data.offer;
    let offerVersionFeaturedSku = data.offerVersionFeaturedSku;
    //context menu
    this.open = false;

    this.id = data.id;
    this.offer = angular.isObject(offer) ? offer : null;
    this.offerVersionFeaturedSku = angular.isObject(offerVersionFeaturedSku) ? offerVersionFeaturedSku : null;
    this.name = data.name;
    this.hierarchyId = data.merchandiseHierarchy  ? data.merchandiseHierarchy.id  : -1;
  }

  getOffer() {
    return this.offer;
  }

  getOfferVersionFeaturedSku() {
    return this.offerVersionFeaturedSku;
  }
}