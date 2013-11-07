
define(['underscore', 'wsdl2/objTools', 'wsdl2/WebService',	'wsdl2/MethodLibrary', 'wsdl2/MethodDefinition', 'wsdl2/XmlSerializer', 'wsdl2/Factory', 'wsdl2/gen/typeconfig'], 
function (_, objTools, WebService, MethodLibrary, MethodDefinition, XmlSerializer, Factory, typeLib) {
	var namespaces = {
		0: 'http://budget.kapa.org/',
		'xs': 'http://www.w3.org/2001/XMLSchema'
	};

	//WSDL METHOD DEFINITIONS

	var methods = [
	
		objTools.make(MethodDefinition, {
			name: 'storeObjects',
			requestObject: 'storeObjects',
			responseObject: null,
			endpoint: 'BudgetService'
		}),
	
		objTools.make(MethodDefinition, {
			name: 'deleteObjects',
			requestObject: 'deleteObjects',
			responseObject: null,
			endpoint: 'BudgetService'
		}),
	
		objTools.make(MethodDefinition, {
			name: 'getAmount',
			requestObject: 'getAmount',
			responseObject: 'getAmountResponse',
			endpoint: 'BudgetService'
		}),
	
		objTools.make(MethodDefinition, {
			name: 'getRecentEvents',
			requestObject: 'getRecentEvents',
			responseObject: 'getRecentEventsResponse',
			endpoint: 'BudgetService'
		}),
	
		objTools.make(MethodDefinition, {
			name: 'getEventsInRange',
			requestObject: 'getEventsInRange',
			responseObject: 'getEventsInRangeResponse',
			endpoint: 'BudgetService'
		}),
	
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
	
		'storeObjects': function (params, onSuccess, onError) {
			var reqObj = objTools.make(this.methodLibrary.getItem('storeObjects').requestObject, params);
			this.call('storeObjects', reqObj, onSuccess, onError);
		},
	
		'deleteObjects': function (params, onSuccess, onError) {
			var reqObj = objTools.make(this.methodLibrary.getItem('deleteObjects').requestObject, params);
			this.call('deleteObjects', reqObj, onSuccess, onError);
		},
	
		'getAmount': function (params, onSuccess, onError) {
			var reqObj = objTools.make(this.methodLibrary.getItem('getAmount').requestObject, params);
			this.call('getAmount', reqObj, onSuccess, onError);
		},
	
		'getRecentEvents': function (params, onSuccess, onError) {
			var reqObj = objTools.make(this.methodLibrary.getItem('getRecentEvents').requestObject, params);
			this.call('getRecentEvents', reqObj, onSuccess, onError);
		},
	
		'getEventsInRange': function (params, onSuccess, onError) {
			var reqObj = objTools.make(this.methodLibrary.getItem('getEventsInRange').requestObject, params);
			this.call('getEventsInRange', reqObj, onSuccess, onError);
		},
	
	});

	return ws;
});
