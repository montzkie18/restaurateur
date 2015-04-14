define([
	'jquery',
	'underscore',
	'backbone',
	'utils'
], function($, _, Backbone, Utils) {

	var placeholderTemplateFixed = '<div class="restaurant-marker"><h4><%= name %> <button id="delete-restau-<%= cid %>" class="btn btn-xs" type="button"> <span class="glyphicon glyphicon-trash"></span> </button> </h4> <br/><%= type %> <br/>Customers: <%= customers %> <button id="edit-customers-<%= cid %>" class="btn btn-xs" type="button"> <span class="glyphicon glyphicon-pencil"></span> </button></div>';
	var placeholderTemplateEdit = '<div class="restaurant-marker"><h4><%= name %> <button id="delete-restau-<%= cid %>" class="btn btn-xs" type="button"> <span class="glyphicon glyphicon-trash"></span> </button> </h4> <br/><%= type %> <br/>Customers: <input id="num-customers-<%= cid %>" type="text" value="<%= customers %>" /></div>';

	var RestaurantMarker = Backbone.View.extend({

		template : _.template(placeholderTemplateFixed),

		constructor : function(Map, Restaurant) {
			this.map = Map;
			this.restaurant = Restaurant;
			this.isEditing = false;
			Backbone.View.apply(this, arguments);
		},

		initialize : function() {
			this.marker = new google.maps.Marker({
	            position: this.restaurant.position(),
	            map: this.map,
	            animation: google.maps.Animation.DROP
	        });
	        this.addMarkerClickListeners();

	        this.info = new google.maps.InfoWindow({
	        	content : ''
	        });
	        this.addInfoListeners();

	        this.showInfoWindow();
		},

		render : function() {
			this.restaurant.set({cid : this.restaurant.cid});
			if(this.isEditing)
				this.template = _.template(placeholderTemplateEdit);
			else
				this.template = _.template(placeholderTemplateFixed);
			this.$el.html(this.template(this.restaurant.attributes));
			return this;
		},

		addMarkerClickListeners : function() {
			var restaurantMarker = this;
	        google.maps.event.addListener(this.marker, 'click', function(event) {
	        	restaurantMarker.removeMarkerHoverListners();
	        });
		},

		addMarkerHoverListeners : function() {
			var restaurantMarker = this;
	        google.maps.event.addListener(this.marker, 'mouseover', function(event) {
	        	restaurantMarker.showInfoWindow();
	        });
	        google.maps.event.addListener(this.marker, 'mouseout', function(event) {
	        	restaurantMarker.hideInfoWindow();
	        });
		},

		removeMarkerHoverListners : function() {
			google.maps.event.clearListeners(this.marker, 'mouseover');
	        google.maps.event.clearListeners(this.marker, 'mouseout');
		},

		addInfoListeners : function() {
			var restaurantMarker = this; // pass this reference to closures below

			_.bindAll(this, 'deleteEntryMarker');
			_.bindAll(this, 'startEditModeMarker');
			_.bindAll(this, 'onKeyDownMarker');

			// since Google.InfoWindow does not automatically get added to DOM,
			// let's wait for it to be created first before we get our form inputs
			google.maps.event.addListener(this.info, 'domready', function() {
				$('#delete-restau-' + restaurantMarker.restaurant.cid).click(restaurantMarker.deleteEntryMarker);
				$('#edit-customers-' + restaurantMarker.restaurant.cid).click(restaurantMarker.startEditModeMarker);
				$('#num-customers-' + restaurantMarker.restaurant.cid).keydown(restaurantMarker.onKeyDownMarker);
			});
			google.maps.event.addListener(this.info, 'closeclick', function() {
				// after being closed, enable opening on mouseover and mouseout again
				restaurantMarker.addMarkerHoverListeners();
			});
		},

		showInfoWindow : function() {
			this.info.setContent(Utils.html(this.render().el));
			this.info.open(this.map, this.marker);
		},

		hideInfoWindow : function() {
			this.info.close();
		},

		startEditModeMarker : function() {
			this.isEditing = true;
			this.info.setContent(Utils.html(this.render().el));
		},

		stopEditModeMarker : function() {
			this.isEditing = false;
			this.info.setContent(Utils.html(this.render().el));
		},

		onKeyDownMarker : function(e) {
			if(e.keyCode == 13) {
				this.saveCustomerCount();
				this.stopEditModeMarker();
			}
		},

		saveCustomerCount : function() {
			this.restaurant.save({customers : parseInt($('#num-customers-' + this.restaurant.cid).val())});
		},

		deleteEntryMarker : function() {
			this.restaurant.destroy();
		},

		close : function() {
			google.maps.event.clearInstanceListeners(this.marker);
			this.marker.setMap(null);
			this.marker = null;
		}

	});

	return RestaurantMarker;

});