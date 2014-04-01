define(['underscore', 'objTools', 'Library', 'wsdl/MethodDefinition'],
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

	return objTools.makeConstructor(function MethodLibrary () {}, methodLibrary);

});