export default class MathUtil {

	static lerp(i, a, b) {
	    return (1-i)*a + i*b;
	}
	// i=0.00 => (1-0   )*a + 0.00*b => a
	// i=0.25 => (1-0.25)*a + 0.25*b => 0.75*a + 0.25*b
	// i=1.00 => (1-1   )*a + 1.00*b => b
	static sinEasing(t) {
	    return 0.5 * (Math.sin(t*Math.PI - 0.5*Math.PI) + 1);
	}
// t = current time
// b = start value
// c = change in value
// d = duration
// not tested !
// simple linear tweening - no easing, no acceleration
	static linearTween(t, b, c, d){
		return c*t/d + b;
	}
// quadratic easing in - accelerating from zero velocity
// (I think the way to do squared is to mult by itselsf)
	static easeInQuad (t, b, c, d){
		t /= d;
		return c*t*t + b;
	}
	// quadratic easing out - decelerating to zero velocity
	static easeOutQuad (t, b, c, d){
		t /= d;
		return -c * t*(t-2) + b;
	}
	// quadratic easing in/out - acceleration until halfway, then deceleration
	static easeInOutQuad (t, b, c, d){
		t /= d/2;
		if (t < 1) {
			return c/2*t*t + b;
		}
		t--;
		return -c/2 * (t*(t-2) - 1) + b;
	}
	// cubic easing in - accelerating from zero velocity
	static easeInCubic (t, b, c, d){
		t /= d;
		return c*t*t*t + b;
	}
	// cubic easing out - decelerating to zero velocity
	static easeOutCubic (t, b, c, d){
		t /= d;
		t--;
		return c*(t*t*t + 1) + b;
	}
	// cubic easing in/out - acceleration until halfway, then deceleration
	static easeInOutCubic (t, b, c, d){
		t /= d/2;
		if (t < 1){ 
			return c/2*t*t*t + b;
		}
		t -= 2;
		return c/2*(t*t*t + 2) + b;
	}


}
