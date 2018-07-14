var ctxPath = getContextPath();

$(document)
		.ready(
				function() {
					$('.selectpicker').selectpicker();
					$('#datetimepicker6').datetimepicker({
						format : 'YYYY-MM-DD HH:mm:ss'
					});
					$('#datetimepicker7').datetimepicker({
						useCurrent : false,
						format : 'YYYY-MM-DD HH:mm:ss'
					// Important! See issue #1075
					});
					$("#datetimepicker6").on(
							"dp.change",
							function(e) {
								$('#datetimepicker7').data("DateTimePicker")
										.minDate(e.date);
							});
					$("#datetimepicker7").on(
							"dp.change",
							function(e) {
								$('#datetimepicker6').data("DateTimePicker")
										.maxDate(e.date);
							});
					// readTextFile("resources/static/config/applicationConfig.txt");
					// readTextFile("resources/static/config/applicationConfig.txt");

					var gwgfilterSelect = document
							.getElementById("gwgFilterSelect");
					resetSelectOptions(gwgfilterSelect);

					var uniqueGwgNameArr = new Array();

					for ( var key in window.gwgroups) {
						if (window.gwgroups.hasOwnProperty(key)) {
							var opt = window.gwgroups[key];

							var existGwgName = uniqueGwgNameArr
									.find(function(e) {
										return e === opt.gwgname;
									});

							if (uniqueGwgNameArr.length <= 0
									|| existGwgName == null) {

								var tokensArr = new Array();
								tokensArr.push(opt.gwgname);
								tokensArr.push(opt.gwgdispname);
								var dataTokens = tokensArr.join(" ");

								$("#gwgFilterSelect")
										.append(
												'<option value="' + opt.gwgname
														+ '" data-tokens="'
														+ dataTokens
														+ '" selected="">'
														+ opt.gwgdispname
														+ '</option>');
								uniqueGwgNameArr.push(opt.gwgname);
							}

						}
					}

					$("#gwgFilterSelect").selectpicker("refresh");

					var gateways = null;
					var devices = null;
					var selectedGatewayGroup = null;
					var selectedGateways = null;
					var selectedDevices = null;

					$('#gwgFilterSelect')
							.change(
									function() {
										var selectedGatewayGroup = this.value;
										console.log("gwg select change to "
												+ selectedGatewayGroup);

										$
												.ajax({
													type : "GET",
													url : ctxPath
															+ "/basicReportTemplate.html/ajax?operation=requestGWsByGWGroup&gwgname="
															+ selectedGatewayGroup,
													async : false,
													contentType : "application/json; charset=utf-8",
													beforeSend : function() {
													},
													headers : {
														"Accept" : "application/json"
													},
													success : function(data) {
														gateways = data.model.gwGroupList;
													}
												});

										var uniqueGatewayNameArr = new Array();

										for ( var key in gateways) {
											if (gateways.hasOwnProperty(key)) {
												var opt = gateways[key];

												var existGatewayName = uniqueGatewayNameArr
														.find(function(e) {
															return e === opt.ri;
														});

												if (uniqueGatewayNameArr.length <= 0
														|| existGatewayName == null) {

													var tokensArr = new Array();
													tokensArr.push(opt.rn);
													tokensArr.push(opt.csi);
													tokensArr.push(opt.ri);
													var dataTokens = tokensArr
															.join(" ");

													var gatewayFilterSelect = document
															.getElementById("gatewayFilterSelect");
													resetSelectOptions(gatewayFilterSelect);

													$("#gatewayFilterSelect")
															.append(
																	'<option value="'
																			+ opt.csi
																			+ '" data-tokens="'
																			+ dataTokens
																			+ '" selected="">'
																			+ opt.rn
																			+ '</option>');
													uniqueGatewayNameArr
															.push(opt.ri);
												}

											}
										}
										$("#gatewayFilterSelect").selectpicker(
												"refresh");
									});

					$('input[id=deviceCheck]')
							.change(
									function() {
										if ($(this).is(':checked')) {
											// Checkbox is checked..
											console
													.log("Checkbox is checked..");

											var gatewayFilterSelect = document
													.getElementById("gatewayFilterSelect");
											selectedGateways = gatewayFilterSelect.value;

											$
													.ajax({
														type : "GET",
														url : ctxPath
																+ "/basicReportTemplate.html/ajax?operation=getDevices&selectedGateways="
																+ selectedGateways,
														async : false,
														contentType : "application/json; charset=utf-8",
														beforeSend : function() {
														},
														headers : {
															"Accept" : "application/json"
														},
														success : function(data) {
															devices = data.model.devices;
														}
													});

											var uniqueDeviceValArr = new Array();

											for ( var key in devices) {
												if (devices.hasOwnProperty(key)) {
													var opt = devices[key];

													var existGatewayName = uniqueDeviceValArr
															.find(function(e) {
																return e === opt.ri;
															});

													if (uniqueDeviceValArr.length <= 0
															|| existGatewayName == null) {

														var tokensArr = new Array();
														tokensArr.push(opt.rn);
														tokensArr.push(opt.ty);
														tokensArr
																.push(opt.value);
														tokensArr
																.push(opt.gateway);
														var dataTokens = tokensArr
																.join(" ");

														$("#deviceFilterSelect")
																.append(
																		'<option value="'
																				+ opt.rn
																				+ "|"
																				+ opt.gateway
																				+ "|"
																				+ opt.cnt
																				+ '" data-tokens="'
																				+ dataTokens
																				+ '" selected="">'
																				+ opt.rn
																				+ "("
																				+ opt.gateway
																				+ ")"
																				+ '</option>');
														uniqueDeviceValArr
																.push(opt.ri);
													}

												}
											}
											$("#deviceFilterSelect")
													.selectpicker("refresh");

										} else {
											// Checkbox is not checked..
											console
													.log("Checkbox is not checked..");
											var deviceFilterSelect = document
													.getElementById("deviceFilterSelect");
											deviceFilterSelect.innerHTML = '';
											$("#deviceFilterSelect")
													.selectpicker("refresh");
										}
									});

					$(document)
							.on(
									"click",
									"#refresh",
									function(event) {

										selectedGatewayGroup = $(
												'.gwgFilterSelectPicker').val();

										selectedGateways = $(
												'.gatewayFilterSelectPicker')
												.val();

										selectedDevices = $(
												'.deviceFilterSelectPicker')
												.val();

										reportType = $(
												'.reportTypeSelectPicker')
												.val();
										console.log(reportType);

										var startDate = $('#datetimepicker6')
												.find("input").val().replace(
														" ", "T").concat(
														".000Z");

										var endDate = $('#datetimepicker7')
												.find("input").val().replace(
														" ", "T").concat(
														".000Z");

										var timeStr = "from:&#039;"
												+ startDate
												+ "&#039;,mode:absolute,to:&#039;"
												+ endDate + "&#039;";

										var queryStr = "";

										// for (i = 0; i <
										// selectedDevices.length; i++) {
										// var deviceValArr = selectedDevices[i]
										// .split("|");
										//
										// queryStr += "(group_name:"
										// + selectedGatewayGroup
										// + " AND csi:"
										// + deviceValArr[1]
										// + " AND app_id:"
										// + deviceValArr[0] + ")";
										// if (selectedDevices.length > i + 1) {
										// queryStr += " OR ";
										// }
										// }

										for (i = 0; i < selectedDevices.length; i++) {
											var deviceValArr = selectedDevices[i]
													.split("|");

											queryStr += "(group_name:"
													+ selectedGatewayGroup
													+ " AND cnt_id:&#034;"
													+ deviceValArr[2]
													+ "&#034;)";
											if (selectedDevices.length > i + 1) {
												queryStr += " OR ";
											}
										}

										var kibanaPanel = document
												.getElementById("kibanaPanel");
										kibanaPanel.innerHTML = '';

										// var kibanaSrc = "<iframe src='"
										// + window.elkUrl
										// +
										// "/app/kibana#/visualize/edit/70a4a890-f1ea-11e7-b9b8-4746071fcec1?embed=true&_g=(refreshInterval:(display:Off,pause:!f,value:0),"
										// + "time:("
										// + timeStr
										// +
										// "))&_a=(filters:!(),linked:!f,query:(language:lucene,"
										// + "query:&#039;"
										// + +queryStr
										// +
										// "&#039;),uiState:(),vis:(aggs:!((enabled:!t,id:&#039;1&#039;,params:(customLabel:&#039;Sum+of+Consumption&#039;,field:consumption),schema:metric,type:sum),(enabled:!t,id:&#039;2&#039;,params:(customInterval:&#039;2h&#039;,customLabel:Date,extended_bounds:(),field:cdate,interval:h,min_doc_count:1),schema:segment,type:date_histogram)),params:(addLegend:!t,addTimeMarker:!f,addTooltip:!t,categoryAxes:!((id:CategoryAxis-1,labels:(show:!t,truncate:100),position:bottom,scale:(type:linear),show:!t,style:(),title:(),type:category)),grid:(categoryLines:!f,style:(color:%23eee)),legendPosition:right,seriesParams:!((data:(id:&#039;1&#039;,label:&#039;Sum+of+Consumption&#039;),drawLinesBetweenPoints:!t,interpolate:linear,lineWidth:5,mode:normal,show:true,showCircles:!t,type:line,valueAxis:ValueAxis-1)),times:!(),type:line,valueAxes:!((id:ValueAxis-1,labels:(filter:!f,rotate:0,show:!t,truncate:100),name:LeftAxis-1,position:left,scale:(mode:normal,type:linear),show:!t,style:(),title:(text:&#039;Sum+of+Consumption&#039;),type:value))),title:&#039;Consumption+Report&#039;,type:line))"
										// + "' height='" + 700
										// + "' width='" + 1200
										// + "'></iframe>";

										var kibanaSrc1 = "<iframe src='"
												+ window.elkUrl
												+ "/app/kibana#/visualize/edit/7a4e7000-f43e-11e7-ac0c-f3d1aab90088?embed=true&_g=(refreshInterval:(display:Off,pause:!f,value:0),"
												+ "time:("
												+ timeStr
												+ "))&_a=(filters:!(),linked:!f,query:(language:lucene,"
												+ "query:&#039;"
												+ queryStr
												+ "&#039;),uiState:(),vis:(aggs:!((enabled:!t,id:&#039;1&#039;,params:(customLabel:&#039;Sum+of+Consumption&#039;,field:consumption),schema:metric,type:sum),(enabled:!t,id:&#039;2&#039;,params:(customInterval:&#039;2h&#039;,customLabel:Date,extended_bounds:(),field:cdate,interval:h,min_doc_count:1),schema:segment,type:date_histogram)),params:(addLegend:!t,addTimeMarker:!f,addTooltip:!t,categoryAxes:!((id:CategoryAxis-1,labels:(show:!t,truncate:100),position:bottom,scale:(type:linear),show:!t,style:(),title:(),type:category)),grid:(categoryLines:!f,style:(color:%23eee)),legendPosition:right,seriesParams:!((data:(id:&#039;1&#039;,label:&#039;Sum+of+Consumption&#039;),drawLinesBetweenPoints:!t,interpolate:linear,lineWidth:5,mode:normal,show:true,showCircles:!t,type:line,valueAxis:ValueAxis-1)),times:!(),type:line,valueAxes:!((id:ValueAxis-1,labels:(filter:!f,rotate:0,show:!t,truncate:100),name:LeftAxis-1,position:left,scale:(mode:normal,type:linear),show:!t,style:(),title:(text:&#039;Sum+of+Consumption&#039;),type:value))),title:&#039;Consumption+Report&#039;,type:line))"
												+ "' height='"
												+ 100
												+ "%' width='"
												+ 100
												+ "%' style='min-height:700px'></iframe>";

										var kibanaSrc2 = "<iframe src='"
												+ window.elkUrl
												+ "/app/kibana#/visualize/edit/01579210-f440-11e7-ac0c-f3d1aab90088?embed=true&_g=(refreshInterval:(display:Off,pause:!f,value:0),"
												+ "time:("
												+ timeStr
												+ "))&_a=(filters:!(),linked:!f,query:(language:lucene,"
												+ "query:&#039;"
												+ queryStr
												+ "&#039;),uiState:(),vis:(aggs:!((enabled:!t,id:&#039;1&#039;,params:(customLabel:&#039;Level+Duration&#039;,field:timedifference),schema:metric,type:sum),(enabled:!t,id:&#039;2&#039;,params:(customLabel:Level,field:level,order:desc,orderBy:&#039;1&#039;,size:6),schema:segment,type:terms)),params:(addLegend:!t,addTimeMarker:!f,addTooltip:!t,categoryAxes:!((id:CategoryAxis-1,labels:(show:!t,truncate:100),position:bottom,scale:(type:linear),show:!t,style:(),title:(),type:category)),grid:(categoryLines:!f,style:(color:%23eee)),legendPosition:right,seriesParams:!((data:(id:&#039;1&#039;,label:&#039;Level+Duration&#039;),drawLinesBetweenPoints:!t,mode:stacked,show:true,showCircles:!t,type:histogram,valueAxis:ValueAxis-1)),times:!(),type:histogram,valueAxes:!((id:ValueAxis-1,labels:(filter:!f,rotate:0,show:!t,truncate:100),name:LeftAxis-1,position:left,scale:(mode:normal,type:linear),show:!t,style:(),title:(text:&#039;Level+Duration&#039;),type:value))),title:&#039;Dim+Level+Report+Prod&#039;,type:histogram))"
												+ "' height='"
												+ 100
												+ "%' width='"
												+ 100
												+ "%' style='min-height:700px'></iframe>";

										var kibanaSrc3 = "<iframe src='"
												+ window.elkUrl
												+ "/app/kibana#/visualize/edit/5ea2d490-f475-11e7-ac0c-f3d1aab90088?embed=true&_g=(refreshInterval:(display:Off,pause:!f,value:0),"
												+ "time:("
												+ timeStr
												+ "))&_a=(filters:!(),linked:!f,query:(language:lucene,"
												+ "query:&#039;"
												+ queryStr
												+ "&#039;),uiState:(spy:(mode:(fill:!f,name:!n))),vis:(aggs:!((enabled:!t,id:&#039;1&#039;,params:(customLabel:&#039;Sum+of+State+Duration&#039;,field:timedifference),schema:metric,type:sum),(enabled:!t,id:&#039;3&#039;,params:(customLabel:&#039;App+Id&#039;,field:app_id.keyword,order:desc,orderBy:&#039;1&#039;,size:100),schema:group,type:terms),(enabled:!t,id:&#039;2&#039;,params:(customLabel:State,field:state,order:desc,orderBy:_term,size:3),schema:segment,type:terms)),params:(addLegend:!t,addTimeMarker:!f,addTooltip:!t,categoryAxes:!((id:CategoryAxis-1,labels:(show:!t,truncate:100),position:bottom,scale:(type:linear),show:!t,style:(),title:(),type:category)),grid:(categoryLines:!f,style:(color:%23eee)),legendPosition:right,seriesParams:!((data:(id:&#039;1&#039;,label:&#039;Sum+of+State+Duration&#039;),drawLinesBetweenPoints:!t,mode:stacked,show:true,showCircles:!t,type:histogram,valueAxis:ValueAxis-1)),times:!(),type:histogram,valueAxes:!((id:ValueAxis-1,labels:(filter:!f,rotate:0,show:!t,truncate:100),name:LeftAxis-1,position:left,scale:(mode:normal,type:linear),show:!t,style:(),title:(text:&#039;Sum+of+State+Duration&#039;),type:value))),title:&#039;State+Report+Prod&#039;,type:histogram))"
												+ "' height='"
												+ 100
												+ "%' width='"
												+ 100
												+ "%' style='min-height:700px'></iframe>";

										// (group_name:TRIOTE_1_1 AND csi:mn-cse
										// AND app_id:LAMP_0) OR
										// (group_name:TRIOTE_1_1 AND csi:mn-cse
										// AND app_id:LAMP_1)

										if (reportType == "consumption") {
											$("#kibanaPanel")
													.append(kibanaSrc1);
										} else if (reportType == "dimlevel") {
											$("#kibanaPanel")
													.append(kibanaSrc2);
										} else if (reportType == "state") {
											$("#kibanaPanel")
													.append(kibanaSrc3);
										}

									});
				});

function readTextFile(file) {
	$.ajax({
		url : file,
		success : function(data) {
			console.log(data);
		}
	});
}

function resetSelectOptions(select) {
	while (select.options.length > 0) {
		select.remove(0);
	}
}
function getContextPath() {
	return window.location.pathname.substring(0, window.location.pathname
			.indexOf("/", 2));
}