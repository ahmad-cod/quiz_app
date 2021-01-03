const highscoresList = document.getElementById('highscoresList')
const highscores = JSON.parse(localStorage.getItem('highScores')) || [];

highscoresList.innerHTML= highscores.map(score => {
    return `<li class='high-score'>${score.name} - ${score.score}</li>`
}).join('');



