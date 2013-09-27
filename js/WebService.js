define(['underscore'], function (_) {
	var WebService = {
		init: function (serializer, methodLibrary, typeLibrary) {
			this.serializer = serializer;
			this.methodLibrary = methodLibrary;
			this.typeLibrary = typeLibrary;
		},
		call: function (method, requestObj, onSuccess, onError) {
			
		}
	};

	return WebService;
});