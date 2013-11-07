define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml'], function (_, objTools, Xml) {
	var webService = {
		init: function (serializer, factory, methodLibrary, typeLibrary) {
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
			req.send(envelope);
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
			var obj = this.serializer.unserialize(xhr.responseText, method.responseObject);
			onSuccess(obj, xhr.status, xhr.statusText);
		},
		handleError: function (method, xhr, onError) {
			var errorObj = {};
			onError(errorObj, xhr.status, xhr.statusText);
		},
		getSoapEnvelope: function (contents) {
			return Xml.makeXmlHeader()
				+ Xml.makeTag(
					'soap:Envelope', 
					Xml.makeTag('soap:Body', contents), 
					{ 'xmlns:soap' : 'http://schemas.xmlsoap.org/soap/envelope/' }
				);
		}
	};

	return function WebService () {
		var obj = objTools.construct(webService, WebService);
		return obj.init.apply(obj, arguments);
	};
});