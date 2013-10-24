define(function () {
	var serializer = {
		serialize: function (value) {
			return JSON.stringify(value);
		},
		unserialize: function (s) {
			return JSON.parse(s);
		}
	};

	return function Serializer () {
		var obj = Object.create(serializer, {
			constructor: { value: Serializer }
		});
		return obj;
	};
});