var myLat = 42;
var myLng = -71;
var cars_request = new XMLHttpRequest();
var car_marker;
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
						zoom: 8, 
						center: me,
						mapTypeId: google.maps.MapTypeId.HYBRID
					};
var map;
var marker;
var markers = [];
var info_content = [];
var infowindow = new google.maps.InfoWindow();

Number.prototype.toRad = function() {  // convert degrees to radians 
            return this * Math.PI / 180;
			                        }
function find_distance(lat1, lon1, lat2, lon2)
            {
              var R = 6371; // km 
              var dLat = (lat2-lat1).toRad(); 
              var dLon = (lon2-lon1).toRad(); 
              var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
              Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
              Math.sin(dLon/2) * Math.sin(dLon/2); 
              var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
              var d = R * c;
              return d;
            }
			
var image = 'images/car_icon.jpg';

function getMyLocation()
			{
				if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
					navigator.geolocation.getCurrentPosition(function(position) {
						myLat = position.coords.latitude;
						myLng = position.coords.longitude;
						renderMap();
					});
				}
				else {
					alert("Geolocation is not supported by your web browser.  What a shame!");
				}
			}
			
function renderMap() 
			{
				me = new google.maps.LatLng(myLat, myLng);

				// Update map and go there...
				map.panTo(me);

				// Create a marker
				marker = new google.maps.Marker({
					position: me,
					animation: google.maps.Animation.DROP,
					title: "My latitude is " + myLat + " and my longitude is " + myLng + ".",
					icon: "images/self.jpg"
				});
				
				marker.setMap(map);
				// Open info window on click of marker
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(marker.title + "<br />" + "This map shows cars near you!");
					infowindow.open(map, marker);
				});
			}
			
function init()
			{
				map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
				cars_request.open("GET", "http://limitless-beyond-4298.herokuapp.com/map", true);
				cars_request.send(null);
				cars_request.onreadystatechange = function(){ 
                  if (cars_request.readyState == 4 && cars_request.status == 200) {
		            data = JSON.parse(cars_request.responseText);
					for(var k = 0; k < data.length; k++)
					{
					 markers[k] = new google.maps.Marker({
					      position: new google.maps.LatLng(parseInt(data[k]['lat']), parseFloat(data[k]['long'])),
					      title: data[k]['make'],
						  icon: image
				        });
						markers[k].setMap(map);
						console.log("Cur car is " + data[k]['car']);
						console.log("K is " + k);
						console.log("Marker " + k + "is " + markers[k].title);
						info_content[k] = "Car Info" + "<br />" + "Model = " + data[k]['car'] + "<br />" + "Type = " + data[k]['make'];
						info_contents = info_content[k];
						addListener(markers[k], info_contents);
					}
					getMyLocation();
					}
		            }
			}
			
function addListener(marker, info_content)
            {
			google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(info_content);
					infowindow.open(map, this);
				});
            }