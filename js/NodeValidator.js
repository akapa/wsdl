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
		findTypeDefFromNodeAttr: function (node, typeAttr) {
			var type = node.getAttribute(typeAttr);
			var parts = type.split(':');
			var ns = node.lookupNamespaceURI(parts[0]);
			var def = this.validatorFactory.xsdLibrary.findXsdDefinition(ns, parts[1]);
			return (!def && ns === Xml.xs) ? parts[1] : def;
		},
		parseMinMaxOccurs: function (xsdNode) {
			var min = xsdNode.getAttribute('minOccurs');
			if (min === null || min === '') {
				min = 1;
			}
			else {
				min = parseInt(min, 10);
			}
			var max = xsdNode.getAttribute('maxOccurs');
			if (max === null || max === '') {
				max = 1;
			}
			else if (max === 'unbounded') {
				max = Infinity;
			}
			else {
				max = parseInt(max, 10);
			}
			return { min: min, max: max	};
		}		
	};

	return function NodeValidator () {
		var obj = objTools.construct(nodeValidator, NodeValidator);
		return obj.init.apply(obj, arguments);
	}
});