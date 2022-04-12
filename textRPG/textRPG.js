const $startScreen = document.querySelector('#start-screen');
const $gameMenu = document.querySelector('#game-menu');
const $battleMenu = document.querySelector('#battle-menu');
const $heroName = document.querySelector('#hero-name');
const $heroLevel = document.querySelector('#hero-level');
const $heroHp = document.querySelector('#hero-hp');
const $heroXp = document.querySelector('#hero-xp');
const $heroAtt = document.querySelector('#hero-att');
const $message = document.querySelector('#message');
const $monsterName = document.querySelector('#monster-name');
const $monsterHp = document.querySelector('#monster-hp');
const $monsterAtt = document.querySelector('#monster-att');

// 초기메뉴 실행
$startScreen.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = event.target['name-input'].value;
  $startScreen.style.display = 'none';
  $gameMenu.style.display = 'block';
  $heroName.textContent = name;
  $heroLevel.textContent = `${hero.lev}Lev`;
  $heroHp.textContent = `${hero.hp}/${hero.maxHP}HP`;
  $heroXp.textContent = `${hero.xp}/${15 * hero.lev}XP`;
  $heroAtt.textContent = `ATT: ${hero.att}`;
});

// 게임메뉴 실행
$gameMenu.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = event.target['menu-input'].value;
  $gameMenu.style.display = 'none';
  $battleMenu.style.display = 'block';
  if (input === '1') { // 모험
    monster = JSON.parse(JSON.stringify(monsterList[Math.floor(Math.random() * monsterList.length)]))
    console.log(monster);
    monster.maxHP = monster.hp;
    $monsterName.textContent = monster.name;
    $monsterHp.textContent = `${monster.hp}/${monster.maxHP}HP`;
    $monsterAtt.textContent = `ATT: ${monster.att}`;
    event.target['menu-input'].value = '';
  } else if (input === '2') { // 휴식

  } else if (input === '2') { // 종료

  } else {
    return;
  }
})

//전투메뉴 실행
$battleMenu.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = event.target['battle-input'].value;
  if (input === '1'){ //공격
    hero.attack(monster);
    $heroHp.textContent = `${hero.hp}/${hero.maxHP}HP`;
    $monsterHp.textContent = `${monster.hp}/${monster.maxHP}HP`;
    $message.textContent = `${hero.att}의 데미지를 주고, ${monster.att}의 데미지를 받았다`;
  } else if (input === '2'){ //회복

  } else if (input === '3'){ //도망
    
  }
})

// 주인공,  몬스터 만들기
const hero = {
  name: '',
  lev: 1,
  maxHP: 100,
  hp: 100,
  xp: 0,
  att: 10,
  attack(monster){
    monster.hp -= this.att;
    this.hp -= monster.att;
  },
  heal(monster){
    this.hp += 20;
    this.hp -= monster.att;
  },
};

let monster = null;
const monsterList = [
  { name: '슬라임', hp: 25, att: 10, xp: 10 },
  { name: '스켈레톤', hp: 50, att: 15, xp: 20 },
  { name: '마왕', hp: 150, att: 35, xp: 50 },
]

