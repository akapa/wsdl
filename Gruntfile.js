module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),
    xsltproc: {
      wsdl: {
        options: {
          stylesheet: 'xslt/wsdl2js.xslt'
        },
        files: {
          'js/gen/wsconfig.js': ['example/example.wsdl']
        }
      },
      xsd: {
        options: {
          stylesheet: 'xslt/xsd2js.xslt'
        },
        files: {
          'js/gen/typeconfig.js': ['example/example.xsd']
        }
      }
    },
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
          name: 'ws',
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
    },
    copy: {
      main: {
        src: 'js/bootstrap.js',
        dest: 'dist/bootstrap.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-xsltproc');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['xsltproc', 'jshint', 'requirejs', 'copy', 'jsdoc']);

};