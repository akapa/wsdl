define(['TypeLibrary'], function (TypeLibrary) {
	var factory = {
		init: function (typeLib) {
			this.typeLibrary = typeLib;
			return this;
		},
		make: function (name) {
			var def = this.typeLibrary.getItem(name);
			return new def.constructorFunction();
		}
	};

	return function Factory () {
		var obj = Object.create(factory, {
			constructor: { value: Factory }
		});
		return obj.init.apply(obj, arguments);
	};
});