import Camera from './layout-view-camera';

describe('Camera', () => {
   it('should maintain the current Camera', () => {
      let camera = new Camera();
      const matrix = camera.getMatrix(); 
      camera.save();
      const savedMatrix = camera.restore();
      expect(savedMatrix[0]).to.equal(matrix[0]);
      expect(savedMatrix[1]).to.equal(matrix[1]);
      expect(savedMatrix[2]).to.equal(matrix[2]);
      expect(savedMatrix[3]).to.equal(matrix[3]);
      expect(savedMatrix[4]).to.equal(matrix[4]);
      expect(savedMatrix[5]).to.equal(matrix[5]);
      expect(savedMatrix[6]).to.equal(matrix[6]);
      expect(savedMatrix[7]).to.equal(matrix[7]);
      expect(savedMatrix[8]).to.equal(matrix[8]);
      expect(savedMatrix[9]).to.equal(matrix[9]);
      expect(savedMatrix[10]).to.equal(matrix[10]);
      expect(savedMatrix[11]).to.equal(matrix[11]);
      expect(savedMatrix[12]).to.equal(matrix[12]);
      expect(savedMatrix[13]).to.equal(matrix[13]);
      expect(savedMatrix[14]).to.equal(matrix[14]);
      expect(savedMatrix[15]).to.equal(matrix[15]);
      camera.delete();
   });

});