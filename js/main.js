requirejs.config({
  baseUrl: 'js',

  paths: {
    "jquery": "libs/jquery",
    "bootstrap": "libs/bootstrap/js/bootstrap.min",      
    "underscore": "libs/underscore",
    "backbone": "libs/backbone"
  },

  shim: {
    'backbone': {
      deps: ['underscore', 'jquery']
    , exports: 'Backbone'
    },
    'underscore': {
      exports: '_'
    },
    'bootstrap' : { 
      deps : ['jquery']
    },
    'app': {
      deps: ['underscore', 'backbone']
    }
  }
});

require(['app'],

function(App) {
  window.restauApp = new App();
});