const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const progressText = document.querySelector(".hud-prefix");
const loader = document.getElementById("loader"); // Get the spinner element

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

// CONSTANTS
const correct_bonus = 10;
const max_questions = 15; // Changed this to 15 to use all 15 questions

// Load questions from Trivia DB API
let questions = [];

// Show the spinner while fetching questions initially
loader.style.display = "block";

fetch(
  "https://opentdb.com/api.php?amount=15&category=9&difficulty=medium&type=multiple"
)
  .then((response) => response.json())
  .then((data) => {
    // Transform the API response into the desired format
    questions = data.results.map((question) => {
      const formattedQuestion = {
        question: question.question,
        choice1: question.incorrect_answers[0],
        choice2: question.incorrect_answers[1],
        choice3: question.incorrect_answers[2],
        choice4: question.correct_answer,
        answer: 4, // Correct answer is always the 4th choice
      };

      // Shuffle the choices to randomize the correct answer position
      const choices = [
        formattedQuestion.choice1,
        formattedQuestion.choice2,
        formattedQuestion.choice3,
        formattedQuestion.choice4,
      ];
      const shuffledChoices = shuffleArray(choices);

      // Update the formatted question with shuffled choices
      formattedQuestion.choice1 = shuffledChoices[0];
      formattedQuestion.choice2 = shuffledChoices[1];
      formattedQuestion.choice3 = shuffledChoices[2];
      formattedQuestion.choice4 = shuffledChoices[3];

      // Update the answer index based on the shuffled choices
      formattedQuestion.answer =
        shuffledChoices.indexOf(question.correct_answer) + 1;

      return formattedQuestion;
    });

    // Hide the spinner and start the game
    loader.style.display = "none";
    startGame();
  })
  .catch((error) => {
    console.error("Error loading questions:", error);
    loader.style.display = "none"; // Hide the spinner in case of an error
  });

// Helper function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions]; // Copy questions array
  getNewQuestion();
  Gamepad.classList.remove("hidden");
  loader.classList.add("hidden");
};

getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= max_questions) {
    localStorage.setItem("mostRecentScore", score);
    // Handle the end of the quiz
    console.log("Quiz over!");
    return window.location.assign("/end.html");
  }

  // Show the spinner before loading the next question
  loader.style.display = "block";

  // Simulate a delay before loading the next question
  setTimeout(() => {
    loader.style.display = "none"; // Hide the spinner

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
  }, 1000); // Adjust the delay as needed (1 second in this case)
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
