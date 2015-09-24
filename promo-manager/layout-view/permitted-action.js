export default class PermittedAction {
	constructor(name, action) {
		this.id = action;
		this.name = name ? name : action;
	}

}