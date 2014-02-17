({
    baseUrl: 'js',
    exclude: ['underscore', 'objTools', 'Library', 'xml'],
    paths: {
        'underscore': 'lib/underscore',
        'xml': 'lib/xml',
        'Library': 'lib/Library',
        'objTools': 'lib/objTools',
        'wsdl': '.'
    },
    name: 'webservice',
    optimize: 'none',
    out: 'dist/wsdl.js'
})