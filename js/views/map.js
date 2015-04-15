define([
	'jquery',
	'backbone',
	'views/restaurant/marker'
], function($, Backbone, RestaurantMarker) {

	var MapView = Backbone.View.extend({

		className : 'mapView',

		markerClass : RestaurantMarker,

		constructor : function(attributes, options) {
			this.map = attributes.map;
			this.markers = [];
			Backbone.View.apply(this, arguments);
		},

		initialize : function() {
			this.listenTo(this.collection, "add", this.addMarker);
			this.listenTo(this.collection, "reset", this.addAllMarkers);
			this.listenTo(this.collection, "remove", this.removeMarker);
			this.listenTo(this.collection, "filter", this.filterMarkers)
		},

		addMarker : function(model) {
		    var marker = new this.markerClass(this.map, model); 
		    marker.setupListeners();
		    this.markers.push(marker);
		    return marker;
		},

		removeMarker : function(model) {
			var marker = _.findWhere(this.markers, {model : model});
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
		}

	});

	return MapView;

});