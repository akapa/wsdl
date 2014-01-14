define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 
	'wsdl2/NodeValidator', 'wsdl2/ComplexTypeNodeValidator', 'wsdl2/AnySimpleTypeNodeValidator', 
	'wsdl2/StringNodeValidator'],
function (_, objTools, Xml, NodeValidator, AnySimpleTypeNodeValidator, ComplexTypeNodeValidator, 
	StringNodeValidator) {

	var nodeValidatorFactory = {
		init: function (xsdLibrary) {
			this.xsdLibrary = xsdLibrary;
			return this;
		},
		getValidator: function (definition, node) {
			if (_(definition).isString()) {
				return this.getValidatorByString(definition, node);
			}
			else if (definition instanceof Node) {
				return this.getValidatorByXsdNode(definition, node);
			}
			console.log('No suitable validator found for "' + definition + '".');
		},
		getValidatorByString: function (str, node) {
			if (str in strMappings) {
				return new strMappings[str](node, null, this);
			}
			console.log('No suitable validator found for "' + str + '".');
			return new NodeValidator(node, null, this);
		},
		getValidatorByXsdNode: function (xsdNode, node) {
			if (xsdNode.namespaceURI === Xml.xs && xsdNode.localName === 'complexType') {
				return new ComplexTypeNodeValidator(node, xsdNode, this);
			}
			console.log('No suitable validator found for "' + xsdNode + '".');
			return new NodeValidator(node, xsdNode, this);
		}
	};

	var strMappings = {
		'anySimpleType': AnySimpleTypeNodeValidator,
		'string': StringNodeValidator
	};

	return function NodeValidatorFactory () {
		var obj = objTools.construct(nodeValidatorFactory, NodeValidatorFactory);
		return obj.init.apply(obj, arguments);
	};

});