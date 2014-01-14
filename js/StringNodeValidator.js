define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 'wsdl2/AnySimpleTypeNodeValidator',
	 'wsdl2/XmlValidationResult', 'wsdl2/XmlValidationError'],
function (_, objTools, Xml, AnySimpleTypeNodeValidator, XmlValidationResult, XmlValidationError) {
	
	var stringNodeValidator = objTools.make(AnySimpleTypeNodeValidator, {
		getDefaultFacets: function () {
			return {
				whiteSpace: 'preserve'
			};
		},
		getAllowedFacets: function () {
			return [
				'whiteSpace', 
				'length', 
				'minLength', 
				'maxLength', 
				'pattern', 
				'enumeration', 
				'assertions'
			];
		},
		validate: function () {
			//MISSING: need to handle inheritance/restriction!
			return this.validateFacets();
		}
	});

	return function StringNodeValidator () {
		var obj = objTools.construct(stringNodeValidator, StringNodeValidator);
		return obj.init.apply(obj, arguments);
	}

});