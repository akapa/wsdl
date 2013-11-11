define(['underscore', 'wsdl2/objTools', 'wsdl2/Serializer', 'wsdl2/Xml'], function (_, objTools, Serializer, Xml) {
	var xmlSerializer = objTools.make(Serializer, {
		init: function (typeLibrary, factory, namespaces) {
			this.typeLibrary = typeLibrary;
			this.factory = factory;
			this.ns = namespaces;
			this.primitiveSerializers = primitiveSerializers;
			this.primitiveUnserializers = primitiveUnserializers;
			return this;
		},
		serialize: function (value, name) {
			return Xml.domToXml(this.serializeToDOM(value, name));
		},
		serializeToDOM: function (value, name, typeDef, doc) {
			if (!typeDef) {
				typeDef = this.typeLibrary.getObjectType(value);
			}
			if(_(typeDef).isString()) {
				typeDef = this.typeLibrary.getItem(typeDef);
				if (!typeDef) {
					throw new TypeError('The value passed cannot be classified and no explicit type definition was given.');
				}
			}

			var elem;
			if (typeDef.multiple) {
				typeDef = _(typeDef).omit('multiple');
				elem = doc.createDocumentFragment();
				_(value).each(function (val) {
					elem.appendChild(this.serializeToDOM(val, name, typeDef, doc));
				}, this);
			}
			else {
				if (!doc) {
					doc = Xml.createDocument('my:' + name, this.ns);
					elem = doc.documentElement;
				}
				else {
					elem = doc.createElementNS(null, name);
				}

				if (_(value).isNull() || _(value).isUndefined()) {
					elem.setAttributeNS(this.ns['xsi'], 'xsi:nil', 'true');
				}
				else if (typeDef.complex || typeDef.type === 'anyType') {
					typeDef = this.typeLibrary.getItem(this.typeLibrary.getObjectType(value));
					_(typeDef.properties).each(function (propDef, key) {
						var val = value[key];
						elem.appendChild(this.serializeToDOM(val, key, propDef, doc));
					}, this);

					var objType = this.typeLibrary.getObjectType(value);
					if (this.typeLibrary.exists(objType)) {
						elem.setAttributeNS(this.ns['xsi'], 'xsi:type', 'my:' + objType);
					}
				}
				else {
					Xml.setNodeText(elem, typeDef.type in primitiveSerializers
						? this.primitiveSerializers[typeDef.type](value, typeDef)
						: value);
				}
			}
			return elem;
		},
		unserialize: function (s, name, typeDef) {
			typeDef = this.typeLibrary.getItem(name) || typeDef;
			return this.unserializeDOM(Xml.parseXml(s), name, typeDef);
		},
		unserializeDOM: function (dom, name, typeDef) {
			var res;
			var elem = dom.tagName === name 
				? dom 
				: dom.getElementsByTagNameNS(this.ns[0], name)[0]
					|| dom.getElementsByTagName(name)[0];
			if (typeDef.multiple) {
				res = [];
				while (elem && elem.tagName === name) {
					typeDef = _(typeDef).omit('multiple');
					res.push(this.unserializeDOM(elem, name, typeDef));
					elem = elem.nextSibling;
				}
			}
			else if (elem.getAttributeNS(this.ns['xsi'], 'nil') === 'true') {
				res = null;
			}
			else if (typeDef.complex || typeDef.type === 'anyType') {
				res = this.factory.make(typeDef.type);
				typeDef = this.typeLibrary.getItem(typeDef.type);
				_(typeDef.properties).each(function (prop, propName) {
					var propVal = this.unserializeDOM(elem, propName, prop);
					this.typeLibrary.setValue(res, propName, propVal);
				}, this);
			}
			else if (typeDef.type in primitiveUnserializers) {
				return this.primitiveUnserializers[typeDef.type](Xml.getNodeText(elem), typeDef);
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

	var primitiveUnserializers = {
		'boolean': function (s) {
			return s === 'true';
		},
		'float': function (s) {
			switch (s) {
				case 'INF':
					return Number.POSITIVE_INFINITY;
				break;
				case '-INF':
					return Number.NEGATIVE_INFINITY;
				break;
			}
			return parseFloat(s);
		},
		'decimal': function (s) {
			return parseFloat(s);
		},
		'int': function (s) {
			switch (s) {
				case 'INF':
					return Number.POSITIVE_INFINITY;
				break;
				case '-INF':
					return Number.NEGATIVE_INFINITY;
				break;
			}
			return parseInt(s, 10);
		},
		'integer': function (s) {
			return this.int(s);
		},
		'dateTime': function (s) {
			return new Date(s);
		},
		'date': function (s) {
			return new Date(s);
		},
		'time': function (s) {
			var time = s.match(/(\d{2}):(\d{2}):(\d{2}).(\d{3})/);
			var d = new Date();
			d.setUTCHours(time[1]);
			d.setUTCMinutes(time[2]);
			d.setUTCSeconds(time[3]);
			d.setUTCMilliseconds(time[4]);
			return d;
		},
		'gYearMonth': function (s) {
			return new Date(s);
		},
		'gMonthDay': function (s) {
			return new Date(s);
		}
	};

	return function XmlSerializer () {
		var obj = objTools.construct(xmlSerializer, XmlSerializer);
		return obj.init.apply(obj, arguments);
	};
});