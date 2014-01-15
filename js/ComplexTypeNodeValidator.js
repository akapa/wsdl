define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 'wsdl2/NodeValidator',
	 'wsdl2/XmlValidationResult', 'wsdl2/XmlValidationError'],
function (_, objTools, Xml, NodeValidator, XmlValidationResult, XmlValidationError) {
	var complexTypeNodeValidator = objTools.make(NodeValidator, {
		validate: function () {
			//MISSING: need to handle inheritance/restriction!
			var errors = [];

			//check if the whole node is nil
			if (this.node.getAttributeNS(Xml.xs, 'nil') === 'true') {
 				if (xsdNode.getAttribute('nillable') !== 'true') {
 					errors.push(new XmlValidationError(elem, xsdNode, 'nillable'));
				}
			}
			else {
				var xsdNow = this.getFirstElement(this.definition);
				var xmlNow, occurLimit;
				do {
					//collecting XML nodes that are to be validated by the current XSD node
					xmlNow = _(this.node.children).filter(function (elem) {
						return elem.tagName === xsdNow.getAttribute('name');
					});

					//minOccurs, maxOccurs check
					occurLimit = this.parseMinMaxOccurs(xsdNow);
					if (xmlNow.length > occurLimit.max) {
						errors.push(new XmlValidationError(this.node, xsdNow, 'maxOccurs'));
					}
					if (xmlNow.length < occurLimit.min) {
						errors.push(new XmlValidationError(this.node, xsdNow, 'minOccurs'));
					}

					//calling the right validators for all nodes
					if (xmlNow.length) {
						errors = errors.concat(this.callChildValidators(xmlNow, xsdNow));
					}

				} while (xsdNow = this.getNextElement(xsdNow));
			}

			return new XmlValidationResult(errors);
		},
		callChildValidators: function (xmlNodes, xsdNode) {
			var errors = [];
			//selecting the right validator for the job
			var typeDef = this.findTypeDefFromNodeAttr(xsdNode, 'type');
			var validator = this.validatorFactory.getValidator(typeDef, xmlNodes[0]);
			var nillable = xsdNode.getAttribute('nillable') === 'true';

			_(xmlNodes).each(function (elem) {
				//check for nil elements
				if (elem.getAttributeNS(Xml.xsi, 'nil') === 'true') {
 					if (!nillable) {
 						errors.push(new XmlValidationError(elem, xsdNode, 'nillable'));
 					}
				}
				else {
					//running the chosen validator on the element
					validator.node = elem;
					var result = validator.validate();
					if (!result.success) {
						errors = errors.concat(result.errors);
					}
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
	});

	return function ComplexTypeNodeValidator () {
		var obj = objTools.construct(complexTypeNodeValidator, ComplexTypeNodeValidator);
		return obj.init.apply(obj, arguments);
	}
});