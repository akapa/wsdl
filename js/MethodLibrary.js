define(['underscore', 'Library', 'MethodDefinition'],
function (_, Library, MethodDefinition) {
	var MethodLibrary = _(Library).extend({
		nameProperty: 'name',
		type: MethodDefinition
	});

	return MethodLibrary;
});