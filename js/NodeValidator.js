define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 'wsdl2/XmlValidationResult'],
function (_, objTools, Xml, XmlValidationResult) {
	var nodeValidator = {
		init: function (node, definition, validatorFactory) {
			this.node = node;
			this.definition = definition;
			this.validatorFactory = validatorFactory;
			return this;
		},
		validate: function () {
			return new XmlValidationResult();
		},
		findTypeDefFromNodeAttr: function (node, typeAttr, typeAttrNS) {
			var type = typeAttrNS 
				? node.getAttributeNS(typeAttrNS, typeAttr)
				: node.getAttribute(typeAttr);
			var parts = type.split(':');
			var ns = node.lookupNamespaceURI(parts[0]);
			var def = this.validatorFactory.xsdLibrary.findXsdDefinition(ns, parts[1]);
			return (!def && ns === Xml.xs) ? parts[1] : def;
		}
	};

	return function NodeValidator () {
		var obj = objTools.construct(nodeValidator, NodeValidator);
		return obj.init.apply(obj, arguments);
	}
});