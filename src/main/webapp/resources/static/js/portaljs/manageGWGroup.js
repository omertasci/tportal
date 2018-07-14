var parsed_qs;
var ctxPath = getContextPath();

// $(window).on("load", function() {
// var con
// });

$(document).ready(function() {
	$('.multiselect').multiselect();

	prepareHtmlObjects();
});

$(document)
		.on(
				"click",
				"#generateGWGroup",
				function(event) {
					var gwgDisplayName = $(
							"#generateGWGroupModal #gwgDisplayName").val();
					var gwgDescription = $(
							"#generateGWGroupModal #gwgDescription").val();
					var resourceSelect = document
							.getElementById("multiselect_to_1_gen");
					var resources = "";
					for (i = 0; i < multiselect_to_1_gen.options.length; i++) {
						resources += multiselect_to_1_gen.options[i].value
								+ ",";
					}
					if (resources.indexOf(",") > 0) {
						resources = resources.substring(0,
								resources.length - 1);
					}

					var privSelect = "";

					$
							.ajax({
								type : "POST",
								url : ctxPath + "/manageGWGroup.html/ajax",								
								data: {
									operation:"createGatewayGroup",
									resources:resources,
									privileges:privSelect,
									displayName:gwgDisplayName,
									description:gwgDescription
								},
								success : function(data) {

									var resource = JSON.parse(data);

									if (resource.model
											.hasOwnProperty("message")) {
										alertify.error(resource.model.message);
										
									} else {
										if(resource.model.hasOwnProperty("result")){
											var res=resource.model.result;
										alertify.success(res);
										}
										$('#basicExample').load(document.URL +  ' #basicExample'); 
									}
									$('#generateGWGroupModal').modal('toggle');
								},
								error : function(e) {
									alertify.error(resource.model.message);
								}
							});
				});

$(document).on(
		"click",
		"#generateGWGroupModalBtn",
		function(event) {

			$.ajax({
				type : "GET",
				url : ctxPath + "/manageGWGroup.html/ajax"
						+ "?operation=getGWGroupModalAttributes",
				contentType : "application/json; charset=utf-8",
				beforeSend : function() {
				},
				headers : {
					"Accept" : "application/json"
				},
				success : function(data) {		
					
					var resource = JSON.parse(data).model;
					
					if(resource.hasOwnProperty("message")){
						alertify.error(resource.message);
					}
					
					var resourceSelect = document.getElementById("resourceSelect");
					resetSelectOptions(resourceSelect);
					var resourceOptions = resource.remoteCSEList;
					
					var userSelect = document
					.getElementById("multiselect_to_1_gen");
					
				     for (i = 0; i < userSelect.length; i++ ) {
				         for( var key in resourceOptions){
				          if(userSelect.options[i].value==resourceOptions[key].ri){
				           resourceOptions.splice(key,1);
				           break;
				          }
				        }
				      }
					
					for ( var key in resourceOptions) {
						if (resourceOptions.hasOwnProperty(key)) {
								
							var opt = resourceOptions[key];
							var el = document.createElement("option");
							el.textContent = opt.rn;
							el.value = "rn#" + opt.rn + "#_#ri#"+opt.ri +"#_#csi#" + opt.csi +"#_#huri#" + opt.huri;
							el.dataset.csi = opt.csi;
							el.dataset.huri = opt.huri;
							resourceSelect.appendChild(el);
						}
					}
					
				},
				error : function(e) {
					console.log("ERROR: ", e);
				}
			});

		});

$('#generateGWGroupModal').on('shown.bs.modal', function() {

	$('#resourceSelect').selectpicker('refresh');

});

// -----------------------------------

$(document)
		.on(
				"click",
				"#modalGWGBtn",
				function(event) {

					var gwgcseDisplaysStr = $(this).data('object-gwgcsedisplays');
					var objectgwgName = $(this).data('object-gwgname');
					var objectgwgDisplayName = $(this).data('object-gwgdisplayname');
					var objectgwgDesciption= $(this).data('object-gwgdescription');
					var objectgwgUsersStr = $(this).data('object-gwgusers');
					var objectcreatedby = $(this).data('object-createdby');
					var objectcreatedbyid = $(this).data('object-createdbyid');
					var resource = {};

					$.ajax({
						type : "GET",
						url : ctxPath + "/manageGWGroup.html/ajax"
								+ "?operation=getResources",
						async : false,
						contentType : "application/json; charset=utf-8",
						beforeSend : function() {
						},
						headers : {
							"Accept" : "application/json"
						},
						success : function(data) {

							resource.remoteCSEList = data.model.remoteCSEList;
						},
						error : function(e) {
							console.log("ERROR: ", e);
						}
					});
					$.ajax({
						type : "GET",
						url : ctxPath + "/manageGWGroup.html/ajax"
								+ "?operation=getUsers",
						async : false,
						contentType : "application/json; charset=utf-8",
						beforeSend : function() {
						},
						headers : {
							"Accept" : "application/json"
						},
						success : function(data) {

							resource.userList = data.model.userList;
						},
						error : function(e) {
							console.log("ERROR: ", e);
						}
					});

					$("#modalGWGChange")
							.on(
									'show.bs.modal',
									function(event) {

										// var button = $(event.relatedTarget);

										var gwgcseDisplaysArr = convertJsonArr(gwgcseDisplaysStr);

										var objectgwgUsersArr = convertJsonArr(objectgwgUsersStr);

										var gwgName = document
												.getElementById("gwgNameU");
										gwgName.value = objectgwgName;

										var gwgNameD = document
												.getElementById("gwgNameD");
										gwgNameD.value = objectgwgDisplayName;

										var gwgDescriptionU = document
										.getElementById("gwgDescriptionU");
										gwgDescriptionU.value = objectgwgDesciption;
								
										var gwgUserU = document
												.getElementById("gwgUserU");
										gwgUserU.value = objectcreatedby
												.toString();

										var select = document
												.getElementById("resourceList_U");
										resetSelectOptions(select);
										var options = resource.remoteCSEList;

										var select2 = document
												.getElementById("multiselect_to_1_U");
										resetSelectOptions(select2);
										var select2Options = gwgcseDisplaysArr;

										var fullUserList = document
												.getElementById("userList_U");
										resetSelectOptions(fullUserList);
										var fullUserOptions = resource.userList;

										var selectedUsers = document
												.getElementById("multiselect_to_2_U");
										resetSelectOptions(selectedUsers);
										var selectedUsersOptions = objectgwgUsersArr;

										for ( var key in options) {
											if (options.hasOwnProperty(key)) {
												var opt = options[key];
												var el = document
														.createElement("option");
												el.textContent = opt.rn;
												el.value = opt.ri;												
												
												var tmpObj = select2Options.filter(e => e.gwgcseid == opt.ri);
												
												if (tmpObj.length <= 0 ) {
													select.appendChild(el);
												}
												
											}
										}

										for ( var key in select2Options) {
											if (select2Options
													.hasOwnProperty(key)) {
												var opt = select2Options[key];
												var el = document
														.createElement("option");
												el.textContent = opt.cseName;
												el.value = opt.gwgcseid;
												select2.appendChild(el);
											}
										}

										for ( var key in fullUserOptions.values) {
											if (fullUserOptions.values
													.hasOwnProperty(key)) {
												var opt = fullUserOptions.values[key].nameValuePairs;
												var el = document
														.createElement("option");
												el.textContent = opt.user_first_name
														+ " "
														+ opt.user_last_name;
												el.value = opt.user_id;
												var tmpObj = selectedUsersOptions.filter(e => e.gwgUserId == opt.user_id);
												
												if (tmpObj.length <= 0 ) {
													fullUserList.appendChild(el);
												}
											}
										}
										for ( var key in selectedUsersOptions) {
											if (selectedUsersOptions
													.hasOwnProperty(key)) {
												var opt = selectedUsersOptions[key];
												var el = document
														.createElement("option");
												el.textContent = opt.gwgUserName;
												el.value = opt.gwgUserId;
												selectedUsers.appendChild(el);
											}
										}

									});
					$('#modalGWGChange').modal('show');
				});

$('#modalGWGChange').on('show.bs.modal', function() {

	$('#resourceList_U').selectpicker('refresh');
	$('#userList_U').selectpicker('refresh');
	$('#multiselect_to_1_U').selectpicker('refresh');
	$('#multiselect_to_2_U').selectpicker('refresh');
});

$(document)
		.on(
				"click",
				"#updateGWG",
				function(event) {
					var gwgName = $("#modalGWGChange #gwgNameU").val();
					var gwgDisplayName = $("#modalGWGChange #gwgNameD").val();
					var gwgUser = $("#modalGWGChange #gwgUserU").val();
					var gwgDescriptionU = $("#modalGWGChange #gwgDescriptionU").val();
					var multiselect_to_1 = document
							.getElementById("multiselect_to_1_U");
					
					var multiselect_to_2 = document
					.getElementById("multiselect_to_2_U");

					var gateways = "";
					var selectedUsers = "";
					
					for (i = 0; i < multiselect_to_1.options.length; i++) {
						gateways += multiselect_to_1.options[i].value + ",";
					}
					if (gateways.indexOf(",") > 0) {
						gateways = gateways.substring(0, gateways.length - 1);
					}
					
					for (i = 0; i < multiselect_to_2.options.length; i++) {
						selectedUsers += multiselect_to_2.options[i].value + ",";
					}
					if (selectedUsers.indexOf(",") > 0) {
						selectedUsers = selectedUsers.substring(0, selectedUsers.length - 1);
					}

					$
							.ajax({
								type : "GET",
								url : ctxPath + "/manageGWGroup.html/ajax?operation=updateGWGroup&gwgName="
										+ gwgName
										+ "&gwgDisplayName="
										+ gwgDisplayName
										+ "&gwgUsers="
										+ selectedUsers + "&gateways=" + gateways+ "&description=" + gwgDescriptionU,

								contentType : "application/json; charset=utf-8",
								beforeSend : function() {
								},
								headers : {
									"Accept" : "application/json"
								},
								success : function(data) {
									var resource =data;
									if (resource.model
											.hasOwnProperty("message")) {
										alertify.error(resource.model.message);
									} else {
										$('#basicExample').load(document.URL +  ' #basicExample'); 
									}
									$('#modalGWGChange').modal('toggle');
									
								},
								error : function(e) {
									console.log("ERROR: ", e);
								}
							});
				});

function resetSelectOptions(select) {
	while (select.options.length > 0) {
		select.remove(0);
	}
}
function convertJsonArr(javaArrStr) {

	javaArrStr = javaArrStr.split("[").join("").split("]").join("");
	var javaArrStr2 = javaArrStr.split(" {").join("{").split("{").join("{'")
			.split("}").join("'}").split("=").join("':'").split(", ").join(
					"', '").split("'").join("\"");

	return jQuery.parseJSON('[' + javaArrStr2 + ']');
}

function parseJSON(data) {
	return window.JSON && window.JSON.parse ? window.JSON.parse(data)
			: (new Function("return " + data))();
}

function prepareHtmlObjects(query) {

	var query_string = location.search.substring(1);

	parsed_qs = parse_query_string(query_string);

	var ctx1 = "${pageContext.request.contextPath}";
    console.log("ctx1" + ctx1);

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

function isEmailAddress(email) {

	var isEmailValid = true;

	var verimail = new Comfirm.AlphaMail.Verimail();

	verimail.verify(email, function(status, message, suggestion) {
		if (status < 0) {
			isEmailValid = false;
			// Incorrect syntax!
			if (suggestion) {
				// But we might have a solution to this!
				console.log("Did you mean " + suggestion + "?");
			}
		} else {
			isEmailValid = true;
			// Syntax looks great!
			if (suggestion) {
				// But we're guessing that you misspelled something
				console.log("Did you mean " + suggestion + "?");
			}
		}
	});

	return isEmailValid;
}