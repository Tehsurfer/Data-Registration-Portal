/**
 * Simple heart demo with selection callback
 * 
 * @class
 * @author Alan Wu
 * @returns {PJP.Main}
 */
Main = function()  {
  
  var selectionCallback = function() {
    return function(event) {
      if (event.eventType === physiomeportal.EVENT_TYPE.SELECTED) {
        if (event.identifiers.length > 0) {

          console.log("selected", event.identifiers);

          if (window.blackfynnViewer == null){
            window.blackfynnViewer = new physiomeportal.BlackfynnPanel('Blackfynn login');  
            this.organsViewer.addTimeChangedCallback(window.blackfynnViewer.updateChart(document.getElementById('organ_animation_slider').value))
          }       



          
        }
      }
      if (event.eventType === physiomeportal.EVENT_TYPE.HIGHLIGHTED) {
        if (event.identifiers.length > 0) {
          console.log("highlighted", event.identifiers);
        }
      }
    }
  }

  var initialise = function() {
    var modelsLoader = new physiomeportal.ModelsLoader();
    modelsLoader.initialiseLoading();
    this.organsViewer = new physiomeportal.OrgansViewer(modelsLoader);
    var organsViewerDialog = new physiomeportal.OrgansViewerDialog(this.organsViewer);
    var eventNotifier =  new physiomeportal.EventNotifier();
    this.organsViewer.addNotifier(eventNotifier);
    eventNotifier.suscribe(this, selectionCallback());
    this.organsViewer.loadOrgans("human", "Cardiovascular", "Heart");
    organsViewerDialog.setWidth("90%");
    organsViewerDialog.setHeight("90%");
    organsViewerDialog.setLeft("0px");
    organsViewerDialog.setTop("0px");

  }

  initialise();
}

