define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 
	'wsdl2/NodeValidator', 'wsdl2/ComplexTypeNodeValidator', 'wsdl2/AnySimpleTypeNodeValidator', 
	'wsdl2/StringNodeValidator', 'wsdl2/FloatNodeValidator'],
function (_, objTools, Xml, NodeValidator, ComplexTypeNodeValidator, AnySimpleTypeNodeValidator,
	StringNodeValidator, FloatNodeValidator) {

	var nodeValidatorFactory = {
		init: function (xsdLibrary) {
			this.xsdLibrary = xsdLibrary;
			return this;
		},
		getValidator: function (xsdElement, node, type) {
			//looking up a typeDefinition (complexType, simpleType or null)
			type = type || this.xsdLibrary.getTypeFromNodeAttr(xsdElement, 'type');
			var xsdNode = this.xsdLibrary.findTypeDefinition(type.namespaceURI, type.name);

			//if it is a base simple type, choose a pre-defined validator
			if (xsdNode === null && type.namespaceURI === Xml.xs) {
				if (type.name in strMappings) {
					return new strMappings[type.name](node, xsdElement, this);
				}
			}
			//complex type validator
			else if (xsdNode.namespaceURI === Xml.xs && xsdNode.localName === 'complexType') {
				return new ComplexTypeNodeValidator(node, xsdElement, this);
			}

			console.warn('No suitable validator found for "', xsdElement, '".');
			return new NodeValidator(node, xsdElement, this);
		}
	};

	var strMappings = {
		'anySimpleType': AnySimpleTypeNodeValidator,
		'string': StringNodeValidator,
		'float': FloatNodeValidator
	};

	return function NodeValidatorFactory () {
		var obj = objTools.construct(nodeValidatorFactory, NodeValidatorFactory);
		return obj.init.apply(obj, arguments);
	};

});