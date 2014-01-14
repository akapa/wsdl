define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 'wsdl2/NodeValidator',
	 'wsdl2/XmlValidationResult', 'wsdl2/XmlValidationError'],
function (_, objTools, Xml, NodeValidator, XmlValidationResult, XmlValidationError) {
	var complexTypeNodeValidator = objTools.make(NodeValidator, {
		validate: function () {
			var xsdNow = this.getFirstElement(this.definition);
			var xmlNow, occurLimit;
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
					errors.concat(this.callChildValidators(xmlNow, xsdNow));
				}

			} while (xsdNow = this.getNextElement(xsdNow));

			return new XmlValidationResult(errors);
		},
		callChildValidators: function (xmlNodes, xsdNode) {
			var errors = [];
			var typeDef = this.findTypeDefFromNodeAttr(xsdNode, 'type');
			var validator = this.validatorFactory.getValidator(typeDef, xmlNodes[0]);
			_(xmlNodes).each(function (elem) {
				validator.node = elem;
				var result = validator.validate();
				if (!result.success) {
					errors.concat(result.errors);
				}
			});
			return errors;
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