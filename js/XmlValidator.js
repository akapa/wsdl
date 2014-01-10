define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 'wsdl2/XsdLibrary'], function (_, objTools, Xml, XsdLibrary) {
	var xmlValidator = {
		init: function () {
			this.xsdLibrary = new XsdLibrary();
			return this;
		},
		loadXsd: function (xsdDocument) {
			this.xsdLibrary.addItem(xsdDocument);
		},
		validate: function (xmlNode, type) {
			/*xmlNode = xmlNode instanceof Document ? xmlNode.documentElement : xmlNode;
			var xsdNode = this.getValidatorXsdNode(xmlNode.namespaceURI, xmlNode.localName);
			if (!xsdNode) {
				throw new Error('No matching XSD document to be validated against was found!');
			}
			var valRes = this.validateWithXsdNode(xmlNode, xsdNode);*/
		}
		/*,
		validateWithXsdNode: function (xmlNode, xsdNode) {
			var xsdNow, xmlNow;
			for (xsdNow = this.getFirstXsdNode(xsdNode); xsdNow; xsdNow = this.getNextXsdNode(xsdNow)) {
				xmlNow = _(xmlNode.children).filter(function (elem) {
					return elem.tagName === xsdNow.getAttribute('name');
				});
				//minOccurs,maxOccurs validalas
				//egyes nodeok validalasa ciklusban
			}
			return true;
		},
		getFirstXsdNode: function (xsdNode) {
			var elems = xsdNode.getElementsByTagNameNS(xsdNode.namespaceURI, 'element');
			return elems.length ? elems[0] : null;
		},
		getNextXsdNode: function (xsdCurrent) {
			return xsdCurrent.nextElementSibling;
		}*/
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