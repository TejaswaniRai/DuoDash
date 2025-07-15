let cells = Array.from(document.querySelectorAll('.cell'));
let statusText = document.getElementById('status');
let winsX=0, winsO=0, draws=0;
let currentPlayer='x';
let gameActive=true;
let mode='friend';
let difficulty='easy';

function startGame(selectedMode){
  mode=selectedMode;
  if(mode==='computer'){
    difficulty=document.getElementById('difficulty').value;
  }
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');
  resetGame();
}

function resetGame(){
  cells.forEach(cell=>{
    cell.textContent='';
    cell.className='cell';
    cell.style.background='#fff';
  });
  currentPlayer='x';
  gameActive=true;
  statusText.textContent="Player X's Turn";
}

function backToMenu(){
  document.getElementById('game').classList.add('hidden');
  document.getElementById('menu').classList.remove('hidden');
}

function handleCellClick(e){
  const cell=e.target;
  if(!gameActive || cell.textContent) return;
  cell.textContent=currentPlayer.toUpperCase();
  cell.classList.add(currentPlayer);

  if(checkWin()){
    statusText.textContent=`Player ${currentPlayer.toUpperCase()} Wins!`;
    if(currentPlayer==='x') winsX++; else winsO++;
    updateScores();
    gameActive=false;
    return;
  } else if(cells.every(c=>c.textContent)){
    statusText.textContent="It's a Draw!";
    draws++;
    updateScores();
    gameActive=false;
    return;
  }

  currentPlayer=(currentPlayer==='x')?'o':'x';
  statusText.textContent=`Player ${currentPlayer.toUpperCase()}'s Turn`;

  if(mode==='computer' && currentPlayer==='o'){
    setTimeout(aiMove, 300);
  }
}

function updateScores(){
  document.getElementById('winsX').textContent=winsX;
  document.getElementById('winsO').textContent=winsO;
  document.getElementById('draws').textContent=draws;
}

function checkWin(){
  const patterns=[
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return patterns.some(p=>{
    if(cells[p[0]].textContent &&
       cells[p[0]].textContent===cells[p[1]].textContent &&
       cells[p[0]].textContent===cells[p[2]].textContent){
      p.forEach(i=>cells[i].style.background='#81ecec');
      return true;
    }
    return false;
  });
}

function aiMove(){
  let index;
  let empty = cells.map((c,i)=>c.textContent==''?i:null).filter(i=>i!==null);

  if(difficulty==='easy'){
    index=empty[Math.floor(Math.random()*empty.length)];
  } else if(difficulty==='medium'){
    index=tryToWinOrBlock('O') || tryToWinOrBlock('X') || empty[Math.floor(Math.random()*empty.length)];
  } else {
    index=bestMove();
  }

  if(index!==undefined) cells[index].click();
}

function tryToWinOrBlock(letter){
  const patterns=[
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for(let p of patterns){
    let vals=p.map(i=>cells[i].textContent);
    if(vals.filter(v=>v===letter).length===2 && vals.includes('')){
      return p[vals.indexOf('')];
    }
  }
  return null;
}

function bestMove(){
  let bestScore=-Infinity, move;
  cells.forEach((c,i)=>{
    if(!c.textContent){
      c.textContent='O';
      let score=minimax(0,false);
      c.textContent='';
      if(score>bestScore){
        bestScore=score;
        move=i;
      }
    }
  });
  return move;
}

function minimax(depth,isMax){
  let result=checkWinnerForMinimax();
  if(result==='O') return 10-depth;
  if(result==='X') return depth-10;
  if(cells.every(c=>c.textContent)) return 0;

  if(isMax){
    let best=-Infinity;
    cells.forEach((c,i)=>{
      if(!c.textContent){
        c.textContent='O';
        best=Math.max(best,minimax(depth+1,false));
        c.textContent='';
      }
    });
    return best;
  }else{
    let best=Infinity;
    cells.forEach((c,i)=>{
      if(!c.textContent){
        c.textContent='X';
        best=Math.min(best,minimax(depth+1,true));
        c.textContent='';
      }
    });
    return best;
  }
}

function checkWinnerForMinimax(){
  const patterns=[
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for(let p of patterns){
    if(cells[p[0]].textContent &&
       cells[p[0]].textContent===cells[p[1]].textContent &&
       cells[p[0]].textContent===cells[p[2]].textContent){
      return cells[p[0]].textContent;
    }
  }
  return null;
}

cells.forEach(cell=>cell.addEventListener('click', handleCellClick));
