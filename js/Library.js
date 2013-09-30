define(['underscore'], function (_) {
	var Library = {
		init: function (defs) {
			this.items = {};
			this.type = null;
			this.nameProperty = 'name';
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
		getItem: function (name) {
			return this.items[name];
		}
	};

	return Library;
});