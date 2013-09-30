define(['underscore', 'Serializer'], function (_, Serializer) {
	var SoapSerializer = _(Serializer).extend({
		init: function (typeLibrary) {
			this.typeLibrary = typeLibrary;
			return this;
		},
		serialize: function (value, typeDef, name) {

		},
		unserialize: function (s) {

		}
	});

	return SoapSerializer;
});