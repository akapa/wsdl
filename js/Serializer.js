define(['objTools'], function (objTools) {
	var serializer = {
		serialize: function (value) {
			return JSON.stringify(value);
		},
		unserialize: function (s) {
			return JSON.parse(s);
		}
	};

	return function Serializer () {
		return objTools.construct(serializer, Serializer);
	};
});