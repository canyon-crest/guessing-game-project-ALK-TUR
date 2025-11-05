//time and date
setInterval(function() {
    date.textContent = time();
}, 1000);

//global variables
let score, answer, level, playerName;
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
    // Require and format user name before starting
    let raw = (document.getElementById("userName").value || "").trim();
    if (!raw) {
        msg.textContent = "Please enter your name to start.";
        document.getElementById("userName").focus();
        return;
    }
    // Title-case the name (first letter of each word uppercase)
    playerName = raw.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    document.getElementById("userName").value = playerName;

    //enable guess button and give up button
    guessBtn.disabled = false;
    giveUpBtn.disabled = false;
    playBtn.disabled = true;
    
    //reset message
    msg.textContent = playerName + ", game started! Make your guess.";

    for (let i=0; i<levelArr.length; i++) {
        levelArr[i].disabled = true;
        if (levelArr[i].checked) {
            level = parseInt(levelArr[i].value);
        }
    }

    answer = Math.floor(Math.random() * level) + 1;
    msg.textContent = playerName + ", game started! Guess a number between 1 and " + level + ".";

    console.log(answer);
}

//make guess
function makeGuess() {
    let userGuess = parseInt(guess.value);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > level) {
        msg.textContent = playerName + ", please enter a VALID number between 1 and " + level + ".";
        return;
    }
    score++; 
   if (userGuess === answer) {
        guessBtn.disabled = true;
        giveUpBtn.disabled = true;
        playBtn.disabled = false;
        msg.textContent = playerName + " guessed the correct number " + answer + "!" + " It took you " + score + " attempts.";
        // qualitative score feedback
        (function(){
            var ratio = score / level;
            var quality;
            if (ratio <= 0.10) quality = "Excellent";
            else if (ratio <= 0.25) quality = "Good";
            else if (ratio <= 0.50) quality = "OK";
            else if (ratio <= 0.75) quality = "Fair";
            else quality = "Bad";
            msg.textContent += " Your score was " + quality + ".";
        })();
        for (let i=0; i<levelArr.length; i++) {
            levelArr[i].disabled = false;
        }
        
        updateScore(true);
        score = 0;
        //I used co-pilot to help me write cold/hot feedbacks because i didnt understand what is rubric asking. 
    } else if (userGuess < answer) {
        const diff = Math.abs(userGuess - answer);
        const ratio = diff / level;
        let heat;
        if (ratio >= 0.5) heat = "(Ice cold)";
        else if (ratio >= 0.25) heat = "(Cold)";
        else if (ratio >= 0.10) heat = "(Warm)";
        else if (ratio >= 0.05) heat = "(Hot)";
        else heat = "(Very hot)";
        msg.textContent = playerName + ", number is too low! " + heat;
    } else if (userGuess > answer) {
        const diff = Math.abs(userGuess - answer);
        const ratio = diff / level;
        let heat;
        if (ratio >= 0.5) heat = "(Ice cold)";
        else if (ratio >= 0.25) heat = "(Cold)";
        else if (ratio >= 0.10) heat = "(Warm)";
        else if (ratio >= 0.05) heat = "(Hot)";
        else heat = "(Very hot)";
        msg.textContent = playerName + ", number is too high! " + heat;
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
    msg.textContent = playerName + ", game over! The correct answer was " + answer + ".";
    score = level;
    // qualitative score feedback for give up (always worst since score equals range)
    (function(){
        var ratio = score / level; // will be 1
        var quality;
        if (ratio <= 0.10) quality = "Excellent";
        else if (ratio <= 0.25) quality = "Good";
        else if (ratio <= 0.50) quality = "OK";
        else if (ratio <= 0.75) quality = "Fair";
        else quality = "Bad";
        msg.textContent += " Your score was " + quality + ".";
    })();
    updateScore(false);
}   

