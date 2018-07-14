var ctxPath = getContextPath();

$(document).ready(function() {
	$('.multiselect').multiselect();

});

var serverContext = "[[@{/}]]";

$(document).ready(function() {
	$('form').submit(function(event) {
		register(event);
	});

	$(":password").keyup(function() {
		if ($("#password").val() != $("#matchPassword").val()) {
			$("#globalError").show().html(/* [[#{PasswordMatches.user}]] */);
		} else {
			$("#globalError").html("").hide();
		}
	});

	options = {
		common : {
			minChar : 8
		},
		ui : {
			showVerdictsInsideProgressBar : true,
			showErrors : true,
			errorMessages : {
				wordLength : "Your password is too short",
				wordNotEmail : "Do not use your email as your password",
				wordSequences : "Your password contains sequences",
				wordLowercase : "Use lower case characters",
				wordUppercase : "Use upper case characters",
				wordOneNumber : "Use numbers",
				wordOneSpecialChar : "Use special characters"
			}
		}
	};
	$('#password').pwstrength(options);
});

function register(event) {
	event.preventDefault();
	$(".alert").html("").hide();
	$(".error-list").html("");
	if ($("#password").val() != $("#matchPassword").val()) {
		$("#globalError").show().html(/* [[#{PasswordMatches.user}]] */);
		return;
	}
	var firstName = $("#generateUserModal #firstName").val();
	var lastName = $("#generateUserModal #lastName").val();
	var email = $("#generateUserModal #email").val();
	var roles = $("#generateUserModal #roleListC").val();
	var password = $("#generateUserModal #password").val();
	
	if (firstName == '' || firstName == null) {
		alertify.error("Company Code cannot be empty!");
		return;
	}
	if (lastName == '' || lastName == null) {
		alertify.error("Company Name cannot be empty!");
		return;
	}
	if (roles == '' || roles == null) {
		alertify.error("Admin User cannot be empty!");
		return;
	}
	
	/*
	 * if (!isEmailAddress(email)) { alert("Email is not valid!"); return; }
	 */
	$.ajax({
		type : "GET",
		url : ctxPath + "/manageUser.html/ajax?operation=createUser&roles=" + roles
				+ "&firstName=" + firstName + "&lastName=" + lastName
				+ "&email=" + email+ "&password=" + password,

		contentType : "application/json; charset=utf-8",
		beforeSend : function() {
			 $('#generateUserModal').modal('toggle');
		},
		headers : {
			"Accept" : "application/json"
		},
		success : function(data) {
			resource = data;
			   var error = data.model.messageError;
			   var info = data.model.messageInfo;
		        if(error != null && error.length > 0){
		        	alertify.error(error);
		        }
		        if(info != null && info.length > 0){
		    	  alertify.log(info);
		        }
		        $('#basicExample').load(document.URL +  ' #basicExample');  	
		}
		,
		error : function(e) {
			console.log("ERROR: ", e);
		}
	});
}

$(document).on(
		"click",
		"#generateUser",
		function(event) {
		    event.preventDefault();
        	$(".alert").html("").hide();
        	$(".error-list").html("");
        	if ($("#password").val() != $("#matchPassword").val()) {
        		$("#globalError").show().html(/* [[#{PasswordMatches.user}]] */);
        		return;
        	}
			var firstName = $("#generateUserModal #firstName").val();
			var lastName = $("#generateUserModal #lastName").val();
			var email = $("#generateUserModal #email").val();
			var roles = $("#generateUserModal #roleListC").val();

			if (!isEmailAddress(email)) {
				alertify.error("Email is not valid!");
				return;
			}

			$.ajax({
				type : "GET",
				url : ctxPath + "/manageUser.html/ajax?operation=createUser&roles="
						+ roles + "&firstName=" + firstName + "&lastName="
						+ lastName + "&email=" + email,

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

$(document).on("click", "#generateUserModalBtn", function(event) {

	$.ajax({
		type : "GET",
		url : ctxPath + "/manageUser.html/ajax" + "?operation=getRoles",

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
	$("#generateUserModal").on('shown.bs.modal', function() {

		var select = document.getElementById("roleListC");
		resetSelectOptions(select);
		var options = resource.model.roleList;

		for ( var key in options) {
			if (options.hasOwnProperty(key)) {
				var opt = options[key];
				var el = document.createElement("option");
				el.textContent = opt.displayname;
				el.value = opt.id;
				select.appendChild(el);
			}
		}
	});

});

$('#generateUserModal').on('shown.bs.modal', function() {

	$('#roleListC').selectpicker('refresh');

});

// -----------------------------------

$(document).on("click", "#modalRoleBtn", function(event) {
	var objectId = $(this).data('object-id');
	var objectfName = $(this).data('object-firstname');
	var objectlName = $(this).data('object-lastname');
	var objectEnabled = $(this).data('object-enabled');
	var objectIs2fa = $(this).data('object-is2fa');
	var objectRoles = $(this).data('object-roles');
	$.ajax({
		type : "GET",
		url : ctxPath + "/manageUser.html/ajax" + "?operation=getRoles",
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
	    $("#multiselect_to_1_UError").html("").hide();

		var userId = document.getElementById("userIdU");
		userId.value = objectId;
		var firstName = document.getElementById("firstNameU");
		firstName.value = objectfName;
		var lastName = document.getElementById("lastNameU");
		lastName.value = objectlName;
		var is2fa = document.getElementById("is2faU");
		is2fa.checked = objectIs2fa;

		var enabled = document.getElementById("enabledU");
		enabled.value = objectEnabled;
		var roles = document.getElementById("roleListU");

		var select1 = document.getElementById("roleList_U");
		resetSelectOptions(select1);
		var select1Options = resource.model.roleList;

		var select2 = document.getElementById("multiselect_to_1_U");
		resetSelectOptions(select2);
		var select2Options = convertJsonArr(objectRoles);

// for ( var key in select1Options) {
// if (select1Options.hasOwnProperty(key)) {
// var opt = select1Options[key];
// var isExists = false;
// for ( var key1 in select2Options) {
// var opt1 = select2Options[key1];
// if (opt.id == opt1.id) {
// isExists = true;
// break;
// }
// }
// if (!isExists) {
// var el = document.createElement("option");
// el.textContent = opt.displayname;
// el.value = opt.id;
// select1.appendChild(el);
// }
// }
// }
		
		for ( var key in select1Options) {
			if (select1Options.hasOwnProperty(key)) {
				var opt = select1Options[key];
				var el = document.createElement("option");
				el.textContent = opt.displayname;
				el.value = opt.id;
				
				var tmpObj = select2Options.filter(e => e.id == opt.id);
				
				if (tmpObj.length <= 0 ) {
					select1.appendChild(el);
				}
			}
		}

		for ( var key in select2Options) {
			if (select2Options.hasOwnProperty(key)) {
				var opt = select2Options[key];
				var el = document.createElement("option");
				el.textContent = opt.displayName;
				el.value = opt.id;
				select2.appendChild(el);
			}
		}
	});
	$('#modalRoleChange').modal('show');
});

$('#modalRoleChange').on('show.bs.modal', function() {
	$('#roles').selectpicker('refresh');
	$('#multiselect_to_1_U').selectpicker('refresh');
	$('#roleListU').selectpicker('refresh');
});

$(document).on(
		"click",
		"#updateUser",
		function(event) {
		    event.preventDefault();
        	$(".alert").html("").hide();
        	$(".error-list").html("");

			var userId = $("#modalRoleChange #userIdU").val();
			var firstName = $("#modalRoleChange #firstNameU").val();
			var lastName = $("#modalRoleChange #lastNameU").val();
// var is2fa = $("#modalRoleChange #is2faU").val();
			var is2fa = document.getElementById("is2faU").checked;
// var is2fa = $("#modalRoleChange #is2faU").prop('checked');

            var multiselect_to_1 = document.getElementById("multiselect_to_1_U");
            if (multiselect_to_1 == null || multiselect_to_1.options.length == 0) {
                alertify.error("Selected Role List can not be empty!");

                return;
            }
			var roles = "";
			for (i = 0; i < multiselect_to_1.options.length; i++) {
				roles += multiselect_to_1.options[i].value + ",";
			}
			if (roles.indexOf(",") > 0) {
				roles = roles.substring(0, roles.length - 1);
			}
			$.ajax({
				type : "GET",
				url : ctxPath + "/manageUser.html/ajax?operation=updateUser&firstName="
						+ firstName + "&lastName=" + lastName + "&is2fa="
						+ is2fa + "&userId=" + userId + "&roles=" + roles,

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

function getContextPath() {
	return window.location.pathname.substring(0, window.location.pathname.indexOf("/",2));
}
