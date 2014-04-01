define(['objTools'], function (objTools) {

	var methodDefinition = {
		name: null,
		requestObj: null,
		responseObj: null,
		endpoint: ''
	};

	return objTools.makeConstructor(function MethodDefinition () {}, methodDefinition);

});