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
			
		}
	};

	return WebService;
});