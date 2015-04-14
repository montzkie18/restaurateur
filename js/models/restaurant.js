define(['backbone'], function(Backbone){

	var Restaurant = Backbone.Model.extend({
		url: 'restaurants'
	});

	return Restaurant;
});