/*
* Author: Spencer J
* Purpose: Handling api request to Open Trivia DB and shuffling questions
* Api documentation: https://opentdb.com/api_config.php
*/
async function fetchQuestions(settings) {
  const url = buildUrl(settings);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Network error. Try again in a moment.");
  }

  const data = await response.json();

  if (data.response_code !== 0) {
    throw new Error("No questions available for these settings");
  }

  const questions = [];
  const results = data.results;

  for (let i = 0; i < results.length; i++) {
    const q = results[i];

    const answers = [];

    // correct answer first
    answers.push(decodeText(q.correct_answer));

    // add incorrect answers
    for (let j = 0; j < q.incorrect_answers.length; j++) {
      answers.push(decodeText(q.incorrect_answers[j]));
    }
    //so the first answer isnt always the correct one
    shuffleArray(answers);

    const questionObj = {
      id: i,
      question: decodeText(q.question),
      answers: answers,
      correctAnswer: decodeText(q.correct_answer),
      selectedAnswer: null
    };

    questions.push(questionObj);
  }

  return questions;
}

function buildUrl(settings) {
  const params = new URLSearchParams();

  params.set("amount", settings.amount);
  params.set("type", "multiple");

  if (settings.difficulty !== "") {
    params.set("difficulty", settings.difficulty);
  }

  if (settings.category !== "") {
    params.set("category", settings.category);
  }

  return "https://opentdb.com/api.php?" + params.toString();
}

// helper to parse html into text
function decodeText(text) {
  const ele = document.createElement("textarea");
  ele.innerHTML = text;
  return ele.value;
}

//fisher yates shuffle
function shuffleArray(arr) {
  for (let i = arr.length -1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i+1));
    let k = arr[i];
    arr[i] = arr[j];
    arr[j] = k;
  }
}