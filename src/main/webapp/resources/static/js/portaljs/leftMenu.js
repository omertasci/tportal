var parsed_qs;

$(document).ready(function() {
	changeActiveMenu();
});

function prepareHtmlObjects(query) {

	var query_string = location.search.substring(1);

	parsed_qs = parse_query_string(query_string);

}

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
			var arr = [ query_string[pair[0]], decodeURIComponent(pair[1]) ];
			query_string[pair[0]] = arr;
			// If third or later entry with this name
		} else {
			query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
	}
	return query_string;
}

function changeActiveMenu() {

	var elementid = location.pathname.substring(1) + location.search;
	var currentSpan = document.createElement('span');
	currentSpan.className = 'current-page active highlight';

	if (document.getElementById(elementid) != null) {
		document.getElementById(elementid).appendChild(currentSpan);

		if (document.getElementById(elementid).parentElement.className == "has-no-sub") {
			document.getElementById(elementid).parentElement.className = 'active highlight';
		} else {
			document.getElementById(elementid).parentElement.parentElement.style.display = 'block';
			document.getElementById(elementid).parentElement.parentElement.parentElement.className = 'has-sub active highlight';
			document.getElementById(elementid).className = "select";
		}
	}

}
