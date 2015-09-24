import InputHandler from './input-handler';

describe('InputHandler', () => {
   	it('should maintain the InputHandler', () => {
      	let e = new InputHandler();
      	expect(e.X).to.equal(0);
      	expect(e.Y).to.equal(1);
   	});

});