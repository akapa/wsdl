
define(['objTools', 'wsdl/TypeDefinition'], function (objTools, TypeDefinition) {

	var namespaces = {
		'myns': 'http://budget.kapa.org/',
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

	constructors['getRecentEvents'] = objTools.makeConstructor(
		function GetRecentEvents () {},
		objects['getRecentEvents']
	);

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

	constructors['getRecentEventsResponse'] = objTools.makeConstructor(
		function GetRecentEventsResponse () {},
		objects['getRecentEventsResponse']
	);

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
	
	//verybasic

	objects['verybasic'] = {
		'stuff': '',
		classify: function () { return 'verybasic'; }
	};

	constructors['verybasic'] = objTools.makeConstructor(
		function Verybasic () {},
		objects['verybasic']
	);

	types['verybasic'] = objTools.make(TypeDefinition, {
		type: 'verybasic',
		ns: namespaces[0],
		complex: true,
		constructorFunction: constructors['verybasic'],
		properties: {
			'stuff': objTools.make(TypeDefinition, {
				ns: 'http://www.w3.org/2001/XMLSchema',
				type: 'string'
			}),
		}
	});
	
	//basic

	objects['basic'] = {
		'additional': '',
		classify: function () { return 'basic'; }
	};

	constructors['basic'] = objTools.makeConstructor(
		function Basic () {},
		objTools.make(new constructors['verybasic'], objects['basic'])
	);

	types['basic'] = objTools.make(TypeDefinition, {
		type: 'basic',
		ns: namespaces[0],
		complex: true,
		constructorFunction: constructors['basic'],
		properties: objTools.make(types['verybasic'].properties, {
			'additional': objTools.make(TypeDefinition, {
				ns: 'http://www.w3.org/2001/XMLSchema',
				type: 'string'
			}),
		})
	});
	
	//event

	objects['event'] = {
		'amount': 0,
		'description': '',
		'id': null,
		'time': null,
		'type': '',
		'user': null,
		classify: function () { return 'event'; }
	};

	constructors['event'] = objTools.makeConstructor(
		function Event () {},
		objTools.make(new constructors['basic'], objects['event'])
	);

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
				ns: 'http://budget.kapa.org/',
				type: 'id'
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
		'id': null,
		'name': '',
		classify: function () { return 'user'; }
	};

	constructors['user'] = objTools.makeConstructor(
		function User () {},
		objTools.make(new constructors['basic'], objects['user'])
	);

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
				ns: 'http://budget.kapa.org/',
				type: 'id'
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

	constructors['getEventsInRange'] = objTools.makeConstructor(
		function GetEventsInRange () {},
		objects['getEventsInRange']
	);

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

	constructors['getEventsInRangeResponse'] = objTools.makeConstructor(
		function GetEventsInRangeResponse () {},
		objects['getEventsInRangeResponse']
	);

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

	constructors['storeObjects'] = objTools.makeConstructor(
		function StoreObjects () {},
		objects['storeObjects']
	);

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

	constructors['getAmount'] = objTools.makeConstructor(
		function GetAmount () {},
		objects['getAmount']
	);

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

	constructors['getAmountResponse'] = objTools.makeConstructor(
		function GetAmountResponse () {},
		objects['getAmountResponse']
	);

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

	constructors['deleteObjects'] = objTools.makeConstructor(
		function DeleteObjects () {},
		objects['deleteObjects']
	);

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
	

	return {
		types: types,
		namespaces: namespaces
	};

});
