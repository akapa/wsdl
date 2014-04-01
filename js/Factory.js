define(['objTools'], function (objTools) {

	/**
	 * @lends Factory.prototype
	 */
	var factory = {
		/**
		 * @constructor Factory
		 * @classdesc Responsible for creating objects based on a TypeLibrary.
		 * @param {TypeLibrary} typeLib - The TypeLibrary used to find object definitions and corresponding constructor functions.
		 */
		init: function (typeLib) {
			/**
			 * The type library used by the factory.
			 * @member {TypeLibrary} Factory#typeLibrary
			 */
			this.typeLibrary = typeLib;
			return this;
		},
		/**
		 * Creates an empty object based on the type library's definitions.
		 * @param {string} name - The name of the type to base the object on.
		 * @returns {Object} - The empty object created by the constructor extracted from the type library.
		 */
		make: function (name) {
			var def = this.typeLibrary.getItem(name);
			return new def.constructorFunction();
		},
		/**
		 * Creates an object based on the type library's definitions and extends it with the given properties.
		 * Uses TypeLibrary's setValue internally.
		 * @param {string} name - The name of the type to base the object on.
		 * @param {Object} props - The properties to put on the object. Existing properties are overwritten.
		 * @returns {Object} - The object created by the constructor extracted from the type library and then extended.
		 */
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