define(function () {
	var Xml = {
		makeAttribute: function (key, value) {
			return [' ', key, '="', value, '"'].join('');
		},
		makeOpenTag : function (name, att) {
			var att = att || {};
			var a = _.map(att, function (value, key) {
					return [' ', key, '="', value, '"'].join('');
				}).join('');
			return ['<', name, a, '>'].join('');
		},
		makeCloseTag : function (name) {
			return ['</', name, '>'].join('');
		},
		makeTag: function (name, val, att) {
			var value = val;
			if (!name) {
				return value;
			}
			return this.makeOpenTag(name, att)
				+ value
				+ this.makeCloseTag(name);
		},
		makeXmlHeader : function () {
			return '<?xml version="1.0" encoding="UTF-8"?>';
		},
		parseXml: function (s) {
			if (typeof window.DOMParser != "undefined") {
		        return ( new window.DOMParser() ).parseFromString(s, "text/xml");
			} else if (typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM")) {
			    var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
			    xmlDoc.async = "false";
			    xmlDoc.loadXML(s);
			    return xmlDoc;
			} else {
			    throw new Error("No XML parser found");
			}
		},
		getNodeText: function (node) {
			return node.textContent;
		},
		setNodeText: function (node, value) {
			node.textContent = value;
		},
		domToXml: function (dom) {
			return new XMLSerializer().serializeToString(dom);
		},
		createDocument: function (name, namespaces) {
			var doc = document.implementation.createDocument(namespaces[0], name, null);
			_(namespaces).each(function (ns, nskey) {
				if (nskey != 0) {
					doc.documentElement.setAttributeNS(
						'http://www.w3.org/2000/xmlns/', 
						'xmlns:' + nskey, 
						ns
					);
				}
			});
			return doc;
		}
	};
	return Xml;
});