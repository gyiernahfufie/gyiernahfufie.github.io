var modal = (function() {
    var
        method = {},
        $overlay,
        $modal,
        $content,
        $close;

    // Center the modal in the viewport
    method.center = function() {
        var top, left;

        top = Math.max($(window).height() - $modal.outerHeight(), 0) / 2;
        left = Math.max($(window).width() - $modal.outerWidth(), 0) / 2;

        $modal.css({
            top: top + $(window).scrollTop(),
            left: left + $(window).scrollLeft()
        });
    };

    // Open the modal
    method.open = function(settings) {
        $content.empty().append(settings.content);
        console.log('modal open');
        $modal.css({
            width: settings.width || 'auto',
            height: settings.height || 'auto'
        });

        method.center();
        $(window).bind('resize.modal', method.center);
        $modal.show();
        $overlay.show();
    };

    // Close the modal
    method.close = function() {
        $modal.hide();
        $overlay.hide();
        input = $content.find('.input');
        $.each(input, function() {
            $(this).parent().text($(this).val());
        });

        crit = $content.find('.crit');
        var newinput = ''
        $.each(crit, function() {
            var h = $(this).html();
            var decode = $('<textarea/>').html(h).text();
            newinput += decode + ';';
        });
        console.log('Updating Criteria: ' + newinput);
        getCurrentWorkbook().changeParameterValueAsync('Exception Criteria', newinput);
        $content.empty();
        $(window).unbind('resize.modal');
    };

    // Generate the HTML and add it to the document
    $overlay = $('<div id="overlay"></div>');
    $modal = $('<div id="modal"><p style="color:white; font-weight: bold;">Click criteria to edit:</p></div>');
    $content = $('<div id="content"></div>');
    $close = $('<a id="close" href="#">close</a>');

    $modal.hide();
    $overlay.hide();
    $modal.append($content, $close);

    $(document).ready(function() {
        //$('body').append($overlay, $modal);
        parent.parent.parent.document.getElementsByClassName('tb-fill')[0].append($overlay, $modal);
        console.log('test ready 1');
    });

    $close.click(function(e) {
        e.preventDefault();
        method.close();
    });
    $content.on('click', '.crit', function() {
        // if the td elements contain any input tag
        if ($(this).find('input').length) {
            // sets the text content of the tag equal to the value of the input
            //$(this).text($(this).find('input').val());
            console.log('unclick');
        } else {
            // removes the text, appends an input and sets the value to the text-value
            var t = $(this).text();
            w = $(this).width();
            $(this).html($('<input class="input" />', {
                'value': t
            }).val(t));
            $(this).find('input').width(w);
            console.log('click');
        }
    });
    $content.on('keydown', '.input', function(event) {
        if (event.keyCode == 13) {
            console.log('Enter was pressed');
            $(this).parent().text($(this).val());
        }
    });
    $content.on('click', '.del', function() {
        $(this).parent().remove();
    });
    return method;
}());

getTableau = function() {
    return parent.parent.tableau;
};

getCurrentViz = function() {
    return getTableau().VizManager.getVizs()[0];
};

getCurrentWorksheet = function() {
    return getCurrentViz().getWorkbook().getActiveSheet().getWorksheets()[0];
};

getCurrentWorkbook = function() {
  return getCurrentViz().getWorkbook();
};

errorWrapped = function(context, fn) {
    return function() {
        var args, err, error;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        try {
            return fn.apply(null, args);
        } catch (error) {
            err = error;
            return console.error("Got error during '", context, "' : ", err);
        }
    };
};


function getFilter(e) {
    console.log(e.getFieldName());
    worksheet = e.getWorksheet();
    //console.log(e[0].getFilterType());

    worksheet.getFiltersAsync().then(
        function(filters) {
            $.each(filters, function(i, filter) {
                console.log(i + ': ' + filter.getFilterType() + ': ' + filter.getFieldName());
                if (filter.getFieldName() === 'ObjectID|Name') {
                    console.log(filter.getAppliedValues()[0].value);
                    filterArray = filter.getAppliedValues()[0].value.split('|');
                    getCurrentWorkbook().changeParameterValueAsync('Primary Object ID', filterArray[0]);
                }
            });
        },
        function(err) {
            alert("Whoops");
        }
    );
}

function getParam() {
    getCurrentWorkbook().getParametersAsync().then(
        function(params) {
            criteria = params.get('Exception Criteria').getCurrentValue().value; //get exception criteria
            console.log(criteria);
        },
        function(err) { //not able to access parameters
            alert("Whoops");
        }
    );

}


function getMarks(e) {
    worksheet = e.getWorksheet();
    console.log(worksheet.getName());
    if (worksheet.getName() === 'Selection Sheet') {
        e.getMarksAsync().then(function(m) {
            $.each(m, function(i, mark) {
                var alertOutput = "selectedMarks:\n";

                getCurrentWorkbook().getParametersAsync().then(
                    function(params) {
                        sign = params.get('Default Sign:').getCurrentValue().value; //get default sign
                        console.log(sign);
                        // Each Mark has Pairs
                        $.each(mark.getPairs(), function(j, pair) {
                            alertOutput = alertOutput + "  " + (pair.fieldName) + ": " + pair.value;
                        });
                        alertOutput = alertOutput + "\n";
                        console.log(alertOutput);

                        metricName = mark.getPairs().get("METRIC_NAME").value;
                        mean = Math.round(mark.getPairs().get("AVG(Mean)").value * 1000) / 1000;
                        newMetric = '[' + metricName + ']' + sign + mean + ';';

                        criteria = params.get('Exception Criteria').getCurrentValue().value; //get exception criteria
                        console.log('Updating Criteria: ' + criteria + newMetric);
                        getCurrentWorkbook().changeParameterValueAsync('Exception Criteria', criteria + newMetric);
                    },
                    function(err) { //not able to access parameters
                        alert("Whoops");
                    }
                );

            });

        });
    } else if (worksheet.getName() === 'Clear Button') {
        e.getMarksAsync().then(function(m) {
            console.log('Mark Count ' + m.length);
            if (m.length > 0) {
                getCurrentWorkbook().changeParameterValueAsync('Exception Criteria', '');
            }
        });
    } else if (worksheet.getName() === 'Edit Button') {
        //activeWorkbook.changeParameterValueAsync('Exception Criteria', 'edit button');
        e.getMarksAsync().then(function(m) {
            console.log('Mark Count ' + m.length);
            if (m.length > 0) {

                getCurrentWorkbook().getParametersAsync().then(
                    function(params) {
                        criteria = params.get('Exception Criteria').getCurrentValue().value; //get exception criteria
                        criteriaArray = criteria.substring(0, criteria.length - 1).split(';');

                        var list = '<table id="myTable"><tr><td class="crit">' + criteriaArray.join('<td class="del">X</td></td></tr><tr><td class="crit">') + '<td class="del">X</td></td></tr></table>';
                        console.log('modal open clicked');
                        modal.open({
                            content: list
                        });
                        
                    },
                    function(err) { //not able to access parameters
                        alert("Whoops");
                    }
                );
            }
        });

    }
}
initApp = function() {
    var tableau;
    tableau = getTableau();
    console.log('version 2.12');

    getCurrentViz().addEventListener("marksSelection", getMarks);
    getCurrentViz().addEventListener(tableau.TableauEventName.FILTER_CHANGE, getFilter);
    console.log('test ready 2');
    console.log(parent.parent.parent.document.getElementsByClassName('tb-fill')[0])
    parent.parent.parent.document.getElementsByClassName('tb-fill')[0].append($overlay, $modal);
    
    //$('body').append($overlay, $modal);
    //return getCurrentViz().addEventListener(tableau.TableauEventName.MARKS_SELECTION, updateChart);
};		

this.appApi = {
    init: initApp
};