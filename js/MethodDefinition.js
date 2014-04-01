define(['objTools'], function (objTools) {

	/**
	 * @constructor MethodDefinition
	 * @classdesc Stores data about a web service method.
	 */
	var methodDefinition = {
		/**
		 * The name that identifies the method.
		 * @member {string} MethodDefinition#name
		 */
		name: null,
		/**
		 * The name of the request object that is to be used with this method.
		 * @member {string} MethodDefinition#requestObj
		 */
		requestObj: null,
		/**
		 * The name of the response object that is to be used with this method.
		 * @member {string} MethodDefinition#responseObj
		 */
		responseObj: null,
		/**
		 * The URL where calls to this method should be sent.
		 * @member {string} MethodDefinition#endpoint
		 */
		endpoint: ''
	};

	return objTools.makeConstructor(function MethodDefinition () {}, methodDefinition);

});