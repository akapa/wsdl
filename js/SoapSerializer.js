define(['underscore', 'objTools', 'Serializer', 'Xml'], function (_, objTools, Serializer, Xml) {
	var soapSerializer = objTools.make(Serializer, {
		init: function (typeLibrary, factory) {
			this.typeLibrary = typeLibrary;
			this.factory = factory;
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
				return Xml.makeTag(name, '', { 'xs:nil': 'true' });
			}
			else if (typeDef.complex) {
				return this.serializeComplex(value, name);
			}
			else if (typeDef.type in primitiveSerializers) {
				return Xml.makeTag(name, primitiveSerializers[typeDef.type](value, typeDef));
			}
			else {
				return Xml.makeTag(name, value);
			}
		},
		serializeWithNamespaces: function (value, name, namespaces, typeDef) {
			var xml = this.serialize(value, name, typeDef);
			var ns = '';
			_(namespaces).each(function (name, key) {
				var attrKey = 'xmlns' + (key == 0 ? '' : ':' + key);
				ns += Xml.makeAttribute(attrKey, name);
			});
			var pos = xml.indexOf('>');
			if (pos && ns) {
				xml = [xml.slice(0, pos), ns, xml.slice(pos)].join('');
			}
			return xml;
		},
		serializeMultiple: function (obj, name, typeDef) {
			typeDef = _(typeDef).omit('multiple');
			var xml = '';
			_(obj).each(function (value) {
				xml += this.serialize(value, name, typeDef);
			}, this);
			return xml;
		},
		serializeComplex: function (obj, name) {
			var xml = '';
			var typeDef = this.typeLibrary.getItem(this.typeLibrary.getObjectType(obj));
			_(typeDef.properties).each(function (propDef, key) {
				var value = obj[key];
				xml += this.serialize(value, key, propDef);
			}, this);

			var attribs = {};
			var objType = this.typeLibrary.getObjectType(obj);
			if (this.typeLibrary.exists(objType)) {
				attribs['type'] = objType;
			}

			return Xml.makeTag(name, xml, attribs);
		},
		unserialize: function (s, name, typeDef) {
			return this.unserializeDOM(Xml.parseXml(s), name, typeDef);
		},
		unserializeDOM: function (dom, name, typeDef) {
			var res;
			var elem = dom.tagName === name ? dom : dom.querySelector(name);
			if (typeDef.multiple) {
				res = [];
				while (elem && elem.tagName === name) {
					typeDef = _(typeDef).omit('multiple');
					res.push(this.unserializeDOM(elem, name, typeDef));
					elem = elem.nextSibling;
				}
			}
			else if (elem.getAttribute('xs:nil') === 'true') {
				res = null;
			}
			else if (typeDef.complex) {
				res = this.factory.make(typeDef.type);
				typeDef = this.typeLibrary.getItem(typeDef.type);
				_(typeDef.properties).each(function (prop, propName) {
					var propVal = this.unserializeDOM(elem, propName, prop);
					this.typeLibrary.setValue(res, propName, propVal);
				}, this);
			}
			else {
				return Xml.getNodeText(elem);
			}
			return res;
		}
	});

	var primitiveSerializers = {
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

	return function SoapSerializer () {
		var obj = objTools.construct(soapSerializer, SoapSerializer);
		return obj.init.apply(obj, arguments);
	};
});