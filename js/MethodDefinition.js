define(['objTools'], function (objTools) {
	var methodDefinition = {
		name: null,
		requestObj: null,
		responseObj: null,
		endpoint: ''
	};

	return function MethodDefinition() {
		return objTools.construct(methodDefinition, MethodDefinition);
	};
});