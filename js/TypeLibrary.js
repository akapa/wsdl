define(['underscore', 'objTools', 'Library', 'TypeDefinition'],
function (_, objTools, Library, TypeDefinition) {
	var typeLibrary = objTools.make(Library, {
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
		},
		getValue: function (obj, key) {
			return obj[key];
		},
		setValue: function (obj, key, value) {
			obj[key] = value;
		},
		ensureType: function () {

		}
	});

	return function TypeLibrary () {
		var obj = objTools.construct(typeLibrary, TypeLibrary);
		return obj.init.apply(obj, arguments);
	};
});