define(['backbone'], function(Backbone){

	var Restaurant = Backbone.Model.extend({
		url : 'restaurant',

		defaults : {
			'name' : '',
			'type' : '',
			'lat' : 0,
			'lng' : 0,
			'customers' : 0
		},

		position : function() {
			return new google.maps.LatLng(this.get('lat'), this.get('lng'));
		}

	});

	return Restaurant;
});