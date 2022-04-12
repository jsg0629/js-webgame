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


let 영웅;
let 몬스터리스트 = [
    { name : '슬라임', hp : 50 , maxHP : 50, att : 5, xp : 10},
    { name : '발록', hp : 300 , maxHP : 300, att : 50, xp : 70},
    { name : '스켈레톤', hp : 100 , maxHP : 100, att : 15, xp : 30},
]
let 몬스터; 

$startScreen.addEventListener('submit', (event) =>{
    event.preventDefault();
    const 영웅이름 = event.target['name-input'].value;
    event.target['name-input'].value = '';
    영웅 = 영웅생성하기(영웅이름)
    화면전환('gameMenu');
    영웅정보화면출력(영웅);
    $message.textContent = ``;
});

$gameMenu.addEventListener('submit', (event) => {
    event.preventDefault();
    if(event.target['menu-input'].value === '1'){ // 모험 
        $gameMenu.style.display = 'none';
        화면전환('battleMenu');
        몬스터 = JSON.parse(JSON.stringify(몬스터리스트[Math.floor(Math.random() * 몬스터리스트.length)])); //깊은복사 
        $monsterStat.style.display = 'block'
        몬스터정보화면출력(몬스터);
        $message.textContent = `${몬스터.name}을 만났습니다!`

    } else if(event.target['menu-input'].value === '2'){ // 휴식
      영웅.hp = 영웅.maxHP;
      $message.textContent = `충분한 휴식을 취했습니다.`
      영웅정보화면출력(영웅);
    } else if(event.target['menu-input'].value === '3'){ // 종료
        화면전환('startScreen');
        $message.textContent = ``
        초기화();
    }
    event.target['menu-input'].value = '';
});

$battleMenu.addEventListener('submit', (event) => {
    event.preventDefault();
    if(event.target['battle-input'].value === '1'){ // 공격
        $message.textContent = `${영웅.att}데미지를 주고, ${몬스터.att}데미지를 받았습니다`
        몬스터공격하기(영웅, 몬스터);
        히어로공격받기(영웅, 몬스터);
        if(영웅.hp <= 0){
            화면전환('startScreen');
            $message.textContent = `${영웅.lev}LV에서 사망하셨습니다, 새로운 영웅을 생성해주세요!`;
            초기화();
            return;
        }
        if(몬스터.hp <= 0){
            화면전환('gameMenu');
            $monsterStat.style.display = 'none';
            영웅.xp += 몬스터.xp;
            $message.textContent = `${몬스터.name}을 잡았어용!!`;
            if(영웅.xp > 영웅.lev * 15){
                영웅.lev += 1;
                영웅.att += 15;
                영웅.maxHP += 20;
                $message.textContent = `${몬스터.name}을 잡았어용!! 레벨업!!`;
            }
            영웅정보화면출력(영웅);
            return;
        }
        영웅정보화면출력(영웅);
        몬스터정보화면출력(몬스터);
    } else if(event.target['battle-input'].value === '2'){ // 회복
        히어로공격받기(영웅, 몬스터);
        영웅.hp += 15;
        if(영웅.hp <= 0){
            화면전환('startScreen');
            $message.textContent = `${영웅.lev}LV에서 사망하셨습니다, 새로운 영웅을 생성해주세요!`;
            초기화();
            return;
        }
        영웅정보화면출력(영웅);
        $message.textContent = `15회복하고 ${몬스터.att}데미지를 입었습니다`;
    } else if(event.target['battle-input'].value === '3'){ // 도망
        화면전환('gameMenu');
        $message.textContent = '부리나케 도망쳤습니다'
        $monsterStat.style.display = 'none';
      
    }
    event.target['battle-input'].value = '';
});


function 영웅생성하기 (name){
    return {
        name,
        lev: 1,
        maxHP: 100,
        hp: 100,
        xp: 0,
        att: 15,
    }
}

function 영웅정보화면출력 (영웅){
    $heroName.textContent = 영웅.name
    $heroLevel.textContent = `LV: ${영웅.lev}`
    $heroHp.textContent = `HP: ${영웅.hp}/${영웅.maxHP}`
    $heroAtt.textContent = `ATT: ${영웅.att}`
    $heroXp.textContent = `XP: ${영웅.xp}/${영웅.lev * 15}`
}
function 몬스터정보화면출력 (몬스터){
    $monsterName.textContent = 몬스터.name
    $monsterHp.textContent = `HP: ${몬스터.hp}/${몬스터.maxHP}`  
    $monsterAtt.textContent = `ATT: ${몬스터.att}`
}

function 몬스터공격하기 (히어로, 몬스터){
    몬스터.hp -= 히어로.att;
}
function 히어로공격받기 (히어로, 몬스터){
    히어로.hp -= 몬스터.att;
}


function 화면전환 (화면){
    if(화면 === 'startScreen'){
        $startScreen.style.display = 'block';
        $gameMenu.style.display = 'none';
        $battleMenu.style.display= 'none';
        return;
    }
    if(화면 === 'gameMenu'){
        $startScreen.style.display = 'none';
        $gameMenu.style.display = 'block';
        $battleMenu.style.display= 'none';
        return;
    }
    if(화면 === 'battleMenu'){
        $startScreen.style.display = 'none';
        $gameMenu.style.display = 'none';
        $battleMenu.style.display= 'block';
    }
}

function 초기화 (){
    영웅;
    몬스터; 
    $heroName.textContent = ''
    $heroLevel.textContent = ''
    $heroHp.textContent = ''
    $heroAtt.textContent = ''
    $heroXp.textContent = ''
    $monsterName.textContent =''
    $monsterHp.textContent = ''
    $monsterAtt.textContent =''
}