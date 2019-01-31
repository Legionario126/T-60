let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

let imagenes={
    bg:"./images/enviro/5.png",
    still: "./images/still.png",
    run:"./images/spritesheet runing.png",
    jump:"./images/spritesheet jump.png",
    dead:"./images/spritesheet dead.png",
    heliIntro:"./images/1.png",
    helStat1:"./images/static 1.png",
    helStat2:"./images/static 2.png",
    bullImg: "./images/bullet.jpg"
  } 
  
let gameStarted = false;
let interval;
let keys = [];
let platforms = [];
let evil = [];
let friction = 0.8;
let gravity = 0.98;
let frames = 0;
let shot = false;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////musica
let music= new Audio()
 music.src="http://66.90.93.122/ost/metal-gear-rising-revengeance-original-soundtrack/oiodifyn/06%20-%20Chasing%20The%20Wind.mp3"
//alert1 no suena
let alert1= new Audio()
    alert1.src== "./Music/The Division - ISAC Attention Hostiles.mp3";
let alert2= new Audio()
    alert2.src== "./Music/The Division - ISAC Warning Hostiles.mp3";
let alert3= new Audio()
    alert3.src== "./Music/The Division - ISAC Friendly Agent Down.mp3";

class Board{
    constructor(){
        this.x=0
        this.y=0
        this.width=canvas.width
        this.height=canvas.height
        this.image=new Image()
        this.image.src=imagenes.bg
        this.image.onload=this.draw.bind(this)
    }
    draw(){
        context.drawImage(this.image,this.x,this.y,this.width,this.height)
    }
}

let fondo=new Board();

class Player{
    constructor(){
        this.x = 5;
        this.y = 400;
        this.width = 100;
        this.height = 100;
        this.speed = 10;
        this.velX = 0;
        this.velY = 0;
        this.jumping = false;
        this.jumpStrength = 7;
        this.facing = 'right';
        this.grounded = false;
        this.sx = 0;
        this.sy = 0;
        this.image= new Image();
        this.image.src=imagenes.run;
        this.image.onload=this.draw.bind(this)
    }
    draw (){
        if (frames % 10 === 0) this.sx += 580;
            if (this.sx === 2900) this.sx = 0;
                context.drawImage(
                this.image,
                this.sx,
                this.sy,
                580,
                540,
                this.x,
                this.y,
                this.width,
                this.height
                );
    }
}

let player= new Player();

//////////////////////////////////////////////////////////////////enemigo(s)
class Helicopter{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.width = canvas.width;
        this.height = canvas.height;
        this.speed = 2;
        this.shot = false;
        this.facing = 'down';
        this.image= new Image();
        this.image.src=imagenes.helStat2;
        this.image.onload=this.draw.bind(this)
    }
    draw (){
        context.drawImage(this.image,this.x,this.y,this.width,this.height)
    }
}

let heli= new Helicopter();

//bus
platforms.push({
    x: 700,
    y: 385,
    width: 300,
    height: 600,
});

//patrulla
platforms.push({
    x: 260,
    y: 455,
    width: 120,
    height: 100,
});

//Piso
platforms.push({
    x:0,
    y:canvas.height-30,
    width:canvas.width,
    height:50,
});

///////////////////////////barras de contencion para las balas
//left-wall
platforms.push({
    x: 0,
    y: 0,
    width: 1,
    height: canvas.height
});
//right-wall
platforms.push({
    x: canvas.width - 1,
    y: 0,
    width: 1,
    height: canvas.height
});
//Roof
platforms.push({
    x: 0,
    y: 0,
    width: canvas.width,
    height: 1,
});

//////////////////////////////////////////////////////////////////////Balas

//////////////////////////////////////////////////////////////Balita aliada
class Bullet{
    constructor(x, y){
        this.color = 'yellow';
        //this.direction = null;
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        //this.grounded = false;
        this.speed = 15;
        this.velX = 0;
        this.velY = 0;
        this.image= new Image()
        this.image.src = imagenes.bullImg;
        this.image.onload=this.draw.bind(this)
    }
    draw (){
        context.drawImage(this.image,this.x++,this.y,this.width,this.height)
    }
}
//let bullet= new Bullet();

/////////////////////////////////////////////////////////////balas enemigas
class EvilBullet{
    constructor(){
        this.color = 'red';
        this.direction = null;
        this.x = -10;
        this.y = -10;
        this.width = 10;
        this.height = 10;
        this.speed = 15;
        this.velX = 0;
        this.velY = 0;
    }
    draw (){
        context.drawImage(this.image,this.x,this.y,this.width,this.height)
    }
}
let evilBullet= new EvilBullet();

let bull

function generateBullet(){
    bull = new Bullet(player.x+100 , player.y+10)
    shootBull(bull);
}

function shootBull(elem){
    elem.draw()
}

//////////////////////////////////////////////////////////////////////////////////////////////listeners

document.body.addEventListener('keydown', function(event){
  if(event.keyCode == 13 && !gameStarted){
    startGame();
  }
  keys[event.keyCode] = true;
});

document.body.addEventListener('keyup', function(event){
  keys[event.keyCode] = false;
});

///////////////////////////////////////////////////////////////////////////////////////// Intro
function intro_screen(){
  context.font = "50px Roboto";
  context.fillStyle = "#0099CC";
  context.textAlign = "center";
  context.fillText("T-60", canvas.width/2, canvas.height/2);
  context.font = "20px Arial";
  context.fillText("Presiona STARP para iniciar", canvas.width/2, canvas.height/2 + 50); 
}
intro_screen();
///////////////////////////////////////////////////////////////////////////////////// STARP GAME
function startGame(){
  gameStarted = true;
  context.clearRect(0,0,canvas.width,canvas.height);
  interval = setInterval(function(){
    context.clearRect(0,0,canvas.width,canvas.height);
    update();
  }, 1000/60)
}
///////////////////////////////////////////////////////////////////////////////// Drawing

//////////////////////////////////// Plataforms
function drawPlatforms(){
  context.fillStyle = "transparent";
  platforms.forEach(function(platform){
    context.fillRect(platform.x,platform.y,platform.width,platform.height);
  })
}
////////////////////////////////Frendly bullet
function frendBullet(){
    if(player.shot){
        context.fillStyle = bullet.color;
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
}
function eneBullet(){
    if(heli.shot){
        context.fillStyle = bullet.color;
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
}
////////////////////////////////////////TIME
function drawTime(){
    //context.fillText = "Time: ";
    context.fillStyle = "green";
    context.fillText(Math.floor(frames/60), 940,30);
  }
///////////////////////////////////////////////////////////////////////////////////////// Start update
function update(){
    context.clearRect(0,0,canvas.width,canvas.height)
    fondo.draw();
    frames++;
    drawTime();
    drawPlatforms();
    heli.draw();
    player.draw();
    eneBullet()
    frendBullet();

//Leyes de la fisica

//Fricion
player.x +=player.velX;
player.velX *= friction;

//Gravedad
player.y += player.velY;
player.velY += gravity;


//////////////////////////////////////////////////////////////////////////////////////////movimiento
//jumping
if(keys[87]){
    if(!player.jumping){
        player.jumping = true;
        player.grounded = false;
        player.velY = -player.speed * 2;
    }
}
//Derecha
if(keys[68]){
    if(player.velX < player.speed){
        player.velX++;
        facing = 'right';
    }
}
//Izquierda
if(keys[65]){
    if(player.velX > -player.speed){
        player.velX--;
        facing = 'left';
    }
}
//shoot
// spacebar
// if (keys[32]){
//     if(shot === false){
//         player.shot = true;
//         if (shot === true){
//             bullets.push(new Bullet(player.x , player.y, player.vx));
//         }
        
//     }
// }

if(keys[32]){
    generateBullet()
}
////////////////////////////////////////////////////////////////////////////check collisions plataforms

////////////////////////////////////////ya medio jala
  player.grounded = false;
  platforms.forEach(function(platform){
    let direction = collisionCheck(player, platform);
    if(direction == "left" || direction == "right"){
      player.velX = 0;
      
    }else if(direction == "bottom"){
      player.jumping = false;
      player.grounded = true;
      player.velY = -player.jumpStrength*2
    }else if(direction == "top"){
      player.velY *= -1;
    }
  });
if(player.grounded){
    player.velY = 0;
}
///////////////////////////////////////////////////////////////////check bullet vs plataforms colition
// bullet.grounded = false;
//   platforms.forEach(function(platform){
//     var direction = collisionCheck(bullet, platform);
//     if(direction == "left" || direction == "right"){
//       bullet.velX = 0;
      
//     }else if(direction == "bottom"){
//       bullet.grounded = true;
//       bullet.velY = 0;
//     }else if(direction == "top"){
//       bullet.velY *= -1;
//     }
//   });
// if(bullet.grounded){
//     bullet.velY = 0;
// }
// //colicion bala enemiga con suelo
// let dte = collisionCheck(evilBullet, platforms);
//     if (dte != null){
//         heli.shot = false;
//     }
/////////////////////////////////////////////////////////experimento rebotar balas
// evilBullet.x += evilBullet.vx;
// if(evilBullet.x + evilBullet.vx >= canvas.width || evilBullet.x + evilBullet.vx < 0) {
//     evilBullet.vx *= -1;
// }
// evilBullet.y += evilBullet.vy;
// if(evilBullet.y + evilBullet.vy >= canvas.height || evilBullet.y + evilBullet.vy < 0) {
//     evilBullet.vy *= -1;
// }    

//////////////////////////////////////////////////////////////////////////check player/evil collision
//player vs heli
for (let i = 0; i < evil.length; i++) {	        
    let dir = collisionCheck(player, evil[i]);
    if (dir != null) {
        //resetPlayer();
    }
    //check bullet/evil collision
    if(evil[i].mortal){
        let dth = collisionCheck(bullet, evil[i]);
        if (dth === "l" || dth === "r") {
            evil[i].alive = false;
            player.shot = false;
        } else if (dth === "t") {
            evil[i].alive = false;
            player.shot = false;
        } else if (dth === "b") {
            evil[i].alive = false;
            player.shot = false;
        }

        //si se muere heli lo saca de la pantalla
        if(!evil[i].alive){
            evil[i].x = -500;
            evil[i].y = -500;
        }
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////// Actions
//Helicopter Actions
if(heli.alive){
    if(heli.shot === false){
        evilBullet.x = heli.x - 400;
        evilBullet.y = heli.y - 500;
        heli.shot = true;
    }
}
    if(heli.shot){
        evilBullet.y += evilBullet.speed;
    }

//Player Actions
if(player.shot){
    if(bullet.direction === 'right'){
        bullet.x += bullet.speed;
    }else if(bullet.direction === 'left'){
        bullet.x -= bullet.speed;
    }
}
context.fill();
}//////////////////////////////////////////////////////////////////////////////////////////// End Update

/////////////////////////////////////////////////////// Algoritmo de colicion que no entiendo pero jala

//algoritmo de Bliss
//deteccion de colicion general 
function collisionCheck(char, plat){
  var vectorX = (char.x-14 + (char.width/2)) - (plat.x + (plat.width/2));
  var vectorY = (char.y-10 + (char.height/2)) - (plat.y + (plat.height/2));
  
  var halfWidths = (char.width/2) + (plat.width/2);
  var halfHeights = (char.height/2) + (plat.height/2);
  
  var collisionDirection = null;
  
  if(Math.abs(vectorX) < halfWidths && Math.abs(vectorY) < halfHeights){
    var offsetX = halfWidths - Math.abs(vectorX);
    var offsetY = halfHeights - Math.abs(vectorY);
    if(offsetX < offsetY){
      if(vectorX > 0){
        collisionDirection = "left";
        char.x += offsetX;
      }else{
        collisionDirection = "right";
        char.x -= offsetX;
      }
    }else{
      if(vectorY > 0){
        collisionDirection = "top";
        char.y += offsetY;
      }else{
        collisionDirection = "bottom";
        char.y -= offsetY;
      }
    }
  }
  return collisionDirection;
  
}

////////////////////////////////////////////////////////////////////////////////////////////// musiquita
// document.querySelector('button').addEventListener('click',()=>{
//     //pausas la cancion 
//     if (music.paused){
//       music.play()
//       alert1.play()
//     }
//     else{
//       music.pause()
//     }   
//     //rebovinar cancion
//     music.currentTime=0
//     alert1.currentTime=0
//   })