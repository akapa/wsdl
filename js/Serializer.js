define(['objTools'], function (objTools) {

	/**
	 * @constructor Serializer
	 * @abstract
	 * @classdesc A very basic serializer/unserializer.
	 */
	var serializer = 
		/**
		 * @lends Serializer.prototype
		 */
		{
			/**
			 * Takes a value and turns it into a string representation.
			 * @param {*} value - The value to be serialized.
			 * @param {string} name - The type/identifier of the value.
			 * @returns {string} - The serialized value.
			 */
			serialize: function (value, name) {
				return JSON.stringify(value);
			},
			/**
			 * Takes a string that is a representation of a value and turns it into a value.
			 * @param {string} s - The string representation.
			 * @param {string} name - The type/identifier of the value.
			 * @param {TypeDefinition} [typeDef] - The type definition for the type.
			 * @returns {*} - The unserialized value.
			 */
			unserialize: function (s, name, typeDef) {
				return JSON.parse(s);
			}
	};

	return objTools.makeConstructor(function Serializer () {}, serializer);

});