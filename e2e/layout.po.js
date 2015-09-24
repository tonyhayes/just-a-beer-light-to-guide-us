//http://ramonvictor.github.io/protractor/slides/#/31
var LayoutPage = function() {
  // this.nameInput = element(by.model('yourName'));
  // this.greeting = element(by.binding('yourName'));

    this.get = function() {
        browser.get('/');
    };

    this.setName = function(name) {
        this.nameInput.sendKeys(name);
    };

    this.getPageObjects = function() {
        return element.all(by.repeater('pageVersion in ctrl.getPagesInViewport()'));
    };

    this.getVersionName = function(){
        return element( by.model('ctrl.LayoutView.selectedVehicleVersion.id') )    
    }
    this.getLayoutVersionOptions = function(){
        return element.all(by.options('version as version for version in ctrl.LayoutView.layoutModel.getLayoutVersionIdList()'))    
    }
    this.getVersionOptions = function(){
        return element.all(by.options('version.id as version.name for version in ctrl.LayoutView.vehicleVersions'))    
    }
    this.selectVechileVersionOption = function(){
        var select = element(by.model('ctrl.LayoutView.selectedVehicleVersion.id'));
        select.$('[value="number:27399"]').click();
        return element(by.model('ctrl.LayoutView.selectedVehicleVersion.id')).$('option:checked').getText();
    }
    this.selectLayoutVersionOption = function(){
        var select = element(by.model('ctrl.LayoutView.selectedLayoutVersionId'));
        select.$('[value="string:3"]').click();
        return element(by.model('ctrl.LayoutView.selectedLayoutVersionId')).$('option:checked').getText();
    }
    this.getMerchandiseHierarchyId = function(){
        return element(by.model('ctrl.merchandiseHierarchyId'))    
    }


};
module.exports = LayoutPage;