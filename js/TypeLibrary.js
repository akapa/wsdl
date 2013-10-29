define(['underscore', 'objTools', 'Library', 'TypeDefinition'],
function (_, objTools, Library, TypeDefinition) {
	var capitalizeFirst = function (s) {
		return s[0].toUpperCase() + s.slice(1);
	};

	var typeLibrary = objTools.make(Library, {
		init: function (defs) {
			this.items = {};
			this.type = TypeDefinition;
			this.nameProperty = 'type';
			this.addItems(defs);
			return this;
		},
		getObjectType: function (obj) {
			if (!_(obj).isObject()) {
				return null;
			}
			if ('classify' in obj) {
				return obj.classify();
			}
			return 'Object';
		},
		getValueStrategy: function (obj, strategy) {
			var typeObj = this.getItem(this.getObjectType(obj));
			return typeObj.valueStrategy || strategy;
		},
		getValue: function (obj, key, strategy) {
			var s = this.getValueStrategy(obj, strategy);
			if (_(s).isObject() && _(s.get).isFunction()) {
				return s(key);
			}
			switch (s) {
				case 'gettersetter':
					return obj['get' + capitalizeFirst(key)]();
				case 'property':
				default:
					return obj[key];
			}
		},
		setValue: function (obj, key, value, strategy) {
			var s = this.getValueStrategy(obj, strategy);
			if (_(s).isObject() && _(s.set).isFunction()) {
				s(key, value);
			}
			else {
				switch (s) {
					case 'gettersetter':
						obj['set' + capitalizeFirst(key)](value);
					case 'property':
					default:
						obj[key] = value;
				}
			}
		},
		ensureType: function () {

		}
	});

	return function TypeLibrary () {
		var obj = objTools.construct(typeLibrary, TypeLibrary);
		return obj.init.apply(obj, arguments);
	};
});