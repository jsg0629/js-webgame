
const {body} = document; // const body = document.body; const createElement = documet.createElement와 같다
//document는 객체이고 객체안에  body 가 들어있음  구조분해할당 destructuring.
// 어떤 객체의 속성과 그속성을 변수에담는 변수명이 같을때 위처럼 바꿀수있음.
const $table = document.createElement('table');
const $result = document.createElement('div');
let rowsflat = [];


const checkWinner = (target) => {
  // 어떤 칸을 클릭했을때 태그의 가로줄과 세로줄<몇번째 칸 몇번째 줄>찾기
  let rowIndex; // target.parentNode.rowIndex; 
  let cellIndex; // target.cellIndex;
  rows.forEach((row, ri) => {
    row.forEach((cell, ci) => {
      if(cell === target){
        rowIndex = ri;
        cellIndex = ci;
      }
    });
  });
  let haswinner = false; // 빙고검사 검사할땐 항상 false 로 시작 
  // 가로줄 검사 
  if (
    rows[rowIndex][0].textContent === turn &&
    rows[rowIndex][1].textContent === turn &&
    rows[rowIndex][2].textContent === turn 
  ) {
    haswinner = true;
  }
  // 세로줄 검사 
  if (
    rows[0][cellIndex].textContent === turn &&
    rows[1][cellIndex].textContent === turn &&
    rows[2][cellIndex].textContent === turn 
  ) {
    haswinner = true;
  } 
  // 대각선 검사
  if (
    rows[0][0].textContent === turn &&
    rows[1][1].textContent === turn &&
    rows[2][2].textContent === turn 
  ) {
    haswinner = true;
  }
  if (
    rows[0][2].textContent === turn &&
    rows[1][1].textContent === turn &&
    rows[2][0].textContent === turn 
  ) {
    haswinner = true;
  }
  return haswinner;
}


const checkWinnerAndDraw = (target) => {
  const hasWinner = checkWinner(target);
  // 승자가 있으면 
  if (hasWinner){
    $result.textContent = `${turn} 님이 승리`;
    $table.removeEventListener('click', callback);
    return;
  }
  // 승자가 없으면 
  const draw = rows.flat().every((cell) => cell.textContent);
  if (draw) {
    $result.textContent = '무승부';
    return;
  }
  turn = turn === 'O' ? 'X' : 'O';
};


const rows = [];
let turn = 'O';
let clickaible = true // 플래그변수 셋타임아웃버그개선
const callback = (event) => {
  if(!clickaible){
    return;
  }
   // 칸에 글자가 있으면 작동 멈추기 
  if (event.target.textContent){
    return;
  }
  event.target.textContent = turn; 
  // 승부 판단하기 
  checkWinnerAndDraw(event.target);
  clickaible = false;
  setTimeout(() => {
    if(turn === 'X'){
      const emptyCells = rows.flat().filter((v) => !v.textContent);
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      randomCell.textContent = 'X';
      checkWinnerAndDraw(randomCell);
      clickaible = true;
      /*
      const hasWinner = checkWinner(randomCell);
      //승자가 있으면 
      if(hasWinner){
        $result.textContent = `${turn} 님이 승리`;
        return;
      }
      // 승자가 없으면 
      const draw = rows.flat().every((cell) => cell.textContent);
      if (draw) {
        $result.textContent = '무승부';
        return;
      }
      turn = turn === 'X' ? 'O' : 'X';
      */
    }
  }, 1000);

};



for (let i = 0; i < 3; i++) {
  let $tr = document.createElement('tr');
  const cells = []; 
  for (let j = 0; j < 3; j++) { // 웬만하면 변수 다른변수로
    const $td = document.createElement('td');
    cells.push($td);
    // $td.addEventListener('click', callback);
    $tr.append($td);
  }
  rows.push(cells);
  $table.addEventListener('click', callback); //이벤트버블링 
  $table.append($tr);
}
body.append($table);
/*
  {
    {  ,   ,   ,  },
    {  ,   ,   ,  },
    {  ,   ,   ,  },
  }
*/
body.append($result);



