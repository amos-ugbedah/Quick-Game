const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const progressText = document.querySelector(".hud-prefix"); // Adjusted to match your HTML

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [
  {
    question: "Inside which HTML element do we put the Javascript?",
    choice1: "<script>",
    choice2: "<javascript>",
    choice3: "<js>",
    choice4: "<scripting>",
    answer: 1,
  },
  {
    question: "What is the correct syntax for referring to an external script called 'xxx.js'?",
    choice1: "<script href='xxx.js'>",
    choice2: "<script name='xxx.js'>",
    choice3: "<script src='xxx.js'>",
    choice4: "<script file='xxx.js'>",
    answer: 3,
  },
  {
    question: "How do you write 'Hello World' in an alert box?",
    choice1: "msgBox('Hello World');",
    choice2: "alertBox('Hello World');",
    choice3: "msg('Hello World');",
    choice4: "alert('Hello World');",
    answer: 4,
  },
  {
    question: "What stack is Ugbedah Amos presently into?",
    choice1: "Backend Web Dev;",
    choice2: "Software Engineer;",
    choice3: "Frontend Web Dev;",
    choice4: "Frontend Software Dev;",
    answer: 3,
  },
  {
    question: "Amos is a proud student of ______ Tech Academy?",
    choice1: "Developers;",
    choice2: "Vincent Adeola Matthew;",
    choice3: "Mentorship;",
    choice4: "VAMSNET;",
    answer: 4,
  },
];

// CONSTANTS
const correct_bonus = 10;
const max_questions = 5;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions]; // Copy questions array
  getNewQuestion();
};

getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= max_questions) {
      localStorage.setItem('mostRecentScore', score);
    // Handle the end of the quiz
    console.log("Quiz over!");
    return window.location.assign("/end.html");
  }

  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${max_questions}`; // Update progress text
  scoreText.innerText = score; // Update score

  // Update progress bar
  progressBarFull.style.width = `${(questionCounter / max_questions) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1); // Remove the question from the available questions
  acceptingAnswers = true; // Reset acceptingAnswers to true for the new question
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false; // Prevent multiple clicks
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    // Check if the selected answer is correct
    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
    selectedChoice.parentElement.classList.add(classToApply);

    // Update score if the answer is correct
    if (classToApply === "correct") {
      score += correct_bonus;
      scoreText.innerText = score; // Update score in the HUD
    }

    // Wait for a short delay (e.g., 1 second) before loading the next question
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply); // Remove the feedback class
      getNewQuestion(); // Load the next question
    }, 1000);
  });
});

startGame();