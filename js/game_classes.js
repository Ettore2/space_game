function drawImage2(game,img, x, y, scale, rotation){
    //console.log(game);
    //console.log(game.ctx);
    //console.log(img);

    game.ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
    game.ctx.rotate(degreesToRads(-rotation));
    game.ctx.drawImage(img, -img.width / 2, -img.height / 2);
    game.ctx.setTransform(1,0,0,1,0,0);
}
function drawImage(game,img, x, y, rotation) {
    drawImage2(game, img, x, y, 4, rotation);

}
function getVectRad(x,y){
    return Math.atan2(y,x);
}
function getVectDeg(x,y){
    return radsToDegrees(Math.atan2(y,x));
}
function degreesToRads (deg){
    return (deg * Math.PI) / 180.0;
}
function radsToDegrees (deg){
    return (deg * 180.0) / Math.PI;
}
export function arrayRemove(arr, value) {
    for(let i = 0; i < arr.length; i++){
        if(arr[i] === value){
            arr.splice(i, 1);
            return
        }
    }

}

const IMGS_DIR = "../sprites/";
export const SESSION_SPACESHIP_ID = "session_spaceship_id"
export const SESSION_GAME_MODE_ID = "session_game_mode_id"
export const SESSION_MODIFIERS_IDS = "session_modifiers_ids"



export class GameInstance {
    static STATE_PLAY = 1;
    static STATE_PAUSE = 0;
    static STATE_LOST = 2;
    static PIXELS_NUMBER = 2400;
    static ASTEROIDS_TURN_AROUND_SPACE = 600;
    static ASTEROIDS_SPAWN_SPACE = GameInstance.ASTEROIDS_TURN_AROUND_SPACE / 2;

    static MOD_ALWAYS_SHOOT = {
    name: "always shoot",
    img: "always_shoot_modifier.png"
};
    static MOD_CANT_SHOOT = {
    name: "can't shoot",
        img: "cant_shoot_modifier.png"
};
    static MOD_CANT_STOP = {
    name: "can't stop",
        img: "cant_stop_modifier.png"
};
    static MOD_FAST_ASTEROIDS = {
    name: "fast asteroids",
        img: "fast_asteroids_modifier.png"
};
    static MOD_BIG_ASTEROIDS = {
    name: "big asteroids",
        img: "big_asteroids_modifier.png"
};
    static MOD_STRONG_ASTEROIDS = {
    name: "strong asteroids",
        img: "strong_asteroids_modifier.png"
};
    static MOD_HO_HEALS = {
    name: "no heals",
        img: "no_heals_modifier.png"
};
    static MOD_RANDOM_SPACESHIP = {
    name: "random spaceship",
        img: "random_ship_modifier.png"
};

    static MODIFIERS = [
        this.MOD_ALWAYS_SHOOT,
        this.MOD_CANT_SHOOT,
        this.MOD_CANT_STOP,
        this.MOD_FAST_ASTEROIDS,
        this.MOD_BIG_ASTEROIDS,
        this.MOD_STRONG_ASTEROIDS,
        this.MOD_HO_HEALS,
        this.MOD_RANDOM_SPACESHIP
    ]

    static MOD_ALWAYS_SHOOT_ID = this.MODIFIERS.indexOf(this.MOD_ALWAYS_SHOOT);
    static MOD_CANT_SHOOT_ID = this.MODIFIERS.indexOf(this.MOD_CANT_SHOOT);
    static MOD_CANT_STOP_ID = this.MODIFIERS.indexOf(this.MOD_CANT_STOP);
    static MOD_FAST_ASTEROIDS_ID = this.MODIFIERS.indexOf(this.MOD_FAST_ASTEROIDS);
    static MOD_BIG_ASTEROIDS_ID = this.MODIFIERS.indexOf(this.MOD_BIG_ASTEROIDS);
    static MOD_STRONG_ASTEROIDS_ID = this.MODIFIERS.indexOf(this.MOD_STRONG_ASTEROIDS);
    static MOD_HO_HEALS_ID = this.MODIFIERS.indexOf(this.MOD_HO_HEALS);
    static MOD_RANDOM_SPACESHIP_ID = this.MODIFIERS.indexOf(this.MOD_RANDOM_SPACESHIP);



    /**
     @param {HTMLCanvasElement} canvas
     @param {int} delay
     @param {int} playerTypeId
     @param {int} gameModeId
     @param {[boolean]} modifiers
     @param {{}} elements
     */
    constructor(canvas,delay,playerTypeId,gameModeId,modifiers,elements) {
        this.canvas = canvas;
        this.delay = delay;
        this.elements = elements;
        this.elements.outOfScreenText.innerText=Player.OUTSIDE_THE_SCREEN_TIME+"";
        this.gameMode = GameMode.getGameMode(gameModeId,this);
        this.activeModifiers = modifiers;


        this.managedObjs = [];
        this.toAddObj = [];
        this.toRemoveObj = [];

        //set number of pixels
        canvas.width = GameInstance.PIXELS_NUMBER;
        canvas.height = GameInstance.PIXELS_NUMBER;

        this.ctx = canvas.getContext("2d");


        this.gameState = GameInstance.STATE_PLAY;


        this.player = new Player(playerTypeId,GameInstance.PIXELS_NUMBER/2,GameInstance.PIXELS_NUMBER/2,this);
        this.elements.healthImg.src = IMGS_DIR+this.player.stats.icon;
        this.managedObjs.push(this.player);
        this.elements.healthText.innerText = this.player.health+"";
        //this.managedObjs.push(AsteroidBlueprint.createAsteroid(0,0,200,200,this));
    }


    /**
     @param {GameObject} obj
     */
    addObj(obj){
        this.toAddObj.push(obj);
        //console.log(this.toAddObj.length);
        if(this.toRemoveObj.includes(obj)){
            arrayRemove(this.toRemoveObj,obj)
        }
    }
    removeObj(obj){
        this.toRemoveObj.push(obj)
        if(this.toAddObj.includes(obj)){
            arrayRemove(this.toAddObj,obj)
        }

    }
    doLoop() {
        //console.log("loop");
        //console.log(this.currAsteroids);
        switch (this.gameState){
            case GameInstance.STATE_PLAY:
                //console.log("STATE_PLAY");
                //console.log("managedObjs: "+this.managedObjs.length);
                //console.log(this.managedObjs);
                //console.log("toAddObj: "+this.toAddObj.length);

                this.gameMode.loop(this.delay);

                for(let i = this.managedObjs.length-1; i >= 0; i--){
                    this.managedObjs[i].logicUpdate(this.delay);
                }//logic updates

                for(let i = this.managedObjs.length-1; i > 0; i--){
                    for(let j = i-1; j >= 0; j--){
                        //console.log(this.managedObjs[i].collidingWith(this.managedObjs[j]))
                        if(this.managedObjs[i].collidingWith(this.managedObjs[j])){
                            this.managedObjs[i].recordeCollision(this.managedObjs[j]);
                            this.managedObjs[j].recordeCollision(this.managedObjs[i]);
                        }

                    }
                }//collisions check

                for(let i = this.managedObjs.length-1; i >= 0; i--){
                    this.managedObjs[i].collisionsResolve(this.delay);
                }//collisions resolve

                this.ctx.fillStyle = "#100225";
                this.ctx.fillRect(0, 0, GameInstance.PIXELS_NUMBER, GameInstance.PIXELS_NUMBER);
                //do a script that can draw stars?

                /*
                let img;
                img = new Image();
                img.src='sprites/player_0.png';
                drawImage(this,img,30,30,0);
                img = new Image();
                img.src='sprites/asteroid_mega_1.png';
                drawImage(this,img,100,100,0);
                img = new Image();
                img.src='sprites/asteroid_big_1.png';
                drawImage(this,img,100,30,0);
                img = new Image();
                img.src='sprites/asteroid_small_1.png';
                drawImage(this,img,30,100,0);*/

                for(let i = this.managedObjs.length-1; i >= 0; i--){
                    this.managedObjs[i].graphicUpdate(this.delay);
                }//draw


                //draw hearts?

                //program for spawning new obstacles


                for(let i = 0; i < this.toRemoveObj.length; i++){
                    if(this.managedObjs.includes(this.toRemoveObj[i],0)){
                        arrayRemove(this.managedObjs,this.toRemoveObj[i]);
                    }
                }//remove objs
                this.toRemoveObj = [];
                for(let i = 0; i < this.toAddObj.length; i++){
                    if(!this.managedObjs.includes(this.toAddObj[i],0)){
                        this.managedObjs.push(this.toAddObj[i]);
                    }
                }//add objs
                this.toAddObj = [];

                break;
            case GameInstance.STATE_PAUSE:
                break
            case GameInstance.STATE_LOST:
                break
        }

    }
}
export class GameObject {
    static DIR_STOP = 0;
    static DIR_UP = 1;
    static DIR_LEFT = 2;
    static DIR_DOWN = -GameObject.DIR_UP;
    static DIR_RIGHT = -GameObject.DIR_LEFT;
    static TAG = "generic game object";

    //constructors
    /**
     @param {int} health
     @param {float} x
     @param {float} y
     @param {float} rot
     @param {string} imageName
     @param {float} collRange
     @param {GameInstance} game
 */
    constructor(health, x, y,rot, imageName, collRange,game) {
        this.health = health;
        this.posX = x;
        this.posY = y;
        this.rot = rot
        this.image = imageName;
        this.collRange = collRange;
        this.game = game;
        this.tag = GameObject.TAG;
        this.isEnemy = false;
        this.timerInvincibility = 0;
        this.invincibilityTime = 0;
        this.blinkTime = 100;

        this.alive = true;
        this.velX = 0;
        this.velY = 0;
        this.velRot = 0;
        this.registeredCollisions = [];
    }


    //other methods
    /**
     @param {GameObject} obj
     @return boolean
     */
    collidingWith(obj){
        return Math.pow(this.collRange+obj.collRange,2) >= Math.pow(this.posX - obj.posX,2) + Math.pow(this.posY - obj.posY,2);
    }
    die(){
        if(this.alive){
            this.alive = false;
            this.game.removeObj(this);
        }

    }
    takeDamage(dmg){
        if(this.timerInvincibility <= 0 && dmg > 0){
            this.timerInvincibility = this.invincibilityTime;
            this.health -= dmg;
            if(this.health < 0){
                this.health = 0
            }
            if(this.health === 0){
                this.die();
            }
        }
    }
    isInsideTheScreen(){
        return this.posX > 0 && this.posX < GameInstance.PIXELS_NUMBER && this.posY > 0 && this.posY < GameInstance.PIXELS_NUMBER
    }
    normalizeRot(){
        this.rot = this.rot%360;
        if(this.rot < 0){
            this.rot = 360 + this.rot;
        }
    }


    //updates
    /**
     @param {int} deltaT
     */
    logicUpdate(deltaT){
        this.posX += this.velX
        this.posY += this.velY
        this.rot += this.velRot;
        this.normalizeRot();
        this.registeredCollisions = [];
        if(this.timerInvincibility > 0){
            this.timerInvincibility -= deltaT;
        }

    }//"initialize" tho obj at the start of a frame
    /**
     @param {GameObject} obj
     */
    recordeCollision(obj){
        this.registeredCollisions.push(obj);

    }//register the collisions
    /**
     @param {int} deltaT
     */
    collisionsResolve(deltaT){

        if(this.health <= 0){
            this.die();
        }
    }//"execute" the collisions registered
    /**
     @param {int} deltaT
     */
    graphicUpdate(deltaT) {
        if(this.timerInvincibility <= 0){
            drawImage(this.game,this.image,this.posX,this.posY,this.rot);
        }else{
            if((Math.floor(this.timerInvincibility/this.blinkTime))%2 === 1){
                drawImage(this.game,this.image,this.posX,this.posY,this.rot);
            }
        }
    }//draw the obj on canvas
}
export class AsteroidBlueprint extends GameObject{
    static TYPE_SMALL = 0;
    static TYPE_BIG = 1;
    static TYPE_MEGA = 2;
    static TAG = "asteroid";

    static stats =[
        [
            {
                children : 0,
                health : 2,
                name : "asteroid small",
                images : ["asteroid_small_1.png","asteroid_small_2.png","asteroid_small_3.png"],
                collider : 30,
                min_spawn_speed : 4,
                max_spawn_speed : 11,
                min_spawn_rot_speed : 1,
                max_spawn_rot_speed : 20,
                max_speed : 10,
                acc : 0
            },
            {
                children : 3,
                health : 6,
                name : "asteroid big",
                images : ["asteroid_big_1.png","asteroid_big_2.png","asteroid_big_3.png"],
                collider : 62,
                min_spawn_speed : 2,
                max_spawn_speed : 8,
                min_spawn_rot_speed : 1,
                max_spawn_rot_speed : 12,
                max_speed : 10,
                acc : 0
            },
            {
                children : 3,
                health : 10,
                name : "asteroid mega",
                images : ["asteroid_mega_1.png","asteroid_mega_2.png","asteroid_mega_3.png"],
                collider : 120,
                min_spawn_speed : 1,
                max_spawn_speed : 5,
                min_spawn_rot_speed : 1,
                max_spawn_rot_speed : 6,
                max_speed : 10,
                acc : 0
            }
        ],
        [
            {
                children : 0,
                health : 2,
                name : "asteroid health small",
                images : ["asteroid_heart_small_2.png"],
                collider : 30,
                min_spawn_speed : 5,
                max_spawn_speed : 10,
                min_spawn_rot_speed : 1,
                max_spawn_rot_speed : 20,
                max_speed : 10,
                acc : 0
            },
        ]
    ];


    constructor(type,size, x, y, game) {
        super(Asteroid.stats[type][size].health, x, y,Math.floor(Math.random()*360),"" , Asteroid.stats[type][size].collider,game);
        //console.log(game);
        this.tag = AsteroidBlueprint.TAG;
        this.isEnemy = true;

        this.type = type;
        this.size = size;
        this.stats = Asteroid.stats[type][size];
        this.image = this.getImgFromPool();
        this.velRot = this.getNewRotVel()
        this.invincibilityTime = this.blinkTime;

        let v = this.getNewSpeed()
        this.velX = v['x'];
        this.velY = v['y'];
        this.game.gameMode.currAsteroids ++;
    }
    static createAsteroid(type,size, x, y, game){
        let obj_class
        switch (type){
            case 0: obj_class = Asteroid; break;
            case 1: obj_class = HealthAsteroid; break;
        }
        return new obj_class(size, x, y, game);
    }
    getImgFromPool(){
        let img = new Image();
        let index = Math.floor(Math.random()*(this.stats.images.length))
        img.src = IMGS_DIR+this.stats.images[Math.floor(Math.random()*this.stats.images.length)]
        //console.log(img.src)
        return img;
    }
    /**
     @return int[]
     */
    getNewSpeed(){
        let speed = Math.random()*(this.stats.max_spawn_speed-this.stats.min_spawn_speed)+this.stats.min_spawn_speed;
        let rotTmp = Math.random()*2*Math.PI;

        let xPart = Math.cos(rotTmp)*speed;
        let yPart = Math.sin(rotTmp)*speed;

        let v = [];
        v['x'] = xPart;
        v['y'] = yPart;
        return v;
    }
    /**
     @return int
     */
    getNewRotVel(){
        return Math.random()*(Math.random()*(this.stats.max_spawn_rot_speed-this.stats.min_spawn_rot_speed))+this.stats.min_spawn_rot_speed;
    }
    die(){
        if(this.alive){
            super.die()
            this.game.gameMode.currAsteroids --;
            if(this.game.gameMode.getPointsFromASteroids){
                this.game.gameMode.increasePoints(1);
            }


            if(this.size > 0 && this.stats.children > 0){
                for(let i = 0; i < this.stats.children; i++){
                    let v = this.getNewSpeed();
                    let objTmp = new Asteroid(
                        this.size-1,
                        this.posX+Math.cos(this.rot+i*360/this.stats.children),
                        this.posY+Math.sin(this.rot+i*360/this.stats.children),
                        this.game
                    );
                    //objTmp.timerInvincibility = objTmp.invincibilityTime;
                    this.game.managedObjs.push(objTmp);
                }
            }

        }
    }
    logicUpdate(deltaT) {
        let rTmp = getVectRad(this.velX,this.velY);

        if(this.stats.acc > 0){
            this.velX += Math.cos(rTmp)*this.stats.acc;
            this.velY += Math.sin(rTmp)*this.stats.acc;
            //check for max velocity
            if(Math.pow(this.velX,2)+Math.pow(this.velY,2) > Math.pow(this.stats.max_speed,2)){
                this.velX = Math.cos(rTmp)*this.stats.max_speed
                this.velY = Math.sin(rTmp)*this.stats.max_speed
            }
        }
        if(this.stats.acc < 0){
            if(this.velX > 0){
                this.velX += Math.cos(rTmp)*this.stats.acc;
                if(this.velX < 0){
                    this.velX = 0;
                }
            }
            if(this.velX < 0){
                this.velX += Math.cos(rTmp)*this.stats.acc;
                if(this.velX > 0){
                    this.velX = 0;
                }
            }
            if(this.velY > 0){
                this.velY += Math.sin(rTmp)*this.stats.acc;
                if(this.velY < 0){
                    this.velY = 0;
                }
            }
            if(this.velY < 0){
                this.velY += Math.sin(rTmp)*this.stats.acc;
                if(this.velY > 0){
                    this.velY = 0;
                }
            }
        }

        super.logicUpdate(deltaT);

        if(this.isInsideTheScreen()){
            if(this.posX - this.collRange < 0 && this.velX < 0){
                this.velX = - this.velX
            }
            if(this.posY - this.collRange < 0 && this.velY < 0){
                this.velY = - this.velY
            }
            if(this.posX + this.collRange > GameInstance.PIXELS_NUMBER && this.velX > 0){
                this.velX = - this.velX
            }
            if(this.posY + this.collRange > GameInstance.PIXELS_NUMBER && this.velY > 0){
                this.velY = - this.velY
            }
        }else {
            if(this.posX - this.collRange < -GameInstance.ASTEROIDS_TURN_AROUND_SPACE && this.velX < 0){
                this.velX = - this.velX
            }
            if(this.posY - this.collRange < -GameInstance.ASTEROIDS_TURN_AROUND_SPACE && this.velY < 0){
                this.velY = - this.velY
            }
            if(this.posX + this.collRange > GameInstance.PIXELS_NUMBER+GameInstance.ASTEROIDS_TURN_AROUND_SPACE && this.velX > 0){
                this.velX = - this.velX
            }
            if(this.posY + this.collRange > GameInstance.PIXELS_NUMBER+GameInstance.ASTEROIDS_TURN_AROUND_SPACE && this.velY > 0){
                this.velY = - this.velY
            }
        }

    }
    collisionsResolve(deltaT) {
        super.collisionsResolve(deltaT);

        for(let i = 0; i < this.registeredCollisions.length; i++){
            if(this.registeredCollisions[i].tag === Player.TAG){
                this.registeredCollisions[i].takeDamage(1);
            }
        }
    }

}
export class Player extends GameObject{
    static ACTION_A = "a";
    static TAG = "player";
    static ID_NORMIE = 0;
    static ID_ZOOMER = 1;
    static ID_SNIPER = 2;
    static ID_BLOPPER = 3;
    static OUTSIDE_THE_SCREEN_TIME = 3000;

    static statsRegistry = [
        {
            name: "default",
            img: "player_0.png",
            icon: "player_0_icon.png",
            maxHealth: 3,
            collider: 20,
            acc: 0.6,
            dec: 0.06,
            maxSpeed: 20,
            actADelay: 400,
            rotSpeed: 4,
            bulletType: 0,
            invincibilityTime: 1300
        },
        {
            name: "zoomer",
            img: "player_1.png",
            icon: "player_1_icon.png",
            maxHealth: 3,
            collider: 20,
            acc: 0.9,
            dec: 0.04,
            maxSpeed: 24,
            actADelay: 260,
            rotSpeed: 7,
            bulletType: 1,
            invincibilityTime: 1300
        },
        {
            name: "sniper",
            img: "player_2.png",
            icon: "player_2_icon.png",
            maxHealth: 3,
            collider: 20,
            acc: 0.9,
            dec: 0.07,
            maxSpeed: 16,
            actADelay: 530,
            rotSpeed: 4,
            bulletType: 2,
            invincibilityTime: 1300
        },
        {
            name: "blobber",
            img: "player_3.png",
            icon: "player_3_icon.png",
            maxHealth: 3,
            collider: 20,
            acc: 0.3,
            dec: 0.06,
            maxSpeed: 26,
            actADelay: 190,
            rotSpeed: 5,
            bulletType: 3,
            invincibilityTime: 1300
        }
    ];

    constructor(type, x, y, game) {
        super(Player.statsRegistry[type].maxHealth, x, y,90,"" , Player.statsRegistry[type].collider,game);
        this.tag = Player.TAG;

        this.type = type;
        this.image = this.getImgFromPool(type)
        this.stats = Player.statsRegistry[type];
        this.timerActionA = this.stats.actADelay;
        this.invincibilityTime = this.stats.invincibilityTime;
        this.timerOutsideTheScreen = Player.OUTSIDE_THE_SCREEN_TIME;

        this.hitBlinckTime = 160;
    }

    /**
     @param {int} type
     @return HTMLElement
     */
    getImgFromPool(type){
        let img = new Image();
        img.src = IMGS_DIR+Player.statsRegistry[type].img;
        return img;
    }
    die(){
        if(this.alive){
            super.die();
            this.game.gameState = GameInstance.STATE_LOST;
        }
    }
    logicUpdate(deltaT) {

        //deceleration
        let rTmp = getVectRad(this.velX,this.velY);
        if(this.velX > 0){
            this.velX -= Math.cos(rTmp)*this.stats.dec;
            if(this.velX < 0){
                this.velX = 0;
            }
        }
        if(this.velX < 0){
            this.velX -= Math.cos(rTmp)*this.stats.dec;
            if(this.velX > 0){
                this.velX = 0;
            }
        }
        if(this.velY > 0){
            this.velY -= Math.sin(rTmp)*this.stats.dec;
            if(this.velY < 0){
                this.velY = 0;
            }
        }
        if(this.velY < 0){
            this.velY -= Math.sin(rTmp)*this.stats.dec;
            if(this.velY > 0){
                this.velY = 0;
            }
        }

        //movement
        if(this.inputUp){
            //console.log("up inp");
            this.velX += Math.cos(degreesToRads(this.rot))*this.stats.acc;
            this.velY -= Math.sin(degreesToRads(this.rot))*this.stats.acc;
            //console.log(this.rot)
            //console.log((Math.cos(degreesToRads(this.rot)))+"   "+(Math.sin(degreesToRads(this.rot))))
            //console.log((Math.cos(degreesToRads(this.rot))*this.stats.acc)+"   "+(Math.sin(degreesToRads(this.rot))*this.stats.acc))
            //console.log(this.velX+"   "+this.velY)

            //check for max velocity
            if(Math.pow(this.velX,2)+Math.pow(this.velY,2) > Math.pow(this.stats.maxSpeed,2)){
                let rTmp = getVectRad(this.velX,this.velY);
                this.velX = Math.cos(rTmp)*this.stats.maxSpeed
                this.velY = Math.sin(rTmp)*this.stats.maxSpeed
            }
        }
        if(this.inputLeft && ! this.inputRight){
            //console.log("rot -");
            this.rot += this.stats.rotSpeed;
            this.rot = this.rot%360;
        }
        if(! this.inputLeft && this.inputRight){
            //console.log("rot +");
            this.rot -= this.stats.rotSpeed;
            this.rot = this.rot%360;
        }

        //actions
        if(this.timerActionA < this.stats.actADelay){
            this.timerActionA += deltaT
        }

        if(this.inputActA && this.timerActionA >= this.stats.actADelay){
            //console.log("inputActA");
            this.timerActionA -= this.stats.actADelay;
            this.actA();
        }

        if(!this.isInsideTheScreen()){
            this.game.elements.outOfScreenDiv.style.visibility = "visible"
            if(this.timerOutsideTheScreen > 0){
                this.timerOutsideTheScreen -= deltaT
            }else {
                this.takeDamage(this.health);
            }
            this.game.elements.outOfScreenText.innerText = this.timerOutsideTheScreen+"";
        }else{
            this.game.elements.outOfScreenDiv.style.visibility = "hidden"
            if(this.timerOutsideTheScreen !== Player.OUTSIDE_THE_SCREEN_TIME){
                this.timerOutsideTheScreen = Player.OUTSIDE_THE_SCREEN_TIME;
            }
        }


        super.logicUpdate(deltaT);
        //console.log(this.posX+"   "+this.posY)
        //console.log(this.velX+"   "+this.velY)
        this.inputUp = false;
        this.inputLeft = false;
        this.inputRight = false;
        this.inputActA = false;

    }
    heal(amount){
        if(this.alive){
            this.health += amount;
            if(this.health > this.stats.maxHealth){
                this.health = this.stats.maxHealth;
            }
            this.game.elements.healthText.innerText = this.health+"";
        }
    }
    takeDamage(dmg) {
        if(this.timerInvincibility <= 0 && dmg > 0){
            super.takeDamage(dmg);
            this.game.elements.healthText.innerText = this.health+"";
        }
    }
    graphicUpdate(deltaT) {
        if(this.alive){
            super.graphicUpdate(deltaT);
        }

    }

    setInput(inputId){
        switch (inputId){
            case GameObject.DIR_UP:
                //console.log("DIR_UP")
                this.inputUp = true;
                break;
            case GameObject.DIR_LEFT:
                //console.log("DIR_LEFT")
                this.inputLeft = true;
                break;
            case GameObject.DIR_RIGHT:
                //console.log("DIR_RIGHT")
                this.inputRight = true;
                break;
            case Player.ACTION_A:
                //console.log("ACTION_A")
                this.inputActA = true;
                break;
        }
    }
    actA(){
        this.shootABulletFromCenter(this.stats.bulletType,this.rot);
    }
    /**
     @param {int} type
     @param {float} x
     @param {float} y
     @param {float} rot
     */
    shootABullet(type,x,y,rot){
        this.game.addObj(new Bullet(type,x,y,rot,this.game));
    }
    /**
     @param {int} type
     @param {float} rot
     */
    shootABulletFromCenter(type,rot){
        this.shootABullet(type,this.posX,this.posY,rot);
    }


}
export class Bullet extends GameObject{
    static statsRegistry = [
        {
            name: "default",
            img: "bullet_0.png",
            collider: 4,
            dmg: 2,
            lifeTime: 3000,
            acc: 0,
            dec: 0,
            startSpeed: 20,
            maxSpeed: 20,
            piercing: 0

        },
        {
            name: "default_weak",
            img: "bullet_1.png",
            collider: 3,
            dmg: 1,
            lifeTime: 3000,
            acc: 0,
            dec: 0,
            startSpeed: 20,
            maxSpeed: 20,
            piercing: 0

        },
        {
            name: "default_strong",
            img: "bullet_2.png",
            collider: 6,
            dmg: 4,
            lifeTime: 3000,
            acc: 0,
            dec: 0,
            startSpeed: 25,
            maxSpeed: 25,
            piercing: 1

        },
        {
            name: "default_slow",
            img: "bullet_3.png",
            collider: 5,
            dmg: 1,
            lifeTime: 3000,
            acc: 0,
            dec: 0.5,
            startSpeed: 17,
            maxSpeed: 17,
            piercing: 0

        }
];
    static TAG = "bullet";
    constructor(type, x, y, rot, game) {
        super(1,x,y,rot,"",Bullet.statsRegistry[type].collider,game);
        //console.log("hi from bullet");
        this.TAG = Bullet.TAG;

        this.type = type;
        this.image = this.getImgFromPool(type)
        this.stats = Bullet.statsRegistry[type];
        this.velX = Math.cos(degreesToRads(rot))*this.stats.startSpeed
        this.velY = -Math.sin(degreesToRads(rot))*this.stats.startSpeed
        this.timerLife = 0;
        this.availableHits = 1 + this.stats.piercing;
        this.collRange = this.stats.collider;
        this.hittedObjs = [];
    }
    getImgFromPool(type){
        let img = new Image();
        img.src = IMGS_DIR+Bullet.statsRegistry[type].img;
        return img;
    }
    logicUpdate(deltaT) {
        //deceleration
        let rTmp = getVectRad(this.velX,this.velY);
        if(this.velX > 0){
            this.velX -= Math.cos(rTmp)*this.stats.dec;
            if(this.velX < 0){
                this.velX = 0;
            }
        }
        if(this.velX < 0){
            this.velX -= Math.cos(rTmp)*this.stats.dec;
            if(this.velX > 0){
                this.velX = 0;
            }
        }
        if(this.velY > 0){
            this.velY -= Math.sin(rTmp)*this.stats.dec;
            if(this.velY < 0){
                this.velY = 0;
            }
        }
        if(this.velY < 0){
            this.velY -= Math.sin(rTmp)*this.stats.dec;
            if(this.velY > 0){
                this.velY = 0;
            }
        }

        //acceleration
        let rotRad = degreesToRads(this.rot);
        this.velX += Math.cos(rotRad)*(this.stats.acc)
        this.velY -= Math.sin(rotRad)*(this.stats.acc)
        //check max velocity
        if(Math.pow(this.velX,2)+Math.pow(this.velY,2) > Math.pow(this.stats.maxSpeed,2)){
            let rTmp = getVectRad(this.velX,this.velY);
            this.velX = Math.cos(rTmp)*this.stats.maxSpeed
            this.velY = Math.sin(rTmp)*this.stats.maxSpeed
        }
        super.logicUpdate(deltaT);

        this.timerLife += deltaT;
        if(this.timerLife >= this.stats.lifeTime){
            this.die();
        }
    }
    collisionsResolve(deltaT) {
        super.collisionsResolve(deltaT);

        for(let i = 0; i < this.registeredCollisions.length && this.availableHits > 0; i++){
            if(this.registeredCollisions[i].isEnemy && !this.hittedObjs.includes(this.registeredCollisions[i])){
                this.hittedObjs.push(this.registeredCollisions[i]);
                this.availableHits--;
                this.registeredCollisions[i].takeDamage(this.stats.dmg);

            }
        }
        if(this.availableHits <= 0){
            this.die();
        }
    }
}
export class Asteroid extends AsteroidBlueprint{
    constructor(size, x, y, game) {
        super(0,size, x, y, game);
    }
}
export class HealthAsteroid extends AsteroidBlueprint{
    constructor(size, x, y, game) {
        super(1,size, x, y, game);
    }

    die(){
        if(this.alive){
            super.die();
            this.game.player.heal(1);
        }
    }
}
export class GameMode{
    static TOTAL_GAME_MODES = 2;
    static ID_DESTROY_ASTEROIDS = 0;
    static ID_TIME_TRAIL = 1;

    /**
     @param {String} name
     @param {String} objectiveImg
     @param {GameInstance} game
     */
    constructor(name, objectiveImg,game) {
        this.objectiveImg = IMGS_DIR + objectiveImg;
        this.name = name;
        this.game = game;
        if(game != null){
            this.game.elements.pointsImg.src = this.objectiveImg;
        }


        this.spawnAsteroids = true;
        this.getPointsFromASteroids = true;
        this.asteroidsTypesSpawnRate = [80,20];
        this.asteroidsSizesSpawnRate = [
            [60,30,10],
            [100]
        ];
        this.points = 0;
        if(game != null){
            this.game.elements.pointsText.innerText = this.points;
        }
        this.maxAsteroids = 20;
        this.currAsteroids = 0
        this.asteroidsSpawnTime = 800;
        this.timerSapwnAsteroids = this.asteroidsSpawnTime;
    }
    /**
     @param {int} gameModeId
     @param {GameInstance} game
     */
    static getGameMode(gameModeId,game){
        switch (gameModeId){
            case 0: return new GameModeDestroyAsteroids(game);
            case 1: return new GameModeTimeTrial(game);
            default: return null;
        }
    }
    static getAllGameModes(game){
        let result = [];
        for(let i = 0; i < this.TOTAL_GAME_MODES; i++){
            result.push(GameMode.getGameMode(i,game));
        }
        return result;
    }
    /**
     @param {int} deltaT
     */
    loop(deltaT){
        //create new asteroids
        if(this.spawnAsteroids){
            if(this.timerSapwnAsteroids < this.asteroidsSpawnTime){
                this.timerSapwnAsteroids += deltaT;
            }
            if(this.timerSapwnAsteroids >= this.asteroidsSpawnTime && this.currAsteroids < this.maxAsteroids){
                this.timerSapwnAsteroids -= this.asteroidsSpawnTime;
                //spawn an asteroid
                let tmp;
                let rand;

                //choose the type
                let chosenType = 0;//= 0 important
                tmp = 0;//= 0 important
                for(let i = 0; i < this.asteroidsTypesSpawnRate.length; i++){
                    tmp += this.asteroidsTypesSpawnRate[i];
                }
                rand = Math.floor(Math.random()*(tmp+1));
                for(let i = 0; rand > 0; i++){
                    rand -= this.asteroidsTypesSpawnRate[i];
                    if(rand <= 0){
                        chosenType = i;
                    }
                }

                //choose the type
                let chosenSize = 0;//= 0 important
                tmp = 0;//= 0 important
                for(let i = 0; i < this.asteroidsSizesSpawnRate.length; i++){
                    tmp += this.asteroidsTypesSpawnRate[i];
                }
                rand = Math.floor(Math.random()*(tmp+1));
                for(let i = 0; rand > 0; i++){
                    if(this.asteroidsSizesSpawnRate[chosenType][i] > 0){
                        rand -= this.asteroidsSizesSpawnRate[chosenType][i];
                        if(rand <= 0){
                            chosenSize = i;
                        }

                    }
                }

                //chose the pos
                let x = Math.random()*(GameInstance.ASTEROIDS_SPAWN_SPACE*2)
                x = x > GameInstance.ASTEROIDS_SPAWN_SPACE ? x + GameInstance.PIXELS_NUMBER : -x
                let y = Math.random()*(GameInstance.ASTEROIDS_SPAWN_SPACE*2)
                y = y > GameInstance.ASTEROIDS_SPAWN_SPACE ? y + GameInstance.PIXELS_NUMBER : -y

                //spawn
                this.game.managedObjs.push(AsteroidBlueprint.createAsteroid(chosenType,chosenSize,x,y,this.game));

            }
        }
    }
    increasePoints(amount){
        this.points += amount;
        this.game.elements.pointsText.innerText = this.points;
    }
}
export class GameModeDestroyAsteroids extends GameMode{
    /**
     @param {GameInstance} game
     */
    constructor(game) {
        super("destroy asteroids","asteroid_mega_1.png",game);
    }
    /**
     @param {int} deltaT
     */
    loop(deltaT){
        super.loop(deltaT);
    }

}
export class GameModeTimeTrial extends GameMode{
    /**
     @param {GameInstance} game
     */
    constructor(game) {
        super("time trial","clock_icon.png",game);
        this.getPointsFromASteroids = false;
    }
    /**
     @param {int} deltaT
     */
    loop(deltaT){
        super.loop(deltaT);
        this.increasePoints(1)
    }

}
export class Joystick{

    constructor(canvas,width,height,baseRadius,joystickRadius,joystickBorderRadius,initialInteractionRadius) {
        this.canvas = canvas;
        this.canvas.style.margin = "0";//important, put it in a div and center that
        this.canvas.style.padding = "0";//important, put it in a div and center that
        this.ctx = canvas.getContext('2d');
        this.ctx.setTransform(1,0,0,1,0,0);
        //set the number of pixels of canvas component size (weird things if desync with canvas's canvas size)
        canvas.style.width = width+"px";
        canvas.style.height = height+"px";
        //set the number of pixels of canvas's canvas
        canvas.width = width;
        canvas.height = height;
        this.baseRadius = baseRadius;
        this.joystickRadius = joystickRadius;
        this.joystickBorderRadius = joystickBorderRadius;
        this.initialInteractionRadius = initialInteractionRadius;
        this.rotationOffset = 0;

        this.x_orig = this.canvas.width / 2;
        this.y_orig = this.canvas.height / 2;
        this.coord = { x: 0, y: 0 };//pos relative to canvas up right
        this.paint = false;
        this.resize();

        //output things
        this.angle_in_degrees = 0;
        this.speed =  0;
        this.x_relative = 0;
        this.y_relative = 0;


    }

    static initializeListeners(Joystick){
        document.addEventListener('mousedown', function() {Joystick.startDrawing(event)});
        document.addEventListener('mouseup', function() {Joystick.stopDrawing(event)});
        document.addEventListener('mousemove', function() {Joystick.Draw(event)});

        document.addEventListener('touchstart', function() {Joystick.startDrawing(event)});
        document.addEventListener('touchend', function() {Joystick.stopDrawing(event)});
        document.addEventListener('touchcancel', function() {Joystick.stopDrawing(event)});
        document.addEventListener('touchmove', function() {Joystick.Draw(event)});
        window.addEventListener('resize', function() {Joystick.resize(event)});
    }

    resize() {
        /*
        this.canvas.style.width = width;
        this.canvas.style.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    */
        this.background();
        this.joystick(this.x_orig, this.y_orig);
    }
    background() {

        this.ctx.beginPath();
        this.ctx.arc(this.x_orig, this.y_orig, this.baseRadius, 0, Math.PI * 2, true);
        this.ctx.fillStyle = '#4c4a4a';
        this.ctx.fill();
    }
    joystick(width, height) {
        this.ctx.beginPath();
        this.ctx.arc(width, height, this.joystickRadius, 0, Math.PI * 2, true);
        this.ctx.fillStyle = '#c50000';
        this.ctx.fill();
        this.ctx.strokeStyle = '#e30000';
        this.ctx.lineWidth = this.joystickBorderRadius;
        this.ctx.stroke();
    }
    getPosition(event) {
        if(event != null){
            if(event.clientX != null || event.touches != null){
                var mouse_x = null;
                var mouse_y = null;
                if(event.clientX != null){
                    mouse_x = event.clientX;
                    mouse_y = event.clientY;
                    this.coord.x = mouse_x - this.canvas.offsetLeft;
                    this.coord.y = mouse_y - this.canvas.offsetTop;
                }else{
                    let allowed = false
                    this.coord.x = this.x_orig;
                    this.coord.y = this.y_orig;
                    for(let i = 0; i < event.touches.length && !allowed; i++){
                        mouse_x = event.clientX || event.touches[i].clientX;
                        mouse_y = event.clientY || event.touches[i].clientY;
                        this.coord.x = mouse_x - this.canvas.offsetLeft;
                        this.coord.y = mouse_y - this.canvas.offsetTop;
                        allowed = this.isPosAcceptable()
                    }
                }
            }

        }
    }
    is_it_in_the_base_circle() {
        var current_radius = Math.sqrt(Math.pow(this.coord.x - this.x_orig, 2) + Math.pow(this.coord.y - this.y_orig, 2));
        if (this.baseRadius >= current_radius) return true
        else return false
    }
    startDrawing(event) {
        this.paint = true;
        this.getPosition(event);
        if(this.isPosAcceptable()){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.background();
        this.joystick(this.coord.x, this.coord.y);
        this.Draw();
        }
    }
    isPosAcceptable(){
        if(this.initialInteractionRadius < 0){
            return true;
        }

        let xTmp = this.x_orig - this.coord.x, yTmp = this.y_orig - this.coord.y;
        return Math.sqrt(Math.pow(xTmp,2)+Math.pow(yTmp,2)) <= this.initialInteractionRadius;

    }
    stopDrawing(event) {
        this.getPosition(event);

        if(!this.isPosAcceptable() || event.clientX != null){
            this.paint = false;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.background();
            this.joystick(this.x_orig, this.y_orig);

            this.angle_in_degrees = 0;
            this.speed =  0;
            this.x_relative = 0;
            this.y_relative = 0;
        }else {
            this.Draw()
        }

    }
    Draw(event) {
        if(this.paint){
            this.getPosition(event);
            if(!this.isPosAcceptable()){
                this.coord.x = this.x_orig;
                this.coord.y = this.y_orig;
            }
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.background();
            var x, y;
            var angle = Math.atan2((this.coord.y - this.y_orig), (this.coord.x - this.x_orig));

            if (Math.sign(angle) == -1) {
                this.angle_in_degrees = Math.round(- angle * 180 / Math.PI);
            }
            else {
                this.angle_in_degrees = Math.round( 360 - angle * 180 / Math.PI);
            }

            //console.log((this.angle_in_degrees+this.rotationOffset)%360)
            //this.angle_in_degrees = (this.angle_in_degrees+this.rotationOffset)%360;
            //console.log("ww")


            if (this.is_it_in_the_base_circle()) {
                this.joystick(this.coord.x, this.coord.y);
                x = this.coord.x;
                y = this.coord.y;
            }
            else {
                x = this.baseRadius * Math.cos(angle) + this.x_orig;
                y = this.baseRadius * Math.sin(angle) + this.y_orig;
                this.joystick(x, y);
            }



            this.speed =  Math.round(100 * Math.sqrt(Math.pow(x - this.x_orig, 2) + Math.pow(y - this.y_orig, 2)) / this.baseRadius);

            this.x_relative = Math.round(x - this.x_orig);
            this.y_relative = Math.round(y - this.y_orig);
        }


    }
    setRotationOffset(rot){
        this.rotationOffset = rot%360;
        if(this.rotationOffset < 0){
            this.rotationOffset = 360 + this.rotationOffset;
        }

    }
}

