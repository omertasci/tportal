$(document)
		.on(
				"click",
				"#valdateBtn",
				function(event) {
					var companyCode = $("#createCompanyModal #companyCode")
							.val();
					var companyName = $("#createCompanyModal #companyName")
							.val();
					var parentID = $("#createCompanyModal #parentComp").val();
					var adminUserId = $("#createCompanyModal #adminUser").val();

					$
							.ajax({
								type : "GET",
								url : "/manageCompany.html/ajax?operation=createCompany&companyName="
										+ companyName
										+ "&companyCode="
										+ companyCode
										+ "&parentID="
										+ parentID
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

function resetSelectOptions(select) {
	while (select.options.length > 0) {
		select.remove(0);
	}
}
