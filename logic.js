var chicago = new google.maps.LatLng(49.944630, 18.597937);
var mapOptions = {
	zoom: 14,
	center: chicago
};
var tempFoundLocation=[];
let labelIndex = 0;
var selectedLocationsAddressesArray=[];


function fillSelectedLoactionsAddressesArray(location) {
	var request={address:location};
	geocoder
	.geocode(request)
    .then((result) => {
		var address=result.results[0].formatted_address;
		selectedLocationsAddressesArray.push(address);
    })
    .catch((e) => {
		//alert("Geocode was not successful for the following reason: " + e);
    });
}


function showAllAddedLocationsList(){
	selectedLocationsAddressesArray=[];
	document.getElementById("allAddedLocationsPanelTable").innerHTML="<tr><th>Location mark</th><th>Full ocation address</th><th>Delete</th></tr>";
	for(var i=1;i<=points.length;i++){
		setTimeoutForShowAllAddedLocationsList(i);
	}
	setTimeout(function(){
		//alert("hej");
		showAllAddedLocationsList2();
	},(points.length*250)+250);
	//showAllAddedLocationsList2();
}


function setTimeoutForShowAllAddedLocationsList(i){
	setTimeout(function(){
		//console.log(points[i-1]);
		//console.log(i);
		var tempLocation=""+points[i-1][0]+","+points[i-1][1];
		fillSelectedLoactionsAddressesArray(tempLocation);
	},i*250);
}


function deletePointFromList(i){
	//alert("Do you want to delete point "+i+"?");
	var tempArray=points;
	labelIndex=0;
	points=[];
	for(var y=0;y<tempArray.length;y++){
		if(y!=i){
			points.push(tempArray[y]);
		}
	}
	//resetMap();
	//initialize();
	var tempPointsLenght=points.length;
	latestLocation=new google.maps.LatLng(points[tempPointsLenght-1][0],points[tempPointsLenght-1][1]);
	mapOptions={zoom:14,center:latestLocation};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	for(var y=0;y<points.length;y++){
		//var tempLocation={points[y][0]+","+points[y][1]};
		var tempLocation=new google.maps.LatLng(points[y][0],points[y][1]);
		//alert(tempLocation);
		addMarker(tempLocation,map);
		//alert("added");
	}
}


function refreshPointsOnMap(){
	for(var i=0;i<points.length;i++){
		
	}
}


function showAllAddedLocationsList2(){
	for(var i=0;i<selectedLocationsAddressesArray.length;i++){
		document.getElementById("allAddedLocationsPanelTable").innerHTML+="<tr><td>"+i+"</td><td>"+selectedLocationsAddressesArray[i]+"</td><td style='text-align:center'><button type='button' class='btn btn-danger' style='width:50%' onClick='deletePointFromList("+i+");'>X</div></td></tr>";
		//alert(selectedLocationsAddressesArray[i]);
	}
	document.getElementById("allAddedLocationsPanel").style.display="inline";
}


function allAddedLocationsPanelCloseButtonAction(){
	//document.gallAddedLocationsButton
	document.getElementById("allAddedLocationsPanel").style.display="none";
}


function saveAsPDF(){
	var win = window.open('', '');
	win.document.write("<table border='1' style='width:100%;'>");
	win.document.write(document.getElementById("detailsTable").innerHTML);
	win.document.write("</table>");
	win.document.close();
	win.print();    // PRINT THE CONTENTS.
	win.close();
}


function shareViaEmail(){
	var tableContent = ""+document.getElementById("panelWithDetailsTable").innerHTML+"";
	alert(tableContent);
	//window.location.href = "mailto:"+email+"?subject="+subject+"&body="+mBody;
	//window.location.href = "mailto:<enter email>?subject=<enter subject>&body="+tableContent;
}


function detailsPanelCloseButtonAction(){
	document.getElementById("panelWithDetails").style.display="none";
}


function detailsPanelOpenButtonAction(){
	document.getElementById("panelWithDetails").style.display="inline";
}


geocoder = new google.maps.Geocoder();
marker = new google.maps.Marker({map,});


function clearMarkers(){
	marker.setMap(null);
	document.getElementById("foundLocationButtonContainer").style.display="none";
	document.getElementById("addressFoundContainer").style.display="none";
}


function geocode(request){
	clearMarkers();
	tempFoundLocation=[];
	document.getElementById("foundLocationButtonContainer").style.display="none";
	document.getElementById("addressFoundContainer").style.display="none";
	geocoder
	.geocode(request)
    .then((result) => {
		const { results } = result;
		console.log(result.results[0]);
		//alert(result.results[0].formatted_address);
		map.setCenter(results[0].geometry.location);
		map.setZoom(19);
	  
		marker.setPosition(results[0].geometry.location);
		marker.setMap(map);
		//responseDiv.style.display = "block";
		//response.innerText = JSON.stringify(result, null, 2);
		document.getElementById("foundLocationButtonContainer").style.display="inline";
		document.getElementById("addressFoundContainer").style.display="inline";
		document.getElementById("addressFoundContainer").innerHTML=""+result.results[0].formatted_address;
		tempFoundLocation.push(result.results[0].geometry.location.lat(),result.results[0].geometry.location.lng(),result.results[0].geometry.location);
		//return results;
		//return tempFoundLocation[0];
		//console.log(tempFoundLocation);
		//alert(tempFoundLocation);
    })
    .catch((e) => {
		//alert("Geocode was not successful for the following reason: " + e);
    });
}


function geocodeButton(){
	var locationText=prompt("Enter your detailed address here\nlike: \"ul. Mickiewicza 49, Warsaw, Poland\"");
	console.log("Nowy wpis:");
	geocode({address: locationText});
}


function addFoundLocation(){
	clearMarkers();
	points.push([tempFoundLocation[0],tempFoundLocation[1]]);
	addMarker(tempFoundLocation[2],map);
	//var locat
	alert("Location has been added!");
}


var distancesArray=[];
var ends=[];
var points=[];
var directionsArray=[];


function resetMap(){
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
}


var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
	var directionsService2 = new google.maps.DirectionsService();
    var map;
	//const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


function permut(string){
	if (string.length < 2) return string; // This is our break condition

	var permutations = []; // This array will hold our permutations
	for(var i = 0; i < string.length; i++){
		var char = string[i];

		// Cause we don't want any duplicates:
		if (string.indexOf(char) != i) // if char was used already
			continue; // skip it this time

		var remainingString = string.slice(0, i) + string.slice(i + 1, string.length); //Note: you can concat Strings via '+' in JS

		for(var subPermutation of permut(remainingString))
		  permutations.push(char + subPermutation)
	}
	return permutations;
}

	
function addMarker(location, map){
	new google.maps.Marker({
		position: location,
		//label: labels[labelIndex++ % labels.length],
		label: (""+labelIndex),
		map: map,
	});
	labelIndex++;
}


function initialize(){
	directionsDisplay = new google.maps.DirectionsRenderer();
	//var chicago = new google.maps.LatLng(37.334818, -121.884886);
	//var mapOptions = {
	//    zoom: 7,
	//    center: chicago
	//};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	directionsDisplay.setMap(map);
	google.maps.event.addDomListener(document.getElementById('routebtn'), 'click', calcRoute);

	map.addListener("click", (mapsMouseEvent) => {
		//let infoWindow = new google.maps.InfoWindow({
		//	position: mapsMouseEvent.latLng,
		//});
		var latt=mapsMouseEvent.latLng.lat();
		var lngg=mapsMouseEvent.latLng.lng();
		points.push([latt,lngg]);
		ends.push({
			location:new google.maps.LatLng(latt,lngg),
			stopover:true
		});
		//infoWindow.setContent(
		//	JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
		//);
		//infoWindow.open(map);
			
		addMarker(mapsMouseEvent.latLng,map);
	});
	
	getCurrentLocation(function (loc){
		if(loc != null) {
			map.setCenter(loc);
			map.setZoom(14);
		}
	});
}


function getCurrentLocation(complete){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function (position){
			var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			complete(location);
		}, function () {
			complete(null);
			});
	}else{
		complete(null);
	}
}	


function calcRoute(){	
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
	  
	//for(var i=0; i<allWaypointsCombinations.length; i++){
	//	allWaypointsCombinations[i]=""+0+allWaypointsCombinations[i]+""+(points.length-1);
	//}
	  
	console.log("TO");
	console.log(allWaypointsCombinations);
	  
	for(var i=0; i<allWaypointsCombinations.length; i++){
		var tempDirections=[];
		for(var y=0; y<allWaypointsCombinations[i].length; y++){
			var tempLat=points[allWaypointsCombinations[i][y]][0];
			var tempLng=points[allWaypointsCombinations[i][y]][1];
			tempDirections.push({
				//location: tempLat+","+tempLng,
				location: new google.maps.LatLng(tempLat,tempLng),
				stopover: true,
			});
		}
		directionsArray.push(tempDirections);
	}
	  
	console.log("DirectionsArray:");
	console.log(directionsArray);
	  
	var directionsAndDistances=[];
	var valuesArray=[];//
	    
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
			var tempRequest={
				origin: start,
				destination: end,
				waypoints: directionsArray[i],
				unitSystem: google.maps.UnitSystem.METRIC,
				travelMode: google.maps.TravelMode.DRIVING
			};
			
			directionsService.route(tempRequest, function(response, status){
				if(status==google.maps.DirectionsStatus.OK){
					//alert("yeah");
					for(var y=0; y<response.routes.length; y++){
						var currentDistance=0;
						for(var z=0; z<response.routes[y].legs.length; z++){
							//alert(response.routes[y].legs[z].distance.value);
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
			//alert("Finished, your all distances are: "+distancesArray);
			var indexOfThrBestRoute=distancesArray.indexOf(Math.min.apply(null,distancesArray));
			//alert(indexOfThrBestRoute);
			
			var bounds = new google.maps.LatLngBounds();
			bounds.extend(start);
			bounds.extend(end);
			map.fitBounds(bounds);
			
			var request={
				origin: start,
				destination: end,
				waypoints: directionsArray[indexOfThrBestRoute],
				unitSystem: google.maps.UnitSystem.METRIC,
				travelMode: google.maps.TravelMode.DRIVING
			};
			
			directionsService.route(request,function(response,status){
				if(status==google.maps.DirectionsStatus.OK){
					directionsDisplay.setDirections(response);
					directionsDisplay.setMap(map);
					console.log("Final route is:");
					console.log(response);
					
					//realizacja przypisania do tabel
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
						
						//gromadzenie wszystkich sciezek
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
						
						//koniec gromadzenia wszystkich sciezek
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
					//koniec realizacji przypisania do tabel
				}else{
					//alert("no i no");
				}
			});
			var percent=""+(((i+1)*100)/k)+"%";
			var percentRounded=Math.round((((i+1)*100)/k));
			document.getElementById("progressValue").style.width=percent;
			document.getElementById("progress").setAttribute("data-label",percentRounded+"% Complete");
			document.getElementById("loadingPanel").style.display="none";
		},1000*i);
	}
	  
	  
	//setTimeout(function(){
		//alert(distancesArray);
	//}, 2000);
	  
	//
	/*
	  
	var bounds = new google.maps.LatLngBounds();
	bounds.extend(start);
	bounds.extend(end);
	map.fitBounds(bounds);
	var request = {
		origin: start,
		destination: end,
		waypoints: wpoints,
		unitSystem: google.maps.UnitSystem.METRIC,
		travelMode: google.maps.TravelMode.DRIVING
	};
	directionsService.route(request, function (response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
			directionsDisplay.setMap(map);
				
			for(var i=0; i<response.routes.length; i++){
				for(var j=0; j<response.routes[i].legs.length; j++){
					console.log(response.routes[i].legs[j].distance.value)
				}
			}
			
			console.log(points);	
		}else{
			alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
		}
	});
		
	*/
	//	
}
google.maps.event.addDomListener(window, 'load', initialize);