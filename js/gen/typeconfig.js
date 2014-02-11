
define(['underscore', 'objTools', 'wsdl/TypeLibrary', 'wsdl/TypeDefinition', 'wsdl/TypeEnsurer'], 
function (_, objTools, TypeLibrary, TypeDefinition, TypeEnsurer) {
	var namespaces = {
		0: 'http://budget.kapa.org/',
		'xs': 'http://www.w3.org/2001/XMLSchema',
		'xsi': 'http://www.w3.org/2001/XMLSchema-instance'
	};

	var objects = {};
	var constructors = {};
	var types = {};
	
	//getRecentEvents

	objects['getRecentEvents'] = {
		classify: function () { return 'getRecentEvents'; }
	};

	constructors['getRecentEvents'] = function GetRecentEvents () {
		return objTools.construct(objects['getRecentEvents'], GetRecentEvents);
	};

	types['getRecentEvents'] = objTools.make(TypeDefinition, {
		type: 'getRecentEvents',
		ns: namespaces[0],
		complex: true,
		constructorFunction: constructors['getRecentEvents'],
		properties: {
		}
	});
	
	//getRecentEventsResponse

	objects['getRecentEventsResponse'] = {
		'return': [],
		classify: function () { return 'getRecentEventsResponse'; }
	};

	constructors['getRecentEventsResponse'] = function GetRecentEventsResponse () {
		return objTools.construct(objects['getRecentEventsResponse'], GetRecentEventsResponse);
	};

	types['getRecentEventsResponse'] = objTools.make(TypeDefinition, {
		type: 'getRecentEventsResponse',
		ns: namespaces[0],
		complex: true,
		constructorFunction: constructors['getRecentEventsResponse'],
		properties: {
			'return': objTools.make(TypeDefinition, {
				multiple: true,
					complex: true,
				ns: 'http://budget.kapa.org/',
				type: 'event'
			}),
		}
	});
	
	//basic

	objects['basic'] = {
		classify: function () { return 'basic'; }
	};

	constructors['basic'] = function Basic () {
		return objTools.construct(objects['basic'], Basic);
	};

	types['basic'] = objTools.make(TypeDefinition, {
		type: 'basic',
		ns: namespaces[0],
		complex: true,
		constructorFunction: constructors['basic'],
		properties: {
		}
	});
	
	//event

	objects['event'] = {
		'amount': 0,
		'description': '',
		'id': 0,
		'time': null,
		'type': '',
		'user': null,
		classify: function () { return 'event'; }
	};

	constructors['event'] = function Event () {
		return objTools.construct(objTools.make(new constructors['basic'], objects['event']), Event);
	};

	types['event'] = objTools.make(TypeDefinition, {
		type: 'event',
		ns: namespaces[0],
		complex: true,
		constructorFunction: constructors['event'],
		properties: objTools.make(types['basic'].properties, {
			'amount': objTools.make(TypeDefinition, {
				ns: 'http://www.w3.org/2001/XMLSchema',
				type: 'float'
			}),
			'description': objTools.make(TypeDefinition, {
				ns: 'http://www.w3.org/2001/XMLSchema',
				type: 'string'
			}),
			'id': objTools.make(TypeDefinition, {
				ns: 'http://www.w3.org/2001/XMLSchema',
				type: 'int'
			}),
			'time': objTools.make(TypeDefinition, {
				ns: 'http://www.w3.org/2001/XMLSchema',
				type: 'dateTime'
			}),
			'type': objTools.make(TypeDefinition, {
				ns: 'http://www.w3.org/2001/XMLSchema',
				type: 'string'
			}),
			'user': objTools.make(TypeDefinition, {
					complex: true,
				ns: 'http://budget.kapa.org/',
				type: 'user'
			}),
		})
	});
	
	//user

	objects['user'] = {
		'events': [],
		'id': 0,
		'name': '',
		classify: function () { return 'user'; }
	};

	constructors['user'] = function User () {
		return objTools.construct(objTools.make(new constructors['basic'], objects['user']), User);
	};

	types['user'] = objTools.make(TypeDefinition, {
		type: 'user',
		ns: namespaces[0],
		complex: true,
		constructorFunction: constructors['user'],
		properties: objTools.make(types['basic'].properties, {
			'events': objTools.make(TypeDefinition, {
				multiple: true,
					complex: true,
				ns: 'http://budget.kapa.org/',
				type: 'event'
			}),
			'id': objTools.make(TypeDefinition, {
				ns: 'http://www.w3.org/2001/XMLSchema',
				type: 'int'
			}),
			'name': objTools.make(TypeDefinition, {
				ns: 'http://www.w3.org/2001/XMLSchema',
				type: 'string'
			}),
		})
	});
	
	//getEventsInRange

	objects['getEventsInRange'] = {
		'timeFrom': null,
		'timeTo': null,
		classify: function () { return 'getEventsInRange'; }
	};

	constructors['getEventsInRange'] = function GetEventsInRange () {
		return objTools.construct(objects['getEventsInRange'], GetEventsInRange);
	};

	types['getEventsInRange'] = objTools.make(TypeDefinition, {
		type: 'getEventsInRange',
		ns: namespaces[0],
		complex: true,
		constructorFunction: constructors['getEventsInRange'],
		properties: {
			'timeFrom': objTools.make(TypeDefinition, {
				ns: 'http://www.w3.org/2001/XMLSchema',
				type: 'dateTime'
			}),
			'timeTo': objTools.make(TypeDefinition, {
				ns: 'http://www.w3.org/2001/XMLSchema',
				type: 'dateTime'
			}),
		}
	});
	
	//getEventsInRangeResponse

	objects['getEventsInRangeResponse'] = {
		'return': [],
		classify: function () { return 'getEventsInRangeResponse'; }
	};

	constructors['getEventsInRangeResponse'] = function GetEventsInRangeResponse () {
		return objTools.construct(objects['getEventsInRangeResponse'], GetEventsInRangeResponse);
	};

	types['getEventsInRangeResponse'] = objTools.make(TypeDefinition, {
		type: 'getEventsInRangeResponse',
		ns: namespaces[0],
		complex: true,
		constructorFunction: constructors['getEventsInRangeResponse'],
		properties: {
			'return': objTools.make(TypeDefinition, {
				multiple: true,
					complex: true,
				ns: 'http://budget.kapa.org/',
				type: 'event'
			}),
		}
	});
	
	//storeObjects

	objects['storeObjects'] = {
		'objects': [],
		classify: function () { return 'storeObjects'; }
	};

	constructors['storeObjects'] = function StoreObjects () {
		return objTools.construct(objects['storeObjects'], StoreObjects);
	};

	types['storeObjects'] = objTools.make(TypeDefinition, {
		type: 'storeObjects',
		ns: namespaces[0],
		complex: true,
		constructorFunction: constructors['storeObjects'],
		properties: {
			'objects': objTools.make(TypeDefinition, {
				multiple: true,
					complex: true,
				ns: 'http://budget.kapa.org/',
				type: 'basic'
			}),
		}
	});
	
	//getAmount

	objects['getAmount'] = {
		classify: function () { return 'getAmount'; }
	};

	constructors['getAmount'] = function GetAmount () {
		return objTools.construct(objects['getAmount'], GetAmount);
	};

	types['getAmount'] = objTools.make(TypeDefinition, {
		type: 'getAmount',
		ns: namespaces[0],
		complex: true,
		constructorFunction: constructors['getAmount'],
		properties: {
		}
	});
	
	//getAmountResponse

	objects['getAmountResponse'] = {
		'return': 0,
		classify: function () { return 'getAmountResponse'; }
	};

	constructors['getAmountResponse'] = function GetAmountResponse () {
		return objTools.construct(objects['getAmountResponse'], GetAmountResponse);
	};

	types['getAmountResponse'] = objTools.make(TypeDefinition, {
		type: 'getAmountResponse',
		ns: namespaces[0],
		complex: true,
		constructorFunction: constructors['getAmountResponse'],
		properties: {
			'return': objTools.make(TypeDefinition, {
				ns: 'http://www.w3.org/2001/XMLSchema',
				type: 'int'
			}),
		}
	});
	
	//deleteObjects

	objects['deleteObjects'] = {
		'objects': [],
		classify: function () { return 'deleteObjects'; }
	};

	constructors['deleteObjects'] = function DeleteObjects () {
		return objTools.construct(objects['deleteObjects'], DeleteObjects);
	};

	types['deleteObjects'] = objTools.make(TypeDefinition, {
		type: 'deleteObjects',
		ns: namespaces[0],
		complex: true,
		constructorFunction: constructors['deleteObjects'],
		properties: {
			'objects': objTools.make(TypeDefinition, {
				multiple: true,
					complex: true,
				ns: 'http://budget.kapa.org/',
				type: 'basic'
			}),
		}
	});
	

	var tlib = new TypeLibrary(_(types).toArray());
	tlib.typeEnsurer = new TypeEnsurer(tlib);
	return tlib;
});
