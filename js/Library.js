define(['underscore'], function (_) {
	var Library = {
		items: {},
		type: null,
		nameProperty: 'name',
		init: function (defs) {
			this.addItems(defs);
			return this;
		},
		addItem: function (def, name) {
			name = name || def[this.nameProperty];
			this.items[name] = def;
		},
		addItems: function (defs) {
			_(defs).each(function (val) {
				this.addItem(val);
			}, this);
		},
		getDefinition: function (name) {
			return this.items[name];
		}
	};

	return Library;
});