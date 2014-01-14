define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 'wsdl2/XsdLibrary', 'wsdl2/NodeValidatorFactory'],
function (_, objTools, Xml, XsdLibrary, NodeValidatorFactory) {
	var xmlValidator = {
		init: function () {
			this.xsdLibrary = new XsdLibrary();
			this.nodeValidatorFactory = new NodeValidatorFactory(this.xsdLibrary);
			return this;
		},
		loadXsd: function (xsdDocument) {
			this.xsdLibrary.addItem(xsdDocument);
		},
		validate: function (xmlNode, type) {
			xmlNode = xmlNode instanceof Document ? xmlNode.documentElement : xmlNode;
			var definition = this.xsdLibrary.findXsdDefinition(
				xmlNode.namespaceURI, 
				type || xmlNode.localName
			);
			var validator = this.nodeValidatorFactory.getValidator(definition, xmlNode);
			console.log(validator);
			return validator.validate();
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

	return function XmlValidator () {
		var obj = objTools.construct(xmlValidator, XmlValidator);
		return obj.init.apply(obj, arguments);
	};
});