/* 1차 복습 피드백 
이차원 배열을 만들때 데이터에 만든태그를 직접 넣을수있다
태그 화면이 바뀔때마다 데이터를 바꿀 필요없이 직접 태그를 데이터에 넣을수있으니
화면이바뀌면 데이터안에 태그내용도 바뀐다(참조관계). 하지만 데이터내용태그를바꾼다해도 화면을 바꾸지않으면 안됨 

every 메서드를이용해서 


*/

const $table = document.createElement('table');
const $td = document.querySelector('td');
const data = []
let turn = 'O'

function 이차원배열만들기() {
  for (let i = 0; i < 3; i++) {
    const $tr = document.createElement('tr');
    const dataCells = [];
    data.push(dataCells);
    $table.appendChild($tr);
    for (let j = 0; j < 3; j++) {
      const $td = document.createElement('td');
      dataCells.push($td);
      $tr.appendChild($td);
    }
  }
  $table.addEventListener('click', clickEvent);
  document.body.append($table);
}
이차원배열만들기();

let 이미이겻냐 = false;
let 컴턴끝낫냐 = true;

function clickEvent(event) {
  if (event.target.textContent) return; 
  if (!컴턴끝낫냐) return;
  event.target.textContent = turn;
  checkWinnerAndDraw(event.target);
  컴턴끝낫냐 = false;
  setTimeout(() => {
    if(turn === 'X'){
      const emptyCells = data.flat().filter((v) => !v.textContent);
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      randomCell.textContent = turn;
      checkWinnerAndDraw(randomCell);
      console.log(randomCell);
      컴턴끝낫냐 = true;  
    }
  }, 500);
}



function checkWinnerAndDraw(target) {
  const haswinner = 이겼나확인하기(target);
  if (haswinner) {
    document.body.append(`${target.textContent}님이 승리하셨습니다`);
    $table.removeEventListener('click', clickEvent);
    return;
  }
  const draw = data.flat().every((el) =>  el.textContent );
  
  
  

  if (draw) {
    document.body.append('무승부입니다');
    return;
  }
  turn === 'O' ? turn = 'X' : turn = 'O';
}




function 이겼나확인하기(target) {
  const cells = target.cellIndex;
  const row = target.parentNode.rowIndex;
  if (data[row][0].textContent === turn && data[row][1].textContent === turn && data[row][2].textContent === turn) {// 가로줄검사
    return true;
  }
  if (data[0][cells].textContent === turn && data[1][cells].textContent === turn && data[2][cells].textContent === turn) {// 가로줄검사
    return true;
  }
  if (data[0][0].textContent === turn && data[1][1].textContent === turn && data[2][2].textContent === turn) {// 대각선검사
    return true;
  }
  if (data[0][2].textContent === turn && data[1][1].textContent === turn && data[2][0].textContent === turn) {// 대각선검사
    return true;
  }
  return false;
}