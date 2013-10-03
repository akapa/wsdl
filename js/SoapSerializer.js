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

			if (typeDef.multiple) {
				return this.serializeMultiple(value, typeDef, name);
			}
			else if (_(value).isNull() || _(value).isUndefined()) {
				return Xml.getTag(name, '', { 'xs:nil': 'true' });
			}
			else if (typeDef.complex) {
				return this.serializeComplex(value, typeDef, name);
			}
			else {
				return Xml.getTag(name, value);
			}
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
				xml += this.serialize(value, propDef, key);
			}, this);

			var attribs = {};
			var objType = this.typeLibrary.getObjectType(obj);
			if (this.typeLibrary.exists(objType)) {
				attribs['type'] = objType;
			}

			return Xml.getTag(name, xml, attribs);
		},
		unserialize: function (s) {
			return {};
		}
	});

	return SoapSerializer;
});