define(['underscore', 'objTools', 'Library', 'xml'],
function (underscore, objTools, Library, xml) {

var wsdl_WebService = function (_, objTools, xml) {
        var webService = {
                init: function (name, serializer, factory, methodLibrary, typeLibrary) {
                    this.name = name;
                    this.serializer = serializer;
                    this.factory = factory;
                    this.methodLibrary = methodLibrary;
                    this.typeLibrary = typeLibrary;
                    this.responseSuccessRegex = /^(20\d|1223)$/;
                    return this;
                },
                call: function (method, requestObj, onSuccess, onError) {
                    var methodDef = this.methodLibrary.getItem(method);
                    var serializedRequestObj = this.serializer.serialize(requestObj, methodDef.requestObject);
                    var envelope = this.getSoapEnvelope(serializedRequestObj);
                    var req = new XMLHttpRequest();
                    req.onreadystatechange = function () {
                        if (req.readyState === 4) {
                            this.handleResponse(method, req, onSuccess, onError);
                        }
                    }.bind(this);
                    req.open('post', methodDef.endpoint, true);
                    req.setRequestHeader('Content-Type', 'text/xml');
                    var stuff = [
                            this.serializer.ns.myns.replace(/\/+$/, ''),
                            this.name,
                            methodDef.name
                        ];
                    req.setRequestHeader('SOAPAction', stuff.join('/'));
                    req.send(envelope);
                },
                callWithPlainObject: function (method, params, onSuccess, onError) {
                    var reqObjName = this.methodLibrary.getItem(method).requestObject;
                    var reqConstr = this.typeLibrary.getItem(reqObjName).constructorFunction;
                    var reqObj = objTools.make(reqConstr, params);
                    this.call(method, reqObj, onSuccess, onError);
                },
                handleResponse: function (method, xhr, onSuccess, onError) {
                    if (this.responseSuccessRegex.test(xhr.status) && onSuccess) {
                        this.handleSuccess(method, xhr, onSuccess);
                    } else if (onError) {
                        this.handleError(method, xhr, onError);
                    }
                },
                handleSuccess: function (method, xhr, onSuccess) {
                    var methodDef = this.methodLibrary.getItem(method);
                    var obj = methodDef.responseObject ? this.serializer.unserialize(xhr.responseText, methodDef.responseObject) : {};
                    onSuccess(obj, xhr.status, xhr.statusText);
                },
                handleError: function (method, xhr, onError) {
                    var errorObj = {};
                    onError(errorObj, xhr.status, xhr.statusText);
                },
                getSoapEnvelope: function (contents) {
                    var soapNs = 'http://schemas.xmlsoap.org/soap/envelope/';
                    var doc = xml.createDocument('Envelope', { 'soap': soapNs }, 'soap');
                    var body = doc.createElementNS(soapNs, 'soap:Body');
                    xml.setNodeText(body, '%PH%');
                    doc.documentElement.appendChild(body);
                    return '<?xml version="1.0" encoding="UTF-8"?>' + xml.serializeToString(doc).replace('%PH%', contents);
                }
            };
        return objTools.makeConstructor(function WebService() {
        }, webService);
    }(underscore, objTools, xml);
var wsdl_MethodDefinition = function (objTools) {
        var methodDefinition = {
                name: null,
                requestObj: null,
                responseObj: null,
                endpoint: ''
            };
        return objTools.makeConstructor(function MethodDefinition() {
        }, methodDefinition);
    }(objTools);
var wsdl_MethodLibrary = function (_, objTools, Library, MethodDefinition) {
        var methodLibrary = objTools.make(Library, {
                init: function (defs) {
                    this.items = {};
                    this.type = MethodDefinition;
                    this.nameProperty = 'name';
                    this.addItems(defs);
                    return this;
                }
            });
        return objTools.makeConstructor(function MethodLibrary() {
        }, methodLibrary);
    }(underscore, objTools, Library, wsdl_MethodDefinition);
var wsdl_Serializer = function (objTools) {
        var serializer = {
                serialize: function (value, name) {
                    return JSON.stringify(value);
                },
                unserialize: function (s, name, typeDef) {
                    return JSON.parse(s);
                }
            };
        return objTools.makeConstructor(function Serializer() {
        }, serializer);
    }(objTools);
var wsdl_primitiveSerializers = function (_) {
        return {
            'boolean': function (value) {
                return value ? 'true' : 'false';
            },
            'float': function (value) {
                if (value === Number.POSITIVE_INFINITY) {
                    return 'INF';
                }
                if (value === Number.NEGATIVE_INFINITY) {
                    return '-INF';
                }
                if (isNaN(value)) {
                    return 'NaN';
                }
                return value.toExponential();
            },
            'dateTime': function (value) {
                return value.toISOString();
            },
            'date': function (value) {
                return value.toISOString().replace(/T[^Z+\-]*/, '');
            },
            'time': function (value) {
                return value.toISOString().replace(/^[^T]*T/, '');
            },
            'gYearMonth': function (value) {
                return value.toISOString().replace(/-[0-9]{2}T[^Z+\-]*/, '');
            },
            'gMonthDay': function (value) {
                return value.toISOString().replace(/T[^Z+\-]*/, '').replace(/^[0-9]{4}-/, '');
            }
        };
    }(underscore);
var wsdl_primitiveUnserializers = function (_) {
        return {
            'boolean': function (s) {
                return [
                    'true',
                    '1'
                ].indexOf(s) !== -1;
            },
            'float': function (s) {
                if (s === 'INF') {
                    return Number.POSITIVE_INFINITY;
                }
                if (s === '-INF') {
                    return Number.NEGATIVE_INFINITY;
                }
                return parseFloat(s);
            },
            'decimal': function (s) {
                return parseFloat(s);
            },
            'int': function (s) {
                return parseInt(s, 10);
            },
            'integer': function (s) {
                return this.int(s);
            },
            'dateTime': function (s) {
                return new Date(s);
            },
            'date': function (s) {
                return new Date(s);
            },
            'time': function (s) {
                var time = s.match(/(\d{2}):(\d{2}):(\d{2}).(\d{3})/);
                var d = new Date();
                d.setUTCHours(time[1]);
                d.setUTCMinutes(time[2]);
                d.setUTCSeconds(time[3]);
                d.setUTCMilliseconds(time[4]);
                return d;
            },
            'gYearMonth': function (s) {
                return new Date(s);
            },
            'gMonthDay': function (s) {
                return new Date('2004-' + s);
            },
            'gYear': function (s) {
                return this.int(s);
            },
            'gDay': function (s) {
                return this.int(s);
            },
            'gMonth': function (s) {
                return this.int(s);
            }
        };
    }(underscore);
var wsdl_XmlSerializer = function (_, objTools, Serializer, xml, primitiveSerializers, primitiveUnserializers) {
        var xmlSerializer = objTools.make(Serializer, {
                init: function (typeLibrary, factory, namespaces) {
                    this.typeLibrary = typeLibrary;
                    this.factory = factory;
                    this.ns = namespaces;
                    this.primitiveSerializers = primitiveSerializers;
                    this.primitiveUnserializers = primitiveUnserializers;
                    return this;
                },
                serialize: function (value, name) {
                    return xml.serializeToString(this.serializeToDOM(value, name));
                },
                serializeToDOM: function (value, name, typeDef, doc) {
                    if (!typeDef) {
                        typeDef = this.typeLibrary.getObjectType(value);
                    }
                    if (_(typeDef).isString()) {
                        typeDef = this.typeLibrary.getItem(typeDef);
                        if (!typeDef) {
                            throw new TypeError('The value passed cannot be classified and no explicit type definition was given.');
                        }
                    }
                    var elem;
                    if (typeDef.multiple) {
                        typeDef = _(typeDef).omit('multiple');
                        elem = doc.createDocumentFragment();
                        _(value).each(function (val) {
                            elem.appendChild(this.serializeToDOM(val, name, typeDef, doc));
                        }, this);
                    } else {
                        if (!doc) {
                            doc = xml.createDocument(name, this.ns, 'myns');
                            elem = doc.documentElement;
                        } else {
                            elem = doc.createElementNS(null, name);
                        }
                        if (_(value).isNull() || _(value).isUndefined()) {
                            elem.setAttributeNS(this.ns.xsi, 'xsi:nil', 'true');
                        } else if (typeDef.complex || typeDef.type === 'anyType') {
                            typeDef = this.typeLibrary.getItem(this.typeLibrary.getObjectType(value));
                            _(typeDef.properties).each(function (propDef, key) {
                                var val = value[key];
                                elem.appendChild(this.serializeToDOM(val, key, propDef, doc));
                            }, this);
                            var objType = this.typeLibrary.getObjectType(value);
                            if (this.typeLibrary.exists(objType)) {
                                elem.setAttributeNS(this.ns.xsi, 'xsi:type', 'myns:' + objType);
                            }
                        } else {
                            xml.setNodeText(elem, typeDef.type in primitiveSerializers ? this.primitiveSerializers[typeDef.type](value, typeDef) : value);
                        }
                    }
                    return elem;
                },
                unserialize: function (s, name, typeDef) {
                    typeDef = this.typeLibrary.getItem(name) || typeDef;
                    return this.unserializeDOM(xml.parseToDom(s), name, typeDef);
                },
                unserializeDOM: function (dom, name, typeDef) {
                    var res;
                    var elem = dom.tagName === name ? dom : dom.getElementsByTagNameNS(this.ns[0], name)[0] || dom.getElementsByTagName(name)[0];
                    if (typeDef.multiple) {
                        res = [];
                        while (elem && elem.tagName === name) {
                            typeDef = _(typeDef).omit('multiple');
                            res.push(this.unserializeDOM(elem, name, typeDef));
                            elem = elem.nextSibling;
                        }
                    } else if (elem.getAttributeNS(this.ns.xsi, 'nil') === 'true') {
                        res = null;
                    } else if (typeDef.complex || typeDef.type === 'anyType') {
                        res = this.factory.make(typeDef.type);
                        typeDef = this.typeLibrary.getItem(typeDef.type);
                        _(typeDef.properties).each(function (prop, propName) {
                            var propVal = this.unserializeDOM(elem, propName, prop);
                            this.typeLibrary.setValue(res, propName, propVal);
                        }, this);
                    } else if (typeDef.type in primitiveUnserializers) {
                        return this.primitiveUnserializers[typeDef.type](xml.getNodeText(elem), typeDef);
                    } else {
                        return xml.getNodeText(elem);
                    }
                    return res;
                }
            });
        return objTools.makeConstructor(function XmlSerializer() {
        }, xmlSerializer);
    }(underscore, objTools, wsdl_Serializer, xml, wsdl_primitiveSerializers, wsdl_primitiveUnserializers);
var wsdl_Factory = function (objTools) {
        var factory = {
                init: function (typeLib) {
                    this.typeLibrary = typeLib;
                    return this;
                },
                make: function (name) {
                    var def = this.typeLibrary.getItem(name);
                    return new def.constructorFunction();
                },
                makeAndFill: function (name, props) {
                    var obj = this.make(name);
                    _(props).each(function (value, key) {
                        this.typeLibrary.setValue(obj, key, value);
                    }, this);
                    return obj;
                }
            };
        return objTools.makeConstructor(function Factory() {
        }, factory);
    }(objTools);
var wsdl_TypeDefinition = function (objTools) {
        var typeDefinition = {
                type: 'anyType',
                ns: 'http://www.w3.org/2001/XMLSchema',
                multiple: false,
                complex: false,
                properties: {},
                constructorFunction: null,
                valueStrategy: 'property'
            };
        return objTools.makeConstructor(function TypeDefinition() {
        }, typeDefinition);
    }(objTools);
var wsdl_TypeLibrary = function (_, objTools, Library, TypeDefinition) {
        var capitalizeFirst = function (s) {
            return s[0].toUpperCase() + s.slice(1);
        };
        var typeLibrary = objTools.make(Library, {
                init: function (defs) {
                    this.items = {};
                    this.type = TypeDefinition;
                    this.nameProperty = 'type';
                    this.addItems(defs);
                    this.typeEnsurer = null;
                    return this;
                },
                getObjectType: function (obj) {
                    if (!_(obj).isObject()) {
                        return null;
                    }
                    if ('classify' in obj) {
                        return obj.classify();
                    }
                    return 'Object';
                },
                getValueStrategy: function (obj) {
                    var typeObj = this.getItem(this.getObjectType(obj));
                    return typeObj.valueStrategy;
                },
                getValue: function (obj, key) {
                    var s = this.getValueStrategy(obj);
                    if (_(s).isObject() && _(s.get).isFunction()) {
                        return s(key);
                    }
                    var ret;
                    switch (s) {
                    case 'gettersetter':
                        ret = obj['get' + capitalizeFirst(key)]();
                        break;
                    case 'property':
                        ret = obj[key];
                        break;
                    default:
                        ret = obj[key];
                    }
                    return ret;
                },
                setValue: function (obj, key, value) {
                    if (this.typeEnsurer) {
                        value = this.typeEnsurer.ensureProperty(obj, key, value);
                    }
                    var s = this.getValueStrategy(obj);
                    if (_(s).isObject() && _(s.set).isFunction()) {
                        s(key, value);
                    } else {
                        switch (s) {
                        case 'gettersetter':
                            obj['set' + capitalizeFirst(key)](value);
                            break;
                        case 'property':
                            obj[key] = value;
                            break;
                        default:
                            obj[key] = value;
                        }
                    }
                }
            });
        return objTools.makeConstructor(function TypeLibrary() {
        }, typeLibrary);
    }(underscore, objTools, Library, wsdl_TypeDefinition);
var wsdl_TypeEnsurer = function (_, objTools) {
        var typeEnsurer = {
                init: function (typeLibrary) {
                    this.typeLibrary = typeLibrary;
                    this.ensurers = typeEnsurers;
                    return this;
                },
                ensureProperty: function (obj, key, value) {
                    var typeDef = this.typeLibrary.getItem(this.typeLibrary.getObjectType(obj));
                    var propDef = typeDef.properties[key];
                    return this.ensure(value, propDef);
                },
                ensure: function (value, typeDef) {
                    if (typeDef.multiple) {
                        if (!_.isArray(value)) {
                            throw new TypeError(errPrefix + 'value should be an Array.');
                        }
                        return _.map(value, function (current) {
                            return this.ensure(current, _.omit(typeDef, 'multiple'));
                        }, this);
                    } else if (typeDef.type === 'anyType') {
                        return value;
                    } else if (typeDef.type in this.ensurers) {
                        try {
                            return this.ensurers[typeDef.type](value, typeDef);
                        } catch (e) {
                            throw e instanceof TypeError ? new TypeError(errPrefix + 'value should be a(n) ' + typeDef.type + '.') : e;
                        }
                    } else if (typeDef.complex) {
                        var ot = this.typeLibrary.getObjectType(value);
                        if (_(value).isNull()) {
                            return null;
                        }
                        if (!ot || ot !== typeDef.type) {
                            throw new TypeError(errPrefix + 'value should be the defined type: "' + typeDef.type + '".');
                        }
                        return value;
                    }
                    return value;
                }
            };
        var typeEnsurers = {
                'string': function (value, tObj) {
                    if (_.isString(value)) {
                        return value;
                    }
                    throw new TypeError();
                },
                'boolean': function (value, tObj) {
                    if (_.contains([
                            true,
                            false,
                            1,
                            0,
                            '1',
                            '0'
                        ], value)) {
                        return value ? true : false;
                    }
                    throw new TypeError();
                },
                'decimal': function (value, tObj) {
                    var num = parseFloat(value);
                    if (isFinite(num)) {
                        return num;
                    }
                    throw new TypeError();
                },
                'float': function (value, tObj) {
                    if (value != value) {
                        return value;
                    }
                    var num = parseFloat(value);
                    if (!isNaN(num)) {
                        return num;
                    }
                    throw new TypeError();
                },
                'dateTime': function (value, tObj) {
                    if (value instanceof Date) {
                        return value;
                    }
                    throw new TypeError();
                },
                'date': function (value, tObj) {
                    return this.dateTime(value, tObj);
                },
                'time': function (value, tObj) {
                    return this.dateTime(value, tObj);
                },
                'gYearMonth': function (value, tObj) {
                    return this.dateTime(value, tObj);
                },
                'gMonthDay': function (value, tObj) {
                    return this.dateTime(value, tObj);
                },
                'integer': function (value, tObj) {
                    value = this.decimal(value, tObj);
                    return Math.floor(value);
                },
                'int': function (value, tObj) {
                    value = this.integer(value, tObj);
                    if (value >= -2147483648 && value <= 2147483647) {
                        return value;
                    }
                    throw new TypeError();
                }
            };
        return objTools.makeConstructor(function TypeEnsurer() {
        }, typeEnsurer);
    }(underscore, objTools);
var wsdl_gen_wsconfig = function (objTools, MethodDefinition) {
        //WSDL METHOD DEFINITIONS
        return [
            objTools.make(MethodDefinition, {
                name: 'deleteObjects',
                requestObject: 'deleteObjects',
                responseObject: null,
                endpoint: 'REPLACE_WITH_ACTUAL_URL'
            }),
            objTools.make(MethodDefinition, {
                name: 'getRecentEvents',
                requestObject: 'getRecentEvents',
                responseObject: 'getRecentEventsResponse',
                endpoint: 'REPLACE_WITH_ACTUAL_URL'
            }),
            objTools.make(MethodDefinition, {
                name: 'storeObjects',
                requestObject: 'storeObjects',
                responseObject: null,
                endpoint: 'REPLACE_WITH_ACTUAL_URL'
            }),
            objTools.make(MethodDefinition, {
                name: 'getEventsInRange',
                requestObject: 'getEventsInRange',
                responseObject: 'getEventsInRangeResponse',
                endpoint: 'REPLACE_WITH_ACTUAL_URL'
            }),
            objTools.make(MethodDefinition, {
                name: 'getAmount',
                requestObject: 'getAmount',
                responseObject: 'getAmountResponse',
                endpoint: 'REPLACE_WITH_ACTUAL_URL'
            })
        ];
    }(objTools, wsdl_MethodDefinition);
var wsdl_gen_typeconfig = function (objTools, TypeDefinition) {
        var namespaces = {
                'myns': 'http://budget.kapa.org/',
                'xs': 'http://www.w3.org/2001/XMLSchema',
                'xsi': 'http://www.w3.org/2001/XMLSchema-instance'
            };
        var objects = {};
        var constructors = {};
        var types = {};
        //getRecentEvents
        objects['getRecentEvents'] = {
            classify: function () {
                return 'getRecentEvents';
            }
        };
        constructors['getRecentEvents'] = objTools.makeConstructor(function GetRecentEvents() {
        }, objects['getRecentEvents']);
        types['getRecentEvents'] = objTools.make(TypeDefinition, {
            type: 'getRecentEvents',
            ns: namespaces[0],
            complex: true,
            constructorFunction: constructors['getRecentEvents'],
            properties: {}
        });
        //getRecentEventsResponse
        objects['getRecentEventsResponse'] = {
            'return': [],
            classify: function () {
                return 'getRecentEventsResponse';
            }
        };
        constructors['getRecentEventsResponse'] = objTools.makeConstructor(function GetRecentEventsResponse() {
        }, objects['getRecentEventsResponse']);
        types['getRecentEventsResponse'] = objTools.make(TypeDefinition, {
            type: 'getRecentEventsResponse',
            ns: namespaces[0],
            complex: true,
            constructorFunction: constructors['getRecentEventsResponse'],
            properties: {
                'return': objTools.make(TypeDefinition, {
                    multiple: true,
                    complex: true,
                    ns: 'http://budget.kapa.org/',
                    type: 'event'
                })
            }
        });
        //verybasic
        objects['verybasic'] = {
            'stuff': '',
            classify: function () {
                return 'verybasic';
            }
        };
        constructors['verybasic'] = objTools.makeConstructor(function Verybasic() {
        }, objects['verybasic']);
        types['verybasic'] = objTools.make(TypeDefinition, {
            type: 'verybasic',
            ns: namespaces[0],
            complex: true,
            constructorFunction: constructors['verybasic'],
            properties: {
                'stuff': objTools.make(TypeDefinition, {
                    ns: 'http://www.w3.org/2001/XMLSchema',
                    type: 'string'
                })
            }
        });
        //basic
        objects['basic'] = {
            'additional': '',
            classify: function () {
                return 'basic';
            }
        };
        constructors['basic'] = objTools.makeConstructor(function Basic() {
        }, objTools.make(new constructors['verybasic'](), objects['basic']));
        types['basic'] = objTools.make(TypeDefinition, {
            type: 'basic',
            ns: namespaces[0],
            complex: true,
            constructorFunction: constructors['basic'],
            properties: objTools.make(types['verybasic'].properties, {
                'additional': objTools.make(TypeDefinition, {
                    ns: 'http://www.w3.org/2001/XMLSchema',
                    type: 'string'
                })
            })
        });
        //event
        objects['event'] = {
            'amount': 0,
            'description': '',
            'id': null,
            'time': null,
            'type': '',
            'user': null,
            classify: function () {
                return 'event';
            }
        };
        constructors['event'] = objTools.makeConstructor(function Event() {
        }, objTools.make(new constructors['basic'](), objects['event']));
        types['event'] = objTools.make(TypeDefinition, {
            type: 'event',
            ns: namespaces[0],
            complex: true,
            constructorFunction: constructors['event'],
            properties: objTools.make(types['basic'].properties, {
                'amount': objTools.make(TypeDefinition, {
                    ns: 'http://www.w3.org/2001/XMLSchema',
                    type: 'float'
                }),
                'description': objTools.make(TypeDefinition, {
                    ns: 'http://www.w3.org/2001/XMLSchema',
                    type: 'string'
                }),
                'id': objTools.make(TypeDefinition, {
                    ns: 'http://budget.kapa.org/',
                    type: 'id'
                }),
                'time': objTools.make(TypeDefinition, {
                    ns: 'http://www.w3.org/2001/XMLSchema',
                    type: 'dateTime'
                }),
                'type': objTools.make(TypeDefinition, {
                    ns: 'http://www.w3.org/2001/XMLSchema',
                    type: 'string'
                }),
                'user': objTools.make(TypeDefinition, {
                    complex: true,
                    ns: 'http://budget.kapa.org/',
                    type: 'user'
                })
            })
        });
        //user
        objects['user'] = {
            'events': [],
            'id': null,
            'name': '',
            classify: function () {
                return 'user';
            }
        };
        constructors['user'] = objTools.makeConstructor(function User() {
        }, objTools.make(new constructors['basic'](), objects['user']));
        types['user'] = objTools.make(TypeDefinition, {
            type: 'user',
            ns: namespaces[0],
            complex: true,
            constructorFunction: constructors['user'],
            properties: objTools.make(types['basic'].properties, {
                'events': objTools.make(TypeDefinition, {
                    multiple: true,
                    complex: true,
                    ns: 'http://budget.kapa.org/',
                    type: 'event'
                }),
                'id': objTools.make(TypeDefinition, {
                    ns: 'http://budget.kapa.org/',
                    type: 'id'
                }),
                'name': objTools.make(TypeDefinition, {
                    ns: 'http://www.w3.org/2001/XMLSchema',
                    type: 'string'
                })
            })
        });
        //getEventsInRange
        objects['getEventsInRange'] = {
            'timeFrom': null,
            'timeTo': null,
            classify: function () {
                return 'getEventsInRange';
            }
        };
        constructors['getEventsInRange'] = objTools.makeConstructor(function GetEventsInRange() {
        }, objects['getEventsInRange']);
        types['getEventsInRange'] = objTools.make(TypeDefinition, {
            type: 'getEventsInRange',
            ns: namespaces[0],
            complex: true,
            constructorFunction: constructors['getEventsInRange'],
            properties: {
                'timeFrom': objTools.make(TypeDefinition, {
                    ns: 'http://www.w3.org/2001/XMLSchema',
                    type: 'dateTime'
                }),
                'timeTo': objTools.make(TypeDefinition, {
                    ns: 'http://www.w3.org/2001/XMLSchema',
                    type: 'dateTime'
                })
            }
        });
        //getEventsInRangeResponse
        objects['getEventsInRangeResponse'] = {
            'return': [],
            classify: function () {
                return 'getEventsInRangeResponse';
            }
        };
        constructors['getEventsInRangeResponse'] = objTools.makeConstructor(function GetEventsInRangeResponse() {
        }, objects['getEventsInRangeResponse']);
        types['getEventsInRangeResponse'] = objTools.make(TypeDefinition, {
            type: 'getEventsInRangeResponse',
            ns: namespaces[0],
            complex: true,
            constructorFunction: constructors['getEventsInRangeResponse'],
            properties: {
                'return': objTools.make(TypeDefinition, {
                    multiple: true,
                    complex: true,
                    ns: 'http://budget.kapa.org/',
                    type: 'event'
                })
            }
        });
        //storeObjects
        objects['storeObjects'] = {
            'objects': [],
            classify: function () {
                return 'storeObjects';
            }
        };
        constructors['storeObjects'] = objTools.makeConstructor(function StoreObjects() {
        }, objects['storeObjects']);
        types['storeObjects'] = objTools.make(TypeDefinition, {
            type: 'storeObjects',
            ns: namespaces[0],
            complex: true,
            constructorFunction: constructors['storeObjects'],
            properties: {
                'objects': objTools.make(TypeDefinition, {
                    multiple: true,
                    complex: true,
                    ns: 'http://budget.kapa.org/',
                    type: 'basic'
                })
            }
        });
        //getAmount
        objects['getAmount'] = {
            classify: function () {
                return 'getAmount';
            }
        };
        constructors['getAmount'] = objTools.makeConstructor(function GetAmount() {
        }, objects['getAmount']);
        types['getAmount'] = objTools.make(TypeDefinition, {
            type: 'getAmount',
            ns: namespaces[0],
            complex: true,
            constructorFunction: constructors['getAmount'],
            properties: {}
        });
        //getAmountResponse
        objects['getAmountResponse'] = {
            'return': 0,
            classify: function () {
                return 'getAmountResponse';
            }
        };
        constructors['getAmountResponse'] = objTools.makeConstructor(function GetAmountResponse() {
        }, objects['getAmountResponse']);
        types['getAmountResponse'] = objTools.make(TypeDefinition, {
            type: 'getAmountResponse',
            ns: namespaces[0],
            complex: true,
            constructorFunction: constructors['getAmountResponse'],
            properties: {
                'return': objTools.make(TypeDefinition, {
                    ns: 'http://www.w3.org/2001/XMLSchema',
                    type: 'int'
                })
            }
        });
        //deleteObjects
        objects['deleteObjects'] = {
            'objects': [],
            classify: function () {
                return 'deleteObjects';
            }
        };
        constructors['deleteObjects'] = objTools.makeConstructor(function DeleteObjects() {
        }, objects['deleteObjects']);
        types['deleteObjects'] = objTools.make(TypeDefinition, {
            type: 'deleteObjects',
            ns: namespaces[0],
            complex: true,
            constructorFunction: constructors['deleteObjects'],
            properties: {
                'objects': objTools.make(TypeDefinition, {
                    multiple: true,
                    complex: true,
                    ns: 'http://budget.kapa.org/',
                    type: 'basic'
                })
            }
        });
        return {
            types: types,
            namespaces: namespaces
        };
    }(objTools, wsdl_TypeDefinition);
var ws = function (_, objTools, WebService, MethodLibrary, XmlSerializer, Factory, TypeLibrary, TypeEnsurer, methods, typeConf) {
        return {
            WebService: WebService,
            MethodLibrary: MethodLibrary,
            XmlSerializer: XmlSerializer,
            Factory: Factory,
            TypeLibrary: TypeLibrary,
            TypeEnsurer: TypeEnsurer,
            methods: methods,
            typeConf: typeConf
        };
    }(underscore, objTools, wsdl_WebService, wsdl_MethodLibrary, wsdl_XmlSerializer, wsdl_Factory, wsdl_TypeLibrary, wsdl_TypeEnsurer, wsdl_gen_wsconfig, wsdl_gen_typeconfig);

	return ws;

});