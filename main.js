//Set up canvas for rendering and grab HTML 
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

//setting up audio
let music = document.querySelector('#music');
let hurtSound = new Audio();
let sound1= document.createElement("source");
sound1.type = "audio/mpeg";
sound1.src = "./audio/pacman-lose-life.mp3" ;
hurtSound.appendChild(sound1);

let scoreSound = new Audio();
let sound2= document.createElement("source");
sound2.type = "audio/mpeg";
sound2.src = "./audio/gain-score.mp3" ;
scoreSound.appendChild(sound2);

//get pacman and ghost images
let background = document.querySelector('#skyBackground');
let bluePacman = document.querySelector('#blue-pacman');
let greenPacman = document.querySelector('#green-pacman');
let orangePacman = document.querySelector('#orange-pacman');
let pinkPacman = document.querySelector('#pink-pacman');
let redPacman = document.querySelector('#red-pacman');
let blueGhost = document.querySelector('#blue-ghost');
let greenGhost = document.querySelector('#green-ghost');
let orangeGhost = document.querySelector('#orange-ghost');
let pinkGhost = document.querySelector('#pink-ghost');
let redGhost = document.querySelector('#red-ghost');



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


//for getting user key info
document.addEventListener('keydown', keyAdapter);

//Set up local storage for max score
let maxScore = 0;
let maxScoreString = maxScore.toString();
localStorage.setItem('maxScore', maxScoreString);



//User Color Selection!
let playerColorChoice;
let colorChoiceList = document.querySelectorAll('.circle');

for (let i = 0; i < colorChoiceList.length; i++) {
    colorChoiceList[i].onclick = function () {
        for (let i = 0; i < colorChoiceList.length; i++) {
            let square = document.querySelector('#' + colorChoiceList[i].classList[0] + '-square');
            square.style.backgroundColor = "white";
        }
        let square = document.querySelector('#' + colorChoiceList[i].classList[0] + '-square')
        square.style.backgroundColor = "grey";
        playerColorChoice = colorChoiceList[i].classList[0];


    }
}
if (playerColorChoice === undefined) {
    playerColorChoice = colorChoices[0];
}




//Set up game context
let ctx = game.getContext('2d');
ctx.fillStyle = "white";
ctx.strokeStyle = "red";
ctx.lineWidth = 1;


//setting up the canvas
gameCanvas.setAttribute('height', canvasHeight);
gameCanvas.setAttribute('width', canvasWidth);



//Start button click to start game 
startButton.addEventListener('click', function () {
    gameScreen.classList.toggle("hidden");
    startScreen.classList.toggle("hidden");

    gameStart();
})
// Play again button at game over screen
playAgainButton.addEventListener('click', function () {
    gameScreen.classList.toggle("hidden");
    gameOverScreen.classList.toggle("hidden");

    gameStart();
})
//Go home button at game over screen
goHomeButton.addEventListener('click', function () {
    gameOverScreen.classList.toggle("hidden");
    startScreen.classList.toggle("hidden");
})



//start game - sets initial computer quantity, score, life points, and starts game loops
function gameStart() {
    music.play();
  
    music.volume = 0.2;
    score = 0;
    lifePoints = 5;
    computerBubbles = [];

    player = new Player(playerColorChoice);
    computer = new Computer();
    computerBubbles.push(computer);
    computer = new Computer();
    computerBubbles.push(computer);


    //timer for player movement speed, renderings, and collission checks
    change = setInterval(gameLoop, 120);
    //timer for computer movement speed
    change1 = setInterval(gameLoop1, 500);
    //timer for all computers to change to a random color
    changeC = setInterval(changeColor, 5000);
    //timer for all computers to change to a random direction
    changeD = setInterval(changeDirection, 2500);
    //timer to add an additional ghost in the mix   
    addBubbles = setInterval(addComputerBubble, 2000);
}





//Player class - initialize size; function to get the correct pacman image; function to drawImage on canvas
class Player {
    constructor(color) {
        this.width = unitSize;
        this.height = unitSize;
        this.playerX = (Math.round(intWidth / unitSize / 2)) * unitSize;
        this.playerY = (Math.round(intHeight / unitSize / 2)) * unitSize;
        this.color = color;
        this.pacmanImage = getPacman(this.color);
        this.degRotate = 0;
      
        this.render = function(deg){
            //save current canvas so it doesnt rotate everything
            ctx.save();
            let rad = deg * (Math.PI)/180;
            //Translate to center point of the image
            ctx.translate((this.playerX + unitSize/2), (this.playerY + unitSize/2));
            //Perform rotation
            ctx.rotate(deg * 0.01745);
            //Go back to the top left of canvas
            ctx.translate(-(this.playerX + unitSize/2), -(this.playerY + unitSize/2));
            //draw the image
            ctx.drawImage(this.pacmanImage, this.playerX, this.playerY, unitSize, unitSize);
            //restore the saved canvas 
            ctx.restore();
        }

    }

}

//takes the player color choice, and return corresponding color pacman image
function getPacman(color) {
    switch (color) {
        case 'cornflowerblue':
            return bluePacman;
            break;
        case 'orange':
            return orangePacman;
            break;
        case 'darkseagreen':
            return greenPacman;
            break;
        case 'firebrick':
            return redPacman;
            break;
        case 'pink':
            return pinkPacman;
            break;
    }
}



//Computer class - initializes size, and randomly selects a color and direction for the computer ghost
// function to get corresponding colored ghost and render it. 
class Computer {
    constructor() {
        this.width = unitSize;
        this.height = unitSize;
        this.computerX = Math.round(Math.random() * intWidth / unitSize) * unitSize;
        this.computerY = Math.round(Math.random() * intHeight / unitSize) * unitSize;
        this.color = colorChoices[randomColor];
        this.direction = directionChoices[randomDirection];
        

        this.render = function () {
            let ghostImage = getGhost(this.color);
            ctx.drawImage(ghostImage, this.computerX, this.computerY, unitSize, unitSize)
        }
    }

}

function getGhost(color) {
    switch (color) {
        case 'cornflowerblue':
            return blueGhost;
            break;
        case 'orange':
            return orangeGhost;
            break;
        case 'darkseagreen':
            return greenGhost;
            break;
        case 'firebrick':
            return redGhost;
            break;
        case 'pink':
            return pinkGhost;
            break;
    }
}




// changes the direction field of all the computers
function changeDirection() {
    for (let i = 0; i < computerBubbles.length; i++) {
        randomDirection = Math.round(Math.random() * (directionChoices.length - 1));
        computerBubbles[i].direction = directionChoices[randomDirection];

    }
}

//changes the color of all the computers
function changeColor() {
    for (let i = 0; i < computerBubbles.length; i++) {
        randomColor = Math.round(Math.random() * (colorChoices.length - 1));
        computerBubbles[i].color = colorChoices[randomColor];

    }
}

// add a new computer to the array
function addComputerBubble() {
    computer = new Computer();
    computerBubbles.push(computer);
}



function gameLoop() {
    //if alive
    if (lifePoints > 0) {
        //clear canvas
        ctx.clearRect(0, 0, game.width, game.height);
        //draw player
       
        player.render(player.degRotate);
        
        //draw computers
        for (let i = 0; i < computerBubbles.length; i++) {
            computerBubbles[i].render();
        }

        //can optionally draw a grid
        //drawGrid();

        //check if the player ate a ghost, and the right one
        checkPlayerCollision();

        //update score, life, and max score
        scoreDisplay[0].textContent = "Score: " + score;
        lifeDisplay.textContent = "Life: " + lifePoints;
        maxScoreDisplay[0].textContent = "Max Score: " + localStorage.getItem('maxScore');
    }


}

// computer movement
function gameLoop1() {
    movementHandler();
}


//increment player movement based on keys pressed
function keyAdapter(e) {

    switch (e.key) {
        case 'w':
            //move up
            if (player.playerY - unitSize < 0) {
                break;
            }
            else {
                player.degRotate = 270;
                player.playerY -= unitSize;
                
            }
            break;
        case 'a':
            //move  left
            if (player.playerX - unitSize < 0) {
                break;
            }
            else {
                player.degRotate = 180;
                player.playerX -= unitSize;
            }

            break;
        case 'd':
            //move right
            if (player.playerX + unitSize > intWidth - unitSize) {
                break;
            }
            else {
                player.degRotate = 0;
                player.playerX += unitSize;
            }
            break;
        case 's':
            //move down
            if (player.playerY + unitSize > intHeight - unitSize) {
                break;
            }
            else {
                player.degRotate = 90;
                player.playerY += unitSize;
            }

            break;
    }

}

// computer movement based on their direction field
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
                //move computer bubble right
                if (computerBubbles[i].computerX + unitSize > intWidth - unitSize) {
                    computerBubbles[i].direction = 'L';
                    break;
                }
                else {
                    computerBubbles[i].computerX += unitSize;
                }
                break;
            case 'D':
                //move computer bubble down
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


//check for player collision - update score, life, and play sounds affect based on same color ghost as pacman or not
function checkPlayerCollision() {
    //Check if any other computer are occupying that space
    for (let i = 0; i < computerBubbles.length; i++) {
        //if they bump into a computer
        if (computerBubbles[i].computerX === player.playerX &&
            computerBubbles[i].computerY === player.playerY) {
            //if its the same color
            if (computerBubbles[i].color === player.color) {
                scoreSound.volume = 0.2;
                scoreSound.play();
                score++;
                if (score > maxScore) {
                    maxScore = score;
                    maxScoreString = maxScore.toString();
                    localStorage.setItem("maxScore", maxScoreString);
                }
                computerBubbles[i] = new Computer();

            }
            else {
                lifePoints--;
                hurtSound.volume = 0.1;
                hurtSound.play();
                computerBubbles[i] = new Computer();
            }
        }

    }
    if (lifePoints <= 0) {
        gameScreen.classList.toggle("hidden");
        gameOverScreen.classList.toggle("hidden");
        scoreDisplay[1].textContent = "Score: " + score;
        maxScoreDisplay[1].textContent = "Max Score: " + localStorage.getItem('maxScore');
        clearInterval(change);
        clearInterval(change1);
        clearInterval(changeC);
        clearInterval(changeD);
        clearInterval(addBubbles);

    }



}



//Can draw a grid based on preferences
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
