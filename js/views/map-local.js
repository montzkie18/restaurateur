define([
	'views/map',
	'views/restaurant/add',
	'views/restaurant/marker-local'
], function(MapView, AddView, LocalRestaurantMarker){

	var LocalMapView = MapView.extend({

		className : 'mapLocalView',

		markerClass : LocalRestaurantMarker,

		initialize : function() {
			_.extend(this, Backbone.Events);
			this.addView = null;
			this.isAdding = false;
			this.markers = [];
			MapView.prototype.initialize.apply(this, arguments);
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
				mapView.trigger('finishEntry');
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

	return LocalMapView;

});