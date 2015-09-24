import PermittedAction from './permitted-action';

describe('PermittedAction', () => {
   	it('should maintain a PermittedAction', () => {
        const permittedActions = {
            "add-to-basket":"Add to Basket",
            "dnd-create-version":null,
            "dnd-to-ab":null,
            "dnd-to-pl-ob":null,
            "allocate":null,
            "dnd-ab-to-pl":null,
            "upload":null,
            "plan":"Plan",
            "edit-allocation":"Edit Allocation",
            "edit-theme":null
        }    
  		let pa = new PermittedAction("Add to Basket", "add-to-basket");
      	expect(pa.id).to.equal('add-to-basket');
      	expect(pa.name).to.equal('Add to Basket');
   	});

});