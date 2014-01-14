define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 'wsdl2/XmlValidationResult'],
function (_, objTools, Xml, XmlValidationResult) {
	var nodeValidator = {
		init: function (node, definition, validatorFactory) {
			this.node = node;
			this.definition = definition;
			this.validatorFactory = validatorFactory;
			return this;
		},
		validate: function () {
			return new XmlValidationResult();
		}
	};

	return function NodeValidator () {
		var obj = objTools.construct(nodeValidator, NodeValidator);
		return obj.init.apply(obj, arguments);
	}
});