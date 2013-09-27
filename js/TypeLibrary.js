define(['TypeDefinition'], function (TypeDefinition) {
	var TypeLibrary = {
		init: function (definitions) {
			this.definitions = definitions;
		},
		getTypeDefinition: function (s) {
			return this.definitions[s];
		},
		getObjectType: function (obj) {
			return obj.classify();
		}
	};

	return TypeLibrary;
});