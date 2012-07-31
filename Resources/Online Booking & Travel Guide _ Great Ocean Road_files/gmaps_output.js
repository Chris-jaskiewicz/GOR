// JavaScript Document

//

var map;

var section = 'home';



//StreetView Vars

var useSatelliteView = false;

var useStreetView = 0;

var clusterGridSize = 50;

var streetview_angle = 0;

var streetview_zoom  = 1;

var mapview_zoom  = 11;



//Passed from Venue Page or Filters

var mapview_latitude;

var mapview_longitude;

var pageVenueName;

var pageBookURL;



var legend_area_arr = [];

var legend_type_arr = [];

var town_lat;

var town_long;

var town_zoom;

var do_clustering;



//All category venue details

var catVenues  = [];



//Home items

var homeVenues = [];



// The Markers

var markers = [];



//For fit to mapBounds on venue

var LatLngList = [];

var mapBounds;

// Locations

var locations = [];

var location_set_do = [];

var location_set_eat = [];

var location_set_stay = [];

var related_set = [];



var do_marker_visible = false;

var eat_marker_visible = false;

var stay_marker_visible = false;

/*

0 = name

1 = lat

2 = long

3 = iconImg

4 = url

5 = blurb

6 = bookURL

7 = imgURL

*/



function initialize() {

	var myLatlng;

	var myZoom; 

	var mapType;

	//Colourize code

	var mapStyles = [

		{

			featureType: 'water',

			elementType: 'geometry',

			stylers: [

				{ hue: '#cde3ea' },

				{ saturation: -9 },

				{ lightness: 42 },

				{ visibility: 'simplified' }

			]

		},{

			featureType: 'landscape.man_made',

			elementType: 'geometry',

			stylers: [

				{ hue: '#ebe9de' },

				{ saturation: -9 },

				{ lightness: 6 },

				{ visibility: 'simplified' }

			]

		},{

			featureType: 'landscape.natural',

			elementType: 'geometry',

			stylers: [

				{ hue: '#ffffff' },

				{ saturation: -100 },

				{ lightness: 100 },

				{ visibility: 'simplified' }

			]

		},{

			featureType: 'poi.park',

			elementType: 'all',

			stylers: [

				{ hue: '#bbcfb0' },

				{ saturation: -43 },

				{ lightness: -4 },

				{ visibility: 'on' }

			]

		},{

			featureType: 'road.highway',

			elementType: 'geometry',

			stylers: [

				{ hue: '#FF9900' },

				{ saturation: -15 },

				{ lightness: -29 },

				{ visibility: 'simplified' }

			]

		},{

			featureType: 'road.arterial',

			elementType: 'geometry',

			stylers: [

				{ hue: '#eeff47' },

				{ saturation: 100 },

				{ lightness: -17 },

				{ visibility: 'simplified' }

			]

		},{

			featureType: 'water',

			elementType: 'all',

			stylers: [

	

			]

		}

	];//

	

	//Set Map Center

	if (mapview_latitude == null) {

		//Default Values

		//myLatlng = new google.maps.LatLng(-38.4471, 143.0694);
		myLatlng = new google.maps.LatLng(-38.540378, 143.070087);

		myZoom  = 9;

	} else {

		//Venue Mode Values OR Filtered to Town

		myLatlng = new google.maps.LatLng(mapview_latitude,mapview_longitude);

		myZoom  = mapview_zoom;

	}



	//Road map or satelite map

	if (!useSatelliteView) {

		mapTypeSetting = google.maps.MapTypeId.ROADMAP;

	}

	else  {

		mapTypeSetting = google.maps.MapTypeId.HYBRID;

		myZoom  = mapview_zoom;

	}

	//The options

	var myOptions = {

		scrollwheel: false,

	  	zoom: myZoom,

	  	center: myLatlng,

	  	mapTypeId: mapTypeSetting,

	  	mapTypeControl: true,

		mapTypeControlOptions: {

			style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,

			position: google.maps.ControlPosition.RIGHT_BOTTOM

		},

	   	zoomControl: true,

    	zoomControlOptions: {

			style: google.maps.ZoomControlStyle.SMALL,

			position: google.maps.ControlPosition.RIGHT_CENTER

		},

		panControl: true,

		panControlOptions: {

			position: google.maps.ControlPosition.RIGHT_CENTER

		},

		scaleControl: true,

		scaleControlOption: {

			position: google.maps.ControlPosition.BOTTOM

		}



	};

	

	//Specify dom element

	map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);

		

	//Stylized map

	map.setOptions({styles: mapStyles});



	

	//ADD MARKERS

	//Choose add markers based on current section	

	if (section == "categories") {

		clusterGridSize = 50;

		showCatMarkers();

	} else if (section == "venue") {

		clusterGridSize = 30;

		showPageVenue();

		

	} else if (section == "home") {

		clusterGridSize = 50;

		showHomeMarkers();

	} else {

		showDefaultMarkers(); 

	} 

	

	//Add STREET VIEW Settubgs

	//heading: 34,

	var panoramaOptions = {

	  position: myLatlng,

	  pov: {

		heading: streetview_angle,

		pitch: 4,

		zoom: streetview_zoom

	  },

	 addressControlOptions: {

		position: google.maps.ControlPosition.RIGHT_BOTTOM

	  },

	  zoomControlOptions: {

		  position: google.maps.ControlPosition.RIGHT_CENTER

	  },

	  panControlOptions: {

		  position: google.maps.ControlPosition.RIGHT_CENTER

	  },

	  navigationControlOptions: {

		position: google.maps.ControlPosition.TOP_LEFT

	  } 

	};

	var panorama = new  google.maps.StreetViewPanorama(document.getElementById("map_canvas"),panoramaOptions);

	map.setStreetView(panorama);	



	//if (status == google.maps.StreetViewStatus.OK)



	//Turn on based on page/settings 

	if (section == "venue" && useStreetView == '1') {

		panorama.setVisible(true);

		document.getElementById("streetview_click").style.visibility = 'visible'; 	

	} else {

		panorama.setVisible(false);

		document.getElementById("streetview_click").style.visibility = 'hidden'; 	

	}

	

	//panorama.set('enableCloseButton', true); 

	

	/*google.maps.event.addListener(panorama, 'closeclick', function() {

		document.getElementById("streetview_click").style.visibility = 'hidden'; 	

	});*/

	google.maps.event.addListener(panorama, "visible_changed", function() {

		var hasPano = map.getStreetView();

		if(hasPano){

			document.getElementById("streetview_click").style.visibility = 'visible'; 	

		} else {

			document.getElementById("streetview_click").style.visibility = 'hidden'; 		

		}

	});

	

	//Legend Box

	if (section != "venue"){

		loadLegendBox();

	}

	

	//Fit to bounds when related items on venue page		

	/*if (related_set.length > 0) {

		fit_map_to_bounds();		

	}*/

}



function closeSV()

{

	var panorama = map.getStreetView();

	if(panorama){

		panorama.setVisible(false);

		document.getElementById("streetview_click").style.visibility = 'hidden'; 

	} 

}



//ADDS MARKERS TO MAP

//locations array setup = var locations = [	[name, lat, long, iconImg, urlID, htmlInfo, bookURL, imageURL] ]



function addMarkers(locations, markerCat)

{

	markerCat = markerCat || "normal";



	

	infoWindow = new google.maps.InfoWindow({

		pixelOffset: new google.maps.Size(6,40)

	});

	

	

	var marker, marker_do, i, venueName, name, lat, long, iconImg, htmlInfo, bookURL, imgURL;

	

    for (i = 0; i < locations.length; i++)

	{

		//Get all the variables to its easy for Kat to use :)

		venueName 	= locations[i][0];

		lat 		= locations[i][1];

		long 		= locations[i][2];

		iconImg 	= locations[i][3]; 

		urlID	 	= locations[i][4];

		blurb		= locations[i][5];

		bookURL	 	= locations[i][6];

		imgURL	 	= locations[i][7];

		htmlInfo 	= infoWindowContent(venueName, blurb, urlID, bookURL, imgURL);

		

		//Add markers to map

		marker = new google.maps.Marker({

			  position: new google.maps.LatLng(lat, long),

			  map: map,

			  draggable: false,

			  icon: iconImg,

			  title: venueName,

			  animation: google.maps.Animation.DROP,

			  htmlStuff: htmlInfo,

			  category: markerCat

			});

		//Set up info window

		google.maps.event.addListener(marker, 'click', (function(marker, i) {

			return function() {

			  infoWindow.setContent(this.htmlStuff);  

			  infoWindow.open(map, marker);

			}

		})(marker, i));

		

		//Save for clustering

		markers.push(marker);

		

		if (markerCat != 'normal' && markerCat != 'related')

			marker.setVisible(false);

		

		if (section == 'venue')

		{

			//Save latlongs for fitmapBounds

			LatLngList .push(new google.maps.LatLng(lat, long));

			mapBounds = new google.maps.LatLngBounds ();

						

		}

		

		

	}

	

	var clusterOptions = {

		gridSize: clusterGridSize,

		maxZoom: 11,

		styles: [{

			height: 52,

			url: "http://gor.b2cloud.com.au/themes/gorcloud/images/cluster-icon1.png",

			width: 53,

			textColor: "white"

		}]

		

	};

	

	if (markerCat == 'normal' && do_clustering){

		var markerCluster = new MarkerClusterer(map, markers, clusterOptions);

	}

	

}



function infoWindowContent(title, blurb, linkURL, bookURL, imgURL)

{

	

	var content;

	var infoClass = "info-fullwidth";

	var placeHolderImg = "/themes/gorcloud/images/temp_thumb.jpg";

	

	content  = "<div class='windowPopup'>";

	content += "<h3>" + title + "</h3>";

	

	if (imgURL != placeHolderImg && imgURL != ""){ 

		content += "<div class='photo'><img src=" + imgURL + " height='69' width='120' alt=''/></div>";

		infoClass = "info";

	}

	content += "<div class='"+infoClass+"'><p>" + blurb + "</p>";

	

	if (bookURL != "" ) { 

		content += " <a href='"+ bookURL +"' target='_blank'>Book Online</a> "; 

	}

	if (linkURL != 0 ) { 

		content += " <a href='"  + linkURL +"'>View Page</a>"; 

	}

	

	content += "</div></div>"; 

	

	return content;

	

}



function showPageVenue()

{

	//The main maker

	addMarkers(locations);

	

	//Add the other groups

	//(array, category)

	addMarkers(location_set_do, 'do');

	addMarkers(location_set_eat, 'eat');

	addMarkers(location_set_stay, 'stay');

	

	//Related

	addMarkers(related_set, 'related');



}

function showCatMarkers()

{

	addMarkers(locations);



}



function showHomeMarkers() 

{

	addMarkers(locations);



}



function showDefaultMarkers()

{

	//No markers

}



//MARKER TOGGLE FUNCTIONS



//TO DO MARKERS

function toggle_do()

{

	//Toggle status

	do_marker_visible 	= !do_marker_visible; 

	

	//hideMarkers

    for(var i=0; i<markers.length; i++){

		if (markers[i].category == 'do') {

       		markers[i].setVisible(do_marker_visible);

		}

    }

	update_display_on_toggle('click-do', do_marker_visible);

}





//EAT MARKERS

function toggle_eat()

{

	//Toggle status

	eat_marker_visible 	= !eat_marker_visible; 

	

	//hideMarkers

    for(var i=0; i<markers.length; i++){

		if (markers[i].category == 'eat') {

       		markers[i].setVisible(eat_marker_visible);

		}

    }

	update_display_on_toggle('click-eat', eat_marker_visible);

}





//STAY MARKERS

function toggle_stay()

{

	//Toggle status

	stay_marker_visible = !stay_marker_visible; 

	

	//hideMarkers

    for(var i=0; i<markers.length; i++){

		if (markers[i].category == 'stay') {

       		markers[i].setVisible(stay_marker_visible);

		}

    }

	update_display_on_toggle('click-stay', stay_marker_visible);

}



//UPDATE SCREEN AFER TOGGLING

function update_display_on_toggle(divID, vis){

	if (vis) {

		document.getElementById(divID).innerHTML = "<img src='/themes/gorcloud/images/toggle_on.png' />";

		//Make sure they all fit on screen & display mode is map

		closeSV();

		//Fit to mapBounds

		fit_map_to_bounds();



	} else {

		document.getElementById(divID).innerHTML = "";

	}

}

function fit_map_to_bounds(){

	//Fit to mapBounds

	//console.log(LatLngList.length);

	for (var i = 0, LtLgLen = LatLngList.length; i < LtLgLen; i++)

	{

	  //And increase the mapBounds to take this point

	  mapBounds.extend (LatLngList[i]);

	  

	}

	//Fit these mapBounds to the map

	map.fitBounds (mapBounds);	

}

//LEGEND BOX

function loadLegendBox()

{

	

	var cur_area = getQueryVariable('area');

	var cur_type = getQueryVariable('type');

	

	if (section != 'venue')

	{

		if (legend_area_arr.length > 0 || legend_type_arr.length > 0)

		{

		

			//Setup

			lb = "";

			lb +=   "<div class='wrap'><div class='box'>";

			lb +=  "<h4>I AM LOOKING<br /><strong>TO FIND:</strong></h4>";

			lb += "  <form action='' method='get'>"; //onsubmit='this.submit();return false;'

			//Areas List

			if (legend_area_arr.length > 0)

			{

				lb += "  <fieldset id='legend-area'>";

				lb += "  <label for='area'>Area</label>";

				lb += "  <select name='area'>";

				//Default Value

				if (cur_area == "") 

					lb += "<option selected='selected' value=''>Select an area</option>";

				else 

					lb += "<option value=''>Select an area</option>";

				//Options

				for ( var i=0, len=legend_area_arr.length; i<len; ++i )

				{

					lb +=  make_select_item(legend_area_arr[i][0],legend_area_arr[i][1],cur_area);

				}

				lb += "  </select>";

				lb += "  </fieldset>";

			}

			//Types List

			if (legend_type_arr.length > 0)

			{

				lb += "  <fieldset id='legend-type'>";

				lb += "  <label for='type'>Type</label>";

				lb += "  <select name='type'>";

				//Default Value

				if (cur_type == "") 

					lb += "<option selected='selected' value=''>Select a type</option>";

				else 

					lb += "<option value=''>Select a type</option>";

					

				//Options

				for ( var i=0, len=legend_type_arr.length; i<len; ++i )

				{

					lb +=  make_select_item(legend_type_arr[i][0],legend_type_arr[i][1],cur_type);

				}

				lb += "  </select>";

				lb += "  </fieldset>";

			}

			lb +=  "<div class='submitrow'> ";

			//lb +=  "<input type='image' name='submitBtn' src='/themes/gorcloud/images/legend_submit.png' width='67' height='64' border='0' alt='Submit'> ";

			lb += "<input type='submit' value='' border='0'/>";

			

			lb +=  "</form>";

			lb +=  " </div>";

			lb += "</div></div>";

			

			document.getElementById("legend").innerHTML = lb;

		}

	}

}



function make_select_item(name, value, curValue){

	

	op = "<option value='"+value+"'";

	

	if (value == curValue)

		op += " selected='selected'";

		

	op += ">"

	op += name+"</option>";

	

	return op;

}



function getQueryVariable(variable)

 {

  var query = window.location.search.substring(1);

  var vars = query.split("&");

  for (var i=0;i<vars.length;i++) {

    var pair = vars[i].split("=");

    if (pair[0] == variable) {

      return pair[1];

    }

  } 

 }

//LOAD GOOGLE MAPS

function loadScript() 

{

	var script = document.createElement('script');

	script.type = 'text/javascript';

	script.src = 'http://maps.googleapis.com/maps/api/js?sensor=false&' +

		'callback=initialize';

	document.body.appendChild(script);

}





window.onload = loadScript;









