module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),
    requirejs: {
      compile: {
        options: {
          baseUrl: 'js',
          exclude: ['underscore', 'objTools', 'Library', 'xml'],
          paths: {
              underscore: 'lib/underscore',
              xml: 'lib/xml',
              Library: 'lib/Library',
              objTools: 'lib/objTools',
              wsdl: '.'
          },
          name: 'webservice',
          skipModuleInsertion: false,
          optimize: 'none',
          out: 'dist/wsdl.js',
          onBuildWrite: function (moduleName, path, contents) {
            return module.require('amdclean').clean(contents);
          },
          wrap: {
            startFile: 'js/dist_start.js.frag',
            endFile: 'js/dist_end.js.frag'
          }
        }
      }
    },
    jsdoc: {
      dist: {
        src: ["./js/", 'README.md'],
        options: {
          destination: "./docs/",
          tags: {
            allowUnknownTags: true
          },
          templates: {
            cleverLinks: true,
            monospaceLinks: false
          }
        }
      }
    },
    jshint: {
      options: {
        ignores: ['js/lib/*.js']
      },
      all: ['Gruntfile.js', 'js/*.js', 'test/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'requirejs', 'jsdoc']);

};