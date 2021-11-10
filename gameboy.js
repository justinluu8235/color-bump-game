//Set up canvas for rendering
let gameCanvas = document.querySelector('#game');
let canvasHeight = getComputedStyle(gameCanvas)['height'];
let canvasWidth = getComputedStyle(gameCanvas)['width'];
let intHeight = parseInt(canvasHeight);
let intWidth = parseInt(canvasWidth);
let startButton = document.querySelector('.start-button');
let gameScreen = document.querySelector('.game-screen');
let startScreen = document.querySelector('.start-screen');
let gameOverScreen = document.querySelector('.game-over');
let playAgainButton = document.querySelector('.restart-button');
let goHomeButton = document.querySelector('.home-button');


//Scores and Life
let scoreDisplay = document.querySelectorAll('.score');
let lifeDisplay = document.querySelector('.life');
let maxScoreDisplay = document.querySelectorAll('.max-score');


//Set up initial fields
let unitSize = 25;
let computerBubbles = [];
let score = 0;
let lifePoints = 5;
let player;
let computer;
let colorChoices = ["cornflowerblue", "orange", "darkseagreen", "firebrick", "pink"];
let randomColor = Math.round(Math.random() * (colorChoices.length - 1));
let directionChoices = ["U", "D", "L", "R"];
let randomDirection = Math.round(Math.random() * (directionChoices.length - 1));
let change;
let change1;
let changeC;
let changeD;
let addBubbles;
let background = document.querySelector('#skyBackground');


//Set up local storage for max score
let maxScore = 0;
let maxScoreString = maxScore.toString();
localStorage.setItem('maxScore', maxScoreString);



//User Color Selection!
let playerColorChoice;
let colorChoiceList = document.querySelectorAll('.circle');

for(let i=0; i<colorChoiceList.length; i++){
    colorChoiceList[i].onclick = function(){
        for(let i=0; i<colorChoiceList.length;i++){
            let square = document.querySelector('#'+colorChoiceList[i].classList[0]+'-square');
            square.style.backgroundColor = "white";
        }
        let square = document.querySelector('#'+colorChoiceList[i].classList[0]+'-square')
        square.style.backgroundColor = "grey";
        playerColorChoice=colorChoiceList[i].classList[0];
      
    
    }
}
if(playerColorChoice === undefined){
    playerColorChoice = "cornflowerblue";
}




//Set up game context
let ctx = game.getContext('2d');
ctx.fillStyle = "white";
ctx.strokeStyle = "red";
ctx.lineWidth = 1;

//setting up the canvas
gameCanvas.setAttribute('height', canvasHeight);
gameCanvas.setAttribute('width', canvasWidth);


/*
window.addEventListener("DOMContentLoaded", (e) => {
    player = new Player("blue");
    computer = new Computer();
    computerBubbles.push(computer);
    computer = new Computer();
    computerBubbles.push(computer);
    const change = setInterval(gameLoop, 120);
    const change1 = setInterval(gameLoop1, 200);
    const changeC = setInterval(changeColor, 5000);
    const changeD = setInterval(changeDirection, 2500);
    const addBubbles = setInterval(addComputerBubble, 2000);

})
*/


//Start button click to start game 
startButton.addEventListener('click', function(){
    gameScreen.classList.toggle("hidden");
    startScreen.classList.toggle("hidden");
    
    gameStart();
})

playAgainButton.addEventListener('click', function(){
    gameScreen.classList.toggle("hidden");
    gameOverScreen.classList.toggle("hidden");
    
    gameStart();
})

goHomeButton.addEventListener('click', function(){
    gameOverScreen.classList.toggle("hidden");
    startScreen.classList.toggle("hidden");
})


function gameStart(){
 
    score = 0;
    lifePoints = 5;
    computerBubbles = [];

    player = new Player(playerColorChoice);
    computer = new Computer();
    computerBubbles.push(computer);
    computer = new Computer();
    computerBubbles.push(computer);
    !change ? change=setInterval(gameLoop, 120) : null;
    !change1 ? change1=setInterval(gameLoop1, 500) : null;
    !changeC ? changeC=setInterval(changeColor, 5000) : null;
    !changeD ? changeD=setInterval(changeDirection, 2500) : null;
    !addBubbles ? addBubbles = setInterval(addComputerBubble, 2000) : null;
    
    
}



//for getting key info
document.addEventListener('keydown', keyAdapter);


class Player {
    constructor(color) {
        this.width = unitSize;
        this.height = unitSize;
        this.playerX = (Math.round(intWidth / unitSize/2))  * unitSize;
        this.playerY = (Math.round(intHeight / unitSize/2))  * unitSize;
      
        this.color = color;

        this.render = function () {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.playerX, this.playerY, unitSize, unitSize);
        }

    }

}


class Computer {
    constructor() {
        this.width = unitSize;
        this.height = unitSize;
        this.computerX = Math.round(Math.random() * intWidth / unitSize) * unitSize;
        this.computerY = Math.round(Math.random() * intHeight / unitSize) * unitSize;
        this.color = colorChoices[randomColor];
        this.direction = directionChoices[randomDirection];

       
        this.render = function () {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.computerX, this.computerY, unitSize, unitSize);
        }
    }

}

function changeDirection() {
    for (let i = 0; i < computerBubbles.length; i++) {
        randomDirection = Math.round(Math.random() * (directionChoices.length - 1));
        computerBubbles[i].direction = directionChoices[randomDirection];

    }
}
function changeColor() {
    for (let i = 0; i < computerBubbles.length; i++) {
        randomColor = Math.round(Math.random() * (colorChoices.length - 1));
        computerBubbles[i].color = colorChoices[randomColor];

    }
}

function addComputerBubble() {
    computer = new Computer();
    computerBubbles.push(computer);
}

function gameLoop() {
    if (lifePoints > 0) {
        ctx.clearRect(0, 0, game.width, game.height);
       ctx.drawImage(background, 0,0,game.width, game.height);
        player.render();
        for (let i = 0; i < computerBubbles.length; i++) {
            computerBubbles[i].render();
        }
        //drawGrid();
        checkPlayerCollision();
        scoreDisplay[0].textContent = "Score: " + score;
        lifeDisplay.textContent = "Life: " + lifePoints;
        maxScoreDisplay[0].textContent = "Max Score: " + localStorage.getItem('maxScore');
    }
   

}

function gameLoop1() {
    movementHandler();
}

function keyAdapter(e) {

    switch (e.key) {
        case 'w':
            //move up
            if (player.playerY - unitSize < 0) {
                break;
            }
            else {
                player.playerY -= unitSize;
            }
            break;
        case 'a':
            //move  left
            if (player.playerX - unitSize < 0) {
                break;
            }
            else {
                player.playerX -= unitSize;
            }

            break;
        case 'd':
            //move right
            if (player.playerX + unitSize > intWidth - unitSize) {
                break;
            }
            else {
                player.playerX += unitSize;
            }
            break;
        case 's':
            //move down
            if (player.playerY + unitSize > intHeight - unitSize) {
                break;
            }
            else {
                player.playerY += unitSize;
            }

            break;
    }

}


function movementHandler() {
    for (let i = 0; i < computerBubbles.length; i++) {

        switch (computerBubbles[i].direction) {
            case 'U':
                //move computer bubble up
                if (computerBubbles[i].computerY - unitSize < 0) {
                    computerBubbles[i].direction = 'D';
                    break;
                }
                else {
                    computerBubbles[i].computerY -= unitSize;
                }
                break;
            case 'L':
                //move the computer bubble left

                if (computerBubbles[i].computerX - unitSize < 0) {
                    computerBubbles[i].direction = 'R';
                    break;
                }
                else {
                    computerBubbles[i].computerX -= unitSize;
                }
                break;

            case 'R':
                //move snake right
                if (computerBubbles[i].computerX + unitSize > intWidth - unitSize) {
                    computerBubbles[i].direction = 'L';
                    break;
                }
                else {
                    computerBubbles[i].computerX += unitSize;
                }
                break;
            case 'D':
                //move snake down
                if (computerBubbles[i].computerY + unitSize > intHeight - unitSize) {
                    computerBubbles[i].direction = 'U';
                    break;
                }
                else {
                    computerBubbles[i].computerY += unitSize;
                }
                break;


        }
    }


}

function checkPlayerCollision() {
    //Check if any other computer are occupying that space
    for (let i = 0; i < computerBubbles.length; i++) {
        //if they bump into a computer
        if (computerBubbles[i].computerX === player.playerX &&
            computerBubbles[i].computerY === player.playerY) {
            //if its the same color
            if (computerBubbles[i].color === player.color) {
                score++;
                if(score > maxScore){
                    maxScore = score;
                    maxScoreString = maxScore.toString();
                    localStorage.setItem("maxScore", maxScoreString);
                }
                computerBubbles[i] = new Computer();
            }
            else {
                lifePoints--;

                computerBubbles[i] = new Computer();
            }
        }
       
    }
    if(lifePoints<=0){
        gameScreen.classList.toggle("hidden");
        gameOverScreen.classList.toggle("hidden");
        scoreDisplay[1].textContent = "Score: " + score;
        maxScoreDisplay[1].textContent = "Max Score: " + localStorage.getItem('maxScore');
       
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