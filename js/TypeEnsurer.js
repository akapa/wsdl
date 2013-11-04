define(['underscore', 'objTools'],
function (_, objTools) {

	var typeEnsurer = {
		init: function (typeLibrary) {
			this.typeLibrary = typeLibrary;
			return this;
		},
		ensure: function (value, typeDef) {

		}
	};

	var typeEnsurers = {
		'string' : function (value, tObj) {
			if (_.isString(value)) {
				return value;
			}
			throw new TypeError();
		},
		'boolean' : function (value, tObj) {
			if (_.contains([true, false, 1, 0, '1', '0'], value)) {
				return value ? true : false;
			}
			throw new TypeError();
		},
		'decimal' : function (value, tObj) {
			var num = parseFloat(value);
			if (isFinite(num)) {
				return num;
			}
			throw new TypeError();		
		},
		'float' : function (value, tObj) {
			if (value != value) {
				return value;
			}
			var num = parseFloat(value);
			if (!isNaN(num)) {
				return num;
			}
			throw new TypeError();		
		},
		'dateTime' : function (value, tObj) {
			if (value instanceof Date) {
				return value;
			}
			throw new TypeError();		
		},
		'date' : function (value, tObj) {
			return this.dateTime(value, tObj);
		},
		'time' : function (value, tObj) {
			return this.dateTime(value, tObj);
		},
		'gYearMonth' : function (value, tObj) {
			return this.dateTime(value, tObj);
		},
		'gMonthDay' : function (value, tObj) {
			return this.dateTime(value, tObj);
		},
		'integer' : function (value, tObj) {
			value = this.decimal(value, tObj);
			return Math.floor(value);
		},
		'int' : function (value, tObj) {
			value = this.integer(value, tObj);
			if (value >= -2147483648 && value <= 2147483647) {
				return value;
			}
			throw new TypeError();
		}
	};

	return function TypeEnsurer () {
		var obj = objTools.construct(typeEnsurer, TypeEnsurer);
		return obj.init.apply(obj, arguments);
	};
});