define(['underscore', 'WebService', 'TypeLibrary', 'SoapSerializer'], 
function (_, WebService, TypeLibrary, SoapSerializer) {
	var ns = 'http://budget.kapa.org';

	var objects = {
		Event: {
			amount: 0,
			description: '',
			id: 0,
			time: 0,
			type: '',
			user: null
		}
	};

	var definitions = {
		'event': _(TypeDefinition).extend(
				name: null,
				type: 'event',
				ns: ns,
				complex: true,
				proto: objects.Event
			);
	};

	var typeLib = Object.create(TypeLibrary).init(definitions);
	var serializer = Object.create(SoapSerializer).init(typeLib);
	var ws = _(WebService).extend({

	}).init(serializer, {}, typeLib);

	return {
		service: ws,
		objects: objects,
		typeLib: typeLib
	};
});