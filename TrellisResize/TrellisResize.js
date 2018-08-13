'use strict';

var curParam; //global variable to store current parameter value
var headerWidth = 97; //calculate header width and input here
var columnWidth = 250; //calculate the width of a column and input here

(function () {
  $(document).ready(function () { //once page is ready
    // This is the entry point into the extension. 
    tableau.extensions.initializeAsync().then(function () {
      
      let dashboard = tableau.extensions.dashboardContent.dashboard;

      //get current parameter value
      getParameter2('Columns to Display').then(function(cp){
        curParam = cp.currentValue.value;
        $('#curParam').html('initialize: ' + curParam);
        jqUpdateSize(); //get panel size and update columns if necessary
      });
    });
  });

  $(window).resize(jqUpdateSize);

  //jquery function to get screen size
  function jqUpdateSize(){
    // Get the dimensions of the viewport
    var width = $(window).width(); //get panel width
    var height = $(window).height(); //get panel height
    var p = parseInt((width - headerWidth)/columnWidth); //subtrict header width from panel width. Divide by column width (250)

    //print values to console (aka HTML objects in this case)
    $('#jqWidth').html(width);
    $('#jqHeight').html(height); 
    $('#paramVal').html(p);

    //$('#curParam').html(curParam);
    if(curParam!=p){ //if calculated columns doesn't match parameter then...
      //updateParameter('Columns to Display',p);
      $('#curParam').html('attempt update');
      updateParameter2('Columns to Display',p);
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

})();