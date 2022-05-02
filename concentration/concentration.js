
const $wrapper = document.querySelector('#wrapper');
let name;
let 몇장할꺼 = parseInt(prompt('카드 개수를 짝수로 입력하세요(최대 20).'));
const colors = ['red', 'orange', 'yellow', 'green', 'white', 'pink', 'cyan', 'violet', 'gray', 'black'];
// let colorCopy = colors.concat(colors); // 그냥 10장일때 
let shuffled = [];
let colorsSlice = colors.slice(0, 몇장할꺼 / 2);
let colorCopy = colorsSlice.concat(colorsSlice);  // 기존배열에 똑같은 배열을 추가해서 새로운 배열을만듬 

function shuffle() { // 피셔-예이츠 셔플 사용 랜덤해서 색 12가지 뽑기
  for (let i = 0; colorCopy.length > 0; i += 1) {
    const randomIndex = Math.floor(Math.random() * colorCopy.length);
    const spliced = colorCopy.splice(randomIndex, 1); // 기존배열에서 인수의 값의 인덱스를 제거 리턴값을 제거된 값
    shuffled.push(spliced[0]);
    // shuffled = shuffled.concat(colorCopy.splice(randomIndex, 1));
  }
}


function createCard(i) { // div.card > div.card-inner > (div.card-front + div.card-back) //형제관계는 +
  const card = document.createElement('div');
  card.className = 'card'; // .card  생성
  const cardInner = document.createElement('div');
  cardInner.className = 'card-inner'; // .card-inner 태그 생성
  const cardFront = document.createElement('div');
  cardFront.className = 'card-front'; // .card-front 태그 생성
  const cardBack = document.createElement('div');
  cardBack.className = 'card-back'; // .card-back 태그 생성
  cardBack.style.backgroundColor = shuffled[i];
  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  card.appendChild(cardInner);
  console.log(card);
  return card;
}

let clicked = [];
let completed = [];
let clickable = false;

function onclickCard () {
  if(!clickable || completed.includes(this)  || clicked[0] === this){ // 버그 1번 막기 || 버그 2번 막기 || 버그 3번 막기
    return;
  }
  this.classList.toggle('flipped'); // 화살표함수가 아니니 this는 window가 아니고 비동기 addEventListener의 addEventListener 를 달은 태그를가르킴 
  clicked.push(this);
  if(clicked.length !== 2){// 카드가 2장이 아니면 return
    return;
  }
  // clickable= false; // 효과가 진행중인데 (색깔별로 두거나 뒤집히거나) 연속 클릭하는 4번 버그 해결 
  const firstBackColor = clicked[0].querySelector('.card-back').style.backgroundColor; // 여기서 clicked는 뒤집힌 card태그를 모아둔 배열이다.  
  const secondBackColor = clicked[1].querySelector('.card-back').style.backgroundColor;
  if (firstBackColor === secondBackColor){// 두 카드가 색깔이 같으면 
    //completed.push(clicked[0]);
    //completed.push(clicked[1]);
    completed = completed.concat(clicked);
    clicked = [];
    /*
    setTimeout(() => {
      clickable =true;
    }, 1000); // 효과가 진행중인데 (색깔별로 두거나 뒤집히거나) 연속 클릭하는 4번 버그 해결 
    */
    if (completed.length !== total){
      return;
    }
    const endTime = new Date();
    setTimeout(() => {
      alert(`축하합니다! 걸린시간:${(endTime - startTime) / 1000}`);
      resetGame();
    }, 500);
    return;
  }
  clickable = false; // 이벤트루프링으로 인한 버그 해결 
  setTimeout(() => {
    clicked[0].classList.remove('flipped');
    clicked[1].classList.remove('flipped');
    clicked = [];
    clickable = true;  // 이벤트루프링으로 인한 버그 해결 
  }, 500)
  /*
  setTimeout(() => {
    clickable =true;
  }, 1000); // 효과가 진행중인데 (색깔별로 두거나 뒤집히거나) 연속 클릭하는 4번 버그 해결 
  */
} 


let total = 몇장할꺼
let startTime; 

function startGame(){
  shuffle();
  for (let i=0; i < total; i += 1){
    const card = createCard(i);
    card.addEventListener('click', onclickCard);
    $wrapper.appendChild(card);
  }
  document.querySelectorAll('.card').forEach((card, index) => {// 초반 카드 공개
    setTimeout(() => {
      card.classList.add('flipped');
    }, 1000 + 100 * index); // 1초~ 1.index초  
  });
  setTimeout(() => { // 카드 감추기 
    document.querySelectorAll('.card').forEach((card) => {
      card.classList.remove('flipped');
    });
    startTime = new Date();
    clickable = true; // 버그1번 막기 
  }, 5000);
}



startGame();

function resetGame () {
  $wrapper.innerHTML = '';
  colorCopy = colorsSlice.concat(colorsSlice);
  console.log(colorCopy);
  shuffled = [];
  completed = [];
  startGame();
}

/* 버그 4가지 
1. 처음에 카드를 잠깐 보여 줬다가 다시 뒤집는 동안에는 카드를 클릭할 수 없어야 하는데, 카드를 클릭하면 카드가 뒤집힘.

2. 이미 짝이 맞춰진 카드를 클릭해도 카드가 다시 뒤집힙니다.

3. 한 카드를 계속 클릭 했는데 게임이 끝난다 

4. 서로 다른 네 가지 색의 카드를 연달아 클릭하면 마지막 두 카드가 앞면을 보인 채 남아 있습니다.
*/

