define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){

	var placeholderTemplate = "Restaurant Name: <input id='entry-name' type='text'></input><br/><br/>Main Cuisine: <input id='entry-type' type='text'></input><br/><br/><button id='create-restau' type='submit'>Add</button>";

	var AddView = Backbone.View.extend({

		className : 'addRestaurant',

		initialize : function() {
			_.extend(this, Backbone.Events);
		},

		open : function(map, location) {
			if(this.marker == null && this.popup == null) {
				this.marker = new google.maps.Marker({
					position: location,
		            map: map,
		            animation: google.maps.Animation.DROP
				});

				this.popup = new google.maps.InfoWindow({
					content : placeholderTemplate
				});
				
				this.addPopupListeners();
			}
			this.marker.setPosition(location);
			this.marker.setAnimation(google.maps.Animation.DROP);
			this.popup.open(map, this.marker);
			this.position = location;
		},

		close : function() {
			this.trigger('closed');
			this.popup.close();
			this.marker.setMap(null);
			this.popup = null;
			this.marker = null;
		},

		addPopupListeners : function() {
			var addView = this; // pass this reference to closures below

			// bind this object instance to our callback functions
			_.bindAll(this, 'onKeyDownAddView');
			_.bindAll(this, 'createEntryAddView'); 

			// since Google.InfoWindow does not automatically get added to DOM,
			// let's wait for it to be created first before we get our form inputs
			google.maps.event.addListener(this.popup, 'domready', function() {
				$('#entry-name').keydown(addView.onKeyDownAddView);
				$('#entry-type').keydown(addView.onKeyDownAddView);
				$('#create-restau').click(addView.createEntryAddView);
				$('#entry-name').focus();
			});
			google.maps.event.addListener(this.popup, 'closeclick', function() {
				addView.close();
			});
		},

		entryName : function() {
			return $('#entry-name').val().trim();
		},

		entryType : function() {
			return $('#entry-type').val().trim();
		},

		hasValidInputs : function() {
			return (!_.isEmpty(this.entryName()) && !_.isEmpty(this.entryType()));
		},

		onKeyDownAddView : function(event) {
			if(event.keyCode == 13)
				this.createEntryAddView(event);
		},

		createEntryAddView : function(event) {
			if(this.hasValidInputs()) {
				this.collection.create({
					name : this.entryName(),
					type : this.entryType(),
					lat: this.position.lat(),
					lng: this.position.lng()
				});
				this.close();
			} else {
				alert('Invalid inputs');
			}
		}

	});

	return AddView;

});