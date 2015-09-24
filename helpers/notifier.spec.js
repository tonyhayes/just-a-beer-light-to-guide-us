import Notifier from './notifier';
import {mainModule} from '../promo-manager/layout-view/test';
import mocks from 'angular-mocks';

describe('Notifier', () => {
    let $translate;
    let mySpy = sinon.spy();
    beforeEach(angular.mock.module(mainModule.name));
    beforeEach(angular.mock.inject(function( _$translate_){
        $translate = _$translate_;
    }));
   	// it('should maintain a notification object with a standard configuration', () => {
    //     let n = new Notifier($translate);
    //     expect(n.toastr.options.closeButton).to.equal(false);
    //     expect(n.toastr.options.debug).to.equal(false);
    //     expect(n.toastr.options.positionClass).to.equal('toast-bottom-right');
    //     expect(n.toastr.options.onclick).to.equal(null);
    //     expect(n.toastr.options.showDuration).to.equal('1000');
    //     expect(n.toastr.options.hideDuration).to.equal('1000');
    //     expect(n.toastr.options.timeOut).to.equal('5000');
    //     expect(n.toastr.options.extendedTimeOut).to.equal('1000');
    //     expect(n.toastr.options.showEasing).to.equal('swing');
    //     expect(n.toastr.options.hideEasing).to.equal('linear');
    //     expect(n.toastr.options.showMethod).to.equal('fadeIn');
    //     expect(n.toastr.options.hideMethod).to.equal('fadeOut');
   	// });
    it('should send a info notification', () => {
        let n = new Notifier($translate);
        mySpy = sinon.spy(n, 'notify');
        n.notify('body', 'title');
        expect(mySpy.calledOnce).to.be.true;
    });
    it('should send a info notification - explict', () => {
        let n = new Notifier($translate);
        mySpy = sinon.spy(n, 'notify');
        n.notify('body', 'title', 'info');
        expect(mySpy.calledOnce).to.be.true;

    });
    it('should send a warning notification', () => {
        let n = new Notifier($translate);
        mySpy = sinon.spy(n, 'notify');
        n.notify('body', 'title', 'warning');
        expect(mySpy.calledOnce).to.be.true;

    });
    it('should send an error notification', () => {
        let n = new Notifier($translate);
        mySpy = sinon.spy(n, 'notify');
        n.notify('body', 'title', 'error');
        expect(mySpy.calledOnce).to.be.true;

    });
    it('should translate and send an info notification', () => {
        let n = new Notifier($translate);
        mySpy = sinon.spy(n, 'info');
        n.info('LAYOUT_VIEW_DATA_ERROR');
        expect(mySpy.calledOnce).to.be.true;

    });
    it('should translate and send an errorWith notification', () => {
        let n = new Notifier($translate);
        mySpy = sinon.spy(n, 'errorWith');
        n.errorWith('LAYOUT_VIEW_DATA_ERROR');
        expect(mySpy.calledOnce).to.be.true;

    });
    it('should translate and send an error notification', () => {
        let n = new Notifier($translate);
        mySpy = sinon.spy(n, 'error');
        n.error('LAYOUT_VIEW_DATA_ERROR');
        expect(mySpy.calledOnce).to.be.true;

    });
    it('should translate and send a warning notification', () => {
        let n = new Notifier($translate);
        mySpy = sinon.spy(n, 'warn');
        n.warn('LAYOUT_VIEW_DATA_ERROR');
        expect(mySpy.calledOnce).to.be.true;

    });

});

