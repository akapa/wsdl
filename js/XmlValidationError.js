define(['underscore', 'wsdl2/objTools'], function (_, objTools) {
	var xmlValidationError = {
		init: function (failingNode, failedXsdNode) {
			this.failingNode = failingNode || null;
			this.failedXsdNode = failedXsdNode || null;
			return this;
		}
	};
	return function XmlValidationError () {
		var obj = objTools.construct(xmlValidationError, XmlValidationError);
		return obj.init.apply(obj, arguments);
	}
});