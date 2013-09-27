define(function () {
	var Serializer = {
		serialize: function (value) {
			return JSON.stringify(value);
		},
		unserialize: function (s) {
			return JSON.parse(s);
		}
	};

	return Serializer;
});