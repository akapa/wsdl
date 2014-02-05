define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 'wsdl2/validator/SimpleTypeNodeValidator',
	 'wsdl2/XmlValidationResult', 'wsdl2/XmlValidationError'],
function (_, objTools, Xml, SimpleTypeNodeValidator, XmlValidationResult, XmlValidationError) {
	
	var stringNodeValidator = objTools.make(SimpleTypeNodeValidator, {
		type: 'string',
		getAllowedFacets: function () {
			return [
				'length', 
				'minLength', 
				'maxLength', 
				'pattern', 
				'enumeration', 
				'assertions'
			];
		},
		validateMaxLength: function (facetValue) {
			return this.getValue().length <= facetValue;
		},
		validateMinLength: function (facetValue) {
			return this.getValue().length >= facetValue;
		},
		validateLength: function (facetValue) {
			return this.getValue().length == facetValue;
		}
	});

	return function StringNodeValidator () {
		var obj = objTools.construct(stringNodeValidator, StringNodeValidator);
		return obj.init.apply(obj, arguments);
	}

});