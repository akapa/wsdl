define(['underscore', 'Library', 'TypeDefinition', 'makeObject'],
function (_, Library, TypeDefinition, make) {
	var TypeLibrary = make(Library, {
		init: function (defs) {
			this.items = {};
			this.type = TypeDefinition;
			this.nameProperty = 'type';
			this.addItems(defs);
			return this;
		},
		getObjectType: function (obj) {
			if (!_(obj).isObject()) {
				return null;
			}
			if ('classify' in obj) {
				return obj.classify();
			}
			return 'Object';
		}
	});

	return TypeLibrary;
});