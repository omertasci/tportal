var ctxPath = getContextPath();

$(document).ready(function() {
	$('.multiselect').multiselect();

});

$(document).on(
		"click",
		"#generateRole",
		function(event) {
			var roleName = $("#generateRoleModal #roleName").val();
			var roleDisplayName = $("#generateRoleModal #roleDisplayName")
					.val();
			// var privId = $("#generateRoleModal #privSelect").val();

			var multiselect_to_1_gen = document
					.getElementById("multiselect_to_1_gen");
			var privIds = "";
			for (i = 0; i < multiselect_to_1_gen.options.length; i++) {
				privIds += multiselect_to_1_gen.options[i].value + ",";
			}
			if (privIds.indexOf(",") > 0) {
				privIds = privIds.substring(0, privIds.length - 1);
			}

			$.ajax({
				type : "GET",
				url : ctxPath + "/manageRole.html/ajax?operation=createRole&privId="
						+ privIds + "&roleName=" + roleName
						+ "&roleDisplayName=" + roleDisplayName,

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

$(document).on("click", "#generateRoleModalBtn", function(event) {

	$.ajax({
		type : "GET",
		url : ctxPath + "/manageRole.html/ajax" + "?operation=getPrivileges",

		contentType : "application/json; charset=utf-8",
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
	$("#generateRoleModal").on('shown.bs.modal', function() {

		// var select = document.getElementById("privSelect");
		// resetSelectOptions(privSelect);
		var options = resource.model.privilegeList;

		var selectgen = document.getElementById("privListGen");
		resetSelectOptions(privListGen);

		// for ( var key in options) {
		// if (options.hasOwnProperty(key)) {
		// var opt = options[key];
		// var el = document.createElement("option");
		// el.textContent = opt.name;
		// el.value = opt.id;
		// select.appendChild(el);
		// }
		// }
		for ( var key in options) {
			if (options.hasOwnProperty(key)) {
				var opt = options[key];
				var el = document.createElement("option");
				el.textContent = opt.displayname;
				el.value = opt.id;
				selectgen.appendChild(el);
			}
		}

	});

});

$('#generateRoleModal').on('shown.bs.modal', function() {

	// $('#privSelect').selectpicker('refresh');
	$('#privListGen').selectpicker('refresh');

});

// -----------------------------------

$(document).on("click", "#modalRoleBtn", function(event) {

	var objectId = $(this).data('object-id');
	var objectName = $(this).data('object-name');
	var objectDisplayName = $(this).data('object-displayname');
	var rolePrivs = $(this).data('object-privlist');

	$.ajax({
		type : "GET",
		url : ctxPath + "/manageRole.html/ajax" + "?operation=getPrivileges",
		async : false,
		contentType : "application/json; charset=utf-8",
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
	$("#modalRoleChange").on('show.bs.modal', function(event) {

		// var button = $(event.relatedTarget);

		var roleId = document.getElementById("roleIdU");
		roleId.value = objectId;
		var roleName = document.getElementById("roleNameU");
		roleName.value = objectName;
		var roleDisplayName = document.getElementById("roleNameD");
		roleDisplayName.value = objectDisplayName;

		var select = document.getElementById("privList_U");
		resetSelectOptions(select);
		var options = resource.model.privilegeList;

		var select2 = document.getElementById("multiselect_to_1_U");
		resetSelectOptions(select2);
		var select2Options = convertJsonArr(rolePrivs);

		for ( var key in options) {
			if (options.hasOwnProperty(key)) {
				var opt = options[key];
				var el = document.createElement("option");
				el.textContent = opt.displayname;
				el.value = opt.id;
				
				var tmpObj = select2Options.filter(e => e.prvid == opt.id);
				
				if (tmpObj.length <= 0 ) {
					select.appendChild(el);
				}
			}
		}

		for ( var key in select2Options) {
			if (select2Options.hasOwnProperty(key)) {
				var opt = select2Options[key];
				var el = document.createElement("option");
				el.textContent = opt.prvdisplayname;
				el.value = opt.prvid;
				select2.appendChild(el);
			}
		}

	});
	$('#modalRoleChange').modal('show');
});

$('#modalRoleChange').on('show.bs.modal', function() {

	$('#privList').selectpicker('refresh');
	$('#multiselect_to_1').selectpicker('refresh');

});

$(document).on(
		"click",
		"#updateRole",
		function(event) {
			var roleName = $("#modalRoleChange #roleNameU").val();
			var roleId = $("#modalRoleChange #roleIdU").val();
			// var privName = $("#modalRoleChange #privList").val();
			var multiselect_to_1 = document
					.getElementById("multiselect_to_1_U");
			var privName = "";
			for (i = 0; i < multiselect_to_1.options.length; i++) {
				privName += multiselect_to_1.options[i].value + ",";
			}
			if (privName.indexOf(",") > 0) {
				privName = privName.substring(0, privName.length - 1);
			}

			$.ajax({
				type : "GET",
				url : ctxPath + "/manageRole.html/ajax?operation=updateRole&roleName="
						+ roleName + "&roleId=" + roleId + "&privName="
						+ privName,

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

function convertJsonArrEXXX(strObject) {

	var arr1 = strObject.split(/[\s,=\[\]{}]+/);
	var arr2 = arr1;
	for (i = arr1.length - 1; i >= 0; i--) {
		if (arr1[i].trim().length <= 0) {
			arr2.splice(i, 1);
		}
	}
	var str1 = "";
	var countDoubleDot = 0;
	var countObject = 0;

	for (i = 0; i < arr2.length; i++) {
		countDoubleDot++;
		countObject++;
		if (isNaN(arr2[i])) {
			arr2[i] = '"' + arr2[i] + '"';
		}

		if (countObject == 1) {
			str1 += "{";
		}

		if (countDoubleDot == 2) {
			str1 += ":";
			countDoubleDot = 0;
		}

		str1 += arr2[i];

		if (countObject == 2) {
			str1 += "},";
			countObject = 0;
			countDoubleDot = 0;
		}

	}
	var jsonObj = JSON.parse('[' + str1.substring(0, str1.length - 1) + ']');
	var resJsonArr = {
		privs : []
	};

	for (i = 0; i < (jsonObj.length);) {

		var item1 = jsonObj[i];
		var item2 = jsonObj[i + 1];
		var item3 = jsonObj[i + 2];

		resJsonArr.privs.push({
			"prvid" : item1.prvid,
			"prvname" : item2.prvdisplayname,
			"prvdisplayname" : item3.prvname
		});
		i = i + 3;
	}
	return resJsonArr;
}

function getContextPath() {
	return window.location.pathname.substring(0, window.location.pathname.indexOf("/",2));
}
