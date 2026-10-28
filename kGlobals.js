//Declare the state machine status object
var currentState = {
	tabWindow: "",
	apiDataLoaded:  false,		//All data for this API query loaded
	apiDataFirstPageLoaded:  false, 	//API query first data page loaded
	apiDataNextPagePending:  false,	//API query next data page pending
	ofvsListBuilt:			false,	//
};


//Build the standard date arrays
var dateArr = [];
var dateStrArr = [];	//yyyymmdd
var dateStrDayArr = []; //mmdd
var newDate = new Date('1/1/2020');	//A leap year
for (var i = 0; i < 366; i++) {
	dateArr.push(new Date(newDate));
	var dateStr = translateDateToStr(newDate);
	var dateStrDay = dateStr.substr(4,4);
	dateStrArr.push(dateStr);
	dateStrDayArr.push(dateStrDay);
	newDate.setDate(newDate.getDate() + 1); 
};

//Build the month object
var monthObj = {
	0: {name: "Jan", monthStart: new Date(0,0,0), monthEnd: new Date(0,1,0)},
	1: {name: "Feb", monthStart: new Date(0,1,0), monthEnd: new Date(0,2,0)},
	2: {name: "Mar", monthStart: new Date(0,2,0), monthEnd: new Date(0,3,0)},
	3: {name: "Apr", monthStart: new Date(0,3,0), monthEnd: new Date(0,4,0)},
	4: {name: "May", monthStart: new Date(0,4,0), monthEnd: new Date(0,5,0)},
	5: {name: "Jun", monthStart: new Date(0,5,0), monthEnd: new Date(0,6,0)},
	6: {name: "Jul", monthStart: new Date(0,6,0), monthEnd: new Date(0,7,0)},
	7: {name: "Aug", monthStart: new Date(0,7,0), monthEnd: new Date(0,8,0)},
	8: {name: "Sep", monthStart: new Date(0,8,0), monthEnd: new Date(0,9,0)},
	9: {name: "Oct", monthStart: new Date(0,9,0), monthEnd: new Date(0,10,0)},
	10: {name: "Nov", monthStart: new Date(0,10,0), monthEnd: new Date(0,11,0)},
	11: {name: "Dec", monthStart: new Date(0,11,0), monthEnd: new Date(1,0,0)},
};



//Array of simplified observation objects (obsObj)
//Built in selectFetchAPIDataBtn and fetchAPIDataObs
var obsObjArr = [
	{
	    dateStrDay: '0730',
	    dateStrYear: '2025',
	    description: 'Visiting Cup Plant flowers',
	    id: '302397969',
	    observed_on: '2025-07-30',
	    ofvsPreferredCommonName: 'cup plant',
	    ofvsTaxonName: 'Silphium perfoliatum',
		ofvsGenus: 'Silphium',
		ofvsSpecificEpithet: 'perfoliatum',
	    photoURL: 'https://inaturalist-open-data.s3.amazonaws.com/photos/544982167/square.jpg',
	    preferred_common_name: 'Eastern Tiger Swallowtail',
	    species_guess: 'Eastern Tiger Swallowtail', //What does this mean?
	    taxonName: 'Papilio glaucus',
	},
];


//Butterfly Observation object.  Built in buildButterflyObsObj
var butterflyObsObj = {
	"Danaus plexippus": {
		commonName: "Monarch" ,
		numObs: 1,
		ofvsGeneraArr: ['Symphyotrichum'],
		numOFVSGenera: 1,
		obsTimeVector: [0,364],
		obsDateArrMMDD: ["0101"],
		obsFirstDateIndex: 15,
	},
};
//Array of butterfly observation objects
var ButterflyObsObjArr = [];

//Butterfly Observation and Species Count Object.  Built in buildButterflyCountObj
var butterflyCountObj = {
	'2023': {
		obsCountVector: [0,364],
		obsSumVector: [0,364],
		taxonArr: ['Danaus plexippus', 'Amblyscirtes hegon'],
		speciesCountVector: [0,364],
		speciesSumVector: [0,364],
	},
	'2024': {},
	'2025': {},
	'2026': {},	
};

//Build an object with the charting attributes for each butterfly
//The keys are common names

var butterflyColorObj = {
	'Amblyscirtes hegon':	{plotColor: 'RosyBrown'}, //Pepper and Salt Skipper
	'Amblyscirtes vialis':	{plotColor: 'RosyBrown'}, //Common Roadside-Skipper
	'Anatrytone logan':		{plotColor: 'DarkOrange'}, //Delaware Skipper
	'Ancyloxypha numitor':	{plotColor: 'DarkOrange'}, //Least Skipper
	'Anthocharis midea':	{plotColor: 'white'}, //Falcate Orangetip
	'Argynnis cybele':		{plotColor: 'DarkOrange'}, //Great Spangled Fritillary
	'Argynnis idalia':		{plotColor: 'DarkOrange'}, //Regal Fritillary
	'Asterocampa celtis':	{plotColor: 'SaddleBrown'}, //Hackberry Emperor
	'Asterocampa clyton':	{plotColor: 'DarkOrange'}, //Tawny Emperor
	'Atalopedes huron':		{plotColor: 'SaddleBrown'}, //Huron Skipper
	'Battus philenor':		{plotColor: 'Navy'}, //Pipevine Swallowtail
	'Boloria bellona':		{plotColor: 'DarkOrange'}, //Meadow Fritillary
	'Burnsius communis':	{plotColor: 'white'}, //Common Checkered-Skipper
	'Callophrys gryneus':	{plotColor: 'green'}, //Juniper Hairstreak
	'Callophrys henrici':	{plotColor: 'SaddleBrown'}, //Henry's Elfin
	'Callophrys niphon':	{plotColor: 'SaddleBrown'}, //Eastern Pine Elfin
	'Calycopis cecrops':	{plotColor: 'gray'}, //Red-banded Hairstreak
	'Cecropterus lyciades':	{plotColor: 'SaddleBrown'}, //Hoary Edge
	'Cecropterus pylades':	{plotColor: 'SaddleBrown'}, //Northern Cloudywing
	'Celastrina ladon':		{plotColor: 'Lavender'}, //Spring Azure
	'Celastrina neglecta':	{plotColor: 'Lavender'}, //Summer Azure
	'Cercyonis pegala':		{plotColor: 'SaddleBrown'}, //Common Wood-Nymph
	'Chlosyne nycteis':		{plotColor: 'DarkOrange'}, //Silvery Checkerspot
	'Colias eurytheme':		{plotColor: 'Gold'}, //Orange Sulphur
	'Colias philodice':		{plotColor: 'yellow'}, //Clouded Sulphur
	'Cyllopsis gemma':		{plotColor: 'RosyBrown'}, //Eastern Gemmed-Satyr
	'Danaus plexippus':		{plotColor: 'DarkOrange'}, //Monarch
	'Epargyreus clarus':	{plotColor: 'SaddleBrown'}, //Silver-spotted Skipper
	'Erynnis baptisiae':	{plotColor: 'SaddleBrown'}, //Wild Indigo Duskywing
	'Erynnis brizo':		{plotColor: 'SaddleBrown'}, //Sleepy Duskywing
	'Erynnis horatius':		{plotColor: 'SaddleBrown'}, //Horace's Duskywing
	'Erynnis icelus':		{plotColor: 'SaddleBrown'}, //Dreamy Duskywing
	'Erynnis juvenalis':	{plotColor: 'SaddleBrown'}, //Juvenal's Duskywing
	'Euchloe olympia':		{plotColor: 'white'}, //Olympia Marble
	'Euphydryas phaeton':	{plotColor: 'black'}, //Baltimore Checkerspot
	'Euphyes dion':			{plotColor: 'DarkOrange'}, //Dion Skipper
	'Euphyes vestris':		{plotColor: 'SaddleBrown'}, //Dun Skipper
	'Euptoieta claudia':	{plotColor: 'DarkOrange'}, //Variegated Fritillary
	'Eurema lisa':			{plotColor: 'yellow'}, //Little Yellow
	'Eurema nicippe':		{plotColor: 'yellow'}, //Sleepy Orange
	'Eurytides marcellus':	{plotColor: 'black'}, //Zebra Swallowtail
	'Everes comyntas':		{plotColor: 'Lavender'}, //Eastern Tailed-Blue
	'Feniseca tarquinius':	{plotColor: 'DarkOrange'}, //Harevester
	'Heraclides cresphontes':	{plotColor: 'black'}, //Eastern Giant Swallowtail
	'Hylephila phyleus':	{plotColor: 'DarkOrange'}, //Fiery Skipper
	'Junonia coenia':		{plotColor: 'SaddleBrown'}, //Common Buckeye
	'Lethe anthedon':		{plotColor: 'SaddleBrown'}, //Northern Pearly-Eye
	'Lethe appalachia':		{plotColor: 'SaddleBrown'}, //Appalachian Brown
	'Limenitis archippus':	{plotColor: 'orange'}, //Viceroy
	'Limenitis arthemis':	{plotColor: 'Navy'}, //Red-spotted Admiral
	'Limenitis arthemis astyanax': {plotColor: 'Navy'}, //Red-spotted Purple
	'Limochores origenes':	{plotColor: 'DarkOrange'}, //Crossline Skipper
	'Lon hobomok':			{plotColor: 'DarkOrange'}, //Hobomok Skipper
	'Lon zabulon':			{plotColor: 'DarkOrange'}, //Zabulon Skipper
	'Libytheana carinenta':	{plotColor: 'DarkOrange'}, //American Snout
	'Lycaena hypophlaeas':	{plotColor: 'DarkOrange'}, //American Copper
	'Megisto cymela':		{plotColor: 'SaddleBrown'}, //Little Wood Satyr
	'Nathalis iole':		{plotColor: 'yellow'}, //Dainty Sulphur
	'Nymphalis antiopa':	{plotColor: 'brown'}, //Mourning Cloak
	'Panoquina ocola':		{plotColor: 'SaddleBrown'}, //Ocola Skipper
	'Papilio glaucus':		{plotColor: 'LemonChiffon'}, //Eastern Tiger Swallowtail
	'Papilio polyxenes':	{plotColor: 'black'}, //Black Swallowtail
	'Papilio troilus':		{plotColor: 'Navy'}, //Spicebush Swallowtail
	'Parrhasius m-album':	{plotColor: 'gray'}, //White M Hairstreak
	'Phoebis sennae':		{plotColor: 'yellow'}, //Cloudless Sulphur
	'Pholisora catullus':	{plotColor: 'SaddleBrown'}, //Common Sootywing
	'Phyciodes cocyta':		{plotColor: 'DarkOrange'}, //Northern Crescent 
	'Phyciodes tharos':		{plotColor: 'DarkOrange'}, //Pearl Crescent
	'Pieris rapae':			{plotColor: 'white'}, //Small White
	'Pieris virginiensis':	{plotColor: 'white'}, //West Virginia White
	'Poanes viator':		{plotColor: 'SaddleBrown'}, //Broad-winged Skipper
	'Polites egeremet':		{plotColor: 'SaddleBrown'}, //Northern Broken-Dash
	'Polites peckius':		{plotColor: 'DarkOrange'}, //Peck's Skipper
	'Polites themistocles':	{plotColor: 'DarkOrange'}, //Tawny-edged Skipper
	'Polygonia comma':		{plotColor: 'DarkOrange'}, //Eastern Comma
	'Polygonia interrogationis':	{plotColor: 'DarkOrange'}, //Question Mark
	'Pontia protodice':		{plotColor: 'white'}, //Checkered White
	'Problema byssus':		{plotColor: 'SaddleBrown'}, //Byssus Skipper
	'Satyrium calanus': 	{plotColor: 'SaddleBrown'}, //Banded Hairstreak
	'Satyrium caryaevorous':{plotColor: 'SaddleBrown'}, //Hickory Hairstreak
	'Satyrium liparops':	{plotColor: 'SaddleBrown'}, //Striped Hairstreak
	'Satyrium titus':		{plotColor: 'gray'}, //Coral Hairstreak
	'Staphylus hayhurstii':	{plotColor: 'SaddleBrown'}, //Hayhurst's Scallopwing
	'Strymon melinus':		{plotColor: 'gray'}, //Gray Hairstreak
	'Tharsalea hyllus':		{plotColor: 'DarkOrange'}, //Bronze Copper
	'Thymelicus lineola':	{plotColor: 'DarkOrange'}, //Essex Skipper
	'Vanessa atalanta':		{plotColor:	'OrangeRed'},	//Red Admiral
	'Vanessa cardui':		{plotColor: 'DarkOrange'}, //Painted Lady
	'Vanessa virginiensis':	{plotColor: 'DarkOrange'}, //American Lady
	'Vernia verna':			{plotColor: 'SaddleBrown'}, //Little Glassywing
	
	
	
};

//Initialize the OFVS (Observation Field Values) Genera object
var ofvsGeneraObj = {
	'Silphium': 	{
		commonName: 'Rosinweeds',
		plotColor: 'yellow',
		species: {
			'perfoliatum': {
				taxon: 'Silphium perfoliatum',
				genus: 'Silphium',
				commonName: 'Cup Plant',
		 		butterflySpeciesArr: ['Pearl Crescent', 'Monarch'],
				numButterflySpecies: 2,
				numObs: 3,
				obsTimeVector: [0,364],
				obsDateArrMMDD: ["0101"],
				obsSecondDateIndex: 18},
		},
		butterflySpeciesArr: ['Pearl Crescent', 'Monarch', 'Harvester'],
		numOFVSSpecies: 2,
		numButterflySpecies: 3,
		numObs: 8,
		obsTimeVector: [0,364],
		obsDateArrMMDD: ["0101"],
		obsSecondDateIndex: 18,
	},
	'Achillea':		{commonName: 'Yarrows',		plotColor: 'LightYellow'}, 
	'Ajuga':		{commonName: 'Bugles',		plotColor: 'BlueViolet'},
	'Agastache':	{commonName: 'Hyssops',		plotColor: 'blue'},
	'Ageratina':	{commonName: 'Snakeroots',	plotColor: 'white'},
	'Anacis':		{commonName: 'Anacis', 		plotColor: 'yellow'},
	'Andersonglossum': {commonName: 'Andersonglossum', plotColor: 'blue'},
	'Anethum':		{commonName: 'Anethum',		plotColor:  'yellow'},
	'Asclepias':	{commonName: 'Milkweeds',	plotColor: 'pink'},
	'Bidens':		{commonName: 'Beggarticks',	plotColor: 'yellow'},
	'Blephilia':	{commonName: 'Wood Mints',	plotColor: 'PaleGreen'},
	'Boltonia':		{commonName: "Doll's Daisies", plotColor: 'white'},
	'Campanulastrum': {commonName: 'Tall Bellflowers', plotColor: 'blue'},
	'Cardamine':	{commonName: 'Bittercresses and Toothworts', plotColor: 'pink'},
	'Cerastium':	{commonName: 'Mouse-ear Chickweeds', plotColor: 'white'},
	'Cercis':		{commonName: 'Redbuds',		plotColor: 'pink'},
	'Cirsium':		{commonName: 'Plume Thistles', plotColor:'MediumOrchid'},
	'Claytonia': 	{commonName: 'Spring Beauties', plotColor: 'pink'},
	'Conoclinium':	{commonName: 'Mistflowers',	plotColor: 'MediumOrchid'},
	'Coreopsis':	{commonName: 'Tickseed',		plotColor: 'yellow'},
	'Cucumis':		{commonName: 'Melons and Cucumbers', plotColor: 'yellow'},
	'Dalea':		{commonName: 'Prairie Clovers',	plotColor: 'white'},
	'Delphinium':	{commonName: 'Larkspurs',	plotColor: 'DarkViolet'},
	'Dicentra':		{commonName: 'Bleedinghearts', plotColor: 'white'},
	'Desmodium':	{commonName: 'Ticktrefoils',plotColor: 'Violet'},
	'Dianthus':		{commonName: 'Carnations',	plotColor: 'Fuchsia'},
	'Echinacea':	{commonName: 'Coneflowers',	plotColor: 'MediumPurple'},
	'Elaeagnus':	{commonName: 'Oleasters', 	plotColor: 'lightgreen'},
	'Erigeron':		{commonName: 'Fleabanes and Horseweeds', plotColor: 'lightyellow'},
	'Eupatorium':	{commonName: 'Bonesets', 	plotColor: 'white'},
	'Eutrochium':	{commonName: 'Joe-Pye Weeds', plotColor: 'Violet'},
	'Ficaria':		{commonName: 'Ficaria', 	plotColor: 'yellow'},
	'Fuchsia':		{commonName: 'Fuchsias', 	plotColor: 'red'},
	'Geranium':		{commonName: 'Geraniums and Cranesbills', plotColor: 'purple'},
	'Glechoma':		{commonName: 'Ground-Ivies',plotColor: 'BlueViolet'},
	'Helenium':		{commonName: 'Sneezeweeds',	plotColor: 'yellow'},
	'Helianthus':	{commonName: 'Sunflowers',	plotColor: 'yellow'},
	'Heliopsis':	{commonName: 'Oxeyes',		plotColor: 'yellow'},
	'Hemerocallis':	{commonName: 'Daylilies',	plotColor: 'orange'},
	'Iris':			{commonName: 'Irises',		plotColor: 'orange'},
	'Kummerowia':	{commonName: 'Kummerowia',	plotColor: 'pink'},
	'Lamium':		{commonName: 'Deadnettles and Archangels', plotColor:'pink'},
	'Lespedeza':	{commonName: 'Bush Clovers and Lespedeza', plotColor: 'pink'},
	'Leucanthemum':	{commonName: 'Oxeye Daisies',plotColor: 'lightyellow'},
	'Liatris': 		{commonName: 'Blazing-Stars',plotColor: 'Violet'},
	'Lobelia':		{commonName: 'Lobelias',	plotColor: 'blue'},
	'Lysimachia':	{commonName: 'Loosestrifes',plotColor: 'orange'},
	'Melilotus':	{commonName: 'Melilots and Sweetclovers', plotColor: 'white'},
	'Mertensia':	{commonName: 'Bluebells',	plotColor: 'CornflowerBlue'},
	'Monarda':		{commonName: 'Beebalms and Bergamots', plotColor: 'MediumPurple'},
	'Obolaria':		{commonName: 'Pennyworts',	plotColor: 'white'},
	'Ocimum':		{commonName: 'Basils', 		plotColor: 'white'},
	'Oenothera':	{commonName: 'Evening Primroses, Sundrops, and Beeblossoms',	plotColor: 'yellow'},
	'Ornithogalum':	{commonName: 'Star-of-Bethlehem', plotColor: 'white'},
	'Oxalis':		{commonName: 'Woodsorrels',	plotColor: 'yellow'},
	'Packera':		{commonName: 'American Groundsels and Ragworts',	plotColor: 'yellow'},
	'Pelargonium':	{commonName: 'Geraniums and Storksbills', plotColor: 'red'},
	'Penstemon':	{commonName: 'Beardtongues',plotColor: 'white'},
	'Persicaria':	{commonName: 'Knotweeds, Smartweeds, and Waterpeppers',	plotColor: 'pink'},
	'Phaseolus':	{commonName: 'Beans',		plotColor: 'Violet'},
	'Phlox':		{commonName: 'Phlox',		plotColor: 'Violet'},
	'Prunella':		{commonName: 'Selfheals',	plotColor: 'CornflowerBlue'},
	'Potentilla':	{commonName: 'Cinquefoils',	plotColor: 'yellow'},
	'Pycnanthemum':	{commonName: 'Mountain Mints', plotColor: 'Lavender'},
	'Ranunculus':	{commonName: 'Buttercups',	plotColor: 'yellow'},
	'Ratibida':		{commonName: 'Coneflowers', plotColor: 'yellow'},
	'Rudbeckia':	{commonName: 'Black-eyed Susans and Coneflowers',	plotColor: 'yellow'},
	'Solidago':		{commonName: 'Goldenrods',	plotColor: 'yellow'},
	'Symphyotrichum':{commonName: 'American Asters', plotColor:'white'},
	'Tagetes':		{commonName: 'Marigolds',	plotColor: 'yellow'},
	'Taraxacum':	{commonName: 'Dandelions', 	plotColor: 'yellow',},
	'Thalictrum':	{commonName: 'Meadow-Rues', plotColor: 'white'},
	'Trifolium':	{commonName: 'Clovers',		plotColor: 'white'},
	'Tropaeolum':	{commonName: 'Nasturtiums',	plotColor: 'red'},
	'Verbena':		{commonName: 'Vervains',	plotColor: 'white'},
	'Verbesina':	{commonName: 'Crownbeards', plotColor: 'yellow'},
	'Viola':		{commonName: 'Violets', 	plotColor: 'BlueViolet'},
	'Zinnia':		{commonName: 'Zinnias', 	plotColor: 'red'},
	'Wisteria':		{commonName: 'Wisterias', 	plotColor: 'purple'},
};

//Array of ofvs genera and species objects
var ofvsGeneraObjArr = [];
var ofvsSpeciesObjArr = [];


//Build an object with the plotting attributes for each OFVS Species whose color differs from the color specified for its genus in OVFS_Genera_Obj
var ofvsSpeciesAlternateColorObj = {
	'Symphyotrichum cordifolium':	{plotColor: 'CornflowerBlue'},//Common Blue Wood Aster
	'Symphyotrichum novae-angliae':	{plotColor: 'MediumOrchid'},	//New England aster
	'Symphyotrichum shortii':		{plotColor: 'CornflowerBlue'},//Short's aster
	'Symphyotrichum laeve':			{plotColor: 'CornflowerBlue'}, //Smooth Blue Aster
	'Trifolium pratense':			{plotColor: 'pink'},	//Red Clover
};


//Build the standard one year daily date arrays
//This is copied from CVPA
var dateArr = [];      //date objects with year = 2019
var dateArrMMDD = [];  //MMDD strings
var newDate = new Date('12/31/2018');
for (var i = 0; i < 365; i++) {
	newDate.setDate(newDate.getDate() + 1); 
	dateArr[i] = new Date(newDate);
	var dateStr = translateDateToStr(newDate);
	var MMDD = dateStr.substring(4,8);
	dateArrMMDD[i] = MMDD;
};


//========= API Examples

/*

//Get an observation
var obsURL = 'https://api.inaturalist.org/v1/observations/69380908';

//Project ID Query:  Brown County State Park
var projectURL = 'https://api.inaturalist.org/v1/projects/98891';

//User ID query:  rossberryhill
var userURL = 'https://api.inaturalist.org/v1/users/1855094';

//Place ID query:  Brown County
var placeURL = 'https://api.inaturalist.org/v1/places/282';

//Get the observations for a user.  Default is 30 observations per page
var userObsURL = 'https://api.inaturalist.org/v1/observations?user_id=1855094&order=desc&order_by=created_at';
//Get observations for a user, page 2
var userObsPage2URL = 'https://api.inaturalist.org/v1/observations?user_id=1855094&page=2&order=desc&order_by=created_at'
//Get observations for a user, ordered by observation date
var userObsURL = 'https://api.inaturalist.org/v1/observations?user_id=1855094&order=desc&order_by=observed_on';

//Observation Photos
var obsObj = {};
obsObj.observation_photos = [];
obsObj.observation_photos[0] = {};
obsObj.observation_photos[0].photo = {};
obsObj.observation_photos[0].photo.url = 'https://static.inaturalist.org/photos/112556590/square.jpg?1612991875';
//Photo sizes:  square, small, medium, large, original

//Taxa - Eastern Tiger Swallowtail
	//Website
	var urlObs1 = 'https://www.inaturalist.org/observations?place_id=any&taxon_id=60551';
	//JSON.  These two are not the same, the first returns one result, the second all the observations:
	var urlTaxa = 'https://api.inaturalist.org/v1/taxa/60551';
	var urlObs2 = 'https://api.inaturalist.org/v1/observations?taxon_id=60551&order=desc&order_by=created_at';
//Taxa - Eastern Tiger Swallowtail and Zebra Swallowtail(83086)
	var urlObs3 = 'https://api.inaturalist.org/v1/observations?taxon_id=60551,83086&order=desc&order_by=created_at';
*/