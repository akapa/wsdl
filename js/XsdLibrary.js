define(['underscore', 'wsdl2/objTools', 'wsdl2/Library', 'wsdl2/Xml'],
function (_, objTools, Library, Xml) {
	var xsdLibrary = objTools.make(Library, {
		addItem: function (def, name) {
			var ns = name || def.documentElement.getAttributeNS(null, 'targetNamespace');
			var xsdCollection = this.exists(ns) 
				? this.getItem(ns)
				: [];
			xsdCollection.push(def);
			this.items[ns] = xsdCollection;
		},
		findElement: function (namespace, name) {
			var xsds = this.getItem(namespace) || [];
			var element;
			for (var i = 0, l = xsds.length; i < l; i++) {
				element = _(xsds[i].documentElement.children).find(function (child) {
					return child.namespaceURI === Xml.xs
						&& child.localName === 'element'
						&& child.getAttribute('name') === name;
				});
				if (element) {
					return element;
				}
			}
			return null;
		},
		findTypeDefinition: function (namespace, name) {
			var xsds = this.getItem(namespace) || [];
			var selector = 'complexType[name="' + name + '"], simpleType[name="' + name + '"]';
			var xsdNodes;
			for (var i = 0, l = xsds.length; i < l; i++) {
				xsdNodes = xsds[i].querySelectorAll(selector);
				if (xsdNodes.length > 0) {
					return xsdNodes[0];
				}
			}
			return null;
		},
		getTypeFromNodeAttr: function (node, typeAttr, typeAttrNS) {
			var type = typeAttrNS 
				? node.getAttributeNS(typeAttrNS, typeAttr)
				: node.getAttribute(typeAttr);
			var parts = type.split(':');
			return {
				namespaceURI: node.lookupNamespaceURI(parts[0]),
				name: parts[1]
			};
		},
		findTypeDefinitionFromNodeAttr: function (node, typeAttr, typeAttrNS) {
			var type = this.getTypeFromNodeAttr(node, typeAttr, typeAttrNS);
			return this.findTypeDefinition(type.namespaceURI, type.name);
		},
		findBaseTypeFor: function (node) {
			var xsdNow = node;
			var basetype;
			do {
				basetype = this.findRestrictedType(xsdNow);
				xsdNow = this.findTypeDefinition(basetype.namespaceURI, basetype.name);
			} while (xsdNow !== null);
			return basetype.name;
		},
		findRestrictedType: function (node) {
			var	element = _(node.children).find(function (child) {
				return child.namespaceURI === Xml.xs
					&& child.localName === 'restriction';
			});
			return this.getTypeFromNodeAttr(element, 'base');
		}
	});

	return function XsdLibrary () {
		var obj = objTools.construct(xsdLibrary, XsdLibrary);
		return obj.init.apply(obj, arguments);
	};
});