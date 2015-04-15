define(['backbone'], function(){

	var Place = Backbone.Model.extend({
		url : 'place',

		defaults : {
			type : 'Unclassified',
			customers : 0
		},

		set : function() {
			Backbone.Model.prototype.set.apply(this, arguments);
			type = this.attributes.types ? this.attributes.types[0] : 'Unclassified';
		},

		position : function() {
			return this.attributes.geometry.location;
		}

	});

	return Place;

});