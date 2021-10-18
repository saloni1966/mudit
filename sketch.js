var PLAY = 1;
var END = 0;
var gameState = PLAY;

var pappu, pappu_running,pappu_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score=0;
var jumpSound, collidedSound;
var who;
var life = 3;

var gameOver, restart;


function preload(){
  jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")
  
  backgroundImg = loadImage("1.jpg")
  
  pappu_running = loadAnimation("pappu1.png","pappu2.png","pappu3.png","pappu4.png");
  pappu_collided = loadAnimation("pappu5.png");
  
  groundImage = loadImage("ground4.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("yoyo2.gif");
  obstacle2 = loadImage("yoyo3.gif");
  obstacle3 = loadImage("yoyo4.gif");
  obstacle4 = loadImage("yoyo5.gif");

  life1 = loadAnimation("heart_1.png");
  life2 = loadAnimation("heart_2.png");
  life3 = loadAnimation("heart_3.png");

  zombieImg = loadAnimation("z1.png","z2.png","z3.png","z4.png");

  whoImg = loadImage("who1.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
   
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
    
  invisibleGround = createSprite(width/2,height-10,width,125);  
 // invisibleGround.shapeColor = "#f4cbaa";
 invisibleGround.visible = false
  pappu = createSprite(250,height-70,20,50);
  
  
  pappu.addAnimation("running", pappu_running);
  pappu.addAnimation("collided", pappu_collided);
  pappu.setCollider('circle',0,0,40)
  pappu.scale = 0.8
  //pappu.debug=true

  zombie = createSprite(100,height-130,20,50);
  zombie.addAnimation("zombieImg",zombieImg);
  zombie.scale = 1;
  

 
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);

  heart1 = createSprite(1100,20);
  heart1.addAnimation("life",life1);
  heart1.scale = 0.3;
  zombie = createSprite(100,height-130,20,50);
  zombie.addAnimation("zombieImg",zombieImg);
  zombie.scale = 3;
  

  heart2 = createSprite(1130,20);
  heart2.addAnimation("life",life2);
  heart2.scale = 0.3;

  heart3 = createSprite(1100,20);
  heart3.addAnimation("life",life3);
  heart3.scale = 0.3;

  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  whoG = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("yellow")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/6);
    ground.velocityX = -(6 + score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && pappu.y  >= height-120) {
      jumpSound.play( )
      pappu.velocityY = -14;
       touches = [];
    }
   
    pappu.velocityY = pappu.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    pappu.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    
    who1();
    if(obstaclesGroup.isTouching(pappu)){
        collidedSound.play();

        for(var i =0 ; i<obstaclesGroup.length ; i++){
          if(obstaclesGroup[i].isTouching(pappu)){
            obstaclesGroup[i].destroy()
            life = life -1
          }
        }
        
    }
    

    if (life === 3){
      heart3.visible = true;
      heart1.visible = false;
      heart2.visible = false;
    }

    if (life === 2){
      heart1.visible = false;
      heart2.visible = true;
      heart3.visible = false;
    }

    if (life === 1){
      heart3.visible = false;
      heart2.visible = false;
      heart1.visible = true;
    }

    if(life === 0){
      gameState = END;
    }

    if(whoG.isTouching(pappu)){
      collidedSound.play();

      for(var i =0 ; i<whoG.length ; i++){
        if(whoG[i].isTouching(pappu)){
          whoG[i].destroy()
          life = life +1
        }
      }
      
  }
    
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    pappu.velocityY = 0;
    whoG.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    pappu.changeAnimation("collided",pappu_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 ||  mousePressedOver(restart)) {      
      reset();
      touches = []
    }
  }


  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = width/cloud.velocityX;
    
    //adjust the depth
    cloud.depth = pappu.depth;
    pappu.depth = pappu.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width+20,height-95,20,30);
    obstacle.setCollider('circle',0,0,120)
     //obstacle.debug = true
  
    obstacle.velocityX = -(6 + score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;        
              
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = width/obstacle.velocityX;
    obstacle.depth = pappu.depth;
    pappu.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function who1(){
  
    if (World.frameCount % 2000 == 0) {
     
       
        who = createSprite(width,random(height-100,height-200));
        who.addImage(whoImg);
        who.scale = 0.09;
        who.velocityX = -6;
        whoG.add(who);
      }
 
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  pappu.changeAnimation("running",pappu_running);
  
  score = 0;
  
}


