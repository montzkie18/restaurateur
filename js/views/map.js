define([
	'jquery',
	'backbone'
], function($, Backbone) {

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

		pendingMark : null,

		initialize : function() {
			this.map = new google.maps.Map(this.$el[0], this.mapOptions);
			this.info = new google.maps.InfoWindow();
		},

		pushMarker : function(location) {
	        var marker = new google.maps.Marker({
	            position: location,
	            map: this.map,
	            animation: google.maps.Animation.DROP
	        });
	        this.markers.push(marker);
	        this.map.setCenter(location);
	        return marker;
	    },

	    moveMarker : function(location) {
	    	if(this.markers.length > 0) {
	    		this.markers[this.markers.length-1].setPosition(location);
	    	}
	    },

	    popMarker : function() {
	    	if(this.markers.length > 0) {
				var marker = this.markers.pop();
	    		marker.setMap(null);
	    	}
	    },

		toggleDropMarker : function() {
			this.isAdding = !this.isAdding;
			if(this.isAdding) {
				this.map.setOptions({draggableCursor:'crosshair'});
				var mapView = this;
				google.maps.event.addListener(this.map, 'click', function(event) {
					mapView.dropMarker(event.latLng);
				});
			}else{
				if(this.pendingMark !== null) {
					this.popMarker();
					this.pendingMark = null;
				}
				this.map.setOptions({draggableCursor:'default'});
				google.maps.event.clearListeners(this.map, 'click');
			}
		},

		dropMarker : function(location) {
			if(this.pendingMark === null) {
				this.pendingMark = this.pushMarker(location);
			} else {
				this.moveMarker(location);
			}
		}

	});

	return MapView;

});