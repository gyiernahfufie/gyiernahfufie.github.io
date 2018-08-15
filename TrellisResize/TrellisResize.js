'use strict';
var curParam = '';

(function () {
  $(document).ready(function () { //once page is ready
    // This is the entry point into the extension. 
    tableau.extensions.initializeAsync({'configure': configure}).then(function () {
      // This event allows for the parent extension and popup extension to keep their
      // settings in sync.  This event will be triggered any time a setting is
      // changed for this extension, in the parent or popup (i.e. when settings.saveAsync is called).
      tableau.extensions.settings.addEventListener(tableau.TableauEventType.SettingsChanged, function(settingsEvent) {
        updateExtensionBasedOnSettings(settingsEvent.newSettings)
      });

      $('#buttonTest').click(function(){console.log(currentSettings);});

      let dashboard = tableau.extensions.dashboardContent.dashboard;
      let currentSettings = tableau.extensions.settings.getAll();

      displaySettings(currentSettings);
      
      if(currentSettings.selectedParameter != undefined && currentSettings.headerWidth != undefined && currentSettings.columnWidth != undefined){
        $('#inactive').hide();
        $('#active').show();

        //get current parameter value
        getParameter2(currentSettings.selectedParameter).then(function(cp){
          curParam = cp.currentValue.value;
          $('#curParam').html('initialize: ' + curParam);
          jqUpdateSize(); //get panel size and update columns if necessary
        });
      } else {
        jqUpdateSize();
      }

      
    });
  });

  $(window).resize(jqUpdateSize);

  function configure() {
    // This uses the window.location.origin property to retrieve the scheme, hostname, and 
    // port where the parent extension is currently running, so this string doesn't have
    // to be updated if the extension is deployed to a new location.
    const popupUrl = `${window.location.origin}/TrellisResize/TrellisResizeDialog.html`;
    const payload = ''

    /**
     * This is the API call that actually displays the popup extension to the user.  The
     * popup is always a modal dialog.  The only required parameter is the URL of the popup,  
     * which must be the same domain, port, and scheme as the parent extension.
     * 
     * The developer can optionally control the initial size of the extension by passing in 
     * an object with height and width properties.  The developer can also pass a string as the
     * 'initial' payload to the popup extension.  This payload is made available immediately to 
     * the popup extension.  In this example, the value '5' is passed, which will serve as the
     * default interval of refresh.
     */
    tableau.extensions.ui.displayDialogAsync(popupUrl, payload, { height: 500, width: 500 }).then(function(closePayload) {
      // The promise is resolved when the dialog has been expectedly closed, meaning that
      // the popup extension has called tableau.extensions.ui.closeDialog.
      console.log(closePayload);
      let currentSettings = tableau.extensions.settings.getAll();
      displaySettings(currentSettings);
      $('#inactive').hide();
      $('#active').show();
      jqUpdateSize();

      // The close payload is returned from the popup extension via the closeDialog method.
      //$('#active').text(closePayload);
      //TODO: parse close payload
    }).catch(function(error) {
      // One expected error condition is when the popup is closed by the user (meaning the user
      // clicks the 'X' in the top right of the dialog).  This can be checked for like so:
      switch(error.errorCode) {
        case tableau.ErrorCodes.DialogClosedByUser:
          console.log("Dialog was closed by user");
          break;
        default:
          console.error(error.message);
      }
    });
  }

  function displaySettings(currentSettings){
    $('#paramName').html(currentSettings.selectedParameter);
    $('#headWidth').html(currentSettings.headerWidth);
    $('#colWidth').html(currentSettings.columnWidth);
  };

  //jquery function to get screen size
  function jqUpdateSize(){
    let currentSettings = tableau.extensions.settings.getAll();
    // Get the dimensions of the viewport
    var width = $(window).width(); //get panel width
    var height = $(window).height(); //get panel height
    var p = Math.max(parseInt((width - currentSettings.headerWidth)/currentSettings.columnWidth),1); //subtrict header width from panel width. Divide by column width (250)

    //print values to console (aka HTML objects in this case)
    $('#jqWidth').html(width);
    $('#jqHeight').html(height); 
    $('#paramVal').html(p);

    //$('#curParam').html(curParam);
    if(curParam!=p){ //if calculated columns doesn't match parameter then...
      //updateParameter('Columns to Display',p);
      $('#curParam').html('attempt update');
      updateParameter2(currentSettings.selectedParameter,p);
    } else {
      $('#curParam').html('unchanged: ' + curParam);
    }

  };
  
  function updateParameter(parameterName,value) {
    tableau.extensions.dashboardContent.dashboard.findParameterAsync(parameterName).then(function(parameter){
      parameter.changeValueAsync(value).then(function() {
        getParameter('Columns to Display');
      });
    });
  };

  function getParameter(parameterName) {
    tableau.extensions.dashboardContent.dashboard.findParameterAsync(parameterName).then(function(parameter){
      
      curParam = parameter.currentValue.value;
      $('#curParam').html(curParam );
      return parameter.currentValue.value;
    });
  };

  //async function that returns the promise of a parameter
  var getParameter2 = function(parameterName){
    return tableau.extensions.dashboardContent.dashboard.findParameterAsync(parameterName);
  };

  //function that updates a parameter
  var updateParameter2 = function(parameterName, value) {
    getParameter2(parameterName) //request parameter promise
    .then(function(param) { //once parameter is returned then...
      $('#curParam').html('attempt update 2: ' + param.name);
      param.changeValueAsync(value) //promise to update parameter
      .then(function(){ //once parameter is updated then...
        //post update stuff...
        $('#curParam').html('attempt update 3');
        curParam = value;
        $('#curParam').html('changed to: ' + curParam);
      });
    });
  };

    /**
   * Helper that is called to set state anytime the settings are changed.
   */
  function updateExtensionBasedOnSettings(settings) {
    currentSettings = tableau.extensions.settings.getAll();
    displaySettings(currentSettings);
    console.log('these are the selected settings:');
    console.log(settings.selectedParameter);
    console.log(settings.columnWidth);
    console.log(settings.headerWidth);
  }

})();