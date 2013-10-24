define(['underscore', 'Library', 'MethodDefinition', 'makeObject'],
function (_, Library, MethodDefinition, make) {
	var methodLibrary = make(Library, {
		init: function (defs) {
			this.items = {};
			this.type = MethodDefinition;
			this.nameProperty = 'name';
			this.addItems(defs);
			return this;
		},
	});

	return function MethodLibrary () {
		var obj = Object.create(methodLibrary, {
			constructor: { value: MethodLibrary }
		});
		return obj.init.apply(obj, arguments);
	};
});