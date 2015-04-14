define([
	'jquery',
	'backbone',
	'views/restaurant/add',
	'views/restaurant/marker'
], function($, Backbone, AddView, RestaurantMarker) {

	var MapView = Backbone.View.extend({

		className : 'mapView',

		el : '#map-canvas',

		mapOptions : {
			center: { lat: 10.3120685, lng: 123.8874251},
			zoom: 15,
			disableDefaultUI: true
		},

		isAdding : false,

		markers : [],

		initialize : function() {
			this.map = new google.maps.Map(this.$el[0], this.mapOptions);
			this.addView = null;

			this.listenTo(this.collection, "add", this.addMarker);
			this.listenTo(this.collection, "reset", this.addAllMarkers);
			this.listenTo(this.collection, "remove", this.removeMarker);
			this.listenTo(this.collection, "destroy", this.removeMarker);
			this.listenTo(this.collection, "filter", this.filterMarkers)

			_.extend(this, Backbone.Events);
		},

		addMarker : function(restaurant) {
	        var marker = new RestaurantMarker(this.map, restaurant); 
	        this.markers.push(marker);
	        return marker;
	    },

	    removeMarker : function(restaurant) {
	    	var marker = _.findWhere(this.markers, {restaurant : restaurant});
	    	if(marker) {
				this.markers.splice(this.markers.indexOf(marker), 1);
	    		marker.close();
	    	}
	    },

	    clearMarkers : function() {
	    	_.each(this.markers, function(marker){ marker.close(); });
	    	this.markers = [];
	    },

	    addAllMarkers : function() {
	    	this.clearMarkers();
			this.collection.each(this.addMarker, this);
		},

	    filterMarkers : function(filteredType) {
	    	this.clearMarkers();
	    	var mapView = this;
	    	var filteredList = this.collection.getAllType(filteredType);
	    	_.each(filteredList, this.addMarker, this);
	    },

		setEntryMode : function(active) {
			this.isAdding = active;
			if(this.isAdding) {
				this.map.setOptions({draggableCursor:'crosshair'});
				var mapView = this;
				google.maps.event.addListener(this.map, 'click', function(event) {
					mapView.addEntryOnLocation(event.latLng);
				});
			}else{
				this.map.setOptions({draggableCursor:'default'});
				google.maps.event.clearListeners(this.map, 'click');
				this.cancelEntryMode();
			}
		},

		addEntryOnLocation : function(location) {
			if(this.addView == null) {
				this.addView = new AddView({
					collection : this.collection
				});
			} 
			var mapView = this;
			this.addView.once('closed', function() { 
				mapView.addView = null;
				mapView.trigger('cancelEntry');
			});
			this.addView.open(this.map, location);
		},

		cancelEntryMode : function() {
			if(this.addView != null) {
				this.addView.close();
				this.addView = null;
			}
		}

	});

	return MapView;

});