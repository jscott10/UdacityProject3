// Game Params

var game = {
	ENEMY_START_X : -101,
	ENEMY_END_X : 505,
	ROW_Y : [85 * 0 + 60, 85 * 1 + 60, 85 * 2 + 60],
	ENEMY_MIN_SPEED : 5,
	ENEMY_MAX_SPEED : 50,
	PLAYER_START_X : 200,
	PLAYER_START_Y : 330,
	PLAYER_JUMP_X : 100,
	PLAYER_JUMP_Y : 85
};

game.randomEnemySpeed = function() {
	return Math.floor((Math.random() * game.ENEMY_MAX_SPEED) + game.ENEMY_MIN_SPEED) * 10;
};

// Enemies our player must avoid
var Enemy = function() {


    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

	this.x = game.ENEMY_START_X;
	this.v = game.randomEnemySpeed();

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	this.x += (dt * this.v);
	if(this.x > game.ENEMY_END_X) {
		this.reset();
//		console.log(this.x);
	}

    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset = function() {
	this.x = game.ENEMY_START_X;
	this.v = game.randomEnemySpeed();
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
	this.x = game.PLAYER_START_X;
	this.y = game.PLAYER_START_Y;
	this.target = {
		x : this.x,
	 	y : this.y
	}

	this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function(dt) {
	if(this.target.x > -1 && this.target.x < 401) {
		this.x = this.target.x;
	}
	else {
		this.target.x = this.x;
	}
	if(this.target.y > -50 && this.target.y < 331) {
		this.y = this.target.y;
	}
	else {
		this.target.y = this.y;
	}
	// console.log("target x: " + this.target.x);
	 console.log("target y: " + this.target.y);
	// console.log("x: " + this.x);
	 console.log("y: " + this.y);
};

Player.prototype.render = function(dt) {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
	switch(key) {
		case 'left':
			this.target.x -= game.PLAYER_JUMP_X;
			break;
		case 'up':
			this.target.y -= game.PLAYER_JUMP_Y;
			break;
		case 'right':
			this.target.x += game.PLAYER_JUMP_X;
			break;
		case 'down':
			this.target.y += game.PLAYER_JUMP_Y;
			break;
	}
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = new Array();

for(i=0; i<3; i++) {
	var enemy = new Enemy();
	enemy.y = game.ROW_Y[i];
	allEnemies[i] = enemy;
}

var player = new Player();

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
