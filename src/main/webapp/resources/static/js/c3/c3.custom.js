// C3 Chart 1
var chart1 = c3.generate({
	bindto : '#lineGraphXXX',
	data : {
		x : 'x',
		columns : [
				[ 'x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04',
						'2013-01-05', '2013-01-06', '2013-01-07', '2013-01-08',
						'2013-01-09', '2013-01-10', '2013-01-11', '2013-01-12',
						'2013-01-13', '2013-01-14', '2013-01-15', '2013-01-16',
						'2013-01-17', '2013-01-18', '2013-01-19', '2013-01-20',
						'2013-01-21', '2013-01-22', '2013-01-23', '2013-01-24',
						'2013-01-25', '2013-01-26', '2013-01-27', '2013-01-28',
						'2013-01-29', '2013-01-30', '2013-01-31' ],
				[ 'data1', 14, 28, 31, 49, 57, 59, 52, 48, 55, 58, 62, 60, 62,
						58, 55, 61, 70, 80, 77, 78, 82, 98, 99, 121, 136, 115,
						112, 120, 103, 117 ],
				[ 'data2', 3, 16, 19, 24, 27, 32, 38, 36, 32, 36, 40, 48, 41,
						44, 46, 53, 58, 62, 65, 61, 64, 62, 59, 63, 87, 92, 72,
						81, 75, 80 ], ],
		names : {
			data1 : 'A Class Lamps',
			data2 : 'B Class Lamps'
		},
		colors : {
			data1 : '#f0b518',
			data2 : '#3a86c8'
		},
	},
	axis : {
		x : {
			type : 'timeseries',
			tick : {
				// this also works for non timeseries data
				values : [ '2013-01-05', '2013-01-30' ]
			}
		}
	}
});

// C3 Chart 2
var chart2 = c3.generate({
	bindto : '#splineGraph',
	data : {
		columns : [
				[ 'data1', 24, 28, 31, 49, 57, 59, 52, 48, 55, 58, 62, 60, 62,
						58, 55, 61, 70, 80, 77, 78, 82, 98, 99, 105, 102, 95,
						92, 100, 103, 117, 121, 126 ],
				[ 'data2', 15, 16, 19, 24, 27, 32, 38, 36, 32, 36, 40, 48, 41,
						44, 46, 53, 58, 62, 65, 61, 64, 62, 59, 63, 67, 69, 72,
						71, 75, 80, 65, 71 ], ],
		types : {
			data1 : 'spline',
			data2 : 'area-spline'
		},
		names : {
			data1 : 'Likes',
			data2 : 'Clicks'
		},
		colors : {
			data1 : '#3a86c8',
			data2 : '#c282e0'
		},
	}
});

// C3 Chart 3
var chart3 = c3.generate({
	bindto : '#areaSplineGraph',
	data : {
		columns : [
				[ 'data1', 24, 49, 52, 48, 62, 60, 62, 70, 80, 82, 95, 92, 100,
						103, 117, 121, 136 ],
				[ 'data2', 15, 27, 39, 32, 40, 48, 46, 57, 64, 62, 59, 71, 75,
						80, 65, 71, 102 ], ],
		types : {
			data1 : 'area-spline',
			data2 : 'area-spline'
		},
		names : {
			data1 : 'Male',
			data2 : 'Female'
		},
		colors : {
			data1 : '#F782AA',
			data2 : '#3a86c8'
		},
	}
});

// C3 Chart 4
var chart4 = c3.generate({
	bindto : '#stepGraph',
	data : {
		columns : [
				[ 'data1', 52, 59, 78, 102, 95, 92, 100, 48, 55, 58, 62, 60,
						24, 28, 31, 49, 57, 103, 117, 121, 126 ],
				[ 'data2', 27, 32, 38, 36, 32, 36, 40, 15, 16, 82, 81, 85, 90,
						95, 71, 19, 24, 44, 59, 73, 77, 89 ], ],
		types : {
			data1 : 'step',
			data2 : 'area-step'
		},
		names : {
			data1 : 'Twitter',
			data2 : 'LinkedIn'
		},
		colors : {
			data1 : '#3a86c8',
			data2 : '#f0b518'
		},
	}
});

// C3 Chart 5
var chart5 = c3.generate({
	bindto : '#barAreaGraph',
	data : {
		columns : [
				[ 'data1', 24, 28, 31, 49, 57, 59, 52, 48, 55, 58, 62, 60, 62,
						58, 55, 61, 70, 80, 77, 78, 82, 98, 99, 105, 102, 95,
						92, 100, 103, 117, 121, 126 ],
				[ 'data2', 15, 16, 19, 24, 27, 32, 38, 36, 32, 36, 40, 48, 41,
						44, 46, 53, 58, 62, 65, 61, 64, 62, 59, 63, 67, 69, 72,
						71, 75, 80, 65, 71 ], ],
		types : {
			data1 : 'bar',
			data2 : 'area'
		},
		names : {
			data1 : 'Twitter',
			data2 : 'LinkedIn'
		},
		colors : {
			data1 : '#E9BB27',
			data2 : '#3a86c8'
		},
	}
});

// C3 Chart 6
var chart6 = c3.generate({
	bindto : '#barGraph',
	data : {
		columns : [
				[ 'data1', 15, 58, 62, 87, 32, 58, 55, 21, 20, 30, 98, 10, 22,
						98, 99, 105, 82, 57, 121, 78 ],
				[ 'data2', 21, 26, 30, 38, 11, 24, 36, 53, 58, 62, 65, 61, 64,
						32, 45, 71, 38, 23, 65, 11 ], ],
		type : 'bar',
		names : {
			data1 : 'Likes',
			data2 : 'Shares'
		},
		colors : {
			data1 : '#fee074',
			data2 : '#66c0dc'
		},
	}
});

// C3 Chart 7
var chart7 = c3.generate({
	bindto : '#stackedBarGraphXXX',
	data : {
		columns : [ [ 'data1', 30, 90, 200, 400, 590 ],
		// ['data2', 130, 100, 200, 200, 450, 150, 190, 220, 350, 180, 330, 550,
		// 280, 180, 200, 450, 150, 190, 220],
		// ['data3', 230, 200, 200, 300, 250, 250, 320, 180, 410, 270, 180, 210,
		// 270, 420, 330, 180, 410, 270, 180, 110]
		],
		type : 'bar',
		names : {
			data1 : 'Dim Levels',
		// data2: 'LinkedIn',
		// data3: 'Facebook',
		},
		colors : {
			data1 : '#1d73bd',
		// data2: '#E24B46',
		// data3: '#dddddd',
		},
		groups : [ [ 'data1' ] ]
	},
	axis : {
		x : {
			type : 'category',
			categories : [ '%20', '%40', '%60', '%80', '%100' ]
		}
	},
	grid : {
		x : {
			show : true,
		},
		y : {
			show : true
		}
	}
});

// C3 Chart 8
var chart8 = c3.generate({
	bindto : '#scatterPlot',
	data : {
		xs : {
			Male : 'male_x',
			Female : 'female_x',
		},
		columns : [
				[ "male_x", 3.5, 3.0, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1,
						3.7, 3.4, 3.0, 3.0, 4.0, 4.4, 3.9, 3.5, 3.8, 3.8, 3.4,
						3.7, 3.6, 3.3, 3.4, 3.0, 3.4, 3.5, 3.4, 3.2, 3.1, 3.4,
						4.1, 4.2, 3.1, 3.2, 3.5, 3.6, 3.0, 3.4, 3.5, 2.3, 3.2,
						3.5, 3.8, 3.0, 3.8, 3.2, 3.7, 3.3 ],
				[ "female_x", 3.2, 3.2, 3.1, 2.3, 2.8, 2.8, 3.3, 2.4, 2.9, 2.7,
						2.0, 3.0, 2.2, 2.9, 2.9, 3.1, 3.0, 2.7, 2.2, 2.5, 3.2,
						2.8, 2.5, 2.8, 2.9, 3.0, 2.8, 3.0, 2.9, 2.6, 2.4, 2.4,
						2.7, 2.7, 3.0, 3.4, 3.1, 2.3, 3.0, 2.5, 2.6, 3.0, 2.6,
						2.3, 2.7, 3.0, 2.9, 2.9, 2.5, 2.8 ],
				[ "Male", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1,
						0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2,
						0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4,
						0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2,
						0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2 ],
				[ "Female", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4,
						1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8,
						1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0,
						1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2,
						1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3 ], ],
		type : 'scatter',
		colors : {
			Male : '#3a86c8',
			Female : '#dd5826',
		},
	},
	axis : {
		x : {
			label : 'Male Visitors',
			tick : {
				fit : false
			}
		},
		y : {
			label : 'Female Visitors'
		}
	}
});

// C3 Chart 9
var chart9 = c3.generate({
	bindto : '#gwStatesPieChart',
	data : {
		// iris data from R
		columns : [ [ 'Active', window.result[0].ACTIVE ],
				[ 'Activation Ready', window.result[0].ACTIVATION_READY ],
				[ 'Testing', window.result[0].TESTING ],
				[ 'Test Ready', window.result[0].TEST_READY ],
				[ 'Manufactured', window.result[0].MANUFACTURE ],
				[ 'Suspend', window.result[0].SUSPENDED ],
				[ 'Deactive', window.result[0].DEACTIVE ],
				[ 'Error', window.result[0].ERROR ] ],
		type : 'pie',
		colors : {
			Likes : '#91c46b',
			Shares : '#3a86c8',
		},
		onclick : function(d, i) {
			console.log("onclick", d, i);
		},
		onmouseover : function(d, i) {
			console.log("onmouseover", d, i);
		},
		onmouseout : function(d, i) {
			console.log("onmouseout", d, i);
		}
	}
});

// C3 Chart 10
var chart10 = c3.generate({
	bindto : '#donutChart',
	data : {
		columns : [ [ '1.0', 12 ], [ '1.1', 22 ], [ '1.2', 14 ], [ '2.0', 60 ],
				[ '2.1', 29 ], [ '2.2', 135 ] ],
		type : 'donut',
		colors : {
			Likes : '#c282e0',
			Shares : '#c38fbb',
			Clicks : '#F782AA',
		},
		onclick : function(d, i) {
			// console.log("onclick", d, i);
		},
		onmouseover : function(d, i) {
			// console.log("onmouseover", d, i);
		},
		onmouseout : function(d, i) {
			// console.log("onmouseout", d, i);
		}
	},
	donut : {
		title : "Clicks"
	},
});

// C3 Chart 11
var chart11 = c3.generate({
	bindto : '#serverRequests',
	padding : {
		top : 10,
		left : 40,
	},
	data : {
		columns : [
				[ 'data1', 18, 22, 90, 33, 19, 21, 28, 21, 19, 43, 23, 34, 55,
						43, 33, 77, 33, 87, 46, 39, 51, 32, 66, 99, 32, 54, 33,
						24, 54, 22, 37, 76, 67, 89, 34, 12, 77, 99, 59, 66, 28,
						77, 39, 60, 66, 99, 32, 54, 33, 24, 54, 22, 37, 76, 67,
						89, 34, 12, 77, 99, 59, 66, 28, 77, 39, 60 ], ],
		types : {
			data1 : 'area',
		},
		names : {
			data1 : 'Requests',
		},
		colors : {
			data1 : '#c38fbb',
		},
	},
	axis : {
		y : {
			tick : {
				count : 3,
			}
		}
	}
});

// Domestic
var chart12 = c3.generate({
	bindto : '#domestic',
	data : {
		columns : [ [ 'Domestic', 70 ], [ 'International', 120 ], ],
		type : 'pie',
		colors : {
			Domestic : '#E24B46',
			International : '#1d73bd',
		},
	},
	legend : {
		show : false
	},
	tooltip : {
		show : false
	},
	pie : {
		label : {
			show : false
		}
	},
});

// Domain
var chart13 = c3.generate({
	bindto : '#domain',
	data : {
		columns : [ [ 'Com', 100 ], [ 'Org', 20 ], [ 'Net', 15 ],
				[ 'Biz', 10 ], [ 'Others', 5 ], ],
		type : 'pie',
		colors : {
			Com : '#fa9255',
			Org : '#fee074',
			Net : '#47BCC7',
			Biz : '#F782AA',
			Others : '#aed048',
		},
	},
	legend : {
		show : false
	},
	tooltip : {
		show : false
	},
	pie : {
		label : {
			show : false
		}
	},
});

// Images
var chart14 = c3.generate({
	bindto : '#imgFonts',
	data : {
		columns : [ [ 'Images', 170 ], [ 'Fonts', 50 ], [ 'Text', 30 ], ],
		type : 'pie',
		colors : {
			Images : '#5c6bc2',
			Fonts : '#C790E1',
			Text : '#F782AA',
		},
	},
	legend : {
		show : false
	},
	tooltip : {
		show : false
	},
	pie : {
		label : {
			show : false
		}
	},
});

// Gloval VS Local
var chart5 = c3.generate({
	bindto : '#globalLocal',
	data : {
		columns : [
				[ 'data2', 15, 19, 27, 32, 38, 36, 32, 36, 40, 48, 46, 53, 58,
						62, 65, 99 ], ],
		types : {
			data2 : 'area-spline'
		},
		names : {
			data2 : 'Active Users'
		},
		colors : {
			data2 : '#52bf8a'
		},
	},
	axis : {
		x : {
			show : false
		},
		y : {
			show : false
		},
	}
});