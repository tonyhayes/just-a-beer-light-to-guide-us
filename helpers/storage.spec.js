import Storage from './storage';

describe('local storage service', function() {

    it('should add an item to local storage', function() {  
        Storage.setRecord('tony', 'zzz');
        const item = Storage.getRecord('tony');
        expect(item).to.equal('zzz');
    });

    it('should update an item to local storage', function() { 
        Storage.setRecord('tony', 'yyy');
        const item = Storage.getRecord('tony');
        expect(item).to.equal('yyy');
    });
    it('should remove an item to local storage', function() {
        Storage.deleteRecord('tony');
        const item = Storage.getRecord('tony');
        expect(item).to.equal(undefined);
    });
});  
