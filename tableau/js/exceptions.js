const modal = new Object();

modal.center = function(){
    var top, left;
    var body = parent.parent.document.body,
        html = parent.parent.document.documentElement;

    var m = parent.parent.document.getElementById('modal');

    var width = parent.parent.window.innerWidth
        || parent.parent.document.documentElement.clientWidth
        || parent.parent.document.body.clientWidth;

    var height = parent.parent.window.innerHeight
        || parent.parent.document.documentElement.clientHeight
        || parent.parent.document.body.clientHeight;    

    m.setAttribute("style","position: absolute; background:url(tint20.png) 0 0 repeat; background:rgba(0,0,0,0.2); border-radius:14px; padding:8px;");

    top = Math.max(height - m.offsetHeight, 0) / 2;
    left = Math.max(width - m.offsetWidth, 0) / 2;  

    console.log(top,left,height,width,m.offsetHeight,m.offsetWidth);
    m.style.top = top + 'px';
    m.style.left = left + 'px';
    
};

modal.open = function(settings) {
    var m = parent.parent.document.getElementById('modal');
    var o = parent.parent.document.getElementById('overlay');
    var c = parent.parent.document.getElementById('content');
    var a = parent.parent.document.getElementById('close');

    a.setAttribute("onclick","document.getElementsByTagName('iframe')[0].contentDocument.getElementsByTagName('iframe')[1].contentWindow.closeModal()");

    c.innerHTML = settings.content;
    c.setAttribute("style","border-radius:8px; background:#fff; padding:20px;");
    
    o.setAttribute("style","position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; opacity: 0.5; filter: alpha(opacity=50);");

    var r = c.getElementsByTagName("tr");
    for(var i=0;i<r.length;i++){
        r[i].setAttribute("style","width: auto; background: #d1e0e0; color: black; list-style-type: none; border-style: solid; border-color: #fff; border-spacing: 5px 5px; padding:22px; height: 30px;");
    }

    var d = c.getElementsByTagName("td");
    for(var i=0;i<d.length;i++){
        d[i].setAttribute("style","padding:5px;");
    }

    var crit = c.getElementsByClassName("crit");
    for(var i=0;i<crit.length;i++){
        crit[i].setAttribute("onclick","document.getElementsByTagName('iframe')[0].contentDocument.getElementsByTagName('iframe')[1].contentWindow.critClick(this)");
    }

    var del = c.getElementsByClassName("del");
    for(var i=0;i<del.length;i++){
        del[i].setAttribute("onclick","document.getElementsByTagName('iframe')[0].contentDocument.getElementsByTagName('iframe')[1].contentWindow.delClick(this)");
    }

    modal.center();
    m.style.display = 'block';
};

closeModal = function() {
    var m = parent.parent.document.getElementById('modal');
    var o = parent.parent.document.getElementById('overlay');
    var c = parent.parent.document.getElementById('content');

    o.style.display = 'none';
    m.style.display = 'none';

    var inpt = c.getElementsByTagName("input");
    for(var i=0;i<inpt.length;i++){
        txt = inpt[i].value;
        r = inpt[i].parentNode;
        r.removeChild(inpt[i]);
        r.innerText = txt;
    }

    var newinput = ''
    var crit = c.getElementsByClassName("crit");
    for(var i=0;i<crit.length;i++){
        newinput += crit[i].innerText + ';';
    }

    console.log('Updating Criteria: ' + newinput);
    getCurrentWorkbook().changeParameterValueAsync('Exception Criteria', newinput);
};

critClick = function(item) {
    if (item.innerText != '') {
        txt = item.innerText;
        item.innerText = '';
        item.innerHTML = '<input onkeypress="document.getElementsByTagName(&apos;iframe&apos;)[0].contentDocument.getElementsByTagName(&apos;iframe&apos;)[1].contentWindow.inputKey(event,this)" size="60" value="' + txt + '"></input>';
    };
};

delClick = function(item) {
    r = item.parentNode;
    r.parentNode.removeChild(r);
}

inputKey = function(k,item) {
    if(k.keyCode === 13) {
        console.log('enter!');
        txt = item.value;
        r = item.parentNode;
        r.removeChild(item);
        r.innerText = txt;

    };
};

setStyle = function(){
    var css = `
        .del {
          cursor: pointer;
          background: #d1e0e0;
          color: black;
        }
        .del:hover {
          cursor: pointer;
          background: red;
          color: white;
        }
        #close {
          position:absolute;
          background:url(https://ugamarkj.github.io/tableau/close.png) 0 0 no-repeat;
          width:24px;
          max-width:100%;
          height:27px;
          display:block;
          text-indent:-9999px;
          top:-7px;
          right:-7px;
          cursor: pointer;
        }
        `;

    var style = document.createElement('style');

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    parent.parent.document.getElementsByTagName('head')[0].appendChild(style);

};

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
            console.log(m.length);
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
    console.log('version 2.13');

    getCurrentViz().addEventListener("marksSelection", getMarks);
    getCurrentViz().addEventListener(tableau.TableauEventName.FILTER_CHANGE, getFilter);
    
    setStyle();

    m = document.createElement('div');
    m.id = 'modal';
    m.innerHTML = '<p style="color:white; font-weight: bold; font-family: Helvetica, sans-serif;">Click criteria to edit:</p></div><div style="white-space: nowrap;" id="content"></div>'
    
    o = document.createElement('div');
    o.id = 'overlay';
    
    a = document.createElement('div');
    a.innerText = "x";
    a.id = 'close';
    a.href = '';
    m.appendChild(a);

    o.style.display = 'none';
    m.style.display = 'none';

    parent.parent.document.body.appendChild(o);
    parent.parent.document.body.appendChild(m);
    
};		

this.appApi = {
    init: initApp
};