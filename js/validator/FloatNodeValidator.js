define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 'wsdl2/validator/SimpleTypeNodeValidator',
	'wsdl2/XmlValidationResult', 'wsdl2/XmlValidationError'],
function (_, objTools, Xml, SimpleTypeNodeValidator, XmlValidationResult, XmlValidationError) {
	
	var floatNodeValidator = objTools.make(SimpleTypeNodeValidator, {
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
				'minInclusive',
				'maxExclusive',
				'minExclusive',
				'assertions'
			];
		}
	});

	return function FloatNodeValidator () {
		var obj = objTools.construct(floatNodeValidator, FloatNodeValidator);
		return obj.init.apply(obj, arguments);
	}

});