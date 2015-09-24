export default function thumbnailCanvasRenderer () {
	return {
		restrict: 'EA',
		scope: {
			'blockList': '=',
		},
        template: "<canvas width='30' height='50'  style='border:1px solid #000000;'/>",
        link: function(scope, element, attrs) {
           	scope.canvas = element.find('canvas')[0];
           	scope.context = scope.canvas.getContext('2d');
	        scope.blockList.forEach(block => {
		        const w = 30;
		        const h = 50;
		        const x = block.u1;
		        const y = block.v1;
		        const width = Math.floor(block.u2*w);
		        const height = Math.floor(block.v2*h);
				scope.context.strokeStyle = "#0000ff";
				scope.context.strokeRect(x, y, width, height);
			});
        }        
    };
}
