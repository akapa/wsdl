define(['underscore'], function (_) {

	return {
		'boolean': function (value) {
			return value ? 'true' : 'false';
		},
		'float': function (value) {
			switch (value) {
				case Number.POSITIVE_INFINITY: 
					return 'INF';
				break;
				case Number.NEGATIVE_INFINITY: 
					return '-INF';
				break;
			}
			if (isNaN(value)) {
				return 'NaN';
			}
			return value.toExponential();
		},
		'dateTime': function (value) {
			return value.toISOString();
		},
		'date': function (value) {
			return value.toISOString().replace(/T[^Z+\-]*/, '');
		},
		'time': function (value) {
			return value.toISOString().replace(/^[^T]*T/, '');
		},
		'gYearMonth': function (value) {
			return value.toISOString().replace(/-[0-9]{2}T[^Z+\-]*/, '');
		},
		'gMonthDay': function (value) {
			return value.toISOString()
				.replace(/T[^Z+\-]*/, '')
				.replace(/^[0-9]{4}-/, '');
		}
	};

});