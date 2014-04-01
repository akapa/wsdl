define(['underscore', 'objTools', 'wsdl/WebService', 'wsdl/MethodLibrary',
	'wsdl/XmlSerializer', 'wsdl/Factory', 'wsdl/TypeLibrary', 'wsdl/TypeEnsurer', 
	'wsdl/gen/wsconfig', 'wsdl/gen/typeconfig'], 
function (_, objTools, WebService, MethodLibrary, XmlSerializer, Factory, TypeLibrary, 
		TypeEnsurer, methods, typeConf) {

	//creating TypeLibrary
	var typeLib = new TypeLibrary(_(typeConf.types).toArray());
	typeLib.typeEnsurer = new TypeEnsurer(typeLib);

	//initializing Method Library with wsdl methods
	var methodLib = new MethodLibrary(methods);

	//creating Factory and Serializer
	var factory = new Factory(typeLib);
	var serializer = new XmlSerializer(typeLib, factory, typeConf.namespaces);

	//creating the Web Service
	var ws = new WebService('BudgetService', serializer, factory, methodLib, typeLib);

	return ws;

});
