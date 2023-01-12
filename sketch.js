var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;


var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;



function preload(){
  trex_running =   loadAnimation("1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg");
  trex_collided = loadAnimation("1.jpg");
  
  groundImage = loadImage("library.jpg");
  
  
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.jpg");
  
  
  //gameOverImg = loadImage("gameOver.png");
  //restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  
  
  ground = createSprite(width/2,height/2,width,height);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;
  ground.velocityX = -(6 + 3*score/100);
  ground1 = createSprite(width/2,height-10,width,2);
  ground.scale = 4.5

  trex = createSprite(50,height-80,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.3;
  gameOver = createSprite(width/2,height/2-50);
 // gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
 // restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height,width,10);
  invisibleGround.visible = true;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(255);
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if((keyDown("space")||touches.length>0) && trex.y >= height-100) {
      trex.velocityY = -20;
      touches = []
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
 
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)||touches.length>0) {
      reset();
      touches =[]
    }
  }
  
  
  drawSprites();
}


  


function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width/2,height-70,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    obstacle.setCollider("rectangle",0,0,100,100)
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale = 0.23;
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale = 0.3;
              break;
      
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    //obstacle.scale = 0.09;
    obstacle.lifetime = 300;
    trex.depth = obstacle.depth+1
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
 
  
  score = 0;
  
}