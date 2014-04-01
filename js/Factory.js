define(['objTools'], function (objTools) {

	var factory = {
		init: function (typeLib) {
			this.typeLibrary = typeLib;
			return this;
		},
		make: function (name) {
			var def = this.typeLibrary.getItem(name);
			return new def.constructorFunction();
		},
		makeAndFill: function (name, props) {
			var obj = this.make(name);
			_(props).each(function (value, key) {
				this.typeLibrary.setValue(obj, key, value);
			}, this);
			return obj;
		}
	};

	return objTools.makeConstructor(function Factory () {}, factory);

});