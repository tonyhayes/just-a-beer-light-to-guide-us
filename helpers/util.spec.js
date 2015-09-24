import Util from './util';
import Consts from './consts';

describe('binary search', function() {
    let users = [];
    let found = -1;

    beforeEach(function() {
        users = ['aaa', 'aab', 'abb', 'bbb', 'bbc', 'bcc', 'ccc'];
    });

    it('found should be -8 using user defined comparator', function() {  // i.e. -(found+1) === 7 aka insert position
        found = Util.binarySearch(users, 'zzz', function(a,b) {
            return a.localeCompare(b);
        });
        expect(found).to.equal(-8);
    });

    it('found should be 1 using user defined comparator', function() {  // i.e. insert position
        found = Util.binarySearch(users, 'aab', function(a,b) {
            return a.localeCompare(b);
        });
        expect(found).to.equal(1);
    });
    it('found should be -8 using built in string comparator', function() {  // i.e. -(found+1) === 7 aka insert position
        found = Util.binarySearch(users, 'zzz', Consts.STRING_COMPARATOR_FUNCTION);
        expect(found).to.equal(-8);
    });

    it('found should be 1 using built in string  comparator', function() {  // i.e. insert position
        found = Util.binarySearch(users, 'aab', Consts.STRING_COMPARATOR_FUNCTION);
        expect(found).to.equal(1);
    });
});  
describe('remove Element', function() {
    let users = [];
    let found = -1;

    beforeEach(function() {
        users = ['aaa', 'aab', 'abb', 'bbb', 'bbc', 'bcc', 'ccc'];
    });

    it('found should be 6', function() { 
        found = Util.removeElement(users, 'ccc');
        expect(users).to.have.length(6);
        expect(found.toString()).to.equal('ccc');
    });

    it('found should be 7', function() {  
        found = Util.removeElement(users, 'zzz');
        expect(users).to.have.length(7);
        expect(found).to.equal(undefined);
    });
});
describe('clamp', function() {
    let clamp = -1;


    it('clamp should be 0', function() { 
        clamp = Util.clamp(-5, 0, 10);
        expect(clamp).to.equal(0);
    });

    it('clamp should be 7', function() { 
        clamp = Util.clamp(7, 1, 10);
        expect(clamp).to.equal(7);
    });
    it('clamp should be 8', function() { 
        clamp = Util.clamp(8, 1, 10);
        expect(clamp).to.equal(8);
    });
    it('clamp should be 10', function() { 
        clamp = Util.clamp(10, 1, 10);
        expect(clamp).to.equal(10);
    });
    it('clamp should be 10', function() { 
        clamp = Util.clamp(11, 1, 10);
        expect(clamp).to.equal(10);
    });
}); 

describe('insertIntoUniqueSortedArray', function() {
    let arr = [];
    it('should insert into an array', function() {
        Util.insertIntoUniqueSortedArray(arr, 6);  
        expect(arr.toString()).to.equal('6');
    });
    it('should insert into an array before the last element added', function() {
        Util.insertIntoUniqueSortedArray(arr, 2);  
        expect(arr.toString()).to.equal('2,6');
    });
    it('should insert into an array after the last element', function() {
        Util.insertIntoUniqueSortedArray(arr, 12);  
        expect(arr.toString()).to.equal('2,6,12');
    });
    it('should not insert into an array a duplicate', function() {
        Util.insertIntoUniqueSortedArray(arr, 12);  
        expect(arr.toString()).to.equal('2,6,12');
    });
});

describe('insertIntoSortedArray', function() {      
    let arr = [];
    it('should insert into an array', function() {
        Util.insertIntoSortedArray(arr, 6);  
        expect(arr.toString()).to.equal('6');
    });
    it('should insert into an array before the last element added', function() {
        Util.insertIntoSortedArray(arr, 2);  
        expect(arr.toString()).to.equal('2,6');
    });
    it('should insert into an array after the last element', function() {
        Util.insertIntoSortedArray(arr, 12);  
        expect(arr.toString()).to.equal('2,6,12');
    });
    it('should insert into an array a duplicate', function() {
        Util.insertIntoSortedArray(arr, 12);  
        expect(arr.toString()).to.equal('2,6,12,12');
    });
});  
describe('getFromSortedArray', function() {
    let blockIdList = [1,2,15,54];

    it('should getFromSortedArray', function() {
        let found = Util.getFromSortedArray(blockIdList, 15);  
        expect(found).to.equal(15);
    });
    it('should not find in removeFromSortedArray', function() {
        let found = Util.getFromSortedArray(blockIdList, 46);  
        expect(found).to.equal(undefined);
    });
});  

describe('removeFromSortedArray', function() {
    let blockIdList = [1,2,15,54];

    it('should removeFromSortedArray', function() {
        Util.removeFromUnsortedArray(blockIdList, 2);  
        expect(blockIdList.toString()).to.equal('1,15,54');
    });
    it('should not find in removeFromSortedArray', function() {
        Util.removeFromUnsortedArray(blockIdList, 46);  
        expect(blockIdList.toString()).to.equal('1,15,54');
    });
});  


describe('removeFromUnsortedArray', function() {
    let blockIdList = [1,2,15,54,23,3,4,5,6];

    it('should removeFromUnsortedArray', function() {
        Util.removeFromUnsortedArray(blockIdList, 6);  
        expect(blockIdList.toString()).to.equal('1,2,15,54,23,3,4,5');
    });
    it('should not find in removeFromUnsortedArray', function() {
        Util.removeFromUnsortedArray(blockIdList, 46);  
        expect(blockIdList.toString()).to.equal('1,2,15,54,23,3,4,5');
    });
});  

describe('list of users - no duplicates', function() {
    let users = [];
    let sorted = [];

    beforeEach(function() {
        users = ['jack', 'igor', 'jeff'];
        sorted = Util.removeDuplicateElements(users);
    });

    it('users should be 3', function() {
        expect(sorted).to.have.length(3);
    });

    it('return users with no changes or ordering', function() {
        expect(sorted[0]).to.equal('jack');
        expect(sorted[1]).to.equal('igor');
        expect(sorted[2]).to.equal('jeff');
    });
});  

describe('list of users - remove duplicates', function() {
        let users = [];
        let sorted = [];

    beforeEach(function() {
        users = ['jack', 'igor', 'jeff', 'igor', 'jeff', 'jack', 'igor', 'jeff'];
        sorted = Util.removeDuplicateElements(users);
    });

    it('users should be 3', function() {
        expect(sorted).to.have.length(3);
    });

    it('return users with no changes or ordering, but without the duplicates', function() {
        expect(sorted[0]).to.equal('jack');
        expect(sorted[1]).to.equal('igor');
        expect(sorted[2]).to.equal('jeff');
    });
});
describe('list of users - no duplicates', function() {
    let users = [];
    let boozers = [];
    let sorted = [];

    beforeEach(function() {
        users = ['jack', 'igor', 'jeff'];
        boozers = ['jack1', 'igor1', 'jeff1'];
        sorted = Util.mergeRemoveDuplicateElements(users.concat(boozers));
    });

    it('combined should be 6', function() {
        expect(sorted).to.have.length(6);
    });

    it('return combined with no changes or ordering', function() {
        expect(sorted[0]).to.equal('jack');
        expect(sorted[1]).to.equal('igor');
        expect(sorted[2]).to.equal('jeff');
    });
});  

describe('list of users and boozers - remove duplicates', function() {
    let users = [];
    let sorted = [];
    let boozers = [];

    beforeEach(function() {
        users = ['jack', 'igor', 'jeff', 'igor', 'jeff', 'jack', 'igor', 'jeff'];
        boozers = ['jack', 'igor', 'jeff', 'igor', 'jeff', 'jack', 'igor', 'jeff'];
        sorted = Util.mergeRemoveDuplicateElements(users.concat(boozers));
    });

    it('users should be 3', function() {
        expect(sorted).to.have.length(3);
    });

    it('return users with no changes or ordering, but without the duplicates', function() {
        expect(sorted[0]).to.equal('jack');
        expect(sorted[1]).to.equal('igor');
        expect(sorted[2]).to.equal('jeff');
    });
});
describe('array as map', function() {
    let spreadData = [1,2,3,4,5]
    let am = null;
    beforeEach(function() {
        am = Util.arrayAsMap(spreadData);

    });

    it('am should be 5', function() {
        expect(am.size).to.equal(5);
    });
    it('am should be 1, 2', function() {
        expect(am.has(1)).to.equal(true);
        expect(am.has(2)).to.equal(true);
    });
    it('am value should be original array index', function() {
        expect(am.get(1)).to.equal(0);
        expect(am.get(2)).to.equal(1);
        expect(am.get(3)).to.equal(2);
        expect(am.get(4)).to.equal(3);
        expect(am.get(5)).to.equal(4);
    });
});
describe('object As Map', function() {
    let layoutVersionData = 
        {
          'V1': ['M1','M2','M3','M4','M5'],
          'V2': ['M6','M7','M8','M9','M10']
        };
    let am = new Map();

    beforeEach(function() {
        am = Util.objectAsMap(layoutVersionData);
    });

    it('am should be V1,V2', function() {
        expect(am.has('V1')).to.equal(true);
        expect(am.has('V2')).to.equal(true);
    });
    it('am should be 2', function() {
        expect(am.size).to.equal(2);
    });

    it('am value should be found', function() {
        expect(am.get('V1')).to.have.length(5);
        expect(am.get('V1')[0]).to.equal('M1');
        expect(am.get('V2')[2]).to.equal('M8');
    });
});

describe('camelize', function() {
    it('camelize tony is in the house', function() {
        const camel = Util.camelize('camelize tony is in the house');
        expect(camel).to.equal('camelizeTonyIsInTheHouse');

    });
    it('Camelize Tony Is In The house', function() {
        const camel = Util.camelize('Camelize Tony Is In The house');
        expect(camel).to.equal('camelizeTonyIsInTheHouse');

    });
    it('camelize tony-is-in-the-house', function() {
        const camel = Util.camelize('camelize tony-is-in-the-house');
        expect(camel).to.equal('camelizeTonyIsInTheHouse');

    });
    it('camelize tony_is_in_the_house', function() {
        const camel = Util.camelize('camelize tony_is_in_the_house');
        expect(camel).to.equal('camelizeTonyIsInTheHouse');

    });
});