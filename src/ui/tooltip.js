require("../styles/tooltip.css");
// var Plotly = require('../src/utilities/plotlyModule');

exports.ToolTip = function(container) {
  var tooltipcontainerElement = undefined;
  var tipElement = undefined;
  
  var tiptextElement = undefined;
  var tipchartElement = undefined;
  var parent = undefined;
  var template = '<div id="tooltipcontainer"><div class="tooltip" id="tip"><span class="tooltiptext" id="tiptext"> Tooltip text</span><div id="tipchart" class="chart"></div></div></div>';
  var _this = this;
  _this.chartExists = false;

  
  /**
   * Show tool tip on the specified windows coordinates.
   * @param {Number} x - Style sheet with the same title.
   * @param {Number} y - selector string to match.
   */
  this.show = function(x, y) {

    tooltipcontainerElement.style.left = x +"px";
    tooltipcontainerElement.style.top = (y - 20) + "px";
    tipElement.style.visibility = "visible";
    tipElement.style.opacity = 1;
    if (!_this.chartExists){
     tiptextElement.style.visibility = "visible";
     tiptextElement.style.opacity = 1;
     tooltipcontainerElement.style.top = y+ "px";
    }
    tipchartElement.style.visibility = "visible";
    tipchartElement.style.opacity = 1;
    tipchartElement.style.opacity.zindex = 99;
  }
  
  this.hide = function() {
    tipElement.style.visibility = "hidden";
    tipElement.style.opacity = 0;
    tiptextElement.style.visibility = "hidden";
    tiptextElement.style.opacity = 0;
    tipchartElement.style.visibility = "hidden";
    tipchartElement.style.opacity = 0;
    tipchartElement.style.opacity.zindex = -100;
    if ( _this.chartExists === true){
      Plotly.purge(tipchartElement)
      chartExists = false;
      _this.chartExists = false;
    }
  }
  
  /**
   * Change the tooltip text.
   * @param {String} text - Text to update the tooltip to.
   */
  this.setText = function(text) {
    tiptextElement.innerHTML = text;
  }
  this.getChartElement = function(){
    return tipchartElement
  }
  this.setChartExistsFlagTo = function(flag){
    _this.chartExists = flag;

  }

  var setupToolTipContainer = function() {
    parent = $(template);
    /*
    for (i = 0; i < childNodes.length; i++) {
      parent[0].appendChild(childNodes[i]);
    }
    */
    tooltipcontainerElement = parent[0];
    tipElement = parent.find("#tip")[0];
    tiptextElement = parent.find("#tiptext")[0];
    tipchartElement = parent.find('#tipchart')[0];
    container.append(parent[0]);
  }
  
  setupToolTipContainer();
}

