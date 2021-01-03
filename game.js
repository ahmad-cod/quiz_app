const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreField = document.getElementById('scoreField');
const progressBarFull = document.getElementById('progressBarFull');

// we connect our javascript to the html and make refrence for the necessary parts to be modified in the html
// after we've connect the necessary parts to bbe modified lets create other necessary variables like score,
// acceptingAnswers, currentQuestion..

let score = 0;
let availableQuestions = [];
let currentQuestion = [];
let acceptingAnswers = true;
let questionCounter = 0;

// then let's input the questions obj

let questions = [];

fetch('https://opentdb.com/api.php?amount=10&category=17&difficulty=easy&type=multiple')
.then( res => {
    return res.json();
})
.then(questionsLoaded => {
    console.log(questionsLoaded.results)
    questions = questionsLoaded.results.map(questionsLoaded => {
        const formattedQuestion = {
            Question: questionLoaded.question
        };
        const answerChoices = [...questionLoaded.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
        answerChoices.splice(formattedQuestion.answer -1, 0, questionLoaded.correct_answer);

        answerChoices.forEach((choice, index) => {
            formattedQuestion["choice" + (index-1)] = choice
        })
        return formattedQuestion
    })
    startGame()
})
.catch(err => {
     console.error(' >> Failed to get API ')
})

// Next we define our costants
// CONSTANTS

const CORRECT_BONUS = 10;
const max_Questions = 3;

// next we define functions startGame , getNewQuestion

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    console.log(availableQuestions);
    getNewQuestion();
}

// when we getNewQuestion we want to increment questionCounter, 
// and get the questions randomly
getNewQuestion = () => {
    if(availableQuestions === 0 || questionCounter >= max_Questions){
        localStorage.setItem('recentScore', score)
        // go to the end page
        return window.location.assign("./end.html");
    }
    questionCounter++;
    progressText.innerText = `Question: ${questionCounter}/${max_Questions}`;
    // We update the progress bar
    console.log( questionCounter/ max_Questions )
    progressBarFull.style.width = `${(questionCounter/ max_Questions) * 100}%`
    console.log(progressBarFull.style.width)
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.Question;
    choices.forEach( choice => {
        const number = choice.dataset['number'];
        console.log(currentQuestion[number])
        choice.innerText = currentQuestion['choice' + number];
      // the 'choice' + number here = keys for choicees as in the object NB case is highly sensitive
    })
    availableQuestions.splice(questionIndex, 1);
    // console.log(availableQuestions);
    acceptingAnswers = true;
}

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];
        const applyClass = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if(applyClass === 'correct') {
            incrementScore(CORRECT_BONUS)
        }
        selectedChoice.parentElement.classList.add(applyClass);
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(applyClass);
            getNewQuestion()
        }, 600)
    });
})

incrementScore = num => {
    score += num;
    scoreField.innerText = score;
}

