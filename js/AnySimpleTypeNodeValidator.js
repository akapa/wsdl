define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 'wsdl2/NodeValidator',
	 'wsdl2/XmlValidationResult', 'wsdl2/XmlValidationError'],
function (_, objTools, Xml, NodeValidator, XmlValidationResult, XmlValidationError) {
	
	var anySimpleTypeNodeValidator = objTools.make(NodeValidator, {
		getDefaultFacets: function () {
			return {};
		},
		getAllowedFacets: function () {
			return [];
		},
		getFacets: function (extensions) {
			return _(this.getDefaultFacets()).extend(_(extensions).pick(this.getAllowedFacets()));
		},
		validate: function () {
			var typeDef = this.findTypeDefFromNodeAttr(this.node, 'type', Xml.xsi);
			if (typeDef) {
				var validator = this.validatorFactory.getValidator(typeDef, this.node);
				return validator.validate();
			}
			return new XmlValidationResult();
		}
	});

	return function AnySimpleTypeNodeValidator () {
		var obj = objTools.construct(anySimpleTypeNodeValidator, AnySimpleTypeNodeValidator);
		return obj.init.apply(obj, arguments);
	}

});