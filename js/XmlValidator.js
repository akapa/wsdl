define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 'wsdl2/Library'], function (_, objTools, Xml, Library) {
	var xmlValidator = {
		init: function () {
			this.xsdLibrary = new Library();
			return this;
		},
		loadXsd: function (xsdDocument) {
			var ns = xsdDocument.documentElement.getAttributeNS(null, 'targetNamespace');
			var xsdCollection = this.xsdLibrary.exists(ns) 
				? this.xsdLibrary.getItem(ns)
				: [];
			xsdCollection.push(xsdDocument);
			this.xsdLibrary.addItem(xsdCollection, ns);
		},
		validate: function (xmlNode) {
			xmlNode = xmlNode instanceof Document ? xmlNode.documentElement : xmlNode;
			var xsd = this.getValidatorXsdNode(xmlNode);
			if (!xsd) {
				throw new Error('No matching XSD document to be validated against was found!');
			}

			var result = new XmlValidationResult();
			result.success = true;
			return result;
		},
		getValidatorXsdNode: function (xmlNode) {
			var ns = xmlNode.namespaceURI;
			var type = xmlNode.localName;
			var xsds = this.xsdLibrary.getItem(ns);
			for (var i = 0, l = xsds.length; i < l; i++) {
				if (xsds[i].querySelectorAll('complexType[name="' + type + '"]').length) {
					return xsds[i];
				}
			}
		}
	};

	var xmlValidationResult = {
		success: true,
		errors: []
	};
	function XmlValidationResult () {
		return objTools.construct(xmlValidationResult, XmlValidationResult);
	}

	var xmlValidationError = {
		failingNode: null,
		failedSchemaNode: null		
	};
	function XmlValidationError () {
		return objTools.construct(xmlValidationError, XmlValidationError);
	}

	return function XmlValidator () {
		var obj = objTools.construct(xmlValidator, XmlValidator);
		return obj.init.apply(obj, arguments);
	};
});