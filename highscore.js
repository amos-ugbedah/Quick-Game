const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

highScores.map((score) => {
  console.log(
    <li class="high-score">
      '${score.name}-${score.score}'
    </li>
  );
});
