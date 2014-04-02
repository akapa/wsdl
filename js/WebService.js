define(['underscore', 'objTools', 'xml'], function (_, objTools, xml) {

	/**
	 * @lends WebService.prototype
	 */
	var webService = {
		/**
		 * @constructor WebService
		 * @classdesc Responsible for creating objects based on a TypeLibrary.
		 * @param {TypeLibrary} typeLib - The TypeLibrary used to find object definitions and corresponding constructor functions.
		 */
		init: function (name, serializer, factory, methodLibrary, typeLibrary) {
			/**
			 * The name of the web service.
			 * @member {string} WebService#name
			 */
			this.name = name;
			/**
			 * The serializer used by this service to serialize/unserialize request data.
			 * @member {Serializer} WebService#serializer
			 */
			this.serializer = serializer;
			/**
			 * The factory used by this service.
			 * @member {Factory} WebService#factory
			 */
			this.factory = factory;
			/**
			 * The library that describes the methods of this webservice.
			 * @member {MethodLibrary} WebService#methodLibrary
			 */
			this.methodLibrary = methodLibrary;
			/**
			 * The type library to be used by the webservice.
			 * @member {TypeLibrary} WebService#typeLibrary
			 */
			this.typeLibrary = typeLibrary;
			/**
			 * A regex that can be used to decide whether an HTTP response status code means "success".
			 * @member {RegExp} WebService#responseSuccessRegex
			 */
			this.responseSuccessRegex = /^(20\d|1223)$/;
			return this;
		},
		/**
		 * Calls a method of the web service through AJAX.
		 * @param {string} method - The name of the method to call.
		 * @param {Object} requestObj - The request object to use for the call.
		 * @param {Function} onSuccess - The function to be called on success. Receives unserialized response object, status code and status text as parameters.
		 * @param {Function} onError - The function to be called on error. Receives an error object, status code and status text as parameters.
		 */
		call: function (method, requestObj, onSuccess, onError) {
			var methodDef = this.methodLibrary.getItem(method);
			var serializedRequestObj = this.serializer.serialize(requestObj, methodDef.requestObject);
			var envelope = this.getSoapEnvelope(serializedRequestObj);
			
			var req = new XMLHttpRequest();
			req.onreadystatechange = function () {
				if (req.readyState === 4) {
					this.handleResponse(method, req, onSuccess, onError);		
				}
			}.bind(this);
			req.open('post', methodDef.endpoint, true);
			req.setRequestHeader('Content-Type', 'text/xml');
			var stuff = [
				this.serializer.ns.myns.replace(/\/+$/, ''),
				this.name, 
				methodDef.name
			];
			req.setRequestHeader('SOAPAction', stuff.join('/'));
			req.send(envelope);
		},
		/**
		 * Convenience method to call web service methods without creating response objects.
		 * @param {string} method - The name of the method to call.
		 * @param {Object} params - The parameters to be set on the request object.
		 * @param {Function} onSuccess - The function to be called on success. Receives unserialized response object, status code and status text as parameters.
		 * @param {Function} onError - The function to be called on error. Receives an error object, status code and status text as parameters.
		 */
		callWithPlainObject: function (method, params, onSuccess, onError) {
			var reqObjName = this.methodLibrary.getItem(method).requestObject;
			var reqConstr = this.typeLibrary.getItem(reqObjName).constructorFunction;
			var reqObj = objTools.make(reqConstr, params);
			this.call(method, reqObj, onSuccess, onError);		
		},
		/**
		 * Handles a response from the web service.
		 * @param {string} method - The name of the method that was called.
		 * @param {XMLHttpRequest} xhr - The XHR object used for the HTTP request.
		 * @param {Function} onSuccess - The function to be called on success.
		 * @param {Function} onError - The function to be called on error.
		 * @protected
		 */		
		handleResponse: function (method, xhr, onSuccess, onError) {
			if (this.responseSuccessRegex.test(xhr.status) && onSuccess) {
				this.handleSuccess(method, xhr, onSuccess);
			}
			else if (onError) {
				this.handleError(method, xhr, onError);
			}
		},
		/**
		 * Handles a successful response from the web service.
		 * @param {string} method - The name of the method that was called.
		 * @param {XMLHttpRequest} xhr - The XHR object used for the HTTP request.
		 * @param {Function} onSuccess - The function to be called on success.
		 * @protected
		 */		
		handleSuccess: function (method, xhr, onSuccess) {
			var methodDef = this.methodLibrary.getItem(method);
			var obj = methodDef.responseObject ?
				this.serializer.unserialize(xhr.responseText, methodDef.responseObject) :
				{};
			onSuccess(obj, xhr.status, xhr.statusText);
		},
		/**
		 * Handles an erroneous response from the web service.
		 * @param {string} method - The name of the method that was called.
		 * @param {XMLHttpRequest} xhr - The XHR object used for the HTTP request.
		 * @param {Function} onError - The function to be called on error.
		 * @protected
		 */		
		handleError: function (method, xhr, onError) {
			var errorObj = {};
			onError(errorObj, xhr.status, xhr.statusText);
		},
		/**
		 * Generates a SOAP envelope for transfer.
		 * @param {string} contents - The serialized XML to be put into the envelope.
		 * @returns {string} - A serialized SOAP envelope containing the XML passed.
		 * @protected
		 */				
		getSoapEnvelope: function (contents) {
			var soapNs = 'http://schemas.xmlsoap.org/soap/envelope/';
			var doc = xml.createDocument('Envelope', { 'soap' : soapNs }, 'soap');
			var body = doc.createElementNS(soapNs, 'soap:Body');
			xml.setNodeText(body, '%PH%');
			doc.documentElement.appendChild(body);
			return '<?xml version="1.0" encoding="UTF-8"?>'	+
				xml.serializeToString(doc).replace('%PH%', contents);
		}
	};

	return objTools.makeConstructor(function WebService () {}, webService);

});