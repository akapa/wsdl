define(function () {
	var methodDefinition = {
		name: null,
		requestObj: null,
		responseObj: null,
		endpoint: ''
	};

	return function MethodDefinition() {
		var obj = Object.create(methodDefinition, {
			constructor: { value: MethodDefinition }
		});
		return obj;
	};
});