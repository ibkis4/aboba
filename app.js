// ---------- утилиты ----------
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[rnd(0,a.length-1)];
const shuffle=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
const rep=(e,n)=>Array(n).fill(e).join('');
function numOpts(ans,min=0,max=20,n=4){
  const s=new Set([ans]);let g=0;
  while(s.size<n&&g++<100){let v=ans+rnd(-3,3);if(v>=min&&v<=max)s.add(v);}
  return shuffle([...s]);
}
const FR=['🍎','🍓','🍌','⭐','🐟','🚗','🎈','🐞','🍪','🌼'];

// ---------- эмодзи -> картинки (Twemoji) ----------
function emojify(){
  if(window.twemoji)twemoji.parse(document.body,{folder:'svg',ext:'.svg'});
}
new MutationObserver(emojify).observe(document.body,{childList:true,subtree:true,characterData:true});

// ---------- звук ----------
let ac;
function beep(f,d=.15,t='sine'){
  try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();
  const o=ac.createOscillator(),g=ac.createGain();o.type=t;o.frequency.value=f;
  g.gain.value=.15;o.connect(g);g.connect(ac.destination);o.start();
  g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.stop(ac.currentTime+d);}catch(e){}
}
const good=()=>{beep(660);setTimeout(()=>beep(880),100)};
const bad=()=>beep(200,.25,'square');
function confetti(){
  for(let i=0;i<30;i++){const s=document.createElement('div');s.className='conf';
  s.textContent=pick(['🎉','⭐','✨','🎈','🌟']);s.style.left=rnd(0,95)+'vw';
  s.style.animationDelay=Math.random()+'s';document.body.appendChild(s);setTimeout(()=>s.remove(),4000);}
}

// ---------- рисунки (SVG и HTML) ----------
function clockSvg(h,m){
  const P=(d,l)=>{const r=d*Math.PI/180;return[(50+l*Math.sin(r)).toFixed(1),(50-l*Math.cos(r)).toFixed(1)]};
  let s='<svg width="180" height="180" viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" fill="#fff" stroke="#33305a" stroke-width="3"/>';
  for(let i=1;i<=12;i++){const[x,y]=P(i*30,37);
    s+=`<text x="${x}" y="${y}" font-size="9" font-weight="bold" text-anchor="middle" dominant-baseline="central" fill="#33305a">${i}</text>`;}
  const[hx,hy]=P((h%12)*30+m/2,24),[mx,my]=P(m*6,36);
  s+=`<line x1="50" y1="50" x2="${mx}" y2="${my}" stroke="#6c8cff" stroke-width="3" stroke-linecap="round"/>`;
  s+=`<line x1="50" y1="50" x2="${hx}" y2="${hy}" stroke="#ff7a5c" stroke-width="5" stroke-linecap="round"/>`;
  return s+'<circle cx="50" cy="50" r="3" fill="#33305a"/></svg>';
}
const coin=v=>`<span class="coin c${v}">${v}</span>`;

// ---------- генераторы заданий ----------
// возвращает {q, vis, opts, ans, hint, hintVis}
const gens={
count(easy){
  const n=rnd(1,easy?6:10),e=pick(FR);
  return{q:'Сколько здесь предметов?',vis:rep(e,n),ans:n,opts:numOpts(n,1,10),
    hint:'Считай по одному, показывая пальчиком: раз, два, три…'};
},
add10(easy){
  const a=rnd(1,easy?4:9),b=rnd(1,Math.min(easy?4:9,10-a)),e=pick(FR);
  return{q:`${a} + ${b} = ?`,vis:`${rep(e,a)} ➕ ${rep(e,b)}`,ans:a+b,opts:numOpts(a+b,0,10),
    hint:`Сложи вместе: начни с ${a} и добавь ${b} по одному.`,hintVis:rep(e,a+b)};
},
sub10(easy){
  const a=rnd(2,easy?6:10),b=rnd(1,a-1),e=pick(FR);
  const vis=rep(e,a-b)+`<span class="cross">${rep(e,b)}</span>`;
  return{q:`${a} − ${b} = ?`,vis:`${rep(e,a)}<br>убрали ${b}:<br>${vis}`,ans:a-b,opts:numOpts(a-b,0,10),
    hint:`Было ${a}. Убери ${b}. Посчитай, сколько осталось (не серые).`};
},
compare(easy){
  const max=easy?10:20;let a=rnd(1,max),b=rnd(1,max);
  if(Math.random()<.15)b=a;
  const ans=a>b?'>':a<b?'<':'=';
  return{q:'Поставь нужный знак',vis:`${a} <b>?</b> ${b}`,ans,opts:['<','=','>'],
    hint:'Знак «открывает рот» к большему числу, как голодный крокодил 🐊',
    hintVis:`${rep('🔵',a)}<br>${rep('🟠',b)}`};
},
compose(easy){
  const n=rnd(easy?3:4,10),a=rnd(1,n-1);
  return{q:`Число ${n} — это ${a} и сколько?`,vis:`${n} = ${a} + <b>?</b>`,ans:n-a,opts:numOpts(n-a,0,10),
    hint:`Сколько нужно добавить к ${a}, чтобы получилось ${n}?`,hintVis:rep('🟢',a)+rep('⚪',n-a)};
},
missing(easy){
  const c=rnd(3,easy?6:10),a=rnd(1,c-1);
  return{q:'Какого числа не хватает?',vis:`${a} + <b>?</b> = ${c}`,ans:c-a,opts:numOpts(c-a,0,10),
    hint:`Начни с ${a} и считай дальше до ${c}. Сколько шагов?`};
},
add20(easy){
  const a=rnd(8,9),b=rnd(easy?2:3,9);
  const need=10-a,rest=b-need;
  return{q:`${a} + ${b} = ?`,vis:`${a} + ${b}`,ans:a+b,opts:numOpts(a+b,10,20),
    hint:`Сначала дополни до 10: ${a} + ${need} = 10. Осталось ${b}−${need}=${rest}. Итого 10 + ${rest}.`};
},
shapes(){
  const S={
   'круг':'<circle cx="50" cy="50" r="40"/>',
   'квадрат':'<rect x="15" y="15" width="70" height="70"/>',
   'треугольник':'<polygon points="50,10 90,85 10,85"/>',
   'прямоугольник':'<rect x="5" y="25" width="90" height="50"/>'};
  const names=Object.keys(S),n=pick(names),col=pick(['#ff7a5c','#6c8cff','#4cc38a','#ffb84d']);
  const svg=`<svg width="140" height="140" viewBox="0 0 100 100" fill="${col}" stroke="#333" stroke-width="3">${S[n]}</svg>`;
  return{q:'Как называется эта фигура?',vis:svg,ans:n,opts:shuffle(names),
    hint:'Посмотри: есть ли углы? Сколько у фигуры сторон?'};
},
word(){
  const nm=pick(['Маши','Пети','Оли','Миши','Кати']),e=pick(FR);
  if(Math.random()<.5){
    const a=rnd(2,6),b=rnd(1,Math.min(4,10-a));
    return{q:`У ${nm} было ${a} предм. Ещё дали ${b}. Сколько стало?`,
      vis:`${rep(e,a)} + ${rep(e,b)}`,ans:a+b,opts:numOpts(a+b,0,10),
      hint:'Дали ещё — значит, прибавляем.'};
  }
  const a=rnd(4,10),b=rnd(1,a-1);
  return{q:`Было ${a} предм. Убрали ${b}. Сколько осталось?`,
    vis:rep(e,a),ans:a-b,opts:numOpts(a-b,0,10),hint:'Убрали — значит, вычитаем.'};
},
clock(easy){
  const h=rnd(1,12),half=!easy&&Math.random()<.5,mm=half?30:0;
  const ans=`${h}:${half?'30':'00'}`;
  const s=new Set([ans]);
  while(s.size<4)s.add(`${rnd(1,12)}:${half?'30':'00'}`);
  return{q:'Который час?',vis:clockSvg(h,mm),ans,opts:shuffle([...s]),
    hint:'Короткая красная стрелка — часы, длинная синяя — минуты. Синяя вверх (на 12) — ровно часов, вниз (на 6) — половина.'};
},
coins(easy){
  if(!easy&&Math.random()<.4){
    const money=rnd(5,20),price=rnd(5,20);
    return{q:'Хватит ли денег на игрушку?',vis:`У тебя ${money} ₽<br>🧸 стоит ${price} ₽`,
      ans:money>=price?'Да':'Нет',opts:['Да','Нет'],
      hint:'Сравни числа: денег должно быть не меньше, чем цена.'};
  }
  const den=easy?[1,2,5]:[1,2,5,10],lim=easy?10:30;
  let cs,sum;
  do{cs=Array.from({length:rnd(2,easy?3:5)},()=>pick(den));sum=cs.reduce((a,b)=>a+b,0);}while(sum>lim);
  cs.sort((a,b)=>b-a);
  return{q:'Сколько всего рублей?',vis:cs.map(coin).join(''),ans:sum,opts:numOpts(sum,1,40),
    hint:'Начни с самой большой монеты и прибавляй остальные по одной.'};
},
tens(easy){
  const n=rnd(11,easy?15:19);
  if(!easy&&Math.random()<.4){
    const k=rnd(1,9);
    return{q:`10 + ${k} = ?`,vis:`10 + ${k}`,ans:10+k,opts:numOpts(10+k,11,20),
      hint:'Десяток и единицы вместе: 10 и ещё сколько-то.',hintVis:rep('🟦',10)+'<br>'+rep('🟧',k)};
  }
  return{q:'Из чего состоит число?',vis:`${rep('🟦',10)}<br>${rep('🟧',n-10)}<br>${n} = 10 + <b>?</b>`,
    ans:n-10,opts:numOpts(n-10,1,9),
    hint:'Синие — это десяток (10). Посчитай оранжевые квадратики.'};
},
neighbors(easy){
  const mx=easy?9:19,t=rnd(0,2);
  if(t==0){const n=rnd(1,mx);
    return{q:`Какое число идёт после ${n}?`,vis:`${n}, <b>?</b>`,ans:n+1,opts:numOpts(n+1,1,20),
      hint:`Посчитай: ${n}, и дальше — на один больше.`};}
  if(t==1){const n=rnd(2,mx+1);
    return{q:`Какое число идёт перед ${n}?`,vis:`<b>?</b>, ${n}`,ans:n-1,opts:numOpts(n-1,0,20),
      hint:`Посчитай от начала: какое число стоит прямо перед ${n}?`};}
  const a=rnd(1,mx);
  return{q:'Какое число спряталось?',vis:`${a}, <b>?</b>, ${a+2}`,ans:a+1,opts:numOpts(a+1,1,20),
    hint:`Считай по порядку: ${a}, потом число, потом ${a+2}.`};
},
pattern(easy){
  if(Math.random()<.5){
    const pool=['🔴','🔵','🟢','🟡','🟣'],u=rnd(2,easy?2:3);
    const unit=shuffle(pool).slice(0,u),L=u*2+1;
    const seq=Array.from({length:L},(_,i)=>unit[i%u]),ans=seq[L-1];
    return{q:'Что будет дальше?',vis:seq.slice(0,L-1).join('')+'❓',ans,
      opts:shuffle([...new Set([ans,...shuffle(pool)])].slice(0,4)),
      hint:`Найди, что повторяется: ${unit.join('')}. Продолжи ряд.`};
  }
  const d=pick(easy?[1,2]:[1,2,3,5]),s=rnd(0,20-4*d);
  return{q:'Продолжи ряд чисел',vis:[s,s+d,s+2*d,s+3*d].join(', ')+', <b>?</b>',ans:s+4*d,
    opts:numOpts(s+4*d,0,25),hint:`Посмотри, на сколько растёт каждое число. Каждый раз прибавляем ${d}.`};
},
};

// ---------- темы ----------
const topics=[
{id:'count',t:'Считаем до 10',ic:'🍎',c:'#ff7a5c',gen:'count',
 learn:[
  {t:'Давай считать!',h:'',tap:6},
  {t:'Цифры',h:'1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 🔟<br>Каждая цифра показывает, сколько предметов.'}]},
{id:'add10',t:'Сложение до 10',ic:'➕',c:'#4cc38a',gen:'add10',
 learn:[
  {t:'Что такое сложение?',h:'Было 🍎🍎🍎, добавили 🍎🍎.<br>Стало 🍎🍎🍎🍎🍎<br><b>3 + 2 = 5</b>'},
  {t:'Знак «+»',h:'Плюс значит «прибавить», «добавить», «стало больше».'}]},
{id:'sub10',t:'Вычитание до 10',ic:'➖',c:'#6c8cff',gen:'sub10',
 learn:[
  {t:'Что такое вычитание?',h:'Было 🍪🍪🍪🍪🍪, съели 2.<br>Осталось 🍪🍪🍪<br><b>5 − 2 = 3</b>'},
  {t:'Знак «−»',h:'Минус значит «убрать», «отнять», «стало меньше».'}]},
{id:'compare',t:'Больше, меньше',ic:'🐊',c:'#ffb84d',gen:'compare',
 learn:[
  {t:'Крокодил голодный!',h:'Крокодил 🐊 всегда открывает рот к большему числу.<br><b>7 &gt; 3</b> &nbsp; <b>2 &lt; 9</b>'},
  {t:'Равно',h:'Если чисел поровну, ставим «=».<br><b>5 = 5</b>'}]},
{id:'compose',t:'Состав числа',ic:'🧩',c:'#b36cff',gen:'compose',
 learn:[
  {t:'Число из частей',h:'Число 5 можно собрать так:<br>🟢🟢🟢⚪⚪ → <b>5 = 3 + 2</b><br>🟢⚪⚪⚪⚪ → <b>5 = 1 + 4</b>'}]},
{id:'missing',t:'Чего не хватает?',ic:'❓',c:'#ff6ca8',gen:'missing',
 learn:[
  {t:'Ищем пропавшее число',h:'<b>3 + ? = 5</b><br>Начни с 3 и досчитай до 5: 4, 5 — два шага. Значит, <b>? = 2</b>'}]},
{id:'tens',t:'Числа 11–20',ic:'🔟',c:'#3aa0ff',gen:'tens',
 learn:[
  {t:'Десяток и единицы',h:'🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦<br>🟧🟧🟧🟧<br>Это десяток и ещё 4.<br><b>14 = 10 + 4</b>'},
  {t:'Как читать числа',h:'Числа от 11 до 19 — это «десяток и ещё немного».<br><b>10 + 7 = 17</b><br>А 20 — это два десятка!'}]},
{id:'neighbors',t:'Соседи числа',ic:'🏘️',c:'#7cb342',gen:'neighbors',
 learn:[
  {t:'Кто стоит рядом?',h:'У каждого числа есть сосед слева и справа.<br><b>3, 4, 5</b><br>Число 4: слева 3 (меньше), справа 5 (больше).'},
  {t:'Спрятавшееся число',h:'<b>6, ?, 8</b><br>Число спряталось между 6 и 8. Это <b>7</b>!'}]},
{id:'pattern',t:'Закономерности',ic:'🔁',c:'#ef5350',gen:'pattern',
 learn:[
  {t:'Что повторяется?',h:'🔴🔵🔴🔵🔴❓<br>Красный, синий, красный, синий… Дальше будет 🔵'},
  {t:'Числа тоже повторяются',h:'<b>2, 4, 6, 8, ?</b><br>Каждый раз прибавляем 2. Дальше <b>10</b>!'}]},
{id:'clock',t:'Часы',ic:'🕐',c:'#26a69a',gen:'clock',
 learn:[
  {t:'Две стрелки',h:`${clockSvg(3,0)}<br>Короткая стрелка показывает <b>часы</b>, длинная — <b>минуты</b>.<br>Сейчас <b>3 часа</b> (3:00).`},
  {t:'Половина часа',h:`${clockSvg(6,30)}<br>Когда длинная стрелка смотрит вниз (на 6), прошло полчаса.<br>Это <b>6:30</b>.`}]},
{id:'coins',t:'Монеты',ic:'🪙',c:'#d4a017',gen:'coins',
 learn:[
  {t:'Монеты и рубли',h:`${coin(1)}${coin(2)}${coin(5)}${coin(10)}<br>Монеты бывают на 1, 2, 5 и 10 рублей.`},
  {t:'Считаем деньги',h:`${coin(5)}${coin(2)}${coin(2)}<br>5 + 2 + 2 = <b>9 ₽</b><br>Начинай с самой большой монеты!`}]},
{id:'add20',t:'Сложение до 20',ic:'🚀',c:'#2fb5c9',gen:'add20',
 learn:[
  {t:'Через десяток',h:'<b>8 + 5</b><br>Сначала дополним до 10: 8 + 2 = 10.<br>Ещё осталось 3. <b>10 + 3 = 13</b>'}]},
{id:'shapes',t:'Фигуры',ic:'🔺',c:'#e0a800',gen:'shapes',
 learn:[
  {t:'Знакомимся с фигурами',h:'🔵 <b>Круг</b> — нет углов<br>🟦 <b>Квадрат</b> — 4 равные стороны<br>🔺 <b>Треугольник</b> — 3 угла<br>▭ <b>Прямоугольник</b> — 4 угла, стороны разные'}]},
{id:'word',t:'Задачки',ic:'📚',c:'#8a6cff',gen:'word',
 learn:[
  {t:'Как решать задачу',h:'1. Прочитай.<br>2. Найди слова: «дали ещё» → ➕, «убрали, съели» → ➖.<br>3. Посчитай ответ.'}]},
];

// ---------- прогресс и статистика ----------
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
let prog=load('mathProg',{});
let stats=load('mathStats',{learns:0,trains:0,perfect:0,best:0});
let earned=load('mathAch',{});
const save=()=>{localStorage.setItem('mathProg',JSON.stringify(prog));
  localStorage.setItem('mathStats',JSON.stringify(stats));
  localStorage.setItem('mathAch',JSON.stringify(earned));};
const totalStars=()=>Object.values(prog).reduce((s,x)=>s+(x||0),0);
function upd(){document.getElementById('total').textContent='⭐ '+totalStars()}
const app=document.getElementById('app');
let streak=0;

// ---------- достижения ----------
const ACH=[
{id:'a1',ic:'👣',t:'Первый шаг',d:'Закончи любой урок или тренировку',f:()=>stats.learns+stats.trains>=1},
{id:'a2',ic:'📖',t:'Ученик',d:'Пройди «Учимся» 3 раза',f:()=>stats.learns>=3},
{id:'a3',ic:'🎯',t:'Тренер',d:'Закончи 5 тренировок',f:()=>stats.trains>=5},
{id:'a4',ic:'⭐',t:'Первая звезда',d:'Заработай 1 звезду',f:()=>totalStars()>=1},
{id:'a5',ic:'🌟',t:'Звёздочёт',d:'Собери 10 звёзд',f:()=>totalStars()>=10},
{id:'a6',ic:'🔥',t:'Пять подряд',d:'5 верных ответов подряд без ошибок',f:()=>stats.best>=5},
{id:'a7',ic:'💯',t:'Без ошибок',d:'Пройди тренировку на 10 из 10',f:()=>stats.perfect>=1},
{id:'a8',ic:'🗺️',t:'Путешественник',d:'Получи звезду в каждой теме',f:()=>topics.every(t=>(prog[t.id]||0)>=1)},
{id:'a9',ic:'🏆',t:'Мастер',d:'Собери 20 звёзд',f:()=>totalStars()>=20},
{id:'a10',ic:'👑',t:'Чемпион',d:'Получи 3 звезды в каждой теме',f:()=>topics.every(t=>(prog[t.id]||0)>=3)},
{id:'a11',ic:'🕐',t:'Знаток часов',d:'Получи звезду в теме «Часы»',f:()=>(prog.clock||0)>=1},
{id:'a12',ic:'🪙',t:'Богач',d:'Получи звезду в теме «Монеты»',f:()=>(prog.coins||0)>=1},
];
function checkAch(){
  ACH.forEach(a=>{
    if(!earned[a.id]&&a.f()){
      earned[a.id]=1;
      const d=document.createElement('div');d.className='toast';
      d.textContent=`${a.ic} Новая награда: ${a.t}!`;
      document.getElementById('toasts').appendChild(d);
      setTimeout(()=>d.remove(),3600);
      setTimeout(()=>{good();},50);
    }
  });
  save();
}
function achv(){
  const n=ACH.filter(a=>earned[a.id]).length;
  app.innerHTML=`<div class="panel"><div class="owl">🏆</div><div class="q">Мои награды: ${n} из ${ACH.length}</div>
  <div class="agrid">${ACH.map(a=>`<div class="ach ${earned[a.id]?'got':''}">
    <div class="ai">${a.ic}</div><div class="at">${a.t}</div><div class="ad">${a.d}</div></div>`).join('')}</div>
  <button class="btn gray" onclick="home()">🏠 К темам</button></div>`;
}

// ---------- экраны ----------
function home(){
  upd();
  const ts=totalStars();
  const say=ts==0?'Привет! Я Сова Мудрик. Выбери тему и начнём!':ts<10?'Отлично! Продолжай собирать звёзды!':'Ты настоящий математик! 🏆';
  app.innerHTML=`<div class="hello"><div class="owl">🦉</div><div style="font-size:1.2rem">${say}<br><small>📖 Учимся — сначала узнаём. 🎯 Тренируемся — зарабатываем звёзды. 🏆 — твои награды.</small></div></div>
  <div class="grid">${topics.map(t=>{
    const s=prog[t.id]||0;
    return`<div class="card" style="--c:${t.c}"><div class="ic">${t.ic}</div><h3>${t.t}</h3>
    <div class="st">${'⭐'.repeat(s)}${'☆'.repeat(3-s)}</div>
    <button class="btn" onclick="learn('${t.id}')">📖 Учимся</button>
    <button class="btn" style="--c:#ff7a5c" onclick="train('${t.id}')">🎯 Тренируемся</button></div>`}).join('')}</div>`;
}

function learn(id,step=0){
  const t=topics.find(x=>x.id==id);
  if(step<t.learn.length){
    const s=t.learn[step];
    let body;
    if(s.tap){const e=pick(FR);body=`<div class="vis big">${Array.from({length:s.tap},()=>`<span class="tap" onclick="tapc(this,${s.tap})">${e}</span>`).join(' ')}</div><div class="q" id="tapn">Нажимай на предметы!</div>`;
    } else body=`<div class="vis" style="font-size:1.6rem">${s.h}</div>`;
    app.innerHTML=`<div class="panel"><div class="bar"><i style="width:${step/(t.learn.length+3)*100}%"></i></div>
    <div class="owl">🦉</div><div class="q">${s.t}</div>${body}
    <button class="btn" onclick="learn('${id}',${step+1})">Дальше ➡️</button>
    <button class="btn gray" onclick="home()">🏠</button></div>`;
  } else {
    practice(t,{mode:'learn',total:3,i:0,ok:0,off:t.learn.length});
  }
}
let tapCount=0;
function tapc(el,n){
  if(el.classList.contains('on'))return;
  el.classList.add('on');beep(400+60*(++tapCount));
  const k=document.querySelectorAll('.tap.on').length;
  document.getElementById('tapn').textContent=k;
  if(k==n){tapCount=0;good();document.getElementById('tapn').textContent=n+' — всё посчитали! 🎉'}
}

function train(id){
  const t=topics.find(x=>x.id==id);
  practice(t,{mode:'train',total:10,i:0,ok:0,off:0});
}

function practice(t,st){
  if(st.i>=st.total)return finish(t,st);
  const q=gens[t.gen](st.mode=='learn');
  st.cur=q;st.wrong=false;
  const learnMode=st.mode=='learn';
  app.innerHTML=`<div class="panel">
  <div class="bar"><i style="width:${(st.i+st.off)/(st.total+st.off)*100}%"></i></div>
  <div style="text-align:left;opacity:.7">${learnMode?'📖 Учимся':'🎯 Тренировка'} · задание ${st.i+1} из ${st.total}</div>
  <div class="q">${q.q}</div>
  <div class="vis ${String(q.vis).includes('svg')?'':'big'}">${q.vis}</div>
  <div class="opts">${q.opts.map(o=>`<button class="opt" data-v="${o}">${o}</button>`).join('')}</div>
  <div class="msg" id="msg"></div><div id="hintbox"></div>
  <button class="btn gray" onclick="home()">🏠 Выйти</button></div>`;
  app.querySelectorAll('.opt').forEach(b=>b.onclick=()=>answer(b,t,st));
}

function answer(b,t,st){
  const q=st.cur,msg=document.getElementById('msg');
  if(b.dataset.v==String(q.ans)){
    good();b.classList.add('ok');
    app.querySelectorAll('.opt').forEach(x=>x.disabled=true);
    if(!st.wrong){st.ok++;streak++;if(streak>stats.best){stats.best=streak;checkAch();}}
    msg.textContent=pick(['Молодец! 🎉','Верно! 👏','Отлично! 🌟','Супер! 🚀']);
    setTimeout(()=>{st.i++;practice(t,st)},900);
  } else {
    bad();b.classList.add('bad');st.wrong=true;streak=0;
    msg.textContent='Попробуй ещё 🙂';
    document.getElementById('hintbox').innerHTML=`<div class="hint">💡 ${q.hint}${q.hintVis?`<div class="vis">${q.hintVis}</div>`:''}</div>`;
  }
}

function finish(t,st){
  const learnMode=st.mode=='learn';
  const stars=learnMode?(st.ok>=2?1:0):(st.ok>=9?3:st.ok>=7?2:st.ok>=5?1:0);
  if(stars>(prog[t.id]||0))prog[t.id]=stars;
  if(learnMode)stats.learns++;else{stats.trains++;if(st.ok==st.total)stats.perfect++;}
  save();
  if(stars>0)confetti();
  const txt=learnMode?'Теперь переходи к тренировке!':stars==3?'Ты чемпион!':stars>0?'Хорошо! Попробуй получить 3 звезды!':'Не страшно, давай ещё раз и сначала загляни в «Учимся».';
  upd();
  app.innerHTML=`<div class="panel"><div class="owl">🦉</div><div class="q">Результат: ${st.ok} из ${st.total}</div>
  <div class="big-star">${'⭐'.repeat(stars)}${'☆'.repeat(3-stars)}</div><div class="msg">${txt}</div>
  <button class="btn" onclick="train('${t.id}')">🎯 Тренироваться</button>
  <button class="btn" style="--c:#4cc38a" onclick="learn('${t.id}')">📖 Учимся</button>
  <button class="btn" style="--c:#ff6ca8" onclick="achv()">🏆 Награды</button>
  <button class="btn gray" onclick="home()">🏠 К темам</button></div>`;
  checkAch();
}
home();
emojify();
