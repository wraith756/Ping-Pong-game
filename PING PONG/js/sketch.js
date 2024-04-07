let userPeddle = document.getElementById("userPeddle");
let aiPeddle = document.getElementById("aiPeddle");
let ball = document.getElementById("ball");
let gamebox = document.getElementById("gamebox");
let userscore = document.getElementById("userscore");
let aiscore = document.getElementById("aiscore");
let wpressed = false;
let spressed = false;
let touchStartY = 0;
let touchEndY = 0;
let gameEnded = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
gamebox.addEventListener("touchstart", touchStartHandler);
gamebox.addEventListener("touchend", touchEndHandler);
gamebox.addEventListener("touchmove", touchMoveHandler);

function keyDownHandler(e) {
    if (e.key == 's') {
        spressed = true;
    } else if (e.key == 'w') {
        wpressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == 's') {
        spressed = false;
    } else if (e.key == 'w') {
        wpressed = false;
    }
}

function touchStartHandler(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
    }
}

function touchEndHandler(e) {
    e.preventDefault();
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

function touchMoveHandler(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
        let touchY = e.touches[0].clientY;
        let deltaY = touchY - touchStartY;
        if (Math.abs(deltaY) > 10) {
            if (deltaY < 0) {
                moveUserPaddleUp();
            } else {
                moveUserPaddleDown();
            }
            touchStartY = touchY;
        }
    }
}

function stopUserPaddle() {
}

function moveUserPaddleUp() {
    if (userPeddle.offsetTop > 40) {
        userPeddle.style.top = userPeddle.offsetTop - 20 + "px";
    }
}

function moveUserPaddleDown() {
    if (userPeddle.offsetTop < gamebox.offsetHeight - userPeddle.offsetHeight + 45) {
        userPeddle.style.top = userPeddle.offsetTop + 20 + "px";
    }
}

let vx = -5;
let vy = 0;
let v = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));

function reset() {
    ball.style.left = "50%";
    ball.style.top = "50%";
    vx = -5;
    vy = -3;
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
        return true;
    }
    return false;
}

function gameloop() {
    if (gameEnded) return;

    if (ball.offsetLeft < 0) {
        aiscore.innerHTML = parseInt(aiscore.innerHTML) + 1;
        if (parseInt(aiscore.innerHTML) === 3) {
            endGame("You lose! Would you like to play again?");
        } else {
            reset();
        }
    }
    if (ball.offsetLeft > gamebox.offsetWidth - ball.offsetWidth) {
        vx = -vx;
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

    requestAnimationFrame(gameloop);
}

function endGame(message) {
    gameEnded = true;
    alert(message);
    let rematch = confirm("Would you like to play again?");
    if (rematch) {
        resetScores();
        reset();
        gameEnded = false;
        requestAnimationFrame(gameloop);
    }
}

function resetScores() {
    userscore.innerHTML = "0";
    aiscore.innerHTML = "0";
}

resetScores();
requestAnimationFrame(gameloop);
