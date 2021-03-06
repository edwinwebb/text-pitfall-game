
// Game Options
var game = {
    speed : 30,
    width: 56,
    height: 46,
    score: 0,
    tick: 0,
    moves : 0,
    gap : .5,
    hits: 3,
    level : 1
}

// Chatacters used in display
var characters = {
    wall : '▓',
    hole : ' ',
    man : '😁',
    deadMan : '😖',
    cherry : '$'
}

var currentKey = false; // Left or right key
var manPosition = game.width / 2;
var gapWidth = game.width * game.gap; // gap to fall down
var gapOffset = gapWidth / 2;
var gapOffsetVaiance = 2; // gap modifier
var wallArray = makeInitalWallArray();
var textArea = document.querySelector('#game');

function makeInitalWallArray() {
    var top = Array
                .apply(0, Array(game.height - 10))
                .map(function() { return [0,game.width] });
    var bottom = Array
                .apply(0, Array(10))
                .map(function() { return [gapOffset,gapWidth] });

    return top.concat(bottom)
}

/**
 * Main render function
 * Calls self
 * @return null
 */
function render() {

    var i = 0;
    var outputArray = [];
    var newOffset = Math.random() > .5 ? gapOffset + gapOffsetVaiance : gapOffset - gapOffsetVaiance;
    var endGame = false;

    /**
     * Makes a line of text from array generation and joins
     * @param  {num} gapOffset gap position
     * @param  {num} gapWidth  gap size
     * @return {String}        current wall state
     */
    function drawWall(gapOffset, gapWidth) {
        var go = gapOffset;
        var gw = gapWidth;
        var line = "";
            line += Array(go).join(characters.wall);
            line += Array(gw).join(characters.hole);
            line += Array(game.width - go - gw).join(characters.wall);

        return line;
    }

    // difficulty
    levelCheck();

    // scores
    game.tick++;

    // move guy
    if(currentKey && manPosition + currentKey > 0 && manPosition + currentKey < game.width) {
        manPosition += currentKey;
    }

    // render last state
    for (i; i < wallArray.length; i++) {
        outputArray[i] = drawWall(wallArray[i][0], wallArray[i][1]);
    };

    // inject guy
    if(outputArray[game.height / 2].charAt(manPosition) !== characters.hole) {
        game.hits--;
        outputArray[game.height / 2] = outputArray[game.height / 2].replaceAt(manPosition, characters.deadMan);
        if(game.hits === 0) {
            endGame = true;
            outputArray.push('xxx GAME OVER xxx');
        }
    } else {
        outputArray[game.height / 2] = outputArray[game.height / 2].replaceAt(manPosition, characters.man);
    }

    outputArray.push('\nLIVES: '+ game.hits + " " + 'LEVEL : ' + game.level + " " + 'SCORE : ' + game.tick);

    // draw text
    textArea.textContent = outputArray.join('\n');

    // new walls
    wallArray.shift();

    if(newOffset < 1 || newOffset + gapWidth >= game.width - 1) {
        wallArray.push(wallArray[wallArray.length - 1]);
    } else {
        wallArray.push([newOffset, gapWidth]);
    }
    gapOffset = wallArray[wallArray.length - 1][0];

    if(!endGame) {
        // repeat
        window.setTimeout(render, game.speed);
    }
}

/**
 * Update game settings mid render cycle
 */
function levelCheck() {
    if(game.tick > 0 && game.tick % 100 == 0 && gapWidth > 8) {
        gapWidth -= 2;
        game.level++;
        game.score += 20;
    }

    if(game.tick > 0 && game.tick % 50 == 0 && game.speed > 10) {
        game.speed = game.speed * .95;
        game.level++;
        game.score += 10;
    }
}

// Needed in render, could be better :/
String.prototype.replaceAt = function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

// Record keypresses
window.addEventListener('keydown', function(e) {

    var kk = e.keyCode;

    // left
    if(kk == 37 || kk == 65) {
        currentKey = -1;
    }

    // right
    if(kk == 39 || kk == 68) {
        currentKey = +1;
    }

});

window.addEventListener('keyup', function(e) {
    currentKey = false;
});

// start
render();
