define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 'wsdl2/validator/NodeValidator',
	'wsdl2/primitiveUnserializers', 'wsdl2/XmlValidationResult', 'wsdl2/XmlValidationError'],
function (_, objTools, Xml, NodeValidator, primitiveUnserializers,
	XmlValidationResult, XmlValidationError) {
	
	var anySimpleTypeNodeValidator = objTools.make(NodeValidator, {
		type: 'anySimpleType',
		validate: function () {
			var type = this.xsdLibrary.getTypeFromNodeAttr(this.node, 'type', Xml.xsi);
			var xsdNode = this.xsdLibrary.findTypeDefinition(type.namespaceURI, type.name);
			if (xsdNode.namespaceURI === Xml.xs && xsdNode.localName === 'complexType') {
				return new XmlValidationResult([
					new XmlValidationError(this.node, this.definition, 'simpleType')
				]);
			}
			var validator = this.validatorFactory.getValidator(typeDef, this.node, type);
			return validator.validate();
		}
	});

	return function AnySimpleTypeNodeValidator () {
		var obj = objTools.construct(anySimpleTypeNodeValidator, AnySimpleTypeNodeValidator);
		return obj.init.apply(obj, arguments);
	}

});