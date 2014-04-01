define(['objTools'], function (objTools) {

	var serializer = {
		serialize: function (value, name) {
			return JSON.stringify(value);
		},
		unserialize: function (s, name, typeDef) {
			return JSON.parse(s);
		}
	};

	return objTools.makeConstructor(function Serializer () {}, serializer);

});