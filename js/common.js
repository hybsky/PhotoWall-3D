var _g_path='/';

Array.prototype.indexOf=function (w)
{
	for(var i=0;i<this.length;i++)if(this[i]==w)return i;
	return -1;
};

Array.prototype.remove=function (w)
{
	var n=this.indexOf(w);
	if(n!=-1)this.splice(n,1);
};

function setStyle(obj, json)
{
	if(obj.length)
		for(var i=0;i<obj.length;i++) setStyle(obj[i], json);
	else
	{
		if(arguments.length==2)
			for(var i in json) obj.style[i]=json[i];
		else
			obj.style[arguments[1]]=arguments[2];
	}
}

function setStyle3(obj, name, value)
{
	obj.style['Webkit'+name.charAt(0).toUpperCase()+name.substring(1)]=value;
	obj.style['Moz'+name.charAt(0).toUpperCase()+name.substring(1)]=value;
	obj.style['ms'+name.charAt(0).toUpperCase()+name.substring(1)]=value;
	obj.style['O'+name.charAt(0).toUpperCase()+name.substring(1)]=value;
	obj.style[name]=value;
}

function getByClass(oParent, sClass)
{
	var aEle=oParent.getElementsByTagName('*');
	var re=new RegExp('\\b'+sClass+'\\b', 'i');
	var aResult=[];
	
	for(var i=0;i<aEle.length;i++)
	{
		if(re.test(aEle[i].className))
		{
			aResult.push(aEle[i]);
		}
	}
	
	return aResult;
}

function bindEvent(obj, ev, fn)
{
	obj.addEventListener?obj.addEventListener(ev, fn, false):obj.attachEvent('on'+ev, fn);
}
function unbindEvent(obj, ev, fn)
{
	obj.removeEventListener?obj.removeEventListener(ev, fn, false):obj.detachEvent('on'+ev, fn);
}

//cookie
function setCookie(name, value, iDay)
{
	if(iDay!==false)
	{
		var oDate=new Date();
		oDate.setDate(oDate.getDate()+iDay);
		
		document.cookie=name+'='+value+';expires='+oDate;
	}
	else
	{
		document.cookie=name+'='+value;
	}
}

function getCookie(name)
{
	var arr=document.cookie.split('; ');
	var i=0;
	
	for(i=0;i<arr.length;i++)
	{
		var arr2=arr[i].split('=');
		
		if(arr2[0]==name)
		{
			return arr2[1];
		}
	}
	
	return '';
}

function removeCookie(name)
{
	setCookie(name, 'a', -1);
}

function sprintf(format)
{
	var _arguments=arguments;
	
	return format.replace(/%\d+/g, function (str){
		return _arguments[parseInt(str.substring(1))];
	});
}

//公共函数
Array.prototype.indexOf=function (vItem)
{
	for(var i=0;i<this.length;i++)if(this[i]===vItem)return i;
	return -1;
};

Array.prototype.append=function (aAny)
{
	for(var i=0,len=aAny.length;i<len;i++)
		this.push(aAny[i]);
	
	return this;
};

function onLoad(fn)
{
	var old=window.onload;
	window.onload=function ()
	{
		old && old();
		fn();
	};
}

function getEle(sExp, oParent)
{
	var aResult=[];
	var i=0;
	
	oParent || (oParent=document);
	
	if(oParent instanceof Array)
	{
		for(i=0;i<oParent.length;i++)aResult=aResult.concat(getEle(sExp, oParent[i]));
	}
	else if(typeof sExp=='object')
	{
		if(sExp instanceof Array)
		{
			return sExp;
		}
		else
		{
			return [sExp];
		}
	}
	else
	{
		//xxx, xxx, xxx
		if(/,/.test(sExp))
		{
			var arr=sExp.split(/,+/);
			for(i=0;i<arr.length;i++)aResult=aResult.concat(getEle(arr[i], oParent));
		}
		//xxx xxx xxx 或者 xxx>xxx>xxx
		else if(/[ >]/.test(sExp))
		{
			var aParent=[];
			var aChild=[];
			
			var arr=sExp.split(/[ >]+/);
			
			aChild=[oParent];
			
			for(i=0;i<arr.length;i++)
			{
				aParent=aChild;
				aChild=[];
				for(j=0;j<aParent.length;j++)
				{
					aChild=aChild.concat(getEle(arr[i], aParent[j]));
				}
			}
			
			aResult=aChild;
		}
		//#xxx .xxx xxx
		else
		{
			switch(sExp.charAt(0))
			{
				case '#':
					return [document.getElementById(sExp.substring(1))];
				case '.':
					return getByClass(oParent, sExp.substring(1));
				default:
					return [].append(oParent.getElementsByTagName(sExp));
			}
		}
	}

	return aResult;
}

function map(arr, fn)
{
	for(var i=0;i<arr.length;i++)
	{
		fn.call(arr[i], i);
	}
}

function rnd(n, m)
{
	return Math.random()*(m-n)+n;
}

//ajax、表单之类的
function json2url(json)
{
	var a=[];
	for(var i in json)
	{
		var v=json[i]+'';
		v=v.replace(/\n/g, '<br/>');
		v=encodeURIComponent(v);
		a.push(i+'='+v);
	}
	return a.join('&');
}

function ajax(url, opt)
{
	if(!opt)opt={};
	
	var oAjax=window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
	
	if(opt.data)opt.data.t=new Date().getTime();
	
	if(opt.method=='post')
	{
		oAjax.open('POST', url, true);
		oAjax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		oAjax.send(opt.data?json2url(opt.data):null);
	}
	else
	{
		if(opt.data)
		{
			opt.data.t=new Date().getTime();
			url+='?'+json2url(opt.data);
		}
		oAjax.open('GET', url, true);
		oAjax.send();
	}
	
	oAjax.onreadystatechange=function ()
	{
		if(oAjax.readyState==4)
		{
			if(oAjax.status==200)
			{
				if(opt.fnSucc)	opt.fnSucc(oAjax.responseText);
			}
			else
			{
				if(opt.fnFaild)	opt.fnFaild(oAjax.status);
			}
		}
	};
}

function request(url, data, fnSucc, fnFaild)
{
	ajax(url, {
		data: data,
		fnSucc: function (str){
			//alert(str);
			//document.write(str);
			//document.getElementsByTagName('textarea')[0].value=str;
			var json=eval('('+str+')');
			
			if(json.error)
				fnFaild&&fnFaild(json.desc);
			else
				fnSucc&&fnSucc(json);
		},
		fnFaild: function (str){
			fnFaild('网络错误：'+str+'|'+url);
		}
	});
}

function time2date(t)
{
	function d(n){return n<10?'0'+n:''+n;}
	
	var oDate=new Date(t*1000);
	
	return oDate.getFullYear()+'-'+d(oDate.getMonth()+1)+'-'+d(oDate.getDate())+' '+d(oDate.getHours())+':'+d(oDate.getMinutes())+':'+d(oDate.getSeconds());
}

function preloadImgs(arr, fnSucc, fnFaild, fnProgress)
{
	var loaded=0;
	for(var i=0;i<arr.length;i++)
	{
		var oImg=new Image();
		
		oImg.onload=function ()
		{
			loaded++;
			
			fnProgress&&fnProgress(100*loaded/arr.length);
			
			if(loaded==arr.length)fnSucc&&fnSucc();
			
			this.onload=this.onerror=null;
			this.src='';
		};
		
		oImg.onerror=function ()
		{
			fnFaild&&fnFaild(this.src);
			
			fnFaild=fnSucc=fnProgress=null;
		};
		
		oImg.src=arr[i];
	}
}

//拖拽
function drag(objEv, objMove, fnMoveCallBack)
{
	var disX=0,disY=0;
	
	objEv.onmousedown=function (ev)
	{
		var oEvent=ev||event;
		disX=(document.documentElement.scrollLeft||document.body.scrollLeft)+oEvent.clientX-objMove.offsetLeft;
		disY=(document.documentElement.scrollTop||document.body.scrollTop)+oEvent.clientY-objMove.offsetTop;
		
		if(objEv.setCapture)
		{
			objEv.onmousemove=fnMove;
			objEv.onmouseup=fnUp;
			
			objEv.setCapture();
		}
		else
		{
			document.onmousemove=fnMove;
			document.onmouseup=fnUp;
			
			return false;
		}
	};
	
	function fnMove(ev)
	{
		var oEvent=ev||event;
		var l=(document.documentElement.scrollLeft||document.body.scrollLeft)+oEvent.clientX-disX;
		var t=(document.documentElement.scrollTop||document.body.scrollTop)+oEvent.clientY-disY;
		
		fnMoveCallBack(l,t);
	}
	
	function fnUp()
	{
		this.onmousemove=null;
		this.onmouseup=null;
		
		if(this.releaseCapture)this.releaseCapture();
	}
}

function mouseScroll(obj, fnCallBack)
{
	bindEvent(obj, 'mousewheel', fnScroll);
	bindEvent(obj, 'DOMMouseScroll', fnScroll);
	
	function fnScroll(ev)
	{
		var oEvent=ev||event;
		var bDown;
		
		if(oEvent.wheelDelta)
		{
			bDown=oEvent.wheelDelta<0;
		}
		else
		{
			bDown=oEvent.detail>0;
		}
		
		fnCallBack(bDown);
		
		if(oEvent.preventDefault)oEvent.preventDefault();
		return false;
	}
}

function format(str, json)
{
	str=str.replace(/{\w+}/g, function (str){
		var s=str.substring(1, str.length-1);
		
		return json[s];
	});
	
	return str;
}















