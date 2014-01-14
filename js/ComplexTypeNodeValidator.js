define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 'wsdl2/NodeValidator',
	 'wsdl2/XmlValidationResult', 'wsdl2/XmlValidationError'],
function (_, objTools, Xml, NodeValidator, XmlValidationResult, XmlValidationError) {
	var complexTypeNodeValidator = objTools.make(NodeValidator, {
		validate: function () {
			var xsdNow = this.getFirstElement(this.definition);
			var xmlNow, occurLimit, validator, childXsd;
			var errors = [];
			do {
				//collecting XML nodes that are to be validated by the current XSD node
				xmlNow = _(this.node.children).filter(function (elem) {
					return elem.tagName === xsdNow.getAttribute('name');
				});

				//minOccurs, maxOccurs check
				occurLimit = this.parseMinMaxOccurs(xsdNow);
				if (xmlNow.length > occurLimit.max || xmlNow.length < occurLimit.min) {
					errors.push(new XmlValidationError(this.node, xsdNow));
				}

				//calling the right validators for all nodes
				if (xmlNow.length) {
					childXsd = this.findTypeDefFromNodeAttr(xsdNow, 'type');
					validator = this.validatorFactory.getValidator(childXsd, xmlNow[0]);
					console.log(xmlNow[0], childXsd);
					_(xmlNow).each(function (elem) {
						validator.node = elem;
						var result = validator.validate();
						if (!result.success) {
							errors.concat(result.errors);
						}
					});
				}

			} while (xsdNow = this.getNextElement(xsdNow));

			return new XmlValidationResult(errors);
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
		},
		getFirstElement: function (xsdNode) {
			var elems = xsdNode.getElementsByTagNameNS(xsdNode.namespaceURI, 'element');
			return elems.length ? elems[0] : null;
		},
		getNextElement: function (xsdCurrent) {
			return xsdCurrent.nextElementSibling;
		}
	});

	return function ComplexTypeNodeValidator () {
		var obj = objTools.construct(complexTypeNodeValidator, ComplexTypeNodeValidator);
		return obj.init.apply(obj, arguments);
	}
});