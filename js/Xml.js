define(function () {
	var Xml = {
		getOpenTag : function (name, att) {
			var att = att || {};
			var a = _.map(att, function (value, key) {
					return [' ', key, '="', value, '"'].join('');
				}).join('');
			return ['<', name, a, '>'].join('');
		},
		getCloseTag : function (name) {
			return ['</', name, '>'].join('');
		},
		getTag: function (name, val, att) {
			var value = val;
			if (!name) {
				return value;
			}
			return this.getOpenTag(name, att)
				+ value
				+ this.getCloseTag(name);
		},
		getHeader : function () {
			return '<?xml version="1.0" encoding="UTF-8"?>';
		},
		parse: function (s) {
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
		}
	};
	return Xml;
});