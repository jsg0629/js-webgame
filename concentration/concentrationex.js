const $wrapper = document.querySelector('#wrapper');

const colors = ['red', 'orange', 'yellow', 'green', 'white', 'pink'];
let cardColors = colors.concat(colors);
const shuffleColors = [];

function shuffle (){
  for (i = 0; cardColors.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * cardColors.length);
    const shuffled = cardColors.splice(randomIndex, 1);
    shuffleColors.push(shuffled[0]);
  }
}


let shuffledCard = [];
const cardLength = 12;
let clicked = [];
let completed = [];
let clickable = false;

function clickCard() {
  if(!clickable || clicked[0] === this){
    return;
  }
  this.classList.toggle('flipped');
  clicked.push(this);
  if (clicked.length !== 2) {
    return;
  }
  const firstBackColor = clicked[0].querySelector('.card-back').style.backgroundColor;
  const secondBackColor = clicked[1].querySelector('.card-back').style.backgroundColor;
  if (firstBackColor === secondBackColor) {
    clicked[0].removeEventListener('click', clickCard);
    clicked[1].removeEventListener('click', clickCard);
    completed.push(clicked[0]);
    completed.push(clicked[1]);
    clicked = [];
    if(completed.length === cardLength){
      setTimeout(() => {
        alert('다찾음 ㅊㅋ');
        $wrapper.innerHTML = '';
        cardColors = colors.concat(colors);
        shuffledCard = [];
        completed = [];
        start();
      }, 500);
    }
    return;
  }
  clickable =false;
  setTimeout(() => {
    clicked[0].classList.remove('flipped')
    clicked[1].classList.remove('flipped')
    clicked = [];
    clickable = true;
  }, 500);
}


function createCard(i) {
    const card = document.createElement('div');
    card.className = 'card';
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.style.backgroundColor = shuffleColors[i];
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    return card;
}

function start() {
  shuffle(); // 동작마다 함수설정? 함수실행 
  for(let i = 0; i < cardLength; i += 1){ // 카드태그를 만들고/ 표시하는것을 구분함
    const card = createCard(i)
    card.addEventListener('click', clickCard);
    $wrapper.appendChild(card);
  }
  document.querySelectorAll('.card').forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('flipped');
    }, 1000 + 100 * index);
  })
  setTimeout(() => { // 카드 감추기 
    document.querySelectorAll('.card').forEach((card) => {
      card.classList.remove('flipped');
    });
    clickable = true; // 버그1번 막기 
  }, 5000);
 }

start();

/* 버그 4가지 
1. 처음에 카드를 잠깐 보여 줬다가 다시 뒤집는 동안에는 카드를 클릭할 수 없어야 하는데, 카드를 클릭하면 카드가 뒤집힘.

2. 이미 짝이 맞춰진 카드를 클릭해도 카드가 다시 뒤집힙니다.

3. 한 카드를 계속 클릭 했는데 게임이 끝난다 

4. 서로 다른 네 가지 색의 카드를 연달아 클릭하면 마지막 두 카드가 앞면을 보인 채 남아 있습니다.
*/