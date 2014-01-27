define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 'wsdl2/AnySimpleTypeNodeValidator',
	'wsdl2/XmlValidationResult', 'wsdl2/XmlValidationError'],
function (_, objTools, Xml, AnySimpleTypeNodeValidator, XmlValidationResult, XmlValidationError) {
	
	var decimalNodeValidator = objTools.make(AnySimpleTypeNodeValidator, {
		type: 'decimal',
		getBaseFacets: function () {
			return {
				'pattern': /^(\+|-)?([0-9]+(\.[0-9]*)?|\.[0-9]+)$/
			};
		},
		getAllowedFacets: function () {
			return [
				'pattern', 
				'enumeration',
				'maxInclusive',
				'maxExclusive',
				'minInclusive',
				'minExclusive',
				'assertions'
			];
		},
		validate: function () {
			var errors = [];

			errors = errors.concat(this.validateFacets());

			return new XmlValidationResult(errors);
		}
	});

	return function DecimalNodeValidator () {
		var obj = objTools.construct(decimalNodeValidator, DecimalNodeValidator);
		return obj.init.apply(obj, arguments);
	}

});