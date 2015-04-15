define(['backbone', 'models/place'], function(Backbone, Place){

	var Places = Backbone.Collection.extend({
		url : 'places',
		model : Place,

		constructor : function(map) {
			this.service = new google.maps.places.PlacesService(map);
			Backbone.Collection.apply(this, arguments);
		},

		fetch : function(query, options) {
			options = options ? _.clone(options) : {};
			query.radius = query.radius || 500;
			var collection = this;
			this.service.nearbySearch(query, function(results, status){
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					var models = [];
					for(var i=0; i<results.length; i++){
						models.push(new Place(results[i]));
					}
					var method = options.reset ? 'reset' : 'set';
					if(options.reset)
						collection.reset(models, options);
					else
						collection.set(models, options);
				}
			});
		}

	});

	return Places;

});