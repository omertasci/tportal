var ctxPath = getContextPath();
var markerCinDataList;

$(document).ready(function() {
	$('.selectpicker').selectpicker();
});

$(function() {
	var devices = window.devices;
	var markers = [];

	var gwgfilterSelect = document.getElementById("gwgFilterSelect");
	resetSelectOptions(gwgfilterSelect);

	var uniqueGwgNameArr = new Array();

	for ( var key in devices) {
		if (devices.hasOwnProperty(key)) {

			var opt = devices[key].gwg;

			var existGwgName = uniqueGwgNameArr.find(function(e) {
				return e === opt;
			});

			if (uniqueGwgNameArr.length <= 0 || existGwgName == null) {

				var tokensArr = new Array();
				tokensArr.push(opt);

				var dataTokens = tokensArr.join(" ");

				$("#gwgFilterSelect").append(
						'<option value="' + opt + '" data-tokens="'
								+ dataTokens + '" selected="">' + opt
								+ '</option>');

				uniqueGwgNameArr.push(opt);
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

		var markerImage = new Image(100, 100);
		markerImage.src = 'marker.png';

		var rotation1 = 0;
		var uniqueLocArr = new Array();
		var uniqueLocDataArr = new Array();

		for (i = 0; i < devices.length; i++) {
			var locArr = devices[i].proLn.split(",");
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

			for (i = 0; i < devices.length; i++) {
				var locArr = devices[i].proLn.split(",");
				var latitude = parseFloat(locArr[0]);
				var longtitude = parseFloat(locArr[1]);

				if (uniqueLocArr[j].latitude == latitude
						&& uniqueLocArr[j].longtitude == longtitude) {
					uniqueLocationDataObj["uniqueLocData"].push(devices[i]);
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
					return e === uniqueLocDataArr[i].uniqueLocData[j].ri;
				});

				if (tempUniqueLocData.length <= 0 || existUniqueLocData == null) {
					deviceCount += 1;
					tempUniqueLocData
							.push(uniqueLocDataArr[i].uniqueLocData[j].ri);
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

									if ($.inArray(opt.ri, uniqueIdArr) == -1) {
										uniqueIdArr.push(opt.ri);
										el.textContent = opt.pDSNm + " ("
												+ opt.gateway + ")";
										el.id = opt.ri;
										el.value = opt.ri;
										el.dataset.cnd = opt.cnd;
										el.dataset.gateway = opt.gateway;
										el.dataset.gwg = opt.gwg;
										el.dataset.huri = opt.huri;
										el.dataset.pDSNm = opt.pDSNm;
										el.dataset.pi = opt.pi;
										el.dataset.prDTe = opt.prDTe;
										el.dataset.proLn = opt.proLn;
										el.dataset.ri = opt.ri;
										el.dataset.rn = opt.rn;

										deviceSelect.appendChild(el);
									}
								}
							}

							$('#deviceSelect')
									.change(
											function() {

												event.preventDefault();

												var selectValue = this.value;

												var selectedOption = document
														.getElementById(selectValue);

												var gateway = document
														.getElementById("gateway");

												var pDSNm = document
														.getElementById("pDSNm");

												var ri = document
														.getElementById("ri");

												var proLn = document
														.getElementById("proLn");

												var prDTe = document
														.getElementById("prDTe");

												var cnd = document
														.getElementById("cnd");

												var huri = document
														.getElementById("huri");

												var pi = document
														.getElementById("pi");

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

													gateway.value = "";
													pDSNm.value = "";
													ri.value = "";
													proLn.value = "";
													prDTe.value = "";
													cnd.value = "";
													huri.value = "";
													pi.value = "";
												}

												else {
													modalTabContainer.style.visibility = 'visible';

													gateway.value = selectedOption.attributes
															.getNamedItem("data-gateway").value;
													pDSNm.value = selectedOption.attributes
															.getNamedItem("data-p-d-s-nm").value;
													ri.value = selectedOption.attributes
															.getNamedItem("data-ri").value;
													proLn.value = selectedOption.attributes
															.getNamedItem("data-pro-ln").value;
													prDTe.value = selectedOption.attributes
															.getNamedItem("data-pr-d-te").value;
													cnd.value = selectedOption.attributes
															.getNamedItem("data-cnd").value;
													huri.value = selectedOption.attributes
															.getNamedItem("data-huri").value;
													pi.value = selectedOption.attributes
															.getNamedItem("data-pi").value;

													var errorWrapper = document
															.getElementById("page-wrapper");
													errorWrapper.style.visibility = 'hidden';
													errorWrapper.style.display = 'none';

													var operationTblContent = "";
													var response;
													$
															.ajax({
																type : "GET",
																url : ctxPath
																		+ "/resourceMap.html/ajax?operation=fetchDeviceContent&huri="
																		+ selectedOption.attributes
																				.getNamedItem("data-huri").value,
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

																	var operationTbl = document
																			.getElementById("operationTbl");
																	operationTbl.style.visibility = 'visible';
																	operationTbl.style.display = 'block';

																	$(
																			"#operationTbl")
																			.find(
																					'tbody')
																			.remove();

																	for (j = 0; j < response.model.modulClassLs.length; j++) {
																		var modulClass = response.model.modulClassLs[j];
																		var isWritable = false;

																		var rowHtml = "<tbody style=\"width: 525px;\"><tr>";
																		rowHtml += "<td>"
																				+ modulClass.containerDefinition
																				+ "</td>";

																		rowHtml += "<td id=\""
																				+ modulClass.moduleType
																				+ "Row\" style=\"width: 200px;\">";

																		for (k = 0; k < modulClass.caList.length; k++) {

																			isWritable = modulClass.caList[k].writable;

																			if ((modulClass.caList[k].lastValue
																					.toLocaleLowerCase() == "true" || modulClass.caList[k].lastValue
																					.toLocaleLowerCase() == "false")
																					&& modulClass.caList[k].writable == true) {

																				rowHtml += "<div>"
																						+ "<label for=\""
																						+ modulClass.caList[k].name
																						+ "\">"
																						+ modulClass.caList[k].name
																						+ "</label><br>"

																						+ "<input data-onstyle=\"success\" data-offstyle=\"danger\" type=\"checkbox\" data-toggle=\"toggle\" data-on=\"TRUE\" data-off=\"FALSE\" data-lastvalue=\""
																						+ modulClass.caList[k].lastValue
																						+ "\" id=\""
																						+ modulClass.caList[k].name
																						+ "\" name=\""
																						+ modulClass.caList[k].name
																						+ "\">"
																						+ "</div>";

																			}

																			else if (modulClass.caList[k].writable == true) {

																				rowHtml += "<div>"
																						+ "<label for=\""
																						+ modulClass.caList[k].name
																						+ "\">"
																						+ modulClass.caList[k].name
																						+ "</label><br>"
																						+ "<input type=\"number\" style=\"background-color: #ece0e0;max-width: 60px;\" data-minvalue=\"null\" data-maxvalue=\"null\" id=\""
																						+ modulClass.caList[k].name
																						+ "\" name=\""
																						+ modulClass.caList[k].name
																						+ "\" value=\""
																						+ modulClass.caList[k].lastValue
																						+ "\">"
																						+ "<script>"
																						+ "// <![CDATA[ \n"
																						+ "	$(function() {"
																						+ "		  $('input').on('keyup', function() {"
																						+ "				    var val = parseInt($(this).val()),"
																						+ "					maxLimit = $(this).data('maxvalue'),"
																						+ "				   minLimit = $(this).data('minvalue');"
																						+ "					var returnVal = val;"
																						+ ""
																						+ "				    if(isNaN(val)){"
																						+ "				    	returnVal = 0;"
																						+ "							    }"
																						+ "				    if((!isNaN(val)) && (maxLimit != null)&& (maxLimit < val)){"
																						+ "				    	returnVal = maxLimit;"
																						+ "							    }"
																						+ "				    if((!isNaN(val)) && (minLimit != null)&&(minLimit > val)){"
																						+ "				    	returnVal = minLimit;"
																						+ "							    }"
																						+ ""
																						+ "				    $(this).val(returnVal);"
																						+ "				  });"
																						+ "				}); \n"
																						+ "		// ]]>"
																						+ "</script>"
																						+ "</div>";
																			}

																			else {
																				rowHtml += "<label class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\" style=\"background-color: #f1ec8f; text-align: center; text-transform: uppercase\" id=\""
																						+ modulClass.caList[k].name
																						+ "\">"
																						+ modulClass.caList[k].lastValue
																						+ "</label>";
																			}

																		}

																		rowHtml += "</td>";

																		rowHtml += "<td>";

																		if (isWritable) {
																			rowHtml += "<button id=\"updateModalBtn\" class=\"btn btn-info\" data-original-title=\"\" title=\"\" style=\"margin-top: 1em;\" "
																					+ "onclick=\"doExecute( '"
																					+ modulClass.huri
																					+ "','"
																					+ modulClass.moduleType
																					+ "' ,'"
																					+ modulClass.resourceId
																					+ "','"
																					+ modulClass.resourceName
																					+ "', '"
																					+ modulClass.containerDefinition
																					+ "' , '')\">Execute</button>";
																		}
																		rowHtml += "</td>";

																		rowHtml += "</tr></tbody>";

																		operationTblContent += rowHtml;
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

													$("#operationTbl")
															.append(
																	operationTblContent);

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

		var existdevice;
		var deviceListAfterRefresh = new Array();
		devices = window.devices;

		for (var j = 0; j < selectedGWGs.length; j++) {

			for (var i = 0; i < devices.length; i++) {
				if (devices[i].gwg === selectedGWGs[j]) {
					deviceListAfterRefresh.push(devices[i]);
				}
			}
		}

		devices = deviceListAfterRefresh;
		initMap();

	});

});

function doExecute(huri, moduleType, resourceId, resourceName,
		containerDefinition, anncHuri) {

	var huri = huri.substring(1);
	var moduleType = moduleType;
	var resourceId = resourceId;
	var resourceName = resourceName;
	var containerDefinition = containerDefinition;
	var anncHuri = anncHuri;

	var inputTypeMapping = {
		"checkbox" : "boolean",
		"number" : "integer",
		"text" : "string"
	};

	var putparams = "";
	var inputTagArr = document.getElementById(moduleType + "Row")
			.getElementsByTagName("input");
	for (var i = 0; i < inputTagArr.length; i++) {

		var paramName = inputTagArr[i].name;
		var paramType = inputTypeMapping[inputTagArr[i].type];
		var paramValue = inputTagArr[i].value;

		if (paramType == "boolean") {
			paramValue = $('#' + inputTagArr[i].id).prop("checked") == true;
		}

		putparams += "$" + paramName + "__" + paramValue + "__" + paramType;
	}

	putparams = putparams.substring(1);

	$.ajax({
		type : "GET",
		url : ctxPath + "/device.html/ajax?operation=updateModule&huri=" + huri
				+ "&moduleType=" + moduleType + "&resourceId=" + resourceId
				+ "&resourceName=" + resourceName + "&containerDefinition="
				+ containerDefinition + "&anncHuri=" + anncHuri + "&putparams="
				+ putparams,

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

function resetSelectOptions(select) {
	while (select.options.length > 0) {
		select.remove(0);
	}
}
function getContextPath() {
	return window.location.pathname.substring(0, window.location.pathname
			.indexOf("/", 2));
}