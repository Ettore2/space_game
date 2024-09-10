function drawImage2(game,img, x, y, scale, rotation){
    //console.log(game);
    //console.log(game.ctx);
    //console.log(img);

    game.ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
    game.ctx.rotate(degreesToRads(rotation));
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
function arrayRemove(arr, value) {
    for(let i = 0; i < arr.length; i++){
        if(arr[i] === value){
            arr.splice(i, 1);
            return
        }
    }

}

const IMGS_DIR = "../sprites/";


export class GameInstance {
    static STATE_PLAY = 1;
    static STATE_PAUSE = 0;
    static STATE_LOST = 2;
    static PIXELS_NUMBER = 2400;
    static ASTEROIDS_TURN_AROUND_SPACE = 600;
    static ASTEROIDS_SPAWN_SPACE = GameInstance.ASTEROIDS_TURN_AROUND_SPACE / 2;


    /**
     @param {HTMLCanvasElement} canvas
     @param {int} delay
     @param {int} playerTypeId
     @param {HTMLElement} pointsText
     @param {HTMLElement} healthText
     */
    constructor(canvas,delay,playerTypeId,pointsText,healthText) {
        this.canvas = canvas;
        this.delay = delay;
        this.pointsText = pointsText;
        this.healthText = healthText

        this.managedObjs = [];
        this.toAddObj = [];
        this.toRemoveObj = [];

        //set number of pixels
        canvas.width = GameInstance.PIXELS_NUMBER;
        canvas.height = GameInstance.PIXELS_NUMBER;

        this.ctx = canvas.getContext("2d");

        this.asteroidsTypesSpawnRate = [80,20];
        this.asteroidsSizesSpawnRate = [
            [60,30,10],
            [100]
        ];
        this.points = 0;
        this.pointsText.innerText = this.points;
        this.maxAsteroids = 20;
        this.currAsteroids = 0
        this.asteroidsSpawnTime = 800;
        this.timerSapwnAsteroids = this.asteroidsSpawnTime;
        this.gameState = GameInstance.STATE_PLAY;

        this.player = new Player(playerTypeId,GameInstance.PIXELS_NUMBER/2,GameInstance.PIXELS_NUMBER/2,this);
        this.managedObjs.push(this.player);
        this.healthText.innerText = this.player.health+"";
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

                //create new asteroids
                if(this.timerSapwnAsteroids < this.asteroidsSpawnTime){
                    this.timerSapwnAsteroids += this.delay
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
                    this.managedObjs.push(AsteroidBlueprint.createAsteroid(chosenType,chosenSize,x,y,this));

                }




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
    increasePoints(amount){
        this.points += amount;
        this.pointsText.innerText = this.points;
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
        this.timerHitBlinck = 0;
        this.hitBlinckTime = 80;

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
            this.timerHitBlinck = this.hitBlinckTime;
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


    //updates
    /**
     @param {int} deltaT
     */
    logicUpdate(deltaT){
        this.posX += this.velX
        this.posY += this.velY
        this.rot += this.velRot;
        this.registeredCollisions = [];
        if(this.timerInvincibility > 0){
            this.timerInvincibility -= deltaT;
        }
        if(this.timerHitBlinck > 0){
            this.timerHitBlinck -= deltaT;
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
        if(this.timerHitBlinck <= 0){
            drawImage(this.game,this.image,this.posX,this.posY,this.rot);
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
                images : ["asteroid_heart_small_1.png"],
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

        let v = this.getNewSpeed()
        this.velX = v['x'];
        this.velY = v['y'];
        this.game.currAsteroids ++;
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
            this.game.currAsteroids --;
            this.game.increasePoints(1);

            if(this.size > 0 && this.stats.children > 0){
                for(let i = 0; i < this.stats.children; i++){
                    let v = this.getNewSpeed();
                    let objTmp = new Asteroid(
                        this.size-1,
                        this.posX+Math.cos(this.rot+i*360/this.stats.children)*this.stats.children,
                        this.posY+Math.sin(this.rot+i*360/this.stats.children)*this.stats.children,
                        this.game
                    );
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

    isInsideTheScreen(){
        return this.posX > 0 && this.posX < GameInstance.PIXELS_NUMBER && this.posY > 0 && this.posY < GameInstance.PIXELS_NUMBER
    }

}
export class Player extends GameObject{
    static ACTION_A = "a";
    static TAG = "player";

    static statsRegistry = [
        {
            name: "default",
            img: "player_0.png",
            maxHealth: 3,
            collider: 20,
            acc: 0.6,
            dec: 0.06,
            maxSpeed: 20,
            actADelay: 400,
            rotSpeed: 4,
            bulletType: 0,
            invincibilityTime: 500
        }
    ];

    constructor(type, x, y, game) {
        super(Player.statsRegistry[type].maxHealth, x, y,270,"" , Player.statsRegistry[type].collider,game);
        this.tag = Player.TAG;

        this.type = type;
        this.image = this.getImgFromPool(type)
        this.stats = Player.statsRegistry[type];
        this.timerActionA = this.stats.actADelay;
        this.invincibilityTime = this.stats.invincibilityTime;

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
            this.velY += Math.sin(degreesToRads(this.rot))*this.stats.acc;
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
            this.rot -= this.stats.rotSpeed;
            this.rot = this.rot%360;
        }
        if(! this.inputLeft && this.inputRight){
            //console.log("rot +");
            this.rot += this.stats.rotSpeed;
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


        super.logicUpdate(deltaT);
        //console.log(this.posX+"   "+this.posY)
        //console.log(this.velX+"   "+this.velY)
        this.inputUp = false;
        this.inputLeft = false;
        this.inputRight = false;
        this.inputActA = false;

    }
    graphicUpdate(deltaT) {
        super.graphicUpdate(deltaT);
    }
    heal(amount){
        this.health += amount;
        if(this.health > this.stats.maxHealth){
            this.health = this.stats.maxHealth;
        }
        this.game.healthText.innerText = this.health+"";
    }
    takeDamage(dmg) {
        if(this.timerInvincibility <= 0 && dmg > 0){
            super.takeDamage(dmg);
            this.game.healthText.innerText = this.health+"";
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
        img: "player_0_bullet.png",
        collider: 4,
        dmg: 2,
        lifeTime: 3000,
        acc: 0,
        dec: 0,
        startSpeed: 20,
        maxSpeed: 20,
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
        this.velY = Math.sin(degreesToRads(rot))*this.stats.startSpeed
        this.timerLife = 0;
        this.availableHits = 1 + this.stats.piercing;
        this.collRange = this.stats.collider;
    }
    getImgFromPool(type){
        let img = new Image();
        img.src = IMGS_DIR+Bullet.statsRegistry[type].img;
        return img;
    }
    logicUpdate(deltaT) {
        //acceleration
        let rotRad = degreesToRads(this.rot);
        this.velX += Math.cos(rotRad)*(this.stats.acc-this.stats.dec)
        this.velX += Math.sin(rotRad)*(this.stats.acc-this.stats.dec)
        //check for max velocity
        if(Math.pow(this.velX,2)+Math.pow(this.velY,2) > Math.pow(this.stats.maxSpeed,2)){
            this.velX = Math.cos(rotRad)*this.stats.maxSpeed
            this.velY = Math.sin(rotRad)*this.stats.maxSpeed
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
            if(this.registeredCollisions[i].isEnemy){
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
