//Constants Section start
var ctxPath = getContextPath();
var serializedGridster;
// var window = {};
var chartPanelIdBox = new Array();
var conditionIDBox = new Array();

var modalHtml = " <!-- Modal -->"
		+ "         <div class='widgetModal modal fade' id='widgetSettingsModal_"
		+ "chartPanelIDPlaceHolder"
		+ "' tabindex='-1' role='dialog'"
		+ "              aria-labelledby='widgetSettingsModalLabel' aria-hidden='true' data-backdrop='false'>"
		+ "              <div class='modal-dialog'>"
		+ "                   <div class='modal-content'>"
		+ "                        <div class='modal-header'>"
		+ "                             <button type='button' class='close' data-dismiss='modal'"
		+ "                                     aria-hidden='true'>×</button>"
		+ "                             <h4 class='modal-title text-info' id='widgetSettingsModalLabel'>Edit Widget</h4>"
		+ "                         </div>"
		+ "                   <div class='modal-body'>"
		+ "                   <!-- content goes here -->"
		+ "                        <form>"
		+ "                              <div class='form-group'>"
		+ "                                   <label for='widgetName'>Name:</label>"
		+ "                                          <input type='text' class='form-control'"
		+ "                                                 id='widgetName'></input>"
		+ "                               </div>"
		+ "                             <div class='form-group'>"
		+ "                                  <label for='chartType'>Chart Type:</label>"
		+ "                                  <select id='chartType' class='form-control'>"
		+ "                                  	<option id='pieChart' value='pie' name='pieChart'>Pie</option>"
		+ "                                  	<option id='lineChart' value='line' name='lineChart'>Line</option>"
		+ "                                  	<option id='columnChart' value='column' name='columnChart'>Column</option>"
		+ "                                  	<option id='areaChart' value='area' name='areaChart'>Area</option>"
		+ "                                  </select>"
		+ "                              </div>"
		+ "                             <div class='form-group'>"
		+ "                                  <label for='serieType'>Serie:</label>"
		+ "                                  <select id='serieType' class='form-control'>"
		+ "                                  	<option id='groupName' value='group_name' name='group_name'>Group Name</option>"
		+ "                                  	<option id='csrRn' value='csr_rn' name='csr_rn'>Gateway Name</option>"
		+ "                                  	<option id='mdUid' value='md_uid' name='md_uid'>Device Unique Id</option>"
		+ "                                  </select>"
		+ "                              </div>"
		+ "                             <div class='form-group'>"
		+ "                                  <label for='aggregationType'>Aggregation:</label>"
		+ "                                  <select id='aggregationType' class='form-control'>"
		+ "                                  	<option id='countAgg' value='count' name='countAgg'>Count</option>"
		+ "                                  	<option id='sumAgg' value='sum' name='sum'>Sum</option>"
		+ "                                  	<option id='countAgg' value='max' name='max'>Max</option>"
		+ "                                  	<option id='countAgg' value='min' name='min'>Min</option>"
		+ "                                  	<option id='countAgg' value='avg' name='avg'>Avarege</option>"
		+ "                                  </select>"
		+ "                              </div>"
		+ "                             <div class='form-group'>"
		+ "                                  <label for='valueType'>Value:</label>"
		+ "                                  <select id='valueType' class='form-control'>"
		+ "                                  	<option id='dimLevel' value='dimLevel' name='dimLevel'>Dim Level</option>"
		+ "                                  	<option id='hue' value='hue' name='hue'>Hue</option>"
		+ "                                  	<option id='sat' value='sat' name='sat'>Saturation</option>"
		+ "                                  	<option id='brigs' value='brigs' name='brigs'>Brightness</option>"
		+ "                                  	<option id='pDPId' value='pDPId' name='pDPId'>Device Product Id</option>"
		+ "                                  	<option id='power' value='power' name='power'>Power Consumption</option>"
		+ "                                  	<option id='powSe' value='powSe' name='powSe'>Power Switch</option>"
		+ "                                  	<option id='proLn' value='proLn' name='proLn'>Location</option>"
		+ "                                  </select>"
		+ "                              </div>"
		+ "                             <div class='form-group'>"
		+ "                                  <label for='categoryType'>Category:</label>"
		+ "                                  <select id='categoryType' class='form-control'>"
		+ "                                  	<option id='cdateCat1' value='md_cdate_function_hour' name='md_cdate_function_hour'>Create Date(Hourly)</option>"
		+ "                                  	<option id='cdateCat2' value='md_cdate_function_day' name='md_cdate_function_day'>Create Date(Daily)</option>"
		+ "                                  	<option id='cdateCat3' value='md_cdate_function_week' name='md_cdate_function_week'>Create Date(Weekly)</option>"
		+ "                                  	<option id='cdateCat4' value='md_cdate_function_month' name='md_cdate_function_month'>Create Date(Monthly)</option>"
		+ "                                  	<option id='csr_rnCat' value='csr_rn' name='csr_rn'>Gateway Name</option>"
		+ "                                  	<option id='group_nameCat' value='group_name' name='group_name'>Gateway Group Name</option>"
		+ "                                  	<option id='uidCat' value='md_uid' name='md_uid'>Device Unique Id</option>"
		+ "                                  </select>"
		+ "                             </div>"
		+ "                             <div class='form-group'>"
		+ "                             	<label class='col-lg-12 col-md-12 control-label' for='ipContainer' >Criteria</label>"
		+ "                             	<div id='ipContainer' class='col-lg-12 col-md-12 col-sm-12'>"
		+ "                             			<button type='button'"
		+ "                             			    class='btn btn-success btn-sm btn-add-and-condition' id='addAndCondition'>"
		+ "                             				<span class='glyphicon glyphicon-plus'></span>"
		+ "                             				Add AND Condition"
		+ "                             			</button>"
		+ "											<button type='button'"
		+ "                             			    class='btn btn-success btn-sm btn-add-or-condition' id='addOrCondition'>"
		+ "                             			<span class='glyphicon glyphicon-plus'></span>"
		+ "                             			Add OR Condition"
		+ "                             		</button>"
		+ "                             		<div id='conditionlist' class='condition-list'>"
		+ "                             	   </div>"
		+ "                             	</div>"
		+ "                            </div>"
		+ "                        </form>"
		+ "                    </div>"
		+ "                    <div class='modal-footer'>"
		+ "                         <button type='button' class='btn btn-danger'"
		+ "                                 data-dismiss='modal' data-original-title='' title=''>"
		+ "                                 <i class='fa fa-times'></i> Close"
		+ "                          </button>"
		+ "                          <button id='updateWidget' type='button'"
		+ "                                  class='btn btn-success' data-original-title='' title=''>"
		+ "                                  <i class='fa fa-save'></i> Save Changes"
		+ "                           </button>"
		+ "                      </div>" + "                 </div>"
		+ "           </div>" + "    </div>";

var conditionRow = "              <label for='condition_conditionIDPlaceHolder'>conditionTypePlaceHolder</label>   		"
		+ "										<div id='condition_conditionIDPlaceHolder' class='input-group condition-input' data-conditionID='conditionIDPlaceHolder' data-conditionType='conditionTypePlaceHolder'>"
		+ "                             			<span class='input-group-btn'>"
		+ " 											<select id='columnType' class='form-control'  style='width: 20%;'>"
		+ "                                  				<option id='opt1' value='group_name' data-criteriaType='String'>Group Name</option>"
		+ "                                  				<option id='opt2' value='md_cdate' data-criteriaType='Date'>Create Date</option>"
		+ "                                  				<option id='opt3' value='md_dpvalue' data-criteriaType='Number'>DP Value</option>"
		+ "                                  			</select>"
		+ " 											<select id='operatorType' class='form-control' style='width: 20%; margin-left: 2%;'>"
		+ "                                  				<option id='operator1' value='=' >Equals(=)</option>"
		+ "                                  				<option id='operator2' value='>'>Greater Than(>)</option>"
		+ "                                  				<option id='operator3' value='<'>Less Than(<)</option>"
		+ "                                  			</select>"
		+ "                             				 	<input id='conditionInput_conditionIDPlaceHolder' type='text'"
		+ "                             						 class='form-control' style='width: 52%; margin-left: 2%;'"
		+ "                             						 placeholder='Enter criteria condition'></input>"
		+ "												<button class='btn btn-danger btn-remove-condition' type='button'><span class='glyphicon glyphicon-remove'></span></button>"
		+ "                             		  </span>"
		+ "                             	    </div>";

// Constants Section End

/** Onload actions */

function loadDashboard(gridsterUl) {

	var dashboardJson = jQuery.parseJSON(dashboard);
	console.log(dashboardJson);

	var widgetBodyPlaceHolder = "";

	var widgetHtml = '';

	var gridsterUl = $(".gridster ul");

	if (dashboardJson != null) {

		for (i = 0; i < dashboardJson.widgets.length; i++) {

			chartPanelIdBox
					.push(parseInt(dashboardJson.widgets[i].widgetCounterId));
			widgetBodyPlaceHolder = dashboardJson.widgets[i].liHtml;

			widgetHtml = '<li class= "orange" data-widgetcounter="'
					+ dashboardJson.widgets[i].widgetCounterId
					+ '" data-widgetName="'
					+ dashboardJson.widgets[i].widgetName
					+ '" data-chartType="' + dashboardJson.widgets[i].chartType
					+ '" data-serieType="' + dashboardJson.widgets[i].serieType
					+ '" data-aggregationType="'
					+ dashboardJson.widgets[i].aggregationType
					+ '" data-valueType="' + dashboardJson.widgets[i].valueType
					+ '" data-categoryType="'
					+ dashboardJson.widgets[i].categoryType
					+ '" data-conditionStr="'
					+ dashboardJson.widgets[i].conditionStr + '">'
					+ widgetBodyPlaceHolder + '</li>';

			// /* add_widget(html, [ size_x ], [ size_y ], [ col ], [ row ])
			// */
			gridsterUl.gridster().data('gridster').add_widget(widgetHtml,
					parseInt(dashboardJson.widgets[i].sizex),
					parseInt(dashboardJson.widgets[i].sizey),
					parseInt(dashboardJson.widgets[i].col),
					parseInt(dashboardJson.widgets[i].row));

			var listItem = $("ul").find(
					"[data-widgetcounter='"
							+ dashboardJson.widgets[i].widgetCounterId + "']")[0];

			var chartPanelDiv = $(listItem).find(".chartPanel")[0];
			var chartPanelDivWidth = $("ul").find(
					"[data-widgetcounter='"
							+ dashboardJson.widgets[i].widgetCounterId + "']")
					.width();
			var chartPanelDivHeight = $("ul").find(
					"[data-widgetcounter='"
							+ dashboardJson.widgets[i].widgetCounterId + "']")
					.height() - 22;

			var conditionStr = "";

			var conditionStrList = dashboardJson.widgets[i].conditionStr
					.split("$__$");

			for (j = 0; j < conditionStrList.length; j++) {

				if (conditionStrList[j].trim().length > 0) {

					var conditionPartList = conditionStrList[j].split("#__#");

					var conditionId = conditionPartList[0];
					var columnType = conditionPartList[1];
					var operatorType = conditionPartList[2];
					var inputType = conditionPartList[3];
					var inputValue = conditionPartList[4];

					var logicOperatorEl = $("ul").find("#" + conditionId)[0];
					var logicOperator = $(
							'label[for="' + $(logicOperatorEl)[0].id + '"]')
							.html();
					conditionStr += " " + logicOperator + " " + columnType
							+ " " + operatorType + " " + inputValue;

				}
			}
			// conditionStr += " " + logicOperator + " " + column + " " +
			// operator
			// + " " + conditionInput;

			var chartData = getChartData(dashboardJson.widgets[i].serieType,
					dashboardJson.widgets[i].aggregationType,
					dashboardJson.widgets[i].valueType,
					dashboardJson.widgets[i].categoryType, conditionStr);

			var chart = new Highcharts.Chart(
					{
						chart : {
							renderTo : chartPanelDiv.id,
							width : chartPanelDivWidth,
							height : chartPanelDivHeight,
							type : dashboardJson.widgets[i].chartType
						},
						title : {
							text : dashboardJson.widgets[i].widgetName
						},
						xAxis : {
							categories : chartData.categories
						},
						series : chartData.series,
						plotOptions : {
							series : {
								dataLabels : {
									enabled : true,
									format : '{series.name}: {point.y:.1f}'
								}
							},
							pie : {
								dataLabels : {
									enabled : true,
									format : '{point.categoryName}: {point.y:.1f}'
								}
							}
						},
						tooltip : {
							formatter : function() {
								var sliceIndex = this.point.index;
								var sliceName = this.series.chart.axes[0].categories[sliceIndex];
								return this.series.name + ': <br/><b>'
										+ sliceName + '</b> is <b>' + this.y
										+ '</b>';
							}
						},
						responsive : {
							rules : [ {
								condition : {
									maxWidth : 500
								},
								chartOptions : {
									legend : {
										align : 'center',
										verticalAlign : 'bottom',
										layout : 'horizontal'
									},
									yAxis : {
										labels : {
											align : 'left',
											x : 0,
											y : -5
										},
										title : {
											text : 'Rainfall (mm)'
										}
									},
									subtitle : {
										text : null
									},
									credits : {
										enabled : false
									}
								}
							} ]
						}

					});

			$('span.gs-resize-handle').click(function() {
				console.log("Resizing...");

				// var a = $(this).parent().children('div')[0];
				// var b = $(a).children('div')[0];
				// var c = $(b).children('div.chartPanel');
				// var liWidth = $(c).width();
				// var liHeight = $(c).height();
				//
				// var chartPanelIdStr = "#" + $(c).attr('id');
				// var chartObj = $(chartPanelIdStr).highcharts();
				//
				// chartObj.setSize((liWidth), (liHeight));
			});
		}
	}

}

$(document).on("click", "#addWidgetBtn", function(event) {

	addWidget();
});

$(document)
		.on(
				"click",
				"#saveDashboardBtn",
				function(event) {

					var serializedGridsterWidgets = serializeGridster();
					for (i = 0; i < serializedGridsterWidgets.length; i++) {

						if (!checkIfRequiredFieldsSelected(serializedGridsterWidgets[i])) {
							return false;
						}
					}

					var dashboardName = "My First Dashboard";
					var dataPool = {};

					dataPool.operation = "createDashboard";
					dataPool.widgets = serializedGridsterWidgets;
					dataPool.dashboardName = dashboardName;

					$.ajax({
						type : "POST",
						url : ctxPath + "/widgetContainer.html/ajax",
						data : JSON.stringify(dataPool),
						contentType : "application/json; charset=utf-8",
						dataType : "json",
						success : function(data) {
							alertify.success("The group " + dashboardName
									+ "<br>is created succesfully.");
						}
					});

				});

function addWidget() {

	var newID = getNextChartPanelId();
	chartPanelIdBox.push(newID);

	var gridsterUl = $(".gridster ul");

	var widgetHtml = '<li class= "orange" data-row="6" data-col="9" data-sizex="1" data-sizey="2" data-widgetcounter="'
			+ newID
			+ '">'
			+ '<div class="gridster-box" style="display: inline-block; margin-bottom: 0px; margin-right: 0px; height: 100%; width: 100%;  padding-bottom: 0px;  padding-right: 0px;">'
			+ '<div class="handle-resize"  style="display: inline-block; margin-bottom: 0px; margin-right: 0px; height: 100%; width: 100%;  padding-bottom: 0px;  padding-right: 0px;">'
			+ '<i class="fa fa-times" style="font-size: 22px !important; float: right;"></i><i class="fa fa-cog" data-target="#widgetSettingsModal" style="font-size: 22px !important; float: right;"></i><br/>'
			+ modalHtml
			+ '<div id ="chartPanel_'
			+ newID
			+ '" class ="chartPanel" style="display: inline-block; margin-bottom: 0px; margin-right: 0px; height: 100%; width: 100%;  padding-bottom: 0px;  padding-right: 0px;">'
			+ '</div>'
			+ '<script> '
			+ '<![CDATA['
			+ '$(function() {   $(".fa-times").on("click", function() { var chartPanelId = $(this).parent().children("div")[1].id;	removeWidget(chartPanelId);}	);'
			+ '                 $(".fa-cog").on("click", function() { var widgetSettingsModalId = $(this).parent().children("div")[0].id;	openSettingsModal(widgetSettingsModalId, '
			+ newID
			+ ');}	);'
			+ '}  );'
			+ '  ]]>'
			+ '</script>'
			+ '</div></div>'
			+ '<span class="gs-resize-handle gs-resize-handle-both"></span>'
			+ '</li>';

	widgetHtml = widgetHtml.replace("chartPanelIDPlaceHolder", newID);

	gridsterUl.gridster().data('gridster').add_widget(widgetHtml, 2, 1);

	$('span.gs-resize-handle').click(function() {
		console.log("Resizing...");
		//
		// var a = $(this).parent().children('div')[0];
		// var b = $(a).children('div')[0];
		// var c = $(b).children('div.chartPanel');
		// var liWidth = $(c).width();
		// var liHeight = $(c).height();
		//
		// var chartPanelIdStr = "#" + $(c).attr('id');
		// var chartObj = $(chartPanelIdStr).highcharts();
		// // chartObj.width = (liWidth - 22);
		// // chartObj.height = (liHeight - 22);
		//
		// chartObj.setSize((liWidth), (liHeight));
		// chartObj.reflow();
	});

}

function removeWidget(chartPanelId) {
	var widgetIndex = $("#" + chartPanelId).closest('li').index();
	var gridster = $(".gridster ul").gridster().data('gridster');
	gridster.remove_widget($('.gridster li').eq(widgetIndex));
	serializedGridster = gridster.serialize();
}
function openSettingsModal(widgetSettingsModalId, newId) {
	console.log("Modal will open with widget Id: " + widgetSettingsModalId
			+ ";  newId: " + newId);
	var widgetSettingsModalIdStr = "#" + widgetSettingsModalId;

	$(widgetSettingsModalIdStr).on(
			'show.bs.modal',
			function() {
				console.log("Modal will show with widget Id: ");

				var liElement = $(widgetSettingsModalIdStr).closest("li")[0];

				var widgetNameInput = $(widgetSettingsModalIdStr).find(
						"#widgetName")[0];
				$(widgetNameInput).val($(liElement).attr('data-widgetName'));

				var serieTypeInput = $(widgetSettingsModalIdStr).find(
						"#serieType")[0];
				$(serieTypeInput).val($(liElement).attr('data-serieType'));

				var aggregationTypeInput = $(widgetSettingsModalIdStr).find(
						"#aggregationType")[0];
				$(aggregationTypeInput).val(
						$(liElement).attr('data-aggregationType'));

				var categoryTypeInput = $(widgetSettingsModalIdStr).find(
						"#categoryType")[0];
				$(categoryTypeInput)
						.val($(liElement).attr('data-categoryType'));

				var chartTypeInput = $(widgetSettingsModalIdStr).find(
						"#chartType")[0];
				$(chartTypeInput).val($(liElement).attr('data-chartType'));

				var valueTypeInput = $(widgetSettingsModalIdStr).find(
						"#valueType")[0];
				$(valueTypeInput).val($(liElement).attr('data-valueType'));

				var conditionlist = $(widgetSettingsModalIdStr).find(
						"#conditionlist");

				if ($(liElement).attr('data-conditionStr') != null) {

					var conditionStrList = $(liElement).attr(
							'data-conditionStr').split("$__$");

					for (i = 0; i < conditionStrList.length; i++) {

						if (conditionStrList[i].trim().length > 0) {

							var conditionPartList = conditionStrList[i]
									.split("#__#");

							var conditionId = conditionPartList[0];
							var columnType = conditionPartList[1];
							var operatorType = conditionPartList[2];
							var inputType = conditionPartList[3];
							var inputValue = conditionPartList[4];

							var conditionElement = $(widgetSettingsModalIdStr)
									.find("#" + conditionId);

							// $(conditionElement).val(inputValue);
							var columnSelectElId = $($(conditionElement)[0])
									.find("#columnType")[0].id;
							;
							var operatorSelectElId = $($(conditionElement)[0])
									.find("#operatorType")[0].id;
							;
							var inputEl = $($(conditionElement)[0]).find(
									"input");

							$(
									"#" + conditionId + " #" + columnSelectElId
											+ " option[value='" + columnType
											+ "']").attr("selected", true);
							$(
									"#" + conditionId + " #"
											+ operatorSelectElId
											+ " option[value='" + operatorType
											+ "']").attr("selected", true);
							$(inputEl).val(inputValue);

						}
					}
				}

				$(document.body).on(
						'click',
						'.changeType',
						function() {
							$(this).closest('.condition-input').find(
									'.type-text').text($(this).text());
							$(this).closest('.condition-input').find(
									'.type-input').val(
									$(this).data('type-value'));
						});

				$(document.body).on(
						'click',
						'.btn-add-and-condition',
						function(event) {
							event.stopImmediatePropagation();
							var nextID = getNextConditionID();
							var nextIDStr = nextID.toString();
							var conditionRow2 = replaceAll(replaceAll(
									conditionRow, "conditionIDPlaceHolder",
									nextIDStr), "conditionTypePlaceHolder",
									"AND");

							$($(this).parent().find('.condition-list')[0])
									.append(conditionRow2);
						});

				$(document.body).on(
						'click',
						'.btn-add-or-condition',
						function(event) {
							event.stopImmediatePropagation();
							var nextID = getNextConditionID();
							var nextIDStr = nextID.toString();
							var conditionRow2 = replaceAll(replaceAll(
									conditionRow, "conditionIDPlaceHolder",
									nextIDStr), "conditionTypePlaceHolder",
									"OR");

							$($(this).parent().find('.condition-list')[0])
									.append(conditionRow2);
						});
				$(document.body).on(
						'click',
						'.btn-remove-condition',
						function() {
							$(this).closest('.condition-input').remove();
							$(
									'label[for="'
											+ $(this).closest(
													'.condition-input')[0].id
											+ '"]').remove();
						});

				$(document.body).on('change', '#columnType', function(event) {
					event.stopImmediatePropagation();
					var selectValue = this.value;
					if (selectValue == "group_name") {
						var tempId = $($(this).parent().find('input'))[0].id;
						var a = $('#' + tempId)[0].id;
						$(a).datetimepicker('remove');
						$($(this).parent().find('input'))[0].type = "text";
					}
					if (selectValue == "md_dpvalue") {
						var tempId = $($(this).parent().find('input'))[0].id;
						var a = $('#' + tempId)[0].id;
						$(a).datetimepicker('remove');
						$($(this).parent().find('input'))[0].type = "number";
					}
					if (selectValue == "md_cdate") {
						// var temp = $(this).parent();
						var temp = $($(this).parent().find('input'))[0];
						// $(temp).prop("type",
						// "datetime");
						var tempId = $(temp)[0].id;

						$('#' + tempId).datetimepicker({
							format : 'yyyy-mm-dd hh:ii',
							showTodayButton : true,
							sideBySide : true,
							orientation : "top auto",
							clearBtn : true,
							showClose : true,
							showClear : true,
							toolbarPlacement : 'top',
							language : "en",
							maxViewMode : 2
						});

						// $($(this).parent().find('input'))[0].type
						// = "datetime";
					}
				});

			});

	$(widgetSettingsModalIdStr).modal('show');
}

$(document)
		.on(
				"click",
				"#updateWidget",
				function(event) {

					var liElement = $(this).closest('li');
					var divChildren = liElement.children('div').children('div')
							.children('div');
					var chartPanelDiv;
					var chartPanelDivWidth;
					var chartPanelDivHeight;
					var modalElementIdStr;

					for (i = 0; i < divChildren.length; i++) {
						if (divChildren[i].id.indexOf("chartPanel_") >= 0) {
							chartPanelDiv = divChildren[i];
							chartPanelDivWidth = liElement.width();
							chartPanelDivHeight = liElement.height() - 22;
							// break;
						}
						if (divChildren[i].id.indexOf("widgetSettingsModal_") >= 0) {
							modalElementIdStr = "#" + divChildren[i].id;
						}
					}
					var widgetName = $(modalElementIdStr).find('#widgetName')
							.val();
					var chartType = $(modalElementIdStr).find('#chartType')
							.val();
					var serieType = $(modalElementIdStr).find('#serieType')
							.val();
					var aggregationType = $(modalElementIdStr).find(
							'#aggregationType').val();
					var valueType = $(modalElementIdStr).find('#valueType')
							.val();
					var categoryType = $(modalElementIdStr).find(
							'#categoryType').val();

					var conditionStr = "";
					var conditionlist = $(modalElementIdStr).find(
							"#conditionlist div");
					for (i = 0; i < conditionlist.length; i++) {
						conditionStr += "$__$"
								+ conditionlist[i].id
								+ "#__#"
								+ $(conditionlist[i]).find("#columnType").val()
								+ "#__#"
								+ $(conditionlist[i]).find("#operatorType")
										.val()
								+ "#__#"
								+ $(conditionlist[i]).find("input")
										.attr('type') + "#__#"
								+ $(conditionlist[i]).find("input").val();
					}

					console.log(conditionStr);

					$(liElement).attr('data-widgetName', widgetName);
					$(liElement).attr('data-chartType', chartType);
					$(liElement).attr('data-serieType', serieType);
					$(liElement).attr('data-aggregationType', aggregationType);
					$(liElement).attr('data-valueType', valueType);
					$(liElement).attr('data-categoryType', categoryType);
					$(liElement).attr('data-conditionStr', conditionStr);

					var conditionList = $(liElement).find(".condition-input");
					var conditionStr = "";
					for (i = 0; i < conditionList.length; i++) {
						var temp = $(conditionList)[i];
						var logicOperator = $(
								'label[for="' + $(temp)[0].id + '"]').html();
						var column = $(temp).find("#columnType").val();
						var operator = $(temp).find("#operatorType").val();
						var conditionInput = $(temp).find("input").val();
						conditionStr += " " + logicOperator + " " + column
								+ " " + operator + " " + conditionInput;
					}

					var chartData = getChartData(serieType, aggregationType,
							valueType, categoryType, conditionStr);

					// console.log(chartData);

					var chart = new Highcharts.Chart(
							{
								chart : {
									renderTo : chartPanelDiv.id,
									width : chartPanelDivWidth,
									height : chartPanelDivHeight,
									type : chartType
								},
								title : {
									text : widgetName
								},
								xAxis : {
									categories : chartData.categories
								},
								series : chartData.series,
								plotOptions : {
									series : {
										dataLabels : {
											enabled : true,
											format : '{series.name}: {point.y:.1f}'
										}
									},
									pie : {
										dataLabels : {
											enabled : true,
											format : '{point.categoryName}: {point.y:.1f}'
										}
									}
								},
								tooltip : {
									formatter : function() {
										var sliceIndex = this.point.index;
										var sliceName = this.series.chart.axes[0].categories[sliceIndex];
										return '<b>' + this.y
												+ '</b> <br/> at ' + sliceName
												+ ' for ' + this.series.name;
									}
								},
								responsive : {
									rules : [ {
										condition : {
											maxWidth : 500
										},
										chartOptions : {
											legend : {
												align : 'center',
												verticalAlign : 'bottom',
												layout : 'horizontal'
											},
											yAxis : {
												labels : {
													align : 'left',
													x : 0,
													y : -5
												},
												title : {
													text : aggregationType
															+ ' Of '
															+ valueType
												}
											},
											subtitle : {
												text : null
											},
											credits : {
												enabled : false
											}
										}
									} ]
								}

							});

					// chart.xAxis[0].setCategories(['One', 'Two', 'Three']);

					$(modalElementIdStr).modal('toggle');
				});

/**
 * Returns json result of gridster ul element
 */
function serializeGridster() {

	var serializeJsonArr = new Array();

	$(".gridster ul li").each(function(i) {

		var serializeJson = {};

		var index = $(this).index();
		var id = $(this).attr('id');
		var classes = $(this).attr('class');
		var style = $(this).attr('style');

		var widgetCounter = $(this).attr('data-widgetcounter');
		var widgetName = $(this).attr('data-widgetName');
		var chartType = $(this).attr('data-chartType');
		var serieType = $(this).attr('data-serieType');
		var aggregationType = $(this).attr('data-aggregationType');
		var valueType = $(this).attr('data-valueType');
		var categoryType = $(this).attr('data-categoryType');
		var conditionStr = $(this).attr('data-conditionStr');

		var row = $(this).attr('data-row');
		var col = $(this).attr('data-col');
		var sizex = $(this).attr('data-sizex');
		var sizey = $(this).attr('data-sizey');

		var tempThis = $(this).clone();
		var a = $(tempThis).find(".highcharts-container");
		$(a).remove();
		var liHtml = $(tempThis).html();

		// serializeJson["text"] = text;
		serializeJson["id"] = id;
		serializeJson["classes"] = classes;
		serializeJson["style"] = style;
		serializeJson["widgetCounter"] = widgetCounter;
		serializeJson["widgetName"] = widgetName;
		serializeJson["chartType"] = chartType;
		serializeJson["serieType"] = serieType;
		serializeJson["aggregationType"] = aggregationType;
		serializeJson["valueType"] = valueType;
		serializeJson["categoryType"] = categoryType;
		serializeJson["conditionStr"] = conditionStr;
		serializeJson["row"] = row;
		serializeJson["col"] = col;
		serializeJson["sizex"] = sizex;
		serializeJson["sizey"] = sizey;
		serializeJson["liHtml"] = liHtml;

		serializeJsonArr.push(serializeJson);
	});

	// console.log(serializeJsonArr);
	return serializeJsonArr;
}

function getNextChartPanelId() {
	var id = 0;

	if (chartPanelIdBox.length > 0) {
		id = Math.max.apply(Math, chartPanelIdBox) + 1;
	}
	return id;
}

function getNextConditionID() {
	var id = 0;

	if (conditionIDBox.length > 0) {
		id = Math.max.apply(Math, conditionIDBox) + 1;
	}

	conditionIDBox.push(id);
	return id;
}

function getChartData(serieType, aggregationType, valueType, categoryType,
		conditionStr) {
	var chartData = "";

	$
			.ajax({
				type : "GET",
				url : ctxPath
						+ "/widgetContainer.html/ajax?operation=getChartData&serieType="
						+ serieType + "&aggregationType=" + aggregationType
						+ "&valueType=" + valueType + "&categoryType="
						+ categoryType + "&conditionStr=" + conditionStr,

				contentType : "application/json; charset=utf-8",
				beforeSend : function() {
				},
				async : false,
				headers : {
					"Accept" : "application/json"
				},
				success : function(data) {
					var resource = jQuery.parseJSON(data);
					if (resource.model.hasOwnProperty("message")) {
						alertify.error(resource.model.message);
					} else {
						chartData = resource.model;
					}
				},
				error : function(e) {
					console.log("ERROR: ", e);
				}
			});

	return chartData;
}

function checkIfRequiredFieldsSelected(serializedGridsterJson) {

	if (serializedGridsterJson.widgetName == null) {
		alertify
				.error("The <b>"
						+ "Widget Name "
						+ "</b>field  must be filled!</br> <div>Update widget please from <i class=\"fa fa-cog\" style=\"font-size: 18px !important; margin-left:10px;\"></i>.</div>");
		return false;
	}
	if (serializedGridsterJson.chartType == null) {
		alertify
				.error("The <b>"
						+ "Chart Type "
						+ "</b>field  must be selected!</br> <div>Update widget please from <i class=\"fa fa-cog\" style=\"font-size: 18px !important; margin-left:10px;\"></i>.</div>");
		return false;
	}
	if (serializedGridsterJson.serieType == null) {
		alertify
				.error("The <b>"
						+ "Serie Type "
						+ "</b>field  must be selected!</br> <div>Update widget please from <i class=\"fa fa-cog\" style=\"font-size: 18px !important; margin-left:10px;\"></i>.</div>");

		return false;
	}
	if (serializedGridsterJson.aggregationType == null) {
		alertify
				.error("The <b>"
						+ "Aggregation Type "
						+ "</b>field  must be selected!</br> <div>Update widget please from <i class=\"fa fa-cog\" style=\"font-size: 18px !important; margin-left:10px;\"></i>.</div>");

		return false;
	}
	if (serializedGridsterJson.valueType == null) {
		alertify
				.error("The <b>"
						+ "Value Type "
						+ "</b>field  must be selected!</br> <div>Update widget please from <i class=\"fa fa-cog\" style=\"font-size: 18px !important; margin-left:10px;\"></i>.</div>");

		return false;
	}
	if (serializedGridsterJson.categoryType == null) {
		alertify
				.error("The <b>"
						+ "Category Type "
						+ "</b>field  must be selected!</br> <div>Update widget please from <i class=\"fa fa-cog\" style=\"font-size: 18px !important; margin-left:10px;\"></i>.</div>");

		return false;
	}
	return true;

}
function getContextPath() {
	return window.location.pathname.substring(0, window.location.pathname
			.indexOf("/", 2));
}

function replaceAll(str, oldChar, newChar) {
	var tokens = str.split(oldChar);
	return tokens.join(newChar);

}