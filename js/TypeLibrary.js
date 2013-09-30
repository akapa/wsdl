define(['underscore', 'Library', 'TypeDefinition'],
function (_, Library, TypeDefinition) {
	var TypeLibrary = _(Object.create(Library)).extend({
		init: function (defs) {
			this.items = {};
			this.type = TypeDefinition;
			this.nameProperty = 'type';
			this.addItems(defs);
			return this;
		},
		getObjectType: function (obj) {
			return obj.classify();
		}
	});

	return TypeLibrary;
});