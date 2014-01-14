define(['underscore', 'wsdl2/objTools'], function (_, objTools) {
	var xmlValidationError = {
		init: function (failingNode, failedXsdNode, type) {
			this.failingNode = failingNode || null;
			this.failedXsdNode = failedXsdNode || null;
			this.type = type;
			return this;
		}
	};
	return function XmlValidationError () {
		var obj = objTools.construct(xmlValidationError, XmlValidationError);
		return obj.init.apply(obj, arguments);
	}
});