<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" version="1.0">
<xsl:output method="text" omit-xml-declaration="yes"/>   
<xsl:template match="/">define(['objTools', 'wsdl/MethodDefinition'], function (objTools, MethodDefinition) {

	return {
		name: '<xsl:value-of select="//wsdl:definitions/@name" />',
		methods: [
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
		]
	};

});
</xsl:template>
</xsl:stylesheet>