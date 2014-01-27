define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 'wsdl2/NodeValidator',
	'wsdl2/primitiveUnserializers', 'wsdl2/XmlValidationResult', 'wsdl2/XmlValidationError'],
function (_, objTools, Xml, NodeValidator, primitiveUnserializers,
	XmlValidationResult, XmlValidationError) {
	
	var anySimpleTypeNodeValidator = objTools.make(NodeValidator, {
		type: 'anySimpleType',
		getBaseFacets: function () {
			return {};
		},
		getAllowedFacets: function () {
			return [];
		},
		getFacets: function (extensions) {
			return _(extensions).pick(this.getAllowedFacets());
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
		validateFacets: function () {
			var errors = [];	
			var type = this.xsdLibrary.getTypeFromNodeAttr(this.definition, 'type');
			var current, findings;
			var validatedFacets = [];
			while (current = this.xsdLibrary.findTypeDefinition(type.namespaceURI, type.name)) {
				findings = _(this.xsdLibrary.findRestrictingFacets(current))
					.map(_(function (elem) { 
						this.validateFacet(elem, validatedFacets);
					}).bind(this));
				errors = errors.concat(_(findings).compact());
				type = this.xsdLibrary.getRestrictedType(current);
			}
			errors = errors.concat(this.validateBaseFacets());
			return errors;
		},
		validateFacet: function (facetNode, validatedFacets) {
			var facetName = facetNode.localName;
			
			if (this.getAllowedFacets().indexOf(facetName) === -1) {
				return;
			}
			
			var fixed = facetNode.getAttribute('fixed') === 'true';
			if (!fixed && validatedFacets.indexOf(facetName) !== -1) {
				return;
			}

			validatedFacets.push(facetName);
			return this.invokeFacetValidation(facetName, facetNode.getAttribute('value'), facetNode);
		},
		invokeFacetValidation: function (facetName, facetValue, facetNode) {
			var method = 'validate' + facetName[0].toUpperCase() + facetName.slice(1);
			var text = facetNode ? facetName : 'baseType';
			facetNode = facetNode || this.definition;
			if (method in this) {
				if (!this[method](facetValue)) {
					return new XmlValidationError(this.node, facetNode, text);
				}
			}
		},
		validateBaseFacets: function () {
			var findings = _(this.getBaseFacets())
				.map(_(function (value, name) { 
					this.invokeFacetValidation(name, value);
				}).bind(this));
			return _(findings).compact();
		},
		validatePattern: function (facetValue) {
			var r = _(facetValue).isRegExp() 
				? facetValue 
				: new RegExp(['^', facetValue, '$'].join(''));
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