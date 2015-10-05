// Game Params

var ENEMY_START_X = -101, // Initial x-coord (left) of Enemy
	ENEMY_END_X = 505, // Final x-coord (left) of Enemy before wrapping
	ROW_Y = [62, 146, 230], // y-coord (top) of Rows 1, 2 and 3
	ENEMY_MIN_SPEED = 5, // MINIMUM Enemy speed
	ENEMY_MAX_SPEED = 50, // MAXIMUM Enemy speed
	ENEMY_WIDTH = 101, // Enemy width (x pixels)
	PLAYER_START_X = 202, // Initial x-coord (left) of Player
	PLAYER_START_Y = 325, // Initial y-coord (top) of player
	PLAYER_MOVE_X = 101, // Abs value of x-displacement (left-arrow, right-arrow)
	PLAYER_MOVE_Y = 84; // Abs value of y-displacement (up-arrow, down-arrow)

// Enemies our player must avoid
var Enemy = function() {

    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    this.loc = {x: 0, y: 0};

    this.init();

    // Set Enemy x-coord
	// this.loc = {
	// 	x: ENEMY_START_X,
	// };

	// Set random x-movement
	// this.v = randomEnemySpeed();

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Position Enemy at start of row and randomize speed.
Enemy.prototype.init = function() {
	this.loc.x = ENEMY_START_X;
	this.v = randomEnemySpeed();
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.
	this.loc.x += (dt * this.v);

	// If Enemy moves beyond end of row, wrap to beginning and randomize speed
	if(this.loc.x > ENEMY_END_X) {
		this.init();
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.loc.x, this.loc.y);
};

// Randomize enemy speed:
function randomEnemySpeed() {
	return Math.floor((Math.random() * (ENEMY_MAX_SPEED - ENEMY_MIN_SPEED) + ENEMY_MIN_SPEED)) * 10;
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {

	this.initGame();

	this.sprite = 'images/char-boy.png';
};

Player.prototype.initGame = function() {

	this.score = 0;
	this.lives = 5;

	this.loc = {
		x: PLAYER_START_X,
		y: PLAYER_START_Y
	};

	this.target = {
		x: PLAYER_START_X,
		y: PLAYER_START_Y
	};

};

Player.prototype.initTurn = function() {

	this.lives--;

	this.loc = {
		x: PLAYER_START_X,
		y: PLAYER_START_Y
	};

	this.target = {
		x: PLAYER_START_X,
		y: PLAYER_START_Y
	};

};

// Move the Player in the direction indicated
// Player cannot move beyond the edges of the grid
Player.prototype.move = function(direction) {
	switch(direction) {
		case 'left':
			if((this.loc.x - PLAYER_MOVE_X) >= 0) {
				this.loc.x -= PLAYER_MOVE_X;
			}
			break;
		case 'up':
			if((this.loc.y - PLAYER_MOVE_Y) >= -11) {
				this.loc.y -= PLAYER_MOVE_Y;
			}
			break;
		case 'right':
			if((this.loc.x + PLAYER_MOVE_X) <= 404) {
				this.loc.x += PLAYER_MOVE_X;
			}
			break;
		case 'down':
			if((this.loc.y + PLAYER_MOVE_Y) <= 325) {
				this.loc.y += PLAYER_MOVE_Y;
			}
			break;
	}
	console.log("x: "+this.loc.x + " y: "+this.loc.y);
}

// Update the Player state:
Player.prototype.update = function(dt) {

	//	If Player made it to top row, increment score, display score and reset to start position
	if(this.loc.y === -11) {
		this.updateScore(10);
		displayScore(this.score);
		this.loc.x = PLAYER_START_X;
		this.loc.y = PLAYER_START_Y;
	}

	// If Player collides with an Enemy, display score and reset to start position
	allEnemies.forEach(function (enemy) {
		if( (enemy.loc.y == this.loc.y - 11) && 
			((enemy.loc.x - ENEMY_WIDTH + 17 < this.loc.x) && (enemy.loc.x + ENEMY_WIDTH - 17 > this.loc.x)) ) {
			displayScore(this.score);
			this.initTurn();
		}
	},this);

	// If Player collides with a Star, increment score, display score and destroy the Star object
	if( (star instanceof Star) && ((star.loc.x === this.loc.x) && (star.loc.y === (this.loc.y - 11)))) {
			this.updateScore(40);
			displayScore(this.score);
			star = null;
	}
};

// Increment the score
Player.prototype.updateScore = function(score) {
	this.score += score;
}

// Render the Player at x,y
Player.prototype.render = function(dt) {
	ctx.drawImage(Resources.get(this.sprite), this.loc.x, this.loc.y);
};

// Move the Player based on keyboard input
Player.prototype.handleInput = function(key) {
	this.move(key);
};


// Star implements a randomly appearing power-up
var Star = function() {

	// Lifetime of the Star (5 seconds)
	this.timer = 5;

	// Random location of the Star
	this.loc = {
		x: Math.floor(Math.random() * 5) * 101,
		y: ROW_Y[Math.floor(Math.random() * 3)]
	};

    this.sprite = 'images/Star.png';
};

// Decrement counter by time delta
Star.prototype.countdown = function(dt) {
	this.timer -= dt;
};

// Decrement the counter if gt 0
Star.prototype.update = function(dt) {
	if(this.timer > 0) {
		this.countdown(dt);
	}
};

Star.prototype.render = function(dt) {
	ctx.drawImage(Resources.get(this.sprite), this.loc.x, this.loc.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = new Array();

initializeEnemyArray();

var player = new Player();

var star = new Star();

function initializeEnemyArray() {
	for(i=0; i<3; i++) {
		allEnemies[i] = new Enemy();
		allEnemies[i].loc.y = ROW_Y[i];
	}
}

// Display the score and lives remaining at the top of the screen
function displayScore(score) {
	ctx.font = "20px Georgia";
	ctx.clearRect(0,0,400,30);
	ctx.fillText(score,0,20);
	ctx.fillText("Lives: "+player.lives,100,20);
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
