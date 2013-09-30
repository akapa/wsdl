define(['underscore', 'Library', 'MethodDefinition'],
function (_, Library, MethodDefinition) {
	var MethodLibrary = _(Object.create(Library)).extend({
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