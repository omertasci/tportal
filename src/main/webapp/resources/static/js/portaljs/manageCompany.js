var ctxPath = getContextPath();

$(document)
		.on(
				"click",
				"#generate",
				function(event) {
					var companyCode = $("#createCompanyModal #companyCode")
							.val();
					var companyName = $("#createCompanyModal #companyName")
							.val();
					var parentID = $("#createCompanyModal #parentComp").val();
					var adminUserId = $("#createCompanyModal #adminUser").val();

					if (companyName == '' || companyName == null) {
						alertify.error("Company Name cannot be empty!");
						return;
					}

					if (companyCode == '' || companyCode == null) {
						alertify.error("Company Code cannot be empty!");
						return;
					}

					if (adminUserId < 0 || adminUserId == null) {
						alertify.error("Admin User cannot be empty!");
						return;
					}

					$
							.ajax({
								type : "GET",
								url : ctxPath
										+ "/manageCompany.html/ajax?operation=createCompany&companyName="
										+ companyName + "&companyCode="
										+ companyCode + "&parentID=" + parentID
										+ "&adminUserId=" + adminUserId,

								contentType : "application/json; charset=utf-8",
								beforeSend : function() {
								},
								headers : {
									"Accept" : "application/json"
								},
								success : function(data) {

									resource = data;
									// console.log(data);
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
		url : ctxPath + "/manageCompany.html/ajax" + "?operation=getCompanies",

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
		// var options = [ "1", "2", "3", "4", "12" ];
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
// ---------------------------

$(document).on(
		"click",
		"#createCompanyModalBtn",
		function(event) {

			$.ajax({
				type : "GET",
				url : ctxPath + "/manageCompany.html/ajax"
						+ "?operation=getCompanyModalAttributes",

				contentType : "application/json; charset=utf-8",
				beforeSend : function() {
				},
				headers : {
					"Accept" : "application/json"
				},
				success : function(data) {

					resource = data;
					console.log(data);
					
					var compSelect = document.getElementById("parentComp");
					resetSelectOptions(compSelect);
					var compOptions = resource.model.compList;

					var userSelect = document.getElementById("adminUser");
					resetSelectOptions(userSelect);
					var userOptions = resource.model.userList;

					var null_el_C = document.createElement("option");
					null_el_C.textContent = "<-----NO VALUE----->";
					null_el_C.value = -1;
					compSelect.appendChild(null_el_C);

					var null_el_U = document.createElement("option");
					null_el_U.textContent = "<-----NO VALUE----->";
					null_el_U.value = -1;
					userSelect.appendChild(null_el_U);

					for (var i = 0; i < compOptions.values.length; i++) {
						var opt = compOptions.values[i].nameValuePairs;
						var el = document.createElement("option");
						el.textContent = opt.company_name;
						el.value = opt.company_id;
						compSelect.appendChild(el);
					}
					for (var j = 0; j < userOptions.values.length; j++) {
						var opt = userOptions.values[j].nameValuePairs;
						var el = document.createElement("option");
						el.textContent = opt.user_first_name + " "
								+ opt.user_last_name;
						el.value = opt.user_id;
						userSelect.appendChild(el);
					}
					
				},
				error : function(e) {
					console.log("ERROR: ", e);
				}
			});

		});

$('#createCompanyModal').on('shown.bs.modal', function() {

	$('#parentComp').selectpicker('refresh');
	$('#adminUser').selectpicker('refresh');

});

// -----------------------------------

$(document).on(
		"click",
		"#updateModalBtn",
		function(event) {

			var objectId = $(this).data('object-id');
			var objectName = $(this).data('object-name');
			var objectCode = $(this).data('object-code');

			$.ajax({
				type : "GET",
				url : ctxPath + "/manageCompany.html/ajax"
						+ "?operation=getCompanyModalAttributes",

				contentType : "application/json; charset=utf-8",
				async : false,
				beforeSend : function() {
				},
				headers : {
					"Accept" : "application/json"
				},
				success : function(data) {
					resource = data;
				},
				error : function(e) {
					console.log("ERROR: ", e);
				}
			});
			$("#modalCompanyChange").on(
					'show.bs.modal',
					function(event) {

						// var button = $(event.relatedTarget);

						var companyId = document.getElementById("companyIdU");
						companyId.value = objectId;
						var companyName = document
								.getElementById("companyNameU");
						companyName.value = objectName;
						var companyCode = document
								.getElementById("companyCodeU");
						companyCode.value = objectCode;

						var parentSelect = document
								.getElementById("parentCompanyU");
						resetSelectOptions(parentSelect);

						var null_el_C = document.createElement("option");
						null_el_C.textContent = "<-----NO VALUE----->";
						null_el_C.value = -1;
						parentSelect.appendChild(null_el_C);

						var companyOptions = resource.model.compList.values;

						for ( var key in companyOptions) {
							if (companyOptions.hasOwnProperty(key)) {
								var opt = companyOptions[key].nameValuePairs;
								var el = document.createElement("option");
								if (opt.company_name != objectName
										&& opt.company_id != objectId) {

									el.textContent = opt.company_name;
									el.value = opt.company_id;
									parentSelect.appendChild(el);
								}
							}
						}

						var userSelect = document.getElementById("adminUserU");
						resetSelectOptions(userSelect);

						/*
						 * var null_el_U = document.createElement("option");
						 * null_el_U.textContent = "<-----NO VALUE----->";
						 * null_el_U.value = -1;
						 * userSelect.appendChild(null_el_U);
						 */

						var userOptions = resource.model.userList.values;

						for ( var key in userOptions) {
							if (userOptions.hasOwnProperty(key)) {
								var opt = userOptions[key].nameValuePairs;
								var el = document.createElement("option");
								el.textContent = opt.user_first_name + " "
										+ opt.user_last_name;
								el.value = opt.user_id;
								userSelect.appendChild(el);
							}
						}
					});
			$('#modalCompanyChange').modal('show');
		});

$('#modalCompanyChange').on('shown.bs.modal', function() {

	$('#parentCompanyU').selectpicker('refresh');
	$('#adminUserU').selectpicker('refresh');

});

$(document)
		.on(
				"click",
				"#updateCompany",
				function(event) {
					var companyId = $("#modalCompanyChange #companyIdU").val();
					var companyName = $("#modalCompanyChange #companyNameU")
							.val();
					var companyCode = $("#modalCompanyChange #companyCodeU")
							.val();
					var parentCompany = $("#modalCompanyChange #parentCompanyU")
							.val();
					var adminUser = $("#modalCompanyChange #adminUserU").val();

					$
							.ajax({
								type : "GET",
								url : ctxPath
										+ "/manageCompany.html/ajax?operation=updateCompany&companyId="
										+ companyId + "&companyName="
										+ companyName + "&companyCode="
										+ companyCode + "&parentCompany="
										+ parentCompany + "&adminUser="
										+ adminUser,

								contentType : "application/json; charset=utf-8",
								beforeSend : function() {
								},
								headers : {
									"Accept" : "application/json"
								},
								success : function(data) {
									resource = data;
									console.log("SUCCESS");
									location.reload();
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

function getContextPath() {
	return window.location.pathname.substring(0, window.location.pathname
			.indexOf("/", 2));
}