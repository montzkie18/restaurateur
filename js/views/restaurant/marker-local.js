define([
	'jquery',
	'underscore',
	'views/restaurant/marker',
	'utils'
], function($, _, RestaurantMarker, Utils){

	var placeholderTemplateFixed = '<div class="restaurant-marker"><h4><%= name %> <button id="delete-restau" class="btn btn-xs" type="button"> <span class="glyphicon glyphicon-trash"></span> </button> </h4> <br/><%= type %> <br/>Customers: <%= customers %> <button id="edit-customers" class="btn btn-xs" type="button"> <span class="glyphicon glyphicon-pencil"></span> </button></div>';
	var placeholderTemplateEdit = '<div class="restaurant-marker"><h4><%= name %> <button id="delete-restau" class="btn btn-xs" type="button"> <span class="glyphicon glyphicon-trash"></span> </button> </h4> <br/><%= type %> <br/>Customers: <input id="num-customers" type="text" value="<%= customers %>" /></div>';

	var LocalRestaurantMarker = RestaurantMarker.extend({

		template : _.template(placeholderTemplateFixed),

		constructor : function(map, model) {
			this.isEditing = false;
			RestaurantMarker.apply(this, arguments);
		},

		render : function() {
			if(this.isEditing)
				this.template = _.template(placeholderTemplateEdit);
			else
				this.template = _.template(placeholderTemplateFixed);
			RestaurantMarker.prototype.render.apply(this, arguments);
			return this;
		},

		addInfoListeners : function() {
			var restaurantMarker = this;

			_.bindAll(this, 'deleteEntryMarker');
			_.bindAll(this, 'startEditModeMarker');
			_.bindAll(this, 'onKeyDownMarker');

			// since Google.InfoWindow does not automatically get added to DOM,
			// let's wait for it to be created first before we get our form inputs
			google.maps.event.addListener(RestaurantMarker.info, 'domready', function() {
				$('#delete-restau').click(restaurantMarker.deleteEntryMarker);
				$('#edit-customers').click(restaurantMarker.startEditModeMarker);
				$('#num-customers').keydown(restaurantMarker.onKeyDownMarker);
			});

			RestaurantMarker.prototype.addInfoListeners.apply(this, arguments);
		},

		startEditModeMarker : function() {
			this.isEditing = true;
			RestaurantMarker.info.setContent(Utils.html(this.render().el));
		},

		stopEditModeMarker : function() {
			this.isEditing = false;
			RestaurantMarker.info.setContent(Utils.html(this.render().el));
		},

		onKeyDownMarker : function(e) {
			if(e.keyCode == 13) {
				e.stopPropagation();
				this.saveCustomerCount();
				this.stopEditModeMarker();
			}
		},

		saveCustomerCount : function(e) {
			e.stopPropagation();
			this.model.save({customers : parseInt($('#num-customers-' + this.model.cid).val())});
		},

		deleteEntryMarker : function(e) {
			e.stopPropagation();
			this.model.destroy();
		},

	});

	return LocalRestaurantMarker;

});