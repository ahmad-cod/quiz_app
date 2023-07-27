const questionElement = document.getElementById("question");
const choiceElements = Array.from(document.getElementsByClassName("choice-text"));
const progressTextElement = document.getElementById('progressText');
const scoreFieldElement = document.getElementById('scoreField');
const progressBarFullElement = document.getElementById('progressBarFull');

const questionUrl = 'https://opentdb.com/api.php?amount=10&category=17&difficulty=easy&type=multiple';

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

let score = 0;
let availableQuestions = [];
let acceptingAnswers = true;
let questionCounter = 0;
let questionIndex;

// Use comments to explain the purpose of each function and code block.

// Fetch trivia questions from the api
const fetchTriviaQuestions = async ()=> {
    try {
      const response = await fetch(questionUrl);
			const data = await response.json();
			console.log(data);
			return data.results;
    } catch (error) {
        console.error('Failed to fetchTriviaQuestions: ', error);
				return [];
    }
}

// Randomly shuffle the answer choices
const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

// set initial values for the game
const initializeGame = () => {
	score = 0;
	questionCounter = 0;
	availableQuestions = [];
}

// Start the game
const startGame = async () => {
	initializeGame();
	const triviaQuestions = await fetchTriviaQuestions();
	if (triviaQuestions.length === 0) {
		return;
	}
	availableQuestions = triviaQuestions;
	getNewQuestion()
	console.log(triviaQuestions);
}

// Fetch a new question and update the uI
function getNewQuestion() {
	if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
		localStorage.setItem('recentScore', score);

		// Go to the end page
		window.location.assign('./end.html')
	}
	if(questionCounter < MAX_QUESTIONS) {
		questionCounter++;
	}
	progressTextElement.innerText = `Question: ${questionCounter}/${MAX_QUESTIONS}`;
	progressBarFullElement.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

	questionIndex = Math.floor(Math.random() * availableQuestions.length);
	const currentQuestion = availableQuestions[questionIndex];
	questionElement.innerText = currentQuestion.question;

	// Shuffle the answer choices and display them
	const choices = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];

	shuffleArray(choices)
	choiceElements.forEach((choiceElement, index) => {
		choiceElement.innerText = choices[index];
		choiceElement.dataset.number = index; // set the data-number attribute for answer comparison
	})

	// availableQuestions.splice(questionIndex, 1);
}

// Handle answer selection
const handleAnswerSelection = (e) => {
	if(!acceptingAnswers) return;

	acceptingAnswers = false;
	const selectedChoice = e.target;
	const selectedAnswerIndex = parseInt(selectedChoice.dataset['number'], 10);
	const currentQuestion = availableQuestions[questionIndex];

	console.log(availableQuestions)
	console.log(currentQuestion)
	console.log(selectedChoice.innerText)
	
	const isCorrect = selectedChoice.innerText == currentQuestion.correct_answer;

	if (isCorrect) {
		incrementScore(CORRECT_BONUS);
		selectedChoice.parentElement.classList.add('correct');
	} else {
		selectedChoice.parentElement.classList.add('incorrect');
	}

	setTimeout(() => {
		selectedChoice.parentElement.classList.remove('correct', 'incorrect');
		getNewQuestion();
		acceptingAnswers = true;
	}, 600)
}

// Increment the score and update the UI
const incrementScore = (num) => {
	score += num;
	scoreFieldElement.innerText = score;
}

// Add event listeners to answer choices
choiceElements.forEach(choice => {
	choice.addEventListener('click', handleAnswerSelection)
})

// start the game when the page is loaded
document.addEventListener('DOMContentLoaded', startGame);
// let questions = [];

// fetch(questionUrl)
// .then( res => {
//     console.log(res.json());
//     return res.json();
// })
// .then(questionsLoaded => {
//     console.log(questionsLoaded.results)
//     firstQuestions = questionsLoaded.results.length;
//     questions = questionsLoaded.results.map(questionsLoaded => {
//         const formattedQuestion = {
//             Question: questionLoaded.question
//         };
//         console.log(formattedQuestion);
//         const answerChoices = [...questionLoaded.incorrect_answers];
//         formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
//         answerChoices.splice(formattedQuestion.answer -1, 0, questionLoaded.correct_answer);

//         answerChoices.forEach((choice, index) => {
//             formattedQuestion["choice" + (index-1)] = choice
//         })
//         return formattedQuestion
//     })
//     console.log(questions, 'questions')
//     startGame()
// })
// .catch(err => {
//      console.error(' >> Failed to get API ')
// })

// startGame = () => {
//     questionCounter = 0;
//     score = 0;
//     availableQuestions = [...questions];
//     console.log(availableQuestions);
//     getNewQuestion();
// }

// // when we getNewQuestion we want to increment questionCounter, 
// // and get the questions randomly
// getNewQuestion = () => {
//     if(availableQuestions === 0 || questionCounter >= max_Questions){
//         localStorage.setItem('recentScore', score)
//         // go to the end page
//         return window.location.assign("./end.html");
//     }
//     questionCounter++;
//     progressText.innerText = `Question: ${questionCounter}/${max_Questions}`;
//     // We update the progress bar
//     console.log( questionCounter/ max_Questions )
//     progressBarFull.style.width = `${(questionCounter/ max_Questions) * 100}%`
//     console.log(progressBarFull.style.width)
//     const questionIndex = Math.floor(Math.random() * availableQuestions.length);
//     currentQuestion = availableQuestions[questionIndex];
//     question.innerText = currentQuestion.Question;
//     choices.forEach( choice => {
//         const number = choice.dataset['number'];
//         console.log(currentQuestion[number])
//         choice.innerText = currentQuestion['choice' + number];
//       // the 'choice' + number here = keys for choicees as in the object NB case is highly sensitive
//     })
//     availableQuestions.splice(questionIndex, 1);
//     // console.log(availableQuestions);
//     acceptingAnswers = true;
// }

// choices.forEach(choice => {
//     choice.addEventListener("click", e => {
//         if(!acceptingAnswers) return;

//         acceptingAnswers = false;
//         const selectedChoice = e.target;
//         const selectedAnswer = selectedChoice.dataset["number"];
//         const applyClass = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

//         if(applyClass === 'correct') {
//             incrementScore(CORRECT_BONUS)
//         }
//         selectedChoice.parentElement.classList.add(applyClass);
//         setTimeout(() => {
//             selectedChoice.parentElement.classList.remove(applyClass);
//             getNewQuestion()
//         }, 600)
//     });
// })

// incrementScore = num => {
//     score += num;
//     scoreField.innerText = score;
// }

