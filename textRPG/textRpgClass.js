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

class Game {
  constructor(name) {
    this.monster = null;
    this.hero = null; // new Hero(this. name);
    this.monsterList = [
      { name: '슬라임', hp: 25, att: 10, xp: 10 },
      { name: '스켈레톤', hp: 50, att: 15, xp: 20 },
      { name: '마왕', hp: 150, att: 35, xp: 50 },
    ];
    this.start(name);
  }
  start(name){
    $gameMenu.addEventListener('submit', this.onGameMenuInput);
    $battleMenu.addEventListener('submit', this.onBattleMenuInput);
    this.changeScreen('game');
    this.hero = new Hero(this, name);
    this.updateHeroStat();

  }
  // 화면 바꾸기
  changeScreen(screen) {
    if (screen === 'start') {
      $startScreen.style.display = 'block';
      $gameMenu.style.display = 'none';
      $battleMenu.style.display = 'none';
    } else if (screen === 'game') {
      $startScreen.style.display = 'none';
      $gameMenu.style.display = 'block';
      $battleMenu.style.display = 'none';
    } else if (screen === 'battle') {
      $startScreen.style.display = 'none';
      $gameMenu.style.display = 'none';
      $battleMenu.style.display = 'block';
    }
  }
  // 게임 메뉴 실행
  onGameMenuInput = (event) => {
    event.preventDefault();
    const input = event.target['menu-input'].value;
    if (input === '1') { // 모험
      event.target['menu-input'].value = '';
      this.changeScreen('battle');
      const randomIndex = Math.floor(Math.random() * this.monsterList.length);
      const randomMonster = this.monsterList[randomIndex];
      this.monster = new Monster(
        this,
        randomMonster.name,
        randomMonster.hp,
        randomMonster.att,
        randomMonster.xp,
      );
      this.updateMonsterStat();
      this.showMessage(`몬스터와 마주쳤다. ${this.monster.name}인 것 같다!`);
    } else if (input === '2') { // 휴식
        this.hero.hp = this.hero.maxHP
        this.updateHeroStat();
        this.showMessage('충분한 휴식을 취했다.')
        console.log()
    } else if (input === '3') { // 종료
      this.showMessage('');
      this.quit();
    }
    event.target['menu-input'].value = '';
  } 
  /* 
  화살표함수를 쓰는이유 
  그냥 함수를 넣으면 에러가나온다 
  원래 이곳에서의 this는 game-menu form 이다. 
  form.changeScreen(); 하니까 에러가 나는것.
  this 는 계속 바뀐다. addEventListener 에 함수를 쓰는경우 this 는 
  addEventListener 를 달은 태그이다 
  근데 화살표 함수를 쓰면 바깥쪽 this를 그대로 가져오기때문에 this가 불일치하는것을 
  해결할수있다.
  this는 거의 정해져있다기보단 호출할때 결정이된다.
  */
  // 베틀 메뉴 실행
  onBattleMenuInput = (event) => {
    event.preventDefault();
    const input = event.target['battle-input'].value;
    if (input === '1') { // 공격
      const { hero, monster} = this;
      hero.attack(monster);
      monster.attack(hero);
      // 히어로가 전사했을때
      if (hero.hp <= 0){
        this.showMessage(`${hero.lev} 레벨에서 전사, 새 주인공을 설정하세요`);
        this.quit();
        // 몬스터를 잡았을때
      } else if (monster.hp <= 0){
        this.showMessage(`몬스터를 잡아 ${monster.xp} 경험치를 얻었다.`);
        hero.getXp(monster.xp);
        this.monster = null;
        this.changeScreen('game');
      } else { // 전투 진행 중 
        this.showMessage(`${hero.att}의 데미지를 주고, ${monster.att}의 데미지를 받았다.`);
      }
      this.updateHeroStat();
      this.updateMonsterStat();
    } else if (input === '2') { // 회복
      const { hero, monster} = this;
      let 회복;
      if(hero.hp + 20 <= hero.maxHP){
        회복 = 15;
      } else {
        회복 = hero.maxHP - hero.hp;
      }
      hero.hp = Math.min(hero.maxHP, hero.hp + 15); // 두인수중 더 낮은값이 내 체력
      monster.attack(hero);
      this.showMessage(`${회복}체력을 회복했다! ${monster.att}데미지를 받았다.`);
      this.updateHeroStat();
      if (this.hero.hp <= 0){
        this.showMessage(`${this.hero.lev} 레벨에서 전사, 새 주인공을 설정하세요`);
        this.quit();
        // 몬스터를 잡았을때
      } 
    } else if (input === '3') { // 도망
      this.changeScreen('game');
      this.showMessage('부리나케 도망쳤다!');
      this.monster = null;
      this.updateMonsterStat();
    }
    event.target['battle-input'].value = '';
  }
  // 히어로 스탯 업데이트
  updateHeroStat(){
    const { hero } = this;
    if (hero === null) {
      $heroName.textContent = '';
      $heroLevel.textContent = '';
      $heroHp.textContent = '';
      $heroXp.textContent = '';
      $heroAtt.textContent = '';
      return;
    }
    $heroName.textContent = hero.name;
    $heroLevel.textContent = `${hero.lev}Lv`;
    $heroHp.textContent = `HP: ${hero.hp}/${hero.maxHP}`;
    $heroXp.textContent = `XP: ${hero.xp}/${15 * hero.lev}`;
    $heroAtt.textContent = `ATT: ${hero.att}`;
  }
  //  몬스터 스탯 업데이트
  updateMonsterStat(){
    const { monster } = this;
    if (monster === null) {
      $monsterName.textContent     = '';
      $monsterHp.textContent = '';
      $monsterAtt.textContent = '';
      return;
    }
    $monsterName.textContent = monster.name;
    $monsterHp.textContent = `HP: ${monster.hp}/${monster.maxHP}`;
    $monsterAtt.textContent = `ATT: ${monster.att}`;
  }
  showMessage(text) {
    $message.textContent = text;
  }
  quit(){
    this.hero = null;
    this.monster = null;
    this.updateHeroStat();
    this.updateMonsterStat();
    $gameMenu.removeEventListener('submit', this.onGameMenuInput);
    $battleMenu.removeEventListener('submit', this.onBattleMenuInput);
    this.changeScreen('start');
    game = null;
  }
}

// 공통 클래스
class Unit {
  constructor(game, name, hp, att, xp){
    this.game = game;
    this.name = name;
    this.maxHP = hp;
    this.hp = hp;
    this.xp = xp;
    this.att = att;
  }
  

  attack(target)  {
    target.hp -= this.att;
  }
}

class Hero extends Unit {
  constructor(game, name){
    super(game, name, 100, 10, 0); //부모클래스의 생성자 호출
    // this.game = game;
    // this.name = name;
    this.lev = 1; // 그 외 속성
    //this.maxHP = 100;
    //this.hp = 100;
    //this.xp = 0;
    //this.att = 10;
  }
  /*
  attack(target){
  target.hp -= this.att;
  }
  */
  heal(monster){
    this.hp += 20;
    this.hp -= monster.att;
  }
  getXp(xp){
    this.xp += xp; 
    if(this.xp >= this.lev * 15){ // 경험치를 다 채우면
      this.xp -= this.lev * 15;
      this.lev += 1
      this.maxHP += 5;
      this.att += 5;
      this.hp = this.maxHP;
      this.game.showMessage(`레벨얼! 레벨 ${this.lev}`);
    }
  }
}

class Monster extends Unit {
  constructor(game, name, hp, att, xp){
    super(game, name, hp, xp, att);
  }
  attack(target)  {
    super.attack(target);
    console.log('몬스터가 공격') // 부모 클래스 attack외 
  }
}


let game = null;

// 초기메뉴 실행
$startScreen.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = event.target['name-input'].value;
  event.target['name-input'].value = '';
  game = new Game(name);
});

$startScreen.addEventListener ('clcik', clickfunction);

