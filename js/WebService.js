define(['underscore', 'objTools', 'xml'], function (_, objTools, xml) {

	var webService = {
		init: function (name, serializer, factory, methodLibrary, typeLibrary) {
			this.name = name;
			this.serializer = serializer;
			this.factory = factory;
			this.methodLibrary = methodLibrary;
			this.typeLibrary = typeLibrary;
			this.responseSuccessRegex = /^(20\d|1223)$/;
			return this;
		},
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
		callWithPlainObject: function (method, params, onSuccess, onError) {
			var reqObjName = this.methodLibrary.getItem(method).requestObject;
			var reqConstr = this.typeLibrary.getItem(reqObjName).constructorFunction;
			var reqObj = objTools.make(reqConstr, params);
			this.call(method, reqObj, onSuccess, onError);		
		},
		handleResponse: function (method, xhr, onSuccess, onError) {
			if (this.responseSuccessRegex.test(xhr.status) && onSuccess) {
				this.handleSuccess(method, xhr, onSuccess);
			}
			else if (onError) {
				this.handleError(method, xhr, onError);
			}
		},
		handleSuccess: function (method, xhr, onSuccess) {
			var methodDef = this.methodLibrary.getItem(method);
			var obj = methodDef.responseObject ?
				this.serializer.unserialize(xhr.responseText, methodDef.responseObject) :
				{};
			onSuccess(obj, xhr.status, xhr.statusText);
		},
		handleError: function (method, xhr, onError) {
			var errorObj = {};
			onError(errorObj, xhr.status, xhr.statusText);
		},
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