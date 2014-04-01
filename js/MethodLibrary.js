define(['underscore', 'objTools', 'Library', 'wsdl/MethodDefinition'],
function (_, objTools, Library, MethodDefinition) {

	/**
	 * A basic library/collection used to store and retrieve items.
	 * @external Library
	 * @see {@link https://github.com/bazmegakapa/kapa-Library}
	 */

	var methodLibrary = objTools.make(Library, 
		/**
		 * @lends MethodLibrary.prototype
		 */
		{
			/**
			 * @constructor MethodLibrary
			 * @classdesc Stores MethodDefinition objects.
			 * @extends external:Library
			 * @param {MethodDefinition[]} defs - An array of MethodDefinition objects to store initially.
			 */
			init: function (defs) {
				this.items = {};
				this.type = MethodDefinition;
				this.nameProperty = 'name';
				this.addItems(defs);
				return this;
			},
	});

	return objTools.makeConstructor(function MethodLibrary () {}, methodLibrary);

});