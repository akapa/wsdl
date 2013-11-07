define(['underscore', 'wsdl2/objTools', 'wsdl2/Library', 'wsdl2/MethodDefinition'],
function (_, objTools, Library, MethodDefinition) {
	var methodLibrary = objTools.make(Library, {
		init: function (defs) {
			this.items = {};
			this.type = MethodDefinition;
			this.nameProperty = 'name';
			this.addItems(defs);
			return this;
		},
	});

	return function MethodLibrary () {
		var obj = objTools.construct(methodLibrary, MethodLibrary);
		return obj.init.apply(obj, arguments);
	};
});