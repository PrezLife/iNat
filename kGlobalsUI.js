//Define the tab Bar
var tabBar2 = {
	tB209: {title: "Interact", function: "selectTabBarItem(\"tabBar2\", \"tB209\", \"main2\", \"dispInteract\")"},
	
};

//Define the window structure
var uiWindowObj2 = {
	header1: {title: "iNaturalist Data Exploration",  class: "w3-teal"},
	main1: {
		tabBar2: tabBar2,
		//tabBar3: tabBar3,
		main2: {},
	},
	footer1: {title: "This is the Footer",},
};

//Define the charting object
var chartObj = {
	chartOFVSGenera: {
		title: "Flower Genera Visit Observations",
		func: "ofvsGeneraChart",
		inputArr: "",
		display: 'block',
	},
	chartOFVSSpecies: {
		title: "Flower Species Visit Observations",
		func: "ofvsSpeciesChart",
		inputArr: "",
		display: 'block',
	},
	chartButterfly: {
		title: "Butterfly Observations",
		func: "butterflyChart",
		inputArr: "",
		display: 'block',
	},
	chartButterflyObsCount: {
		title: "Butterfly Observation Count",
		func: "butterflyObsCountChart",
		inputArr: "",
		display: 'block',
	},
	chartButterflySpeciesCount: {
		title: "Butterfly Species Count",
		func: "butterflySpeciesCountChart",
		inputArr: "",
		display: 'block',
	},
};
	

//Define the menu, input, and button objects
//==================================

var fetchTaxa = '47224';	//Taxa Number - Butterflies
//var fetchUser = '1855094';  //User Number
var fetchUser = 'rossberryhill';
var fetchDateStart = '2026-01-01';
var fetchDateEnd = '2026-12-31';
var fetchLocation = '20';

var inputObj = {
	taxaText: {
		title:  'Select Taxa',
		buildFunc: 'buildInputHTML',
		selectFunc: 'selectInput',
		menuList: '',
		selectedParam: 'fetchTaxa',
		style: "width:200px;margin:auto",  //Add 'margin:auto' to center
		display: '',
	},
	userText: {
		title:  'Select User',
		buildFunc: 'buildInputHTML',
		selectFunc: 'selectInput',
		menuList: '',
		selectedParam: 'fetchUser',
		style: "width:200px;margin:auto",  //Add 'margin:auto' to center
		display: '',
	},
	dateStartText: {
		title:  'Select Start Date',
		buildFunc: 'buildInputHTML',
		selectFunc: 'selectInput',
		menuList: '',
		selectedParam: 'fetchDateStart',
		style: "width:200px;margin:auto",  //Add 'margin:auto' to center
		display: '',
	},
	dateEndText: {
		title:  'Select End Date',
		buildFunc: 'buildInputHTML',
		selectFunc: 'selectInput',
		menuList: '',
		selectedParam: 'fetchDateEnd',
		style: "width:200px;margin:auto",  //Add 'margin:auto' to center
		display: '',
	},
	locationText: {
		title:  'Select Location',
		buildFunc: 'buildInputHTML',
		selectFunc: 'selectInput',
		menuList: '',
		selectedParam: 'fetchLocation',
		style: "width:200px;margin:auto",  //Add 'margin:auto' to center
		display: '',
	},

	btnFetchAPIData: {
		title: "Fetch API Data",
		buildFunc: 'buildBtnHTML',
		selectFunc: 'selectFetchAPIDataBtn',
		menuList: '',
		selectedParam: '',
		style: 'text-align:center',
		display: '',
	},
	btnDisplayObservationList: {
		title: "Display Observation List",
		buildFunc: 'buildBtnHTML',
		selectFunc: 'selectDisplayObservationListBtn',
		menuList: '',
		selectedParam: '',
		style: 'text-align:center',
		display: '',
	},
	btnDisplayOFVSSpeciesList: {
		title: "Display Flower Species Visited",
		buildFunc: 'buildBtnHTML',
		selectFunc: 'selectDisplayOFVSSpeciesListBtn',
		menuList: '',
		selectedParam: '',
		style: 'text-align:center',
		display: '',
	},
	btnDisplayOFVSGeneraList: {
		title: "Display Flower Genera Visited",
		buildFunc: 'buildBtnHTML',
		selectFunc: 'selectDisplayOFVSGeneraListBtn',
		menuList: '',
		selectedParam: '',
		style: 'text-align:center',
		display: '',
	},
	btnDisplayButterflyList: {
		title: "Display Butterflies",
		buildFunc: 'buildBtnHTML',
		selectFunc: 'selectDisplayButterflyListBtn',
		menuList: '',
		selectedParam: '',
		style: 'text-align:center',
		display: '',
	},
	
	
};

