var dat = require("./dat.gui.js");
require("./styles/dat-gui-swec.css");
google.charts.load('current', {packages: ['corechart', 'line']});


/**
 * Used for logging into blackfynn

 	note that this file is currently modified to use a login as opposed to an API key
 */
exports.ElectrodePanel = function(dailogName)  {

	//dat.gui container for cellGui
	var cellGui = undefined;
	var otherCellControls = undefined;
	var dialogObject = undefined;
	var localDialogName = dailogName;
	var session_token = '';
    var organisation = '';
    var loaded_session_token = 0;
    this.datasets = [];
    var savedData;

    var baseURL = "http://blackfynnpythonlink.ml/display/MPB/simple_heart";
	
	var _this = this;
	_this.channelCall = addSelectedDataSet;


	function drawBasic(data2){

      var data = new google.visualization.DataTable();
      data = processData(data2);

      var options = {
        hAxis: {
          title: 'Time'
        },
        animation: {
	    	startup: true,
			duration: 1000,
			easing: 'out'},
        vAxis: {
          title: 'EEG Reading'
        }
      };
      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
      chart.draw(data, options);
      _this.chart = chart;
      _this.chartData = data;
      _this.chartOptions = options;
      _this.updateChart();

    }



	function createChannelDropdown() {
	    var select, i, option;

	    select = document.getElementById( 'select_channel' );
	    $("#select_channel").empty();

	    var keys = Object.keys(_this.allData)

	    for (var i in keys){
	        option = document.createElement( 'option' );
	        option.value = option.text = keys[i];
	        select.add( option );  
	    }


	}


	var addSelectedDataSet = function(){
	    var selection = $('#select_channel :selected').text()
	    if (_this.chart !== undefined) {
	    	newTable = addDataSeries(_this.chartData, _this.allData[selection], selection);
	    	_this.chart.draw(newTable, _this.chartOptions)
	    }
	    else {
	        savedData = _this.allData[selection]
	        _this.drawBasic(_this.allData[selection]);


	    }
	}

	function getData(){

    	var baseRestURL = baseURL;

	    getDataCall( baseURL, function childrenCallBack() {
	        createChannelDropdown()
	        document.getElementById('select_channel').onchange = addSelectedDataSet
	        addSelectedDataSet()
	    });

	    function getDataCall(baseRestURL, callback){
	        var APIPath = "/models/data/ecgData2.json";
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
	                _this.allData = JSON.parse(request2.responseText);

	                return callback()
	        }

	        request2.open(method, url, async);
	        request2.setRequestHeader("Content-Type", "application/json");
        	request2.setRequestHeader("Accept", "application/json");
	        request2.send(null);
	    }

	}

	var setOnchange = function() {

	    

    }


	function processData(data){

	    var data2 = new google.visualization.DataTable();
	    data2.addColumn('number', 'Time');
	    data2.addColumn({type:'string', role:'annotation'})
	    data2.addColumn('number', $('#select_channel :selected').text());
	    
	    var ind = 0.00
	    for (var i in data) {
	        var row = [ind, null, data[i]]
	        data2.addRow(row)
	        ind = ind + .04;
	    }

	    return data2
	}

	function addDataSeries(dataTable, newSeries, id){
		dataTable.addColumn('number', id);

		var numberOfRows = dataTable.getNumberOfRows()
		var numberOfCols = dataTable.getNumberOfColumns()
		var ind = 0.00
	    for (var i = 1; i < numberOfRows; i++) {
	        dataTable.setCell( i, numberOfCols - 1, newSeries[i] )
	        ind = ind + .04;
	    }
	    return dataTable
	}	 

	

	
	var initialiseElectrodePanel = function() {
		cellGui = new dat.GUI({autoPlace: false});
		cellGui.domElement.id = 'Electrode Viewer';
		cellGui.close();
		getData();

	}


	this.drawBasic = function(){

      _this.chartData = new google.visualization.DataTable();
      _this.chartData = processData(savedData);

      // add a blank row to the end of the DataTable to hold the annotations
      _this.chartData.addRow([.5,  'point five', null]);
      _this.annotationRowIndex = _this.chartData.getNumberOfRows() - 1;

      _this.chartOptions = {
        hAxis: {
          title: 'Time'
        },
        
        vAxis: {
          title: 'ECG Reading'
        },
        annotation: {
            1: {
                // set the style of the domain column annotations to "line"
                style: 'line'
            }
        },
      };
      _this.chart = new google.visualization.LineChart(document.getElementById('chart_div'));
      _this.chart.draw(_this.chartData, _this.chartOptions);
      window.organsViewer.addTimeChangedCallback(window.electrodeViewer.updateChartExternal)
      

    }
    this.updateChart = function(time){
    	this.chartData.setValue(this.annotationRowIndex, 0, time/100)
    	this.chartData.setValue(this.annotationRowIndex, 1, '+')
		this.chartData.setValue(this.annotationRowIndex, 2, null)
    	this.chart.draw(this.chartData, this.chartOptions);
    }

    this.updateChartExternal = function(time){
    	window.electrodeViewer.chartData.setValue(window.electrodeViewer.annotationRowIndex, 0, time/100)
    	x_scaled = time*750/3000
    	if(Math.ceil(x_scaled) == Math.floor(x_scaled)){
    		interp_y = window.electrodeViewer.chartData.getValue(x_scaled, 2)
    	}
    	else{
			upper_y = window.electrodeViewer.chartData.getValue(Math.ceil(x_scaled), 2)
			lower_y = window.electrodeViewer.chartData.getValue(Math.floor(x_scaled), 2)
			interp_y = upper_y*(1-(Math.ceil(x_scaled)-x_scaled)) + lower_y*(1-(x_scaled-Math.floor(x_scaled)))
		}
    	time_indexed = time
    	window.electrodeViewer.chartData.setValue(window.electrodeViewer.annotationRowIndex, 1, interp_y.toFixed(1))
		window.electrodeViewer.chartData.setValue(window.electrodeViewer.annotationRowIndex, 2, null)
    	window.electrodeViewer.chart.draw(window.electrodeViewer.chartData, window.electrodeViewer.chartOptions);
    }


	var createNewDialog = function(data) {
    dialogObject = require("./utility").createDialogContainer(localDialogName, data);
    initialiseElectrodePanel();
    UIIsReady = true;
    delete link;
    }
	

	
	 var initialise = function() {
	   createNewDialog(require("./snippets/electrode_panel.html"));
  }
	
	initialise();
	
}
