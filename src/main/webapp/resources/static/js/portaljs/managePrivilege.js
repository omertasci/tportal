var ctxPath = getContextPath();

$(document).ready(function() {
	$('.multiselect').multiselect();

});

// -----------------------------------
//
$(document).on("click", "#modalPrivBtnX", function(event) {

	$("#modalGWGChange").on('show.bs.modal', function(event) {

		var button = $(event.relatedTarget);

		var objectprivId = button.data('object-privid');
		var privId = document.getElementById("privId");
		privId.value = objectprivId;

		var objectprivName = button.data('object-privname');
		var privName = document.getElementById("privName");
		privName.value = objectprivName;

	});

});

$(document)
		.on(
				"click",
				"#updatePrivilege",
				function(event) {
					var privId = $("#modalGWGChange #privId").val();
					var privName = $("#modalGWGChange #privName").val();
					var privNameDisplay = $("#modalGWGChange #privNameD").val();
					$
							.ajax({
								type : "GET",
								url : ctxPath + "/managePrivilege.html/ajax?operation=updatePrivilege&privilegeId="
										+ privId
										+ "&privilegeName="
										+ privName
										+ "&privilegeDisplayName="
										+ privNameDisplay,

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

function getContextPath() {
	return window.location.pathname.substring(0, window.location.pathname.indexOf("/",2));
}