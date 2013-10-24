define(['objTools'], function (objTools) {
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
		var obj = objTools.construct(factory, Factory);
		return obj.init.apply(obj, arguments);
	};
});