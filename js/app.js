// Game Params

var ENEMY_START_X = -101, // Initial x-coord (left) of Enemy
	ENEMY_END_X = 505, // Final x-coord (left) of Enemy before wrapping
	ROW_Y_COORD = [62, 146, 230], // y-coord (top) of Rows 1, 2 and 3
	NUMBER_OF_ENEMIES = 3,
	ENEMY_MIN_SPEED = 5, // MINIMUM Enemy speed
	ENEMY_MAX_SPEED = 50, // MAXIMUM Enemy speed
	ENEMY_WIDTH = 101, // Enemy width (x pixels)
	PLAYER_START_X = 202, // Initial x-coord (left) of Player
	PLAYER_START_Y = 390, // Initial y-coord (top) of player

	// 
	PLAYER_MOVE_X = 101, // Abs value of x-displacement (left-arrow, right-arrow)
	PLAYER_MOVE_Y = 84, // Abs value of y-displacement (up-arrow, down-arrow)

	// X and Y Boundaries of Player movement
	PLAYER_MAX_X = 404,
	PLAYER_MIN_X = 0,
	PLAYER_MIN_Y = -30,
	PLAYER_MAX_Y = 390,

	// STAR
	STAR_INTERVAL = 3,
	STAR_DURATION = 5,

	// Scoring
	GOAL_POINTS = 50,
	STAR_POINTS = 25,
	LIVES_TO_START = 5;


// Enemies our player must avoid
var Enemy = function() {

    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

	this.reset();

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Initialize Enemy:
// 		Set x to start of row
// 		Set y to random row
// 		Set a random speed multiplier.
Enemy.prototype.reset = function() {
	this.loc = {
		x: ENEMY_START_X,
		y: ROW_Y_COORD[Math.floor(Math.random() * 3)]
	};

	// Multiply speed by 10 to exaggerate variation in enemy speeds
	this.speed = Math.floor((Math.random() * (ENEMY_MAX_SPEED - ENEMY_MIN_SPEED) + ENEMY_MIN_SPEED)) * 10;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
// speed is a random multiplier to vary enemy speed
Enemy.prototype.update = function(dt) {
	this.loc.x += (dt * this.speed);

	// If Enemy moves beyond end of row, RESET (wrap to beginning, randomize ROW and SPEED)
	if(this.loc.x > ENEMY_END_X) {
		this.reset();
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.loc.x, this.loc.y);
};


/* PLAYER */

var Player = function() {

	this.loc = {
		x: PLAYER_START_X,
		y: PLAYER_START_Y
	};

	this.score = 0;
	this.livesRemaining = 5;

	this.sprite = 'images/char-boy.png';
};

// START OF NEW LIFE (after enemy collision):
// DECREMENT the lives counter, set Player location to START
Player.prototype.initTurn = function() {
	this.decrementLives();
	this.setStartPosition();
};

// Decrement lives counter
Player.prototype.decrementLives = function() {
	this.livesRemaining--;
};

// Set the Player location to START
Player.prototype.setStartPosition = function() {
	this.loc.x = PLAYER_START_X;
	this.loc.y = PLAYER_START_Y;
};

// Reset score and lives counter
Player.prototype.resetStats = function() {
	this.score = 0;
	this.livesRemaining = LIVES_TO_START;
};

// Move the Player in the direction indicated
// Player cannot move beyond the edges of the grid
Player.prototype.move = function(direction) {
	switch(direction) {
		case 'left':
			if((this.loc.x - PLAYER_MOVE_X) >= PLAYER_MIN_X) {
				this.loc.x -= PLAYER_MOVE_X;
			}
			break;
		case 'up':
			if((this.loc.y - PLAYER_MOVE_Y) >= PLAYER_MIN_Y) {
				this.loc.y -= PLAYER_MOVE_Y;
			}
			break;
		case 'right':
			if((this.loc.x + PLAYER_MOVE_X) <= PLAYER_MAX_X) {
				this.loc.x += PLAYER_MOVE_X;
			}
			break;
		case 'down':
			if((this.loc.y + PLAYER_MOVE_Y) <= PLAYER_MAX_Y) {
				this.loc.y += PLAYER_MOVE_Y;
			}
			break;
	}
};

// Update the Player state
// Check for collisions
Player.prototype.update = function() {

	//	If Player made it to top row, increment score, display score and reset to start position
	if(this.loc.y === PLAYER_MIN_Y) {
		this.updateScore(GOAL_POINTS);
		this.setStartPosition();
	}

	// If Player collides with an Enemy, update the lives counter 
	// and reset to start position
	// Y-OFFSET OF PLAYER vs ENEMY = 8
	// X-WIDTH OF transparent area around PLAYER = 17
	allEnemies.forEach(function (enemy) {
		if( (enemy.loc.y === this.loc.y + 8) && 
			((enemy.loc.x - ENEMY_WIDTH + 17 < this.loc.x) && (enemy.loc.x + ENEMY_WIDTH - 17 > this.loc.x)) ) {
			this.initTurn();
		}
	},this);

	// If Player collides with a Star, increment score, display score and destroy the Star object
	// Y-OFFSET OF PLAYER vs STAR = 8
	if( (star instanceof Star) && 
			((star.loc.x === this.loc.x) && 
			(star.loc.y === (this.loc.y + 8)))) {
		this.updateScore(STAR_POINTS);
		star = null;
	}
};

// Increment the score
Player.prototype.updateScore = function(score) {
	this.score += score;
};

// Move the Player based on keyboard input
Player.prototype.handleInput = function(key) {
	this.move(key);
};

// Render the Player at x,y
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.loc.x, this.loc.y);
};


/* STAR */

// Star implements a randomly appearing power-up
var Star = function() {

	// Lifetime of the Star (5 seconds)
	this.timer = STAR_DURATION;

	// Expired flag. Star disappears when expired
	this.expired = false;

	// Random location of the Star
	this.loc = {
		x: Math.floor(Math.random() * 5) * 101, // Random column
		y: ROW_Y_COORD[Math.floor(Math.random() * 3)] // Random Row
	};

    this.sprite = 'images/Star.png';
};

// Decrement counter by time delta
Star.prototype.countdown = function(dt) {
	this.timer -= dt;
};

// Decrement the counter if greater than 0
Star.prototype.update = function(dt) {
	if(this.timer > 0) {
		this.countdown(dt);
	}
	else {
		this.expired = true;
	}

};

Star.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.loc.x, this.loc.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];

initializeEnemyArray();

var star = new Star();

var player = new Player();

// Set up the allEnemyies array
function initializeEnemyArray() {
	for(i=0; i<NUMBER_OF_ENEMIES; i++) {
		allEnemies.push(new Enemy());
	}
}

