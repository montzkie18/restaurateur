requirejs.config({
  baseUrl: 'js',

  paths: {
    "jquery": "libs/jquery",
    "bootstrap": "libs/bootstrap/js/bootstrap",      
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
    }
  }
});

require(['views/app'], function(AppView) {
  new AppView();
});