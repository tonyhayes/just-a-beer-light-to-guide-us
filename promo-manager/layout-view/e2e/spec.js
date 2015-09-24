//protractor protractor.conf
//http://ramonvictor.github.io/protractor/slides/
const LayoutPage = require('./layout.po.js');
describe('layout page', function() {
    const layoutPage = new LayoutPage();
    const driver = browser.driver;
    it('should display pages and blocks and grips', function() {
        layoutPage.get();

        const pages = layoutPage.getPageObjects();
        expect(pages.count()).toEqual(18);
        expect(pages.get(1).getText()).toContain('PV id: 303 Page 3');
    });
    it('should get the version name', function() {
        const versionName = layoutPage.getVersionName().getText();
        expect(versionName).toContain('Base');
    });
    it('should get the layout version options', function() {
        const options = layoutPage.getLayoutVersionOptions();
        expect(options.count()).toEqual(4);
        expect(options.first().getText()).toEqual('1');
    });
    it('should get the vehicle version options', function() {
        const selected = layoutPage.selectVechileVersionOption()
        expect(selected).toEqual('V1');
    });
    it('should get the layout version options', function() {
        const selected = layoutPage.selectLayoutVersionOption()
        expect(selected).toEqual('3');
    });
    // it('should get the merchandiseHierarchyId', function() {
    //   const mh = layoutPage.getMerchandiseHierarchyId();
    //   expect(mh).toEqual(1);
    // });

    it('should move a page', function() {
        driver.actions()
            .mouseDown(element(by.css('.pageversion-grip')))
            .mouseMove(element(by.css('.pageversion-grip',{x:55, y:55})))
            .mouseUp()
            .perform();
        driver.sleep(2000);
    // element(by.model('greetMe')).clear().sendKeys('protractor');

    // expect(element(by.css('#greet')).getText()).toEqual('hello protractor');
    });
});
