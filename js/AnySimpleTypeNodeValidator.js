define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 'wsdl2/NodeValidator',
	'wsdl2/primitiveUnserializers', 'wsdl2/XmlValidationResult', 'wsdl2/XmlValidationError'],
function (_, objTools, Xml, NodeValidator, primitiveUnserializers,
	XmlValidationResult, XmlValidationError) {
	
	var anySimpleTypeNodeValidator = objTools.make(NodeValidator, {
		type: 'anySimpleType',
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
			var type = this.getTypeFromNodeAttr(this.node, 'type', Xml.xsi);
			var validator = this.validatorFactory.getValidator(typeDef, this.node, type);
			return validator.validate();
		},
		getValue: function () {
			return Xml.getNodeText(this.node);
		},
		getRealValue: function (type, value) {
			var v = value || this.getValue();
			return type in primitiveUnserializers 
				? primitiveUnserializers[type](v)
				: v;
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
			return errors;
		},
		validatePattern: function (facetValue) {
			var r = new RegExp(['^', facetValue, '$'].join(''));
			return r.test(this.getValue());
		},
		validateMaxInclusive: function (facetValue) {
			return this.getRealValue(this.type) <= this.getRealValue(this.type, facetValue);
		},
		validateMinInclusive: function (facetValue) {
			return this.getRealValue(this.type) >= this.getRealValue(this.type, facetValue);
		},
		validateMaxExclusive: function (facetValue) {
			return this.getRealValue(this.type) < this.getRealValue(this.type, facetValue);
		},
		validateMinExclusive: function (facetValue) {
			return this.getRealValue(this.type) > this.getRealValue(this.type, facetValue);
		}
	});

	return function AnySimpleTypeNodeValidator () {
		var obj = objTools.construct(anySimpleTypeNodeValidator, AnySimpleTypeNodeValidator);
		return obj.init.apply(obj, arguments);
	}

});