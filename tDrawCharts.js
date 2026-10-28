


function butterflyObsCountChart(eleId) {
		
	//Build the chartArray domain column
	var chartArray = [];
	chartArray[0] = ["Date"];
	for (var i = 0; i < dateArr.length; i++) {
		chartArray[i+1] = [dateArr[i]];
	};

	//Build the chartArray parameter columns
	var yearArr = Object.keys(butterflyCountObj);
	for (var j = 0; j < yearArr.length; j++) {
		var year = yearArr[j];
		chartArray[0].push(year)
		for (var i = 0; i < dateArr.length; i++) {
			var paramValue = butterflyCountObj[year].obsSumVector[i];
			chartArray[i+1].push(
				paramValue,
				);
		};
	};
	
	
	//Check chartArray validity and fix if necessary
	if (chartArray[0].length <= 1) {
		chartArray = [];
		chartArray[0] = ['Date', 'value', {role:'annotation'}]
		chartArray[1] = [dateArr[0], 0, 'No Data'];
	};
	//console.log(chartArray.slice(0, 5));
	//console.log(chartArray.slice(-5));
	
	//Calculate the x-axis start and end dates
	var plotStartDate = dateArr[0];
	var plotEndDate = dateArr[dateArr.length-1];
	
	//Define the chart options
	var chartOptions = {
		height: 500,
		width:  1100,
		chartArea: {
			top: 60,
			height: "80%",
			width: "80%",
		},
		title: "Butterfly Observation Count",
		/*legend: {
			position: 'top',
		},*/
		vAxis: {
			title: 'Number',
			viewWindow: {
			},
		},
		hAxis : {
			format: 'MMM-d',
			textStyle: {bold:true, fontSize: 14},
			viewWindow: {
				min: plotStartDate,
				max: plotEndDate,
			},
		},
		pointsVisible: false,
		connectSteps: false,
		lineWidth: 2,
		series : {},
	};
	
	
	//Refine the chart style
	var chartType = 'scatter';
	
	//Create the chart
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};




function butterflySpeciesCountChart(eleId) {
		
	//Build the chartArray domain column
	var chartArray = [];
	chartArray[0] = ["Date"];
	for (var i = 0; i < dateArr.length; i++) {
		chartArray[i+1] = [dateArr[i]];
	};

	//Build the chartArray parameter columns
	var yearArr = Object.keys(butterflyCountObj);
	for (var j = 0; j < yearArr.length; j++) {
		var year = yearArr[j];
		chartArray[0].push(year)
		for (var i = 0; i < dateArr.length; i++) {
			var paramValue = butterflyCountObj[year].speciesSumVector[i];
			chartArray[i+1].push(
				paramValue,
				);
		};
	};
	
	
	//Check chartArray validity and fix if necessary
	if (chartArray[0].length <= 1) {
		chartArray = [];
		chartArray[0] = ['Date', 'value', {role:'annotation'}]
		chartArray[1] = [dateArr[0], 0, 'No Data'];
	};
	//console.log(chartArray.slice(0, 5));
	//console.log(chartArray.slice(-5));
	
	//Calculate the x-axis start and end dates
	var plotStartDate = dateArr[0];
	var plotEndDate = dateArr[dateArr.length-1];
	
	//Define the chart options
	var chartOptions = {
		height: 500,
		width: 1100,
		chartArea: {
			top: 60,
			height: "80%",
			width: "80%",
		},
		title: "Butterfly Species Count",
		/*legend: {
			position: 'top',
		},*/
		vAxis: {
			title: 'Number',
			viewWindow: {
			},
		},
		hAxis : {
			format: 'MMM-d',
			textStyle: {bold:true, fontSize: 14},
			viewWindow: {
				min: plotStartDate,
				max: plotEndDate,
			},
		},
		pointsVisible: false,
		connectSteps: false,
		lineWidth: 2,
		series : {},
	};
	
	
	//Refine the chart style
	var chartType = 'scatter';
	
	//Create the chart
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};


function butterflyChart(eleId) {
		
	//Set the number of taxons to chart
	var numTaxon = 100;
	numTaxon = Math.min(numTaxon, butterflyObsObjArr.length);
	
	//Sort the genera objects to be charted by date of the first observation.
	var subObjArr = butterflyObsObjArr.slice(0,numTaxon);
	subObjArr.sort((a,b) => (a.obsFirstDateIndex < b.obsFirstDateIndex) ? 1 : -1);
	
	//Build the chartArray domain column
	var chartArray = [];
	chartArray[0] = ["Date"];
	for (var i = 0; i < dateArr.length; i++) {
		chartArray[i+1] = [dateArr[i]];
	};

	//Build the chartArray parameter columns
	//var seriesArr = [];
	for (var j = 0; j < subObjArr.length; j++) {
		var commonName = subObjArr[j].commonName;
		var taxonName = subObjArr[j].taxonName;
		var plotColor = 'green';
		if (butterflyColorObj.hasOwnProperty(taxonName)) {
			plotColor = butterflyColorObj[taxonName].plotColor;
		};
		chartArray[0].push(commonName, {role: 'style'});
		for (var i = 0; i < dateArr.length; i++) {
			var paramValue = subObjArr[j].obsTimeVector[i];
			if (paramValue >= 1) {
				paramValue = 1 * (j+1);
			};
			chartArray[i+1].push(
				paramValue,
				'fill-color:' + plotColor + '; stroke-color: black');
		};
	};
	
	
	//Check chartArray validity and fix if necessary
	if (chartArray[0].length <= 1) {
		chartArray = [];
		chartArray[0] = ['Date', 'value', {role:'annotation'}]
		chartArray[1] = [dateArr[0], 0, 'No Data'];
	};
	//console.log(chartArray.slice(0, 5));
	//console.log(chartArray.slice(-5));
	
	//Calculate the x-axis start and end dates
	var plotStartDate = dateArr[0];
	var plotEndDate = dateArr[dateArr.length-1];
	
	//Define the chart options
	var chartOptions = {
		height: 40 + 60 + 40*numTaxon,
		width: 1100,
		chartArea: {
			top: 60,
			height: 40*numTaxon,
			width: "90%",
		},
		title: "Butterfly Observations",
		legend: {
			position: 'none',
		},
		vAxis: {
			//title: 'Number',
			textPosition: 'in',
			textStyle: {bold:true, fontSize: 14},
			viewWindow: {
				min: 0,
				max: numTaxon + 1,
			},
			ticks: [],  //See the logic below for setting the tick labels
			gridlines: {'color':'white'},
		},
		hAxis : {
			format: 'MMM-d',
			textStyle: {bold:true, fontSize: 14},
			viewWindow: {
				min: plotStartDate,
				max: plotEndDate,
			},
		},
		lineWidth: 2,
		series : {},
	};
	
	//Set the vAxis tick labels to the Genera common names
	chartOptions.vAxis.ticks = [];
	for (var i = 0; i < subObjArr.length; i++) {
		var commonName = subObjArr[i].commonName;
		chartOptions.vAxis.ticks.push({v:i+1.3, f:commonName});
	};
		
	//Refine the chart style
	var chartType = 'scatter';
	
	//Create the chart
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function ofvsGeneraChart(eleId) {
	
	//Set the number of genera to chart
	var numGenera = 30;
	numGenera = Math.min(numGenera, ofvsGeneraObjArr.length);
	
	//Sort the genera objects to be charted by date of the second observation.
	var subObjArr = ofvsGeneraObjArr.slice(0,numGenera);
	subObjArr.sort((a,b) => (a.obsSecondDateIndex < b.obsSecondDateIndex) ? 1 : -1);
	
	//Build the chartArray domain column
	var chartArray = [];
	chartArray[0] = ["Date"];
	for (var i = 0; i < dateArr.length; i++) {
		chartArray[i+1] = [dateArr[i]];
	};

	//Build the chartArray parameter columns
	//var seriesArr = [];
	for (var j = 0; j < subObjArr.length; j++) {
		var genus = subObjArr[j].genus;
		var plotColor = 'green';
		if (subObjArr[j].hasOwnProperty('plotColor')) {
			plotColor = subObjArr[j].plotColor;
		};	
		//console.log(genus, plotColor)

		chartArray[0].push(genus, {role: 'style'});
		for (var i = 0; i < dateArr.length; i++) {
			var paramValue = subObjArr[j].obsTimeVector[i];
			if (paramValue >= 1) {
				paramValue = 1 * (j+1);
			};
			chartArray[i+1].push(
				paramValue,
				'fill-color:' + plotColor + '; stroke-color: black');
		};
	};

	
	//Check chartArray validity and fix if necessary
	if (chartArray[0].length <= 1) {
		chartArray = [];
		chartArray[0] = ['Date', 'value', {role:'annotation'}]
		chartArray[1] = [dateArr[0], 0, 'No Data'];
	};
	//console.log(chartArray.slice(0, 5));
	//console.log(chartArray.slice(-5));
	
	//Calculate the x-axis start and end dates
	var plotStartDate = dateArr[0];
	var plotEndDate = dateArr[dateArr.length-1];
	
	//Define the chart options
	var chartOptions = {
		height: 40 + 60 + 40*numGenera,
		width:  1100,
		chartArea: {
			top: 60,
			height: 40*numGenera,
			width: "90%",
		},
		title: "Flower Genera Visit Observations - Top " + numGenera,
		legend: {
			position: 'none',
		},
		vAxis: {
			//title: 'Number',
			textPosition: 'in',
			textStyle: {bold:true, fontSize: 14},
			viewWindow: {
				min: 0,
				max: numGenera + 1,
			},
			ticks: [],  //See the logic below for setting the tick labels
			gridlines: {'color':'white'},
		},
		hAxis : {
			format: 'MMM-d',
			textStyle: {bold:true, fontSize: 14},
			viewWindow: {
				min: plotStartDate,
				max: plotEndDate,
			},
		},
		lineWidth: 2,
		series : {},
	};
	
	//Set the vAxis tick labels to the Genera common names
	chartOptions.vAxis.ticks = [];
	for (var i = 0; i < subObjArr.length; i++) {
		var genus = subObjArr[i].genus;
		chartOptions.vAxis.ticks.push({v:i+1.3, f:genus});
	};
		
	//Refine the chart style
	var chartType = 'scatter';
	
	//Create the chart
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};


function ofvsSpeciesChart(eleId) {
	
	//Set the number of genera to chart
	var numSpecies = 40;
	numSpecies = Math.min(numSpecies, ofvsSpeciesObjArr.length);
	
	//Sort the species objects to be charted by date of the second observation.
	var subObjArr = ofvsSpeciesObjArr.slice(0,numSpecies);
	subObjArr.sort((a,b) => (a.obsSecondDateIndex < b.obsSecondDateIndex) ? 1 : -1);
	
	//Build the chartArray domain column
	var chartArray = [];
	chartArray[0] = ["Date"];
	for (var i = 0; i < dateArr.length; i++) {
		chartArray[i+1] = [dateArr[i]];
	};

	//Build the chartArray parameter columns
	//var seriesArr = [];
	for (var j = 0; j < subObjArr.length; j++) {
		var commonName = subObjArr[j].commonName;
		var genus = subObjArr[j].genus;
		var taxon = subObjArr[j].taxon;
		var plotColor = 'green';
		if (ofvsGeneraObj.hasOwnProperty(genus)) {
			plotColor = ofvsGeneraObj[genus].plotColor;
		};
		if (ofvsSpeciesAlternateColorObj.hasOwnProperty(taxon)) {
			plotColor = ofvsSpeciesAlternateColorObj[taxon].plotColor;
		};
		chartArray[0].push(commonName, {role: 'style'});
		for (var i = 0; i < dateArr.length; i++) {
			var paramValue = subObjArr[j].obsTimeVector[i];
			if (paramValue >= 1) {
				paramValue = 1 * (j+1);
			};
			chartArray[i+1].push(
				paramValue,
				'fill-color:' + plotColor + '; stroke-color: black');
		};
	};

	
	//Check chartArray validity and fix if necessary
	if (chartArray[0].length <= 1) {
		chartArray = [];
		chartArray[0] = ['Date', 'value', {role:'annotation'}]
		chartArray[1] = [dateArr[0], 0, 'No Data'];
	};
	//console.log(chartArray.slice(0, 5));
	//console.log(chartArray.slice(-5));
	
	//Calculate the x-axis start and end dates
	var plotStartDate = dateArr[0];
	var plotEndDate = dateArr[dateArr.length-1];
	
	//Define the chart options
	var chartOptions = {
		height: 40 + 60 + 40*numSpecies,
		width: 1100,
		chartArea: {
			top: 60,
			height: 40*numSpecies,
			width: "90%",
		},
		title: "Flower Species Visit Observations - Top " + numSpecies,
		legend: {
			position: 'none',
		},
		vAxis: {
			//title: 'Number',
			textPosition: 'in',
			textStyle: {bold:true, fontSize: 14},
			viewWindow: {
				min: 0,
				max: numSpecies + 1,
			},
			ticks: [],  //See the logic below for setting the tick labels
			gridlines: {'color':'white'},
		},
		hAxis : {
			format: 'MMM-d',
			textStyle: {bold:true, fontSize: 14},
			viewWindow: {
				min: plotStartDate,
				max: plotEndDate,
			},
		},
		lineWidth: 2,
		series : {},
	};
	
	//Set the vAxis tick labels to the Genera common names
	chartOptions.vAxis.ticks = [];
	for (var i = 0; i < subObjArr.length; i++) {
		var commonName = subObjArr[i].commonName;
		chartOptions.vAxis.ticks.push({v:i+1.3, f:commonName});
	};
		
	//Refine the chart style
	var chartType = 'scatter';
	
	//Create the chart
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};