var application;
var ctxPath = getContextPath();

$(document)
		.on(
				"click",
				"#generate",
				function(event) {
					var appName = $("#generateModal #appname").val();
					var maxUser = $("#generateModal #maxuser").val();
					var maxStorage = $("#generateModal #maxstorage").val();
					var maxUsage = $("#generateModal #maxusage").val();
					var companyId = $("#generateModal #company").val();
					var element = document.getElementById("iplist");
					var numberOfChildren = element.getElementsByTagName('div').length;

					console.log("numberOfChildren : " + numberOfChildren);
					var ips = "";
					for (var i = 1; i <= numberOfChildren; i++) {
						ips += document.getElementById("ip[" + i + "][type]").value;
						ips += ",";
						ips += document.getElementById("ip[" + i + "][text]").value;
						ips += ";";
					}
					ips = ips.substring(0, ips.length - 1);
					console.log("ips : " + ips);

					$
							.ajax({
								type : "GET",
								url : ctxPath + "/manageApplication.html/ajax?operation=createApplication&name="
										+ appName
										+ "&companyId="
										+ companyId
										+ "&maxuser="
										+ maxUser
										+ "&maxstorage="
										+ maxStorage
										+ "&maxusage="
										+ maxUsage
										+ "&iplist="
										+ ips,

								contentType : "application/json; charset=utf-8",
								beforeSend : function() {
								},
								headers : {
									"Accept" : "application/json"
								},
								success : function(data) {

									resource = data;
									location.reload();
								},
								error : function(e) {
									console.log("ERROR: ", e);
								}
							});
				});

$(document).on("click", "#generateModalBtn", function(event) {

	$.ajax({
		type : "GET",
		url : ctxPath + "/manageApplication.html/ajax" + "?operation=getCompanies",

		contentType : "application/json; charset=utf-8",
		beforeSend : function() {
		},
		headers : {
			"Accept" : "application/json"
		},
		success : function(data) {

			resource = data;
			console.log(data);
		},
		error : function(e) {
			console.log("ERROR: ", e);
		}
	});
	$("#generateModal").on('shown.bs.modal', function() {

		var select = document.getElementById("company");
		resetSelectOptions(select);
		var options = resource.model.compList;

		for (var i = 0; i < options.values.length; i++) {
			console.log(i + "  " + options[i]);
			var opt = options.values[i].nameValuePairs;
			var el = document.createElement("option");
			el.textContent = opt.company_name;
			el.value = opt.company_id;
			select.appendChild(el);
		}
		// $('#stateId').selectpicker('refresh');
	});

});

$('#generateModal').on('shown.bs.modal', function() {

	$('#company').selectpicker('refresh');

});

// ------------------------------------------------------------------------------

$(function() {

	$(document.body).on(
			'click',
			'.changeType',
			function() {
				$(this).closest('.ip-input').find('.type-text').text(
						$(this).text());
				$(this).closest('.ip-input').find('.type-input').val(
						$(this).data('type-value'));
			});

	$(document.body).on('click', '.btn-remove-ip', function() {
		$(this).closest('.ip-input').remove();
	});

	$('.btn-add-ip')
			.click(
					function() {

						var index = $('.ip-input').length + 1;

						$('.ip-list')
								.append(
										''
												+ '<div class="input-group ip-input">'
												+ '<span class="input-group-btn">'
												+ '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><span class="type-text">Type</span> <span class="caret"></span></button>'
												+ '<ul class="dropdown-menu" role="menu">'
												+ '<li><a class="changeType" href="javascript:;" data-type-value="IPv4">IPv4</a></li>'
												+ '<li><a class="changeType" href="javascript:;" data-type-value="IPv6">IPv6</a></li>'
												+ '</ul>'
												+ '</span>'
												+ '<input type="hidden" id="ip['
												+ index
												+ '][type]" name="ip['
												+ index
												+ '][type]" class="type-input" value="IPv4"></input>'
												+ '<input type="text" id="ip['
												+ index
												+ '][text]" name="ip['
												+ index
												+ '][text]" class="form-control" placeholder="Enter your ip address"></input>'
												+ '<span class="input-group-btn">'
												+ '<button class="btn btn-danger btn-remove-ip" type="button"><span class="glyphicon glyphicon-remove"></span></button>'
												+ '</span>'
												+ '<script>$("body .dropdown-toggle").dropdown(); </script>'
												+ '</div>');

					});
});

// ------------Update Modal Save Event------------------
$(document)
		.on(
				"click",
				"#updateApplicationModalBtn",
				function(event) {
					var appId = $("#updateModal #appIdU").val();
					var appName = $("#updateModal #appNameU").val();
					var status = $("#updateModal #appStatusU").val();
					var maxUser = $("#updateModal #appMaxUserU").val();
					var maxStorage = $("#updateModal #appMaxStorageU").val();
					var maxUsage = $("#updateModal #appMaxUsageU").val();
					var licence = $("#updateModal #licenceU").val();
					var companyId = $("#updateModal #companyU").val();
					var element = document.getElementById("iplistU");
					var numberOfChildren = element.getElementsByTagName('div').length;

					console.log("numberOfChildren : " + numberOfChildren);
					var ips = "";
					for (var i = 1; i <= numberOfChildren; i++) {
						ips += document.getElementById("ip[" + i + "][type]U").value;
						ips += ",";
						ips += document.getElementById("ip[" + i + "][text]U").value;
						ips += ";";
					}
					ips = ips.substring(0, ips.length - 1);
					console.log("ips : " + ips);

					$
							.ajax({
								type : "GET",
								url : ctxPath + "/manageApplication.html/ajax?operation=updateApplication&name="
										+ appName
										+ "&appId="
										+ appId
										+ "&companyId="
										+ companyId
										+ "&appStatus="
										+ status
										+ "&maxuser="
										+ maxUser
										+ "&maxstorage="
										+ maxStorage
										+ "&maxusage="
										+ maxUsage
										+ "&licence="
										+ licence + "&iplist=" + ips,

								contentType : "application/json; charset=utf-8",
								async : false,
								beforeSend : function() {
								},
								headers : {
									"Accept" : "application/json"
								},
								success : function(data) {

									resource = data;
									location.reload();
								},
								error : function(e) {
									console.log("ERROR: ", e);
								}
							});
				});

// --------------------Update Modal Display-------------------------------
$(document)
		.on(
				"click",
				"#updateModalBtn",
				function(event) {

					var objectappid = $(this).data('object-appid');
					var objectappname = $(this).data('object-appname');
					var objectstatus = $(this).data('object-status');
					var objectmaxuser = $(this).data('object-maxuser');
					var objectmaxstorage = $(this).data('object-maxstorage');
					var objectmaxusage = $(this).data('object-maxusage');
					var objectlicence = $(this).data('object-licence');
					var objectappiplist = $(this).data('object-appiplist');

					$.ajax({
						type : "GET",
						url : ctxPath + "/manageApplication.html/ajax"
								+ "?operation=getCompanies",

						contentType : "application/json; charset=utf-8",
						beforeSend : function() {
						},
						headers : {
							"Accept" : "application/json"
						},
						success : function(data) {

							resource = data;
							console.log(data);
						},
						error : function(e) {
							console.log("ERROR: ", e);
						}
					});

					$("#updateModal")
							.on(
									'shown.bs.modal',
									function(event) {

										var ipArr = objectappiplist.split("#");
										var ipObjArr = new Array();

										$('.ip-inputU').remove();

										for (i = 0; i < ipArr.length; i++) {
											if (ipArr[i].trim() != "") {
												var ipObj = {};
												var ipElements = ipArr[i]
														.split("|");
												ipObj["id"] = ipElements[0];
												ipObj["type"] = ipElements[1];
												ipObj["adr"] = ipElements[2];
												ipObjArr.push(ipObj);

												$('.ip-listU')
														.append(
																''
																		+ '<div class="input-group ip-inputU">'
																		+ '<span class="input-group-btn">'
																		+ '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">'
																		+ '<span class="type-text">'
																		+ ipObj["type"]
																		+ '</span> <span class="caret"></span></button>'
																		+ '<ul class="dropdown-menu" role="menu">'
																		+ '<li><a class="changeTypeU" href="javascript:;" data-type-value="IPv4">IPv4</a></li>'
																		+ '<li><a class="changeTypeU" href="javascript:;" data-type-value="IPv6">IPv6</a></li>'
																		+ '</ul>'
																		+ '</span>'
																		+ '<input type="hidden" id="ip['
																		+ i
																		+ '][type]U" name="ip['
																		+ i
																		+ '][type]U" class="type-input" value="'
																		+ ipObj["type"]
																		+ '"></input>'
																		+ '<input type="text" id="ip['
																		+ i
																		+ '][text]U" name="ip['
																		+ i
																		+ '][text]U" class="form-control" placeholder="'
																		+ ipObj["adr"]
																		+ '" value="'
																		+ ipObj["adr"]
																		+ '"></input>'
																		+ '<span class="input-group-btn">'
																		+ '<button class="btn btn-danger btn-remove-ipU" type="button"><span class="glyphicon glyphicon-remove"></span></button>'
																		+ '</span>'
																		+ '<script>$("body .dropdown-toggle").dropdown(); </script>'
																		+ '</div>');

											}
										}
										var appIdU = document
												.getElementById("appIdU");
										appIdU.value = objectappid;

										var appNameU = document
												.getElementById("appNameU");
										appNameU.value = objectappname;

										var appStatusU = document
												.getElementById("appStatusU");
										appStatusU.value = objectstatus ? 1 : 0;

										var appMaxUserU = document
												.getElementById("appMaxUserU");
										appMaxUserU.value = objectmaxuser;

										var appMaxStorageU = document
												.getElementById("appMaxStorageU");
										appMaxStorageU.value = objectmaxstorage;

										var appMaxUsageU = document
												.getElementById("appMaxUsageU");
										appMaxUsageU.value = objectmaxusage;

										var appLiceneU = document
												.getElementById("licenceU");
										appLiceneU.value = objectlicence

										var select = document
												.getElementById("companyU");
										resetSelectOptions(select);
										var options = resource.model.compList;

										for (var i = 0; i < options.values.length; i++) {
											console.log(i + "  " + options[i]);
											var opt = options.values[i].nameValuePairs;
											var el = document
													.createElement("option");
											el.textContent = opt.company_name;
											el.value = opt.company_id;
											select.appendChild(el);
										}

										// -----------Update Modal Event
										// Listener----------------

										$(document.body)
												.on(
														'click',
														'.changeTypeU',
														function() {
															$(this)
																	.closest(
																			'.ip-inputU')
																	.find(
																			'.type-text')
																	.text(
																			$(
																					this)
																					.text());
															$(this)
																	.closest(
																			'.ip-inputU')
																	.find(
																			'.type-input')
																	.val(
																			$(
																					this)
																					.data(
																							'type-value'));
														});

										$(document.body).on(
												'click',
												'.btn-remove-ipU',
												function() {
													$(this).closest(
															'.ip-inputU')
															.remove();
												});

										$('.btn-add-ipU')
												.click(
														function() {

															// var index =
															// $('.ip-inputU').length
															// + 1;

															var element = document
																	.getElementById("iplistU");
															var numberOfChildren = element
																	.getElementsByTagName('div').length;
															var index = numberOfChildren + 1;

															$('.ip-listU')
																	.append(
																			''
																					+ '<div class="input-group ip-inputU">'
																					+ '<span class="input-group-btn">'
																					+ '<button type="button" class="btn btn-default dropdown-toggleU" data-toggle="dropdown" aria-expanded="false"><span class="type-text">Type</span> <span class="caret"></span></button>'
																					+ '<ul class="dropdown-menu" role="menu">'
																					+ '<li><a class="changeTypeU" href="javascript:;" data-type-value="IPv4">IPv4</a></li>'
																					+ '<li><a class="changeTypeU" href="javascript:;" data-type-value="IPv6">IPv6</a></li>'
																					+ '</ul>'
																					+ '</span>'
																					+ '<input type="hidden" id="ip['
																					+ index
																					+ '][type]U" name="ip['
																					+ index
																					+ '][type]U" class="type-input" value="IPv4"></input>'
																					+ '<input type="text" id="ip['
																					+ index
																					+ '][text]U" name="ip['
																					+ index
																					+ '][text]U" class="form-control" placeholder="Enter your ip address"></input>'
																					+ '<span class="input-group-btn">'
																					+ '<button class="btn btn-danger btn-remove-ipU" type="button"><span class="glyphicon glyphicon-remove"></span></button>'
																					+ '</span>'
																					+ '<script>$("body .dropdown-toggleU").dropdown(); </script>'
																					+ '</div>');

														});

									});

					$('#updateModal').modal('show');
				});

$('#updateModal').on('shown.bs.modal', function() {

});

// ------------------------------------------------------------------------------

// ------------------------------------------------------------------------------

function resetSelectOptions(select) {
	while (select.options.length > 0) {
		select.remove(0);
	}
}

function getContextPath() {
	return window.location.pathname.substring(0, window.location.pathname.indexOf("/",2));
}

/*---------------------------------datatables-------------------------------*/
$(function() {
	$('#applicationTbl')
			.DataTable(
					{
						dom : 'Bfrtip',
						buttons : [ 'copy', 'csv', 'excel', 'pdf', 'print' ],
						"aaData" : applicationList,
						"aoColumns" : [
								{
									"mDataProp" : "appname"
								},
								{
									"mDataProp" : "appli"
								},
								{
									"mDataProp" : "ss"
								},
								{
									"mDataProp" : "maxuser"
								},
								{
									"mDataProp" : "maxstorage"
								},
								{
									"mDataProp" : "maxusage"
								},
								{
									"mDataProp" : "create_date"
								},
								{
									"mDataProp" : "update_date"
								},
								{
									"mDataProp" : "createdBy"
								},
								{
									"mDataProp" : "updatedBy"
								},
								{

									"render" : function(data, type, row, meta) {

										var iplist = row.appiplist;
										var strComboboxHtml = '';

										for (i = 0; i < iplist.length; i++) {
											strComboboxHtml += '<div>';
											strComboboxHtml += '<a data-ipid="'
													+ row.appiplist[i].ipid
													+ '" data-iptype="'
													+ row.appiplist[i].type
													+ '" data-ipadr="'
													+ row.appiplist[i].ipadr
													+ '">'
													+ row.appiplist[i].type
													+ '/'
													+ row.appiplist[i].ipadr
													+ '</a>';
											strComboboxHtml += '</div>';

										}

										strComboboxHtml += '';

										return strComboboxHtml;
									}
								},
								{

									"targets" : 0,
									"render" : function(data, type, row, meta) {

										var iplist = row.appiplist;
										var datiplist = '';

										for (i = 0; i < iplist.length; i++) {
											datiplist += '#'
													+ row.appiplist[i].ipid
													+ '|'
													+ row.appiplist[i].type
													+ '|'
													+ row.appiplist[i].ipadr;
										}

										return '<button id="updateModalBtn" class="btn btn-success"'
												+ 'data-target="#updateModal"'
												+ 'data-original-title="" data-toggle="modal" title=""'
												+ 'data-object-appid="'
												+ row.appid
												+ '" '
												+ 'data-object-appname="'
												+ row.appname
												+ '" '
												+ 'data-object-status="'
												+ row.ss
												+ '" '
												+ 'data-object-maxuser="'
												+ row.maxuser
												+ '" '
												+ 'data-object-maxstorage="'
												+ row.maxstorage
												+ '" '
												+ 'data-object-maxusage="'
												+ row.maxusage
												+ '" '
												+ 'data-object-licence="'
												+ row.appli
												+ '" '
												+ 'data-object-appiplist="'
												+ datiplist
												+ '" '
												+ 'sec:authorize="hasAuthority(EDIT_APPLICATION) or  #strings.contains(#authentication.principal.roles,SUPERADMIN)">'
												+ 'Update'
												+ '</button>'
												+ '<!-- Modal -->'
												+ '<div class="modal fade" id="updateModal" tabindex="-1"'
												+ 'role="dialog" aria-labelledby="myModalLabel6" aria-hidden="true">'
												+ '<div class="modal-dialog">'
												+ '<div class="modal-content">'
												+ '<div class="modal-header">'
												+ '<button type="button" class="close" data-dismiss="modal"'
												+ 'aria-hidden="true">×'
												+ '</button>'
												+ '<h4 class="modal-title text-info" id="myModalLabel6">'
												+ 'Update Application</h4>'
												+ '</div>'
												+ '<div class="modal-body">'
												+ '<!-- content goes here -->'
												+ '<form>'
												+ '<div class="form-group-main">'
												+ '<label for="appIdU">App Id:</label>'
												+ '<input type="text" class="form-control-main-enabled"'
												+ 'id="appIdU" ></input>'
												+ '</div>'
												+ '<div class="form-group-main">'
												+ '<label for="appNameU">Name:</label>'
												+ '<input type="text" class="form-control-main-enabled"'
												+ 'id="appNameU" ></input>'
												+ '</div>'
												+ '<div class="form-group-main">'
												+ '<label for="appStatusU">Status:</label>'
												+ '<input type="number" class="form-control-main-enabled"'
												+ 'id="appStatusU" ></input>'
												+ '</div>'
												+ '<div class="form-group-main">'
												+ '<label for="appMaxUserU">Max User:</label>'
												+ '<input type="number" class="form-control-main-enabled"'
												+ 'id="appMaxUserU" ></input>'
												+ '</div>'
												+ '<div class="form-group-main">'
												+ '<label for="appMaxStorageU">Max Storage:</label>'
												+ '<input type="number" class="form-control-main-enabled"'
												+ 'id="appMaxStorageU" ></input>'
												+ '</div>'
												+ '<div class="form-group-main">'
												+ '<label for="appMaxUsageU">Max Usage:</label>'
												+ '<input type="number" class="form-control-main-enabled"'
												+ 'id="appMaxUsageU" ></input>'
												+ '</div>'
												+ '<div class="form-group-main">'
												+ '<label for="licenceU">Licence Key:</label>'
												+ '<input type="text" class="form-control-main-enabled"'
												+ 'id="licenceU" ></input>'
												+ '</div>'
												+ '<div class="form-group-main">'
												+ '<label for="companyU">Company:</label>'
												+ '<select class="form-control-main-enabled" id="companyU"></select>'
												+ '</div>'
												+ '<div class="form-group-main">'
												+ '<label class="col-sm-2 control-label">IP List:</label><br/>'
												+ '<div class="col-sm-10">'
												+ '<div id="iplistU" class="ip-listU">'
												+ '</div>'
												+ '<button type="button" class="btn btn-success btn-sm btn-add-ipU">'
												+ '<span class="glyphicon glyphicon-plus"></span>'
												+ 'Add IP'
												+ '</button>'
												+ '</div>'
												+ '</div>'
												+ '</form><br/><br/><br/><br/>'
												+ '</div>'
												+ '<div class="modal-footer">'
												+ '<button type="button" class="btn btn-danger"'
												+ 'data-dismiss="modal" data-original-title=""'
												+ 'title=""><i class="fa fa-times"></i> Close'
												+ '</button>'
												+ '<button id="updateApplicationModalBtn" type="button"'
												+ 'class="btn btn-success" data-original-title=""'
												+ 'title=""><i class="fa fa-save"></i> Update'
												+ '</button>'
												+ '</div>'
												+ '</div>'
												+ '</div>'
												+ '</div>';
									}
								} ]
					});
});