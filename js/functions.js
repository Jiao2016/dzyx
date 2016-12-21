//1. 兼容性的通过类名获取元素
	// context 获取的范围
	function getClass(classname,context){
		context=context||document;
		if (document.getElementsByClassName) {
			return context.getElementsByClassName(classname);
		}else{
			var all=context.getElementsByTagName("*");
			var arr=[];
			for (var i = 0;i<all.length;i++) {
				if(check(all[i].className,classname)){
					arr.push(all[i]);
				}
			}
			return arr;
		}
	}
//2.判断在一个长字符串当中，是否包含一个短字符串
	function check(lstr,str){
		var arr=lstr.split(" ");
		for (var i = 0;i<arr.length ;i++) {
			if (arr[i]==str) {
				return true;
			}
		}
		return false;
	}

//3.兼容性的获取或者设置元素的内容
	// 第一个参数ele 表示要操作的元素
	// 第二个参数 表示要设置的内容，如果是获取则不用传递
	function text(ele,text){
		if (text!=undefined) {
			if (document.getElementsByClassName) {
				ele.textContent=text;
			}else{
				ele.innerText=text;
			}
		}else{
			if (document.getElementsByClassName) {
				return ele.textContent;
			}else{
				return ele.innerText;
			}
		}
	}
//4.兼容性的获取某一个元素的样式
	// ele 要获取样式的元素
	// attr 要获取的具体样式
	function getStyle(ele,attr){
		if (window.getComputedStyle) {
			return window.getComputedStyle(ele,null)[attr];
		}else{
			return ele.currentStyle[attr];
		}
	}
//5.动画函数(匀速)
	// obj 要进行动画的对象
	// attrobj 属性以及目标值对象
	// dur 持续时间
	// callback 回调函数
	// function animate(obj,attrobj,dur,callback){
	// 	var speed={};
	// 	dur=dur||500;
	// 	for(var i in attrobj){
	// 		var old=getStyle(obj,i);
	// 		old=parseInt(old);
	// 		speed[i]=(attrobj[i]-old)*60/dur;
	// 	}
	// 	var time=0;
	// 	obj.t=setInterval(function(){
	// 		for(var i in attrobj){
	// 			var now=parseFloat(getStyle(obj,i))
	// 			now+=speed[i];
	// 			obj.style[i]=now+"px";
	// 		}
	// 		time+=60;
	// 		if(time>=dur){
	// 			clearInterval(obj.t);
	// 			for (var i in attrobj) {
	// 				obj.style[i]=attrobj[i]+"px";
	// 			}
	// 			if (callback) {
	// 				callback();
	// 			};
	// 		}
	// 	},60)
	// }
//6.将三种获取方式合并（ID、标签、类名）
	function $(selector,context){
		context=context||document;
		// 正则(开始和)
		if(typeof selector=="string"){
			selector=selector.replace(/^\s|\s+$/g,"")
			if (selector.charAt(0)==".") {
				return getClass(selector.slice(1),context)
			}else if(selector.charAt(0)=="#"){
				return document.getElementById(selector.slice(1));
			}else{
				return context.getElementsByTagName(selector);
			}
		}else if(typeof selector=="function"){
			addEvent(window,"load",selector)
			// window.onload=selector;
		}
	}
// 只获取一个元素的所有元素子节点
function getChildren(obj){
	var arr=obj.childNodes;
	var newarr=[];
	for (var i = 0;i<arr.length;i++) {
		if(arr[i].nodeType==1){
			newarr.push(arr[i]);
		}
	}
	return newarr;
}
// 获取第一个元素
function getFirst(obj){
	return getChildren(obj)[0]
}
// 获取最后一个元素
function getLast(obj){
	var arr=getChildren(obj);
	return arr[arr.length-1];
}
// 获取下一个元素
function getNext(obj){
	var next=obj.nextSibling;
	if(next==null){
		return null;
	}
	while(next.nodeType!=1){
		next=next.nextSibling;
		if(next==null){
			return null;
		}
	}
	return next;
}
// 获取上一个元素
function getPrev(obj){
	var prev=obj.previousSibling;
	if(prev==null){
		return null;
	}
	while(prev.nodeType!=1){
		prev=prev.previousSibling;
		if(prev==null){
			return null;
		}
	}
	return prev;
}

function border(obj){
	var divarr=[];
	for (var i = 0;i<4;i++) {
		var div=document.createElement("div");
		div.style.cssText="position: absolute;background:#000;";
		obj.appendChild(div);
		divarr.push(div);
	}
	divarr[0].style.cssText+="width:0;height:1px;left:-1px;top:-1px;";
	divarr[1].style.cssText+="width:1px;height:0;left:-1px;top:-1px;";
	divarr[2].style.cssText+="width:0;height:1px;right:-1px;bottom:-1px;";
	divarr[3].style.cssText+="width:1px;height:0;right:-1px;bottom:-1px;";

	var borderitemwidth=parseInt(getStyle(obj,"width"))+2;
	var borderitemheight=parseInt(getStyle(obj,"height"))+2;

	obj.onmouseover=function(){
		animate(divarr[0],{width:borderitemwidth},800);
		animate(divarr[1],{height:borderitemheight},800);
		animate(divarr[2],{width:borderitemwidth},800);
		animate(divarr[3],{height:borderitemheight},800);
	}

	obj.onmouseout=function(){
		animate(divarr[0],{width:0},800);
		animate(divarr[1],{height:0},800);
		animate(divarr[2],{width:0},800);
		animate(divarr[3],{height:0},800);
	}
}
//兼容的获取可视窗口对象
function getWindow(){
	document.documentElement.scrollTop=1;
	if (document.documentElement.scrollTop==1) {
		return document.documentElement;
	}else{
		return document.body;
	}
} 
//获取某一个元素的文档坐标
function getPosition(obj){
	var left=obj.offsetLeft;
	var top=obj.offsetTop;
	var parent=obj.parentNode;
	while(parent.nodeName!="BODY"){
		if (getStyle(parent,"Position")=="absolute"||getStyle(parent,"Position")=="relative") {
			left+=parent.offsetLeft+parseInt(getStyle(parent,"borderLeftWidth"))
			top+=parent.offsetTop+parseInt(getStyle(parent,"borderTopWidth"))
		};
		parent=parent.parentNode;
	}
	return {x:left,y:top}
}
// 兼容性事件监听
// 参数1 事件源
// 参数2 事件名称
// 参数3 事件处理程序
function addEvent(obj,event,handler){
	if (obj.addEventListener) {
		obj.addEventListener(event,handler,false)
	}else{
		obj.attachEvent("on"+event,handler)
	}
}
function removeEvent(obj,event,handler){
	if (obj.addEventListener) {
		obj.removeEventListener(event,handler,false)
	}else{
		obj.detachEvent("on"+event,handler)
	}
}

// 给对象添加滚轮事件的函数
// obj 要添加事件的对象
// upfun 向上滚动触发的回调函数
// downfun 向下滚动触发的回调函数
function mousewheel(obj,upfun,downfun){
	if(obj.addEventListener){
		obj.addEventListener("mousewheel",scrollfun,false);//谷歌和IE中
		obj.addEventListener("DOMMouseScroll",scrollfun,false)//火狐中
	}else{
		obj.attachEvent("onmousewheel",scrollfun)
	}
	function scrollfun(e){
		var ev=e||window.event;
		var dir=ev.detail||ev.wheelDelta;
		if (dir==-3||dir==120) {
			upfun.call(obj);
		}else if(dir==3||dir==-120){
			downfun.call(obj);
		}
	}
}
//15.hover函数消除事件流带来的影响
//判断某个元素是否包含有另外一个元素
function contains (parent,child) {
	if(parent.contains){
		return parent.contains(child) && parent!=child;
	}else{
		return (parent.compareDocumentPosition(child)===20);
	}
}

//判断鼠标是否真正的从外部移入，或者是真正的移出到外部；
function checkHover (e,target) {
	if(getEvent(e).type=="mouseover"){
		return !contains(target,getEvent(e).relatedTarget || getEvent(e).fromElement)&&
			!((getEvent(e).relatedTarget || getEvent(e).fromElement)===target)
	}else{
		return !contains(target,getEvent(e).relatedTarget || getEvent(e).toElement)&&
			!((getEvent(e).relatedTarget || getEvent(e).toElement)===target)
	}
}
//鼠标移入移出事件
/*
 obj   要操作的对象
 overfun   鼠标移入需要处理的函数
 outfun     鼠标移除需要处理的函数
 */
function hover (obj,overfun,outfun) {
	if(overfun){
		obj.onmouseover=function  (e) {
			if(checkHover(e,obj)){
				overfun.call(obj,[e]);
			}
		}
	}
	if(outfun){
		obj.onmouseout=function  (e) {
			if(checkHover(e,obj)){
				outfun.call(obj,[e]);
			}
		}
	}
}
function getEvent (e) {
	return e||window.event;
}
