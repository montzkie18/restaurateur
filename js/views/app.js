define([
	'jquery',
	'underscore',
	'backbone',
	'bootstrap',
	'collections/restaurants',
	'models/restaurant',
	'collections/places',
	'models/place',
	'views/map-local',
	'views/map-places',
	'text!templates/app.html'
], function($, _, Backbone, Bootstrap, Restaurants, Restaurant, Places, Place, LocalMapView, PlacesMapView, appControlsTemplate) {

	var AppView = Backbone.View.extend({

		className : "appView",

		el : '#control-group',

		template : _.template(appControlsTemplate),

		events : {
			'click #drop-pin' : 'toggleDropPin',
			'click #add-restau' : 'toggleEntryMode',
			'click #clear-restau' : 'clearLocalRestaurants'
		},

		mapOptions : {
			center: { lat: 10.3120685, lng: 123.8874251},
			zoom: 15,
			disableDefaultUI: true
		},

		searchRadius : 1000,

		initialize : function() {
			this.map = new google.maps.Map($('#map-canvas')[0], this.mapOptions);

			// based on google.maps.places API
			this.places = new Places(this.map);
			this.placesMapView = new PlacesMapView({ map : this.map, collection : this.places });

			// locally stored collection of restaurants
			this.restaurants = new Restaurants();
			this.localMapView = new LocalMapView({ map : this.map, collection : this.restaurants })

			this.render();
			this.addListeners();
			
			this.places.fetch({location: this.map.getCenter(), types : ['restaurant', 'food']});
			this.restaurants.fetch();
		},

		render : function() {
			this.$el.append(this.template({types: Restaurant.TYPES}));
		},

		addListeners : function() {
			_.bindAll(this, 'onKeyUp');
			$(document).bind('keyup', this.onKeyUp);

			var appView = this;
			this.listenTo(this.localMapView, 'finishEntry', function() {
				appView.setEntryMode(false);
			});

			this.listenTo(this.placesMapView, 'finishDropPin', function() {
				appView.setDropPin(false);
			});

			$('#filter-type').change(function(){
				appView.filterMarkers($('#filter-type').val());
			});
		},

		onKeyUp : function(event) {
			if(event.keyCode == 27) {
				event.stopPropagation();
				this.endEntryMode();
				this.endDropPin();
			}
		},

		clearLocalRestaurants : function() {
			_.chain(this.restaurants.models).clone().each(function(model){
				model.destroy();
			});
		},

		setEntryMode : function(active) {
			this.localMapView.setEntryMode(active);
			
			if(this.localMapView.isAdding) {
				$('#add-restau').addClass('active');
				$('#add-restau span').text('Adding...');
			} else {
				$('#add-restau').removeClass('active');
				$('#add-restau span').text('Add Restaurant');
			}
		},

		toggleEntryMode : function() {
			this.setEntryMode(!this.localMapView.isAdding);
		},

		endEntryMode : function() {
			if(this.localMapView.isAdding)
				this.toggleEntryMode();
		},

		filterMarkers : function(type) {
			var request = {
				location: this.placesMapView.position, 
				radius : this.placesMapView.searchRadius(), 
				types : ['restaurant', 'food']
			};
			if(type != 'All') request.keyword = type;
			this.places.fetch(request, { reset : true });
			this.restaurants.filterByType(type);
		},

		setDropPin : function(active) {
			this.placesMapView.setDropPinMode(active);

			if(this.placesMapView.isDropping){
				$('#drop-pin').addClass('active');
				$('#drop-pin span').text('Dropping...');
			} else {
				$('#drop-pin').removeClass('active');
				$('#drop-pin span').text('Drop Pin');
			}
		},

		toggleDropPin : function() {
			this.setDropPin(!this.placesMapView.isDropping);
		},

		endDropPin : function() {
			if(this.placesMapView.isDropping)
				this.toggleDropPin();
		}

	});

	return AppView;

});