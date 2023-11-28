//-----DEFAULT MAP CONFIGURATION AND GLOBAL VARIABLES-----//
var defaultMapCenter = new google.maps.LatLng(49.944630, 18.597937); //Jastrzebie-Zdroj, Silesian, Poland
var mapOptions = {
	zoom: 14,
	center: defaultMapCenter
};
var travelMode="DRIVING"; //default travel mode
var tempFoundLocation=[];
let labelIndex = 0;
var selectedLocationsAddressesArray=[];
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var directionsService2 = new google.maps.DirectionsService();
var map;
geocoder = new google.maps.Geocoder();
marker = new google.maps.Marker({map,});
var distancesArray=[];
var ends=[];
var points=[];
var directionsArray=[];
//-----END - DEFAULT MAP CONFIGURATION AND GLOBAL VARIABLES-----//




//-----HTML BUTTONS LISTENERS RELATED WITH CSS STYLE DISPLAY-----//
document.getElementById("selectDriveMethodPanel_closeButton").addEventListener('click',function(){
	document.getElementById("selectDriveMethodPanel").style.display="none";
});

document.getElementById("routebtn").addEventListener('click', function(){
	document.getElementById("selectDriveMethodPanel").style.display="inline";
});

document.getElementById("detailsPanelCloseButton").addEventListener('click',function(){
	document.getElementById("panelWithDetails").style.display="none";
});

document.getElementById("detailsPanelOpenButton").addEventListener('click',function(){
	document.getElementById("panelWithDetails").style.display="inline";
})

document.getElementById("allAddedLocationsPanelCloseButton").addEventListener('click',function(){
	document.getElementById("allAddedLocationsPanel").style.display="none";
});
//-----END - HTML BUTTONS LISTENERS RELATED WITH CSS STYLE DISPLAY-----//




//-----HTML BUTTONS LISTENERS RELATED WITH FUNCTIONS-----//
//open prompt panel for enter location and search related address 
document.getElementById("searchLocationButton").addEventListener('click',function(){
	var locationText=prompt("Enter your detailed address here\nlike: \"ul. Mickiewicza 49, Warsaw, Poland\"");
	geocode({address: locationText});
});


//reset map (clear all)
document.getElementById("resetMapButton").addEventListener('click',function(){
	distancesArray=[];
	ends=[];
	points=[];
	directionsArray=[];
	labelIndex = 0;
	document.getElementById("result_StartLocation").innerHTML="&#160;";
	document.getElementById("result_EndLocation").innerHTML="&#160;";
	document.getElementById("result_Distance").innerHTML="&#160;";
	document.getElementById("result_Duration").innerHTML="&#160;";
	document.getElementById("detailsTable").innerHTML="<tr><th rowspan='2'>Summary</th><th>Start location</th><th>End location</th><th>Distance</th><th>Duration</th></tr><tr><td id='detailedResult_StartLocation'>&#160;</td><td id='detailedResult_EndLocation'>&#160;</td><td id='detailedResult_Distance'>&#160;</td><td id='detailedResult_Duration'>&#160;</td></tr><tr><td colspan='5'>&#160;</td></tr><tr id='tableDetailsHeader'><th>Route part</th><th>Start location</th><th>End location</th><th>Distance</th><th>Duration</th></tr>";
	initialize();
});


//add found location (from search prompt panel)
document.getElementById("addFoundLocationButton").addEventListener('click',function(){
	clearMarkers();
	points.push([tempFoundLocation[0],tempFoundLocation[1]]);
	addMarker(tempFoundLocation[2],map);
	alert("Location has been added!");
});


//open new windows with print/save as pdf panel
document.getElementById("saveAsPDFbtn").addEventListener('click',function(){
	var win = window.open('', '');
	win.document.write("<table border='1' style='width:100%;'>");
	win.document.write(document.getElementById("detailsTable").innerHTML);
	win.document.write("</table>");
	win.document.close();
	win.print();    // PRINT THE CONTENTS.
	win.close();
});


//show panel with all added locations
document.getElementById("allAddedLocationsButton").addEventListener('click',function(){
	document.getElementById("loadingPanelForListOfAllPoints").style.display="inline";
	document.getElementById("allAddedLocationsPanelTable").innerHTML="<tr><th>Location mark</th><th>Full ocation address</th><th>Delete</th></tr>";
	var k=points.length;
	if(selectedLocationsAddressesArray.length==points.length){
		document.getElementById("loadingPanelForListOfAllPoints").style.display="none";
		showAllAddedLocationsList2();
	}else{
		selectedLocationsAddressesArray=[];
		estimateTimeCounter(points.length,250,"loadingPanelForListOfAllPoints_estimatedTime");
		for(var i=1;i<=points.length;i++){
			setTimeoutForShowAllAddedLocationsList(i,k);
		}
		setTimeout(function(){
			document.getElementById("loadingPanelForListOfAllPoints").style.display="none";
			document.getElementById("loadingPanelForListOfAllPoints_progressValue").style.width=0;
			document.getElementById("loadingPanelForListOfAllPoints_progress").setAttribute("data-label","0% Complete");
			showAllAddedLocationsList2();
		},(points.length*250)+250);
	}
});
//-----END - HTML BUTTONS LISTENERS RELATED WITH FUNCTIONS-----//




//-----MAIN APPLICATION FUNCTIONS-----//
function setTravelMode(method){
	document.getElementById("selectDriveMethodPanel").style.display="none";
	if(method=="DRIVING" || method=="BICYCLING" || method=="WALKING" || method=="TRANSIT"){
		if(method=='TRANSIT' && points.length>2){
			alert("TRANSIT can't have more than 2 points!");
		}else{
			travelMode=method;
			calcRoute();
		}
	}
}



function fillSelectedLoactionsAddressesArray(location) {
  var request={address:location};
  geocoder
    .geocode(request)
    .then((result) => {
      var address=result.results[0].formatted_address;
      selectedLocationsAddressesArray.push(address);
    })
    .catch((e) => {
    });
}



function estimateTimeCounter(iterations,waittime,divid){
	if((iterations>0)||(waittime>0)||(divid.length>0)){
		for(var i=1;i<=iterations;i++){
			estimateTimeCounterTimeout(i,iterations,waittime,divid);
		}
	}
}



function estimateTimeCounterTimeout(i,iterations,waittime,divid){
	setTimeout(function(){
		var estimateTimeSeconds=Math.ceil(((iterations-i)*waittime)/1000);
		var estimateTime="";
		if(estimateTimeSeconds>=60){
			if(estimateTimeSeconds>=3600){
				if(estimateTimeSeconds>=86400){
					//days
					var estimateTimeDays=Math.floor(estimateTimeSeconds/86400);
					estimateTimeSeconds=estimateTimeSeconds-(estimateTimeDay*86400);
					var estimateTimeHours=Math.floor(estimateTimeSeconds/3600);
					estimateTimeSeconds=estimateTimeSeconds-(estimateTimeHours*3600);
					var estimateTimeMinutes=Math.floor(estimateTimeSeconds/60);
					estimateTimeSeconds=estimateTimeSeconds-(estimateTimeMinutes*60);
					estimateTime=""+estimateTimeDays+"d "+estimateTimeHours+"h "+estimateTimeMinutes+"min "+estimateTimeSeconds+"sec";
				}else{
					//hours
					var estimateTimeHours=Math.floor(estimateTimeSeconds/3600);
					estimateTimeSeconds=estimateTimeSeconds-(estimateTimeHours*3600);
					var estimateTimeMinutes=Math.floor(estimateTimeSeconds/60);
					estimateTimeSeconds=estimateTimeSeconds-(estimateTimeMinutes*60);
					estimateTime=""+estimateTimeHours+"h "+estimateTimeMinutes+"min "+estimateTimeSeconds+"sec";
				}
			}else{
				//minutes
				var estimateTimeMinutes=Math.floor(estimateTimeSeconds/60);
				estimateTimeSeconds=estimateTimeSeconds-(estimateTimeMinutes*60);
				estimateTime=""+estimateTimeMinutes+"min "+estimateTimeSeconds+"sec";
			}
		}else{
			//seconds//nochange
			estimateTime=""+estimateTimeSeconds+"sec";
		}
		document.getElementById(divid).innerHTML="Estimated time: "+estimateTime;
	},i*waittime);
}



function setTimeoutForShowAllAddedLocationsList(i,k){
	setTimeout(function(){
		var tempLocation=""+points[i-1][0]+","+points[i-1][1];
		fillSelectedLoactionsAddressesArray(tempLocation);
		var percent=""+(((i)*100)/k)+"%";
		var percentRounded=Math.round((((i)*100)/k));
		document.getElementById("loadingPanelForListOfAllPoints_progressValue").style.width=percent;
		document.getElementById("loadingPanelForListOfAllPoints_progress").setAttribute("data-label",percentRounded+"% Complete");
	},i*250);
}



function deletePointFromList(i){
	var tempArray=points;
	var tempSelectedLocationsAddressesArray=selectedLocationsAddressesArray;
	labelIndex=0;
	points=[];
	selectedLocationsAddressesArray=[];
	for(var y=0;y<tempArray.length;y++){
		if(y!=i){
			points.push(tempArray[y]);
		}
	}
	
	for(var yy=0;yy<tempSelectedLocationsAddressesArray.length;yy++){
		if(yy!=i){
			selectedLocationsAddressesArray.push(tempSelectedLocationsAddressesArray[yy]);
		}
	}
	
	var tempStringWithTr="<tr><th>Location mark</th><th>Full location address</th><th>Delete</th></tr>";
	for(var y=0;y<selectedLocationsAddressesArray.length;y++){
		tempStringWithTr+="<tr><td>"+y+"</td><td>"+selectedLocationsAddressesArray[y]+"</td><td style='text-align:center'><button type='button' class='btn btn-danger' style='width:50%' onClick='deletePointFromList("+y+");'>X</div></td></tr>";
	}
	document.getElementById("allAddedLocationsPanelTable").innerHTML=tempStringWithTr;
	var tempPointsLenght=points.length;
	latestLocation=new google.maps.LatLng(points[tempPointsLenght-1][0],points[tempPointsLenght-1][1]);
	mapOptions={zoom:14,center:latestLocation};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	for(var y=0;y<points.length;y++){
		var tempLocation=new google.maps.LatLng(points[y][0],points[y][1]);
		addMarker(tempLocation,map);
	}
	
	map.addListener("click", (mapsMouseEvent) => {
		var latt=mapsMouseEvent.latLng.lat();
		var lngg=mapsMouseEvent.latLng.lng();
		points.push([latt,lngg]);
		ends.push({
			location:new google.maps.LatLng(latt,lngg),
			stopover:true
		});
		addMarker(mapsMouseEvent.latLng,map);
	});
}



function showAllAddedLocationsList2(){
	for(var i=0;i<selectedLocationsAddressesArray.length;i++){
		document.getElementById("allAddedLocationsPanelTable").innerHTML+="<tr><td>"+i+"</td><td>"+selectedLocationsAddressesArray[i]+"</td><td style='text-align:center'><button type='button' class='btn btn-danger' style='width:50%' onClick='deletePointFromList("+i+");'>X</div></td></tr>";
	}
	document.getElementById("allAddedLocationsPanel").style.display="inline";
}



function clearMarkers() {
	marker.setMap(null);
	document.getElementById("foundLocationButtonContainer").style.display="none";
	document.getElementById("addressFoundContainer").style.display="none";
}



function geocode(request) {
	clearMarkers();
	tempFoundLocation=[];
	document.getElementById("foundLocationButtonContainer").style.display="none";
	document.getElementById("addressFoundContainer").style.display="none";
	geocoder
		.geocode(request)
		.then((result) => {
			const { results } = result;
			map.setCenter(results[0].geometry.location);
			map.setZoom(19);
	  
			marker.setPosition(results[0].geometry.location);
			marker.setMap(map);
			document.getElementById("foundLocationButtonContainer").style.display="inline";
			document.getElementById("addressFoundContainer").style.display="inline";
			document.getElementById("addressFoundContainer").innerHTML=""+result.results[0].formatted_address;
			tempFoundLocation.push(result.results[0].geometry.location.lat(),result.results[0].geometry.location.lng(),result.results[0].geometry.location);
		})
	.catch((e) => {
		alert("Location not found.")
	});
}



function permut(string) {
	if (string.length < 2) return string; // This is our break condition
	var permutations = []; // This array will hold our permutations
	for (var i = 0; i < string.length; i++) {
		var char = string[i];
		// Cause we don't want any duplicates:
		if (string.indexOf(char) != i) // if char was used already
			continue; // skip it this time
		var remainingString = string.slice(0, i) + string.slice(i + 1, string.length); //Note: you can concat Strings via '+' in JS
		for (var subPermutation of permut(remainingString))
			permutations.push(char + subPermutation)
	}
	return permutations;
}

    
	
function addMarker(location, map) {
	new google.maps.Marker({
		position: location,
		label: (""+labelIndex),
		map: map,
	});
	labelIndex++;
}



function initialize() {
	directionsDisplay = new google.maps.DirectionsRenderer();
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	directionsDisplay.setMap(map);
	map.addListener("click", (mapsMouseEvent) => {
		var latt=mapsMouseEvent.latLng.lat();
		var lngg=mapsMouseEvent.latLng.lng();
		points.push([latt,lngg]);
		ends.push({
			location:new google.maps.LatLng(latt,lngg),
			stopover:true
		});
		addMarker(mapsMouseEvent.latLng,map);
	});
	getCurrentLocation(function (loc) {
		if (loc != null) {
			map.setCenter(loc);
			map.setZoom(14);
		}
	});
}

	
	
function getCurrentLocation(complete) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			complete(location);
		}, function () {
			complete(null);
		});
	}else {
		complete(null);
	}
}	



function calcRoute() {    
	directionsArray=[];
	distancesArray=[];
	document.getElementById("result_StartLocation").innerHTML="&#160;";
	document.getElementById("result_EndLocation").innerHTML="&#160;";
	document.getElementById("result_Distance").innerHTML="&#160;";
	document.getElementById("result_Duration").innerHTML="&#160;";
	document.getElementById("detailsTable").innerHTML="<tr><th rowspan='2'>Summary</th><th>Start location</th><th>End location</th><th>Distance</th><th>Duration</th></tr><tr><td id='detailedResult_StartLocation'>&#160;</td><td id='detailedResult_EndLocation'>&#160;</td><td id='detailedResult_Distance'>&#160;</td><td id='detailedResult_Duration'>&#160;</td></tr><tr><td colspan='5'>&#160;</td></tr><tr id='tableDetailsHeader'><th>Route part</th><th>Start location</th><th>End location</th><th>Distance</th><th>Duration</th></tr>";

	var start=new google.maps.LatLng(points[0][0],points[0][1]);
	var end=new google.maps.LatLng(points[points.length-1][0],points[points.length-1][1]); 
	var end2 = [];
	var wpoints=[];
	var tempString="";
	for(var i=1;i<points.length-1;i++){
		wpoints.push({
			location: new google.maps.LatLng(points[i][0],points[i][1]),
			stopover: true,
		});
		tempString+=""+i;
	}
	end2.push({
		location: new google.maps.LatLng(37.369176, -122.036969),
		stopover: true,
	});
	var allWaypointsCombinations=permut(tempString);
	var waypointsArray=[];
	var combinationsAmmountForTime=allWaypointsCombinations.length;
	for(var i=0; i<allWaypointsCombinations.length; i++){
		var tempDirections=[];
		for(var y=0; y<allWaypointsCombinations[i].length; y++){
			var tempLat=points[allWaypointsCombinations[i][y]][0];
			var tempLng=points[allWaypointsCombinations[i][y]][1];
			tempDirections.push({
				location: new google.maps.LatLng(tempLat,tempLng),
				stopover: true,
			});
		}
		directionsArray.push(tempDirections);
	}
	estimateTimeCounter(combinationsAmmountForTime,1000,"estimatedTime");
	var directionsAndDistances=[];
	var valuesArray=[];
	document.getElementById("loadingPanel").style.display="inline";
	for(var i=0; i<=directionsArray.length; i++){
		if(i<directionsArray.length){
			calculate(i,directionsArray.length);
		}else if(i==directionsArray.length){
			finishCalculation(i,directionsArray.length);
		}
	}
    
	
	  
	function calculate(i,k){
		setTimeout(function(){
			var tempDistance=0;
			if(travelMode=="BICYCLING"){
				var tempRequest={
					origin: start,
					destination: end,
					waypoints: directionsArray[i],
					unitSystem: google.maps.UnitSystem.METRIC,
					travelMode: google.maps.TravelMode.BICYCLING
				};
			}else if(travelMode=="TRANSIT"){
				var tempRequest={
					origin: start,
					destination: end,
					waypoints: directionsArray[i],
					unitSystem: google.maps.UnitSystem.METRIC,
					travelMode: google.maps.TravelMode.TRANSIT
				};
			}else if(travelMode=="WALKING"){
				var tempRequest={
					origin: start,
					destination: end,
					waypoints: directionsArray[i],
					unitSystem: google.maps.UnitSystem.METRIC,
					travelMode: google.maps.TravelMode.WALKING
				};
			}else{
				var tempRequest={
					origin: start,
					destination: end,
					waypoints: directionsArray[i],
					unitSystem: google.maps.UnitSystem.METRIC,
					travelMode: google.maps.TravelMode.DRIVING
				};
			}
			
			directionsService.route(tempRequest, function(response, status){
				if(status==google.maps.DirectionsStatus.OK){
					for(var y=0; y<response.routes.length; y++){
						var currentDistance=0;
						for(var z=0; z<response.routes[y].legs.length; z++){
							currentDistance+=response.routes[y].legs[z].distance.value;
						}//alert(i+": "+currentDistance);
						distancesArray.push(currentDistance);
					}
				}else{
					//alert("dupa");
				}
				var percent=""+(((i+1)*100)/k)+"%";
				var percentRounded=Math.round((((i+1)*100)/k));
				document.getElementById("progressValue").style.width=percent;
				document.getElementById("progress").setAttribute("data-label",percentRounded+"% Complete");
			});
		},1000*i);
	}
	
	
	
	function finishCalculation(i,k){
		setTimeout(function(){
			var indexOfThrBestRoute=distancesArray.indexOf(Math.min.apply(null,distancesArray));
			if(indexOfThrBestRoute<0){
				indexOfThrBestRoute=0;
			}
			var directionsArrayLength=directionsArray.length;
			var bounds = new google.maps.LatLngBounds();
			bounds.extend(start);
			bounds.extend(end);
			map.fitBounds(bounds);
			
			//for googlemaps
			var gmap_origin=""+start.lat()+","+start.lng()+"";
			var gmap_destination=""+end.lat()+","+end.lng()+"";
			var gmap_waypoints="";
			var gmap_travelmode="DRIVING";
			
			if(directionsArrayLength>0){
				if(directionsArray[indexOfThrBestRoute].length>0){
					for(var t=0;t<directionsArray[indexOfThrBestRoute].length;t++){
						if(t>=0 && t<directionsArray[indexOfThrBestRoute].length){
							gmap_waypoints+=""+directionsArray[indexOfThrBestRoute][t].location.lat()+","+directionsArray[indexOfThrBestRoute][t].location.lng()+"|";
						}else if(t==directionsArray[indexOfThrBestRoute].length){
							gmap_waypoints+=""+directionsArray[indexOfThrBestRoute][t].location.lat()+","+directionsArray[indexOfThrBestRoute][t].location.lng()+"";
						}
					}
				}
			}
			var gmap_url_base="https://www.google.com/maps/dir/?api=1&";//+-
			//end for googleapis
			
			if(travelMode=="BICYCLING"){
				var request={
					origin: start,
					destination: end,
					waypoints: directionsArray[indexOfThrBestRoute],
					unitSystem: google.maps.UnitSystem.METRIC,
					travelMode: google.maps.TravelMode.BICYCLING
				};gmap_travelmode="bicycling";
			}else if(travelMode=="TRANSIT"){
				var request={
					origin: start,
					destination: end,
					waypoints: directionsArray[indexOfThrBestRoute],
					unitSystem: google.maps.UnitSystem.METRIC,
					travelMode: google.maps.TravelMode.TRANSIT
				};gmap_travelmode="transit";
			}else if(travelMode=="WALKING"){
				var request={
					origin: start,
					destination: end,
					waypoints: directionsArray[indexOfThrBestRoute],
					unitSystem: google.maps.UnitSystem.METRIC,
					travelMode: google.maps.TravelMode.WALKING
				};gmap_travelmode="walking";
			}else{
				var request={
					origin: start,
					destination: end,
					waypoints: directionsArray[indexOfThrBestRoute],
					unitSystem: google.maps.UnitSystem.METRIC,
					travelMode: google.maps.TravelMode.DRIVING
				};gmap_travelmode="driving";
			}
			var gmap_url="";//+-;
			
			if(directionsArrayLength>0){
				if(directionsArray[indexOfThrBestRoute].length>0){
					gmap_url+=""+gmap_url_base+"origin="+gmap_origin+"&waypoints="+gmap_waypoints+"&destination="+gmap_destination+"&travelmode="+gmap_travelmode+"";
				}else{
					gmap_url+=""+gmap_url_base+"origin="+gmap_origin+"&destination="+gmap_destination+"&travelmode="+gmap_travelmode+"";
				}
			}else{
					gmap_url+=""+gmap_url_base+"origin="+gmap_origin+"&destination="+gmap_destination+"&travelmode="+gmap_travelmode+"";
				}
			
			directionsService.route(request,function(response,status){
				if(status==google.maps.DirectionsStatus.OK){
					directionsDisplay.setDirections(response);
					directionsDisplay.setMap(map);
					
					//start assignment to tables
					var full_distance=0;
					var full_duration=0;
					var start_location="";
					var end_location="";
					for(var w=0; w<response.routes[0].legs.length; w++){
						full_distance+=response.routes[0].legs[w].distance.value;
						full_duration+=response.routes[0].legs[w].duration.value;
						if(w==0){
							start_location=""+response.routes[0].legs[w].start_address;
						}
						if(w==(response.routes[0].legs.length-1)){
							end_location=""+response.routes[0].legs[w].end_address;
						}
						
						//start collecting all paths
						var tempPartDistance=response.routes[0].legs[w].distance.value;
						var tempPartDuration=response.routes[0].legs[w].duration.value;
						var tempPartStartLoc=""+response.routes[0].legs[w].start_address;
						var tempPartEndLoc=""+response.routes[0].legs[w].end_address;
						
						if(tempPartDistance>=1000){
							tempPartDistance=tempPartDistance/1000;
							tempPartDistance=(Math.round(tempPartDistance * 100) / 100).toFixed(2);
							tempPartDistance=""+tempPartDistance+" km";
						}else{
							tempPartDistance=""+tempPartDistance+" m";
						}
						
						if(tempPartDuration>=3600){
							var tempPartHours=Math.floor(tempPartDuration/3600);
							var tempPartMins=Math.round(tempPartDuration-(tempPartHours*3600)*60);
							tempPartDuration=""+tempPartHours+" h "+tempPartMins+" min";
						}else{
							var tempPartMins=Math.round(tempPartDuration/60);
							tempPartDuration=""+tempPartMins+" min";
						}
						
						document.getElementById("detailsTable").innerHTML+="<tr><td>"+(w+1)+"</td><td>"+tempPartStartLoc+"</td><td>"+tempPartEndLoc+"</td><td>"+tempPartDistance+"</td><td>"+tempPartDuration+"</td></tr>";
						
						//end of collecting all paths
					}
					if(full_distance>=1000){
						full_distance=full_distance/1000;
						full_distance=(Math.round(full_distance * 100) / 100).toFixed(2);
						full_distance=""+full_distance+" km";
					}else{
						full_distance=""+full_distance+" m";
					}
					
					if(full_duration>=3600){
						var tempHours=Math.floor(full_duration/3600);
						var tempMins=Math.round(full_duration-(tempHours*3600)*60);
						full_duration=""+tempHours+" h "+tempMins+" min";
					}else{
						var tempMins=Math.round(full_duration/60);
						full_duration=""+tempMins+" min";
					}
					
					document.getElementById("result_StartLocation").innerHTML=start_location;
					document.getElementById("result_EndLocation").innerHTML=end_location;
					document.getElementById("result_Distance").innerHTML=full_distance;
					document.getElementById("result_Duration").innerHTML=full_duration;
					document.getElementById("detailedResult_StartLocation").innerHTML=start_location;
					document.getElementById("detailedResult_EndLocation").innerHTML=end_location;
					document.getElementById("detailedResult_Distance").innerHTML=full_distance;
					document.getElementById("detailedResult_Duration").innerHTML=full_duration;
					//end of assignment to tables
				}else{
				}
			});
			document.getElementById("gmap_btn").addEventListener('click',function(){window.open(gmap_url);});
			var percent=""+(((i+1)*100)/k)+"%";
			var percentRounded=Math.round((((i+1)*100)/k));
			document.getElementById("progressValue").style.width=percent;
			document.getElementById("progress").setAttribute("data-label",percentRounded+"% Complete");
			document.getElementById("loadingPanel").style.display="none";
		},1000*i);
	}
}

window.addEventListener('load', initialize);
//-----END - MAIN APPLICATION FUNCTIONS-----//