<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" version="1.0">
<xsl:output method="text" omit-xml-declaration="yes"/>   
<xsl:template match="/">
define(['underscore', 'objTools', 'TypeLibrary', 'TypeDefinition'], 
function (_, objTools, TypeLibrary, TypeDefinition) {
	var namespaces = {
		0: '<xsl:value-of select="xs:schema/@targetNamespace"/>',
		'xs': 'http://www.w3.org/2001/XMLSchema'
	};

	//PROTO OBJECTS FOR XSD COMPLEX TYPES

	var objects = {
	<xsl:for-each select=".//xs:complexType">
		'<xsl:value-of select="@name" />': {<xsl:apply-templates select=".//xs:element" />
			classify: function () { return '<xsl:value-of select="@name" />'; }
		},
	</xsl:for-each>
	};

	//TYPE DEFINITIONS FOR XSD COMPLEX TYPE

	var types = [
	<xsl:for-each select=".//xs:complexType">
		objTools.make(TypeDefinition, {
			type: '<xsl:value-of select="@name" />',
			ns: namespaces[0],
			complex: true,
			constructorFunction: function <xsl:call-template name="capitalizeName" /> () {
				return objTools.construct(objects.<xsl:value-of select="@name" />, <xsl:call-template name="capitalizeName" />);
			},
			properties: {
			}
		}),
	</xsl:for-each>
	];

	//initializing Type Library with the xsd types
	var typeLib = new TypeLibrary(types);

	return typeLib;
});
</xsl:template>

<xsl:template match="xs:element">
			'<xsl:value-of select="@name" />': <xsl:call-template name="defaultValue">
	<xsl:with-param name="type" select="."></xsl:with-param>
</xsl:call-template>,</xsl:template>

<xsl:template name="defaultValue">
	<xsl:param name="type" />
	<xsl:choose>
		<xsl:when test="@maxOccurs = 'unbounded'">[]</xsl:when>
		<xsl:when test="@type = 'xs:string'">''</xsl:when>
		<xsl:when test="@type = 'xs:float'">0</xsl:when>
		<xsl:when test="@type = 'xs:decimal'">0</xsl:when>
		<xsl:when test="@type = 'xs:int'">0</xsl:when>
		<xsl:when test="@type = 'xs:integer'">0</xsl:when>
		<xsl:otherwise>null</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template name="capitalizeName">
    <xsl:value-of select="concat(translate(substring(@name, 1, 1), 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), substring(@name, 2))"/>
</xsl:template>

</xsl:stylesheet>