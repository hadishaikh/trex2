var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, rand2

var trex_bent;

var obstaclesGroup;

var ob1, ob2, ob3, ob4, ob5, ob6

var cloud, cloudsGroup, cloudImage;

var newImage, restartImage;

var restartButton

var score = 0;

var highscore = 0;

var checkPoint, die, jump;

var PLAY = 0;
var END = 1;

var gameState = PLAY;

function preload(){
  ob1 = loadImage("obstacle1.png");
  ob2 = loadImage("obstacle2.png");
  ob3 = loadImage("obstacle3.png");
  ob4 = loadImage("obstacle4.png");
  ob5 = loadImage("obstacle5.png");
  ob6 = loadImage("obstacle6.png");
  
  trex_bent = loadAnimation("trex_bent.png","trex_bent1.png");
  
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  restartImage = loadImage("restart.png");
  
  checkPoint = loadSound("checkPoint.mp3");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    trex = createSprite(50,height-100,20,50);
    trex.addAnimation("running", trex_running);
    trex.addAnimation("collided",trex_collided);
    trex.addAnimation("bent",trex_bent);

    trex.scale = height/1000;
    trex.setCollider("rectangle",30,0,100,60);

    ground = createSprite(200,trex.y + 20,400,20);
    ground.addImage("ground",groundImage);
    ground.x = ground.width /2;
    ground.velocityX = -10 - score/200;
  
    invisibleGround = createSprite(200,ground.y + 10,400,10);
    invisibleGround.visible = false;
  
    restartButton = createSprite(width/2,height/2,35,35);
    restartButton.addImage(restartImage);
    restartButton.depth = ground.depth + 1;
    restartButton.scale = 0.6;
  
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  console.log("Hello"+ 5)
}

function draw() {
  background(255);
  
  console.warn("your pc is a potato");

  
  if(gameState === PLAY){
    score = 0
    score = round(frameCount/2);
    
     ground.velocityX = -10;
    
    if(touches.length > 0 || keyDown("space")&& trex.collide(invisibleGround)) {
    trex.velocityY = -16;
    jump.play();
      touches = []
  }
    trex.velocityY = trex.velocityY + 0.8
    
    if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  //spawn the clouds
  spawnClouds();
  drawObstacles();
    
    if(trex.isTouching(obstaclesGroup)){
      gameState = END;
      die.play();
    }
    
    if(keyWentDown("a")){
      trex.changeAnimation("bent",trex_bent);
    }
    if(keyWentUp("a")){
      trex.changeAnimation("running",trex_running);
    }
    
    restartButton.visible = false;
    
    if(score%100 === 0){
      checkPoint.play();
    }
  }

  else if(gameState === END){
    
    frameCount = 0;
    
    ground.velocityX = 0
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    trex.velocityY = 0;
    
    cloudsGroup.setLifetimeEach(-1);
   obstaclesGroup.setLifetimeEach(-1);
    console.log(cloudsGroup.lifetime);
    console.log(frameCount);
    
    stroke(0);
    fill("black");
    textSize(28);
    text("G A M E   O V E R",restartButton.x - 100,height/2 + 50);
    trex.changeAnimation("collided",trex_collided);
    
    restartButton.visible = true;
    reset();
  }
  
  trex.collide(invisibleGround);
  drawSprites();
  
  stroke(0);
  fill("black");
  textSize(width/35);
  text("Score:" + score,width - 150, 40);
  
  stroke(0);
  fill("black");
  textSize(width/35);
  text("High Score:" + highscore,width -400,40);

}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(10,60))
    cloud.scale = 0.4;
    cloud.velocityX = -3;
    
    
    //assigning lifetime to the variable
    cloud.lifetime = 220;
    
    //adjust the depth
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    
    cloudsGroup.add(cloud);
    }
}

function drawObstacles(){
  if(frameCount%75 === 0){
    obstacle = createSprite(width + 20, height-90,20,20); 
    obstacle.velocityX = -10 - score/200;
    
    obstacle.scale = trex.scale;
    obstacle.y = obstacle.y - 9;
    obstacle.lifetime  = 205; 
    
    rand2 = round(random(1,6));
    
    switch(rand2){
      case 1:obstacle.addImage(ob1);
        break;
      case 2:obstacle.addImage(ob2);
        break;
      case 3:obstacle.addImage(ob3);
        break;
      case 4:obstacle.addImage(ob4);
        break;
      case 5:obstacle.addImage(ob5);
        break;
      case 6:obstacle.addImage(ob6);
        break;
      default:break;
    }
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
   if (score > highscore){
        highscore = score;
   }
     
    if(mousePressedOver(restartButton)){
      gameState = PLAY
      score = 0
      
      obstaclesGroup.destroyEach();
      cloudsGroup.destroyEach();
      
      trex.changeAnimation("running", trex_running)
      }
}