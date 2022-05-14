const $table = document.getElementById('table');
const $score = document.getElementById('score');
let data = [];

function startGame() { // 게임시작 데이터만들기, 테이블만들기
  const $fragment = document.createDocumentFragment();
  [1, 2, 3, 4].forEach(() => {
    const rowdata = [];
    data.push(rowdata);
    const $tr = document.createElement('tr');
    [1, 2, 3, 4].forEach(() => {
      rowdata.push(0);
      const $td = document.createElement('td');
      $tr.appendChild($td);
    })
    $fragment.appendChild($tr);
  });
  $table.appendChild($fragment);
  put2ToRandomCell();
  draw();
}

function draw(){ // 데이타 검사해서 화면에 그려넣기 
  data.forEach((rowData, i) => {
    rowData.forEach((cellData, j) => {
      const $target = $table.children[i].children[j]; // 화면과 연결
      if (cellData > 0){
        $target.textContent = cellData;
        $target.className = 'color-' + cellData;
      } else {
        $target.textContent = '';
        $target.className = '';
      }
    })
  })
}

function put2ToRandomCell() { // 데이타 빈칸중 랜덤해서 2배정
  const 빈칸 = [];
  data.forEach((row, i) => { // 데이타중에 빈칸 찾아서 빈칸배열에 넣기
    row.forEach((cell, j) => {
      if (!cell) {
        빈칸.push([i, j]);
      }
    })
  })
  const 빈칸뽑아보리기 = 빈칸[Math.floor(Math.random() * 빈칸.length)];
  data[빈칸뽑아보리기[0]][빈칸뽑아보리기[1]] = 2
}
startGame();
/*
data = [
  [32, 2, 4, 8],
  [64, 4, 8, 4],
  [2, 1024 , 1024 , 32],
  [2 , 256 , 128, 256],
]
draw();
data = [
  [2, 2 ,4 ,8],
  [2, 8, 0 , 16],
  [16, 0 , 0 , 16],
  [0 , 256 , 128, 256],
]
draw();
*/



function moveCells (direction){
  switch (direction){
    case 'left' : { 
      const newData = [[],[],[],[]];
      data.forEach((row, i) => { // 빈칸 빼고 새로운배열 만들기 >> 왼쪽으로 몰아넣은거랑 똑같은효과
        row.forEach((cell, j) => {
          if(cell){ // 빈칸 아닌것만 추가함
            const currentRow = newData[i] 
            console.log(newData[i]);
           
            // i=0, j=0 일때 []
            // i=0, j=1 일때 [2]
            // i=0, j=2 일때 [-4] 여기서 -2를 곱한게 아니였으면 한번에 합쳐버림
            // i=0, j=3 일때 [-4, 4]
            const prevData = currentRow[currentRow.length - 1]; // 왜? 예를 들어 [8, 2] 일때  값을 추가하는거니까 추가하기전에 값을 비교해서 추가하기전에 값이 추가할려는 값과 같으면 합쳐야됌 currentRow.length - 1 이 합칠 기준의 값
            if(prevData === cell){ // 이전값과 지금값이 같으면 
              const score = parseInt($score.textContent); // 점수올리기
              $score.textContent = score + currentRow[currentRow.length -1] * 2;
              currentRow[currentRow.length - 1] *= -2; // 왜 2가아닌 -2를 곱하는가?
              // currentRow 와 newData 는 참조 관계인것을 기억하자
            } else {
              newData[i].push(cell);
            }
          }
        });
      });
      console.log(newData); 
      [1, 2, 3, 4].forEach((rowData, i) => { // 기존 데이터에 복사하기 
        [1, 2, 3, 4].forEach((cellData, j) => {
          data[i][j] = Math.abs(newData[i][j]) || 0;
        });
      });
      break;
    }
    case 'right': {
      const newData = [[], [], [], []];
      data.forEach((rowData, i) => {
        rowData.forEach((cellData, j) => { 
          if (rowData[3 - j]) { // cellData는 rowData[j]와 같으므로 j가 3 - j로 바뀐 셈 오른쪽부터 검사
            console.log(rowData[3 - j]);
            const currentRow = newData[i]
            // i == 0, j == 0 일때 []
            // i == 0, j == 1 일때 [8]
            // i == 0, j == 2 일때 [8, 4]
            // i == 0, j == 3 일때 [8, 4, 2] 
            const prevData = currentRow[currentRow.length - 1];
            if (prevData === rowData[3 - j]) {
              const score = parseInt($score.textContent); // 점수올리기
              $score.textContent = score + currentRow[currentRow.length -1] * 2;
              currentRow[currentRow.length - 1] *= -2;
              // i == 0, j == 3 일때 [8, 4, -4] 
            } else { 
              newData[i].push(rowData[3 - j]);
            }
          }
        });
      });
      console.log(newData);
      [1, 2, 3, 4].forEach((rowData, i) => {
        [1, 2, 3, 4].forEach((cellData, j) => {
          data[i][3 - j] = Math.abs(newData[i][j]) || 0; // 반대로 채우기
        });
      });
      break;
    }
    // 왼, 오른쪽만 구현 너무어렵다 
    case 'up': {
      const newData = [[], [], [], []];
      data.forEach((rowData, i) => {
        rowData.forEach((cellData, j) => {
          if (cellData) {
            const currentRow = newData[j]
            // 왼쪽정렬과 비교했을때 행과 열이 바뀐다 즉 i와 j가 반대
            console.log(currentRow);
            // i = 0, j = 0 일때  [] // i = 1, j = 0 일때  [2] // i = 2, j = 0 일때 [-4]    // 
            // i = 0, j = 1 일때  [] // i = 1, j = 1 일때  [2] //                           // i = 3, j = 1 일때 [2, 8]
            // i = 0, j = 2 일때  [] //                        //                           // i = 3, j = 2 일때 [4]
            // i = 0, j = 3 일때  [] // i = 1, j = 3 일때  [8] // i = 2, j = 3 일때 [8, 16] // i = 3, j = 3 일때 [8, -32]
            const prevData = currentRow[currentRow.length - 1];
            if (prevData === cellData) {
              const score = parseInt($score.textContent); // 점수올리기
              $score.textContent = score + currentRow[currentRow.length -1] * 2;
              currentRow[currentRow.length - 1] *= -2;
              // i = 1, j = 0 일때  newData[0] === [-4]
              // i = 2, j = 3 일때  newData[3] === [8, -32] 
            } else {
              newData[j].push(cellData);
              // i = 0, j = 0 일때  newData[0] 에 2 // i = 1, j = 0 일때 
              // i = 0, j = 1 일때  newData[1] 에 2 // i = 1, j = 1 일때
              // i = 0, j = 2 일때  newData[2] 에 4 // i = 1, j = 2 일때
              // i = 0, j = 3 일때  newData[3] 에 8 // i = 1, j = 3 일때
              // i = 1, j = 1 일때  newData[1] === [2, 8] 
              // i = 1, j = 3 일때  newData[3] === [8, 16]
              // i = 2, j = 0 일때  newDate[0] === [-4, 16]
            }
          }
        });
      });
      console.log(newData);
      /*
      [-4, 16]
      [2, 8, 256]
      [4, 128]
      [8, -32, 256]
      */
      [1, 2, 3, 4].forEach((cellData, i) => {
        [1, 2, 3, 4].forEach((rowData, j) => {
          data[j][i] = Math.abs(newData[i][j]) || 0;
        });
      });
      break;
    }
    case 'down': {
      const newData = [[], [], [], []];
      data.forEach((rowData, i) => {
        rowData.forEach((cellData, j) => {
          if (data[3 - i][j]) {
            const currentRow = newData[j];
            const prevData = currentRow[currentRow.length - 1];
            if (prevData === data[3 - i][j]) {
              const score = parseInt($score.textContent); // 점수올리기
              $score.textContent = score + currentRow[currentRow.length -1] * 2;
              currentRow[currentRow.length - 1] *= -2;
            } else {
              newData[j].push(data[3 - i][j]);
            }
          }
        });
      });
      console.log(newData);
      [1, 2, 3, 4].forEach((cellData, i) => {
        [1, 2, 3, 4].forEach((rowData, j) => {
          data[3 - j][i] = Math.abs(newData[i][j]) || 0;
        });
      });
      break;
    }
  }
  if(data.flat().includes(2048)){// 승리
    draw();
    setTimeout(() => {
      alert('축하합니다. 2048을 만들었습니다!');
    }, 0);
  } else if (!data.flat().includes(0)){ // 빈 칸이 없으면 패배 > 데이터랑 화면이랑 똑같게끔 항상 맞춰왔기때문에 데이터를 검사해도 빈칸이없는지 찾을수있다
    alert(`패배했습니다 ${$score.textContent}점`);
  } else {
    put2ToRandomCell();
    draw();
  }
}

window.addEventListener('keyup', (event) => {
  if(event.key === 'ArrowUp'){
    moveCells('up');
  } else if (event.key === 'ArrowDown'){
    moveCells('down');
  } else if (event.key === 'ArrowRight'){
    moveCells('right');
  } else if (event.key === 'ArrowLeft'){
    moveCells('left');
  }
});

let 클릭했을때xy좌표;
let 뗏을때xy좌표;

window.addEventListener('mousedown', (event) => {
  클릭했을때xy좌표 = [event.clientX, event.clientY];
  console.log(클릭했을때xy좌표)
})

window.addEventListener('mouseup', (event) => {
  뗏을때xy좌표 = [event.clientX, event.clientY];
  const diffX = 뗏을때xy좌표[0] - 클릭했을때xy좌표[0];
  const diffY = 뗏을때xy좌표[1] - 클릭했을때xy좌표[1];
  if( diffX < 0 && Math.abs(diffX) > Math.abs(diffY)){ // 위오른아래왼 45도씩 4등분을 했을때 y차의 절대값이 x차의절대값보다 크면 왼쪽이아니라 아래 혹은 위이다
    moveCells('left');
  } else if( diffX > 0 && Math.abs(diffX) > Math.abs(diffY)){ 
    moveCells('right');
  } else if( diffY < 0 && Math.abs(diffX) <= Math.abs(diffY)){
    moveCells('up');
  } else if( diffY > 0 && Math.abs(diffX) <= Math.abs(diffY)){
    moveCells('down');
  } 
}) 



