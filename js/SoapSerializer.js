define(['underscore', 'Serializer', 'Xml'], function (_, Serializer, Xml) {
	var SoapSerializer = _(Object.create(Serializer)).extend({
		init: function (typeLibrary) {
			this.typeLibrary = typeLibrary;
			return this;
		},
		serialize: function (value, name, typeDef) {
			if (!typeDef) {
				typeDef = this.typeLibrary.getObjectType(value);
			}
			if(_(typeDef).isString()) {
				typeDef = this.typeLibrary.getItem(typeDef);
				if (!typeDef) {
					throw new TypeError('The value passed cannot be classified and no explicit type definition was given.');
				}
			}

			if (typeDef.multiple) {
				return this.serializeMultiple(value, name, typeDef);
			}
			else if (_(value).isNull() || _(value).isUndefined()) {
				return Xml.getTag(name, '', { 'xs:nil': 'true' });
			}
			else if (typeDef.complex) {
				return this.serializeComplex(value, name, typeDef);
			}
			else {
				return Xml.getTag(name, value);
			}
		},
		unserialize: function (s) {
			return {};
		},
		serializeMultiple: function (obj, name, typeDef) {
			typeDef = _(typeDef).omit('multiple');
			var xml = '';
			_(obj).each(function (value) {
				xml += this.serialize(value, name, typeDef);
			}, this);
			return xml;
		},
		serializeComplex: function (obj, name, typeDef) {
			var xml = '';
			_(typeDef.properties).each(function (propDef, key) {
				var value = obj[key];
				xml += this.serialize(value, key, propDef);
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