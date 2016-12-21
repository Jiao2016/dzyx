$(function(){
   function Game(main,scorele,stateele,lifeele){
     this.main=main; 
     this.mainWidth=main.offsetWidth;
     this.mainHeight=main.offsetHeight;
     this.scorele=scorele;
     this.stateele=stateele;
     this.lifeele=lifeele;
   }
  Game.prototype={
      _init:function(){
       this.obj={};//信息对象
       this.kaiguan1=true;
       this.speed=5;
       this.scor=0;
       this.state=1;
       this.num=3;
       this.life=3;
       this.scor=0;
       this.scorele.innerHTML=this.scor;
       this.lifeele.innerHTML=this.life;
       this.stateele.innerHTML=this.state;
      },
   	  start:function(){
         this._init();
   	  	 if(this.kaiguan1){
   	  	 for (var i = 0; i <this.num; i++) {
   	  	 	this._createLetter();
   	  	 };
   	  	 this._move();
   	  	 }
   	  },
      _createLetter:function(){
        var newletter=document.createElement("div");
        do{
        var randomleft=Math.random()*(this.mainWidth-80);
        }while(this._checkleft(randomleft))
        var randomtop=Math.random()*-200;
        newletter.style.cssText="width:80px;height:80px;position:absolute;left:"+randomleft+"px;top:"+randomtop+"px;";
        do{
        var randomnum=Math.floor(Math.random()*26+65);
        var character=String.fromCharCode(randomnum);
       }while(this.obj[character])
        newletter.innerHTML="<img width='80' height='80' src='images/images/"+character+".png'>"
        this.main.appendChild(newletter)
        this.obj[character]={left:randomleft,top:randomtop,el:newletter};
      },
      _move:function(){
      	 var that=this;
         this._keydown()
         this.st=setInterval(function(){
            for(i in that.obj){
              var data=that.obj[i];
              var oldtop=data.top;
              var newtop=oldtop+that.speed;
              data.top=newtop;
              data.el.style.top=newtop+"px";
              if(data.top>that.mainHeight){
                  that.life--;
                  that.lifeele.innerHTML=that.life;
                  if(that.life<=0){
                     that._end()
                  }
              }
            }
         },60)
      },
      stop:function(){
      	 clearInterval(this.st);
         document.onkeydown=null;
      },
      _checkleft:function(newleft){
         for(i in this.obj){
           var data=this.obj[i];
           if(newleft>data.left-80&&newleft<data.left+80){
             return true;
           }
         }
      },
      _pass:function(){
        this.state++;
        this.main.innerHTML="";
        alert("恭喜过关，接下来进入第"+this.state+"关");
        this.stateele.innerHTML=this.state;
        this.obj={};
       if(this.state<=3){
        this.num++;
       }else{
        this.speed+=2;
        }
       for (var i = 0; i < this.num; i++) {
        	this._createLetter(); 
       };
      },
      _keydown:function(){
      	 var that=this;
         document.onkeydown=function(e){
          var ev=e||window.event;
          var kc=ev.keyCode;
          var nowchar=String.fromCharCode(kc);
          if(that.obj[nowchar]){
           that.main.removeChild(that.obj[nowchar].el);
           delete that.obj[nowchar];
           that._createLetter()
           that.scor++;
           that.scorele.innerHTML=that.scor;
           if(that.scor%10==0){
            that._pass()
           }
          }
         }  
      },
      _end:function(){
      	this.main.innerHTML=""
      	this.stop();
      	this.kaiguan1=true;
      	alert("游戏结束");
      }
   }
   var main=$(".main")[0];
   var startbtn=$(".start")[0];
   var scor=$(".scor")[0];
   var state=$(".state")[0];
   var life=$(".life")[0];
   var stop=$(".stop")[0];
   var end=$(".end")[0];
   var newgame=new Game(main,scor,state,life);
   startbtn.onclick=function(){
   	 newgame.start();
   }
   var flag=true;
   stop.onclick=function(){
   	 if(flag){
   	 	flag=false;
   	 newgame.stop()
   	 this.innerHTML="继续"
   	 }else{
   	 	flag=true;
   	 newgame._move();
   	 this.innerHTML="暂停" 	
   	 }
   }
   end.onclick=function(){
   	if(flag){
   	 newgame._end()
   	 }
   }
}) 
