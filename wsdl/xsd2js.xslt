<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" version="1.0">
<xsl:output method="text" omit-xml-declaration="yes"/>   
<xsl:template match="/">
define(['underscore', 'wsdl2/objTools', 'wsdl2/TypeLibrary', 'wsdl2/TypeDefinition', 'wsdl2/TypeEnsurer'], 
function (_, objTools, TypeLibrary, TypeDefinition, TypeEnsurer) {
	var namespaces = {
		0: '<xsl:value-of select="xs:schema/@targetNamespace"/>',
		'xs': 'http://www.w3.org/2001/XMLSchema'
	};

	//PROTO OBJECTS FOR XSD COMPLEX TYPES

	var objects = {
	<xsl:for-each select=".//xs:complexType">
		'<xsl:value-of select="@name" />': {<xsl:apply-templates select=".//xs:element" mode="OBJECT" />
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
			properties: {<xsl:apply-templates select=".//xs:element" mode="TYPE" />
			}
		}),
	</xsl:for-each>
	];

	var tlib = new TypeLibrary(types);
	tlib.typeEnsurer = new TypeEnsurer(tlib);
	return tlib;
});
</xsl:template>

<xsl:template match="xs:element" mode="OBJECT">
			'<xsl:value-of select="@name" />': <xsl:call-template name="defaultValue">
	<xsl:with-param name="type" select="."></xsl:with-param>
</xsl:call-template>,</xsl:template>

<xsl:template match="xs:element" mode="TYPE">
				'<xsl:value-of select="@name" />': objTools.make(TypeDefinition, {<xsl:if test="@maxOccurs = 'unbounded'">
					multiple: true,</xsl:if>
					<xsl:call-template name="iscomplex"></xsl:call-template>
					ns: '<xsl:call-template name="nsname">
						<xsl:with-param name="type" select="@type" />
					</xsl:call-template>',
					type: '<xsl:value-of select="substring-after(@type, ':')" />'
				}),</xsl:template>

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

<xsl:template name="nsname">
    <xsl:param name="type" select="@type"/>
    <xsl:if test="substring-before($type, ':') = ''">
        <xsl:value-of select="/xs:schema/@targetNamespace"/>
    </xsl:if>
    <xsl:if test="substring-before($type, ':') != ''">
        <xsl:value-of select="namespace::*[local-name()=substring-before($type, ':')]"/>
    </xsl:if>
</xsl:template>

<xsl:template name="iscomplex">
	<xsl:variable name="prefix" select="substring-before(@type, ':')"/>
	<xsl:if test="$prefix != '' and namespace::*[local-name()=$prefix] = /xs:schema/@targetNamespace">
		<xsl:text>
					complex: true,</xsl:text>
	</xsl:if>
</xsl:template>

</xsl:stylesheet>