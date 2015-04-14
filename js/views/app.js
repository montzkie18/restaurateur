define([
	'jquery',
	'underscore',
	'backbone',
	'bootstrap',
	'views/map'
], function($, _, Backbone, Bootstrap, MapView) {

	var AppView = Backbone.View.extend({

		className : "appView",

		el : '#control-group',

		events : {
			'click #add-restau' : 'toggleDropMarker',
			'click #pop-restau' : 'popMarker'		},

		initialize : function() {
			this.children = {
				mapView : new MapView()
			};
			this.children.mapView.initialize();
			_.bindAll(this, 'onKeyUp');
		},

		addKeyListener : function() {
			$(document).bind('keyup', this.onKeyUp);
		},

		removeKeyListener : function() {
			$(document).unbind('keyup', this.onKeyUp);
		},

		onKeyUp : function(event) {
			if(event.keyCode == 27)
				this.endDropMarker();
		},

		toggleDropMarker : function() {
			this.children.mapView.toggleDropMarker();
			this.$('#add-restau').button('toggle');
			if(this.$('#add-restau').hasClass('active')) {
				this.addKeyListener();
				this.$('#add-restau span').text('Adding');
			} else {
				this.removeKeyListener();
				this.$('#add-restau span').text('Add Restaurant');
			}
		},

		endDropMarker : function() {
			if(this.children.mapView.isAdding)
				this.toggleDropMarker();
		},

		popMarker : function() {
			this.endDropMarker();
			this.children.mapView.popMarker();
		}
	});

	return AppView;

});