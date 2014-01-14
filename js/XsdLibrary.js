define(['underscore', 'wsdl2/objTools', 'wsdl2/Library'],
function (_, objTools, Library) {
	var xsdLibrary = objTools.make(Library, {
		addItem: function (def, name) {
			var ns = name || def.documentElement.getAttributeNS(null, 'targetNamespace');
			var xsdCollection = this.exists(ns) 
				? this.getItem(ns)
				: [];
			xsdCollection.push(def);
			this.items[ns] = xsdCollection;
		},		
		findXsdDefinition: function (namespace, name) {
			var xsds = this.getItem(namespace) || [];
			var nodes;
			for (var i = 0, l = xsds.length; i < l; i++) {
				nodes = xsds[i].querySelectorAll('complexType[name="' + name + '"], simpleType[name="' + name + '"]');
				if (nodes.length) {
					return nodes[0];
				}
			}
			return null;
		}
	});

	return function XsdLibrary () {
		var obj = objTools.construct(xsdLibrary, XsdLibrary);
		return obj.init.apply(obj, arguments);
	};
});