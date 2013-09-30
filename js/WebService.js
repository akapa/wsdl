define(['underscore'], function (_) {
	var WebService = {
		init: function (serializer, factory, methodLibrary, typeLibrary) {
			this.serializer = serializer;
			this.factory = factory;
			this.methodLibrary = methodLibrary;
			this.typeLibrary = typeLibrary;
			return this;
		},
		call: function (method, requestObj, onSuccess, onError) {
			var methodDef = this.methodLibrary.getItem(method);
			var requestObjType = this.typeLibrary.getItem(method.requestObject);

			var serializeRequestObj = this.serializer.serialize(requestObj, requestObjType);

			//make a call using methodDef.endpoint and the callback functions
		}
	};

	return WebService;
});