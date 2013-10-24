define(function () {
	var typeDefinition = {
		type: 'anyType',
		ns: 'http://www.w3.org/2001/XMLSchema',
		multiple: false,
		complex: false,
		properties: {},
		proto: null
	};

	return function TypeDefinition() {
		var obj = Object.create(typeDefinition, {
			constructor: { value: TypeDefinition }
		});
		return obj;
	};
});