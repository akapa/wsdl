(function(global, $, undefined) {

	var WebService = function (wsdo) {
		var complexes = {};
		_.each(wsdo.types, function (v, k) {
			var name = k.capitalizeFirst();
			complexes[name] = _.bind(ComplexType, {}, v, k);
		});
		var serializer = Serializer(wsdo.types);

		var obj = Object.makeNamed('WebService');

		var members = {
			call : function (methodName, requestObj, callback) {
				var method = wsdo.methods[methodName];
				var serialized = serializer.serialize(
					requestObj,
					wsdo.types[method.input],
					method.input
				);
				var namespaces = {
					'xmlns' : wsdo.namespace,
					'xmlns:soap' : 'http://schemas.xmlsoap.org/soap/envelope/',
					'xmlns:xs' : 'http://www.w3.org/2001/XMLSchema'				
				};
				var envelope = Xml.getTag(
					'soap:Envelope',
					Xml.getTag(
						'soap:Body',
						Xml.getTag(method.input, serialized)
					),
					namespaces	
				);

				var requestXml = Xml.getHeader() + envelope;
				console.log(requestXml);

				/*$.ajax({
					type: 'post',
					url: wsdo.url,
					contentType: 'text/xml',
					data: requestXml,
					dataType: 'text',
					processData: false,
					beforeSend: function (xhr) {
						xhr.setRequestHeader('SOAPAction', '""');
					},
					success: function (response) {
						console.log(response);
					}
				});*/
			},
			makeObject : function (name) {
				return complexes[name]();
			}
		};

		return _.extend(obj, members);
	};

	var typeEnsurers = {
		'string' : function (value, tObj) {
			if (_.isString(value)) {
				return value;
			}
			throw new TypeError();
		},
		'boolean' : function (value, tObj) {
			if (_.contains([true, false, 1, 0, '1', '0'], value)) {
				return value ? true : false;
			}
			throw new TypeError();
		},
		'decimal' : function (value, tObj) {
			var num = parseFloat(value);
			if (isFinite(num)) {
				return num;
			}
			throw new TypeError();		
		},
		'float' : function (value, tObj) {
			if (value != value) {
				return value;
			}
			var num = parseFloat(value);
			if (!isNaN(num)) {
				return num;
			}
			throw new TypeError();		
		},
		'dateTime' : function (value, tObj) {
			if (value instanceof Date) {
				return value;
			}
			throw new TypeError();		
		},
		'date' : function (value, tObj) {
			if (value instanceof Date) {
				return value;
			}
			throw new TypeError();		
		},
		'time' : function (value, tObj) {
			if (value instanceof Date) {
				return value;
			}
			throw new TypeError();		
		},
		'gYearMonth' : function (value, tObj) {
			if (value instanceof Date) {
				return value;
			}
			throw new TypeError();		
		},
		'gMonthDay' : function (value, tObj) {
			if (value instanceof Date) {
				return value;
			}
			throw new TypeError();		
		},
		'integer' : function (value, tObj) {
			value = typeEnsurers['decimal'](value, tObj);
			return Math.floor(value);
		},
		'int' : function (value, tObj) {
			value = typeEnsurers['integer'](value, tObj);
			if (value >= -2147483648 && value <= 2147483647) {
				return value;
			}
			throw new TypeError();
		}
	};
	
	var TypeEnsurer = function () {
		var obj = Object.makeNamed('TypeEnsurer');
		
		var errPrefix = 'Type ensurement failed - ';

		var members = {
			ensure: function me (value, typeObj) {
				if (typeObj.multiple) {
					if (!_.isArray(value)) {
						throw new TypeError(errPrefix + 'value should be an Array.');
					}
					return _.map(value, function (current) {
						return me(current, _.omit(typeObj, 'multiple'));
					});
				}
				else if (typeObj.type === 'anyType') {
					return value;
				}
				else if (typeObj.type in typeEnsurers) {
					try {
						return typeEnsurers[typeObj.type](value, typeObj);
					}
					catch (e) {
						throw e instanceof TypeError
							? new TypeError(errPrefix + 'value should be a(n) ' + typeObj.type + '.')
							: e;
					}
				}
				else if (typeObj.complex) {
					if (!('classify' in value) || typeObj.type !== value.classify()) {
						throw new TypeError(errPrefix + 'value should be ComplexType "' + typeObj.type + '".');
					}
					return value;
				}
				return value;
			}
		};

		return _.extend(obj, members);
	};

	var typeSerializers = {
		'boolean': {
			serialize: function (value, tObj) {
				return value ? 'true' : 'false';
			}
		},
		'float': {
			serialize: function (value, tObj) {
				switch (value) {
					case Number.POSITIVE_INFINITY: 
						return 'INF';
					break;
					case Number.NEGATIVE_INFINITY: 
						return '-INF';
					break;
				}
				if (isNaN(value)) {
					return 'NaN';
				}
				return value.toExponential();
			}
		},
		'dateTime' : {
			serialize: function (value, tObj) {
				return value.toISOString();
			}
		},
		'date' : {
			serialize: function (value, tObj) {
				return value.toISOString().replace(/T[^Z+\-]*/, '');
			}
		},
		'time' : {
			serialize: function (value, tObj) {
				return value.toISOString().replace(/^[^T]*T/, '');
			}
		},
		'gYearMonth' : {
			serialize: function (value, tObj) {
				return value.toISOString().replace(/-[0-9]{2}T[^Z+\-]*/, '');
			}
		},
		'gMonthDay' : {
			serialize: function (value, tObj) {
				return value.toISOString()
					.replace(/T[^Z+\-]*/, '')
					.replace(/^[0-9]{4}-/, '');
			}
		}
	};

	var Serializer = function (complexTypes) {

		var isComplex = function (obj, typeObj) {
			return typeObj.type in complexTypes
				|| ((!('type' in typeObj) || typeObj.type === 'anyType')
						&& 'classify' in obj
						&& obj.classify() in complexTypes);
		};

		var obj = Object.makeNamed('Serializer');

		var members = {
			serialize: function (data, typeObj, name) {
				var xml = '';

				if (typeObj.multiple) {
					var tObj = _.omit(typeObj, 'multiple');
					_.each(data, function (elem, i) {
						var attribs = {};
						if (isComplex(elem, tObj)) {
							attribs['type'] = elem.classify();
						}
						var val = obj.serialize(elem, tObj, name);
						xml += Xml.getTag(name, val, attribs);
					});
				}
				else if (isComplex(data, typeObj)) {
					var descriptor = complexTypes[data.classify()];
					_.each(descriptor, function (elem, key) {
						var d = data.get(key);
						var isNull = d === null;
						var attribs = {};
						if (isNull) {
							attribs['xs:nil'] = 'true';
						}
						else if (!elem.multiple && elem.type in complexTypes) {
							attribs['type'] = d.classify();
						}

						if (!elem.multiple) xml += Xml.getOpenTag(key, attribs);
						xml += isNull ? '' : obj.serialize(d, elem, key);
						if (!elem.multiple) xml += Xml.getCloseTag(key);
					});
				}
				else if (typeObj.type in typeSerializers && 'serialize' in typeSerializers[typeObj.type]) {
					xml += typeSerializers[typeObj.type].serialize(data, typeObj);
				}
				else {
					xml += data;
				}
				
				return xml;
			},
			unserialize: function (node) {

			}
		};

		return _.extend(obj, members);
	};

	var ComplexType = function (descriptors, typeName) {
		var properties = {};
		_.each(descriptors, function (v, k) {
			properties[k] = v.multiple ? [] : null;
		});

		var obj = Object.makeNamed(typeName ? typeName : 'ComplexType');

		var members = {
			get: function (key) {
				if (key in properties) {
					return properties[key];
				}
				else {
					throw new ReferenceError('Property does not exist.');
				}
			},
			set: function (key, value) {
				if (key in properties) {
					var ensurer = TypeEnsurer();
					properties[key] = ensurer.ensure(value, descriptors[key]);
				}
				else {
					throw new ReferenceError('Cannot set non-existing property.');
				}
			},
			classify: function () {
				return typeName;
			}
		};

		_.each(properties, function (v, k) {
			members['get' + k.capitalizeFirst()] = function () {
				return members.get(k);
			};
			members['set' + k.capitalizeFirst()] = function (value) {
				return members.set(k, value);
			};
		});

		return _.extend(obj, members);
	};

	var WsdlReader = {
		extractFromWsdl : function (xml) {
			var $xml = $($.parseXML(xml));
			
			var $service = $xml.find('service');
			var service = $service.getAttributes();

			var ops = {};
			$xml.find('portType operation').each(function () {
				var $this = $(this);
				var name = $this.attr('name');
				var ways = ['input', 'output'];
				ops[name] = {};

				_.each(ways, function (el) {
					var $elem = $this.find(el);
					ops[name][el] = $elem.length 
						? Xml.wipeNs($elem.attr('message'))
						: null;
				});
			});
			service.methods = ops;

			service.xsdUrl = $xml.findNs('xsd:import').attr('schemaLocation');
			service.url = $service.findNs('soap:address').attr('location');
			service.namespace = $xml.find('definitions').attr('targetNamespace');

			return service;
		},
		extractFromXsd : function (xml) {
			var $xsd = $($.parseXML(xml));
			var types = {};

			$xsd.findNs('xs:complexType').each(function () {
				var $this = $(this);
				var name = $this.attr('name');
				var $elements = $this.findNs('xs:element');
				types[name] = {};

				$elements.each(function () {
					var $el = $(this);
					var typeId = Xml.splitNs($el.attr('type'));
					types[name][$el.attr('name')] = {
						type: typeId[1],
						multiple: typeof $el.attr('maxOccurs') !== 'undefined',
						complex: typeId[0] !== 'xs'
					};
				});
			});

			return types;
		}
	};

	global.WsTools = {
		WsdlToWsdo : function (url, callback) {
			Xml.load(url, function (xml) {
				var wsdo = WsdlReader.extractFromWsdl(xml);

				Xml.load(wsdo.xsdUrl, function (xml) {
					wsdo.types = WsdlReader.extractFromXsd(xml);
					callback(wsdo);
				});
			});
		},
		WsdoToService : function (wsdo) {
			return WebService(wsdo);
		},
		getSerializer: function (o) {
			return Serializer(o);
		},
		getEnsurer: function () {
			return TypeEnsurer();
		}
	};

} (this, jQuery));