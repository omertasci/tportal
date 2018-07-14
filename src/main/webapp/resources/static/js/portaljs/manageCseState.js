var cseState;
var ctxPath = getContextPath();

$(document)
		.on(
				"click",
				"#generate",
				function(event) {
					var count = $("#generateModal #count").val();
					var companyId = $("#generateModal #company").val();
					// alert("Generate " + count + " states for " + company);

					$
							.ajax({
								type : "GET",
								url : ctxPath
										+ "/manageCSEState.html/ajax?operation=generateCSEStateEntity&count="
										+ count + "&companyId=" + companyId,

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

$(document).on(
		"click",
		"#generateModalBtn",
		function(event) {

			$.ajax({
				type : "GET",
				url : ctxPath + "/manageCSEState.html/ajax"
						+ "?operation=getCompanies",

				contentType : "application/json; charset=utf-8",
				beforeSend : function() {
				},
				headers : {
					"Accept" : "application/json"
				},
				success : function(data) {

					resource = JSON.parse(data);
					console.log(data);
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

				},
				error : function(e) {
					console.log("ERROR: ", e);
				}
			});

		});

$('#generateModal').on('shown.bs.modal', function() {

	$('#company').selectpicker('refresh');

});

$(document).on(
		"click",
		"#generateCSESModalBtn",
		function(event) {

			$.ajax({
				type : "GET",
				url : ctxPath + "/manageCSEState.html/ajax"
						+ "?operation=getCSEStateEntities",

				contentType : "application/json; charset=utf-8",
				beforeSend : function() {
				},
				headers : {
					"Accept" : "application/json"
				},
				success : function(data) {
					resource = data;
					if (data.model.messageError != null) {
						alertify.error(data.model.messageError);
					} else {
						alertify.success(data.model.messageSuccess);
					}
					console.log(data);
					console.log("success oldu");

				},
				error : function(e) {
					console.log("ERROR: ", e);
				}
			});
			$("#modalCSEStateChange").on('shown.bs.modal', function(event) {

				var button = $(event.relatedTarget);

				var objectSi = button.data('object-si');
				var objectCsi = button.data('object-csi'); // Extract
				var cseStateId = document.getElementById("cseStateIdU");
				cseStateId.value = objectSi;
				var csi = document.getElementById("csiU");
				csi.value = objectCsi;

				var select = document.getElementById("cseStateName");
				resetSelectOptions(select);
				// var options = [ "1", "2", "3", "4", "12" ];
				var options = resource.model.cseStateEnum;
				var csestateId = document.getElementById("csestateID");
				console.log(csestateId);

				for ( var key in options) {
					if (options.hasOwnProperty(key)) {
						var opt = options[key];
						var el = document.createElement("option");
						el.textContent = key;
						el.value = opt;
						select.appendChild(el);
					}
				}
				// $('#cseStateName').selectpicker('refresh');
			});

		});

$('#modalCSEStateChange').on('shown.bs.modal', function() {

	$('#cseStateName').selectpicker('refresh');

});
// --------------------------------------------
$(document)
		.on(
				"click",
				"#updateCSEState",
				function(event) {
					var cseStateId = $("#modalCSEStateChange #cseStateIdU")
							.val();
					var csi = $("#modalCSEStateChange #csiU").val();
					var stateName = $("#modalCSEStateChange #cseStateName")
							.val();

					$
							.ajax({
								type : "GET",
								url : ctxPath
										+ "/manageCSEState.html/ajax?operation=updateCSEState&cseStateId="
										+ cseStateId + "&csi=" + csi
										+ "&stateName=" + stateName,

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

// --------------------------------------------------------------------------------

$(document).on(
		"click",
		"#generateCSESModalBtn2",
		function(event) {

			$.ajax({
				type : "GET",
				url : ctxPath + "/manageCSEState.html/ajax"
						+ "?operation=getCSEStateEntities",

				contentType : "application/json; charset=utf-8",
				beforeSend : function() {
				},
				headers : {
					"Accept" : "application/json"
				},
				success : function(data) {

					resource = JSON.parse(data);
					console.log(data);
				},
				error : function(e) {
					console.log("ERROR: ", e);
				}
			});
			$("#modalCSEStateChange2").on('shown.bs.modal', function(event) {

				var button = $(event.relatedTarget);

				var objectSi = button["0"].dataset.objectSi; // button.data('data-object-si');
				var objectCsi = button["0"].dataset.objectCsi; // button.data('data-object-csi');
				// // Extract
				var cseStateId = document.getElementById("cseStateIdU2");
				cseStateId.value = objectSi;
				var csi = document.getElementById("csiU2");
				csi.value = objectCsi;

				var select = document.getElementById("cseStateName2");
				resetSelectOptions(select);
				// var options = [ "1", "2", "3", "4", "12" ];
				var options = resource.model.cseStateEnum;
				var csestateId = document.getElementById("csestateID2");
				console.log(csestateId);

				for ( var key in options) {
					if (options.hasOwnProperty(key)) {
						var opt = options[key];
						var el = document.createElement("option");
						el.textContent = key;
						el.value = opt;
						select.appendChild(el);
					}
				}
				// $('#cseStateName').selectpicker('refresh');
			});

		});

$('#modalCSEStateChange2').on('shown.bs.modal', function() {

	$('#cseStateName2').selectpicker('refresh');

});
// --------------------------------------------
$(document)
		.on(
				"click",
				"#updateCSEState2",
				function(event) {
					var cseStateId = $("#modalCSEStateChange2 #cseStateIdU2")
							.val();
					var csi = $("#modalCSEStateChange2 #csiU2").val();
					var stateName = $("#modalCSEStateChange2 #cseStateName2")
							.val();

					$
							.ajax({
								type : "GET",
								url : ctxPath
										+ "/manageCSEState.html/ajax?operation=updateCSEState&cseStateId="
										+ cseStateId + "&csi=" + csi
										+ "&stateName=" + stateName,

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
// ------------------------------------------------------------------------------

function resetSelectOptions(select) {
	while (select.options.length > 0) {
		select.remove(0);
	}
}

function getContextPath() {
	return window.location.pathname.substring(0, window.location.pathname
			.indexOf("/", 2));
}

/*---------------------------------datatables-------------------------------*/

$(function() {
	$('#cseStateTbl')
			.DataTable(
					{
						dom : 'Bfrtip',
						buttons : [ 'copy', 'csv', 'excel', 'pdf', 'print' ],
						"aaData" : cseStateList,
						"aoColumns" : [
								{
									"mDataProp" : "si"
								},
								{
									"mDataProp" : "csi"
								},
								{
									"mDataProp" : "sn"
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

									"targets" : 0,
									"render" : function(data, type, row, meta) {
										return '<button id="generateCSESModalBtn2" class="btn btn-success"'
												+ 'data-toggle="modal" data-target="#modalCSEStateChange2"'
												+ 'data-original-title="" title=""'
												+ 'data-object-si="'
												+ row.si
												+ '"'
												+ ' data-object-csi="'
												+ row.csi
												+ '"'
												+ 'sec:authorize="hasAuthority(EDIT_CSESTATE) or  #strings.contains(#authentication.principal.roles,SUPERADMIN)">'
												+ 'Update'
												+ '</button>'
												+ '<!-- Modal -->'
												+ '<div class="modal fade" id="modalCSEStateChange2" tabindex="-1"'
												+ 'role="dialog" aria-labelledby="myModalLabel6" aria-hidden="true">'
												+ '<div class="modal-dialog">'
												+ '<div class="modal-content">'
												+ '<div class="modal-header">'
												+ '<button type="button" class="close" data-dismiss="modal"'
												+ 'aria-hidden="true">×'
												+ '</button>'
												+ '<h4 class="modal-title text-info" id="myModalLabel6">'
												+ 'Update CSEStateEntity</h4>'
												+ '</div>'
												+ '<div class="modal-body">'
												+ '<!-- content goes here -->'
												+ '<form>'
												+ '<div class="form-group-main">'
												+ '<label for="cseStateIdU2">CSEState Id:</label>'
												+ '<input type="text" class="form-control-main"'
												+ 'id="cseStateIdU2" disabled="true"></input>'
												+ '</div>'
												+ '<div class="form-group-main">'
												+ '<label for="csiU2">CSEState CSE_ID:</label>'
												+ '<input type="text" class="form-control-main"'
												+ 'id="csiU2" disabled="true"></input>'
												+ '</div>'
												+ '<div class="form-group-main">'
												+ '<label for="cseStateName2">State Name:</label>'
												+ '<select class="form-control-main" id="cseStateName2">'
												+ '</select>'
												+ '</div>'
												+ '</form>'
												+ '</div>'
												+ '<div class="modal-footer">'
												+ '<button type="button" class="btn btn-danger"'
												+ 'data-dismiss="modal" data-original-title=""'
												+ 'title=""><i class="fa fa-times"></i> Close'
												+ '</button>'
												+ '<button id="updateCSEState2" type="button"'
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

/*---------------------------------datatables-------------------------------*/