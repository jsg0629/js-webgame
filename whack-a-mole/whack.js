const $timer = document.querySelector('#timer');
const $score = document.querySelector('#score');
const $game = document.querySelector('#game');
const $start = document.querySelector('#start');
const $$cells = document.querySelectorAll('.cell');
const $life = document.querySelector('#life');

const holes = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let started = false;
let time = 100;
let 목숨 = 3;
let timerId; 
let tickId;

function onClickStart() { // 시작 
  if (started) return; // 이미 시작했으면 무시 (클릭안눌리게)
  started = true;
  $life.textContent = 목숨;
  timerId = setInterval(() => {
    time = (time * 10 -1) / 10; // 소수점 계산시 문제있음 // time -= 0.1; 컴퓨터는 소수점계산을 잘못함 짜투리를남김 따라서 정수로먼저 바꾼다음에 10으로 나눠서 소수로만들었음
    $timer.textContent = time;
    if (time === 0){
      setTimeout(() => {
        clearInterval(timerId);
        clearInterval(tickId);
        alert(`게임오버! 점수는 ${score}점`)
      }, 10);
    }
  }, 100);
  tickId = setInterval(tick, 2000); // 원래 한번올라갔따 내려간 후에 1초마다 반복되야하는데 이미지가 안뜬다 왜 ?
  /*
  css에서 transition 1s 로 했기때문에 올라가는데 1초, 내려가는데 1초 
  총 2초가걸린다, 그런데 1초마다 tick을 실행시키면 remove와 (인터벌) add가 (틱함수안에 타임아웃) 동시에호출됨
  올라오려는데 동시에 두더지를 지워버리니까 보이질못함
  */
  tick();
}

let gopherPercent = 0.3; // 두더지가나올확률
let bombPercent = 0.5; // 폭탄확률 누적확률을 사용했다 
function tick() { // 두더지 or 폭탄 or 빈칸 랜덤하게 나오게하기
  holes.forEach((hole, index) => { 
    // if (hole) return; // 무언가 일어나고 있으면 return 두더지가나와있으면 holes의 요소들은 항상 0보다 크다
    const randomValue = Math.random();
    if (randomValue < gopherPercent) { //0.xxx~0.2xxxx 30%
      const $gopher = $$cells[index].querySelector('.gopher');
      holes[index] = setTimeout(() => { // hole에 넣으면 안되는게 hole은 원시값임 참조관계가아님 // 원본객체는 항상 참조관계인 변수를 통해서 접근해야함
        $gopher.classList.add('hidden');
        // console.log('add');
        holes[index] = 0;
      }, 1000);
      // console.log(holes);
      $gopher.classList.remove('hidden');
      // console.log('remove');
    } else if (randomValue < bombPercent) {// 0.3xxx~0.4xxx 20%
      const $bomb = $$cells[index].querySelector('.bomb');
      holes[index] = setTimeout(() => {
        $bomb.classList.add('hidden');
        // console.log('add');
        holes[index] = 0;
      }, 1000);
      // console.log(holes);
      $bomb.classList.remove('hidden');
      // console.log('remove');
    } else { // 0.5xxx~0.9xxx 50%
      // 아무것도안나온다
    }
  });
}

let score = 0;
$$cells.forEach(($cell, index)=>{ // 클릭했을때 이벤트 관리 함수 
  const $gopher = $cell.querySelector('.gopher');
  $gopher.addEventListener('click', (event) => { //두더지클릭할떄
    if (!event.target.classList.contains('dead')){ //점수추가 클릭한두더지 계쏙 클릭해도 점수쌓이는 오류 해결 
      console.log('dwqdw')
      score += 1;
      $score.textContent = score;
    }
    event.target.classList.add('dead');
    event.target.classList.add('hidden');
    clearTimeout(holes[index]); // 기존 내려가는 타이머 제거, 1초뒤에 사라지는게 아니라 즉시 사라져야하니까 
    setTimeout(() => {
      holes[index] = 0;
      event.target.classList.remove('dead'); // 울고있는 이미지를 제거하지않으면 다음에 올라올때도 울고있는 이미지가 나온다
    }, 1000);
  })
  $cell.querySelector('.bomb').addEventListener('click', (event) => { // 폭탄클릭할때
      if(!event.target.classList.contains('boom')){
        목숨 --;
        $life.textContent = 목숨;
        console.log(목숨);
        if(목숨 === 0){ // 목숨 0이면 게임종료 
          clearInterval(tickId);
          clearInterval(timerId);
          setTimeout(() => {
            alert(`게임오버! 점수는 ${score}점`)
          }, 10);
        }
      }
      event.target.classList.add('boom');
      event.target.classList.add('hidden');
      clearTimeout(holes[index]);
      setTimeout(() => {
        holes[index] = 0;
        event.target.classList.remove('boom'); 
      }, 1000);
  })
})


$start.addEventListener('click', onClickStart)