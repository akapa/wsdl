define(['TypeLibrary'], function (TypeLibrary) {
	var Factory = {
		init: function (typeLib) {
			this.typeLibrary = typeLib;
			return this;
		},
		make: function (name) {
			var def = this.typeLibrary.getItem(name);
			return Object.create(def.proto);
		}
	};

	return Factory;
});