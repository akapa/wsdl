define(['underscore', 'objTools', 'wsdl/WebService', 'wsdl/MethodLibrary',
	'wsdl/XmlSerializer', 'wsdl/Factory', 'wsdl/TypeLibrary', 'wsdl/TypeEnsurer', 
	'wsdl/gen/wsconfig', 'wsdl/gen/typeconfig'], 
function (_, objTools, WebService, MethodLibrary, XmlSerializer, Factory, TypeLibrary, 
		TypeEnsurer, methodConf, typeConf) {

	return {
        WebService: WebService,
        MethodLibrary: MethodLibrary,
        XmlSerializer: XmlSerializer,
        Factory: Factory,
        TypeLibrary: TypeLibrary,
        TypeEnsurer: TypeEnsurer,
        methodConf: methodConf,
        typeConf: typeConf
    };

});
