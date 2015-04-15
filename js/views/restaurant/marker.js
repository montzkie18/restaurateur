define([
	'jquery',
	'underscore',
	'backbone',
	'utils'
], function($, _, Backbone, Utils) {

	var placeholderTemplate = '<div class="restaurant-marker"><h4><%= name %></h4> <br/><%= type %> <br/><%= customers %> people visited</div>';

	var RestaurantMarker = Backbone.View.extend({

		template : _.template(placeholderTemplate),

		constructor : function(map, model) {
			this.map = map;
			this.model = model;
			Backbone.View.apply(this, arguments);
		},

		initialize : function() {
			this.marker = new google.maps.Marker({
	            position: this.model.position(),
				map: this.map,
				animation: google.maps.Animation.DROP
	        });
	        this.addMarkerClickListeners();
	        this.addMarkerHoverListeners();
	        this.addInfoListeners();
		},

		render : function() {
			this.$el.html(this.template(this.model.attributes));
			return this;
		},

		addMarkerClickListeners : function() {
			var restaurantMarker = this;
			google.maps.event.addListener(this.marker, 'click', function(event) {
				if(_.isEmpty(RestaurantMarker.info.getContent()))
					restaurantMarker.showInfoWindow();
				restaurantMarker.map.setCenter(restaurantMarker.marker.getPosition());
				restaurantMarker.removeMarkerHoverListners();
			});
		},

		addMarkerHoverListeners : function() {
			var restaurantMarker = this;
			google.maps.event.addListener(this.marker, 'mouseover', function(event) {
				restaurantMarker.showInfoWindow();
			});
			google.maps.event.addListener(this.marker, 'mouseout', function(event) {
				restaurantMarker.hideInfoWindow();
			});
		},

		removeMarkerHoverListners : function() {
			google.maps.event.clearListeners(this.marker, 'mouseover');
			google.maps.event.clearListeners(this.marker, 'mouseout');
		},

		addInfoListeners : function() {
			var restaurantMarker = this; // pass this reference to closures below
			google.maps.event.addListener(RestaurantMarker.info, 'closeclick', function() {
				// after being closed, enable opening on mouseover and mouseout again
				restaurantMarker.addMarkerHoverListeners();
			});
		},

		showInfoWindow : function() {
			RestaurantMarker.info.setContent(Utils.html(this.render().el));
			RestaurantMarker.info.open(this.map, this.marker);
		},

		hideInfoWindow : function() {
			RestaurantMarker.info.close();
		},

		close : function() {
			google.maps.event.clearInstanceListeners(this.marker);
			this.marker.setMap(null);
			this.marker = null;
		}

	});

	RestaurantMarker.info = new google.maps.InfoWindow({ content : '' });

	return RestaurantMarker;

});