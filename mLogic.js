
//Load google charts
//google.charts.load('current', {'packages':['corechart', 'geochart', 'map', 'timeline'],         'mapsApiKey': 'AIzaSyAzOflwgYp38oQVg-4qPxmaokmWo8Z0H0g'});
google.charts.load('current', {'packages':['corechart', 'geochart', 'map', 'timeline']});


buildWindow('window', uiWindowObj2);

//Open the first menu window
document.getElementById("tB209").click();




function dispInteract(eleId) {
	var thisWindowFunc = arguments.callee.name;
	currentState.tabWindowFunc = thisWindowFunc;
	var txt = "";
	
	//Build the window header
	var title = "Interact";
	txt += "<div class='w3-row w3-card'>";
		txt += "<h3 class='w3-center'>" + title + "</h3>";
	txt += "</div>";
	
	
	//Build the containers
	txt += "<div class='w3-row'>"
		txt += "<div class='w3-row w3-container w3-card'>";
			txt += "<div class='w3-col m4'>";
				txt += buildInputDivHTML('userText', eleId, thisWindowFunc)
				txt += buildInputDivHTML('taxaText', eleId, thisWindowFunc)
				txt += "<br>";	
				txt += buildInputDivHTML('btnFetchAPIData', eleId, thisWindowFunc)
				txt += "<br>";
			txt += "</div>";
			txt += "<div class='w3-col m4'>";
				txt += buildInputDivHTML('dateStartText', eleId, thisWindowFunc)
				txt += buildInputDivHTML('dateEndText', eleId, thisWindowFunc)
				txt += buildInputDivHTML('locationText', eleId, thisWindowFunc)
				txt += "<br>";
				txt += "</div>";
			txt += "<div class='w3-col m4'>";
				txt += "<br>";	
				txt += buildInputDivHTML('btnDisplayObservationList', eleId, thisWindowFunc)
				txt += "<br>";
				txt += buildInputDivHTML('btnDisplayButterflyList', eleId, thisWindowFunc)
				txt += "<br>";
				txt += buildInputDivHTML('btnDisplayOFVSGeneraList', eleId, thisWindowFunc)
				txt += "<br>";
				txt += buildInputDivHTML('btnDisplayOFVSSpeciesList', eleId, thisWindowFunc)
				txt += "<br>";
			txt += "</div>";
		txt += "</div>";
		
		//Build the fetch summary output container
		txt += "<div class='w3-col m12 w3-container w3-card'>";
			txt += "<br><div id='fetchSummary'></div>";
		txt += "</div>";
		//Build the chart container
		txt += "<div class='w3-col m12 w3-container w3-card'>";
			txt += "<br><div id='chartContainer'></div>";
		txt += "</div>";

/*		
		//Build the Chart Containers
		var chartDivArr = [];
		var chartKey;
		txt += '<br>';			
		txt += "<div class='w3-row'>";	
			txt += "<div class='w3-col m12'>";
				chartKey = 'chartOFVSGenera';
				chartDivArr.push(chartKey);
				txt += buildChartDivHTML(chartKey);
			txt += "</div>";
			txt += "<div class='w3-col m12'>";
				chartKey = 'chartOFVSSpecies';
				chartDivArr.push(chartKey);
				txt += buildChartDivHTML(chartKey);
			txt += "</div>";
			txt += "<div class='w3-col m12'>";
				chartKey = 'chartButterfly';
				chartDivArr.push(chartKey);
				txt += buildChartDivHTML(chartKey);
			txt += "</div>";
			txt += "<div class='w3-col m12'>";
				chartKey = 'chartButterflyObsCount';
				chartDivArr.push(chartKey);
				txt += buildChartDivHTML(chartKey);
			txt += "</div>";
			txt += "<div class='w3-col m12'>";
				chartKey = 'chartButterflySpeciesCount';
				chartDivArr.push(chartKey);
				txt += buildChartDivHTML(chartKey);
			txt += "</div>";
		txt += "</div>";
*/
		
		//Build the Table output container
		txt += "<div class='w3-col m12 w3-container w3-card'>";
			txt += "<br><div id='tableContainer'></div>";
		txt += "</div>";
		

	txt += "</div>"
	document.getElementById(eleId).innerHTML = txt;
	
};


function selectFetchAPIDataBtn() {
	//document.getElementById('fetchSummary').innerHTML = "Got Here";
	//console.log("Arrived at button callback")
	//Clear the array of observation objects
	obsObjArr = [];
	
	//Fetch the base observation page for this user to determine how many total pages to fetch
	var urlAPI = 'https://api.inaturalist.org/v1/observations?d1=' + fetchDateStart + '&d2=' + fetchDateEnd + '&taxon_id=' + fetchTaxa + '&place_id=' + fetchLocation + '&user_id=' + fetchUser + '&order=desc&order_by=observed_on';
	//console.log(urlAPI)
	var numPages;
	currentState.apiDataLoaded = false;
	currentState.apiDataFirstPageLoaded = false;
	currentState.ofvsListBuilt = false;
	fetch(urlAPI).then(function (response) {
		response.text().then(function(text) {
			var resultsObj = JSON.parse(text);
  			var totalResults = resultsObj.total_results;
  			var pageNum = resultsObj.page;
  			var perPage = resultsObj.per_page;
			numPages = Math.ceil(totalResults / perPage);
			var numObs = Math.min(totalResults, pageNum * perPage)
			document.getElementById("fetchSummary").innerHTML = 'Observations Fetched: ' + numObs + ' of ' + totalResults;
			currentState.apiDataFirstPageLoaded = true;
		});
	});
	
	//Fetch the rest of the observation pages for this data query
	var stateTimer55 = setInterval(function() {
		if (currentState.apiDataFirstPageLoaded) {
			clearInterval(stateTimer55);
			var pageNum = 0;
			currentState.apiDataNextPagePending = false;
			var stateTimer56 = setInterval(function() {
				//console.log("pageNum: ", pageNum, " numPages: ", numPages)
				if (pageNum >= numPages && !currentState.apiDataNextPagePending) {
					clearInterval(stateTimer56);
					currentState.apiDataLoaded = true;
				} else if (!currentState.apiDataNextPagePending) {
					currentState.apiDataNextPagePending = true;
					pageNum += 1;
					fetchAPIDataObs(fetchUser, pageNum);
				};
			}, 1000);
		};
	}, 100);
	
	//Once API data fetching is complete, process the data into useful data structures
	var stateTimer66 = setInterval(function() {
		if (currentState.apiDataLoaded == true) {
			clearInterval(stateTimer66);
			//console.log(obsObjArr.slice(0,5))
			buildOFVSObj();
			buildButterflyObsObj();
			buildButterflyCountObj();
			currentState.ofvsListBuilt = true;	
			
			var txt = "";
			txt+= "<p>" + "Number of Observations = " + obsObjArr.length + "</p>";
			txt+= "<p>" + "Number of Butterfly Species = " + butterflyObsObjArr.length + "</p>";
			txt += "<p>" + "Number of Flower Species Visited = " + ofvsSpeciesObjArr.length + "</p>";
			txt+= "<p>" + "Number of Flower Genera Visited = " + ofvsGeneraObjArr.length + "</p>";
			document.getElementById("fetchSummary").innerHTML = txt;
			//console.log(obsObjArr.length, butterflyObsObjArr.length, ofvsSpeciesObjArr.length, ofvsGeneraObjArr.length);

		};
	}, 500);
};

 
//Fetch the API observation data, build an obsObj for each observation, 
//and then push each obsObj into obsObjArr.
//Called multiple times by selectFetchAPIDataBtn
function fetchAPIDataObs(userId,pageNum) {	
	var urlAPI = 'https://api.inaturalist.org/v1/observations?d1=' + fetchDateStart + '&d2=' + fetchDateEnd + '&taxon_id=' + fetchTaxa + '&place_id=' + fetchLocation + '&user_id=' + fetchUser + '&page=' + pageNum + ' &order=desc&order_by=observed_on';
	//console.log(urlAPI)
	//console.log("Preparing to fetch page: ", pageNum);
	fetch(urlAPI).then(function (response) {
		response.text().then(function(text) {
			var resultsObj = JSON.parse(text);
			var totalResults = resultsObj.total_results;
			var pageNum = resultsObj.page;
			var perPage = resultsObj.per_page;
			numPages = Math.ceil(totalResults / perPage);
			var numObs = Math.min(totalResults, pageNum * perPage)
			document.getElementById("fetchSummary").innerHTML = 'Observations Fetched: ' + numObs + ' of ' + totalResults;
			var resultsArr = resultsObj.results;
			//console.log("Number of observations: ", resultsArr.length)
			//Build the array of observation objects for the current user
			for (var i = 0; i < resultsArr.length; i++) {
				//console.log(i)
				obsObj = {};
				obsObj.id = null;
				if (resultsArr[i].hasOwnProperty("id")) {
					obsObj.id = resultsArr[i].id;
				};			
				obsObj.observed_on = null;
				obsObj.dateStrDay = null;
				obsObj.dateStrYear = null;
				if (resultsArr[i].observed_on) {
					obsObj.observed_on = resultsArr[i].observed_on; 
					obsObj.dateStrDay = obsObj.observed_on.substr(5,2) + obsObj.observed_on.substr(8,2);
					obsObj.dateStrYear = obsObj.observed_on.substr(0,4)
				};
				obsObj.photoURL = null;
				if (resultsArr[i].observation_photos && resultsArr[i].observation_photos[0].photo && resultsArr[i].observation_photos[0].photo.url) {
					obsObj.photoURL = resultsArr[i].observation_photos[0].photo.url;
				};				
				obsObj.species_guess = null;
				if (resultsArr[i].species_guess) {
					obsObj.species_guess = resultsArr[i].species_guess;
				};

				
				//Find my "current" ID for this observation and capture the taxon name and preferred common name from it
					//identifications[0].taxon.name = "Amblyscirtes hegon"
					//identifications[0].taxon.preferred_common_name = "Pepper and Salt Skipper"
					//identifications[0].user.login = "rossberryhill"
					//identifications[0].current = true
				obsObj.taxonName = null;
				obsObj.preferred_common_name = null;
				for (var j = 0; j < resultsArr[i].identifications.length; j++) {
					if (resultsArr[i].identifications[j].user.login == fetchUser  && resultsArr[i].identifications[j].current) {
						if (resultsArr[i].identifications[j].taxon.name) {
							obsObj.taxonName = resultsArr[i].identifications[j].taxon.name;
						};
						if (resultsArr[i].identifications[j].taxon. preferred_common_name) {
							obsObj.preferred_common_name = resultsArr[i].identifications[j].taxon. preferred_common_name;
						};
					};
				};	
				//console.log(obsObj.taxonName, obsObj.preferred_common_name)
				
				obsObj.description = null;
				if (resultsArr[i].description) {
					obsObj.description = resultsArr[i].description;
				};

				obsObj.ofvsTaxonName = null;
				obsObj.ofvsGenus = null;
				obsObj.ofvsSpecificEpithet = null;
				obsObj.ofvsPreferredCommonName = null;
				if (resultsArr[i].ofvs && resultsArr[i].ofvs.length >0) {
					var ofvsArr = resultsArr[i].ofvs.slice();
					for (var j = 0; j < ofvsArr.length; j++) {
						if (ofvsArr[j].field_id == '3126') {  //visited flower of
							obsObj.ofvsTaxonName = ofvsArr[j].taxon.name;
							obsObj.ofvsPreferredCommonName = ofvsArr[j].taxon.preferred_common_name;
							if (obsObj.ofvsTaxonName != null) {
								var ofvsTaxonNameArr = obsObj.ofvsTaxonName.split(" ");
								obsObj.ofvsGenus = ofvsTaxonNameArr[0];
								if (ofvsTaxonNameArr.length > 1) {
									obsObj.ofvsSpecificEpithet = ofvsTaxonNameArr[1];
								};
							};
						};
					};
				};
				obsObjArr.push(obsObj);
			};
			currentState.apiDataNextPagePending = false;
		});
	});
};

//Build a list of flower Genera visited
function buildOFVSObj() {
	
	//Sequence through the API observation data to look for any OFVS genera that are not already in OFVSGeneraObj, and add them to it
	for (var i = 0; i < obsObjArr.length; i++) {
		var ofvsGenus = obsObjArr[i].ofvsGenus;
		if (ofvsGenus != null && !ofvsGeneraObj.hasOwnProperty(ofvsGenus)) {
			ofvsGeneraObj[ofvsGenus] = {};
			ofvsGeneraObj[ofvsGenus].commonName = '';
			console.log("Genus not in ofvsGeneraObj: ", ofvsGenus)
		};
	};

	
	//Initialize the dynamic attributes in ofvsGeneraObj.  This is all attributes except the genus common name and plotColor, which are defined in Globals.
	for (genus in ofvsGeneraObj) {
		ofvsGeneraObj[genus].species = {};
		ofvsGeneraObj[genus].butterflySpeciesArr = [];
		ofvsGeneraObj[genus].numOFVSSpecies = 0;
		ofvsGeneraObj[genus].numButterflySpecies = 0;
		ofvsGeneraObj[genus].numObs = 0;
		ofvsGeneraObj[genus].obsTimeVector = Array(365).fill(null);
		ofvsGeneraObj[genus].obsDateArrMMDD = [];
		ofvsGeneraObj[genus].obsSecondDateIndex = null;
	};
	
	//Sequence through the API observation data to populate OFVSGeneraObj
	for (var i = 0; i < obsObjArr.length; i++) {
		//Extract the butterfly species preferred common name and the OFVS parameters from the observation
		var butterflyCommonName = obsObjArr[i].preferred_common_name;
		var ofvsTaxonName = obsObjArr[i].ofvsTaxonName;
		var ofvsGenus = obsObjArr[i].ofvsGenus;
		var ofvsSpecificEpithet = obsObjArr[i].ofvsSpecificEpithet;
		var ofvsSpeciesCommonName = obsObjArr[i].ofvsPreferredCommonName;
		
		if (ofvsGeneraObj.hasOwnProperty(ofvsGenus)) {
			//Add the butterfly species to the butterfly species array for thsi genus
			if (ofvsGeneraObj[ofvsGenus].butterflySpeciesArr.indexOf(butterflyCommonName) == -1) {
					ofvsGeneraObj[ofvsGenus].butterflySpeciesArr.push(butterflyCommonName);
					ofvsGeneraObj[ofvsGenus].numButterflySpecies += 1;	
			};
			ofvsGeneraObj[ofvsGenus].numObs += 1;
			//Add the observation to the observation time vector for this genus
			var dateStrDay = obsObjArr[i].dateStrDay;
			var index = dateArrMMDD.indexOf(dateStrDay);
			if (ofvsGeneraObj[ofvsGenus].obsTimeVector[index]==null) {
				ofvsGeneraObj[ofvsGenus].obsTimeVector[index] = 1;
			} else {
				ofvsGeneraObj[ofvsGenus].obsTimeVector[index] += 1;
			};
			ofvsGeneraObj[ofvsGenus].obsDateArrMMDD.push(dateStrDay);

			//Process the specific epithet if it isn't null
			if (ofvsSpecificEpithet != null) {
				//Add the specific epithet to the species object if it doesn't already exist
				if(!ofvsGeneraObj[ofvsGenus].species.hasOwnProperty(ofvsSpecificEpithet)) {
					ofvsGeneraObj[ofvsGenus].species[ofvsSpecificEpithet] = {
						taxon: ofvsTaxonName,
						genus: ofvsGenus,
						commonName: ofvsSpeciesCommonName,
						butterflySpeciesArr: [],
						numButterflySpecies: 0,
						numObs: 0,
						obsTimeVector:  Array(365).fill(null),
						obsDateArrMMDD: [],
						obsSecondDateIndex: null, };
					ofvsGeneraObj[ofvsGenus].numOFVSSpecies += 1;
				};
				//Add the butterfly species to the species-level butterfly array and increment the counts
				if (ofvsGeneraObj[ofvsGenus]. species[ofvsSpecificEpithet].butterflySpeciesArr.indexOf(butterflyCommonName) == -1) {
					ofvsGeneraObj[ofvsGenus].species[ofvsSpecificEpithet]. butterflySpeciesArr.push(butterflyCommonName);
					ofvsGeneraObj[ofvsGenus].species[ofvsSpecificEpithet]. numButterflySpecies += 1;
				};
				ofvsGeneraObj[ofvsGenus].species[ofvsSpecificEpithet].numObs += 1;
				//Add the observation to the observation time vector for this genus
				if (ofvsGeneraObj[ofvsGenus].species[ofvsSpecificEpithet]. obsTimeVector[index]==null) {
					ofvsGeneraObj[ofvsGenus].species[ofvsSpecificEpithet]. obsTimeVector[index] = 1;
				} else {
					ofvsGeneraObj[ofvsGenus].species[ofvsSpecificEpithet]. obsTimeVector[index] += 1;
				};
				ofvsGeneraObj[ofvsGenus].species[ofvsSpecificEpithet]. obsDateArrMMDD.push(dateStrDay);
			};
		} else {
			if (ofvsGenus != null) {
				console.log(ofvsGenus, " not found in ofvsGeneraObj")
			};
		};
	};
	
	//For any genus with zero species (e.g. Dandelions), set the species count to 1
	for (genus in ofvsGeneraObj) {
		if (ofvsGeneraObj[genus].numOFVSSpecies == 0) {
			ofvsGeneraObj[genus].numOFVSSpecies = 1;
		};
	};
	
		
	//Identify the date index of the second earliest observation for each genus
	for (genus in ofvsGeneraObj) {
		//Sort the dates from earliest to latest
		ofvsGeneraObj[genus].obsDateArrMMDD.sort();
		var MMDD = null;
		if (ofvsGeneraObj[genus].obsDateArrMMDD.length >= 2) {
			MMDD = ofvsGeneraObj[genus].obsDateArrMMDD[1];
		} else {
			MMDD = ofvsGeneraObj[genus].obsDateArrMMDD.at(-1);
		};
		var index = dateArrMMDD.indexOf(MMDD);
		ofvsGeneraObj[genus].obsSecondDateIndex = index;
	};

	//Identify the date index of the second earliest observation for each species
	for (genus in ofvsGeneraObj) {
		for (species in ofvsGeneraObj[genus].species) {
			//Sort the dates from earliest to latest
			ofvsGeneraObj[genus].species[species].obsDateArrMMDD.sort();
			var MMDD = null;
			if (ofvsGeneraObj[genus].species[species].obsDateArrMMDD.length >= 2) {
				MMDD = ofvsGeneraObj[genus].species[species].obsDateArrMMDD[1];
			} else {
				MMDD = ofvsGeneraObj[genus].species[species]. obsDateArrMMDD.at(-1);
			};
			var index = dateArrMMDD.indexOf(MMDD);
			ofvsGeneraObj[genus].species[species].obsSecondDateIndex = index;
		};
	};
	
	//Convert ofvsGeneraObj to an array of genera so that it can be sorted by attribute values.  Only include genera with numObs>0
	ofvsGeneraObjArr = [];
	for (genus in ofvsGeneraObj) {
		if (ofvsGeneraObj[genus].numObs> 0) {
			var genusObj = ofvsGeneraObj[genus];
			genusObj.genus = genus;	//Make the genus name an attribute in the object
			ofvsGeneraObjArr.push(genusObj);
		};
	};
	//Sort the OFVS genera object array by number of butterfly species, most to least
	ofvsGeneraObjArr.sort((a,b) => (a.numButterflySpecies < b.numButterflySpecies) ? 1 : -1);
	//console.log(ofvsGeneraObjArr[0])
	
	//Convert ofvsGeneraObj to an array of species so it can be sorted by attribute values
	ofvsSpeciesObjArr = [];
	for (genus in ofvsGeneraObj) {
		//If there are no observations for this genus, then leave it out.
		//If no ofvs species are listed in this genus, then add the genus as a species.  Otherwise, add each individual species
		if (ofvsGeneraObj[genus].numObs > 0) {
			if (Object.keys(ofvsGeneraObj[genus].species).length == 0) {
				var speciesObj = {
					taxon: genus,
					genus: genus,
					commonName: ofvsGeneraObj[genus].commonName,
					butterflySpeciesArr: ofvsGeneraObj[genus].butterflySpeciesArr,
					numOFVSSpecies: 1,
					numButterflySpecies: ofvsGeneraObj[genus].numButterflySpecies,
					numObs: ofvsGeneraObj[genus].numObs,
					obsTimeVector:  ofvsGeneraObj[genus].obsTimeVector,
					obsDateArrMMDD: ofvsGeneraObj[genus].obsDateArrMMDD,
					obsSecondDateIndex: ofvsGeneraObj[genus].obsSecondDateIndex,
				};
				ofvsSpeciesObjArr.push(speciesObj);
			} else {
				for (specificEpithet in ofvsGeneraObj[genus].species) {
					var speciesObj = ofvsGeneraObj[genus].species[specificEpithet];
					ofvsSpeciesObjArr.push(speciesObj);
				};
			};
		};
	};
	//Sort the OFVS species object array by number of species, most to least
	ofvsSpeciesObjArr.sort((a,b) => (a.numButterflySpecies < b.numButterflySpecies) ? 1 : -1);
	//console.log(ofvsSpeciesObjArr.slice(0, 5))
	
	//Build an array of OFVS species names and output it to the console so it can be copied and pasted
	var ofvsSpeciesArr = [];
	for (var i = 0; i < ofvsSpeciesObjArr.length; i++) {
		ofvsSpeciesArr.push(ofvsSpeciesObjArr[i].commonName)
	};
	//console.log(ofvsSpeciesArr);

};

//Build Butterfly observation object and array
function buildButterflyObsObj() {
	//Sequence through the API observation data to populate the Butterfly Observation Object
	butterflyObsObj = {};
	//console.log(obsObjArr.length)
	for (var i = 0; i < obsObjArr.length; i++) {
		//Get the butterfly species common and taxon names
		var butterflyCommonName = obsObjArr[i].preferred_common_name;
		var butterflyTaxonName = obsObjArr[i].taxonName;
		//Extract the ofvs parameters from the observation
		var ofvsTaxonName = obsObjArr[i].ofvsTaxonName;
		var ofvsGenus = obsObjArr[i].ofvsGenus;
		
		//Add the butterfly species name to the butterfly species object if it doesn't already exist.  Otherwise, increment numObs.
		//console.log(butterflyCommonName, butterflyTaxonName)
		var taxonNameArr = butterflyTaxonName.split(" ");
		if (taxonNameArr.length > 1) { 
			var taxonName = taxonNameArr[0] + " " + taxonNameArr[1];
			if (!butterflyObsObj.hasOwnProperty(taxonName)) {
				butterflyObsObj[taxonName] = {}
				butterflyObsObj[taxonName].commonName = butterflyCommonName;
				butterflyObsObj[taxonName].numObs = 1;
				butterflyObsObj[taxonName].ofvsGeneraArr = [];
				butterflyObsObj[taxonName].obsTimeVector = Array(365).fill(null);
				butterflyObsObj[taxonName].obsDateArrMMDD = [];
				butterflyObsObj[taxonName].obsFirstDateIndex = null;
		
			} else {
				butterflyObsObj[taxonName].numObs += 1;
			};
			//Add the ofvs genus to the ofvs genera array
			if (ofvsGenus != null) {
				if (butterflyObsObj[taxonName].ofvsGeneraArr.indexOf(ofvsGenus) == -1) {
					butterflyObsObj[taxonName].ofvsGeneraArr.push(ofvsGenus);
				};				
			};
			
			//Add the observation to the observation time vector for this butterfly species
			var dateStrDay = obsObjArr[i].dateStrDay;
			var index = dateArrMMDD.indexOf(dateStrDay);
			if (butterflyObsObj[taxonName].obsTimeVector[index]==null) {
				butterflyObsObj[taxonName].obsTimeVector[index] = 1;
			} else {
				butterflyObsObj[taxonName].obsTimeVector[index] += 1;
			};
			butterflyObsObj[taxonName].obsDateArrMMDD.push(dateStrDay);
		};
	};
	
	//Calculate the number of ofvs genera for each butterfly species
	for (key in butterflyObsObj) {
		butterflyObsObj[key].numOFVSGenera = butterflyObsObj[key].ofvsGeneraArr.length;
	};
	
	//Identify the date index of the earliest observation
	for (key in butterflyObsObj) {
		var index = null;
		for (var i = butterflyObsObj[key].obsTimeVector.length-1; i >= 0 ; i--) {
			if (butterflyObsObj[key].obsTimeVector[i] != null) {
				index = i;
			};
		};
		butterflyObsObj[key].obsFirstDateIndex = index;
	};
	//console.log(butterflyObsObj)

	//Convert the OFVS Butterfly object to an array so it can be sorted by attribute values
	butterflyObsObjArr = [];
	for (key in butterflyObsObj) {
		var taxonObj = butterflyObsObj[key];
		taxonObj.taxonName = key;	//Make the taxon name an attribute in the object
		butterflyObsObjArr.push(taxonObj)
	};
	
	//Sort the OFVS object array by number of observations, least to most
	butterflyObsObjArr.sort((a,b) => (a.numObs > b.numObs) ? 1 : -1);
	//Sort the OFVS object array by number of ofvs genera, most to least
	butterflyObsObjArr.sort((a,b) => (a.numOFVSGenera < b.numOFVSGenera) ? 1 : -1);	
};

function buildButterflyCountObj() {
	
	//Initialize butterflyCountObj
	var yearArr = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];
	butterflyCountObj = {};
	for (var i = 0; i < yearArr.length; i++) {
		var year = yearArr[i];
		butterflyCountObj[year]={};
		butterflyCountObj[year].obsCountVector = Array(365).fill(0);
		butterflyCountObj[year].obsSumVector = Array(365).fill(0);
		butterflyCountObj[year].taxonArr = [];
		butterflyCountObj[year].speciesCountVector = Array(365).fill(0);
		butterflyCountObj[year].speciesSumVector = Array(365).fill(0);
	};
	
	//Sequence through the observations in obsObjArr and increment observation count in the time vector.  Then determine if this is a new species for the year, and if so add it to the taxon array and increment the species count vector for this day
	for (var i = obsObjArr.length-1; i>=0; i--) {
		//Update Observation Count Vector
		var dateStrYear = obsObjArr[i].dateStrYear;
		var dateStrDay = obsObjArr[i].dateStrDay;
		var index = dateArrMMDD.indexOf(dateStrDay);
		butterflyCountObj[dateStrYear].obsCountVector[index] += 1;
		//Update Species Array and Count Vector
		var butterflyTaxonName = obsObjArr[i].taxonName;
		var taxonNameArr = butterflyTaxonName.split(" ");
		if (taxonNameArr.length > 1) { 
			var taxonName = taxonNameArr[0] + " " + taxonNameArr[1];
			if (butterflyCountObj[dateStrYear].taxonArr.indexOf(taxonName) == -1) {
				butterflyCountObj[dateStrYear].taxonArr.push(taxonName);	
				butterflyCountObj[dateStrYear].speciesCountVector[index] += 1;
			};
		};
	};
	//console.log(butterflyCountObj['2024'].speciesCountVector);
	

	//Build the cumulative count vectors
	for (var i = 0; i < yearArr.length; i++) {
		var year = yearArr[i];
		butterflyCountObj[year].obsSumVector[0] = butterflyCountObj[year].obsCountVector[0];
		for (var j = 1; j < butterflyCountObj[year].obsCountVector.length; j++) {
			butterflyCountObj[year].obsSumVector[j] = butterflyCountObj[year].obsSumVector[j-1] + butterflyCountObj[year].obsCountVector[j];
		};
		butterflyCountObj[year].speciesSumVector[0] = butterflyCountObj[year].speciesCountVector[0];
		for (var j = 1; j < butterflyCountObj[year].speciesCountVector.length; j++) {
			butterflyCountObj[year].speciesSumVector[j] = butterflyCountObj[year].speciesSumVector[j-1] + butterflyCountObj[year].speciesCountVector[j];
		};
	};
	//console.log(butterflyCountObj['2024'].speciesSumVector[180]);
	//console.log(butterflyCountObj['2026'].speciesSumVector[180]);
	
	//Delete any years that don't have any observations
	for (year in butterflyCountObj) {
		if (butterflyCountObj[year].obsSumVector[364] == 0) {
			delete butterflyCountObj[year];
		};
	};
	//Null out the end of each year sum vector after no more observations are made
	for (year in butterflyCountObj) {
		var done = false;
		var index = 364;
		while (!done && index>0){
			if (butterflyCountObj[year].obsSumVector[index] == butterflyCountObj[year].obsSumVector[index-1]) {
				butterflyCountObj[year].obsSumVector[index] = null;
				butterflyCountObj[year].speciesSumVector[index] = null;
			} else {
				done = true;
			};
			index -= 1;
		};
	};
	
};


function selectDisplayObservationListBtn() {

	var stateTimer45 = setInterval(function() {
		if (currentState.ofvsListBuilt) {
			clearInterval(stateTimer45);
			
			//Clear the chart container
			document.getElementById("chartContainer").innerHTML = "";				

			//Build the table container
			var txt = "";		
			//Build table header
			txt += "<table class='w3-border'>";		
			txt += "<tr>"
				txt+= "<th style='width:180px;text-align:left' class='w3-border'>" + "Date" + "</th>";
				txt+= "<th style='width:150px;text-align:left' class='w3-border'>" + "ID" + "</th>";
				txt+= "<th style='width:300px;text-align:left' class='w3-border'>" + "Common Name" + "</th>";
				txt+= "<th style='width:200px;text-align:left' class='w3-border'>" + "Description" + "</th>";
				txt+= "<th style='width:200px;text-align:left' class='w3-border'>" + "Flower Visited" + "</th>";
			txt += "</tr>";
			//Populate table with observations
			for (var k = 0; k < obsObjArr.length; k++) {
				txt += "<tr>"
					txt += "<td>" + obsObjArr[k]['observed_on'] + "</td>";
					txt += "<td>" + obsObjArr[k]['id'] + "</td>";
					txt += "<td>" + obsObjArr[k]['preferred_common_name'] + "</td>";
					var description = obsObjArr[k]['description'];
					if (description == null) {
						description = "";
					};
					txt += "<td style='word-wrap: break-word'>" + description + "</td>";
					var ofvsTaxonName = obsObjArr[k]['ofvsTaxonName'];
					if (ofvsTaxonName == null) {
						ofvsTaxonName = "";
					};
					txt += "<td>" + ofvsTaxonName + "</td>";
				txt += "</tr>";
			};	
			txt += "</table>";
			document.getElementById("tableContainer").innerHTML = txt;

		};
	}, 100);
	
};	

function selectDisplayOFVSSpeciesListBtn() {
	var stateTimer88 = setInterval(function() {
		if (currentState.ofvsListBuilt) {
			clearInterval(stateTimer88);
			
			//Build the chart container
			var chartDivArr = [];
			var chartKey;
			var txt = "";
			txt += '<br>';			
			txt += "<div class='w3-row'>";	
				txt += "<div class='w3-col m12'>";
					chartKey = 'chartOFVSSpecies';
					chartDivArr.push(chartKey);
					txt += buildChartDivHTML(chartKey);
				txt += "</div>";
			txt += "</div>";
			document.getElementById("chartContainer").innerHTML = txt;				

			//Generate the charts
			for (var i = 0; i < chartDivArr.length; i++) {
				chartKey = chartDivArr[i];
				generateChart(chartKey);
			};

			//Build the table container
			var txt = "";	
			//Build table header
			txt += "<table class='w3-border'>";			
			txt += "<tr>";
				txt+= "<th colspan=3 style='background-color:lightgray' class='w3-border'>Flower Species Visited</th>";
				txt+= "<th colspan=2 style='background-color:lightgray' class='w3-border'>Butterflies Visiting</th>";
			txt += "</tr>";
			txt += "<tr>"
				txt+= "<th style='width:70px;text-align:left;background-color:lightgray' class='w3-border'>" + "Rank" + "</th>";
				txt+= "<th style='width:350px;text-align:left;background-color:lightgray' class='w3-border'>" + "Species" + "</th>";
				txt+= "<th style='width:300px;text-align:left;background-color:lightgray' class='w3-border'>" + "Common Name" + "</th>";
				txt+= "<th style='width:75px;text-align:center;background-color:lightgray' class='w3-border'>" + "Observations" + "</th>";
				txt+= "<th style='width:75px;text-align:center;background-color:lightgray' class='w3-border'>" + "Species" + "</th>";	
			txt += "</tr>";
			
			//Populate table with observations
			for (var k = 0; k < ofvsSpeciesObjArr.length; k++) {
				var rank = k+1;
				txt += "<tr>"
					txt += "<td>" + rank + "</td>";
					txt += "<td>" + ofvsSpeciesObjArr[k]['taxon'] + "</td>";
					txt += "<td>" + ofvsSpeciesObjArr[k]['commonName'] + "</td>";
					txt += "<td style='text-align:center'>" + ofvsSpeciesObjArr[k]['numObs'] + "</td>";
					txt += "<td style='text-align:center'>" + ofvsSpeciesObjArr[k]['numButterflySpecies'] + "</td>";
				txt += "</tr>";
			};	
			txt += "</table>";
			document.getElementById("tableContainer").innerHTML = txt;
				
		};
	}, 100);

};	

function selectDisplayOFVSGeneraListBtn() {
	var stateTimer88 = setInterval(function() {
		if (currentState.ofvsListBuilt) {
			clearInterval(stateTimer88);
			
			//Build the chart container
			var chartDivArr = [];
			var chartKey;
			var txt = "";
			txt += '<br>';			
			txt += "<div class='w3-row'>";	
				txt += "<div class='w3-col m12'>";
					chartKey = 'chartOFVSGenera';
					chartDivArr.push(chartKey);
					txt += buildChartDivHTML(chartKey);
				txt += "</div>";
			txt += "</div>";
			document.getElementById("chartContainer").innerHTML = txt;				

			//Generate the charts
			for (var i = 0; i < chartDivArr.length; i++) {
				chartKey = chartDivArr[i];
				generateChart(chartKey);
			};

			//Build the table container
			var txt = "";
			//Build table header
			txt += "<table class='w3-border'>";			
			txt += "<tr>";
				txt+= "<th colspan=4 style='background-color:lightgray' class='w3-border'>Flower Genera Visited</th>";
				txt+= "<th colspan=2 style='background-color:lightgray'class='w3-border'>Butterflies Visiting</th>";
			txt += "</tr>";
			txt += "<tr>"
				txt+= "<th style='width:70px;text-align:left;background-color:lightgray' class='w3-border'>" + "Rank" + "</th>";
				txt+= "<th style='width:300px;text-align:left;background-color:lightgray' class='w3-border'>" + "Genus" + "</th>";
				txt+= "<th style='width:300px;text-align:left;background-color:lightgray' class='w3-border'>" + "Common Name" + "</th>";
				txt+= "<th style='width:75px;text-align:center;background-color:lightgray' class='w3-border'>" + "Species" + "</th>";
				txt+= "<th style='width:75px;text-align:center;background-color:lightgray' class='w3-border'>" + "Observations" + "</th>";	
				txt+= "<th style='width:75px;text-align:center;background-color:lightgray' class='w3-border'>" + "Species" + "</th>";	
			txt += "</tr>";

			//Populate table with observations
			for (var k = 0; k < ofvsGeneraObjArr.length; k++) {
				var rank = k+1;
				txt += "<tr>"
					txt += "<td>" + rank + "</td>";
					txt += "<td>" + ofvsGeneraObjArr[k]['genus'] + "</td>";
					txt += "<td>" + ofvsGeneraObjArr[k]['commonName'] + "</td>";
					txt += "<td style='text-align:center'>" + ofvsGeneraObjArr[k]['numOFVSSpecies'] + "</td>";
					txt += "<td style='text-align:center'>" + ofvsGeneraObjArr[k]['numObs'] + "</td>";
					txt += "<td style='text-align:center'>" + ofvsGeneraObjArr[k]['numButterflySpecies'] + "</td>";
				txt += "</tr>";
			};	
			txt += "</table>";

			document.getElementById("tableContainer").innerHTML = txt;				
		};
	}, 100);

};	

function selectDisplayButterflyListBtn() {
	var stateTimer88 = setInterval(function() {
		if (currentState.ofvsListBuilt) {
			clearInterval(stateTimer88);
			
			//Build the chart container
			var chartDivArr = [];
			var chartKey;
			var txt = "";
			txt += '<br>';			
			txt += "<div class='w3-row'>";	
				txt += "<div class='w3-col m12'>";
					chartKey = 'chartButterfly';
					chartDivArr.push(chartKey);
					txt += buildChartDivHTML(chartKey);
				txt += "</div>";
				txt += "<div class='w3-col m12'>";
					chartKey = 'chartButterflyObsCount';
					chartDivArr.push(chartKey);
					txt += buildChartDivHTML(chartKey);
				txt += "</div>";
				txt += "<div class='w3-col m12'>";
					chartKey = 'chartButterflySpeciesCount';
					chartDivArr.push(chartKey);
					txt += buildChartDivHTML(chartKey);
				txt += "</div>";
			txt += "</div>";
			document.getElementById("chartContainer").innerHTML = txt;				

			//Generate the charts
			for (var i = 0; i < chartDivArr.length; i++) {
				chartKey = chartDivArr[i];
				generateChart(chartKey);
			};
			

			//Build the table container
			var txt = "";
			//Build table header
			txt += "<table class='w3-border'>";
			txt += "<tr>";
				txt+= "<th colspan=5 style='background-color:lightgray' class='w3-border'>Butterfly Species or Subspecies</th>";
				txt += "</tr>";
			txt += "<tr>"
				txt+= "<th style='width:70px;text-align:left;background-color:lightgray' class='w3-border'>" + "Rank" + "</th>";
				txt+= "<th style='width:350px;text-align:left;background-color:lightgray' class='w3-border'>" + "Taxon" + "</th>";
				txt+= "<th style='width:300px;text-align:left;background-color:lightgray' class='w3-border'>" + "Common Name" + "</th>";
				txt+= "<th style='width:100px;text-align:center;background-color:lightgray' class='w3-border'>" + "Observations" + "</th>";
				txt+= "<th style='width:200px;text-align:center;background-color:lightgray' class='w3-border'>" + "Flower Genera Visited" + "</th>";	
			txt += "</tr>";
	
			//Populate table with observations
			for (var k = 0; k < butterflyObsObjArr.length; k++) {
				var rank = k+1;
				txt += "<tr>"
					txt += "<td>" + rank + "</td>";
					txt += "<td>" + butterflyObsObjArr[k]['taxonName'] + "</td>";
					txt += "<td>" + butterflyObsObjArr[k]['commonName'] + "</td>";
					txt += "<td style='text-align:center'>" + butterflyObsObjArr[k]['numObs'] + "</td>";
					txt += "<td style='text-align:center'>" + butterflyObsObjArr[k]['numOFVSGenera'] + "</td>";
				txt += "</tr>";
			};	
			txt += "</table>";
			document.getElementById("tableContainer").innerHTML = txt;
		};
	}, 100);

};	



	
	
	

	
	
