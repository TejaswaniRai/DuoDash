
let playerScore=0, computerScore=0, draws=0;

function playerPick(playerMove){
  const moves=["rock","paper","scissors"];
  const computerMove = moves[Math.floor(Math.random()*3)];
  showChoices(playerMove, computerMove);

  let result;
  if(playerMove===computerMove){
    draws++;
    result="It's a Draw!";
  } else if(
    (playerMove==="rock" && computerMove==="scissors") ||
    (playerMove==="paper" && computerMove==="rock") ||
    (playerMove==="scissors" && computerMove==="paper")
  ){
    playerScore++;
    result="You Win!";
  } else {
    computerScore++;
    result="Computer Wins!";
  }
  updateScores();
  document.getElementById('resultText').textContent = result;
}

function showChoices(playerMove, computerMove){
  document.getElementById('playerChoice').textContent=emoji(playerMove);
  document.getElementById('computerChoice').textContent=emoji(computerMove);
}

function emoji(move){
  if(move==="rock") return "✊";
  if(move==="paper") return "✋";
  if(move==="scissors") return "✌️";
  return "?";
}

function updateScores(){
  document.getElementById('playerScore').textContent=playerScore;
  document.getElementById('computerScore').textContent=computerScore;
  document.getElementById('draws').textContent=draws;
}

function resetGame(){
  playerScore=0; computerScore=0; draws=0;
  updateScores();
  document.getElementById('playerChoice').textContent="?";
  document.getElementById('computerChoice').textContent="?";
  document.getElementById('resultText').textContent="VS";
}
