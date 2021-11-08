//Set up canvas for rendering
let gameCanvas = document.querySelector('#game');
let canvasHeight = getComputedStyle(gameCanvas)['height'];
let canvasWidth = getComputedStyle(gameCanvas)['width'];
let intHeight = parseInt(canvasHeight);
let intWidth = parseInt(canvasWidth);


//Set up initial fields
let unitSize = 20;
let computerBubbles = [];
let lifePoints;
let player;



//Set up game context
let ctx = game.getContext('2d');
ctx.fillStyle = "white";
ctx.strokeStyle = "red";
ctx.lineWidth = 5;

//setting up the canvas
gameCanvas.setAttribute('height', canvasHeight);
gameCanvas.setAttribute('width', canvasWidth);



window.addEventListener("DOMContentLoaded", (e) => {
    player = new Player("blue");
    
    const runGame = setInterval(gameLoop, 120);

})

//for getting key info
document.addEventListener('keydown', keyAdapter);


class Player {
    constructor(color) {
        this.width = unitSize;
        this.height = unitSize;
        this.playerX = (Math.round(intWidth/unitSize))/2 * unitSize;
        this.playerY = (Math.round(intHeight/unitSize))/2 * unitSize;
        this.color = color;

        this.render = function () {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.playerX, this.playerY, unitSize, unitSize);
        }

    }

}


class Computer{
    constructor(){
        
    }

}


function gameLoop(){
    ctx.clearRect(0, 0, game.width, game.height);
    player.render();
    console.log(player.playerY);
    drawGrid();
}



function keyAdapter(e) {
    console.log('movement', e.key);
    switch (e.key) {
        case 'w':
            //move up
            if(player.playerY - unitSize < 0){
                break;
            }
            else{
                player.playerY -= unitSize;
            }
            break;
        case 'a':
            //move  left
            if(player.playerX - unitSize < 0){
                break;
            }
            else{
                player.playerX -= unitSize;
            }
          
            break;
        case 'd':
            //move right
            if(player.playerX + unitSize > intWidth-unitSize){
                break;
            }
            else{
                player.playerX += unitSize;
            }
            break;
        case 's':
            //move down
            if(player.playerY + unitSize > intHeight - unitSize){
                break;
            }
            else{
                player.playerY += unitSize;
            }
       
            break;
    }

}



//just for ease.optional
function drawGrid() {
    for (let i = 0; i < intWidth / unitSize; i++) {

        ctx.beginPath();
        ctx.moveTo(i * unitSize, 0);
        ctx.lineTo(i * unitSize, intHeight);
        ctx.stroke();
    }
    for (let i = 0; i < intHeight / unitSize; i++) {

        ctx.beginPath();
        ctx.moveTo(0, i * unitSize);
        ctx.lineTo(intWidth, i * unitSize);
        ctx.stroke();
    }
}