define(['objTools'], function (objTools) {
	var serializer = {
		serialize: function (value, name, typeDef) {
			return JSON.stringify(value);
		},
		unserialize: function (s, name, typeDef) {
			return JSON.parse(s);
		}
	};

	return function Serializer () {
		return objTools.construct(serializer, Serializer);
	};
});