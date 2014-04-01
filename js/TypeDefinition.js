define(['objTools'], function (objTools) {

	/**
	 * @constructor TypeDefinition
	 * @classdesc Stores data about a type.
	 */
	var typeDefinition = {
		/**
		 * The name of the type.
		 * @member {string} TypeDefinition#type
		 */
		type: 'anyType',
		/**
		 * The namespace of the type.
		 * @member {string} TypeDefinition#ns
		 */
		ns: 'http://www.w3.org/2001/XMLSchema',
		/**
		 * True when the type can store multiple instances of the same type (so it is an array).
		 * @member {boolean} TypeDefinition#multiple
		 */
		multiple: false,
		/**
		 * True when the type is a complex type, having further properties (so it is an object).
		 * @member {boolean} TypeDefinition#complex
		 */
		complex: false,
		/**
		 * For complex types the properties and their types are defined here.
		 * @member {Object.<string, TypeDefinition>} TypeDefinition#properties
		 */
		properties: {},
		/**
		 * The function used to construct an object of this type.
		 * @member {Function} TypeDefinition#constructorFunction
		 */		
		constructorFunction: null,
		/**
		 * The value strategy for this type.
		 * It defines how properties should be retrieved/set for objects of this type.
		 * <br />Currently supported:
		 * <dl>
		 * <dt><b>'gettersetter':</b></dt><dd>getProperty/setProperty methods will be called on the object in case of 'property' property name</dd>
		 * <dt><b>'property':</b></dt><dd>(default) the given property will simply be accessed</dd>
		 * <dt><b>custom function:</b></dt><dd>a user-defined function can be given that will act as a getter when given 2 params (object and property name) and as a setter with 3 params (new value being third)</dd>
		 * </dl>
		 * @member {string} TypeDefinition#valueStrategy
		 */		
		valueStrategy: 'property'
	};

	return objTools.makeConstructor(function TypeDefinition () {}, typeDefinition);

});