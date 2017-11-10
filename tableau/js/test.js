const modal = new Object();

modal.center = function(){
    var top, left;
	var body = document.body,
		html = document.documentElement;

	var m = document.getElementById('modal');

	var width = window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;

	var height = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;

 
    m.setAttribute("style","position: absolute; background:url(tint20.png) 0 0 repeat; background:rgba(0,0,0,0.2); border-radius:14px; padding:8px;");
	top = Math.max(height - m.offsetHeight, 0) / 2;
    left = Math.max(width - m.offsetWidth, 0) / 2;
	m.style.top = top;
    m.style.left = left;

};

modal.open = function(settings) {
    var m = document.getElementById('modal');
    var o = document.getElementById('overlay');
	var c = document.getElementById('content');
	var a = document.getElementById('close');

	a.setAttribute("onclick","modal.close()");

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
		crit[i].setAttribute("onclick","critClick(this)");
	}

	var del = c.getElementsByClassName("del");
	for(var i=0;i<del.length;i++){
		del[i].setAttribute("onclick","delClick(this)");
	}

	modal.center();
    m.style.display = 'block';
};

modal.close = function() {
	console.log('closed!')
	var m = document.getElementById('modal');
    var o = document.getElementById('overlay');

    o.style.display = 'none';
	m.style.display = 'none';
};

critClick = function(item) {
	if (item.innerText != '') {
		txt = item.innerText;
		item.innerText = '';
		item.innerHTML = '<input onkeypress="inputKey(event,this)" size="60" value="' + txt + '"></input>';
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
		  background:url(close.png) 0 0 no-repeat;
		  width:24px;
		  max-width:100%;
		  height:27px;
		  display:block;
		  text-indent:-9999px;
		  top:-7px;
		  right:-7px;
		}
		`;

	var style = document.createElement('style');

	if (style.styleSheet) {
	    style.styleSheet.cssText = css;
	} else {
	    style.appendChild(document.createTextNode(css));
	}
	document.getElementsByTagName('head')[0].appendChild(style);

};

buttonClick = function() {
	criteriaArray = ['[Disk Write Rate (KBps)]>=705.508;','[Network Egress Packets per second]>=156.566;']

    var list = '<table style="font-family: Helvetica, sans-serif; white-space: nowrap;" id="myTable"><tr><td class="crit">' + criteriaArray.join('<td class="del">X</td></td></tr><tr><td class="crit">') + '<td class="del">X</td></td></tr></table>';
                        
    modal.open({
        content: list
    });
};

initApp = function() {

	setStyle();

	m = document.createElement('div');
	m.id = 'modal';
	m.innerHTML = '<p style="color:white; font-weight: bold; font-family: Helvetica, sans-serif;">Click criteria to edit:</p></div><div style="white-space: nowrap;" id="content"></div>'
	
	o = document.createElement('div');
	o.id = 'overlay';
	
	a = document.createElement('a');
	a.id = 'close';
	a.href = '#';
	//a.innerHTML = '<img src="close.png" height="24px" width="24px"/>';

	o.style.display = 'none';
	m.style.display = 'none';

	document.body.appendChild(o);
	document.body.appendChild(m);
	m.appendChild(a);

};		

this.appAPI = {
    init: initApp
};