define(['underscore', 'objTools', 'wsdl/ws'], 
function (_, objTools, ws) {

	//creating TypeLibrary
	var typeLib = new ws.TypeLibrary(_(ws.typeConf.types).toArray());
	typeLib.typeEnsurer = new ws.TypeEnsurer(typeLib);

	//initializing Method Library with wsdl methods
	var methodLib = new ws.MethodLibrary(ws.methods);

	//creating Factory and Serializer
	var factory = new ws.Factory(typeLib);
	var serializer = new ws.XmlSerializer(typeLib, factory, ws.typeConf.namespaces);

	//creating the Web Service
	return new ws.WebService('BudgetService', serializer, factory, methodLib, typeLib);

});
