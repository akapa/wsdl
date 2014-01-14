define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 
	'wsdl2/NodeValidator', 'wsdl2/ComplexTypeNodeValidator'],
function (_, objTools, Xml, NodeValidator, ComplexTypeNodeValidator) {
	var nodeValidatorFactory = {
		init: function (xsdLibrary) {
			this.xsdLibrary = xsdLibrary;
			return this;
		},
		getValidator: function (definition, node) {
			if (definition.namespaceURI === Xml.xs && definition.localName === 'complexType') {
				return new ComplexTypeNodeValidator(node, definition, this);
			}
			return new NodeValidator(node, definition, this);
		}
	};

	return function NodeValidatorFactory () {
		var obj = objTools.construct(nodeValidatorFactory, NodeValidatorFactory);
		return obj.init.apply(obj, arguments);
	};
});