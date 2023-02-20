//MAIN CODE
//Settings
var server = "http://localhost:7474/";
//getShortestPath("S6117", "S5382");
//var routename = $.parseJSON(getRoute('139B'));
//console.log(routename.data[0][0]);





				
//FUNCTIONS

//Main function to get shortest path between two stops given a routing policy
function getShortestPath(start_id, dest_id, policy){
	var finalResultArray = [];
	
	//1. If start and destnation are equal no need to route
	if(start_id==dest_id){
		var resultSummaryString = "<div class='oops'><img src='images/oops.png' class='img-responsive' alt=''><p class='title'>You're already at your destination.</p></div>";
		
		finalResultArray.push(resultSummaryString);
		startResult = $.parseJSON(getNode(start_id));
		
		//Create cordinate object using google maps latlng object
		var stopCordinate = new google.maps.LatLng(parseFloat(startResult.data[0][0].data.stop_lat), parseFloat(startResult.data[0][0].data.stop_long));
		finalResultArray.push(stopCordinate);
		return finalResultArray;
	}

	
	
	//2.
	var startResult = $.parseJSON(getNode(start_id));
	var destResult = $.parseJSON(getNode(dest_id));
//	
//	
//	var sharedRoutes = findSharedRoute(startResult, destResult);
//	
//	
//	
//	if(sharedRoutes.length != 0){
//		//use results of shared route
//		for(i=0; i < sharedRoutes.length; i ++)
//			console.log("Take Bus " +sharedRoutes[i] + ". Drop at " + destResult.data[0][0].data.stop_name);
//		return;
//	}
	
	
	
	//3.
	if(startResult.data[0][0].metadata.id != null && destResult.data[0][0].metadata.id != null){
		var startNode_id = startResult.data[0][0].metadata.id;
		var destNode_id = destResult.data[0][0].metadata.id;
		
		
		var result = $.parseJSON(dijkstra(startNode_id, destNode_id, policy));

		
		var json = '{"NEO4J_USERNAME": "neo4j", "NEO4J_PASSWORD" : "admin"}';
		json = $.parseJSON(json);
		
		
		var shorternedResult = [];
		
		var i = result["length"];
		var currentStartPoint = startResult;
		var currentStartPointIndex = 0;
		
		
		//Create list of cordinates from thr result
		//Minimise tranfers by findind shared routes between two stops that do not follow each other in
		//the dijkstra result and skip all intermediate stops between them.
		var cordinates = [];
		var stopCordinate = new google.maps.LatLng(parseFloat(currentStartPoint.data[0][0].data.stop_lat), parseFloat(currentStartPoint.data[0][0].data.stop_long));
		
		cordinates.push(stopCordinate.toJSON());
		
		//console.log(result);
		
		for(i; i > currentStartPointIndex; i--){			
			//Extract node metadata id from results of Dijkstra's algo
			var currentNodeID = parseInt(result.nodes[i].substr(result.nodes[i].length - 5));
			var currentNode = $.parseJSON(getNodeUsingMetaID(currentNodeID));
			
			//Check for a shared route between two stops in the dijkstra result
			var sharedRoutes = findSharedRoute(currentStartPoint, currentNode);
			
			
			//if two stops share a route(s) add the first, the route(s) and the second stop
			//set current position to the other stop so that all intermediate stops are skipped
			if(sharedRoutes.length != 0){
				shorternedResult.push(currentStartPoint.data[0][0].data.stop_name)
				shorternedResult.push(sharedRoutes);
				shorternedResult.push(currentNode.data[0][0].data.stop_name);
				
				stopCordinate = new google.maps.LatLng(parseFloat(currentNode.data[0][0].data.stop_lat), parseFloat(currentNode.data[0][0].data.stop_long));
				cordinates.push(stopCordinate.toJSON());
				
				currentStartPointIndex = i;
				currentStartPoint = currentNode;
				
				//Set index i to length + 1 so that the update statement in the 'for' clause decreases it to the right number
				i = result["length"]+1;
			}
				
			
			
		}
		
		
		
		
		
		//Preparing all cordinates		
//		var i = 0;
//		var cordinates = [];
//		while(i < result.nodes.length){
//			//console.log(result.nodes[i], json);
//			var pathNode = $.parseJSON(httpGet(result.nodes[i], json));
//			//cordinates.push("{lat: " + parseFloat(pathNode.data.stop_lat) + ", lng: " + parseFloat(pathNode.data.stop_long) + "}");
//			var stopCordinate = new google.maps.LatLng(parseFloat(pathNode.data.stop_lat), parseFloat(pathNode.data.stop_long));
//			cordinates.push(stopCordinate.toJSON());
//			i++;
//		}
		//console.log(cordinates);
		
		
		
		//Getting total journey distance
		var totalWeight = result.weight;
		var unit = "km";
		
		if(policy == "time"){
			totalWeight = totalWeight/60;
			unit = "min";
			
		}else{
			totalWeight = totalWeight/1000;
		}
		
		
		
		totalWeight = Math.round(totalWeight * 10)/10;
		
		//console.log(result);
		var routename = $.parseJSON(getRoute(shorternedResult[1][0]));
		
		//HTML string for result's summary
		var resultSummaryString = "<div class='route-summary'><p class='title'>"+ totalWeight + " "+unit+" journey</p><p class='first-action'>";
		resultSummaryString += "Take a tro-tro headed to "+ routename.data[0][0] + "</p><img src='images/more.png' class='more-link' alt='' onclick='expandRoute()'><div class='route-tags'>";
		
		//HTML string for all step-by-step instructions
		var allInstructions = "";
		
		i = 0;
		j=1;
		//Only pick out routes
		//console.log(shorternedResult);
		
		
		while(i < shorternedResult.length){
			if(Array.isArray(shorternedResult[i])){
				routename = $.parseJSON(getRoute(shorternedResult[i][0]));
				resultSummaryString +=	"<p class='rt"+ j +"'>" + routename.data[0][0] +"</p>";
			
				allInstructions += "<div class='instruction'><p>Take a tro-tro headed to " + routename.data[0][0] +" <br> Drop off at " + shorternedResult[i+1];
				allInstructions += "</p><p class='rt"+ j +" tag'>" + routename.data[0][0] +"</p><a href='#'>Details</a></div>";
				allInstructions += "<div class='clearfix select-clearfix instruction-clearfix'></div>";
				j++;
			}				
				
			i++;
		}
	
		resultSummaryString += "</div></div>";
		
		
		
		
	}
	
	resultSummaryString += "<div class='clearfix select-clearfix'></div>";
	
	resultSummaryString += " " + allInstructions;
	
	//Prepare result array by adding html string (for summary & expanded instructions), all cordinates,
	//Total computed weight and shortened route result with minimised transfers
	finalResultArray.push(resultSummaryString);
	finalResultArray.push(cordinates);
	finalResultArray.push(totalWeight);
	finalResultArray.push(shorternedResult.length);
	
	return finalResultArray;
		 
}


function findSharedRoute(start, dest){
	var routesFromStart = start.data[0][0].data.out_route;
	var routesToDest = dest.data[0][0].data.in_route;
	
	
	
	var result = [];
	
	for(i = 0; i < routesFromStart.length; i++){
		for(j = 0; j < routesToDest.length; j++){
			if(routesFromStart[i]==routesToDest[j])
				result.push(routesFromStart[i]);
		}
		
	}
	
	//console.log(result);
	return result;
}

//Function to run cypher query to get all information about node give its stop id
function getNode(id){
	theUrl = server + "db/data/cypher";
    
	var json = '{"query" : "MATCH (n:Stop) WHERE n.id = {id} RETURN n","params" : {"id" : "' + id +'"}}';
	json = $.parseJSON(json);
	
    return httpPost(theUrl, json);
}


//Function to return last stop for a given route id
function getRoute(id){
	theUrl = server + "db/data/cypher";
    
	var json = '{"query" : "MATCH p=()-[r:IS_CONNECTED_TO]->() WHERE r.route = {id} RETURN r.to_terminal LIMIT 1","params" : {"id" : "' + id +'"}}';
	json = $.parseJSON(json);
	
    return httpPost(theUrl, json);
}

//Function to return the data on a node given its metadata id in the database
function getNodeUsingMetaID(id){
	theUrl = server + "db/data/cypher";
    
	var json = '{"query" : "MATCH (n:Stop) WHERE id(n) = {id} RETURN n","params" : {"id" : ' + id +'}}';
	json = $.parseJSON(json);
	
    return httpPost(theUrl, json);
}


//Resful API call to compute the shortest path using dijkstra's algorithm
function dijkstra(start, dest, policy){
	var pathUrl = server + "db/data/node/"+ start +"/path";
	
	
	var json = '{"to" : "http://localhost:7474/db/data/node/' + dest +'","cost_property" : "'+ policy +'","relationships" : {"type" : "IS_CONNECTED_TO","direction" : "out"},"algorithm" : "dijkstra"}';
	json = $.parseJSON(json);
	
	return httpPost(pathUrl, json);
	
}

//HTTP post function
function httpPost(theUrl, jsonData){
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", theUrl, false, 'neo4j', "admin"); // false for synchronous request
	xmlHttp.setRequestHeader('Content-Type', 'application/json');
	
	//Add authorization header wih encoded user&password
	var basic = "Basic " + btoa("neo4j:admin");
	xmlHttp.setRequestHeader('Authorization',basic);
	
	
	var data = JSON.stringify(jsonData);
    xmlHttp.send(data);
	
	
    return xmlHttp.responseText;
	
}


//HTTP get function
function httpGet(theUrl, jsonData){
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false,"neo4j", "admin"); // false for synchronous request
	xmlHttp.setRequestHeader('Content-Type', 'application/json');
	
	//Add authorization header wih encoded user&password
	var basic = "Basic " + btoa("neo4j:admin");
	xmlHttp.setRequestHeader('Authorization',basic);
	
	var data = JSON.stringify(jsonData);
    xmlHttp.send(data);
	
    return xmlHttp.responseText;
}


//Search database for all nodes that start with or contain the search keyword
function dbSearch(keyword){
	theUrl = server + "db/data/cypher";

	
	var json = '{"query" : "MATCH (n:Stop) WHERE LOWER(n.stop_name) STARTS WITH LOWER({searchWord}) RETURN n.stop_name, n.id ORDER BY n.stop_name ASC LIMIT 10 UNION MATCH (n:Stop) WHERE LOWER(n.stop_name) CONTAINS LOWER({searchWord}) RETURN n.stop_name, n.id ORDER BY n.stop_name ASC LIMIT 10","params" :{"searchWord" : "' + keyword +'"}}';
	
//	if(keyword.charAt(0) == keyword.toLowerCase().charAt(0)){
//		json = '{"query" : "MATCH (n:Stop) WHERE n.stop_name STARTS WITH {searchWord} RETURN n.stop_name, n.id ORDER BY n.stop_name ASC UNION MATCH (n:Stop) WHERE n.stop_name CONTAINS {searchWord} RETURN n.stop_name, n.id ORDER BY n.stop_name ASC","params" : {"searchWord" : "' + keyword +'"}}';
//	}
	
	
	json = $.parseJSON(json);
	return httpPost(theUrl, json);
}