var ctxPath = getContextPath();
var markerCinDataList;

$(document).ready(function() {
	$('.selectpicker').selectpicker();
});

$(function() {
	var cinDataList = window.result;
	var markers = [];

	var gwgfilterSelect = document.getElementById("gwgFilterSelect");
	resetSelectOptions(gwgfilterSelect);

	var uniqueGwgNameArr = new Array();
	for ( var key in cinDataList) {
		if (cinDataList.hasOwnProperty(key)) {
			var opt = cinDataList[key].gwg;
			// var el = document.createElement("option");
			// el.textContent = opt.gwgdispname;
			// el.value = opt.gwgid;
			// gwgfilterSelect.appendChild(el);

			var existGwgName = uniqueGwgNameArr.find(function(e) {
				return e === opt.gwgname;
			});

			if (uniqueGwgNameArr.length <= 0 || existGwgName == null) {

				var tokensArr = new Array();
				tokensArr.push(opt.gwgname);

				for (i = 0; i < cinDataList.length; i++) {

					var existCSIToken = tokensArr.find(function(e) {
						return e === cinDataList[i].csi;
					});
					var existAPIToken = tokensArr.find(function(e) {
						return e === cinDataList[i].api;
					});

					if (cinDataList[i].gwg.gwgname == opt.gwgname
							&& existCSIToken == null) {
						tokensArr.push(cinDataList[i].csi);
					}
					if (cinDataList[i].gwg.gwgname == opt.gwgname
							&& existAPIToken == null) {
						tokensArr.push(cinDataList[i].api);
					}

				}

				var dataTokens = tokensArr.join(" ");

				$("#gwgFilterSelect").append(
						'<option value="' + opt.gwgname + '" data-tokens="'
								+ dataTokens + '" selected="">'
								+ opt.gwgdispname + '</option>');

				uniqueGwgNameArr.push(opt.gwgname);
			}
		}
	}
	$("#gwgFilterSelect").selectpicker("refresh");

	function initMap() {

		var centerLocation = new google.maps.LatLng(40.9243788, 29.3138737);

		var mapCanvas = document.getElementById('map');
		var mapOptions = {
			center : centerLocation,
			zoom : 11,
			panControl : false,
			scrollwheel : false,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		}
		var map = new google.maps.Map(mapCanvas, mapOptions);

		// var markerImage = 'marker.png';

		var markerImage = new Image(100, 100);
		markerImage.src = 'marker.png';

		var rotation1 = 0;
		var uniqueLocArr = new Array();
		var uniqueLocDataArr = new Array();

		for (i = 0; i < cinDataList.length; i++) {
			var locArr = cinDataList[i].location.split(",");
			var latitude = parseFloat(locArr[0]);
			var longtitude = parseFloat(locArr[1]);
			var location = new google.maps.LatLng(latitude, longtitude);
			var locationObj = {};

			var existLoc = uniqueLocArr.find(function(e) {
				return e.latitude === latitude && e.longtitude === longtitude;
			});

			if (uniqueLocArr.length > 0 && (existLoc == null)) {
				locationObj.latitude = latitude;
				locationObj.longtitude = longtitude;
				uniqueLocArr.push(locationObj);
			}

			if (uniqueLocArr.length <= 0) {
				locationObj.latitude = latitude;
				locationObj.longtitude = longtitude;
				uniqueLocArr.push(locationObj);
				// uniqueLocArr.push(location);
			}

		}

		for (j = 0; j < uniqueLocArr.length; j++) {

			var uniqueLocationDataObj = {};
			uniqueLocationDataObj.uniqueLoc = uniqueLocArr[j];
			uniqueLocationDataObj["uniqueLocData"] = new Array();

			for (i = 0; i < cinDataList.length; i++) {
				var locArr = cinDataList[i].location.split(",");
				var latitude = parseFloat(locArr[0]);
				var longtitude = parseFloat(locArr[1]);

				if (uniqueLocArr[j].latitude == latitude
						&& uniqueLocArr[j].longtitude == longtitude) {
					uniqueLocationDataObj["uniqueLocData"].push(cinDataList[i]);
				}

			}

			uniqueLocDataArr.push(uniqueLocationDataObj);

		}

		for (i = 0; i < uniqueLocDataArr.length; i++) {

			var location = new google.maps.LatLng(
					uniqueLocDataArr[i].uniqueLoc.latitude,
					uniqueLocDataArr[i].uniqueLoc.longtitude);

			var deviceCount = 0;
			var tempUniqueLocData = new Array();

			for (j = 0; j < uniqueLocDataArr[i].uniqueLocData.length; j++) {

				var existUniqueLocData = tempUniqueLocData.find(function(e) {
					return e === uniqueLocDataArr[i].uniqueLocData[j].cnt_id;
				});

				if (tempUniqueLocData.length <= 0 || existUniqueLocData == null) {
					deviceCount += 1;
					tempUniqueLocData
							.push(uniqueLocDataArr[i].uniqueLocData[j].cnt_id);
				}
			}

			var marker = new google.maps.Marker({
				position : location,
				map : map,
				label : deviceCount.toString(),
				icon : markerImage,
				customLocationData : uniqueLocDataArr[i].uniqueLocData
			});
			markers.push(marker);
		}

		for (k = 0; k < markers.length; k++) {
			var paramMarker = markers[k];
			new google.maps.event.addListener(
					paramMarker,
					'click',
					(function(paramMarker, k) {
						return function() {

							// console.log(paramMarker.customLocationData);
							markerCinDataList = paramMarker.customLocationData;

							$('#markerDeviceModal').modal('show');

							var modalTabContainer = document
									.getElementById("modalTabContainer");
							modalTabContainer.style.visibility = 'hidden';
							// modalTabContainer.style.display = 'none';

							$("#operationTbl").find('thead').remove();
							$("#operationTbl").find('tbody').remove();

							$("#deviceStatusInfo").find('div').remove();

							var deviceSelect = document
									.getElementById("deviceSelect");
							resetSelectOptions(deviceSelect);
							var null_el_C = document.createElement("option");
							null_el_C.textContent = "<-----NO VALUE----->";
							null_el_C.value = -1;
							deviceSelect.appendChild(null_el_C);

							var uniqueIdArr = new Array();

							for ( var key in markerCinDataList) {
								if (markerCinDataList.hasOwnProperty(key)) {
									var opt = markerCinDataList[key];
									var el = document.createElement("option");

									if ($.inArray(opt.id, uniqueIdArr) == -1) {
										uniqueIdArr.push(opt.id);
										el.textContent = opt.api + " ("
												+ opt.csi + ")";
										el.value = opt.id;
										deviceSelect.appendChild(el);
									}
								}
							}

							$('#deviceSelect')
									.change(
											function() {
												console.log(this.value);
												console.log(markerCinDataList);

												var selectValue = this.value;

												var existMarkerCinDataObj = markerCinDataList
														.find(function(e) {
															return e.id === parseInt(selectValue);
														});

												var gatewayName = document
														.getElementById("gatewayName");

												var resourceType = document
														.getElementById("resourceType");

												var location = document
														.getElementById("location");

												var cnt = document
														.getElementById("datacnt");

												var subscription = document
														.getElementById("subscription");

												var createDate = document
														.getElementById("createDate");
												
												var executionTime = document
												.getElementById("executionTimeRow");
												
												var desccnt = document
														.getElementById("desccnt");

												if (this.value == -1) {

													$("#operationTbl").find(
															'thead').remove();
													$("#operationTbl").find(
															'tbody').remove();

													$("#deviceStatusInfo")
															.find('div')
															.remove();

													var deviceStatusInfo = document
															.getElementById("deviceStatusInfo");
													deviceStatusInfo.style.visibility = 'hidden';
													deviceStatusInfo.style.display = 'none';

													gatewayName.value = "";
													resourceType.value = "";
													location.value = "";
													cnt.value = "";
													desccnt.value = "";
													subscription.value = "";
													createDate.value = "";
													executionTime.value = "";
												}

												if (this.value > -1) {
													modalTabContainer.style.visibility = 'visible';

													gatewayName.value = existMarkerCinDataObj.csi;
													resourceType.value = existMarkerCinDataObj.ty;
													location.value = existMarkerCinDataObj.location;
													cnt.value = existMarkerCinDataObj.cnt_id;
													subscription.value = existMarkerCinDataObj.subsciptionId;
													createDate.value = existMarkerCinDataObj.create_date;
													executionTime.value = existMarkerCinDataObj.execution_time;
													
													// var updateDate = document
													// .getElementById("updateDate");
													// updateDate.value =
													// markerCinDataList[0].update_date;

													var errorWrapper = document
															.getElementById("page-wrapper");
													errorWrapper.style.visibility = 'hidden';
													errorWrapper.style.display = 'none';

													var response;
													$
															.ajax({
																type : "GET",
																url : ctxPath
																		+ "/resourceMap.html/ajax?operation=fetchDeviceContent&cnt="
																		+ existMarkerCinDataObj.cnt_id,
																async : false,
																contentType : "application/json; charset=utf-8",
																beforeSend : function() {
																},
																headers : {
																	"Accept" : "application/json"
																},
																success : function(
																		data) {
																	response = data;
																	desccnt.value = response.model.dev.descriptor.resourceId;

																	var operationTbl = document
																			.getElementById("operationTbl");
																	operationTbl.style.visibility = 'visible';
																	operationTbl.style.display = 'block';

																	$(
																			"#operationTbl")
																			.find(
																					'tbody')
																			.remove();

																	for (j = 0; j < response.model.dev.descriptor.content.operationList.length; j++) {
																		var operation = response.model.dev.descriptor.content.operationList[j];

																		var rowHtml = "<tbody><tr>";
																		if (operation.inputType != "slider") {
																			rowHtml += "<td><a class='btn btn-default' onclick='doOperation( \" "
																					+ operation.opName
																					+ "\", \""
																					+ operation.opHref
																					+ "\" , \""
																					+ operation.isControl
																					+ "\""
																					+ " )'>"
																					+ operation.opName
																					+ "</a></td>";
																		}
																		if (operation.inputType == "slider") {
																			rowHtml += "<td><label for='dimLevel'>"
																					+ operation.opName
																					+ "</label><input	type='range' name='points' id='dimLevel' value='5' min='0' max='5' oninput='setDimLevel( \" "
																					+ operation.opName
																					+ "\", \""
																					+ operation.opHref
																					+ "\", \""
																					+ operation.isControl
																					+ "\""
																					+ ")'></input></td>";
																		}
																		rowHtml += "<td>"
																				+ operation.opHref
																				+ "</td>";
																		rowHtml += "<td>"
																				+ operation.isControl
																				+ "</td>";
																		rowHtml += "</tr></tbody>";

																		$(
																				"#operationTbl")
																				.append(
																						rowHtml);
																	}
																},
																error : function(
																		e) {

																	errorWrapper.style.visibility = 'visible';
																	errorWrapper.style.display = 'block';

																	var deviceStatusInfo = document
																			.getElementById("deviceStatusInfo");
																	deviceStatusInfo.style.visibility = 'hidden';
																	deviceStatusInfo.style.display = 'none';

																	var operationTbl = document
																			.getElementById("operationTbl");
																	operationTbl.style.visibility = 'hidden';
																	operationTbl.style.display = 'none';

																	var errorHeader = document
																			.getElementById("errorHeader");
																	errorHeader.innerHTML = e.responseJSON.error
																			+ " : "
																			+ e.status
																			+ "<i>!</i>";

																	var errorDesc = document
																			.getElementById("errorDesc");
																	errorDesc.innerHTML = "Operations of "
																			+ existMarkerCinDataObj.api
																			+ " could not be retrieved.";

																	var errorContent = document
																			.getElementById("errorContent");
																	errorContent.innerHTML = "The resource "
																			+ existMarkerCinDataObj.api
																			+ " is inactive or unreachable. <br/>Check the resource and the gateway which it is registered.";
																}
															});

												}
											});

						}
					})(paramMarker, k));
		}

	}

	google.maps.event.addDomListener(window, 'load', initMap);

	$(document).on("click", "#refresh", function(event) {
		var selectedGWGs = [];
		selectedGWGs = $('.selectpicker').val();
		// alert(selected);
		var existCinData;
		var cinDataListAfterRefresh = new Array();
		cinDataList = window.result;

		// for (var j = 0; j < selectedGWGs.length; j++) {
		//
		// for (var i = 0; i < cinDataList.length; i++) {
		// if (cinDataList[i].gwg.gwgid === parseInt(selectedGWGs[j])) {
		// cinDataListAfterRefresh.push(cinDataList[i]);
		// }
		// }
		// }

		for (var j = 0; j < selectedGWGs.length; j++) {

			for (var i = 0; i < cinDataList.length; i++) {
				if (cinDataList[i].gwg.gwgname === selectedGWGs[j]) {
					cinDataListAfterRefresh.push(cinDataList[i]);
				}
			}
		}

		cinDataList = cinDataListAfterRefresh;
		initMap();
		// google.maps.event.addDomListener(window, 'load', initMap);

	});

	// $("#createCompanyModal").on('shown.bs.modal', function() {
	//
	// console.log("marker modal is open");
	//
	// });

});

function doOperation(opName, opHref, isControl) {

	var stateArr = [ 'OFF', 'ON', 'ERROR' ];
	var dimLevelArr = [ '0%', '20%', '40%', '60%', '80%', '100%' ];

	$
			.ajax({
				type : "GET",
				url : ctxPath
						+ "/resourceMap.html/ajax?operation=doOperationOnClick&opName="
						+ opName + "&opHref=" + opHref + "&isControl="
						+ isControl, /* "/in-cse/in-name" */

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

					$("#deviceStatusInfo").find('div').remove();

					for (i = 0; i < response.model.getState.length; i++) {

						if (response.model.getState[i].name == "dimLevel") {

							displayText += response.model.getState[i].name
									+ " : "
									+ dimLevelArr[parseInt(response.model.getState[i].val)];

							var statusRowHtml = "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 list-group-item list-group-item-warning-new'>"
									+ "<a class='col-lg-6 col-md-6 col-sm-6 col-xs-6'>"
									+ response.model.getState[i].name
									+ "</a>"
									+ "<a class='col-lg-6 col-md-6 col-sm-6 col-xs-6'>"
									+ dimLevelArr[parseInt(response.model.getState[i].val)]
									+ "</a>" + "</div>";

							$("#deviceStatusInfo").append(statusRowHtml);
						} else if (response.model.getState[i].name == "state") {

							displayText += response.model.getState[i].name
									+ " : "
									+ stateArr[parseInt(response.model.getState[i].val)];

							var statusRowHtml = "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 list-group-item list-group-item-warning-new'>"
									+ "<a class='col-lg-6 col-md-6 col-sm-6 col-xs-6'>"
									+ response.model.getState[i].name
									+ "</a>"
									+ "<a class='col-lg-6 col-md-6 col-sm-6 col-xs-6'>"
									+ stateArr[parseInt(response.model.getState[i].val)]
									+ "</a>" + "</div>";

							$("#deviceStatusInfo").append(statusRowHtml);

						} else {
							displayText += response.model.getState[i].name
									+ " : " + response.model.getState[i].val;

							var statusRowHtml = "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 list-group-item list-group-item-warning-new'>"
									+ "<a class='col-lg-6 col-md-6 col-sm-6 col-xs-6'>"
									+ response.model.getState[i].name
									+ "</a>"
									+ "<a class='col-lg-6 col-md-6 col-sm-6 col-xs-6'>"
									+ response.model.getState[i].val
									+ "</a>"
									+ "</div>";

							$("#deviceStatusInfo").append(statusRowHtml);
						}

						if (i < response.model.getState.length - 1) {
							displayText += "<br>";
						}
					}
					
					var executionTimeRow = document
					.getElementById("executionTimeRow");
					executionTimeRow.value =response.model.executionTime;
					
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

function setDimLevel(opName, opHref, isControl) {

	var dimValue = document.getElementById("dimLevel").value;
	var stateArr = [ 'OFF', 'ON', 'ERROR' ];
	var dimLevelArr = [ '0%', '20%', '40%', '60%', '80%', '100%' ];

	$
			.ajax({
				type : "GET",
				url : ctxPath
						+ "/resourceMap.html/ajax?operation=setDimLevel&opName="
						+ opName + "&opHref=" + opHref + "&isControl="
						+ isControl + "&dimValue=" + dimValue, /* "/in-cse/in-name" */

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
					$("#deviceStatusInfo").find('div').remove();

					for (i = 0; i < response.model.getStateAfterSetDim.length; i++) {

						if (response.model.getStateAfterSetDim[i].name == "dimLevel") {

							displayText += response.model.getStateAfterSetDim[i].name
									+ " : "
									+ dimLevelArr[parseInt(response.model.getStateAfterSetDim[i].val)];

							var statusRowHtml = "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 list-group-item list-group-item-warning-new'>"
									+ "<a class='col-lg-6 col-md-6 col-sm-6 col-xs-6'>"
									+ response.model.getStateAfterSetDim[i].name
									+ "</a>"
									+ "<a class='col-lg-6 col-md-6 col-sm-6 col-xs-6'>"
									+ dimLevelArr[parseInt(response.model.getStateAfterSetDim[i].val)]
									+ "</a>" + "</div>";

							$("#deviceStatusInfo").append(statusRowHtml);
						} else if (response.model.getStateAfterSetDim[i].name == "state") {

							displayText += response.model.getStateAfterSetDim[i].name
									+ " : "
									+ stateArr[parseInt(response.model.getStateAfterSetDim[i].val)];

							var statusRowHtml = "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 list-group-item list-group-item-warning-new'>"
									+ "<a class='col-lg-6 col-md-6 col-sm-6 col-xs-6'>"
									+ response.model.getStateAfterSetDim[i].name
									+ "</a>"
									+ "<a class='col-lg-6 col-md-6 col-sm-6 col-xs-6'>"
									+ stateArr[parseInt(response.model.getStateAfterSetDim[i].val)]
									+ "</a>" + "</div>";

							$("#deviceStatusInfo").append(statusRowHtml);
						} else {
							displayText += response.model.getStateAfterSetDim[i].name
									+ " : "
									+ response.model.getStateAfterSetDim[i].val;

							var statusRowHtml = "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 list-group-item list-group-item-warning-new'>"
									+ "<a class='col-lg-6 col-md-6 col-sm-6 col-xs-6'>"
									+ response.model.getStateAfterSetDim[i].name
									+ "</a>"
									+ "<a class='col-lg-6 col-md-6 col-sm-6 col-xs-6'>"
									+ response.model.getStateAfterSetDim[i].val
									+ "</a>" + "</div>";

							$("#deviceStatusInfo").append(statusRowHtml);
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

function resetSelectOptions(select) {
	while (select.options.length > 0) {
		select.remove(0);
	}
}
function getContextPath() {
	return window.location.pathname.substring(0, window.location.pathname
			.indexOf("/", 2));
}