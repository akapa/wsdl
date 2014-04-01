define(['objTools', 'wsdl/MethodDefinition'], function (objTools, MethodDefinition) {

	//WSDL METHOD DEFINITIONS

	return [
	
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

});
