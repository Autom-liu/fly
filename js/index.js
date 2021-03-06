
 $(function(){
    var ModeLevel = {
        level: 0,
        possibilityStep: 0,

        getBackground: function(){
            return ['url(image/bg_1.jpg)','url(image/bg_2.jpg)','url(image/bg_3.jpg)','url(image/bg_4.jpg)'][this.level];
        },
        getShotSpeed: function(){
            return [200,50,400,20][this.level];
        },
        getBulletSpeed: function(){
            return [-8,-10,-3,-10][this.level];
        },
        getEnemyCreateSpeed: function(){
            return [800,100,200,50][this.level];
        },
        getEnemyMoveSpeed: function(){
            return parseInt([Math.random()+1,Math.random()*4+2,Math.random()*2+2,Math.random()*6+4][this.level]);
        },
        getBossHP: function(){
            return [5,15,5,20][this.level];
        },
        getBossPossiblity: function(){
            return Math.min([0.001,0.01,0.01,0.1][this.level] + this.possibilityStep,0.5);
        },
        getBulletMode: function(){
            return [true,true,true,false][this.level];
        },
        getBossMoveSpeed: function(){
            return [2,4,2,5][this.level];
        },
        reset: function(){this.possibilityStep=0;}
    };

    var Scores = {
        score : 0,

        addPoint: function(){this.score++;return this;},
        addmaxPoint: function(){this.score += 20;return this;},
        subPoint: function(){this.score--;return this;},
        submaxPoint: function(){this.score -=20;return this;},
        display: function(){$(topScore).html(this.score);},
        clearPoint: function(){this.score = 0;},
        getPoint: function(){return this.score;},
        getRankText: function() {return ['菜的抠脚','初级驾机员','初级飞机师','高级老司机','职业老司机','打飞机专家','打飞机王者'][this.getRank()]},
        getRank: function(){
            switch (true){
                case this.score <= 10: return 0;
                case this.score > 10 && this.score <= 100: return 1;
                case this.score > 100 && this.score <= 200: return 2;
                case this.score > 200 && this.score <= 400: return 3;
                case this.score > 400 && this.score <= 600: return 4;
                case this.score > 600 && this.score <= 1000: return 5;
                default: return 6;
            }
        }
    }

    var GameMananger = {
        started : false,
        overed: false,
        pointStep: 1,
        stopbg : true,
        collisionTimer1 : 0,
        initScene: function(){
            $(scene).html('');
            $(end).addClass('hide');
            $(topScore).addClass('hide');
            $(begin).removeClass('hide');
            Scores.clearPoint();
            Scores.display();
        },
        switchStartStatus: function(){
            this.started = !this.started;
        },
        switchOverStatus: function(){
            this.overed = !this.overed;
        },
        collisionToEnemy: function(enemy,bullet){
            bullet&&bullet.stop();
            if(!enemy.subHP()){
                enemy.stop().boom();
                enemy.boss?Scores.addmaxPoint().display() :Scores.addPoint().display();
                Scores.score > 50*this.pointStep && (ModeLevel.possibilityStep += 0.005,this.pointStep++);
            }
            
        },
        collisionToMyteam: function(enemy){
            this.overed = true;
            document.removeEventListener('mousemove',planeMove);
            clearInterval(this.collisionTimer1);
            this.endShow();
        },
        disappearanceEnemy: function(ele){
            ele.clear();
            !this.overed && (ele.boss?Scores.submaxPoint().display():Scores.subPoint().display());
        },
        collisionCheckGobal :function (){
            for(var i=bulletCollection.length-1;i>=0;i--) 
            {
                var bullet = bulletCollection[i],
                    bleft = bullet.getPosition().left,
                    btop = bullet.getPosition().top,
                    bwidth = bullet.width,
                    bheight = bullet.height;
                for(var j=enemyCollection.length-1;j>=0;j--)
                {
                    var ele = enemyCollection[j];
                    if(ele.isalive&& btop<ele.getPosition().top+ele.height && btop+bheight >ele.getPosition().top && bleft<ele.getPosition().left+ele.width && bleft+bwidth>ele.getPosition().left ){
                        GameMananger.collisionToEnemy(ele,bullet);
                        break;
                    }
                }
            }
        },
        endShow: function(){
            $(end).removeClass('hide');
            $(score).text(Scores.getPoint());
            $(rank).text(Scores.getRankText());
            restart.addEventListener('click',this.restartGame.bind(this));
        },
        bgMove: function(step){
            var curPos = 0;
            requestAnimationFrame(bgMotion.bind(this));
            function bgMotion(){
                if(this.started){
                    curPos+= step;
                    $(scene).css('background-position-y',curPos);
                    requestAnimationFrame(bgMotion.bind(this));
                }else{
                    scene.setAttribute('style','');
                }
            }
        },
        restartGame: function(){
            this.initScene();
            this.started = false;
            removeEventListener('click',this.restartGame);
        },
        startGame: function(){
            this.started = true;
            this.overed = false;
            this.startScene();
            enemyCollection = [];
            bulletCollection = [];
            ModeLevel.reset();
            document.addEventListener('mousemove',planeMove);
            shot();
            createEnemy();
            this.collisionTimer1 =  setInterval(this.collisionCheckGobal,50);
        },
        startScene: function(){
            $(begin).addClass('hide');
            $(topScore).removeClass('hide');
            $(scene).css({display: 'block',backgroundImage: ModeLevel.getBackground()}).append(MyTeam.createPlane());
            MyTeam.setPosition(event.clientX-outerLeft,event.clientY-outerTop);
            this.bgMove(2);    
        }

    }

    var MyTeam = {
        myPlane: null,
        width: 50,
        height: 50,
        createPlane: function(width,height){
            width = width || 50;
            height = height || 50;
            var imgPlane = new Image();
            imgPlane.src = 'image/plane_0.png';
            imgPlane.alt = '我军飞机';
            imgPlane.width = width;
            imgPlane.height = height;
            this.width = width;
            this.height = height;
            this.myPlane = imgPlane;
            $(this.myPlane).addClass('myplane');
            return imgPlane;
        },
        setPosition: function(left,top){
            $(this.myPlane).css({left: left-this.width/2 + 'px',top: top-this.height/2 + 'px'});
        },
        getPosition: function(){
            return {left: this.myPlane.offsetLeft+this.width/2,top:this.myPlane.offsetTop}
        }
    }

    function Bullet(left,top,width,height){
            width = width || 30;
            height = height || 30;
            var mybullet = new Image();
            mybullet.src = 'image/fire.png';
            mybullet.alt = '我军子弹';
            mybullet.width = width;
            mybullet.height = height;
            this.stopped = false;
            this.width = width;
            this.height = height;
            this.mybullet = mybullet;
            $(this.mybullet).css({left:left-width/2 + 'px',top:top-height + 'px'});
            $(this.mybullet).addClass('bullet');
            bulletCollection.push(this);
    }

    Bullet.prototype = {
        constructor: Bullet,
        run: function(){
            var top = this.mybullet.offsetTop;
            //this.collisionCheck();
            if(top > -this.height && !this.stopped){
                top += ModeLevel.getBulletSpeed();
                $(this.mybullet).css('top',top + 'px');
                requestAnimationFrame(this.run.bind(this));
            }else{
                this.clear();
            }
        },
        stop: function(){
            this.stopped = ModeLevel.getBulletMode();
            return this;
        },
        getPosition: function(){
            return {left : this.mybullet.offsetLeft,top: this.mybullet.offsetTop};
        },
        clear:  function(){
            this.mybullet.remove();
            bulletCollection = bulletCollection.filter((value)=> {return value != this});
        },
        collisionCheck: function(){
            var ret = false,
                bleft = this.getPosition().left,
                btop = this.getPosition().top,
                bwidth = this.width,
                bheight = this.height;
                for(var i=0;i<enemyCollection.length;i++){
                    var ele = enemyCollection[i];
                    if(btop<ele.getPosition().top+ele.height && btop+bheight >ele.getPosition().top && bleft<ele.getPosition().left+ele.width && bleft+bwidth>ele.getPosition().left ){
                        //this.stop();
                        GameMananger.collisionToEnemy(ele,this);
                        return;
                    }
                }
            }
        
    }

    function Enemy(left,top,speed,boss,width,height){
        this.boss = boss;
        width = width || 30;
        height = height || 30;
        var enemy = new Image();
        enemy.src = boss? 'image/enemy_big.png' :'image/enemy_small.png';
        enemy.alt = '敌军飞机';
        enemy.width = width;
        enemy.height = height;
        this.isalive = true;
        this.hp = boss? ModeLevel.getBossHP() : 1;
        this.speed = speed;
        this.width = width;
        this.height = height;
        this.enemy = enemy;
        $(this.enemy).css({left:left-width/2 + 'px',top:top-height +'px' });
        $(this.enemy).addClass('enemy');
        enemyCollection.push(this);
    }


	Enemy.prototype = {
		constructor: Enemy,
		run: function(){
            var top = this.enemy.offsetTop;
            !GameMananger.overed && this.collisionCheck();
			if(top < height && this.isalive){
				top += this.speed;
				$(this.enemy).css('top',top + 'px');
                requestAnimationFrame(this.run.bind(this));
			}else{
                this.isalive&&GameMananger.disappearanceEnemy(this);
			}
		},

		clear: function(){
            this.enemy.remove();
            enemyCollection = enemyCollection.filter((value)=> {return value != this});
        },
        getPosition: function(){
            return {left : this.enemy.offsetLeft,top: this.enemy.offsetTop};
        },
        boom: function(){
            var src = this.boss? 'image/boom_big.png': 'image/boom_small.png';
            this.enemy.src = src ;
            fadeTo.call(this.enemy,500,0.2,(function(){this.clear();}).bind(this))

        },
        stop: function(){
            this.isalive = false;
            return this;
        },
        collisionCheck: function(){
            if (this.isalive){
                var eleft = this.getPosition().left;
                etop = this.getPosition().top;
                myLeft = MyTeam.myPlane.offsetLeft;
                myTop = MyTeam.myPlane.offsetTop;
                mywidth = MyTeam.width;
                myheight = MyTeam.height;
                if(etop<myTop+myheight && etop+this.height >myTop && eleft<myLeft+mywidth && eleft+this.width>myLeft ){
                    GameMananger.collisionToMyteam(this);
                }
            }
            
        },
        subHP: function(){return --this.hp;}
	}

    var wrap = document.getElementsByClassName('wrap')[0],
        begin = wrap.getElementsByClassName('begin')[0],
        scene = wrap .getElementsByClassName('scene')[0],
        btnMode = wrap.getElementsByClassName('btn-mode')[0],
        end = wrap .getElementsByClassName('end')[0],
        score = end.querySelector('.score-show span'),
        rank = end.querySelector('.rank-show span'),
        restart = end.querySelector('.restart'),
        topScore = document.getElementById('score'),
        width = wrap.clientWidth,
        height = wrap.clientHeight;
        outerLeft = parseInt((document.body.clientWidth - width)/2),
        outerTop = parseInt(getComputedStyle(wrap).borderTopWidth) + parseInt(getComputedStyle(wrap).marginTop),
        enemyCollection = [],
        bulletCollection = [],

        btnMode.addEventListener('click',startGame,false);

        function startGame(event){
            Array.prototype.forEach.call(this.children,function(ele,index){
                if(event.target === ele){
                    ModeLevel.level = index;
                    GameMananger.startGame();
                }
            })
                
        }

        function planeMove(event){
            var left = event.clientX-outerLeft,
                top = event.clientY-outerTop;
                left = Math.max(Math.min(left,width),0);
                top = Math.max(Math.min(top,height),0);
            MyTeam.setPosition(left,top);
        }

        function shot(){
            var bullet = new Bullet(MyTeam.getPosition().left,MyTeam.getPosition().top);
            $(scene).append(bullet.mybullet);
            requestAnimationFrame(bullet.run.bind(bullet));
            !GameMananger.overed && setTimeout(shot,ModeLevel.getShotSpeed());
        }

        function createEnemy(){
            var enemy = parsePossiblity(ModeLevel.getBossPossiblity())? 
            new Enemy(parseInt(Math.random()*width),0,ModeLevel.getBossMoveSpeed(),true,70,70) 
            : new Enemy(parseInt(Math.random()*width),0,ModeLevel.getEnemyMoveSpeed(),false);
            $(scene).append(enemy.enemy);
            enemy.run();
            !GameMananger.overed && setTimeout(createEnemy,ModeLevel.getEnemyCreateSpeed());
        }

        function parsePossiblity(p){
            return Math.random() < p;
        }

        function fadeTo(duration,target,callback){
            var step = (target-1)/duration * 20,
                opc = getComputedStyle(this).opacity*1,
                that = $(this);
            requestAnimationFrame(function fade(){
                if( Math.abs(target-opc) > Math.abs(step) ){
                    opc += step;
                    that.css('opacity',opc);
                    requestAnimationFrame(fade);
                }else{
                    callback();
                }
            });
        }

 })

 

