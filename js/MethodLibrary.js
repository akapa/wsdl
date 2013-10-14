define(['underscore', 'Library', 'MethodDefinition', 'makeObject'],
function (_, Library, MethodDefinition, make) {
	var MethodLibrary = make(Library, {
		init: function (defs) {
			this.items = {};
			this.type = MethodDefinition;
			this.nameProperty = 'name';
			this.addItems(defs);
			return this;
		},
	});

	return MethodLibrary;
});