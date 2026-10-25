/* MV Homes — site data. Edit this file to update listings, photos and localities. */
window.MV = (function(){
  /* Photos: Unsplash (free for commercial use, https://unsplash.com/license).
     Replace with the client's own property photos when available, e.g. "images/saket-1.jpg". */
  var U = function(id, w){ return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + (w||1400) + '&q=78'; };
  var IMG = {
    extDusk:   U('1757524492552-d47a66a2b63e'),
    extGlow:   U('1748063578185-3d68121b11ff'),
    extWhite:  U('1600596542815-ffad4c1539a9'),
    extBrown:  U('1580587771525-78b9dba3b914'),
    extBalc:   U('1721815693498-cc28507c0ba2'),
    extTwo:    U('1513584684374-8bab748fbf90'),
    extVilla:  U('1613977257363-707ba9348227'),
    extBlock:  U('1628012209120-d9db7abf7eab'),
    bldgBalc:  U('1590058582642-b130d1620a49'),
    liv1:      U('1741764014072-68953e93cd48'),
    liv2:      U('1757924461488-ef9ad0670978'),
    liv3:      U('1680416124510-5eae1beca412'),
    liv4:      U('1628592102751-ba83b0314276'),
    liv5:      U('1758448755952-42b404bc6f39'),
    liv6:      U('1713832139688-79676097edde'),
    bed1:      U('1616594039964-ae9021a400a0'),
    bed2:      U('1505693416388-ac5ce068fe85'),
    bed3:      U('1617098900591-3f90928e8c54'),
    bed4:      U('1566665797739-1674de7a421a'),
    kit1:      U('1556911220-bff31c812dba'),
    kit2:      U('1617228069096-4638a7ffc906'),
    kit3:      U('1484154218962-a197022b5858'),
    kit4:      U('1588854337236-6889d631faa8'),
    balcony:   U('1693585576674-2e1b7166f583'),
    rail:      U('1630703103926-5168f111a868'),
    qutub:     U('1632426237957-5ea14aae7100'),
    indiaGate: U('1587474260584-136574528ed5'),
    safdarjung:U('1575566668200-7dcaa7b2cf28'),
    rajpath:   U('1592639296346-560c37a0f711'),
    keys:      U('1741156386380-0236c72eb6f9'),
    keysModel: U('1759428679273-11d914866394'),
    handshake: U('1781229771042-2a859f8f8022'),
    model:     U('1560518883-ce09059eeffa')
  };

  var LISTINGS = [
    {id:1,p:'sale',loc:'Malviya Nagar',title:'Park-facing 3 BHK builder floor',bhk:3,plot:'200 sq. yd.',floor:'Second',facing:'East',price:'₹2.65 Cr',extra:['Lift','Stilt parking'],img:IMG.liv1},
    {id:2,p:'sale',loc:'Saket',title:'New 4 BHK with roof rights',bhk:4,plot:'250 sq. yd.',floor:'Third',facing:'North',price:'₹4.10 Cr',extra:['Lift','Roof terrace'],img:IMG.extDusk},
    {id:3,p:'sale',loc:'Shivalik',title:'Ground floor 3 BHK with lawn',bhk:3,plot:'180 sq. yd.',floor:'Ground',facing:'West',price:'₹2.20 Cr',extra:['Private lawn'],img:IMG.liv2},
    {id:4,p:'sale',loc:'Sarvodaya Enclave',title:'Corner 4 BHK builder floor',bhk:4,plot:'300 sq. yd.',floor:'First',facing:'North-East',price:'₹5.25 Cr',extra:['Corner plot','Lift'],img:IMG.extGlow},
    {id:5,p:'sale',loc:'Sheikh Sarai',title:'2 BHK DDA flat, Phase I',bhk:2,plot:'85 sq. m',floor:'First',facing:'South',price:'₹1.15 Cr',extra:['Freehold'],img:IMG.liv3},
    {id:6,p:'sale',loc:'Malviya Nagar',title:'Freshly built 3 BHK floor',bhk:3,plot:'150 sq. yd.',floor:'First',facing:'North',price:'₹1.95 Cr',extra:['Lift','Modular kitchen'],img:IMG.kit1},
    {id:7,p:'sale',loc:'Panchsheel Park',title:'4 BHK floor facing the park',bhk:4,plot:'400 sq. yd.',floor:'Second',facing:'South',price:'₹7.80 Cr',extra:['Park facing','2 car parks'],img:IMG.liv5},
    {id:8,p:'sale',loc:'Greater Kailash',title:'3 BHK near M Block market',bhk:3,plot:'250 sq. yd.',floor:'Ground',facing:'East',price:'₹4.60 Cr',extra:['Basement','Lift'],img:IMG.extWhite},
    {id:9,p:'sale',loc:'Hauz Khas',title:'Renovated 3 BHK, quiet lane',bhk:3,plot:'200 sq. yd.',floor:'Third',facing:'West',price:'₹3.40 Cr',extra:['Roof rights'],img:IMG.liv4},
    {id:21,p:'rent',loc:'Malviya Nagar',title:'Furnished 2 BHK floor',bhk:2,plot:'100 sq. yd.',floor:'Second',facing:'East',price:'₹42,000',per:'/month',extra:['Semi-furnished','Near metro'],img:IMG.bed2},
    {id:22,p:'rent',loc:'Saket',title:'3 BHK floor near Select City',bhk:3,plot:'200 sq. yd.',floor:'First',facing:'North',price:'₹78,000',per:'/month',extra:['Lift','1 car park'],img:IMG.liv6},
    {id:23,p:'rent',loc:'Geetanjali Enclave',title:'4 BHK duplex with terrace',bhk:4,plot:'250 sq. yd.',floor:'Third',facing:'West',price:'₹1,25,000',per:'/month',extra:['Roof terrace'],img:IMG.bed1},
    {id:24,p:'rent',loc:'Hauz Khas',title:'Ground floor 3 BHK, lawn',bhk:3,plot:'300 sq. yd.',floor:'Ground',facing:'East',price:'₹1,10,000',per:'/month',extra:['Pet friendly','Lawn'],img:IMG.extBalc},
    {id:25,p:'rent',loc:'Shivalik',title:'2 BHK for a small family',bhk:2,plot:'120 sq. yd.',floor:'First',facing:'South',price:'₹38,000',per:'/month',extra:['Unfurnished'],img:IMG.kit3},
    {id:26,p:'rent',loc:'Sheikh Sarai',title:'2 BHK DDA flat, Phase II',bhk:2,plot:'80 sq. m',floor:'Second',facing:'North',price:'₹30,000',per:'/month',extra:['Society park'],img:IMG.bed4},
    {id:27,p:'rent',loc:'Panchsheel Park',title:'Furnished 3 BHK, park view',bhk:3,plot:'300 sq. yd.',floor:'First',facing:'East',price:'₹1,60,000',per:'/month',extra:['Fully furnished','Lift'],img:IMG.bed3},
    {id:28,p:'rent',loc:'Saket',title:'Office-ready ground floor',bhk:3,plot:'250 sq. yd.',floor:'Ground',facing:'North',price:'₹1,40,000',per:'/month',extra:['Commercial use','Parking'],img:IMG.liv2}
  ];

  var FEATURED = {title:'Park-facing 3 BHK, Malviya Nagar',p:'sale',loc:'Malviya Nagar',plot:'200 sq. yd.',floor:'Third + roof',price:'₹3.10 Cr'};

  /* Localities: x,y on a 600 x 600 schematic map (north up, not to scale). Malviya Nagar office at 300,330. */
  var LOCS = [
    {k:'malviya',name:'Malviya Nagar',x:300,y:330,stock:'Builder floors, flats',img:IMG.liv1,text:'Our home colony. Busy main market, Malviya Nagar metro on the Yellow Line, and a mix of new stilt-plus-four builder floors and older family homes.',tags:['Metro','Market','Our office']},
    {k:'saket',name:'Saket',x:340,y:455,stock:'Builder floors',img:IMG.extDusk,text:'Wide blocks, Select Citywalk and the district centre, Saket metro, and some of the newest builder floors in South Delhi.',tags:['Malls','Metro','New builds']},
    {k:'shivalik',name:'Shivalik',x:240,y:262,stock:'Builder floors',img:IMG.liv2,text:'Quiet residential lanes right next to Malviya Nagar. Popular with families looking for a ground floor with a lawn.',tags:['Quiet','Families']},
    {k:'sheikhsarai',name:'Sheikh Sarai',x:438,y:335,stock:'DDA flats',img:IMG.liv3,text:'Phase I and II DDA flats in green, gated pockets. Good value entry point into South Delhi, many already freehold.',tags:['DDA','Value']},
    {k:'hauzkhas',name:'Hauz Khas',x:215,y:185,stock:'Builder floors',img:IMG.safdarjung,text:'Established colony near the Hauz Khas complex and Deer Park, with a metro interchange on the Yellow and Magenta lines.',tags:['Heritage','Metro interchange']},
    {k:'sarvodaya',name:'Sarvodaya Enclave',x:150,y:120,stock:'Builder floors',img:IMG.extGlow,text:'Large plots off Aurobindo Marg, close to well-known schools and IIT Delhi. Strong demand for corner plots.',tags:['Large plots','Schools']},
    {k:'geetanjali',name:'Geetanjali Enclave',x:330,y:225,stock:'Builder floors',img:IMG.bed1,text:'Small, quiet enclave with wide internal roads. Duplexes with terraces come up here regularly.',tags:['Quiet','Duplexes']},
    {k:'panchsheel',name:'Panchsheel Park',x:405,y:185,stock:'Floors, plots',img:IMG.liv5,text:'Low-density, leafy and close to the Outer Ring Road. Larger plots and park-facing floors at the premium end.',tags:['Premium','Parks']},
    {k:'gk',name:'Greater Kailash',x:500,y:160,stock:'Builder floors',img:IMG.extWhite,text:'GK I and II, M Block and N Block markets, and a deep market for 250–500 sq. yd. builder floors.',tags:['Markets','Premium']},
    {k:'navjeevan',name:'Navjeevan Vihar',x:195,y:330,stock:'Floors, plots',img:IMG.extTwo,text:'Compact colony between Malviya Nagar and Aurobindo Marg, with independent houses that come up for redevelopment.',tags:['Redevelopment','Plots']}
  ];

  var PAGES = [
    {k:'home',href:'index.html',name:'Home',sub:'Ride the building'},
    {k:'about',href:'about.html',name:'About',sub:'Who we are'},
    {k:'buy',href:'buy.html',name:'Buy',sub:'Homes for sale'},
    {k:'rent',href:'rent.html',name:'Rent',sub:'Homes to rent'},
    {k:'sell',href:'sell.html',name:'Sell',sub:'List your property'},
    {k:'localities',href:'localities.html',name:'Localities',sub:'Colonies we cover'},
    {k:'process',href:'process.html',name:'Process',sub:'Call to registry'},
    {k:'gallery',href:'gallery.html',name:'Gallery',sub:'Homes we have shown'},
    {k:'guide',href:'guide.html',name:'Buyer’s Guide',sub:'EMI, costs, FAQ'},
    {k:'contact',href:'contact.html',name:'Contact',sub:'Visit or call'}
  ];

  var PHONE = '+91 99113 54620', WA = '919911354620', EMAIL = 'mvproperties2000@gmail.com';
  return {IMG:IMG,LISTINGS:LISTINGS,FEATURED:FEATURED,LOCS:LOCS,PAGES:PAGES,PHONE:PHONE,WA:WA,EMAIL:EMAIL};
})();
