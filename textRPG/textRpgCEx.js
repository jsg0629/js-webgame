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
const $heroStat = document.querySelector('#hero-stat')
const $monsterStat = document.querySelector('#monster-stat')


class Start {
  constructor(영웅이름) {
    this.영웅 = null;
    this.몬스터 = null;
    this.몬스터리스트 = [
      { name: '슬라임', hp: 50, maxHP: 50, att: 5, xp: 10 },
      { name: '발록', hp: 300, maxHP: 300, att: 50, xp: 70 },
      { name: '스켈레톤', hp: 100, maxHP: 100, att: 15, xp: 30 },
    ];
    this.start(영웅이름);
  }
  start(name) {
    $gameMenu.addEventListener('submit', this.onGameMenu);
    $battleMenu.addEventListener('submit', this.onBattleMenu);
    this.화면전환('gameMenu');
    this.영웅 = new Hero(this, name);
    this.영웅정보화면출력();
  }
  onGameMenu = (event) => {
    event.preventDefault();
    if (event.target['menu-input'].value === '1') { // 모험 
      this.화면전환('battleMenu');
      const 랜덤몬스터 = JSON.parse(JSON.stringify(this.몬스터리스트[Math.floor(Math.random() * this.몬스터리스트.length)])); //깊은복사
      this.몬스터 = new Monster(
        this,
        랜덤몬스터.name,
        랜덤몬스터.hp,
        랜덤몬스터.att,
        랜덤몬스터.xp,
      );
      this.몬스터정보화면출력(this.몬스터);
      $message.textContent = `${this.몬스터.name}을 만났습니다!`
    } else if (event.target['menu-input'].value === '2') { // 휴식
      this.영웅.hp = this.영웅.maxHP;
      $message.textContent = `충분한 휴식을 취했습니다.`
      this.영웅정보화면출력();
    } else if (event.target['menu-input'].value === '3') { // 종료
      $message.textContent = ``
      this.초기화();
    }
    event.target['menu-input'].value = '';
  }
  onBattleMenu = (event) => {
    const { 영웅, 몬스터 } = this;
    event.preventDefault();
    if (event.target['battle-input'].value === '1') { // 공격
      $message.textContent = `${영웅.att}데미지를 주고, ${몬스터.att}데미지를 받았습니다`
      영웅.attack(몬스터);
      몬스터.attack(영웅);
      // 히어로가 전사했을대;
      if (영웅.hp <= 0) {
        this.화면전환('startScreen');
        $message.textContent = `${영웅.lev}LV에서 사망하셨습니다, 새로운 영웅을 생성해주세요!`;
        this.초기화();
      }
      if (몬스터.hp <= 0) {
        영웅.getXp(몬스터.xp);
        $message.textContent = `${몬스터.name}을 잡았어용!! 경험치냠냠`;
        this.몬스터 = null;
        this.화면전환('gameMenu')
      }
      this.영웅정보화면출력();
      this.몬스터정보화면출력();
    } else if (event.target['battle-input'].value === '2') { // 회복
      const { 영웅, 몬스터 } = this;
      let 회복;
      if (영웅.hp + 20 <= 영웅.maxHP) {
        회복 = 15;
      } else {
        회복 = 영웅.maxHP - 영웅.hp;
      }
      영웅.hp = Math.min(영웅.maxHP, 영웅.hp + 15); // 두인수중 더 낮은값이 내 체력
      몬스터.attack(영웅);
      $message.textContent = `${회복}회복하고 ${몬스터.att}데미지를 입었습니다`;
      this.영웅정보화면출력();
      if (영웅.hp <= 0) {
        this.화면전환('startScreen');
        $message.textContent = `${영웅.lev}LV에서 사망하셨습니다, 새로운 영웅을 생성해주세요!`;
        this.초기화();
      }
    } else if (event.target['battle-input'].value === '3') { // 도망
      this.화면전환('gameMenu');
      $message.textContent = '부리나케 도망쳤습니다'
      this.몬스터 = null;
      this.몬스터정보화면출력();
    }
    event.target['battle-input'].value = '';
  }
  화면전환(화면) {
    if (화면 === 'startScreen') {
      $startScreen.style.display = 'block';
      $gameMenu.style.display = 'none';
      $battleMenu.style.display = 'none';
      return;
    }
    if (화면 === 'gameMenu') {
      $startScreen.style.display = 'none';
      $gameMenu.style.display = 'block';
      $battleMenu.style.display = 'none';
      return;
    }
    if (화면 === 'battleMenu') {
      $startScreen.style.display = 'none';
      $gameMenu.style.display = 'none';
      $battleMenu.style.display = 'block';
    }
  }
  영웅정보화면출력() {
    const { 영웅 } = this;
    if (영웅 === null) {
      $heroName.textContent = '';
      $heroLevel.textContent = '';
      $heroHp.textContent = '';
      $heroXp.textContent = '';
      $heroAtt.textContent = '';
      return;
    }
    $heroName.textContent = 영웅.name;
    $heroLevel.textContent = `LV: ${영웅.lev}`;
    $heroHp.textContent = `HP: ${영웅.hp}/${영웅.maxHP}`;
    $heroAtt.textContent = `ATT: ${영웅.att}`;
    $heroXp.textContent = `XP: ${영웅.xp}/${영웅.lev * 15}`;
  }
  몬스터정보화면출력() {
    const { 몬스터 } = this;
    if (몬스터 === null) {
      $monsterName.textContent = '';
      $monsterHp.textContent = '';
      $monsterAtt.textContent = '';
      return;
    }
    $monsterName.textContent = 몬스터.name
    $monsterHp.textContent = `HP: ${몬스터.hp}/${몬스터.maxHP}`
    $monsterAtt.textContent = `ATT: ${몬스터.att}`
  }
  초기화() {
    this.영웅 = null;
    this.몬스터 = null;
    this.영웅정보화면출력();
    this.몬스터정보화면출력();
    $gameMenu.removeEventListener('submit', this.onGameMenu);
    $battleMenu.removeEventListener('submit', this.onBattleMenu);
    this.화면전환('startScreen');
    game = null;
  }
}



class unit {
  constructor(game, name, hp, att, xp){
    this.game = game;
    this.name = name;
    this.hp = hp;
    this.maxHP = hp;
    this.att = att;
    this.xp = xp;
  }
  attack(target){
    target.hp -= this.att
  }
}



class Hero extends unit{
  constructor(game, name) {
    super(game, name, 100, 15, 0)
    //this.game = game;
    //this.name = name;
    this.lev = 1;
    //this.maxHP = 100;
    // this.hp = 100;
    //this.xp = 0;
    //this.att = 15;
  }
  heal(monster) {
    this.hp += 15
    this.hp -= monster.att;
  }
  getXp(xp) {
    this.xp += xp;
    if (this.xp >= this.lev * 15) { // 경험치를 다 채우면
      this.xp -= this.lev * 15;
      this.lev += 1
      this.maxHP += 5;
      this.att += 5;
      this.hp = this.maxHP;
      $message.textContent = `레벨얼! 레벨 ${this.lev}`
    }
  }
}

class Monster extends unit{
  constructor(game, name, hp, att, xp) {
    super(game, name, hp, att, xp);
  }
  attack(target) {
    super.attack(target);
    console.log('몬스터가공격');
  }
}


let game = null;
// 초기메뉴 실행 
$startScreen.addEventListener('submit', (event) => {
  event.preventDefault();
  const 영웅이름 = event.target['name-input'].value;
  event.target['name-input'].value = '';
  game = new Start(영웅이름);
  console.log(game);
});