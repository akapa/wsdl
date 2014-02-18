
define(['underscore', 'objTools', 'wsdl/WebService', 'wsdl/MethodLibrary', 
	'wsdl/MethodDefinition', 'wsdl/XmlSerializer', 'wsdl/Factory', 'wsdl/gen/typeconfig'], 
function (_, objTools, WebService, MethodLibrary, MethodDefinition, XmlSerializer, 
	Factory, typeLib) {
	
	var namespaces = {
		'myns': 'http://budget.kapa.org/',
		'xs': 'http://www.w3.org/2001/XMLSchema',
		'xsi': 'http://www.w3.org/2001/XMLSchema-instance'
	};

	//WSDL METHOD DEFINITIONS

	var methods = [
	
		objTools.make(MethodDefinition, {
			name: 'deleteObjects',
			requestObject: 'deleteObjects',
			responseObject: null,
			endpoint: 'REPLACE_WITH_ACTUAL_URL'
		}),
	
		objTools.make(MethodDefinition, {
			name: 'getRecentEvents',
			requestObject: 'getRecentEvents',
			responseObject: 'getRecentEventsResponse',
			endpoint: 'REPLACE_WITH_ACTUAL_URL'
		}),
	
		objTools.make(MethodDefinition, {
			name: 'storeObjects',
			requestObject: 'storeObjects',
			responseObject: null,
			endpoint: 'REPLACE_WITH_ACTUAL_URL'
		}),
	
		objTools.make(MethodDefinition, {
			name: 'getEventsInRange',
			requestObject: 'getEventsInRange',
			responseObject: 'getEventsInRangeResponse',
			endpoint: 'REPLACE_WITH_ACTUAL_URL'
		}),
	
		objTools.make(MethodDefinition, {
			name: 'getAmount',
			requestObject: 'getAmount',
			responseObject: 'getAmountResponse',
			endpoint: 'REPLACE_WITH_ACTUAL_URL'
		}),
	
	];

	//initializing Method Library with wsdl methods
	var methodLib = new MethodLibrary(methods);

	//creating Factory and Serializer
	var factory = new Factory(typeLib);
	var serializer = new XmlSerializer(typeLib, factory, namespaces);

	//creating the Web Service
	var ws = new WebService('BudgetService', serializer, factory, methodLib, typeLib);

	//adding Web Service methods to easily call WSDL methods
	_(ws).extend({
	
		'deleteObjects': function (params, onSuccess, onError) {
			var reqObjName = this.methodLibrary.getItem('deleteObjects').requestObject;
			var reqObj = objTools.make(this.typeLibrary.getItem(reqObjName).constructorFunction, params);
			this.call('deleteObjects', reqObj, onSuccess, onError);
		},
	
		'getRecentEvents': function (params, onSuccess, onError) {
			var reqObjName = this.methodLibrary.getItem('getRecentEvents').requestObject;
			var reqObj = objTools.make(this.typeLibrary.getItem(reqObjName).constructorFunction, params);
			this.call('getRecentEvents', reqObj, onSuccess, onError);
		},
	
		'storeObjects': function (params, onSuccess, onError) {
			var reqObjName = this.methodLibrary.getItem('storeObjects').requestObject;
			var reqObj = objTools.make(this.typeLibrary.getItem(reqObjName).constructorFunction, params);
			this.call('storeObjects', reqObj, onSuccess, onError);
		},
	
		'getEventsInRange': function (params, onSuccess, onError) {
			var reqObjName = this.methodLibrary.getItem('getEventsInRange').requestObject;
			var reqObj = objTools.make(this.typeLibrary.getItem(reqObjName).constructorFunction, params);
			this.call('getEventsInRange', reqObj, onSuccess, onError);
		},
	
		'getAmount': function (params, onSuccess, onError) {
			var reqObjName = this.methodLibrary.getItem('getAmount').requestObject;
			var reqObj = objTools.make(this.typeLibrary.getItem(reqObjName).constructorFunction, params);
			this.call('getAmount', reqObj, onSuccess, onError);
		},
	
	});

	return ws;
});
