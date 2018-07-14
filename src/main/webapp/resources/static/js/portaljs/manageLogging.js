var ctxPath = getContextPath();

$(document)
		.ready(
				function() {
					$("body")
							.on(
									'click',
									'.dropdown-menu li a',
									function(e) {

										var loglevelName = e.currentTarget.text;
										var loglevelId = e.currentTarget.dataset.levelname;
										var logname = e.currentTarget.dataset.logname;

										// alert(loglevelName);

										$
												.ajax({
													type : "GET",
													url : ctxPath + "/manageLogging.html/ajax?operation=updateLog&logName="
															+ logname
															+ "&logLevel="
															+ loglevelName,

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
														console.log("ERROR: ",
																e);
													}
												});

									});

					// $('body .dropdown-toggle').dropdown();
				})

/*---------------------------------datatables-------------------------------*/

$(function() {
	$('#logTbl')
			.DataTable(
					{
						dom : 'Bfrtip',
						buttons : [ 'copy', 'csv', 'excel', 'pdf', 'print' ],
						"aaData" : logList,
						"order" : [ [ 1, "asc" ] ],
						"aoColumns" : [

								{
									"mDataProp" : "name"
								},
								{
									"mDataProp" : "level"
								},
								{

									"render" : function(data, type, row, meta) {

										var strComboboxHtml = '<div class="btn-group dropdown">'
												+ '<button class="btn btn-success" type="button">Log Level</button>'
												+ '<button data-toggle="dropdown" class="btn btn-success dropdown-toggle" type="button"><span class="caret"></span></button>'
												+ '<ul id="loglevels" role="menu" class="dropdown-menu">';

										var keys = Object.keys(logLevelEnum);
										for (i = 0; i < keys.length; i++) {
											strComboboxHtml += '<li><a data-levelname="'
													+ logLevelEnum[keys[i]]
													+ '" data-logname="'
													+ row.name
													+ '">'
													+ keys[i]
													+ '</a></li>';
										}

										strComboboxHtml += '</ul>'
												+ '<script>$("body .dropdown-toggle").dropdown(); </script>'
												+ '</div>';

										return strComboboxHtml;
									}
								} ]
					});
});

/*---------------------------------datatables-------------------------------*/

function getContextPath() {
	return window.location.pathname.substring(0, window.location.pathname.indexOf("/",2));
}