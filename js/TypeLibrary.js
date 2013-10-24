define(['underscore', 'Library', 'TypeDefinition', 'makeObject'],
function (_, Library, TypeDefinition, make) {
	var typeLibrary = make(Library, {
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

	return function TypeLibrary () {
		var obj = Object.create(typeLibrary, {
			constructor: { value: TypeLibrary }
		});
		return obj.init.apply(obj, arguments);
	};
});