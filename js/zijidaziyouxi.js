$(function(){
	function Game(main,scorele,stateele,lifeele){
		this.main=main;
		this.mainWidth=main.offsetWidth;
		this.obj={};//信息对象
		this.kaiguan1=true;
		this.speed=5;
		this.scor=0;
		this.scorele=scorele;
		this.state=1;
		this.stateele=stateele;
		this.num=3;
		this.mainHeight=main.offsetHeight;
		this.life=3;
		this.lifeele=lifeele;
	}
	Game.prototype={
		start:function(){//接口
			if (this.kaiguan1) {
				this.obj={};
				this._move();
				this._keydown();
				this.kaiguan1=false;
				for (var i = 0; i < this.num; i++) {
					this._createLetter();
				}
			};
		},
		_createLetter:function(){
			var newletter=document.createElement("div");
			do{//考虑框是否重叠
				var randomLeft=Math.random()*(this.mainWidth-80);
			}while(this._checkleft(randomLeft))
			var randomTop=-Math.random()*200;
			newletter.style.cssText="width:80px;height:80px;text-align:center;line-height:80px;font-size:30px;position:absolute;left:"+randomLeft+"px;top:"+randomTop+"px";
			do{//考虑内容是否重复
				var randomnum=Math.floor(Math.random()*26+65);
				var randomchar=String.fromCharCode(randomnum);
			}while(this.obj[randomchar])
			this.obj[randomchar]={left:randomLeft,top:randomTop,el:newletter};//el指每个div块
			newletter.innerHTML="<img width='80' height='80' src='images/images/"+randomchar+".png'>";
			this.main.appendChild(newletter);		
		},
		_move:function(){
			var that=this;
			this.st=setInterval(function(){//让每个div向下滑动
				for (var i in that.obj) {
					var oldtop=that.obj[i].top;
					var newtop=oldtop+that.speed;
					that.obj[i].top=newtop;
					that.obj[i].el.style.top=newtop+"px";
					if (newtop>that.mainHeight) {
						that.life--;
						that.lifeele.innerHTML=that.life;
						that.main.removeChild(that.obj[i].el);
						delete that.obj[i];
						that._createLetter();
						if (that.life<=0) {
							that._end();
						};
					};
				}
			},60)
		},
		_stop:function(){
			clearInterval(this.st);
			document.onkeydown=null;
		},
		_checkleft:function(newleft){//判断框是否重叠
			for (var i in this.obj) {
				var oldleft=this.obj[i].left;
				if (newleft<=(oldleft+80) && newleft>=(oldleft-80)) {
					return true;
				}
			};
			return false;
		},
		_pass:function(){
			this.state++;
			alert("恭喜过关，接下来进入第"+this.state+"关");
			this.stateele.innerHTML=this.state;
			this.main.innerHTML="";
			this.obj={};
			if (this.state<=3) {
				this.num++;
			}else{
				this.speed+=2;
			}
			for (var i = 0; i < this.num; i++) {
				this._createLetter();
			}
		},
		_keydown:function(){
			var that=this;
			document.onkeydown=function(e){
				var ev=e||window.event;
				var kc=ev.keyCode;
				var newletter=String.fromCharCode(kc);
				if (that.obj[newletter]) {
					that.main.removeChild(that.obj[newletter].el);
					delete that.obj[newletter];
					that._createLetter();
					that.scor++;
					that.scorele.innerHTML=that.scor;
					console.log(that.scorele.innerHTML)
					if (that.scor%10==0) {
						that._pass();
					}
				}
			}
		},
		_end:function(){
			this.main.innerHTML="";
			this._stop();
			this.kaiguan1=true;
			alert("游戏结束！");
			this.scor=0;
			this.scorele.innerHTML=this.scor;
			this.state=1;
			this.stateele.innerHTML=this.state;
			this.life=3;
			this.lifeele.innerHTML=this.life;
			this.num=3;
			this.speed=5;
		}
	}
	var main=$(".main")[0];
	var startbtn=$(".start")[0];
	var scor=$(".scor")[0];
	var state=$(".state")[0];
	var life=$(".life")[0];
	var stopbtn=$(".stop")[0];
	var endbtn=$(".end")[0];
	var newgame=new Game(main,scor,state,life);
	
	startbtn.onclick=function(){
		newgame.start();
	}
	var flag=true;
	stopbtn.onclick=function(){
		if (flag) {
			newgame._stop();
			this.innerHTML="继续";
			flag=false;
		}else{
			flag=true;
			newgame._move();
			this.innerHTML="暂停";
		}
	}
	endbtn.onclick=function(){
		if (flag) {
			newgame._end();
		};	
	}




})