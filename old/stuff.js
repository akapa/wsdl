(function(global, $, undefined){

	$.fn.getAttributes = function () {
		var a = {};
		_.each(this[0].attributes, function (el, i) {
			a[el.nodeName] = el.nodeValue;
		});
		return a;
	};

	$.fn.findNs = function (name) {
		return this.find('*').filter(function () {
			return this.nodeName.toLowerCase() === name.toLowerCase();
		});
	};

	String.prototype.capitalizeFirst = function () {
		return this.charAt(0).toUpperCase() + this.slice(1);
	};

	Object.makeNamed = function (name, proto) {
			var c = Function('return function ' + name + '(){}')();
			c.prototype = proto ? proto : {};
			return new c();
	};

	var Xml = {
		splitNs : function (s) {
			return s.split(':');
		},
		wipeNs : function (s) {
		var a = Xml.splitNs(s);
		return a.length ? a[1] : a[0];
		},
		load : function (url, callback) {
			$.get(url, callback, 'text');
		},
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
			return this.getOpenTag(name, att)
				+ val
				+ this.getCloseTag(name);
		},
		getHeader : function () {
			return '<?xml version="1.0" encoding="UTF-8"?>';
		}
	};
	global.Xml = Xml;


}(this, jQuery))