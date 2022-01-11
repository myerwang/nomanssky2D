Class.$("NoMansSky",{
	_constructor : function (opt) {
		var me = this;
		this._jsAdd();
		this.opt = opt;
		this.canvasTag = document.getElementById(this.opt.canvasId);
		this.canvasGame = this.canvasTag.getContext("2d"); 	
		this.welcome = "The noMansSky2d By Tiesec.org";
		
		this.canvasX = (window.screen.width - me.opt.gameGlobal.CANVAS.WIDTH) / 2;
		this.canvasY = (window.screen.height - me.opt.gameGlobal.CANVAS.HEIGHT) / 2; 
	 	this.direction = {left:false,top:false,right:false,bottom:false};

	 	this.beSelectStar = "";
	 	this.transitionTitle = "[点我进行随机跃迁]";
	 	this.isTransition = false;
	 	this.transitionSpeed = 1;

	 	this.transitionD = 0;
	 	this.stystem = 0;
	 	this.starClickEvents = [];
	 	this.starColors = [
	 		{
		 		c1 : "#A69697",
		 		c2 : "#A69697"
	 		},
	 		{
		 		c1 : "#c4bbac",
		 		c2 : "#c4bbac"
	 		},
	 		{
		 		c1 : "#78b1e8",
		 		c2 : "#78b1e8"
	 		},
	 		{
		 		c1 : "#cec9b6",
		 		c2 : "#cec9b6"
	 		},
	 		{
		 		c1 : "#c0a48e",
		 		c2 : "#c0a48e"
	 		},
	 		{
		 		c1 : "#f7f9e3",
		 		c2 : "#f7f9e3"
	 		},
	 		{
		 		c1 : "#a7e1e5",
		 		c2 : "#a7e1e5"
	 		},
	 		{
		 		c1 : "#0661b2",
		 		c2 : "#0661b2"
	 		},
	 	]
		this.Map = {
			width : 2400 ,
			height : 1800 ,
			camera : {
				x : 0 ,
				y : 0 
			},
			area : [
				{
					x : -800,
					y : -600 
				},
				{
					x : 0,
					y : -600
				},
				{
					x : 800,
					y : -600
				},
				{
					x : -800,
					y : 0 
				},
				{
					x : 0,
					y : 0
				},
				{
					x : 800,
					y : 0
				},
				{
					x : -800,
					y : 600 
				},
				{
					x : 0,
					y : 600
				},
				{
					x : 800,
					y : 600
				}
			]
		}
		this.canvasTag.style.cursor = "crosshair";
		if ( window.localStorage.noMansSky == undefined ){ 

			this.SEED = Math.getRandomNum( Math.pow(2,1) , Math.pow(2,50) ); 
			this.SEEDX = Number(String(this.SEED).substring( 1 , (String(this.SEED).length/2 + 1) ));
			this.SEEDY = Number(String(this.SEED).substring( (String(this.SEED).length/2) , String(this.SEED).length ));
			this.universeSeed = this.SEED;
			this.welcomeCount = 0;

		} else { 

			var loNoMansSky = JSON.parse(window.localStorage.noMansSky);
			this.SEED = loNoMansSky.SEED;
			this.SEEDX = loNoMansSky.SEEDX;  
			this.SEEDY = loNoMansSky.SEEDY;  
			this.universeSeed = this.SEED;
        	this.Map.camera.x = loNoMansSky.cameraX;
        	this.Map.camera.y = loNoMansSky.cameraY; 
        	this.welcomeCount = loNoMansSky.welcomeCount; 

		}
 		
		this._hookMousemove(); 
		this._hookWindowClose();
		this._hookMouseDown();

        //按键监听
        document.addEventListener('keydown',function(e) { 
        	if ( me.stystem == 0 && me.isTransition == false ) {
	            switch(e.keyCode){ 
	                case 87: // 上
	                    me.direction.top = true; 
	                    break;
	                case 83: // 下
	                    me.direction.bottom = true; 
	                    break;
	                case 65: // 左
	                    me.direction.left = true; 
	                    break;
	                case 68: // 右
	                   me.direction.right = true; 
	                    break;
	                default :
	                break;
	            } 
        	}
        },false);
        //释放
        document.addEventListener('keyup',function(e){

            switch(e.keyCode){ 
                case 87: // 上
                    me.direction.top = false;
                    break;
                case 83: // 下
                    me.direction.bottom = false;
                    break;
                case 65: // 左
                    me.direction.left = false;
                    break;
                case 68: // 右
                   me.direction.right = false;
                    break;
                default :
                break;
            }
        }); 
        var time = 0;
 		//不断重绘游戏。
        setInterval(function(){
        	me.canvasGame.clearRect(0,0,me.opt.gameGlobal.CANVAS.WIDTH,me.opt.gameGlobal.CANVAS.HEIGHT);
        	
        	if ( me.welcomeCount < 120 ) {
        		me._writeText(me.welcome ,"","",250,200);
        		me.welcomeCount++;
        	}else{
        	
        	if ( me.isTransition == true ) {  
        		me.transitionSpeed+=0.1;
        		switch ( me.transitionD ){
        			case 0:
        				me.Map.camera.x = me.Map.camera.x - me.transitionSpeed;
        				break;
        			case 1:
        				me.Map.camera.y = me.Map.camera.y - me.transitionSpeed;
        				break;
        			case 2:
        				me.Map.camera.x = me.Map.camera.x + me.transitionSpeed;
        				break;
        			case 3:
        				me.Map.camera.y = me.Map.camera.y + me.transitionSpeed;
        			break;
        		}
        	}

            //镜头移动
            if (me.direction.left && me.direction.top){ //左上 

                me.Map.camera.x = me.Map.camera.x - me.opt.gameGlobal.GAME.CAMERA_SPEED;
                me.Map.camera.y = me.Map.camera.y - me.opt.gameGlobal.GAME.CAMERA_SPEED;

            }else if (me.direction.left && me.direction.bottom){ //左下 
                
                me.Map.camera.x = me.Map.camera.x - me.opt.gameGlobal.GAME.CAMERA_SPEED;
                me.Map.camera.y = me.Map.camera.y + me.opt.gameGlobal.GAME.CAMERA_SPEED;
                
            }else if (me.direction.right && me.direction.top){ //右上 
                
                me.Map.camera.x = me.Map.camera.x + me.opt.gameGlobal.GAME.CAMERA_SPEED;
                me.Map.camera.y = me.Map.camera.y - me.opt.gameGlobal.GAME.CAMERA_SPEED;
                
            }else if (me.direction.right && me.direction.bottom){ //右下 
                
                me.Map.camera.x = me.Map.camera.x + me.opt.gameGlobal.GAME.CAMERA_SPEED;
                me.Map.camera.y = me.Map.camera.y + me.opt.gameGlobal.GAME.CAMERA_SPEED;
                
            }else if(me.direction.left){  
                me.Map.camera.x = me.Map.camera.x - me.opt.gameGlobal.GAME.CAMERA_SPEED;
            }  
            else if(me.direction.top){  
                me.Map.camera.y = me.Map.camera.y - me.opt.gameGlobal.GAME.CAMERA_SPEED;
            }  
            else if(me.direction.right){  
                me.Map.camera.x = me.Map.camera.x + me.opt.gameGlobal.GAME.CAMERA_SPEED;
            }  
            else if(me.direction.bottom){  
                me.Map.camera.y = me.Map.camera.y + me.opt.gameGlobal.GAME.CAMERA_SPEED;
            }


        	//绘制鼠标坐标
        	if ( me.opt.gameGlobal.GAME.SHOW_MOUSE_COORDINATE ) {
				me._writeText("mouse's X:" + (me.mX) ,"","",10,20);
			    me._writeText("mouse's Y:" + (me.mY) ,"","",10,40);
        	}

        	//绘制中心镜头坐标
        	if ( me.opt.gameGlobal.GAME.SHOW_CAMERA_COORDINATE ) {
				me._writeText("camera's X : " + me.Map.camera.x  ,"","",10,100);
				me._writeText("camera's Y : " + me.Map.camera.y  ,"","",10,120);
        	}

        	if ( me.stystem == 0 ) { //星图系统
		        	if ( me.Map.camera.x >= 800 ){ 
		        		me.Map.camera.x = 0;
		        		//me.Map.camera.y = 0;
		        		me.SEEDX++; 
		        	}
		        	if ( me.Map.camera.x <= -800 ){
		        		me.pianchaX = me.Map.camera.x;
		        		me.pianchaY = me.Map.camera.y;
		        		me.Map.camera.x = 0;
		        		//me.Map.camera.y = 0;
		        		me.SEEDX--; 
		        	}
		        	if ( me.Map.camera.y >= 600 ){
		        		me.pianchaX = me.Map.camera.x;
		        		me.pianchaY = me.Map.camera.y;
		        		//me.Map.camera.x = 0;
		        		me.Map.camera.y = 0;
		        		me.SEEDY++; 
		        	}
		        	if ( me.Map.camera.y <= -600 ){
		        		me.pianchaX = me.Map.camera.x;
		        		me.pianchaY = me.Map.camera.y;
		        		//me.Map.camera.x = 0;
		        		me.Map.camera.y = 0;
		        		me.SEEDY--; 
		        	}

       				//绘制随机跃迁按钮 
        			me._writeText(me.transitionTitle ,"","",650,20); 

		        	//绘制恒星点(核心星图系统)
		        	me.starClickEvents = [];
		        	for ( var j = 0; j < 9 ; j++ ) {
						switch( j ){
							case 0 :
			                  var tsX = me.SEEDX;
			                  var tsY = me.SEEDY;
			                  tsX--;
			                  tsY--;
			                  me.SEED = Number( String(tsX) + String(tsY) );
							  break;
							case 1 :
			                  var tsX = me.SEEDX;
			                  var tsY = me.SEEDY; 
			                  tsY--;
			                  me.SEED = Number( String(tsX) + String(tsY) );
							 break;
							case 2 : 
			                  var tsX = me.SEEDX;
			                  var tsY = me.SEEDY; 
			                  tsX++;
			                  tsY--;
			                  me.SEED = Number( String(tsX) + String(tsY) );
							 break;
							case 3 :
			                  var tsX = me.SEEDX;
			                  var tsY = me.SEEDY; 
			                  tsX--;
			                  me.SEED = Number( String(tsX) + String(tsY) );
							 break;
							case 4 :
			                  var tsX = me.SEEDX;
			                  var tsY = me.SEEDY; 
			                  me.SEED = Number( String(tsX) + String(tsY) );
							 break;
							case 5 :
			                  var tsX = me.SEEDX;
			                  var tsY = me.SEEDY; 
			                  tsX++; 
			                  me.SEED = Number( String(tsX) + String(tsY) );
							 break;
							case 6 :
			                  var tsX = me.SEEDX;
			                  var tsY = me.SEEDY; 
			                  tsX--;
			                  tsY++;
			                  me.SEED = Number( String(tsX) + String(tsY) );
							 break;
							case 7 : 
			                  var tsX = me.SEEDX;
			                  var tsY = me.SEEDY; 
			                  tsY++;
			                  me.SEED = Number( String(tsX) + String(tsY) );
							 break;
							case 8 : 
			                  var tsX = me.SEEDX;
			                  var tsY = me.SEEDY; 
			                  tsX++;
			                  tsY++;
			                  me.SEED = Number( String(tsX) + String(tsY) );
							 break; 
			                default :
			                break;
						}
						me.universeSeed = me.SEED; 
						for ( var i = 0; i < 150; i++ ) { 
							var seedNum = Math.seededRandom();
							var tStar = me._getStarCoordinates(seedNum); 
							var tStarX = tStar.x;
							var tStarY = tStar.y; 
							var finalStartX = me.Map.area[j].x - me.Map.camera.x + tStarX;
							var finalStartY = me.Map.area[j].y - me.Map.camera.y + tStarY;
							
							me._drawPoint(i, 150 , finalStartX, finalStartY, me._getStarColor(seedNum).color );
							//me._writeText("("+ finalStartX +","+ finalStartY +")","","",finalStartX,finalStartY);
							//console.log(finalStartX);
							me.starClickEvents.push({x : finalStartX, y : finalStartY , seedNum : seedNum }); 
						}
						
		        	}
		        	//绘制宇宙种子坐标
		        	if ( me.opt.gameGlobal.GAME.SHOW_UNIVERSE_COORDINATE ) {
						me._writeText("universe's X : " + me.SEEDX ,"","",10,60);
						me._writeText("universe's Y : " + me.SEEDY ,"","",10,80);
		        	} 

		        	//绘制中心镜头坐标
		        	if ( me.opt.gameGlobal.GAME.SHOW_CAMERA_COORDINATE ) {
						me._writeText("camera's X : " + me.Map.camera.x  ,"","",10,100);
						me._writeText("camera's Y : " + me.Map.camera.y  ,"","",10,120);
		        	}

		        	//显示选中的星球
		        	if ( me.beSelectStar != "" ) {
						me._writeText("星系名字 : " + me.beSelectStar ,"","",10,140); 
		        	}
		    }
		    if ( me.stystem == 1 ){ //恒星系统
		    	me._writeText("恒星名字：" + me.beSelectStar + " (点我返回星图)","","",250,20);
		    	me._drawStarBall(- me.Map.camera.x  , -me.Map.camera.y  , me.galaxy.stellarMass ,0, "#f00","#f90",me.buall1Time); 
		    	var trackR = me.galaxy.stellarMass * 1;
		    	for (var n = me.galaxy.planets.length - 1; n >= 1; n--) { 
			 		me.galaxy.planets[n].time+=1;
			 		trackR = trackR + ( (me.galaxy.planets[n-1].quality + me.galaxy.planets[n].quality) *3) ;
			 		me._drawTrack( -me.Map.camera.x  + 400 ,  -me.Map.camera.y + 300 , trackR );
		    		me._drawStarBall(- me.Map.camera.x, -me.Map.camera.y - ( trackR ), me.galaxy.planets[n].quality,me.galaxy.planets[n].speed,me.galaxy.planets[n].color1,me.galaxy.planets[n].color2,me.galaxy.planets[n].time);
		    	}
		    }
		}
        },(1000 / this.opt.gameGlobal.GAME.FRAMES));

	},
	_hookMouseDown : function(){
        var me = this;
        me.canvasTag.addEventListener('mousedown',function(e) { 
     		var e = event || window.event;
			var mX = e.offsetX ;
			var mY = e.offsetY ;
			me._saveData();
			if ( me.stystem == 0 && me.isTransition == false ) {
				for (var i = 0; i < me.starClickEvents.length - 1; i++) {
					//console.log(me.starClickEvents[i]);
					if ( Math.abs(mY - me.starClickEvents[i].y) <= 1 && Math.abs(mX - me.starClickEvents[i].x) <= 1 ) {  
						me.beSelectStar = me._getStarName(me.starClickEvents[i].seedNum).name + "(双击进入恒星系统)"; 
						break;
					}
				}
			}
			if ( me.stystem == 1 && me.isTransition == false ) {
				if ( mX >= 250 && mX <= 600 &&
					 mY <= 20 && mX >= 1 
					) {  
					me.stystem = 0; 
				}
			}
			if ( me.isTransition == false && me.stystem == 0 ) { 
				if ( mX >= 650 && mX <= 800 &&
					 mY <= 20 && mX >= 1 
					) { 
					me.transitionSpeed = 1;
					me.transitionTitle = "[再点我暂停跃迁]";
					me.transitionD = Math.floor(Math.unSeededRandom(me.universeSeed)*4);
					me.isTransition = true;
				}
			} else if( me.stystem == 0 ){
				if ( mX >= 650 && mX <= 800 &&
					 mY <= 20 && mX >= 1 
					) {    
					me.transitionTitle = "[点我进行随机跃迁]";
					me.isTransition = false;
				}
			}
        },false);
        me.canvasTag.addEventListener('dblclick',function(e) { 
     		var e = event || window.event;
			var mX = e.offsetX ;
			var mY = e.offsetY ;
			for (var i = 0; i < me.starClickEvents.length - 1; i++) {
				if ( Math.abs(mY - me.starClickEvents[i].y) <= 6 && Math.abs(mX - me.starClickEvents[i].x) <= 6 ) {  
					 me.beSelectStar = me._getStarName(me.starClickEvents[i].seedNum).name ;
					 //console.log(me.starClickEvents[i].seedNum);
					 me._getGalaxy(me.starClickEvents[i].seedNum);
					 me.stystem = 1;
					 me.Map.camera.x = 0;
		    		 me.Map.camera.y = 0;
		    		 me.buall1Time = 0;
		    		 break;
				}
			}
        },false);
	},
	_saveData : function(){
		var me = this;
		if ( me.SEEDX != undefined ){
			var noMansSky = {
				SEED : me.SEED,
				SEEDX :me.SEEDX ,
				SEEDY : me.SEEDY ,
				cameraX : me.Map.camera.x,
				cameraY : me.Map.camera.y,
				welcomeCount : me.welcomeCount
			};
			window.localStorage.noMansSky = JSON.stringify(noMansSky);
		}
	},
	_hookWindowClose : function (){ 
		var me = this;
		var onbeforeunload_handler = function (){
			var noMansSky = {
				SEED : me.SEED,
				SEEDX :me.SEEDX ,
				SEEDY : me.SEEDY ,
				cameraX : me.Map.camera.x,
				cameraY : me.Map.camera.y,
				welcomeCount : me.welcomeCount
			};
			window.localStorage.noMansSky = JSON.stringify(noMansSky);
		}
		window.onbeforeunload = onbeforeunload_handler;
	},
	_hookMousemove : function () {
		var me = this;  
        this.canvasTag.addEventListener('mousemove',function(e) { 
     		var e = event || window.event;
			me.mX = e.offsetX ;
			me.mY = e.offsetY ;  
        },false);
	},
	_writeText : function(str,style,color,x,y) {
		var me = this;
		if(this.canvasGame){
		    //设置字体样式
		    this.canvasGame.font = ( !style ) ? "15px Consolas" : style; 
		    this.canvasGame.fillStyle = ( !color ) ? "#fff" : color;
		    //从坐标点开始绘制文字
		    this.canvasGame.fillText(str, x, y);
		}
	},
	_drawPoint : function (i,count,pointX,pointY,color){
		if(this.canvasGame){
			this.canvasGame.save(); 
                this.canvasGame.beginPath(); 
				var gradient = this.canvasGame.createRadialGradient(pointX, pointY, 0, pointX, pointY, ((i/count) * 10 )/ 2);  
				gradient.addColorStop(0.9, "rgb("+ color.toString() +")"); 
				gradient.addColorStop(0.9, "white");
				gradient.addColorStop(0.1, "rgb("+ color.toString() +")");  
				//gradient.addColorStop(0.99, "white"); 
				this.canvasGame.fillStyle = gradient;
				if (this.isTransition)this.canvasGame.scale(i/count,i/count);
				//this.canvasGame.fillStyle = "#fff";
				this.canvasGame.arc(pointX, pointY, ((i/count) * 10 )/ 2, Math.PI*2, false);
				this.canvasGame.fill();
            this.canvasGame.restore();
        }
	},
 	_drawStarBall(x,y,radius,cycle,sColor,eColor,time){
	    //画出星球需要哪些属性 
	    //创建一个渐变色空变量
	    var me = this;
	    var color = null;
		    //公共周期
	    this.canvasGame.save(); 
	        //设置旋转角度
	        this.canvasGame.translate( -me.Map.camera.x + 400  ,  -me.Map.camera.y + 300);
	        this.canvasGame.beginPath(); 
	        this.canvasGame.rotate(time*360/cycle*Math.PI/180); 
	        this.canvasGame.arc(x,y,radius,0,Math.PI*2,false);
	        this.canvasGame.closePath();
	        var color = this.canvasGame.createRadialGradient(x,y,0,x,y,radius);
	        color.addColorStop(0,sColor);
	        color.addColorStop(1,eColor);
	        this.canvasGame.fillStyle = color;
	        this.canvasGame.fill();
        this.canvasGame.restore();
	}, 
	_drawTrack : function(pointX,pointY,trackDis){
		var me = this;
		if(me.canvasGame) {
		    this.canvasGame.save(); 
		    	me.canvasGame.translate( - me.Map.camera.x ,  -me.Map.camera.y  );
		    	me.canvasGame.beginPath();
		    	//me.canvasGame.rotate(-10*Math.PI/180);
		    	me.canvasGame.arc(pointX,pointY,trackDis,0,Math.PI*2,false);
		        me.canvasGame.closePath();
		        me.canvasGame.strokeStyle="#574976";
		        me.canvasGame.stroke();
		    this.canvasGame.restore();
	    }
	},
	_getStarCoordinates : function (seed){
		var me = this;
		var tSeed = String(seed).replace("0.","");
		var tSeedCenterNum = tSeed[tSeed.length / 2];
		var maxX = me.opt.gameGlobal.CANVAS.WIDTH;
		var maxY = me.opt.gameGlobal.CANVAS.HEIGHT;
		var seed2 = Math.seededRandom(Math.pow(seed,seed/100));
		return { x: Math.floor(seed*maxX) , y : Math.floor(seed2*maxY) };
	},
	_getStarColor : function(seed){
		var color = [];
		for (var i = 1; i < 4; i++) {
			color.push( Math.floor(Math.seededRandom(Math.pow(seed,seed/100))*255) ); //万能算法
		}
		return { color : color };
	},
	_getStarName : function(seed){
		var name = "";
		var seedStr = String(seed).replace("0.","");
		for (var i = 0; i < seedStr.length - 1; i++) {
			name = name + String.fromCharCode(97 + Number(seedStr[i]));
		}
		return { name : name };
	},
	_getGalaxy : function(seed){
		var me = this;
		var stellarMass = Math.floor( Math.unSeededRandom( (seed*seed)*1000 )*30 );
		if ( stellarMass <= 0 ){
			stellarMass = 2;
		}
		var trackNum = Math.ceil(stellarMass / ((seed)*5) ); //行星数量、轨道数算法
		if ( stellarMass == trackNum ){
			trackNum = trackNum * 0.66 ;
		}
		var planets = []; //恒星质量、公转速度、颜色算法
		for (var i = 1; i < trackNum + 2; i++) {
			var tColor = {
				c1 : '#'+('00000'+(Math.unSeededRandom( Math.pow(stellarMass,i) )*0x1000000<<0).toString(16)).slice(-6),
				c2 : '#'+('00000'+(Math.unSeededRandom( Math.pow(stellarMass,i) )*0x1000000<<0).toString(16)).slice(-6)
			}
			planets.push({
			 	quality: Math.floor( Math.unSeededRandom( Math.pow(seed,i)*(i*100) )*(stellarMass) ) + 2, //行星质量算法
			 	speed :  Math.floor(Math.unSeededRandom( seed*(i*1000) )*10000 ) , //行星公转速度算法
			 	color1 : tColor.c1, //行星颜色算法
			 	color2 : tColor.c2, //行星颜色算法
			 	time : 0
			});
		}
		me.galaxy = {
			stellarMass : stellarMass,
			track : trackNum,
			planets : planets
		};
		//console.log(me.galaxy);
		return me.galaxy;
	},
	_jsAdd : function(){
		var me = this;
		window.Math.getRandomNum = function (Min ,Max) {
			var Range = Max - Min;   
			var Rand = Math.random();   
			return(Min + Math.round(Rand * Range));   
		}
		window.Math.seededRandom = function (max, min) {
		    max = max || 1;
		    min = min || 0;
		    me.universeSeed = (me.universeSeed * 9301 + 49297) % 233280233280;
		    var rnd = me.universeSeed / 233280233280.0;
		    return min + rnd * (max - min);
		};
		window.Math.unSeededRandom = function (seed, max, min) {
		    max = max || 1;
		    min = min || 0;
		    var tSeed = (seed * 9301 + 49297) % 233280;
		    var rnd = tSeed / 233280.0;
		    return min + rnd * (max - min);
		};
		String.prototype.replaceAll = function(str , replaceKey , replaceVal){
		  var reg = new RegExp(replaceKey , 'g');//g就是代表全部
		  return str.replace(reg , replaceVal || '');
		}
	},
	appoint : function(x,y){
		var me = this;
        me.Map.camera.x = 0;
        me.Map.camera.y = 0;
		me.SEEDX = x;
		me.SEEDY = y;
	}
});

