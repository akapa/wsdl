define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 'wsdl2/validator/SimpleTypeNodeValidator',
	'wsdl2/XmlValidationResult', 'wsdl2/XmlValidationError'],
function (_, objTools, Xml, SimpleTypeNodeValidator, XmlValidationResult, XmlValidationError) {
	
	var booleanNodeValidator = objTools.make(SimpleTypeNodeValidator, {
		type: 'boolean',
		getBaseFacets: function () {
			return {
				'pattern': /^true|false|1|0$/
			};
		},
		getAllowedFacets: function () {
			return [
				'pattern', 
				'assertions'
			];
		}
	});

	return function BooleanNodeValidator () {
		var obj = objTools.construct(booleanNodeValidator, BooleanNodeValidator);
		return obj.init.apply(obj, arguments);
	}

});