import simpleStorage from 'simpleStorage'
export default class Storage {

	static getRecord(name) {
       const model = simpleStorage.get(name);
        if (model) {
            return model;
        }
	}	
	static deleteRecord(name) {
       simpleStorage.deleteKey(name);
	}
	static setRecord(name, model) {
        simpleStorage.set(name, model);
	}
}
