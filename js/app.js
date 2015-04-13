define([
	// 'collections/restaulist',
	// 'views/appview',
	// 'views/listview'
	], 

function() {
  var App = function() {
  	// this.collections.restaurants = new RestaurantList();
  	// this.views.app = new AppView();
  	// this.views.list = new ListView( { collections: this.collections.restaurants } );

    var mapOptions = {
      center: { lat: 10.3146024, lng: 123.8857841},
      disableDefaultUI: true,
      zoom: 14
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    function placeMarker(location) {
        var marker = new google.maps.Marker({
            position: location,
            map: map,
            animation: google.maps.Animation.DROP
        });
        map.setCenter(location);
    }

    $('#add-restau').on('click', function() {
      map.setOptions({draggableCursor:'crosshair'});
      google.maps.event.addListener(map, 'click', function(event) {
          placeMarker(event.latLng);
      });
    });
  };

  App.prototype = {
  	views : {},
  	collections : {}
  };

  return App;
});