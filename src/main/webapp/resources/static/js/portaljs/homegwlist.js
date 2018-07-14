
var menuData;

$(document).ready(function() {	
	
	menuData = window.menuData;
	childs = window.childs;
	
	for(var i = 0; i < childs.length; i++){
	$("#homegwlistBody").append("<tr>" +
									"<td><a  href='"+"/home-manager-gateway-detail.html?gwName="+ childs[i].rn +"' style='color:blue;' > <span>" + childs[i].rn + "</span></a></td>" +
									"<td><a  href='"+"/home-manager-gateway-detail.html?gwName="+ childs[i].rn +"' style='color:blue;' > <span>" + childs[i].rn+ "</span></a></td>" +
								"</tr>");
	}
});