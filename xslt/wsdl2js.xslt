<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" version="1.0">
<xsl:output method="text" omit-xml-declaration="yes"/>   
<xsl:template match="/">
define(['underscore', 'objTools', 'wsdl/WebService', 'wsdl/MethodLibrary', 'wsdl/MethodDefinition', 'wsdl/XmlSerializer', 'wsdl/Factory', 'wsdl/gen/typeconfig'], 
function (_, objTools, WebService, MethodLibrary, MethodDefinition, XmlSerializer, Factory, typeLib) {
	var namespaces = {
		'myns': '<xsl:value-of select="wsdl:definitions/@targetNamespace"/>',
		'xs': 'http://www.w3.org/2001/XMLSchema',
		'xsi': 'http://www.w3.org/2001/XMLSchema-instance'
	};

	//WSDL METHOD DEFINITIONS

	var methods = [
	<xsl:for-each select=".//wsdl:portType/wsdl:operation">
		objTools.make(MethodDefinition, {
			name: '<xsl:value-of select="@name"/>',
			requestObject: <xsl:choose>
					<xsl:when test="count(wsdl:input) > 0">'<xsl:value-of select="substring-after(wsdl:input/@message, ':')"/>'</xsl:when>
					<xsl:otherwise>null</xsl:otherwise>
				</xsl:choose>,
			responseObject: <xsl:choose>
					<xsl:when test="count(wsdl:output) > 0">'<xsl:value-of select="substring-after(wsdl:output/@message, ':')"/>'</xsl:when>
					<xsl:otherwise>null</xsl:otherwise>
				</xsl:choose>,
			endpoint: '<xsl:value-of select="//wsdl:service/wsdl:port/soap:address/@location" />'
		}),
	</xsl:for-each>
	];

	//initializing Method Library with wsdl methods
	var methodLib = new MethodLibrary(methods);

	//creating Factory and Serializer
	var factory = new Factory(typeLib);
	var serializer = new XmlSerializer(typeLib, factory, namespaces);

	//creating the Web Service
	var ws = new WebService('<xsl:value-of select="wsdl:definitions/@name"/>', serializer, factory, methodLib, typeLib);

	//adding Web Service methods to easily call WSDL methods
	_(ws).extend({
	<xsl:for-each select=".//wsdl:portType/wsdl:operation">
		'<xsl:value-of select="@name"/>': function (params, onSuccess, onError) {
			var reqObjName = this.methodLibrary.getItem('<xsl:value-of select="@name"/>').requestObject;
			var reqObj = objTools.make(this.typeLibrary.getItem(reqObjName).constructorFunction, params);
			this.call('<xsl:value-of select="@name"/>', reqObj, onSuccess, onError);
		},
	</xsl:for-each>
	});

	return ws;
});
</xsl:template>
</xsl:stylesheet>