'use strict';

/**
 * 
 * This extension is responsible for collecting configuration settings from the user and communicating
 * that info back to the parent extension.
 * 
 * This sample demonstrates two ways to do that:
 *   1) The suggested and most common method is to store the information 
 *      via the settings namespace.  The parent can subscribe to notifications when
 *      the settings are updated, and collect the new info accordingly.
 *   2) The popup extension can receive and send a string payload via the open 
 *      and close payloads of initializeDialogAsync and closeDialog methods.  This is useful
 *      for information that does not need to be persisted into settings.
 */


// Wrap everything in an anonymous function to avoid polluting the global namespace
(function () {
  /**
   * This extension collects the IDs of each datasource the user is interested in
   * and stores this information in settings when the popup is closed.
   */
  const datasourcesSettingsKey = 'selectedDatasources';
  const parameterSettingsKey = 'selectedParameter';
  const headerWidthSettingsKey = 'headerWidth';
  const columnWidthSettingsKey = 'columnWidth';

  var selectedParameter = '';
  let selectedDatasources = [];

  $(document).ready(function () {
    // The only difference between an extension in a dashboard and an extension 
    // running in a popup is that the popup extension must use the method
    // initializeDialogAsync instead of initializeAsync for initialization.
    // This has no affect on the development of the extension but is used internally.
    tableau.extensions.initializeDialogAsync().then(function (openPayload) {
      // The openPayload sent from the parent extension in this sample is the 
      // default time interval for the refreshes.  This could alternatively be stored
      // in settings, but is used in this sample to demonstrate open and close payloads.
      $('#closeButton').click(closeDialog);

      let dashboard = tableau.extensions.dashboardContent.dashboard;
      let currentSettings = tableau.extensions.settings.getAll();
      

      getParameters().then(function(parameters) {
        parameters.forEach(function(parameter) {
          if(parameter.dataType==='int') {
            let active = (parameter.name === currentSettings.selectedParameter);
            if (active) {
              selectedParameter = parameter.name;
              $('#selParam').text(parameter.name);
              $("#selParamDropdown").removeClass("btn-danger").addClass("btn-primary");
            }
            addParamToUI(parameter,active);
          }
        });
      });

      $('#headerWidth').val(currentSettings.headerWidth);
      $('#columnWidth').val(currentSettings.columnWidth);
    });
  });

  var getParameters = function(){
    return tableau.extensions.dashboardContent.dashboard.getParametersAsync()
  }

    /**
   * UI helper that adds a radio button item to the UI for a parameter.
   */
  function addParamToUI(parameter,active) {
    console.log('Adding parameter: ' + parameter.name);
    //let containerDiv = $('<div />');
    
    /*
    $('<input />', {
      type: 'radio',
      name: 'parameters',
      id: parameter.id,
      value: parameter.name,
      checked: active,
      click: function() { selectedParameter = parameter.name; console.log('parameter set to: '+ parameter.name); }
    }).appendTo(containerDiv);

    $('<label />', {
      'for': parameter.id,
      text: parameter.name,
    }).appendTo(containerDiv);

    $('#parameters').append(containerDiv);
    */
    let li = $('<li />');

    $('<a />', {
      name: 'parameters',
      id: parameter.id,
      text: parameter.name,
      click:function() {
        selectedParameter = parameter.name; 
        console.log('parameter set to: '+ parameter.name); 
        $('#selParam').text(parameter.name);
        $("#selParamDropdown").removeClass("btn-danger").addClass("btn-primary");
      }
    }).appendTo(li);

    $('#listParam').append(li);
  }

  /**
   * Stores the selected datasource IDs in the extension settings,
   * closes the dialog, and sends a payload back to the parent. 
   */
  function closeDialog() {
    let currentSettings = tableau.extensions.settings.getAll();
    tableau.extensions.settings.set(parameterSettingsKey, selectedParameter);
    tableau.extensions.settings.set(headerWidthSettingsKey, $('#headerWidth').val());
    tableau.extensions.settings.set(columnWidthSettingsKey, $('#columnWidth').val());
    tableau.extensions.settings.saveAsync().then(function(newSavedSettings) {
      tableau.extensions.ui.closeDialog('pass this back');
    }).catch(function(error){
      alert('problem!');
    });
  }
})();
