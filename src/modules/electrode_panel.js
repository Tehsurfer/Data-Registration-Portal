// var dat = require("./dat.gui.js");
// require("./styles/dat-gui-swec.css");
// var Plotly = require('../src/utilities/plotlyModule');
// require("./styles/my_styles.css");


/**
 * Used for logging into blackfynn

 	note that this file is currently modified to use a login as opposed to an API key
 */
exports.ElectrodePanel = function(dailogName, firstSelection)  {

	//dat.gui container for cellGui
	var cellGui = undefined;
	var otherCellControls = undefined;
	var dialogObject = undefined;
	var localDialogName = dailogName;

    var loaded_session_token = 0;
    var savedData;
    var times, x, plot, chart, data, chartOptions, chartData, inc, options, allData, annotationRowIndex;
    var colours = [];
    var modelURL;

    var baseURL = "";
	
	var _this = this;
	_this.channelCall = addSelectedDataSet;
	_this.totalTime = 16;


	this.getChartData = function(){
		return chartData;
	}

	this.getChartOptions = function(){
		return chartOptions;
	}

	this.exportLineChart = function(element, data, id){
		chartOptions.title =  'Electrode ' + id;
		var plot = new Plotly.plot(element, data, chartOptions);
		// var newLayout = {
		// 	autosize: false,
		// 	width: 400,
		// 	height: 200,
		// 	margin: {
		// 	l: 40,
		// 	r: 40,
		// 	b: 40,
		// 	t: 40,
		// 	pad: 4
		// 	},

		// }
		// Plotly.relayout(element, newLayout)
		return plot;
	}

	this.getDataFromID = function(id){
		return processData(allData[id], id);
	}


	// getData() grabs the .json data via an HTTP request and then adds said dataset to the channel drop down box with 
	//    createChannelDropDown
	function getData(){

    	var baseRestURL = baseURL;

	    getDataCall( baseURL, function childrenCallBack() {
	    	_this.totalTime = times[times.length-1];
	        createChannelDropdown()
	        document.getElementById('select_channel').onchange = addSelectedDataSet;
	        document.getElementById('chartLoadingGif').remove();
	        addSelectedDataSet()
	    });

	    function getDataCall(baseRestURL, callback){
	        var APIPath = "./models/data/ecgDataFull.json";
	        var completeRestURL = baseRestURL + APIPath;
	        console.log("REST API URL: " + completeRestURL);

	        var method = "GET";
	        var url = completeRestURL;
	        var async = true;
	        var request2 = new XMLHttpRequest();
	        request2.onload = function() {
	                console.log("ONLOAD");
	                var status = request2.status; // HTTP response status, e.g., 200 for "200 OK"
	                console.log(status);
	                var parsed = JSON.parse(request2.responseText);
	                allData = parsed.values;
	                times = parsed.times;

	                return callback()
	        }

	        request2.open(method, url, async);
	        request2.setRequestHeader("Content-Type", "application/json");
        	request2.setRequestHeader("Accept", "application/json");
	        request2.send(null);
	    }

	}

	var addSelectedDataSet = function(){
	    var selection = $('#select_channel :selected').text()
	    if (selection !== 'Add channel to chart:' && selection !== '--------------------'){
	    	if (plot !== undefined) {
	    		addDataSeriesToChart(allData[selection], selection);
	    	}
	    	else {
	        	savedData = allData[selection];
	        	createChart(allData[selection], selection);
	        	// document.getElementById('chartLoadingGif').remove();
	    	}
		}
		selection.selectedIndex = 0;
	}

	function createChart(createChartData, id){

      chartData = processData(createChartData, id);

      chartOptions = {
  		title: 'ECG signals', 
  		xaxis: {
  		  type: 'seconds',
  		  title: 'Seconds'
  		}, 
  		yaxis: {
  		  autorange: true, 
  		  type: 'linear',
  		  title: 'mV'
  		}
  	  };
  	  plot = Plotly.newPlot('chart_div', chartData, chartOptions);
    }

    this.updateTime = function(time){
    	var update = {
		    shapes: [{
		    type: 'line',
		    x0: time,
		    y0: 0,
		    x1: time,
		    yref: 'paper',
		    y1: 1,
		    line: {
		      color: 'grey',
		      width: 1.5,
		      dash: 'dot'
		    }
		  }],
		};
		Plotly.relayout('chart_div', update);
    }


    function addDataSeriesToChart(newSeries, id){
		
		var newData = processData(newSeries, id)
		Plotly.addTraces('chart_div', newData)

	}

	function processData(unprocessedData, id){

	    var dataTrace = {
	    	type: "scatter",
 			name: 'Electrode ' + id,
 			mode: "lines",
 			x: times,
 			y: unprocessedData,
 			line: {color: colours[id]}
	    }	    
	    return [dataTrace]
	}




	function createChannelDropdown() {
	    var select, i, option;

	    select = document.getElementById( 'select_channel' );
	    $("#select_channel").empty();

	    option = document.createElement( 'option' );
	    option.value = option.text = 'Add channel to chart:';
	    select.add( option );
	    option = document.createElement( 'option' );
	    option.value = option.text = '--------------------';
	    select.add( option );  

	    var keys = Object.keys(allData)

	    for (var i in keys){
	        option = document.createElement( 'option' );
	        option.value = option.text = keys[i];
	        select.add( option );  
	    }
	    select.selectedIndex = parseInt(firstSelection) + 1;

	}

	function createColours() {
		for (var i = 0; i < 100; i++){
			colours.push('#'+(Math.random()*0xFFFFFF<<0).toString(16))
		}
	}

	function createOpenCORlink(){
		modelURL = window.location.href + "/models/data/openCorExport.csv"
		runModelButton = document.getElementById('OpenCORLinkButton')
		runModelButton.onclick = function(){runModel(modelURL)};

	}

	var runModel = function(modelURL) {
		var opencorURL = modelURL;
		window.open(opencorURL, '_self');
	}
	
	var initialiseElectrodePanel = function() {
		// cellGui = new dat.GUI({autoPlace: true});
		// cellGui.domElement.id = 'Electrode Viewer';
		// cellGui.close();
		createColours();
		createOpenCORlink();
		setTimeout(linkCloseButton(), 800);
		getData();

	}

    this.updateChartExternal = function(time){
    }

	var createNewDialog = function(data) {
    	dialogObject = require("../utility").createDialogContainer(localDialogName, data);
    	_this.dialogObject = dialogObject;
    	var ui = dialogObject.parent().parent();
    	ui.outerWidth('95%');
    	ui.outerHeight('40%');

    	initialiseElectrodePanel();
    	UIIsReady = true;
    	delete link;
    }
	
	 var initialise = function() {
	   createNewDialog(require("../snippets/electrode_panel.html"));
  }

  	var linkCloseButton = function(){
  		cc = document.getElementsByClassName("ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close")
		cc[1].onclick = destroyPanel;
  	}
  	var destroyPanel = function(){
  		plot = undefined;
  		select = undefined;
  		document.getElementById('select_channel').remove()
  		window.organsViewer.destroyChart();
  		_this.callbackArray = [function(input){}]
  		(require('./BaseModule').BaseModule).prototype.destroy.call( _this );
  	}
	
	initialise();
	
}
