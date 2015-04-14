define(['backbone', 'localstorage', 'models/restaurant'], function(Backbone, LocalStorage, Restaurant){

	var RestaurantList = Backbone.Collection.extend({
		url : 'restaurants',
		model : Restaurant,
		localStorage : new LocalStorage('restaurants')
	});

	return RestaurantList;

});