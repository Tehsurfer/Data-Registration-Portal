var THREE = require('zincjs').THREE;

//Current model's associate data, data fields, external link, nerve map informations,
//these are proived in the organsFileMap array.
var OrgansSceneData = function() {
  this.currentName = "";
  this.currentSystem = "";
  this.currentPart = "";
  this.currentSpecies  = "";
  //Current model's associate data, data fields, external link, nerve map informations,
  //these are proived in the organsFileMap array.
  this.associateData = undefined;
  this.dataFields = undefined;
  this.externalOrganLink = undefined;
  this.nerveMap = undefined;
  this.nerveMapIsActive = false;
}


/**
 * Viewer of 3D-organs models. Users can toggle on/off different views. Data is displayed instead
 * if models are not available.
 * 
 * @class
 * @param {PJP.ModelsLoader} ModelsLoaderIn - defined in modelsLoade.js, providing locations of files.
 * @param {String} PanelName - Id of the target element to create the  {@link PJP.OrgansViewer} on.
 * @author Alan Wu
 * @returns {PJP.OrgansViewer}
 */
var OrgansViewer = function(ModelsLoaderIn)  {
  (require('./RendererModule').RendererModule).call(this);
  var returnedValue = (require("../utility").createRenderer)();
  _this = this
  _this.zincRenderer = returnedValue["renderer"];
  _this.rendererContainer = returnedValue["container"];
  _this.domAppended = false

  _this.scene = _this.zincRenderer.getSceneByName('gg');
  if (_this.scene === undefined) {
    _this.scene  = _this.zincRenderer.createScene('gg');
  }
  _this.scene.loadMetadataURL('/models/organsViewerModels/cardiovascular/heart/animated_nerve_1.json')
 
  _this.scene.resetView()
  _this.scene.loadFromViewURL('/models/organsViewerModels/cardiovascular/heart/heart')
  _this.zincRenderer.setCurrentScene(_this.scene)
  _this.zincRenderer.animate()

  $(window).on('load', function() {
    document.getElementById('organsDisplayArea').appendChild(_this.rendererContainer)
  })

  var appendOrgansDOM = function(){
    if (!_this.domAppended){
      document.getElementById('organsDisplayArea').appendChild(_this.rendererContainer)
    }
  }
}

OrgansViewer.prototype = Object.create((require('./RendererModule').RendererModule).prototype);
exports.OrgansViewer = OrgansViewer;
