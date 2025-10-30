//time and date
setInterval(function() {
    date.textContent = time();
}, 1000);

//global variables
let score, answer, level;
score = 0;
const levelArr = document.getElementsByName("level");
const scoreArr = [];

//event listeners
playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);

//time and date function
function time() {
    let d = new Date();
    let str;
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let seconds = d.getSeconds();
    str = d.getMonth()+1 + "/" + d.getDate() + "/" + d.getFullYear() + " " + hours + ":" + minutes + ":" + seconds;
    return str;
}


//play function
function play() {
    //enable guess button and give up button
    guessBtn.disabled = false;
    giveUpBtn.disabled = false;
    playBtn.disabled = true;
    
    //reset message
    msg.textContent = "Game started! Make your guess.";

    for (let i=0; i<levelArr.length; i++) {
        levelArr[i].disabled = true;
        if (levelArr[i].checked) {
            level = parseInt(levelArr[i].value);
        }
    }

    answer = Math.floor(Math.random() * level) + 1;
    msg.textContent = "Game started! Guess a number between 1 and " + level + ".";

    console.log(answer);
}

//make guess
function makeGuess() {
    let userGuess = parseInt(guess.value);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > level) {
        msg.textContent = "Please enter a VALID number between 1 and " + level + ".";
        return;
    }
    score++; 
    if (userGuess === answer) {
        guessBtn.disabled = true;
        giveUpBtn.disabled = true;
        playBtn.disabled = false;
        msg.textContent = "You guessed the correct number " + answer + "!" + " It took you " + score + " attempts.";
        for (let i=0; i<levelArr.length; i++) {
            levelArr[i].disabled = false;
        }
        updateScore(true);
        score = 0;
    } else if (userGuess < answer) {
        msg.textContent = "Too low!";
    } else if (userGuess > answer) {
        msg.textContent = "Too high!";
    }
}
//give up
giveUpBtn.addEventListener("click", giveUp);

function updateScore(wasWin) {
    if (wasWin) {
        scoreArr.push(score);
    }
    let totalWins = scoreArr.length;
    wins.textContent = "Total wins: " + totalWins;
    // update average score
    if (scoreArr.length > 0) {
        let sum = 0;
        for (let i = 0; i < scoreArr.length; i++) {
            sum += scoreArr[i];
        }
        let avg = (sum / scoreArr.length).toFixed(2);
        avgScore.textContent = "Average Score: " + avg;
    } else {
        avgScore.textContent = "Average Score: N/A";
    }
    // update leaderboard
    const lbItems = document.getElementsByName("leaderboard");
    if (lbItems && lbItems.length > 0) {
        const sorted = scoreArr.slice().sort(function(a,b){return a-b});
        for (let i = 0; i < lbItems.length; i++) {
            lbItems[i].textContent = (i < sorted.length) ? sorted[i] : lbItems[i].textContent || "-";
        }
    }
    // reset score for next round
    score = 0;
}

function giveUp() {
    //disable guess button and give up button
    guessBtn.disabled = true;
    giveUpBtn.disabled = true;
    playBtn.disabled = false;
    for (let i=0; i<levelArr.length; i++) {
        levelArr[i].disabled = false;
    }
    msg.textContent = "Game over! The correct answer was " + answer + ".";
    score = level;
    updateScore(false);
}   

