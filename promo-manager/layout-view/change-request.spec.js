import ChangeRequest from './change-request';
import Util from '../../helpers/util';

describe('ChangeRequest', () => {
    it('should maintain a ChangeRequest', () => {
        let changeRequest = {
            id: 1,
            changeStatus: {
                id: 1
            },
        };
        let cr = new ChangeRequest(changeRequest);
        expect(cr.rfcId).to.equal(1);
        expect(cr.changeStatusId).to.equal(1);
    });
    it('should find an active ChangeRequest', () => {
        let changeRequest = {
            id: 1,
            changeStatus: {
                id: 1
            },
        };
        let cr = new ChangeRequest(changeRequest);
        let rfcStatusMap = Util.arrayAsMap([1,2,3,4])      
        expect(cr.isActive(rfcStatusMap)).to.equal(true);
        expect(cr.changeStatusId).to.equal(1);
    });
    it('should not find an active ChangeRequest', () => {
        let changeRequest = {
            id: 1,
            changeStatus: {
                id: 1
            },
        };
        let cr = new ChangeRequest(changeRequest);
        let rfcStatusMap = new Map();     
        expect(cr.isActive(rfcStatusMap)).to.equal(false);
        rfcStatusMap = Util.arrayAsMap([7,-7,9,4]);      
        expect(cr.isActive(rfcStatusMap)).to.equal(false);
    });

});