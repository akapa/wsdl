define(['underscore', 'Serializer', 'Xml'], function (_, Serializer, Xml) {
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
				xml += Xml.getTag(name, value);
			}
			return xml;
		},
		unserialize: function (s) {
			return {};
		},
		serializeMultiple: function (obj, typeDef, name) {
			typeDef = _(typeDef).omit('multiple');
			var xml = '';
			_(obj).each(function (value) {
				xml += this.serialize(value, typeDef, name);
			}, this);
			return xml;
		},
		serializeComplex: function (obj, typeDef, name) {
			var xml = '';
			_(typeDef.properties).each(function (propDef, key) {
				var value = obj[key];
				var isNull = _(value).isNull();
				var attribs = {};
				var serValue = isNull ? '' : this.serialize(value, propDef, key);
				if (isNull) {
					attribs['xs:nil'] = 'true';
				}
				xml += !propDef.multiple ? Xml.getTag(key, value, attribs) : serValue;
			}, this);
			return Xml.getTag(name, xml);
		}
	});

	return SoapSerializer;
});