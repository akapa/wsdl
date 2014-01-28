define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 
	'wsdl2/NodeValidator', 'wsdl2/ComplexTypeNodeValidator', 'wsdl2/AnySimpleTypeNodeValidator', 
	'wsdl2/StringNodeValidator', 'wsdl2/FloatNodeValidator', 'wsdl2/DecimalNodeValidator',
	'wsdl2/BooleanNodeValidator', 'wsdl2/DateTimeNodeValidator'],
function (_, objTools, Xml, NodeValidator, ComplexTypeNodeValidator, AnySimpleTypeNodeValidator,
	StringNodeValidator, FloatNodeValidator, DecimalNodeValidator, BooleanNodeValidator,
	DateTimeNodeValidator) {

	var nodeValidatorFactory = {
		init: function (xsdLibrary) {
			this.xsdLibrary = xsdLibrary;
			return this;
		},
		getValidator: function (xsdElement, node, type) {
			//looking up a typeDefinition (complexType, simpleType or null)
			type = type || this.xsdLibrary.getTypeFromNodeAttr(xsdElement, 'type');
			var xsdNode = type
				? this.xsdLibrary.findTypeDefinition(type.namespaceURI, type.name)
				: xsdElement.children[0];

			//if it is a base simple type, choose a pre-defined validator
			if (!xsdNode) {
				if (type && type.namespaceURI === Xml.xs && type.name in strMappings) {
					return new strMappings[type.name](node, xsdElement, this);
				}
			}
			//simple type
			else if (xsdNode.namespaceURI === Xml.xs && xsdNode.localName === 'simpleType') {
				var basetype = this.xsdLibrary.findBaseTypeFor(xsdNode);
				if (basetype in strMappings) {
					return new strMappings[basetype](node, xsdElement, this);
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
		'float': FloatNodeValidator,
		'double': FloatNodeValidator,
		'decimal': DecimalNodeValidator,
		'dateTime': DateTimeNodeValidator,
		'int': DecimalNodeValidator,
		'boolean': BooleanNodeValidator
	};

	return function NodeValidatorFactory () {
		var obj = objTools.construct(nodeValidatorFactory, NodeValidatorFactory);
		return obj.init.apply(obj, arguments);
	};

});