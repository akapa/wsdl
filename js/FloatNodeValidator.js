define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 'wsdl2/AnySimpleTypeNodeValidator',
	'wsdl2/XmlValidationResult', 'wsdl2/XmlValidationError'],
function (_, objTools, Xml, AnySimpleTypeNodeValidator, XmlValidationResult, XmlValidationError) {
	
	var floatNodeValidator = objTools.make(AnySimpleTypeNodeValidator, {
		type: 'float',
		getBaseFacets: function () {
			return {
				'pattern': /^(\+|-)?([0-9]+(\.[0-9]*)?|\.[0-9]+)([Ee](\+|-)?[0-9]+)?|(\+|-)?INF|NaN$/
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
			return new XmlValidationResult(errors);
		}
	});

	return function FloatNodeValidator () {
		var obj = objTools.construct(floatNodeValidator, FloatNodeValidator);
		return obj.init.apply(obj, arguments);
	}

});