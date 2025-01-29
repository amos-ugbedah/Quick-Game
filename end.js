const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');

// Retrieve the most recent score from localStorage
const mostRecentScore = localStorage.getItem('mostRecentScore');
finalScore.innerText = mostRecentScore;

// Retrieve high scores from localStorage or initialize an empty array if none exist
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

// Enable/disable the save button based on whether the username is filled
username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;
});

// Function to save the high score
const saveHighScore = (e) => {
    e.preventDefault(); // Prevent the form from submitting and refreshing the page

    console.log('Clicked the save button');

    // Create a score object
    const score = {
        score: mostRecentScore,
        name: username.value,
    };

    // Add the new score to the highScores array
    highScores.push(score);

    // Sort the highScores array in descending order (highest score first)
    highScores.sort((a, b) => b.score - a.score);

    // Keep only the top 5 scores (optional)
    highScores.splice(5);

    // Save the updated highScores array back to localStorage
    localStorage.setItem('highScores', JSON.stringify(highScores));

    // Optionally, redirect the user or provide feedback
    window.location.assign('/'); // Redirect to the home page
};