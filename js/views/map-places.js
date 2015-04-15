define([
	'views/map',
	'shifty'
], function(MapView, Tweenable){

	var PlacesMapView = MapView.extend({

		initialize : function() {
			this.markers = [];
			this.position = this.map.getCenter();
			this.isDropping = false;
			this.createRadar();
			this.addListeners();
			MapView.prototype.initialize.apply(this, arguments);
		},

		searchRadius : function() {
			return parseInt($('#search-radius').val());
		},

		filterType : function() {
			return $('#filter-type').val();
		},

		addListeners : function() {
			var mapView = this;

			$('#search-radius').change(function() {
				if(mapView.searchRadius() < 0) {
					$('#search-radius').val(0);
				}else if(mapView.searchRadius() > 50000) {
					$('#search-radius').val(50000);
				}
				mapView.fetchPlaces(mapView.position, mapView.searchRadius());
			});

			google.maps.event.addListener(this.map, 'click', function(event) {
				
			});

			google.maps.event.addListener(this.searchMarker, 'click', function(e){

			});
		},

		createRadar : function() {
			var radarOptions = {
				strokeColor: '#0000FF',
				strokeOpacity: 0.8,
				strokeWeight: 1,
				fillColor: '#0000FF',
				fillOpacity: 0.1,
				map: this.map,
				center: this.position,
				radius: 0
			};
			this.searchRadar = new google.maps.Circle(radarOptions);

			var markerOptions = {
				position : this.position,
				map : this.map,
				icon : {
					url : 'https://cdn2.iconfinder.com/data/icons/picons-basic-2/57/basic2-059_pin_location-512.png',
					scaledSize : { width : 64, height : 64 },
					anchor : { x : 32, y : 50 }
				}
			}
			this.searchMarker = new google.maps.Marker(markerOptions);
			this.dropRadar(this.position);
		},

		dropRadar : function(position) {
			this.searchMarker.setPosition(position);
			this.searchRadar.setCenter(position);
			this.searchRadar.setRadius(0);
			this.animateSearchRadar();
		},

		animateSearchRadar : function() {
			if(this.motion == null)
				this.motion = new Tweenable();
			else
				this.motion.stop();

			var appView = this;
			this.motion.tween({
				from : { radius : 0 },
				to : { radius : appView.searchRadius() },
				easing : 'bounce',
				duration : 1000,
				step : function(state) {
					appView.searchRadar.setRadius(state.radius);
				},
				finish : function(state) {
					appView.searchRadar.setRadius(appView.searchRadius());
				}
			});
		},

		setDropPinMode : function(active) {
			this.isDropping = active;
			if(this.isDropping) {
				this.map.setOptions({draggableCursor:'crosshair'});
				var mapView = this;
				google.maps.event.addListener(this.map, 'click', function(event) {
					mapView.fetchPlaces(event.latLng, mapView.searchRadius())
					mapView.trigger('finishDropPin');
				});
			}else{
				this.map.setOptions({draggableCursor:'default'});
				google.maps.event.clearListeners(this.map, 'click');
			}
		},

		fetchPlaces : function(position, radius) {
			this.position = position;
			$('#search-radius').val(radius);
			this.dropRadar(position);

			var query = { location: position, radius : radius, types : ['restaurant', 'food'] };
			if(this.filterType() != 'All') query.keyword = this.filterType();
			this.collection.fetch(query, {reset:true});

			this.clearMarkers();
		}
	});

	return PlacesMapView;
	
});