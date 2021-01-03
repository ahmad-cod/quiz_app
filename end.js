const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const recentScore = localStorage.getItem('recentScore');
const maxHighScore = 5;

finalScore.innerText = recentScore;

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];


username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value
})

saveScore = (e) => {
    console.log('clicked save button');
    e.preventDefault();
    const score = {
        score: recentScore,
        name: username.value
    }
    highScores.push(score)
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5)

    localStorage.setItem('highScores', JSON.stringify(highScores))
    console.log(highScores)
    window.location.assign('/')
}