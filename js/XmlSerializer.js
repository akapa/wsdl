define(['underscore', 'objTools', 'wsdl/Serializer', 'xml',
	'primitiveSerializers', 'primitiveUnserializers'],
function (_, objTools, Serializer, xml, primitiveSerializers, primitiveUnserializers) {

	var xmlSerializer = objTools.make(Serializer, 
	/**
	 * @lends XmlSerializer.prototype
	 */
	{
		/**
		 * @constructor XmlSerializer
		 * @classdesc Serializes to XML and back, based on type definitions.
		 * @extends Serializer
		 * @param {TypeLibrary} typeLibrary - The type library to base serialization on.
		 * @param {Factory} factory - The factory to use to create objects.
		 * @param {Object.<string, string>} namespaces - Namespace lookup table to resolve short notation to full namespace URIs.
		 */
		init: function (typeLibrary, factory, namespaces) {
			/**
			 * The type library used by the serializer.
			 * @member {TypeLibrary} XmlSerializer#typeLibrary
			 */
			this.typeLibrary = typeLibrary;
			/**
			 * The factory used by the serializer.
			 * @member {Factory} XmlSerializer#factory
			 */
			this.factory = factory;
			/**
			 * A namespace lookup table (short to full).
			 * @member {Object.<string, string>} XmlSerializer#ns
			 */
			this.ns = namespaces;
			this.primitiveSerializers = primitiveSerializers;
			this.primitiveUnserializers = primitiveUnserializers;
			return this;
		},
		/**
		 * Takes a value and turns it into an XML representation.
		 * @param {*} value - The value to be serialized.
		 * @param {string} name - The type/identifier of the value.
		 * @returns {string} - The serialized value in XML format.
		 */
		serialize: function (value, name) {
			return xml.serializeToString(this.serializeToDOM(value, name));
		},
		/**
		 * Takes a value and creates an XML DOM representation based on type information.
		 * @param {*} value - The value to be serialized.
		 * @param {string} name - The type/identifier of the value.
		 * @param {TypeDefinition} [typeDef] - The type definition to be used.
		 * @param {Document} [doc] - The XML document to be used for creating nodes.
		 * @returns {Element|DocumentFragment} - The DOM element or document fragment (in case of 'multiple' type) created.
		 */
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
					doc = xml.createDocument(name, this.ns, 'myns');
					elem = doc.documentElement;
				}
				else {
					elem = doc.createElementNS(null, name);
				}

				if (_(value).isNull() || _(value).isUndefined()) {
					elem.setAttributeNS(this.ns.xsi, 'xsi:nil', 'true');
				}
				else if (typeDef.complex || typeDef.type === 'anyType') {
					typeDef = this.typeLibrary.getItem(this.typeLibrary.getObjectType(value));
					_(typeDef.properties).each(function (propDef, key) {
						var val = value[key];
						elem.appendChild(this.serializeToDOM(val, key, propDef, doc));
					}, this);

					var objType = this.typeLibrary.getObjectType(value);
					if (this.typeLibrary.exists(objType)) {
						elem.setAttributeNS(this.ns.xsi, 'xsi:type', 'myns:' + objType);
					}
				}
				else {
					xml.setNodeText(elem, typeDef.type in primitiveSerializers ?
						this.primitiveSerializers[typeDef.type](value, typeDef) :
						value);
				}
			}
			return elem;
		},
		/**
		 * Takes an XML string that is a representation of a value and turns it into a value.
		 * @param {string} s - The XML string representation.
		 * @param {string} name - The type/identifier of the value.
		 * @param {TypeDefinition} [typeDef] - The type definition for the type.
		 * @returns {*} - The unserialized value.
		 */
		unserialize: function (s, name, typeDef) {
			typeDef = this.typeLibrary.getItem(name) || typeDef;
			return this.unserializeDOM(xml.parseToDom(s), name, typeDef);
		},
		/**
		 * Takes an XML DOM that is a representation of a value and turns it into a value based on type definitions.
		 * @param {Element} dom - The XML DOM representation.
		 * @param {string} name - The type/identifier of the value.
		 * @param {TypeDefinition} typeDef - The type definition for the type.
		 * @returns {*} - The unserialized value.
		 */
		unserializeDOM: function (dom, name, typeDef) {
			var res;
			var elem = dom.tagName === name ?
				dom :
				dom.getElementsByTagNameNS(this.ns[0], name)[0]	|| 
					dom.getElementsByTagName(name)[0];
			if (typeDef.multiple) {
				res = [];
				while (elem && elem.tagName === name) {
					typeDef = _(typeDef).omit('multiple');
					res.push(this.unserializeDOM(elem, name, typeDef));
					elem = elem.nextSibling;
				}
			}
			else if (elem.getAttributeNS(this.ns.xsi, 'nil') === 'true') {
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
				return this.primitiveUnserializers[typeDef.type](xml.getNodeText(elem), typeDef);
			}
			else {
				return xml.getNodeText(elem);
			}
			return res;
		}
	});

	return objTools.makeConstructor(function XmlSerializer () {}, xmlSerializer);
	
});