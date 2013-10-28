define(['objTools'], function (objTools) {
	var typeDefinition = {
		type: 'anyType',
		ns: 'http://www.w3.org/2001/XMLSchema',
		multiple: false,
		complex: false,
		properties: {},
		proto: null,
		valueStrategy: 'property'
	};

	return function TypeDefinition() {
		return objTools.construct(typeDefinition, TypeDefinition);
	};
});