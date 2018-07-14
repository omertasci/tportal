var menuData;
var parsed_qs;
var ctxPath = getContextPath();
var invalidURL=false;
var stateArray;

$(document).ready(function() {

	prepareHtmlObjects();

	$.ajax({
		type : "GET",
		url : ctxPath + "/device.html/ajax?operation=fetchReports&rn=" + parsed_qs.rn,

		contentType : "application/json; charset=utf-8",
		beforeSend : function() {
		},
		headers : {
			"Accept" : "application/json"
		},
		success : function(data) {

			resource = JSON.parse(data);
			loadReportsData(resource, 30);
		},
		error : function(e) {
			console.log("ERROR: ", e);
		}
	});
	
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		  var target = $(e.target).attr("href") // activated tab
			if(target.indexOf("lastStates") !== -1){
			
			$
					.ajax({
						type : "GET",
						url : ctxPath + "/device.html/ajax?operation=lastStates",

						contentType : "application/json; charset=utf-8",
						beforeSend : function() {
						},
						headers : {
							"Accept" : "application/json"
						},
						success : function(data) {
							stateArray = new Array();
							 console.log(data);
							 if(data.model!=null){
								    
								   for (i = 0; i < data.model.dataList.length; i++) {
									 var dataObj={};
									 dataObj.ct = data.model.dataList[i].ct;
									 dataObj.type = data.model.dataList[i].type;
									 dataObj.location = data.model.dataList[i].location;
									 dataObj.lampId = data.model.dataList[i].lampId;
									 dataObj.state = data.model.dataList[i].state;
									 dataObj.dimLevel = data.model.dataList[i].dimLevel;
									 stateArray.push(dataObj);
								   }
								   $('#lastStates').DataTable().destroy();
								   
								   $('#lastStates').DataTable({
										dom : 'Bfrtip',
										buttons : [ 'copy', 'csv', 'excel', 'pdf', 'print' ],
										"aaData" : stateArray,
										"aoColumns" : [ {
											"mDataProp" : "ct"
										}, {
											"mDataProp" : "type"
										}, {
											"mDataProp" : "lampId"
										}, {
											"mDataProp" : "state"
										}, {
											"mDataProp" : "dimLevel"
										}, {
											"mDataProp" : "location"
										}     ]
									});									    
							 }
							
						},
						error : function(e) {
							console.log("ERROR: ", e);
						}
					});
			}else{
				
			}
		 
		});

// loadReportDataByDuration(3, 30);

	// loadHighChart2();
});

function loadReportsData(data, durationOpt) {
	if (typeof data.model.report_0 !== "undefined") {
		console.log("something is TODO");
	}
	if (typeof data.model.report_1 !== "undefined") {
		console.log("something is TODO");
	}
	if (typeof data.model.report_2 !== "undefined") {
		console.log("something is TODO");
	}
	if (typeof data.model.report_3 !== "undefined") {
		console.log("something is TODO");
		loadConsumptionGraph(data.model.report_3, durationOpt);
	}
	if (typeof data.model.report_4 !== "undefined") {
        console.log("loading device dim level graph");
        loadDimLevelGraph(data.model.report_4);
	}
	if (typeof data.model.report_5 !== "undefined") {
		//
		// var numberOfDevices = document.getElementById("numberOfDevices");
		// numberOfDevices.innerHTML = data.model.report_5[0].value1;
	}
	if (typeof data.model.report_6 !== "undefined") {

		// var numberOfGWs = document.getElementById("numberOfGWs");
		// numberOfGWs.innerHTML = data.model.report_6[0].value1;
	}

}

function loadDimLevelGraph( data ){

	var dimLevel_0 = 0;
	var dimLevel_1 = 0;
	var dimLevel_2 = 0;
	var dimLevel_3 = 0;
	var dimLevel_4 = 0;
	var dimLevel_5 = 0;
	var dimLevel_6 = 0;
	var dimLevel_7 = 0;
	var dimLevel_8 = 0;
	var dimLevel_9 = 0;
	var dimLevel_10 = 0;

	for(i=0; i< data.length; i++){
		if(data[i].value1 == "0"){
			dimLevel_0 += parseInt(data[i].value0);
		}
		if(data[i].value1 == "1"){
			dimLevel_1 += parseInt(data[i].value0);
		}
		if(data[i].value1 == "2"){
			dimLevel_2 += parseInt(data[i].value0);
		}
		if(data[i].value1 == "3"){
			dimLevel_3 += parseInt(data[i].value0);
		}
		if(data[i].value1 == "4"){
			dimLevel_4 += parseInt(data[i].value0);
		}
		if(data[i].value1 == "5"){
			dimLevel_5 += parseInt(data[i].value0);
		}
		if(data[i].value1 == "6"){
			dimLevel_6 += parseInt(data[i].value0);
		}
		if(data[i].value1 == "7"){
			dimLevel_7 += parseInt(data[i].value0);
		}
		if(data[i].value1 == "8"){
			dimLevel_8 += parseInt(data[i].value0);
		}
		if(data[i].value1 == "9"){
			dimLevel_9 += parseInt(data[i].value0);
		}
		if(data[i].value1 == "10"){
			dimLevel_10 += parseInt(data[i].value0);
		}
	}

	var dataarr = new Array();
	dataarr.push(dimLevel_0);
	dataarr.push(dimLevel_1);
	dataarr.push(dimLevel_2);
	dataarr.push(dimLevel_3);
	dataarr.push(dimLevel_4);
	dataarr.push(dimLevel_5);
	dataarr.push(dimLevel_6);
	dataarr.push(dimLevel_7);
	dataarr.push(dimLevel_8);
	dataarr.push(dimLevel_9);
	dataarr.push(dimLevel_10);

	var columnData = [ [ 'data1' ].concat(dataarr) ];

	var chart7 = c3.generate({
		bindto : '#stackedBarGraph',
		data : {
			columns : columnData,

			type : 'bar',
			names : {
				data1 : 'Dim Levels',
			// data2: 'LinkedIn',
			// data3: 'Facebook',
			},
			colors : {
				data1 : '#1d73bd',
			// data2: '#E24B46',
			// data3: '#dddddd',
			},
			groups : [ [ 'data1' ] ]
		},
		axis : {
			x : {
				type : 'category',
				categories : [ '%0', '%10', '%20', '%30', '%40', '%50', '%60', '%70', '%80', '%90', '%100' ]
			}
		},
		grid : {
			x : {
				show : true,
			},
			y : {
				show : true
			}
		}
	});
}

function loadReportDataByDuration(rprtId, durationOpt) {

	$.ajax({
		type : "GET",
		url : ctxPath + "/device.html/ajax?operation=fetchReportDataByDuration&rn="
				+ parsed_qs.rn + "&ri=" + parsed_qs.ri + "&rprtId=" + rprtId
				+ "&duration=" + durationOpt,

		contentType : "application/json; charset=utf-8",
		beforeSend : function() {
		},
		headers : {
			"Accept" : "application/json"
		},
		success : function(data) {

			resource = JSON.parse(data);
			loadReportsData(resource, durationOpt);
		},
		error : function(e) {
			console.log("ERROR: ", e);
		}
	});
}

function loadConsumptionGraph(data, durationOpt) {

	var chartTheme = getTheme("DarkUnica");
	
	var xVals = new Array();
	var tempDate = data[0].startDate;

	while (tempDate <= data[0].endDate) {

		xVals.push(tempDate);
		tempDate = getDateAfterStartDate(tempDate, 1);
	}
	var dataarr = new Array();
	for (i = 0; i < xVals.length; i++) {
		
			var tmpObj = data.filter(e => e.value2 == xVals[i]);
			
			if (tmpObj.length > 0 ) {

				dataarr.push(parseInt(tmpObj[0].value1));
			}
			else {
				dataarr.push(parseInt("0"));
			}		
	}	

	var serieName = [ 'LAMP' ];

	// var columnData = [ [ 'x' ].concat(xVals), [ 'data1' ].concat(data1) ];

	var xAxisData = {};
	xAxisData['categories'] = xVals;

	var columnDataHC = {};
	columnDataHC['name'] = serieName;
	columnDataHC['data'] = dataarr;

	var titleText = 'Last';

	if (durationOpt == '1') {
		titleText += ' 1 Day';
	} else {
		titleText += ' ' + durationOpt + ' Days';
	}

	var options = {
		title : {
			text : titleText,
			x : -20
		// center
		},
		subtitle : {
			text : 'Source:Triote IoT Platform',
			x : -20
		},
		xAxis : xAxisData,
		yAxis : {
			title : {
				text : 'Consumption (Watt)'
			},
			plotLines : [ {
				value : 0,
				width : 1,
				color : '#808080'
			} ]
		},
		tooltip : {
			crosshairs : true,
			shared : true,
			valueSuffix : ' W'
		},
		legend : {
			layout : 'vertical',
			align : 'right',
			verticalAlign : 'middle',
			borderWidth : 0
		},
		series : [ columnDataHC ]
	};

	$(function() {
		Highcharts
				.wrap(
						Highcharts.Chart.prototype,
						'getContainer',
						function(proceed) {
							proceed.call(this);
							this.container.style.background = 'url(http://www.highcharts.com/samples/graphics/sand.png)';
						});
	});

	$('#container').highcharts(Highcharts.merge(options, chartTheme));

}

function doOperation(opName, opHref, isControl, groupOpName) {

	// console.log(opName + opHref);

	var stateArr = [ 'OFF', 'ON', 'ERROR' ];
	var dimLevelArr = [ '0%', '20%', '40%', '60%', '80%', '100%' ];

	$
			.ajax({
				type : "GET",
				url : ctxPath + "/device.html/ajax?operation=doOperationOnClick&opName="
						+ opName + "&opHref=" + opHref + "&isControl="
						+ isControl + "&groupOpName="
						+ groupOpName, /* "/in-cse/in-name" */

				contentType : "application/json; charset=utf-8",
				beforeSend : function() {
				},
				headers : {
					"Accept" : "application/json"
				},

				success : function(response) {
					// console.log("SUCCESS: ");
					// console.log(response);
					var getStateMsg = "";
					if (response.model.getState.length >= 0) {
						getStateMsg = JSON.stringify(response.model.getState);
					}
					// alertify.success(getStateMsg);
					var displayText = "";
					for (i = 0; i < response.model.getState.length; i++) {

						if (response.model.getState[i].name == "dimLevel") {

							displayText += response.model.getState[i].name
									+ " : "
									+ dimLevelArr[parseInt(response.model.getState[i].val)];
						} else if (response.model.getState[i].name == "state") {

							displayText += response.model.getState[i].name
									+ " : "
									+ stateArr[parseInt(response.model.getState[i].val)];

							var lampStateRow = document
									.getElementById("lampStateRow");
							lampStateRow.innerHTML = stateArr[parseInt(response.model.getState[i].val)];

						} else {
							displayText += response.model.getState[i].name
									+ " : " + response.model.getState[i].val;
						}
						
						if (i < response.model.getState.length - 1) {
							displayText += "<br>";
						}
					}
					var executionTimeRow = document
					.getElementById("executionTimeRow");
					executionTimeRow.innerHTML =response.model.executionTime;

					alertify.success(displayText);
				},
				error : function(e) {
					console.log("ERROR: ", e);
					display(e);
				},
				done : function(e) {
					console.log("DONE");
				}
			});
}

function setDimLevel(opName, opHref, isControl, grpOpName) {

	// console.log(opName + opHref);
	var dimValue = document.getElementById("dimLevel").value;
	var stateArr = [ 'OFF', 'ON', 'ERROR' ];
	var dimLevelArr = [ '0%', '20%', '40%', '60%', '80%', '100%' ];

	$
			.ajax({
				type : "GET",
				url : ctxPath + "/device.html/ajax?operation=setDimLevel&opName="
						+ opName + "&opHref=" + opHref + "&isControl="
						+ isControl + "&dimValue=" + dimValue + "&grpOpName=" + grpOpName, /* "/in-cse/in-name" */

				contentType : "application/json; charset=utf-8",
				beforeSend : function() {
				},
				headers : {
					"Accept" : "application/json"
				},

				success : function(response) {

					var getStateMsg = "";
					if (response.model.getStateAfterSetDim.length >= 0) {
						getStateMsg = JSON
								.stringify(response.model.getStateAfterSetDim);
					}
					// alertify.success(getStateMsg);
					var displayText = "";
					for (i = 0; i < response.model.getStateAfterSetDim.length; i++) {

						if (response.model.getStateAfterSetDim[i].name == "dimLevel") {

							displayText += response.model.getStateAfterSetDim[i].name
									+ " : "
									+ dimLevelArr[parseInt(response.model.getStateAfterSetDim[i].val)];
						} else if (response.model.getStateAfterSetDim[i].name == "state") {

							displayText += response.model.getStateAfterSetDim[i].name
									+ " : "
									+ stateArr[parseInt(response.model.getStateAfterSetDim[i].val)];
						} else {
							displayText += response.model.getStateAfterSetDim[i].name
									+ " : "
									+ response.model.getStateAfterSetDim[i].val;
						}

						if (i < response.model.getStateAfterSetDim.length - 1) {
							displayText += "<br>";
						}
					}
					alertify.success(displayText);
				},
				error : function(e) {
					console.log("ERROR: ", e);
					display(e);
				},
				done : function(e) {
					console.log("DONE");
				}
			});
}

$(document)
		.on(
				"click",
				"#subscribe",
				function(event) {
					var inv = document.getElementById("invalidURL");
					if(!invalidURL){
						inv.innerHTML ="";
					var resourceName = $("#subscriptionModal #resourceName")
					.val();
					var resourceIp = $("#subscriptionModal #resourceIp")
					.val();
					
					$
							.ajax({
								type : "GET",
								url : ctxPath + "/device.html/ajax?operation=subscriptionOperation&resourceName="
										+ resourceName
										+ "&resourceIp="
										+ resourceIp,

								contentType : "application/json; charset=utf-8",
								beforeSend : function() {
								},
								headers : {
									"Accept" : "application/json"
								},
								success : function(data) {

									 data = JSON.parse(data);
									 console.log(data);
									// location.reload();
									 if(data.model.sendRedirect!=null){
										 window.location.href = ctxPath+ data.model.sendRedirect;
									 }
									var displayText = data.model.displayText;
									alertify.success(displayText);
									$('#subscriptionModal').modal('toggle');
									
								},
								error : function(e) {
									console.log("ERROR: ", e);
								}
							});
					}else{
						
						inv.innerHTML =" Invalid Resource IP !";
					}
					
				});


$(document)
.on(
		"click",
		"#subscriptionModalBtn",
		function(event) {
	
			$
					.ajax({
						type : "GET",
						url : ctxPath + "/device.html/ajax?operation=subscriptionPrivilege",

						contentType : "application/json; charset=utf-8",
						beforeSend : function() {
						},
						headers : {
							"Accept" : "application/json"
						},
						success : function(data) {

							 console.log(data);
							 if(data.model.sendRedirect!=null){
								 window.location.href = ctxPath+ data.model.sendRedirect;
							 }

						},
						error : function(e) {
							console.log("ERROR: ", e);
							$('#subscriptionModal').modal('toggle');
						}
					});
			
		});

function doExecute(huri, moduleType, resourceId, resourceName, containerDefinition, anncHuri) {
	
	var huri = huri.substring(1);
	var moduleType = moduleType;
	var  resourceId = resourceId;
	var resourceName = resourceName;
	var containerDefinition = containerDefinition;
	var anncHuri = anncHuri;
	
	var inputTypeMapping = {
			"checkbox":"boolean",
			"number":"integer",
			"text":"string"};
	
	var putparams = "";
	var inputTagArr= document.getElementById(moduleType+"Row").getElementsByTagName("input");
	for (var i = 0; i < inputTagArr.length; i++) {		
		
		var paramName = inputTagArr[i].name;		
		var paramType = inputTypeMapping[inputTagArr[i].type];
		var paramValue = inputTagArr[i].value;
		
		if(paramType=="boolean"){
			paramValue = $('#'+inputTagArr[i].id).prop("checked") == true;
		}
		
		putparams += "$" + paramName + "__" + paramValue + "__" + paramType;
	}
	
	putparams = putparams.substring(1);
	
	$
	.ajax({
		type : "GET",
		url : ctxPath + "/device.html/ajax?operation=updateModule&huri=" + huri + "&moduleType="+moduleType+"&resourceId="+resourceId+"&resourceName="+resourceName+"&containerDefinition="+ containerDefinition +"&anncHuri="+ anncHuri + "&putparams="+ putparams,

		contentType : "application/json; charset=utf-8",
		beforeSend : function() {
		},
		headers : {
			"Accept" : "application/json"
		},
		success : function(data) {

			 console.log(data);
// if(data.model.sendRedirect!=null){
// window.location.href = ctxPath+ data.model.sendRedirect;
// }

		},
		error : function(e) {
			console.log("ERROR: ", e);
// $('#subscriptionModal').modal('toggle');
		}
	});
	
}



function prepareHtmlObjects(query) {

	var query_string = location.search.substring(1);

	parsed_qs = parse_query_string(query_string);

}

function getContextPath() {
	return window.location.pathname.substring(0, window.location.pathname.indexOf("/",2));
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

function getDateAfterStartDate(startDateStr, dayAfter) {
	var startDate = new Date(startDateStr);
	startDate.setDate(startDate.getDate() + dayAfter);
	var dayStr = startDate.getDate().toString();
	if (dayStr.length < 2) {
		dayStr = '0' + dayStr;
	}
	var monthStr = (startDate.getMonth() + 1).toString();
	if (monthStr.length < 2) {
		monthStr = '0' + monthStr;
	}
	return startDate.getFullYear() + '-' + monthStr + '-' + dayStr;
}
/*---------------------------------datatables-------------------------------*/

$(function() {
	$('#last20Data1').DataTable({
		dom : 'Bfrtip',
		buttons : [ 'copy', 'print', 'csv', 'excel', 'pdf', 
		            {
						text: 'PDF Landscape',
			            extend: 'pdfHtml5',
			            orientation: 'landscape',
			            pageSize: 'LEGAL'
			        } 
		],
		"aaData" : dataArr,
		"aoColumns" : [ {
			"mDataProp" : "resourceName"
		}, {
			"mDataProp" : "resourceId"
		}, {
			"mDataProp" : "type"
		}, {
			"mDataProp" : "createDate"
		},{
			"mDataProp" : "location"
		}, {
			"mDataProp" : "lampId"
		}, {
			"mDataProp" : "state"
		}, {
			"mDataProp" : "dimLevel"
		} ]
	});
});

function ValidURL(str) {
	  var pattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
	  if(!pattern.test(str)) {
	    invalidURL=true;
	    return false;
	  } else {
		invalidURL=false;
	    return true;
	  }
	}

$(function() {
	$('#subscriptions').DataTable({
		dom : 'Bfrtip',
		buttons : [ 'copy', 'print', 'csv', 'excel', 'pdf',
		            {
						text: 'PDF Landscape',
			            extend: 'pdfHtml5',
			            orientation: 'landscape',
			            pageSize: 'LEGAL'
		            }
		],
		"aaData" : subsArray,
		"aoColumns" : [ {
			"mDataProp" : "ct"
		}, {
			"mDataProp" : "nu"
		}, {
			"mDataProp" : "rn"
		}, {
			"mDataProp" : "ri"
		} , {
			"mDataProp" : "lbl"
		} , {
			"mDataProp" : "pi"
		} , {
			"mDataProp" : "acpi"
		} , {
			"mDataProp" : "lt"
		}  ]
	});
});

$(function() {
	$('#grpDeviceInfosTbl').DataTable({
		dom : 'Bfrtip',
		buttons : [ 'copy', 'csv', 'excel', 'pdf', 'print' ],
		"aaData" : grpDeviceInfoArray,
		"aoColumns" : [  {
			"mDataProp" : "prDNe",
			"targets" : 0,
			"render" : function(data, type, row, meta) {
				return '<a class="ex1" href="device.html?rn='
						+ row.huri + '">' + data + '</a>';
			}
		}, {
			"mDataProp" : "pDSNm"
		}, {
			"mDataProp" : "rn"
		},{
			"mDataProp" : "huri"
		}  ]
	});
});


/*
 * $(function() { $('#lastStates').DataTable({ dom : 'Bfrtip', buttons : [
 * 'copy', 'csv', 'excel', 'pdf', 'print' ], "aaData" : stateArray, "aoColumns" : [ {
 * "mDataProp" : "ct" }, { "mDataProp" : "con" } ] }); });
 */
/*---------------------------------datatables-------------------------------*/

/*---------------------------------Highcharts-------------------------------*/

/**
 * Returns Highchart theme object by theme name Theme names is defined in method
 * are "Signika" and "DarkUnica". Use one of them.Ex: getTheme("DarkUnica")
 * 
 * @param {String}
 *            themeName
 * @return {Object} themeObject
 */
function getTheme(themeName) {

	var themeSet = {};

	// --------------------theme1-----------------------------
	var theme1 = {
		colors : [ "#f45b5b", "#8085e9", "#8d4654", "#7798BF", "#aaeeee",
				"#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF",
				"#aaeeee" ],
		chart : {
			theme : "SandSignika",
			backgroundColor : null,
			style : {
				fontFamily : "Signika, serif"
			}
		},
		title : {
			style : {
				color : 'black',
				fontSize : '16px',
				fontWeight : 'bold'
			}
		},
		subtitle : {
			style : {
				color : 'black'
			}
		},
		tooltip : {
			borderWidth : 0
		},
		legend : {
			itemStyle : {
				fontWeight : 'bold',
				fontSize : '13px'
			}
		},
		xAxis : {
			labels : {
				style : {
					color : '#6e6e70'
				}
			}
		},
		yAxis : {
			labels : {
				style : {
					color : '#6e6e70'
				}
			}
		},
		plotOptions : {
			series : {
				shadow : true
			},
			candlestick : {
				lineColor : '#404048'
			},
			map : {
				shadow : false
			}
		},

		// Highstock specific
		navigator : {
			xAxis : {
				gridLineColor : '#D0D0D8'
			}
		},
		rangeSelector : {
			buttonTheme : {
				fill : 'white',
				stroke : '#C0C0C8',
				'stroke-width' : 1,
				states : {
					select : {
						fill : '#D0D0D8'
					}
				}
			}
		},
		scrollbar : {
			trackBorderColor : '#C0C0C8'
		},

		// General
		background2 : '#E0E0E8'

	};

	// --------------------theme2-----------------------------

	var theme2 = {
		colors : [ "#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee",
				"#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF",
				"#aaeeee" ],
		chart : {
			theme : "DarkUnica",
			backgroundColor : {
				linearGradient : {
					x1 : 0,
					y1 : 0,
					x2 : 1,
					y2 : 1
				},
				stops : [ [ 0, '#2a2a2b' ], [ 1, '#3e3e40' ] ]
			},
			style : {
				fontFamily : "'Unica One', sans-serif"
			},
			plotBorderColor : '#606063'
		},
		title : {
			style : {
				color : '#E0E0E3',
				textTransform : 'uppercase',
				fontSize : '20px'
			}
		},
		subtitle : {
			style : {
				color : '#E0E0E3',
				textTransform : 'uppercase'
			}
		},
		xAxis : {
			gridLineColor : '#707073',
			labels : {
				style : {
					color : '#E0E0E3'
				}
			},
			lineColor : '#707073',
			minorGridLineColor : '#505053',
			tickColor : '#707073',
			title : {
				style : {
					color : '#A0A0A3'

				}
			}
		},
		yAxis : {
			gridLineColor : '#707073',
			labels : {
				style : {
					color : '#E0E0E3'
				}
			},
			lineColor : '#707073',
			minorGridLineColor : '#505053',
			tickColor : '#707073',
			tickWidth : 1,
			title : {
				style : {
					color : '#A0A0A3'
				}
			}
		},
		tooltip : {
			backgroundColor : 'rgba(0, 0, 0, 0.85)',
			style : {
				color : '#F0F0F0'
			}
		},
		plotOptions : {
			series : {
				dataLabels : {
					color : '#B0B0B3'
				},
				marker : {
					lineColor : '#333'
				}
			},
			boxplot : {
				fillColor : '#505053'
			},
			candlestick : {
				lineColor : 'white'
			},
			errorbar : {
				color : 'white'
			}
		},
		legend : {
			itemStyle : {
				color : '#E0E0E3'
			},
			itemHoverStyle : {
				color : '#FFF'
			},
			itemHiddenStyle : {
				color : '#606063'
			}
		},
		credits : {
			style : {
				color : '#666'
			}
		},
		labels : {
			style : {
				color : '#707073'
			}
		},

		drilldown : {
			activeAxisLabelStyle : {
				color : '#F0F0F3'
			},
			activeDataLabelStyle : {
				color : '#F0F0F3'
			}
		},

		navigation : {
			buttonOptions : {
				symbolStroke : '#DDDDDD',
				theme : {
					fill : '#505053'
				}
			}
		},

		// scroll charts
		rangeSelector : {
			buttonTheme : {
				fill : '#505053',
				stroke : '#000000',
				style : {
					color : '#CCC'
				},
				states : {
					hover : {
						fill : '#707073',
						stroke : '#000000',
						style : {
							color : 'white'
						}
					},
					select : {
						fill : '#000003',
						stroke : '#000000',
						style : {
							color : 'white'
						}
					}
				}
			},
			inputBoxBorderColor : '#505053',
			inputStyle : {
				backgroundColor : '#333',
				color : 'silver'
			},
			labelStyle : {
				color : 'silver'
			}
		},

		navigator : {
			handles : {
				backgroundColor : '#666',
				borderColor : '#AAA'
			},
			outlineColor : '#CCC',
			maskFill : 'rgba(255,255,255,0.1)',
			series : {
				color : '#7798BF',
				lineColor : '#A6C7ED'
			},
			xAxis : {
				gridLineColor : '#505053'
			}
		},

		scrollbar : {
			barBackgroundColor : '#808083',
			barBorderColor : '#808083',
			buttonArrowColor : '#CCC',
			buttonBackgroundColor : '#606063',
			buttonBorderColor : '#606063',
			rifleColor : '#FFF',
			trackBackgroundColor : '#404043',
			trackBorderColor : '#404043'
		},

		// special colors for some of the
		legendBackgroundColor : 'rgba(0, 0, 0, 0.5)',
		background2 : '#505053',
		dataLabelsColor : '#B0B0B3',
		textColor : '#C0C0C0',
		contrastTextColor : '#F0F0F3',
		maskColor : 'rgba(255,255,255,0.3)'
	};

	themeSet["SandSignika"] = theme1;
	themeSet["DarkUnica"] = theme2;

	if (themeSet[themeName] == null) {
		return themeSet["SandSignika"];
	}

	return themeSet[themeName];

}

function highChartRawDemo() {

	var chartTheme = getTheme("DarkUnica");

	var options = {
		title : {
			text : 'Monthly Average Temperature',
			x : -20
		// center
		},
		subtitle : {
			text : 'Source: WorldClimate.com',
			x : -20
		},
		xAxis : {
			categories : [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
					'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
		},
		yAxis : {
			title : {
				text : 'Temperature (°C)'
			},
			plotLines : [ {
				value : 0,
				width : 1,
				color : '#808080'
			} ]
		},
		tooltip : {
			crosshairs : true,
			shared : true,
			valueSuffix : '°C'
		},
		legend : {
			layout : 'vertical',
			align : 'right',
			verticalAlign : 'middle',
			borderWidth : 0
		},
		series : [
				{
					name : 'Tokyo',
					data : [ 7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3,
							18.3, 13.9, 9.6 ]
				},
				{
					name : 'New York',
					data : [ -0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1,
							20.1, 14.1, 8.6, 2.5 ]
				},
				{
					name : 'Berlin',
					data : [ -0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3,
							9.0, 3.9, 1.0 ]
				},
				{
					name : 'London',
					data : [ 3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2,
							10.3, 6.6, 4.8 ]
				} ]
	};

	$(function() {
		Highcharts
				.wrap(
						Highcharts.Chart.prototype,
						'getContainer',
						function(proceed) {
							proceed.call(this);
							this.container.style.background = 'url(http://www.highcharts.com/samples/graphics/sand.png)';
						});

		// $('#container').highcharts(Highcharts.merge(options, theme1));

		// $('#container2').highcharts(Highcharts.merge(options, theme2));

		// $('#container3').highcharts(options);
	});

	$('#container').highcharts(Highcharts.merge(options, chartTheme));
}
/*---------------------------------Highcharts-------------------------------*/


