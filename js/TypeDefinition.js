define(['objTools'], function (objTools) {
	var typeDefinition = {
		type: 'anyType',
		ns: 'http://www.w3.org/2001/XMLSchema',
		multiple: false,
		complex: false,
		properties: {},
		constructorFunction: null,
		valueStrategy: 'property' //'property', 'gettersetter' or object { get: function, set: function }
	};

	return function TypeDefinition() {
		return objTools.construct(typeDefinition, TypeDefinition);
	};
});