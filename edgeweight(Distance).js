//load Data and assign attributes
var dataRequest = $.getJSON("output.json").done(function(){
	assignData();
});


function assignData(){
	//Request and store data
	var data = $.parseJSON(dataRequest.responseText);
	
	var outputData = {};
	
	var i = 0;

	//Request for distance and time values for all 4079 edges
	while(i < 4079) {
		var obj = data[i];
		
		//Prepare URL for http request to Google API
		theUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + obj.lat_A + "," + obj.long_A + "&destinations="  + obj.lat_B + "," + obj.long_B + "&key=AIzaSyBNhpH4Vv522sUArpUabRbcRte9sg2J7m0"
		
		
		
		//Since google limits daily requests to 2500, change API key after 2000 requests
		if(i > 2000){
			theUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + obj.lat_A + "," + obj.long_A + "&destinations="  + obj.lat_B + "," + obj.long_B + "&key=AIzaSyA6RFQLUjkXPm6oya9KYmvFhsB2nCHi1xM"
		}
		
		//Make request and process response
		var result = $.parseJSON(httpGet(theUrl));
		
		//if(!result.rows[0].elements[0].distance.value && !result.rows[0].elements[0].duration.value){
			obj.distance = result.rows[0].elements[0].distance.value //distance value in metres
			obj.time = result.rows[0].elements[0].duration.value //time value in seconds
		//}
		
		outputData[i] = obj;
		console.log("Done with " + i);
		
		i++;
	}
	
	$('.json').text(JSON.stringify(outputData));
	//console.log(outputData); 
}


function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

