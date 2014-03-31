define(['underscore', 'objTools'],
function (_, objTools) {

	var typeEnsurer = {
		init: function (typeLibrary) {
			this.typeLibrary = typeLibrary;
			this.ensurers = typeEnsurers;
			return this;
		},
		ensureProperty: function (obj, key, value) {
			var typeDef = this.typeLibrary.getItem(this.typeLibrary.getObjectType(obj));
			var propDef = typeDef.properties[key];
			return this.ensure(value, propDef);
		},
		ensure: function (value, typeDef) {
			if (typeDef.multiple) {
				if (!_.isArray(value)) {
					throw new TypeError(errPrefix + 'value should be an Array.');
				}
				return _.map(value, function (current) {
					return this.ensure(current, _.omit(typeDef, 'multiple'));
				}, this);
			}
			else if (typeDef.type === 'anyType') {
				return value;
			}
			else if (typeDef.type in this.ensurers) {
				try {
					return this.ensurers[typeDef.type](value, typeDef);
				}
				catch (e) {
					throw e instanceof TypeError ?
						new TypeError(errPrefix + 'value should be a(n) ' + typeDef.type + '.') :
						e;
				}
			}
			else if (typeDef.complex) {
				var ot = this.typeLibrary.getObjectType(value);
				if (_(value).isNull()) {
					return null;
				}
				if (!ot || ot !== typeDef.type) {
					throw new TypeError(errPrefix + 'value should be the defined type: "' + typeDef.type + '".');
				}
				return value;
			}
			return value;
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