define(['underscore', 'objTools', 'WebService',	'MethodLibrary', 'MethodDefinition', 'XmlSerializer', 'Factory', 'gen/typeconfig'], 
function (_, objTools, WebService, MethodLibrary, MethodDefinition, XmlSerializer, Factory, typeLib) {
	var namespaces = {
		0: 'http://budget.kapa.org',
		'xs': 'http://www.w3.org/2001/XMLSchema'
	};
	var url = 'Service';

	//WSDL METHOD DEFINITIONS

	var methods = [
		objTools.make(MethodDefinition, {
			name: 'getEventsInRange',
			requestObject: 'getEventsInRange',
			responseObject: 'getEventsInRangeResponse',
			endpoint: url
		})
	];

	//initializing Method Library with wsdl methods
	var methodLib = new MethodLibrary(methods);

	//creating Factory and Serializer
	var factory = new Factory(typeLib);
	var serializer = new XmlSerializer(typeLib, factory, namespaces);

	//creating the Web Service
	var ws = new WebService(serializer, factory, methodLib, typeLib);

	//adding Web Service methods to easily call WSDL methods
	_(ws).extend({
		'getEventsInRange': function (params, onSuccess, onError) {
			var reqObj = objTools.make(this.methodLibrary.getItem('getEventsInRange').requestObject, params);
			this.call('getEventsInRange', reqObj, onSuccess, onError);
		}
	});

	return ws;
});