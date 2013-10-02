define(['underscore', 'Serializer'], function (_, Serializer) {
	var SoapSerializer = _(Serializer).extend({
		init: function (typeLibrary) {
			this.typeLibrary = typeLibrary;
			return this;
		},
		serialize: function (value, typeDef, name) {
			typeDef = _(typeDef).isString()
				? this.typeLibrary.getItem(typeDef)
				: typeDef;
			name = name || typeDef.type;

			var xml = '';
			if (typeDef.multiple) {
				xml += this.serializeMultiple(value, typeDef, name);
			}
			else if (typeDef.complex) {
				xml += this.serializeComplex(value, typeDef, name);
			}
			else {
				xml += value;
			}
			return xml;
		},
		unserialize: function (s) {
			return {};
		},
		serializeMultiple: function (obj, typeDef, name) {

		},
		serializeComplex: function (obj, typeDef, name) {
			var xml = '';
			_(typeDef.properties).each(function (propDef, key) {
				
			});
			return xml;
		}
	});

	return SoapSerializer;
});