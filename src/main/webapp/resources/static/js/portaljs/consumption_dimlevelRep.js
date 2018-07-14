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
					readTextFile("resources/static/config/applicationConfig.txt");

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
															+ "/consumption-dimlevelReport.html/ajax?operation=requestGWsByGWGroup&gwgname="
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
																+ "/consumption-dimlevelReport.html/ajax?operation=getDevices&selectedGateways="
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
										for (i = 0; i < selectedDevices.length; i++) {
											var deviceValArr = selectedDevices[i]
													.split("|");

											queryStr += "(group_name:"
													+ selectedGatewayGroup
													+ " AND csi:"
													+ deviceValArr[1]
													+ " AND app_id:"
													+ deviceValArr[0] + ")";
											if (selectedDevices.length > i + 1) {
												queryStr += " OR ";
											}
										}

										var kibanaPanel = document
												.getElementById("kibanaPanel");
										kibanaPanel.innerHTML = '';

										// var kibanaSrc = "<iframe
										// src='http://localhost:5601/app/kibana#/visualize/edit/2df993b0-ea25-11e7-b4fa-95ae4683a8b4?embed=true&amp;_g=(refreshInterval:(display:Off,pause:!f,value:0),"
										// +
										// "time:(from:&#039;2017-12-17T21:00:00.000Z&#039;,mode:absolute,to:&#039;2017-12-26T20:59:59.999Z&#039;))&amp;_a=(filters:!(),linked:!f,query:(language:lucene,query:'(group_name:TRIOTE_1_1+AND+csi:mn-cse+AND+app_id:LAMP_0)+OR+(group_name:TRIOTE_1_1+AND+csi:mn-cse+AND+app_id:LAMP_1)'),uiState:(spy:(mode:(fill:!f,name:!n))),vis:(aggs:!((enabled:!t,id:'2',params:(customLabel:Level,field:level,order:desc,orderBy:'3',size:5),schema:group,type:terms),(enabled:!t,id:'3',params:(customLabel:'Count+of+Level+Value'),schema:metric,type:count),(enabled:!t,id:'4',params:(customInterval:'2h',customLabel:'Date+per+hour',extended_bounds:(),field:cdate,interval:h,min_doc_count:1,row:!f),schema:split,type:date_histogram),(enabled:!t,id:'5',params:(customLabel:Consumption,field:consumption),schema:metric,type:sum)),params:(addLegend:!t,addTimeMarker:!f,addTooltip:!t,categoryAxes:!((id:CategoryAxis-1,labels:(show:!t,truncate:100),position:bottom,scale:(type:linear),show:!t,style:(),title:(),type:category)),grid:(categoryLines:!f,style:(color:%23eee)),legendPosition:right,seriesParams:!((data:(id:'3',label:'Count+of+Level+Value'),drawLinesBetweenPoints:!t,mode:stacked,show:!t,showCircles:!t,type:histogram,valueAxis:ValueAxis-1),(data:(id:'5',label:Consumption),drawLinesBetweenPoints:!t,lineWidth:5,mode:normal,show:!t,showCircles:!t,type:line,valueAxis:ValueAxis-2)),times:!(),type:histogram,valueAxes:!((id:ValueAxis-1,labels:(filter:!f,rotate:0,show:!t,truncate:100),name:LeftAxis-1,position:left,scale:(mode:normal,type:linear),show:!t,style:(),title:(text:'Count+of+Level+Value'),type:value),(id:ValueAxis-2,labels:(filter:!f,rotate:0,show:!t,truncate:100),name:RightAxis-1,position:right,scale:(mode:normal,type:linear),show:!t,style:(),title:(text:Consumption),type:value))),title:'Consumption+an+Dim+Level+Graph+over+Create+Date',type:histogram))"
										// + "' height='"
										// + 700
										// + "' width='"
										// + 1200
										// + "'></iframe>";
										//
										// console.log(kibanaSrc);

										// var kibanaSrc2 = "<iframe src='"
										// +
										// "http://localhost:5601/app/kibana#/visualize/edit/2e0e2d20-ea25-11e7-b4fa-95ae4683a8b4?embed=true&_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:&#039;2017-12-16T21:00:00.000Z&#039;,mode:absolute,to:&#039;2017-12-27T20:59:59.999Z&#039;))"
										// +
										// "&_a=(filters:!((&#039;$state&#039;:(store:appState),meta:(alias:!n,disabled:!f,index:&#039;12e9b760-e70c-11e7-86fb-71c242476bda&#039;,key:group_name,negate:!f,params:(query:TRIOTE_1_3,type:phrase),type:phrase,value:TRIOTE_1_3)"
										// +
										// ",query:(match:(group_name:(query:TRIOTE_1_3,type:phrase))))),linked:!f,query:(language:lucene,query:&#039;&#039;),uiState:(spy:(mode:(fill:!f,name:!n))),vis:(aggs:!((enabled:!t,id:&#039;2&#039;,params:(customLabel:Level,field:level,order:desc,orderBy:&#039;3&#039;,size:5),schema:group,type:terms),(enabled:!t,id:&#039;3&#039;,params:(customLabel:&#039;Sum+of+Level&#039;,field:level),schema:metric,type:sum),(enabled:!t,id:&#039;4&#039;,params:(customInterval:&#039;2h&#039;,customLabel:&#039;Date+per+hour&#039;,extended_bounds:(),field:cdate,interval:h,min_doc_count:1,row:!f),schema:split,type:date_histogram),(enabled:!t,id:&#039;5&#039;,params:(customLabel:Consumption,field:consumption),schema:metric,type:sum)),params:(addLegend:!t,addTimeMarker:!f,addTooltip:!t,categoryAxes:!((id:CategoryAxis-1,labels:(show:!t,truncate:100),position:bottom,scale:(type:linear),show:!t,style:(),title:(),type:category)),grid:(categoryLines:!f,style:(color:%23eee)),legendPosition:right,seriesParams:!((data:(id:&#039;3&#039;,label:&#039;Sum+of+Level&#039;),drawLinesBetweenPoints:!t,mode:stacked,show:!t,showCircles:!t,type:histogram,valueAxis:ValueAxis-1),(data:(id:&#039;5&#039;,label:Consumption),drawLinesBetweenPoints:!t,lineWidth:5,mode:normal,show:!t,showCircles:!t,type:line,valueAxis:ValueAxis-2)),times:!(),type:histogram,valueAxes:!((id:ValueAxis-1,labels:(filter:!f,rotate:0,show:!t,truncate:100),name:LeftAxis-1,position:left,scale:(mode:normal,type:linear),show:!t,style:(),title:(text:&#039;Sum+of+Level&#039;),type:value),(id:ValueAxis-2,labels:(filter:!f,rotate:0,show:!t,truncate:100),name:RightAxis-1,position:right,scale:(mode:normal,type:linear),show:!t,style:(),title:(text:Consumption),type:value))),title:&#039;Consumption+an+Dim+Level+Graph+over+Create+Date&#039;,type:histogram))"
										// + "' height='" + 800
										// + "' width='" + 1200
										// + "'></iframe>";
										//
										// console.log(kibanaSrc2);

										var kibanaSrc3 = "<iframe src='"
												+ window.elkUrl
												+ "/app/kibana#/visualize/edit/2df993b0-ea25-11e7-b4fa-95ae4683a8b4?embed=true&_g=(refreshInterval:(display:Off,pause:!f,value:0),"
												+ "time:("
												+ timeStr
												+ "))&_a=(filters:!(),linked:!f,query:(language:lucene,query:&#039;"
												+ queryStr
												+ "&#039;),uiState:(spy:(mode:(fill:!f,name:!n))),vis:(aggs:!((enabled:!t,id:&#039;2&#039;,params:(customLabel:Level,field:level,order:desc,orderBy:&#039;3&#039;,size:5),schema:group,type:terms),(enabled:!t,id:&#039;3&#039;,params:(customLabel:&#039;Count+of+Level+Value&#039;),schema:metric,type:count),(enabled:!t,id:&#039;4&#039;,params:(customInterval:&#039;2h&#039;,customLabel:&#039;Date+per+hour&#039;,extended_bounds:(),field:&#039;@timestamp&#039;,interval:auto,min_doc_count:1,row:!f),schema:split,type:date_histogram),(enabled:!t,id:&#039;5&#039;,params:(customLabel:Consumption,field:consumption),schema:metric,type:sum)),params:(addLegend:!t,addTimeMarker:!f,addTooltip:!t,categoryAxes:!((id:CategoryAxis-1,labels:(show:!t,truncate:100),position:bottom,scale:(type:linear),show:!t,style:(),title:(),type:category)),grid:(categoryLines:!f,style:(color:%23eee)),legendPosition:right,seriesParams:!((data:(id:&#039;3&#039;,label:&#039;Count+of+Level+Value&#039;),drawLinesBetweenPoints:!t,mode:stacked,show:!t,showCircles:!t,type:histogram,valueAxis:ValueAxis-1),(data:(id:&#039;5&#039;,label:Consumption),drawLinesBetweenPoints:!t,lineWidth:5,mode:normal,show:!t,showCircles:!t,type:line,valueAxis:ValueAxis-2)),times:!(),type:histogram,valueAxes:!((id:ValueAxis-1,labels:(filter:!f,rotate:0,show:!t,truncate:100),name:LeftAxis-1,position:left,scale:(mode:normal,type:linear),show:!t,style:(),title:(text:&#039;Count+of+Level+Value&#039;),type:value),(id:ValueAxis-2,labels:(filter:!f,rotate:0,show:!t,truncate:100),name:RightAxis-1,position:right,scale:(mode:normal,type:linear),show:!t,style:(),title:(text:Consumption),type:value))),title:&#039;Consumption+an+Dim+Level+Graph+over+Create+Date&#039;,type:histogram))"
												+ "' height='" + 700
												+ "' width='" + 1200
												+ "'></iframe>";
										console.log(queryStr);
										// console.log(kibanaSrc3);
										$("#kibanaPanel").append(kibanaSrc3);

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