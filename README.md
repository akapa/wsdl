##What's this

A library to communicate with WSDL/XSD based webservices. Through XSLT, it helps you create Javascript definitions from the WSDL and XSD files, and then you can simply create Javascript objects defined in the XSD, call the methods defined in the WSDL and receive XSD-defined Javascript objects back from the server.

##Requirements

Defined in a [RequireJS](http://requirejs.org/) format, so you need an AMD loader.

Uses: 
 - [Underscore.js](http://underscorejs.org/)
 - Some of my own projects: [kapa-xml](https://github.com/bazmegakapa/kapa-xsd), [kapa-objTools](https://github.com/bazmegakapa/kapa-objTools), [kapa-Library](https://github.com/bazmegakapa/kapa-Library), [kapa-primitiveSerializers](https://github.com/bazmegakapa/kapa-primitiveSerializers), [kapa-primitiveUnerializers](https://github.com/bazmegakapa/kapa-primitiveUnserializers).

##Documentation

All the methods are documented with [JSDoc3](https://github.com/jsdoc3/jsdoc), you can find the generated HTML documentation in the **docs** folder.

##Usage

###Generating definitions from WSDL and XSD

The project uses XSLT to take a WSDL and an XSD document (currently only one of each) and create Javascript code (`MethodDefinition` and `TypeDefinition` objects) from them. Grunt is used to execute the transformations, so you should install the dev dependencies from `package.json`.

To process your own documents, you have to edit the `xsltproc` task in the `Gruntfile.js` file to point to your WSDL and XSLT files. The keys you have to edit are `xsltproc.wsdl.files['js/gen/wsconfig.js']` and `xsltproc.xsd.files['js/gen/typeconfig.js']`:

    xsltproc: {
      wsdl: {
        options: {
          stylesheet: 'xslt/wsdl2js.xslt'
        },
        files: {
          'js/gen/wsconfig.js': ['yourpath/yourwsdlfile.wsdl']
        }
      },
      xsd: {
        options: {
          stylesheet: 'xslt/xsd2js.xslt'
        },
        files: {
          'js/gen/typeconfig.js': ['yourpath/yourxsdfile.xsd']
        }
      }
    },

Then you can simply run `grunt xsltproc` and the `wsconfig.js` and `typeconfig.js` files will be generated.

###Creating a dist version

To bundle all the files (including the XSLT-generated files) into one, you should run `grunt requirejs`. This will rebuild `dist/wsdl.js`.

###Including the dist version in your project

You should copy the contents of the `dist` directory to your project.

 - `wsdl.js` contains the project's code and the XSLT-generated method and type definitions. 
 - `wsdl-bootstrap.js` contains object creation boilerplate code that you could edit to your own liking (overriding modules with your own ones and stuff like that). The module defined in this file should return a `WebService` object. This file requires `wsdl.js`.

In the module you want to use `WebService`, you should simply add `wsdl-bootstrap` as a dependency, and it will provide you with a working `WebService` instance.

    define(['wsdl-bootstrap'], function (webService) {
        //you can use webService here
    });

###Using the `WebService` object

For details I suggest you check the documentation in the `docs` folder, but let's see some quick examples.

####Creating XSD-defined objects

You can create objects defined in the XSD using the factory:

    var user = webService.factory.make('user'); //user is an XSD complextype

To get/set properties of these objects, you should use the `TypeLibrary` instead of public properties. This way types will be ensured (for example `'0'` will be converted to `0` for a number type, see `TypeEnsurer`), and if you have set up special setters or getters for a type (manipulating `TypeLibrary` or creating your own), those will be run.

    var oldName = webService.typeLibrary.getValue('name');
    webService.typeLibrary.setValue('name', 'John Spartan');

Sometimes it is more convenient to use `makeAndFill` from the factory, which will create the object like `make` but also update the desired properties at the same time (using `TypeLibrary` of course):

    var enemy = webService.factory.makeAndFill('user', { name: 'Simon Phoenix' });

####Calling a web service method

First you need to create a request object that is needed for the method. The name of the request object is stored in `MethodLibrary`, you can pass that to the factory:

    var reqObjName = webService.methodLibrary.getItem('myWebMethod').requestObject;
    var reqObj = webService.factory.make(reqObjName);

Then you can manipulate the request object the way you want, then call the web service method:

    var onSuccess = function (respObj, status, statusText) {
        console.log(respObj); //responseObject defined for this method
    };
    var onError = function (errorObj, status, statusText) {};
    webService.call('myWebMethod', reqObj, onSuccess, onError);

The request object will be serialized and sent to the server (details of the transfer are set in `MethodLibrary`). In the case of success, the response object will be unserialized (according to the rules set in `TypeLibrary`, which is based on the XSD) and passed as the first parameter into your success handler function.

There is also a convenience method you can use to skip instantiating the request object. You can simply pass the properties you want set on the request object that will be created internally for you.

    webService.callWithPlainObject('myWebMethod', { count: 3 }, onSuccess, onError);