requirejs.config({
	paths: {
		'underscore': 'lib/underscore'
	},
	shim: {
		'underscore': {
			exports: '_'
		}
	}
});

requirejs(['underscore', 'wsconfig'], function (_, wsconfig) {
	var service = wsconfig.service;
	console.log(service);

	var reqObj = service.factory.make('getEventsInRange');
	service.call('getEventsInRange', reqObj);

	var user = _.extend(service.factory.make('user'), {
		id: 11,
		name: 'Gipsz Jakab'
	});

	var ev = _.extend(service.factory.make('event'), {
		amount: 10.5,
		description: 'This is a test',
		id: 56,
		time: new Date('08/31/96 12:55'),
		type: 'income',
		user: user
	});

	var ev2 = _.extend(service.factory.make('event'), {
		amount: 29.11,
		description: 'Another one',
		id: 101,
		time: new Date('05/15/86 22:00'),
		type: 'income',
		user: user
	});

	var resp = _.extend(service.factory.make('getEventsInRangeResponse'), {
		return: [ev, ev2]
	});

	var xml = service.serializer.serialize(resp, 'getEventsInRangeResponse');
	document.getElementById('show').innerText = formatXml(xml);

	var td = service.typeLibrary.getItem('getEventsInRangeResponse');
	console.log(td, service.serializer.unserialize(xml, 'getEventsInRangeResponse', td));
});

function formatXml(xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;

    _.each(xml.split('\r\n'), function(node, index) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        }
        else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        }
        else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
            indent = 1;
        }
        else {
            indent = 0;
        }
        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }
        formatted += padding + node + '\r\n';
        pad += indent;
    });

    return formatted;
}