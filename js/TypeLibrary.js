define(['underscore', 'Library', 'TypeDefinition'],
function (_, Library, TypeDefinition) {
	var TypeLibrary = _(Library).extend({
		type: TypeDefinition,
		nameProperty: 'type',
		getObjectType: function (obj) {
			return obj.classify();
		}
	});

	return TypeLibrary;
});