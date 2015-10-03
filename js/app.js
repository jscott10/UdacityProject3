// Game Params

var ENEMY_START_X = -101,
	ENEMY_END_X = 505,
	ENEMY_Y = [62, 146, 230],
	ENEMY_MIN_SPEED = 5,
	ENEMY_MAX_SPEED = 50,
	PLAYER_START_X = 200,
	PLAYER_START_Y = 325,
	PLAYER_JUMP_X = 101,
	PLAYER_JUMP_Y = 84;

function randomEnemySpeed() {
	return Math.floor((Math.random() * ENEMY_MAX_SPEED) + ENEMY_MIN_SPEED) * 10;
}

// function collision(playerLoc, enemyLoc) {
// 	var ex = enemyLoc.x;
// 	var ey = enemyLoc.y;
// 	var px = playerLoc.x;
// 	var py = playerLoc.y+15;
// 	// console.log("p: " + py);
// 	// console.log("e: " + ey);
// 	var w = 101;
// //	if(enemyLoc.y == playerLoc.y-15 && (enemyLoc.x-w < playerLoc.x && enemyLoc.x+w > playerLoc.x)) {
// 	return (ey == py) && (ex-w < px && ex+w > px);
// 	// 	return true;
// 	// }
// 	// else {
// 	// 	return false;
// 	// }
// }

function collision(enemy, index, arr) {
	var w = 101;
	console.log(enemy);
	console.log(index);
	console.log(arr);
	console.log("e: "+enemy.loc.y);
	console.log("p: "+this.loc.y);
	if ((enemy.loc.y == this.loc.y-11) && (enemy.loc.x-w < this.loc.x && enemy.loc.x+w > this.loc.x)) {
		this.init();
	}
}

// Enemies our player must avoid
var Enemy = function() {

    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

	this.loc = {
		x: ENEMY_START_X,
		y: 0
	};

	this.v = randomEnemySpeed();

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	this.loc.x += (dt * this.v);
	if(this.loc.x > ENEMY_END_X) {
		this.reset();
//		console.log(this.x);
	}

    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.loc.x, this.loc.y);
};

Enemy.prototype.reset = function() {
	this.loc.x = ENEMY_START_X;
	this.v = randomEnemySpeed();
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {

	this.loc = {
		x: PLAYER_START_X,
		y: PLAYER_START_Y
	};

	this.target = {
		x : this.loc.x,
	 	y : this.loc.y
	}

	this.sprite = 'images/char-boy.png';
};

Player.prototype.init = function() {
	this.loc = {
		x: PLAYER_START_X,
		y: PLAYER_START_Y
	};
	this.target = {
		x: PLAYER_START_X,
		y: PLAYER_START_Y
	}

};

Player.prototype.update = function(dt) {
	if(this.target.x > -1 && this.target.x < 401) {
		this.loc.x = this.target.x;
	}
	else {
		this.target.x = this.loc.x;
	}
	if(this.target.y > -50 && this.target.y < 331) {
		this.loc.y = this.target.y;
	}
	else {
		this.target.y = this.loc.y;
	}
	// console.log("enemy 0: " + allEnemies[0].loc.y);
	// console.log("enemy 1: " + allEnemies[1].loc.y);
	// console.log("enemy 2: " + allEnemies[2].loc.y);
	// console.log("player: " + player.loc.y);

	//console.log(collision(allEnemies[2]));
	allEnemies.forEach(collision, this);
};

Player.prototype.render = function(dt) {
	ctx.drawImage(Resources.get(this.sprite), this.loc.x, this.loc.y);
};

Player.prototype.handleInput = function(key) {
	switch(key) {
		case 'left':
			this.target.x -= PLAYER_JUMP_X;
			break;
		case 'up':
			this.target.y -= PLAYER_JUMP_Y;
			break;
		case 'right':
			this.target.x += PLAYER_JUMP_X;
			break;
		case 'down':
			this.target.y += PLAYER_JUMP_Y;
			break;
		case 'quit':
			window.cancelAnimationFrame(animID);
			break;
	}
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = new Array();

for(i=0; i<3; i++) {
	var enemy = new Enemy();
	enemy.loc.y = ENEMY_Y[i];
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
        40: 'down',
        32: 'quit'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
