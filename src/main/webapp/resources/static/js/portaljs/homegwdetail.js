
var menuData;

$(document).ready(function() {	
	
	var query_string = location.search.substring(1);

	var parsed_qs = parse_query_string(query_string);
	
	menuData = window.menuData;
	
	for(var i = 0; i < menuData.length; i++){
	
		if(menuData[i].gwName == parsed_qs.gwName){
			
			$("#homegwDetailBody").append("<tr>" +
											"<td><a  href='"+"/home-manager-gateway-device.html?device="+ menuData[i].gwName +"' style='color:blue;' > <span>" + menuData[i].gwName + "</span></a></td>" +
											"<td><a  href='"+"/home-manager-gateway-device.html?device="+ menuData[i].gwName +"' style='color:blue;' > <span>" + menuData[i].gwName + "</span></a></td>" +
										"</tr>");
		}
	}
});

function parse_query_string(query) {
	  var vars = query.split("&");
	  var query_string = {};
	  for (var i = 0; i < vars.length; i++) {
	    var pair = vars[i].split("=");
	    // If first entry with this name
	    if (typeof query_string[pair[0]] === "undefined") {
	      query_string[pair[0]] = decodeURIComponent(pair[1]);
	      // If second entry with this name
	    } else if (typeof query_string[pair[0]] === "string") {
	      var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
	      query_string[pair[0]] = arr;
	      // If third or later entry with this name
	    } else {
	      query_string[pair[0]].push(decodeURIComponent(pair[1]));
	    }
	  }
	  return query_string;
	}