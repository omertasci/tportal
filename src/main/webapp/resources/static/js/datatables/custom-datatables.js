// Basic DataTable
$(function() {
	$('#basicExample').DataTable({
		'iDisplayLength' : 20,
	});
});

// Autofill DataTable
$(function() {
	$('#autoFill').DataTable({
		autoFill : true,
		'iDisplayLength' : 20,
	});
});

// Fixed Header DataTable
$(function() {
	var table = $('#fixedHeader').DataTable({
		fixedHeader : true,
		'iDisplayLength' : 20,
	});
});

// Responsive Table
$(function() {
	$('#responsiveTable').DataTable({
		responsive : true,
		'iDisplayLength' : 20,
	});
});

$(function() {
	$('#scrollTable').DataTable({
		"scrollY" : "200px",
		"scrollCollapse" : true,
		"paging" : false,
		'iDisplayLength' : 20,
	});
});

var obj = [ {
	"name" : "Ali",
	"age" : "21",
	"city" : "Istanbul"
}, {
	"name" : "Mehmet",
	"age" : "25",
	"city" : "Ankara"
} ];

$(function() {
	$('#copy-print-csv').DataTable({
		dom : 'Bfrtip',
		buttons : [ 'copy', 'csv', 'excel', 'pdf', 'print' ],
		"aaData" : childs,
		"aoColumns" : [ {
			"mDataProp" : "rn"
		}, {
			"mDataProp" : "ty"
		}, {
			"mDataProp" : "value"
		} ]
	});
});
