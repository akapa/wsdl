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
		},
		getValue: function () {
			return Xml.getNodeText(this.node);
		},
		validateFacets: function (extensions) {
			var errors = [];
			var facets = this.getFacets(extensions);
			_(facets).each(_(function (elem, key) {
				var method = 'validate' + key[0].toUpperCase() + key.slice(1);
				if (method in this) {
					var result = this[method](elem);
					if (!result) {
						errors.push(new XmlValidationError(this.node, this.definition, key));
					}
				}
			}).bind(this));
			return new XmlValidationResult(errors);
		},
		validatePattern: function (facetValue) {
			var r = new RegExp(['^', facetValue, '$'].join(''));
			return r.test(this.getValue());
		}
	});

	return function AnySimpleTypeNodeValidator () {
		var obj = objTools.construct(anySimpleTypeNodeValidator, AnySimpleTypeNodeValidator);
		return obj.init.apply(obj, arguments);
	}

});