/*
* Author: Spencer J
* Purpose: Handling ui element of the quiz
*/

const startButton = document.getElementById("btn-start");
const statusText = document.getElementById("splash-status");
const amountSelect = document.getElementById("select-amount");
const difficultySelect = document.getElementById("select-difficulty");
const categorySelect = document.getElementById("select-category");

const splashScreen = document.getElementById("screen-splash");
const quizScreen = document.getElementById("screen-quiz");
const resultsScreen = document.getElementById("screen-results");

const quizProgress = document.getElementById("quiz-progress");
const quizQuestion = document.getElementById("quiz-question");
const quizAnswers = document.getElementById("quiz-answers");
const nextButton = document.getElementById("btn-next");

const resultsScore = document.getElementById("results-score");
const resultsList = document.getElementById("results-list");
const restartButton = document.getElementById("btn-restart");

//state
let questions = [];
let index = 0;
let score = 0;
let selectedAnswer = null;


const answerButtons = [];
// create 4 reusable answer buttons for each option
for (let i = 0; i < 4; i++) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "answer-btn";
  btn.addEventListener("click", onAnswerClick);
  quizAnswers.appendChild(btn);
  answerButtons.push(btn);
}

startButton.addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
restartButton.addEventListener("click", restartQuiz);

async function startQuiz() {

  const settings = {
    amount: Number(amountSelect.value),
    difficulty: difficultySelect.value,
    category: categorySelect.value
  };

  startButton.disabled = true;
  statusText.textContent = "Loading questions...";
  statusText.classList.remove("hidden");
 
  try {
    questions = await fetchQuestions(settings);
    index = 0;
    score = 0;

    splashScreen.classList.add("hidden");
    resultsScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    renderQuestion();
  } catch (err) {
    statusText.textContent = "Failed to load questions: " + err.message;
  } finally {
    startButton.disabled = false;
  }
}

function renderQuestion() {
  const q = questions[index];

  selectedAnswer = null;
  nextButton.disabled = true;

  quizProgress.textContent =
    "Question " + (index + 1) + " of " + questions.length;

  quizQuestion.textContent = q.question;

  for (let i = 0; i < 4; i++) {
    answerButtons[i].textContent = q.answers[i];
    answerButtons[i].classList.remove("selected");
  }
}

function onAnswerClick(e) {
  selectedAnswer = e.target.textContent;
  nextButton.disabled = false;

  for (let i = 0; i < 4; i++) {
    if (answerButtons[i].textContent === selectedAnswer) {
      answerButtons[i].classList.add("selected");
    } else {
      answerButtons[i].classList.remove("selected");
    }
  }
}

function nextQuestion() {
  const q = questions[index];
  q.selectedAnswer = selectedAnswer;

  if (selectedAnswer === q.correctAnswer) {
    score++;
  }

  index++;

  if (index < questions.length) {
    renderQuestion();
    return;
  }

  showResults();
}

function showResults() {
  quizScreen.classList.add("hidden");
  resultsScreen.classList.remove("hidden");

  resultsScore.textContent =
    "Score: " + score + " / " + questions.length;

  resultsList.innerHTML = "";

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const correct = q.selectedAnswer === q.correctAnswer;

    const div = document.createElement("div");
    div.className = "result-item";

    div.innerHTML =
      "<div><strong>Q" + (i + 1) + ":</strong> " + q.question + "</div>" +
      "<div class='" + (correct ? "correct" : "wrong") +
      "'>Your answer: " + q.selectedAnswer + "</div>" +
      "<div>Correct answer: " + q.correctAnswer + "</div>";

    resultsList.appendChild(div);
  }
}

function restartQuiz() {
  resultsScreen.classList.add("hidden");
  quizScreen.classList.add("hidden");
  splashScreen.classList.remove("hidden");

  statusText.textContent = "";
  statusText.classList.add("hidden");
}
