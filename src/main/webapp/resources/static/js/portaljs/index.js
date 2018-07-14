var parsed_qs;
var ctxPath = getContextPath();

$(document).ready(function() {

	prepareHtmlObjects();	

	 
	 $.ajax({
	 type : "GET",
	 url : ctxPath + "/index.html/ajax?operation=fetchReports",
	
	 contentType : "application/json; charset=utf-8",
	 beforeSend : function() {
	 },
	 headers : {
	 "Accept" : "application/json"
	 },
	 success : function(data) {
	
	 resource = data;
	 loadReportsData(data,30);
	 },
	 error : function(e) {
	 console.log("ERROR: ", e);
	 }
	 });

// loadReportDataByDuration(3, 30);


});

function loadReportDataByDuration(rprtId, durationOpt) {

	$.ajax({
		type : "GET",
		url : ctxPath + "/index.html/ajax?operation=fetchReportDataByDuration&rprtId="
				+ rprtId + "&duration=" + durationOpt,

		contentType : "application/json; charset=utf-8",
		beforeSend : function() {
		},
		headers : {
			"Accept" : "application/json"
		},
		success : function(data) {

			resource = data;
			loadReportsData(data, durationOpt);
		},
		error : function(e) {
			console.log("ERROR: ", e);
		}
	});
}

function loadReportsData(data, durationOpt) {
	if (typeof data.model.report_0 !== "undefined") {
		loadGWStatesGraph(data.model.report_0);
	}
	if (typeof data.model.report_1 !== "undefined") {
		
		var numberOfLampsOn = document.getElementById("numberOfLampsOn");
		var numberOfLampsOff = document.getElementById("numberOfLampsOff");
		var numberOfLampsError = document.getElementById("numberOfLampsError");
		
		numberOfLampsOff.innerHTML =0;
		numberOfLampsOn.innerHTML =0;
		numberOfLampsError.innerHTML =0;		
		
		for(i=0; i < data.model.report_1.length; i++){
			
			if(data.model.report_1[i].value1 == "0"){
				numberOfLampsOff.innerHTML = data.model.report_1[i].value0;
			}
			if(data.model.report_1[i].value1 == "1"){
				numberOfLampsOn.innerHTML = data.model.report_1[i].value0;			
			}
			if(data.model.report_1[i].value1 == "2"){
				numberOfLampsError.innerHTML = data.model.report_1[i].value0;
			}
			
		}	
	}
	if (typeof data.model.report_2 !== "undefined") {
		loadGWVersionGraph(data.model.report_2);
	}
	if (typeof data.model.report_3 !== "undefined") {
		console.log("Consumption Graph is loaded with valid data.");
		loadConsumptionGraph(data.model.report_3, durationOpt);
	}
	if (typeof data.model.report_4 !== "undefined") {
		console.log("something is TODO");
		loadDimLevelGraph(data.model.report_4);
	}
	if (typeof data.model.report_5 !== "undefined") {

		var numberOfDevices = document.getElementById("numberOfDevices");
		numberOfDevices.innerHTML = data.model.report_5[0].value1;
	}
	if (typeof data.model.report_6 !== "undefined") {

		var numberOfGWs = document.getElementById("numberOfGWs");
		numberOfGWs.innerHTML = data.model.report_6[0].value1;
	}

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

	$('#lineGraph').highcharts(Highcharts.merge(options, chartTheme));

}

function loadConsumptionGraph_1(data) {

	// var xVals = new Array(data.length);
	var data1 = new Array(data.length);
	var data2 = new Array(data.length);
	var data1Label = new Array(data.length);

	var startDate = data[0].startDate;
	var endDate = data[0].endDate;

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

				dataarr.push(tmpObj[0].value1);
			}
			else {
				dataarr.push("0");
			}
		
	}

	var columnData = [ [ 'x' ].concat(xVals), [ 'data1' ].concat(dataarr) ];

	var chart1 = c3.generate({
		bindto : '#lineGraph',
		data : {
			x : 'x',
			xFormat : '%Y-%m-%d',
			columns : columnData,
			names : {
				data1 : 'Gateways',
			},
			colors : {
				data1 : '#f0b518'
			},
			onclick : function(d, i) {
				alertify.success("Date: " + d.x + "<br>" + "Serie: " + d.name
						+ "<br>" + "Value: " + d.value);
				console.log("onclick", d, i);
			}
		},
		axis : {
			x : {
				type : 'timeseries',
				tick : {
					// this also works for non timeseries data
					values : [ startDate, endDate ],
					xFormat : '%Y-%m-%d'
				}
			}
		}
	});
}

function loadGWVersionGraph(data) {

	// var columnData = [ [ 'x' ].concat(xVals), [ 'data1' ].concat(data1) ];
	var dataColumnArr = new Array();

	for (i = 0; i < data.length; i++) {
		var dataarr = new Array(2);
		dataarr[0] = data[i].value0;
		dataarr[1] = data[i].value1;

		dataColumnArr.push(dataarr);
	}

	var chart10 = c3.generate({
		bindto : '#gwVersionChart',
		data : {
			columns : dataColumnArr,
			type : 'donut',
			colors : {
				Likes : '#c282e0',
				Shares : '#c38fbb',
				Clicks : '#F782AA',
			},
			onclick : function(d, i) {
				alertify.success("name: " + d.name + "<br>" + "ratio: "
						+ d.ratio + "<br>" + "value: " + d.value);
			},
			onmouseover : function(d, i) {
				// console.log("onmouseover", d, i);
			},
			onmouseout : function(d, i) {
				// console.log("onmouseout", d, i);
			}
		},
		donut : {
			title : "Version"
		},
	});
}

function loadGWStatesGraph(data) {

	var dataColumnArr = new Array();
	var stateArr = ["ACTIVE","ACTIVATION_READY","TESTING",'TEST_READY','MANUFACTURE','SUSPENDED','DEACTIVE','ERROR'];
		
	for (i = 0; i < data.length; i++) {
		var dataarr = new Array(2);
		dataarr[0] = data[i].value0;
		dataarr[1] = data[i].value1;

		dataColumnArr.push(dataarr);
	}
	

	for (i = 0; i < stateArr.length; i++) {
		var b = dataColumnArr.filter(e => e[0] == stateArr[i]);
		
		if(b.length <= 0){
			var dataarr = new Array(2);
			dataarr[0] = stateArr[i];
			dataarr[1] = "0";

			dataColumnArr.push(dataarr);
		}
		
	}

	var chart9 = c3.generate({
		bindto : '#gwStatesPieChart',
		data : {
			// iris data from R
			columns : dataColumnArr,
			type : 'pie',
			colors : {
				Likes : '#91c46b',
				Shares : '#3a86c8',
			},
			onclick : function(d, i) {
				alertify.success("name: " + d.name + "<br>" + "ratio: "
						+ d.ratio + "<br>" + "value: " + d.value);
				console.log("onclick", d, i);
			},
			onmouseover : function(d, i) {
				console.log("onmouseover", d, i);
			},
			onmouseout : function(d, i) {
				console.log("onmouseout", d, i);
			}
		}
	});
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

function parseJSON(data) {
	return window.JSON && window.JSON.parse ? window.JSON.parse(data)
			: (new Function("return " + data))();
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