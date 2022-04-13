const $form = document.querySelector('#form');
const $timer = document.querySelector('#timer');
const $tbody = document.querySelector('#table tbody');
const $result = document.querySelector('#result');
let row = 10; // 줄
let cell = 10;  // 칸
let mine = 10;
const CODE = {
  NORMAL: -1, // 닫힌 칸(지뢰 없음)
  QUESTION: -2,
  FLAG: -3,
  QUESTION_MINE: -4,
  FLAG_MINE: -5,
  MINE: -6,
  OPENED: 0, // 0 이상이면 다모두 열린 칸
};

let data;
let openCount;
let startTime;
let interval;
const dev = true; 

function onsubmit(event) {
  event.preventDefault();
  console.log(event);
  console.log(event.target.row);
  row = parseInt(event.target.row.value); // event.target 으로 id에 접근할수있다
  cell = parseInt(event.target.cell.value);
  mine = parseInt(event.target.mine.value);
  openCount = 0;
  $tbody.innerHTML = '';
  startTime = new Date();
  interval = setInterval(() => {
    const time = Math.floor((new Date() - startTime) / 1000);
    $timer.textContent = `${time}초`;
  }, 500);
  drawTable();
}

$form.addEventListener('submit', onsubmit);






function countMine(rowIndex, cellIndex) {
  const mines = [CODE.MINE, CODE.QUESTION_MINE, CODE.FLAG_MINE];
  let i = 0;
  mines.includes(data[rowIndex - 1]?.[cellIndex - 1]) && i++;
  /* 
  ?. 는 뭘까?  예를들어 data[0][0]을 선택했을때를 가정하면 
  data[-1]까지는 가능하지만 (배열에 없는인덱스는 undefined를 리턴)
  여기선 data[-1][-1] 리턴값을 가져온다 이것은 undefined[-1]와 같기때문에 에러가난다
  따라서 if(data[-1]){ data[-1][-1]} 로 보호를 한번 해줘야한다 
  이 과정은 자바스크립트에서 많이 쓰이기때문에 ?. 로 따로 간편식을 만들어줫다 
  */
  mines.includes(data[rowIndex - 1]?.[cellIndex]) && i++;
  mines.includes(data[rowIndex - 1]?.[cellIndex + 1]) && i++;
  mines.includes(data[rowIndex][cellIndex - 1]) && i++;
  mines.includes(data[rowIndex][cellIndex + 1]) && i++;
  mines.includes(data[rowIndex + 1]?.[cellIndex - 1]) && i++;
  mines.includes(data[rowIndex + 1]?.[cellIndex]) && i++;
  mines.includes(data[rowIndex + 1]?.[cellIndex + 1]) && i++;
  return i;

}

function open(rowIndex, cellIndex){
  if (data[rowIndex]?.[cellIndex] >= CODE.OPENED) return; //한번 연 칸은 다시 못열게 한다 최적화하기
  const target = $tbody.children[rowIndex]?.children[cellIndex]; // 클릭한 주변 데이터랑 연결하기? 복습할때 보니까 주변데이터랑 연결하는게아니라 주변데이타가 인수로 들어가면 주변데이터가 row undefined 에  cell 을 찾는거 일수도 있으니까 그럼 에러가나니까 target을 옵셔널체이닝으로 다시설정해준다
  if (!target){
    return;
  }
  const count = countMine(rowIndex, cellIndex); //여기서부터는 위에 에러나는경우 정지했으니 그냥 매개변수 를 써도됨 
  target.textContent = count || ""; // ?? 연산자는 null, undefined 가 아니면 앞에꺼 실행 
  target.className = 'opened';
  data[rowIndex][cellIndex] = count;
  openCount ++;
  console.log(openCount);
  if(openCount === row * cell - mine){
    const time = Math.floor((new Date() - startTime) / 1000);
    clearInterval(interval);
    $tbody.removeEventListener('contextmenu', onRightClick);
    $tbody.removeEventListener('click', onLeftClick);
    setTimeout(() => {
      alert(`승리하셨습니다! ${time}초가 걸렸습니다.`);
    }, 0);
  }
  return count;
}

function openAround(rI, cI) {
  /*
  단순히 오픈한 주변만 여는게아니라 재귀함수를 사용해서 오픈한 주변에 주변까지 검사해서 열기 
  Maximum call stack size exceeded at Array.includes 에러
  최대 호출스택 사이즈가 초과했다는 오류조심 >메모장 
  */
  setTimeout(() => {
    const count = open(rI, cI);
    if (count === 0) {
      openAround(rI - 1, cI - 1);
      openAround(rI - 1, cI);
      openAround(rI - 1, cI + 1);
      openAround(rI, cI - 1);
      openAround(rI, cI + 1);
      openAround(rI + 1, cI - 1);
      openAround(rI + 1, cI);
      openAround(rI + 1, cI + 1);
    }
  }, 0);
}

/*
function openAround(rI, cI) { // 주변에 지뢰가 있으면 클릭한칸만열고 없으면 주변모두 열기
  const count = open(rI, cI);
  if (count === 0) {
    open(rI - 1, cI - 1);
    open(rI - 1, cI);
    open(rI - 1, cI + 1);
    open(rI, cI - 1);
    open(rI, cI + 1);
    open(rI + 1, cI - 1);
    open(rI + 1, cI);
    open(rI + 1, cI + 1);
  }
}
*/

function onRightClick(event) {
  event.preventDefault();
  const target = event.target;
  const rowIndex = target.parentNode.rowIndex;
  const cellIndex = target.cellIndex;
  const cellData = data[rowIndex][cellIndex];
  // 여기서 물음표지뢰 깃발지뢰로 따로 데이터를 나눈이유가 나옴, 지뢰를 가지고있는 물음표 깃발로 따로 데이터 정리를 하지않으면 물음표, 깃발이 지뢰를 가지고있는지 아닌지 정보를 잃어버림
  if (cellData === CODE.MINE) { // 지뢰면
    data[rowIndex][cellIndex] = CODE.QUESTION_MINE; // 물음표 지뢰로 +데이터먼저바꾸고 데이터에따라 화면을 바꿔야한다
    target.className = 'question';
    target.textContent = '?';
  } else if (cellData === CODE.QUESTION_MINE) { // 물음표 지뢰면
    data[rowIndex][cellIndex] = CODE.FLAG_MINE; // 깃발 지뢰로
    target.className = 'flag';
    target.textContent = '!';
  } else if (cellData === CODE.FLAG_MINE) { // 깃발 지뢰면 
    data[rowIndex][cellIndex] = CODE.MINE; // 지뢰로 
    target.className = '';
    target.textContent = 'X';
  } else if (cellData === CODE.NORMAL) { // 닫힌 칸이면 +화면은 같지만 데이터는 다르다 데이터가 달라야 (지뢰의 데이터를 가지고 있어야)나중에 지뢰로 돌아올수있다
    data[rowIndex][cellIndex] = CODE.QUESTION; // 물음표로
    target.className = 'question';
    target.textContent = '?';
  } else if (cellData === CODE.QUESTION) { // 물음표면
    data[rowIndex][cellIndex] = CODE.FLAG; // 깃발으로
    target.className = 'flag';
    target.textContent = '!';
  } else if (cellData === CODE.FLAG) { // 깃발이면
    data[rowIndex][cellIndex] = CODE.NORMAL; // 닫힌 칸으로
    target.className = '';
    target.textContent = '';
  }
}

function onLeftClick(event) {
  const target = event.target;
  const rowIndex = target.parentNode.rowIndex;
  const cellIndex = target.cellIndex;
  const cellData = data[rowIndex][cellIndex]; // 사용자가 클릭한 화면과 데이터를 연결한다 이것을 잘해야함
  if (cellData === CODE.NORMAL) { // 닫힌 칸이면
    openAround(rowIndex, cellIndex);
  } else if (cellData === CODE.MINE) {// 지뢰 칸이면 
    target.textContent = '펑';
    target.className = 'opened';
    $tbody.removeEventListener('contextmenu', onRightClick);
    $tbody.removeEventListener('click', onLeftClick);
    clearInterval(interval);
  }
  // 물음표 or 깃발 아무 동작도 안함 
}

function plantMine() {
  const candidate = Array(row * cell).fill().map((arr, i) => {
    return i;
  }); // 0~99 까지의 100개의 배열 만들기 
  const shuffle = [];
  while (candidate.length > row * cell - mine) { // 지뢰자리 10개 무작위로 뽑기
    const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
    shuffle.push(chosen);
  }
  const data = [];
  for (let i = 0; i < row; i++) { // 이차원배열 데이터 만들기
    const rowdata = [];
    data.push(rowdata);
    for (let j = 0; j < cell; j++) {
      rowdata.push(CODE.NORMAL);
    }
  }
  // [85, 19, 93, 15, 1, 4, 7, 45, 35, 7] 
  for (let k = 0; k < shuffle.length; k++) { // 이차원배열에서 지뢰자리 지정하기 복잡하다. flat()으로 나열해서 지정도가능
    const ver = Math.floor(shuffle[k] / cell); // 가로열 
    const hor = shuffle[k] % cell; // 세로열
    data[ver][hor] = CODE.MINE;
  }
  /*
  const data2 = data.flat(); // 일차원배열에서 지뢰자리 주기 어떻게하지?
  console.log(data2);
  for (let k = 0; k < shuffle.length; k++){
      data2[shuffle[k]] = CODE.MINE;
  }
  data2.reduce((a, c, i) => {return a[i] = a[i];}, []);
  console.log(data2);
  */
  return data;
}
function drawTable() {
  data = plantMine();
  console.log(data)
  data.forEach((row) => { // 화면에 데이터 넣기
    const $tr = document.createElement('tr');
    row.forEach((cell) => {
      const $td = document.createElement('td');
      if (cell === CODE.MINE) {
        $td.textContent = 'X'; //개발 편의를위해
      }
      $tr.append($td);
    });
    $tbody.append($tr);
  });
  $tbody.addEventListener('contextmenu', onRightClick);
  $tbody.addEventListener('click', onLeftClick);
}
