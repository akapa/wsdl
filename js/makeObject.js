define(['underscore'], function (_) {
	return function makeObject (proto, extensions) {
		var obj = _(proto).isFunction() ? new proto() : Object.create(proto);
		if (extensions) {
			_(obj).extend(extensions);
		}
		return obj;
	};
});