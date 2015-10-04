// Game Params

var ENEMY_START_X = -101, // Initial x-coord (left) of Enemy
	ENEMY_END_X = 505, // Final x-coord (left) of Enemy before wrapping
	ROW_Y = [62, 146, 230], // y-coord (top) of Rows 1, 2 and 3
	ENEMY_MIN_SPEED = 5, // MINIMUM Enemy speed
	ENEMY_MAX_SPEED = 50, // MAXIMUM Enemy speed
	ENEMY_WIDTH = 101, // Enemy width (x pixels)
	PLAYER_START_X = 200, // Initial x-coord (left) of Player
	PLAYER_START_Y = 325, // Initial y-coord (top) of player
	PLAYER_MOVE_X = 101, // Abs value of x-displacement (left-arrow, right-arrow)
	PLAYER_MOVE_Y = 84; // Abs value of y-displacement (up-arrow, down-arrow)

// Randomize enemy speed:

// ENEMY_BASE_SPEED:
function randomEnemySpeed() {
	return Math.floor((Math.random() * (ENEMY_MAX_SPEED - ENEMY_MIN_SPEED) + ENEMY_MIN_SPEED)) * 10;
}

// Enemies our player must avoid
var Enemy = function() {

    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // Set Enemy x-coord
	this.loc = {
		x: ENEMY_START_X,
	};

	// Set random x-movement
	this.v = randomEnemySpeed();

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	this.loc.x += (dt * this.v);
	// If Enemy moves beyond end of row, wrap to beginning
	if(this.loc.x > ENEMY_END_X) {
		this.wrap();
	}

    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.loc.x, this.loc.y);
};

// Position Enemy at start of row and randomize speed.
Enemy.prototype.wrap = function() {
	this.loc.x = ENEMY_START_X;
	this.v = randomEnemySpeed();
}





// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {

	this.init();

	this.sprite = 'images/char-boy.png';
};

Player.prototype.init = function() {

	this.score = 0;

	this.loc = {
		x: PLAYER_START_X,
		y: PLAYER_START_Y
	};
	this.target = {
		x: PLAYER_START_X,
		y: PLAYER_START_Y
	};

};

Player.prototype.move = function(direction) {
	switch(direction) {
		case 'left':
			if((this.loc.x - PLAYER_MOVE_X) > 0) {
				this.loc.x -= PLAYER_MOVE_X;
			}
			break;
		case 'up':
			if((this.loc.y - PLAYER_MOVE_Y) >= -11) {
				this.loc.y -= PLAYER_MOVE_Y;
			}
			break;
		case 'right':
			if((this.loc.x + PLAYER_MOVE_X) < 401) {
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

Player.prototype.update = function(dt) {
	// Made it!
	if(this.loc.y === -11) {
		this.updateScore(10);
		displayScore(this.score);
		this.loc.x = PLAYER_START_X;
		this.loc.y = PLAYER_START_Y;
	}
	// Detect enemy collision
	allEnemies.forEach(function (enemy, index, arr) {
		// var w = 101;
		// console.log(enemy);
		// console.log(index);
		// console.log(arr);
		// console.log("e: "+enemy.loc.y);
		// console.log("p: "+this.loc.y);
		if ((enemy.loc.y == this.loc.y-11) && (enemy.loc.x-ENEMY_WIDTH < this.loc.x && enemy.loc.x+ENEMY_WIDTH > this.loc.x)) {
			this.init();
			displayScore(this.score);
		}
	},this);
};

Player.prototype.updateScore = function(score) {
	this.score += score;
}

Player.prototype.render = function(dt) {
	ctx.drawImage(Resources.get(this.sprite), this.loc.x, this.loc.y);
};

Player.prototype.handleInput = function(key) {
	this.move(key);
};

var Gem = function() {

	this.timer = 5;

	this.loc = {
		x: Math.floor(Math.random() * 5) * 101,
		y: ROW_Y[Math.floor(Math.random() * 3)]
	};

    this.sprite = 'images/Star.png';
};

Gem.prototype.countdown = function(dt) {
	this.timer -= dt;
//	console.log(this.timer);
};

Gem.prototype.update = function(dt) {
	if(this.timer > 0) {
		this.countdown(dt);
	}
};

Gem.prototype.render = function(dt) {
	ctx.drawImage(Resources.get(this.sprite), this.loc.x, this.loc.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = new Array();

for(i=0; i<3; i++) {
	var enemy = new Enemy();
	enemy.loc.y = ROW_Y[i];
	allEnemies[i] = enemy;
}

var player = new Player();

var gem = new Gem();

function displayScore(score) {
	ctx.font = "20px Georgia";
	ctx.clearRect(0,0,100,30);
	ctx.fillText(score,0,20);
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
