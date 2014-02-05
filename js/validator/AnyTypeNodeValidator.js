define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 'wsdl2/validator/NodeValidator',
	'wsdl2/primitiveUnserializers', 'wsdl2/XmlValidationResult', 'wsdl2/XmlValidationError'],
function (_, objTools, Xml, NodeValidator, primitiveUnserializers,
	XmlValidationResult, XmlValidationError) {
	
	var anyTypehNodeValidator = objTools.make(NodeValidator, {
		type: 'anyType',
		validate: function () {
			var type = this.xsdLibrary.getTypeFromNodeAttr(this.node, 'type', Xml.xsi);
			var validator = this.validatorFactory.getValidator(typeDef, this.node, type);
			return validator.validate();
		}
	});

	return function AnyTypeNodeValidator () {
		var obj = objTools.construct(anyTypeNodeValidator, AnyTypeNodeValidator);
		return obj.init.apply(obj, arguments);
	}

});