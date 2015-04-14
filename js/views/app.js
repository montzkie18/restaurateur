define([
	'jquery',
	'underscore',
	'backbone',
	'bootstrap',
	'collections/restaurants',
	'views/map'
], function($, _, Backbone, Bootstrap, RestaurantList, MapView) {

	var AppView = Backbone.View.extend({

		className : "appView",

		el : '#control-group',

		events : {
			'click #add-restau' : 'toggleEntryMode'
		},

		initialize : function() {
			this.restaurants = new RestaurantList();

			this.children = {
				mapView : new MapView({ collection : this.restaurants })
			};
			this.addListeners();

			this.restaurants.fetch();
		},

		addListeners : function() {
			_.bindAll(this, 'onKeyUp');
			$(document).bind('keyup', this.onKeyUp);

			var appView = this;
			this.listenTo(this.children.mapView, 'cancelEntry', function() {
				appView.setEntryMode(false);
			});
		},

		onKeyUp : function(event) {
			if(event.keyCode == 27) {
				event.stopPropagation();
				this.endEntryMode();
			}
		},

		setEntryMode : function(active) {
			this.children.mapView.setEntryMode(active);
			
			if(this.children.mapView.isAdding) {
				$('#add-restau').addClass('active');
				$('#add-restau span').text('Adding');
			} else {
				$('#add-restau').removeClass('active');
				$('#add-restau span').text('Add Restaurant');
			}
		},

		toggleEntryMode : function() {
			this.setEntryMode(!this.children.mapView.isAdding);
		},

		endEntryMode : function() {
			if(this.children.mapView.isAdding)
				this.toggleEntryMode();
		}
	});

	return AppView;

});