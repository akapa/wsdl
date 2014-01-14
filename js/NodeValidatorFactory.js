define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 
	'wsdl2/NodeValidator', 'wsdl2/ComplexTypeNodeValidator'],
function (_, objTools, Xml, NodeValidator, ComplexTypeNodeValidator) {
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
			console.log('nobasszameg');
			//return new NodeValidator(node, definition, this);
		},
		getValidatorByString: function (str, node) {
			console.log(str, node);
			return new NodeValidator(node, str, this);
		},
		getValidatorByXsdNode: function (xsdNode, node) {
			if (xsdNode.namespaceURI === Xml.xs && xsdNode.localName === 'complexType') {
				return new ComplexTypeNodeValidator(node, xsdNode, this);
			}
			return new NodeValidator(node, xsdNode, this);
		}
	};

	return function NodeValidatorFactory () {
		var obj = objTools.construct(nodeValidatorFactory, NodeValidatorFactory);
		return obj.init.apply(obj, arguments);
	};
});