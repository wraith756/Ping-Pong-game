let userPeddle = document.getElementById("userPeddle");
let aiPeddle = document.getElementById("aiPeddle");
let ball = document.getElementById("ball");
let gamebox = document.getElementById("gamebox");
let userscore = document.getElementById("userscore");
let aiscore = document.getElementById("aiscore");
let wpressed = false;
let spressed = false;
let upArrowpressed = false;
let downArrowpressed = false;
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keydown", keyDownHandler1);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("keyup", keyUpHandler1);
gamebox.addEventListener("touchstart", touchStartHandler);
gamebox.addEventListener("touchend", touchEndHandler);

function keyDownHandler(e) {
    if (e.key == 's') {
        spressed = true;
        console.log("s pressed");
    } else if (e.key == 'w') {
        wpressed = true;
        console.log("w pressed");
    }
}

function keyUpHandler(e) {
    if (e.key == 's') {
        spressed = false;
        console.log("s released");
    } else if (e.key == 'w') {
        wpressed = false;
        console.log("w released");
    }
}

function keyDownHandler1(e) {
    if (e.key == 'ArrowDown') {
        downArrowpressed = true;
        console.log("ArrowDown pressed");
    } else if (e.key == 'ArrowUp') {
        upArrowpressed = true;
        console.log("ArrowUp pressed");
    }
}

function keyUpHandler1(e) {
    if (e.key == 'ArrowDown') {
        downArrowpressed = false;
        console.log("ArrowDown released");
    } else if (e.key == 'ArrowUp') {
        upArrowpressed = false;
        console.log("ArrowUp released");
    }
}

function touchStartHandler(e) {
    if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
    }
}

function touchEndHandler(e) {
    if (e.changedTouches.length === 1) {
        touchEndY = e.changedTouches[0].clientY;
        if (touchEndY < touchStartY) {
            moveUserPaddleUp();
        } else if (touchEndY > touchStartY) {
            moveUserPaddleDown();
        }
    }
    stopUserPaddle();
}

let vx = -8;
let vy = 0;
let v = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));

function reset() {
    ball.style.left = "50%";
    ball.style.top = "50%";
    vx = -8;
    vy = 0;
    v = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
}

function checkcollision(activepeddle) {
    let balltop = ball.offsetTop;
    let ballleft = ball.offsetLeft;
    let ballbottom = ball.offsetTop + ball.offsetHeight;
    let ballright = ball.offsetLeft + ball.offsetWidth;
    let peddletop = activepeddle.offsetTop;
    let peddleleft = activepeddle.offsetLeft;
    let peddlebottom = activepeddle.offsetTop + activepeddle.offsetHeight;
    let peddleright = activepeddle.offsetLeft + activepeddle.offsetWidth;

    if (ballbottom > peddletop &&
        balltop < peddlebottom &&
        ballright > peddleleft &&
        ballleft < peddleright) {
        console.log("collision is detected");
        return true;
    }
    return false;
}

function gameloop() {
    if (ball.offsetLeft < 0) {
        aiscore.innerHTML = parseInt(aiscore.innerHTML) + 1;
        if (parseInt(aiscore.innerHTML) === 5) {
            endGame("Game Over! You red win! Would you like to play again?");
        } else {
            reset();
        }
    }
    if (ball.offsetLeft > gamebox.offsetWidth - ball.offsetWidth) {
        userscore.innerHTML = parseInt(userscore.innerHTML) + 1;
        if (parseInt(userscore.innerHTML) === 5) {
            endGame("Game Over! You white win! Would you like to play again?");
        } else {
            reset();
        }
    }
    if (ball.offsetTop < 0 || ball.offsetTop > gamebox.offsetHeight - ball.offsetHeight) {
        vy = -vy;
    }

    let peddle = ball.offsetLeft < gamebox.offsetWidth / 2 ? userPeddle : aiPeddle;

    let ballcenterY = ball.offsetTop + ball.offsetHeight / 2;
    let peddlecenterY = peddle.offsetTop + peddle.offsetHeight / 2;
    let angle = 0;

    if (checkcollision(peddle)) {
        if (peddle == userPeddle) {
            angle = (ballcenterY - peddlecenterY) * Math.PI / 4 / (peddle.offsetHeight / 2);
        } else if (peddle == aiPeddle) {
            angle = Math.PI - (ballcenterY - peddlecenterY) * Math.PI / 4 / (peddle.offsetHeight / 2);
        }
        v = v + 0.5;
        vx = v * Math.cos(angle);
        vy = v * Math.sin(angle);
    }

    let aidelay = 0.3;
    aiPeddle.style.top = aiPeddle.offsetTop + (ball.offsetTop - aiPeddle.offsetTop - aiPeddle.offsetHeight / 2) * aidelay + "px";

    ball.style.left = ball.offsetLeft + vx + "px";
    ball.style.top = ball.offsetTop + vy + "px";

    if (wpressed && userPeddle.offsetTop > 40) {
        userPeddle.style.top = userPeddle.offsetTop - v + "px";
    }
    if (spressed && userPeddle.offsetTop < gamebox.offsetHeight - userPeddle.offsetHeight + 45) {
        userPeddle.style.top = userPeddle.offsetTop + v + "px";
    }

    if (upArrowpressed && aiPeddle.offsetTop > 40) {
        aiPeddle.style.top = aiPeddle.offsetTop - v + "px";
    }
    if (downArrowpressed && aiPeddle.offsetTop < gamebox.offsetHeight - aiPeddle.offsetHeight + 45) {
        aiPeddle.style.top = aiPeddle.offsetTop + v + "px";
    }

    requestAnimationFrame(gameloop);
}

function endGame(message) {
    alert(message);
    let rematch = confirm("Would you like to play again?");
    if (rematch) {
        resetScores();
        reset();
        requestAnimationFrame(gameloop);
    }
}

function stopUserPaddle() {
    // Dummy function, no action needed
}

function moveUserPaddleUp() {
    // Move the user paddle up
    if (userPeddle.offsetTop > 40) {
        userPeddle.style.top = userPeddle.offsetTop - 20 + "px"; 
    }
}

function moveUserPaddleDown() {
    // Move the user paddle down
    if (userPeddle.offsetTop < gamebox.offsetHeight - userPeddle.offsetHeight + 45) {
        userPeddle.style.top = userPeddle.offsetTop + 20 + "px"; 
    }
}

function resetScores() {
    userscore.innerHTML = "0";
    aiscore.innerHTML = "0";
}

requestAnimationFrame(gameloop);
