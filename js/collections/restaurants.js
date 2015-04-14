define(['backbone', 'localstorage', 'models/restaurant'], function(Backbone, LocalStorage, Restaurant){

	var RestaurantList = Backbone.Collection.extend({
		url : 'restaurants',
		model : Restaurant,
		localStorage : new LocalStorage('restaurants'),

		filterByType : function(filteredType) {
			if(filteredType != 'All')
				this.trigger('filter', filteredType);
			else
				this.trigger('reset');
		},

		getAllType : function(selectedType) {
			return this.where({type : selectedType});
		}
	});

	return RestaurantList;

});