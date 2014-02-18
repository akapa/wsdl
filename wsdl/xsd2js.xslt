<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" version="1.0">
<xsl:output method="text" omit-xml-declaration="yes"/>   
<xsl:template match="/">
define(['underscore', 'objTools', 'wsdl/TypeLibrary', 'wsdl/TypeDefinition', 'wsdl/TypeEnsurer'], 
function (_, objTools, TypeLibrary, TypeDefinition, TypeEnsurer) {
	var namespaces = {
		'myns': '<xsl:value-of select="xs:schema/@targetNamespace"/>',
		'xs': 'http://www.w3.org/2001/XMLSchema',
		'xsi': 'http://www.w3.org/2001/XMLSchema-instance'
	};

	var objects = {};
	var constructors = {};
	var types = {};
	<xsl:apply-templates select=".//xs:complexType[not(descendant::xs:extension)]" mode="OBJECT" />

	var tlib = new TypeLibrary(_(types).toArray());
	tlib.typeEnsurer = new TypeEnsurer(tlib);
	return tlib;
});
</xsl:template>

<xsl:template match="xs:complexType" mode="OBJECT">
	<xsl:variable name="base" select="substring-after(.//xs:extension/@base, ':')"/>
	//<xsl:value-of select="@name" />

	objects['<xsl:value-of select="@name" />'] = {<xsl:apply-templates select=".//xs:element" mode="OBJECT" />
		classify: function () { return '<xsl:value-of select="@name" />'; }
	};

	constructors['<xsl:value-of select="@name" />'] = function <xsl:call-template name="capitalizeName" /> () {
		return objTools.construct(<xsl:if test=".//xs:extension">objTools.make(new constructors['<xsl:value-of select="$base" />'], </xsl:if>objects['<xsl:value-of select="@name" />']<xsl:if test=".//xs:extension">)</xsl:if>, <xsl:call-template name="capitalizeName" />);
	};

	types['<xsl:value-of select="@name" />'] = objTools.make(TypeDefinition, {
		type: '<xsl:value-of select="@name" />',
		ns: namespaces[0],
		complex: true,
		constructorFunction: constructors['<xsl:value-of select="@name" />'],
		properties: <xsl:if test=".//xs:extension">objTools.make(types['<xsl:value-of select="$base" />'].properties, </xsl:if>{<xsl:apply-templates select=".//xs:element" mode="TYPE" />
		}<xsl:if test=".//xs:extension">)</xsl:if>
	});
	<xsl:variable name="tns" select="local-name(namespace::*[.=/*/@targetNamespace])"/>
	<xsl:variable name="type" select="@name"/>
	<xsl:apply-templates select="../xs:complexType[descendant::xs:extension[@base = concat($tns, ':', $type)]]" mode="OBJECT" />
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