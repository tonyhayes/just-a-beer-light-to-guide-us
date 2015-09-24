import Consts from './consts';
export default class Util {
	static binarySearch(a, k, compareFn) {
		if(compareFn == Consts.STRING_COMPARATOR_FUNCTION && !angular.isFunction(compareFn)) {
			compareFn = Util[Consts.STRING_COMPARATOR_FUNCTION];
		}
		if(!angular.isFunction(compareFn)) {
			compareFn = Util.defaultComparator;
		}
		let left = 0;
		let right = a.length-1;
		while(left <= right) {
			let mid = Math.floor(0.5*(left+right)) ;
			let cmp = compareFn(a[mid], k);
			if(cmp < 0) {
				left = mid + 1;
			} else if(cmp > 0) {
				right = mid - 1;
			} else {
				return mid;
			}
		}
		return -(left + 1);
	}

	static getFromSortedArray(a, obj, compareFn) {
		if(compareFn == Consts.STRING_COMPARATOR_FUNCTION && !angular.isFunction(compareFn)) {
			compareFn = Util[Consts.STRING_COMPARATOR_FUNCTION];
		}
		if(!angular.isFunction(compareFn)) {
			compareFn = Util.defaultComparator;
		}
		let searchIdx = Util.binarySearch(a, obj, compareFn);
		if(searchIdx >= 0) {
			return a[searchIdx];
		}
		return undefined;
	}

	static insertIntoSortedArray(a, obj, compareFn) {
		if(compareFn == Consts.STRING_COMPARATOR_FUNCTION && !angular.isFunction(compareFn)) {
			compareFn = Util[Consts.STRING_COMPARATOR_FUNCTION];
		}
		if(!angular.isFunction(compareFn)) {
			compareFn = Util.defaultComparator;
		}

		let searchIdx = Util.binarySearch(a, obj, compareFn);
		let insertIdx = searchIdx >= 0 ? searchIdx : -(searchIdx+1)
		a.splice(insertIdx, 0, obj);
	}
	static insertIntoUniqueSortedArray(a, obj, compareFn) {
		if(compareFn == Consts.STRING_COMPARATOR_FUNCTION && !angular.isFunction(compareFn)) {
			compareFn = Util[Consts.STRING_COMPARATOR_FUNCTION];
		}
		if(!angular.isFunction(compareFn)) {
			compareFn = Util.defaultComparator;
		}

		let searchIdx = Util.binarySearch(a, obj, compareFn);
		if(searchIdx < 0) {
			a.splice(-(searchIdx+1), 0, obj);
		}
	}
	static removeFromSortedArray(a, obj, compareFn) {
		if(compareFn == Consts.STRING_COMPARATOR_FUNCTION && !angular.isFunction(compareFn)) {
			compareFn = Util[Consts.STRING_COMPARATOR_FUNCTION];
		}
		if(!angular.isFunction(compareFn)) {
			compareFn = Util.defaultComparator;
		}

		let searchIdx = Util.binarySearch(a, obj, compareFn);
		if(searchIdx >= 0) {
			return a.splice(searchIdx, 1)[0];
		}
		return false;
	}

	static removeFromUnsortedArray(a, obj) {
		let idx = a.indexOf(obj);
		if(idx >= 0) {
			a.splice(idx, 1);
		}
	}

	// Assumes numeric input
	// Clamps x within the range [min, max]
	static clamp(x, min, max) {
		return Math.max(Math.min(x, max), min);
	}

	// Returns removed element if found or undefined if not found
	static removeElement(array, target) {
		let idx = array.indexOf(target);
		if(idx >= 0) {
			return array.splice(idx, 1);
		}
		return undefined;
	}
	// Returns array with unique elements
	static removeDuplicateElements(array) {
		let a = array;
		for(let i=0; i<a.length; ++i) {
			for(let j=i+1; j<a.length; ++j) {
				if(a[i] === a[j]){
					a.splice(j--, 1);
				}
			}
		}
		return a;
	}
	// merges an array then returns array with unique elements
	static mergeRemoveDuplicateElements(array) {
		let a = array.concat();
		for(let i=0; i<a.length; ++i) {
			for(let j=i+1; j<a.length; ++j) {
				if(a[i] === a[j])
					a.splice(j--, 1);
			}
		}
		return a;
	}

	// Create an es6 version of some ng-tasty services
	static debounce() {
		return function (func, wait, immediate) {
			var args, context, debounceTimeout, timeout;
			debounceTimeout = function() {
				timeout = null;
				if (!immediate) {
					func.apply(context, args);
				}
			};
			return function debounce () {
				context = this;
				args = arguments;
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(debounceTimeout, wait);
				if (callNow) {
					func.apply(context, args);
				}
			};
		};
	}
	static throttle() {
		return function (fn, threshhold, scope) {
			threshhold = threshhold || 250;
			var last, promise;
			return function throttle () {
				var context = scope || this;
				var now = Date.now(),
					args = arguments;
				if (last && now < last + threshhold) {
					// hold on to it
					clearTimeout(promise);
					promise = setTimeout(function throttleTimeout () {
						last = now;
						fn.apply(context, args);
					}, threshhold);
				} else {
					last = now;
					fn.apply(context, args);
				}
			};
		};
	}
	static objectAsMap(data, mapper) {
		let m = new Map();
		angular.forEach(data, function(v, k) {
			m.set(k, angular.isFunction(mapper) ? mapper(v) : v);
		});
		return m;
	}
	// Reverse mapping from [ a, b, c ] to { a: 0, b: 1, c: 2 }
	static arrayAsMap(data) {
		let m = new Map();
		data.forEach((ele, i) => {
			m.set(ele, i);
		});
		return m;
	}
	static camelize(str) {
  		return str.replace(/^([A-Z])|[\s-_](\w)/g, function(match, p1, p2, offset) {
        if (p2) {
        	return p2.toUpperCase();
        }
        return p1.toLowerCase();        
    });
	}
	static defaultComparator(a, b) {
		return a - b;
	}
	static stringComparator(a,b) {
    	return a.localeCompare(b);
	}
}
