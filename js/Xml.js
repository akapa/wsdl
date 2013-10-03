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
		}
	};
	return Xml;
});