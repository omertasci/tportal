var parsed_qs;
var ctxPath = getContextPath();
var swRn;
var swHuri;
var swIns;
 $(document).ready(function() {
	
	 $('.multiselect').multiselect();
 });

$(document).ready(
		function() {		
			
			prepareHtmlObjects();

			$.ajax({
				type : "GET",
				url : ctxPath + "/gateway.html/ajax?operation=fetchReports&rn="
						+ parsed_qs.rn + "&ri=" + parsed_qs.ri,

				contentType : "application/json; charset=utf-8",
				beforeSend : function() {
				},
				headers : {
					"Accept" : "application/json"
				},
				success : function(data) {

					resource = JSON.parse(data);
					loadReportsData(resource,30);
				},
				error : function(e) {
					console.log("ERROR: ", e);
				}
			});

			$("#swModal").on('show.bs.modal', function(event) {

				
				console.log($(this));

					var row = $(event.relatedTarget);

					swRn = row.data('rn');
					swHuri = row.data('huri');
					swIns = row.data('install');
				
			});

// loadReportDataByDuration(3, 30);

			setInterval(function()	{ 
				sendRequest();		
				}, 20000);
			
			
			
		    var navListItems = $('div.setup-panel div a'),
	        allWells = $('.setup-content'),
	        allNextBtn = $('.nextBtn');

	    allWells.hide();

	    navListItems.click(function (e) {
	        e.preventDefault();
	        var $target = $($(this).attr('href')),
	            $item = $(this);

	        if (!$item.hasClass('disabled')) {
	            navListItems.removeClass('btn-success').addClass('btn-default');
	            $item.addClass('btn-success');
	            allWells.hide();
	            $target.show();
	            $target.find('input:eq(0)').focus();
	        }
	    });

	    allNextBtn.click(function () {
	        var curStep = $(this).closest(".setup-content"),
	            curStepBtn = curStep.attr("id"),
	            nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
	            curInputs = curStep.find("input[type='text'],input[type='url']"),
	            isValid = true;

	        $(".form-group").removeClass("has-error");
	        for (var i = 0; i < curInputs.length; i++) {
	            if (!curInputs[i].validity.valid) {
	                isValid = false;
	                $(curInputs[i]).closest(".form-group").addClass("has-error");
	            }
	        }

	        if (isValid) nextStepWizard.removeAttr('disabled').trigger('click');
	    });

	    $('div.setup-panel div a.btn-success').trigger('click');
			
		});
		



$(document).on("click", "#createDeviceGroupModalBtn", function(event) {

	console.log("");
	
	$.ajax({
		type : "GET",
		url : ctxPath + "/gateway.html/ajax" + "?operation=getPhysicalDevices&gateway="+parsed_qs.cseId+ "&huri="+parsed_qs.huri,

		contentType : "application/json; charset=utf-8",
		beforeSend : function() {
		},
		headers : {
			"Accept" : "application/json"
		},
		success : function(data) {

			resource = JSON.parse(data);
			
			$("#createDeviceGroupModal").on('show.bs.modal', function() {

				var options = resource.model.devices;

				var selectgen = document.getElementById("deviceListGen");
				resetSelectOptions(deviceListGen);
			
				for ( var key in options) {
					if (options.hasOwnProperty(key)) {
						var opt = options[key];
						var el = document.createElement("option");
						el.textContent = opt.original_prDNe !=null ? opt.original_prDNe : opt.original_pDSNm; // opt.rn;
// el.value =
// opt.rn+"_"+opt.acpi.replace("\"","").replace("[","").replace("]","").replace("\"","");
						el.value = "rn#" + opt.rn + "#_#poa#" + opt.poa + "#_#api#" + opt.api + "#_#huri#" + opt.huri + "#_#acpi#" + opt.acpi.replace(","," ");
						el.dataset.resourcetype = opt.ty;						
						el.dataset.originalHuri = opt.original_huri;
						selectgen.appendChild(el);
					}
				}
			});
			
			 $('#createDeviceGroupModal').modal('show');
		},
		error : function(e) {
			console.log("ERROR: ", e);
		}
	});
	

});

$('#createDeviceGroupModal').on('shown.bs.modal', function() {
	
	$('#deviceListGen').selectpicker('refresh');

});


$(document)
.on(
		"click",
		"#generate",
		function(event) {
			var devGroupName = $("#createDeviceGroupModal #devGroupName").val();
			var gatewayName = $("#createDeviceGroupModal #gatewayName").val();
			var gatewayId = $("#createDeviceGroupModal #gatewayId").val();
			
			var multiselect_to_1_gen = document.getElementById("multiselect_to_1_gen");
			var devices = "";
			var resourceTypeArr = new Array();
			var resourceTypes = "";
			var originalResources = "";
			
			for (i = 0; i < multiselect_to_1_gen.options.length; i++) {
				devices += multiselect_to_1_gen.options[i].value + ",";
				
				if(resourceTypeArr.indexOf(multiselect_to_1_gen.options[i].dataset.resourcetype) === -1){
					resourceTypeArr.push(multiselect_to_1_gen.options[i].dataset.resourcetype);
					resourceTypes +=  ", " + multiselect_to_1_gen.options[i].dataset.resourcetype;					
				}

				originalResources +=  " " + multiselect_to_1_gen.options[i].dataset.originalHuri;
				
			}
			
			if(resourceTypeArr.length > 1){
				resourceTypes = resourceTypes.substring(0, resourceTypes.length - 2);
				alertify.error("The types of selected resources are incompatible! <br>["+ resourceTypes + "]");
				return;				
			}
				
			if (devices.indexOf(",") > 0) {
				devices = devices.substring(0, devices.length - 1);
			}
			
			resourceTypes = resourceTypes.substring(2).trim();
			originalResources = originalResources.trim();
			
			$.ajax({
				  type: "POST",
				  url: ctxPath + "/gateway.html/ajax",
				  data: {
					  operation:"createDeviceGroup",
					  devGroupName:devGroupName,
					  gatewayName:gatewayName,
					  gatewayId:gatewayId,
					  devices:devices,
					  resourceTypes:resourceTypes,
					  originalResources: originalResources,
					  gatewayHuri:parsed_qs.huri
				  },
				  success: function(data) {				  
					  alertify.success("The group "+ devGroupName + "<br>is created succesfully.");
					  $('#createDeviceGroupModal').modal('toggle');
// window.location.reload();
				  }
				});			
			
		});
		

function loadReportDataByDuration(rprtId, durationOpt) {

	$.ajax({
		type : "GET",
		url : ctxPath + "/gateway.html/ajax?operation=fetchReportDataByDuration&rn="
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
		console.log("something is TODO");
		loadDimLevelGraph(data.model.report_4);
	}
	if (typeof data.model.report_5 !== "undefined") {

		// var numberOfDevices = document.getElementById("numberOfDevices");
		// numberOfDevices.innerHTML = data.model.report_5[0].value1;
	}
	if (typeof data.model.report_6 !== "undefined") {

		// var numberOfGWs = document.getElementById("numberOfGWs");
		// numberOfGWs.innerHTML = data.model.report_6[0].value1;
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

	var serieName = [ 'Gateway' ];

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

	var xVals = new Array(data.length);
	var data1 = new Array(data.length);
	var data2 = new Array(data.length);
	var data1Label = new Array(data.length);

	var startDate = data[0].startDate;
	var endDate = data[0].endDate;

	for (i = 0; i < data.length; i++) {

		xVals[i] = data[i].value2;
		data1[i] = data[i].value1;
		data1Label[i] = data[i].value0;

		if (Date.parse(data[i].startDate) < Date.parse(startDate)) {
			startDate = data[i].startDate;
		}
		if (Date.parse(data[i].endDate) > Date.parse(endDate)) {
			endDate = data[i].endDate;
		}
	}

	var columnData = [ [ 'x' ].concat(xVals), [ 'data1' ].concat(data1) ];

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

function loadDimLevelGraph(data) {

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

	for (i = 0; i < data.length; i++) {
		if (data[i].value1 == "0") {
			dimLevel_0 += parseInt(data[i].value0);
		}
		if (data[i].value1 == "1") {
			dimLevel_1 += parseInt(data[i].value0);
		}
		if (data[i].value1 == "2") {
			dimLevel_2 += parseInt(data[i].value0);
		}
		if (data[i].value1 == "3") {
			dimLevel_3 += parseInt(data[i].value0);
		}
		if (data[i].value1 == "4") {
			dimLevel_4 += parseInt(data[i].value0);
		}
		if (data[i].value1 == "5") {
			dimLevel_5 += parseInt(data[i].value0);
		}
		if (data[i].value1 == "6") {
			dimLevel_6 += parseInt(data[i].value0);
		}
		if (data[i].value1 == "7") {
			dimLevel_7 += parseInt(data[i].value0);
		}
		if (data[i].value1 == "8") {
			dimLevel_8 += parseInt(data[i].value0);
		}
		if (data[i].value1 == "9") {
			dimLevel_9 += parseInt(data[i].value0);
		}
		if (data[i].value1 == "10") {
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

function resetSelectOptions(select) {
	while (select.options.length > 0) {
		select.remove(0);
	}
}

function parseJSON(data) {
	return window.JSON && window.JSON.parse ? window.JSON.parse(data)
			: (new Function("return " + data))();
}

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
	$('#device').DataTable(
			{
				dom : 'Bfrtip',
				buttons : [ 'copy', 'print', 'csv', 'excel', 'pdf',
				            {
								text: 'PDF Landscape',
					            extend: 'pdfHtml5',
					            orientation: 'landscape',
					            pageSize: 'LEGAL'
					        } 
				],
				"aaData" : devices,
				"aoColumns" : [
						{
							"mDataProp" : "rn",
							"targets" : 0,
							"render" : function(data, type, row, meta) {
								return '<a class="ex1" href="device.html?rn='
										+ row.value + '">' + data + '</a>';
							}
						}, {
							"mDataProp" : "ty"
						}, {
							"mDataProp" : "value"
						}, {
							"mDataProp" : "api"
						}, {
							"mDataProp" : "poa"
						}, {
							"mDataProp" : "huri"
						} ]
			});
});
$(function() {
	$('#nonDevice').DataTable({
		dom : 'Bfrtip',
		buttons : [ 'copy', 'print', 'csv', 'excel', 'pdf',
		            {
						text: 'PDF Landscape',
			            extend: 'pdfHtml5',
			            orientation: 'landscape',
			            pageSize: 'LEGAL'
			        }
		],
		"aaData" : nonDevices,
		"aoColumns" : [ {
			"mDataProp" : "rn"
		}, {
			"mDataProp" : "ty"
		}, {
			"mDataProp" : "value"
		} ]
	});
});

/*---------------------------------datatables-------------------------------*/

// ----------------------------------Highcharts------------------------
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

// ------------------Highcharts------------------------

function getContextPath() {
	return window.location.pathname.substring(0, window.location.pathname.indexOf("/",2));
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
						url : ctxPath + "/gateway.html/ajax?operation=subscriptionOperation&resourceName="
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

							// resource = data;
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
				url : ctxPath + "/gateway.html/ajax?operation=subscriptionPrivilege",

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

$(document)
.on(
		"click",
		"#swVerUpdate",
		function(event) {
			
			var versionId = $("#swModal #pkgVersionSlct").val();
			var version = $("#swModal #pkgVersionSlct option:selected").text();
			$.ajax({
						type : "GET",
						url : ctxPath + "/gateway.html/ajax",
						data: {
							  operation:"updatePkgVersions",
							  swRn:swRn,
							  swHuri:swHuri,
							  pkgVersion:version
						},
						contentType : "application/json; charset=utf-8",
						beforeSend : function() {
						},
						headers : {
							"Accept" : "application/json"
						},
						success : function(data) {

							resource = JSON.parse(data);
							document.getElementById('pkgUriLbl').innerHTML = resource.model.package_uri;
							alertify.success("Update Success !");
							$('#swTable').load(document.URL +  ' #swTable'); 
							
							
						},
						error : function(e) {
							console.log("ERROR: ", e);
						}
					});
		});
$(document)
.on(
		"click",
		"#swInsUpdate",
		function(event) {
			
			$.ajax({
						type : "GET",
						url : ctxPath + "/gateway.html/ajax",
						data: {
							  operation:"updatePkgInstall",
							  swRn:swRn,
							  swHuri:swHuri,
							  swIns:swIns
						},
						contentType : "application/json; charset=utf-8",
						beforeSend : function() {
						},
						headers : {
							"Accept" : "application/json"
						},
						success : function(data) {

							resource = JSON.parse(data);
							alertify.success("Update Success !");
							$('#swTable').load(document.URL +  ' #swTable'); 
							$('#swModal').modal('toggle');
							
						},
						error : function(e) {
							console.log("ERROR: ", e);
						}
					});
		});
function sendRequest(){
	$.ajax({
		type : "GET",
		url : ctxPath + "/modelRefreshingController/ajax?operation=observe",

		contentType : "application/json; charset=utf-8",
		beforeSend : function() {
		},
		headers : {
			"Accept" : "application/json"
		},
		success : function(data) {

			resource = data;
			console.log(resource);
		},
		error : function(e) {
			console.log("ERROR: ", e);
		}
	});
	}

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

$(document)
.on(
		"click",
		"#observeBtn",
		function(event) {
			
			$.ajax({
						type : "GET",
						url : ctxPath + "/gateway.html/ajax",
						data: {
							  operation:"swObserve",
							  swRn:swRn,
							  swHuri:swHuri,
							  swIns:swIns
						},
						contentType : "application/json; charset=utf-8",
						beforeSend : function() {
						},
						headers : {
							"Accept" : "application/json"
						},
						success : function(data) {

							resource = JSON.parse(data);
							alertify.success("Observe Success !");
							
						},
						error : function(e) {
							console.log("ERROR: ", e);
						}
					});
		});

$(document)
.on(
		"click",
		"#observeCancelBtn",
		function(event) {
			
			$.ajax({
						type : "GET",
						url : ctxPath + "/gateway.html/ajax",
						data: {
							  operation:"swCancelObserve",
							  swRn:swRn,
							  swHuri:swHuri,
							  swIns:swIns
						},
						contentType : "application/json; charset=utf-8",
						beforeSend : function() {
						},
						headers : {
							"Accept" : "application/json"
						},
						success : function(data) {

							resource = JSON.parse(data);
							alertify.success("Cacelled Observe !");
							
						},
						error : function(e) {
							console.log("ERROR: ", e);
						}
					});
		});


