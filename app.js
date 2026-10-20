const icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/></svg>';
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const audio=t=>`<button class="audio" data-speak="${escape(t)}" aria-label="朗读 ${escape(t)}">${icon}</button>`;
let category='all';let single=false;let cardIndex=0;
const sentences=[
['薄底披萨怎么说','Her children prefer to eat pizza with thin crust.','Her children prefer thin-crust pizza.','她的孩子们更喜欢薄底披萨。','也可以说 Her children prefer to eat pizza with a thin crust. 比较偏好：prefer A to B。crust 可指面包外皮、披萨饼底、派皮，也可指地壳：the Earth’s crust。'],
['承担环保领域的领导责任','He should take on the mantle of the presidency in environmental issues.','He should take on the mantle of leadership on environmental issues.','他应该在环保问题上承担领导责任。','更日常：He should take the lead on environmental issues. 如果强调总统身份：As president, he should take the lead on environmental issues. 原句的 presidency 指总统职位，与后半句衔接不自然。'],
['一阵风吹掉了帽子','原句正确、自然，可以直接背。','A gust of wind blew my hat off.','一阵风吹掉了我的帽子。','也可以说 A gust of wind blew my hat off my head. 不规则变化：blow → blew → blown。'],
['突然涌来的大量……','an avalanche of 大量的','We received an avalanche of emails after the announcement.','公告发布后，我们收到了潮水般涌来的邮件。','an avalanche of complaints / questions / applications：大量涌来的投诉／接连不断的问题／蜂拥而至的申请。强调突然涌来、令人应接不暇。'],
['进入平台期','The stock market now has reached a plateau.','The stock market has now reached a plateau.','股市目前已进入平台期。','has now reached 的语序更自然。也可以说 After months of growth, the stock market has reached a plateau. 学习场景：I feel as though my English has reached a plateau. 平台期不一定代表最高水平。']
];
const nav=document.querySelector('.nav');nav.innerHTML=['全部词汇',...groups,'句子笔记'].map((x,i)=>`<button data-cat="${i===0?'all':i===6?'sentences':i-1}" class="${i===0?'active':''}">${x}</button>`).join('');
function render(){const q=document.querySelector('#search').value.trim().toLowerCase();let html='';if(category!=='sentences'){groups.forEach((g,idx)=>{if(category!=='all'&&+category!==idx)return;const words=raw.filter(w=>w[4]===idx&&w.join(' ').toLowerCase().includes(q));if(!words.length)return;html+=`<h2 class="section-title">${g}<small>${String(words.length).padStart(2,'0')} WORDS</small></h2><div class="cards">`+words.map(w=>`<article class="card"><div class="wordrow"><h3 class="word">${w[0]}</h3>${audio(w[0])}</div><div class="phonetic">/${w[1]}/ <span class="pos">${w[2]}</span></div><div class="meaning">${w[3]}</div><div class="phrase">${w[5]}</div><div class="example"><p>${w[6]}</p><div class="translation">${w[7]}</div></div><div style="margin-top:10px">${audio(w[6])}</div>${w[8]?`<div class="note">用法笔记 · ${w[8]}</div>`:''}<button class="reveal">显示／隐藏释义</button></article>`).join('')+'</div>';});}if(category==='all'||category==='sentences'){const s=sentences.filter(x=>x.join(' ').toLowerCase().includes(q));if(s.length)html+='<h2 class="section-title">句子笔记 <small>IN CONTEXT</small></h2>'+s.map((s,i)=>`<article class="sentence"><h3>0${i+1} / ${s[0]}</h3><div class="original">原笔记 · ${s[1]}</div><blockquote>${s[2]}</blockquote>${audio(s[2])}<p>${s[3]}</p><p>${s[4]}</p></article>`).join('');}document.querySelector('#content').innerHTML=html||'<div class="empty">没有找到匹配内容，试试其他单词或中文释义。</div>';applyCardMode();}
nav.addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(!b)return;category=b.dataset.cat;nav.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));render();});
document.querySelector('#search').addEventListener('input',render);
document.querySelector('#test').addEventListener('click',e=>{const active=document.body.classList.toggle('hide-cn');e.target.setAttribute('aria-pressed',active);e.target.textContent=active?'显示释义 · 阅读':'隐藏释义 · 自测';});
let voices=[];if('speechSynthesis'in window){voices=speechSynthesis.getVoices();speechSynthesis.addEventListener('voiceschanged',()=>voices=speechSynthesis.getVoices());}
let timer;function status(s){clearTimeout(timer);document.querySelector('#status').textContent=s;timer=setTimeout(()=>document.querySelector('#status').textContent='',5000);}
document.addEventListener('click',e=>{const reveal=e.target.closest('.reveal');if(reveal){reveal.closest('.card').classList.toggle('revealed');return;}const b=e.target.closest('[data-speak]');if(!b)return;if(!('speechSynthesis'in window)){status('当前浏览器不支持语音播放，请使用支持语音合成的浏览器。');return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(b.dataset.speak);u.lang=document.querySelector('#accent').value;u.rate=.85;const v=voices.find(v=>v.lang.replace('_','-')===u.lang);if(v)u.voice=v;else if(voices.length)status('设备未提供所选口音，将尝试使用系统英语语音。');u.onerror=e=>{if(e.error!=='interrupted'&&e.error!=='canceled')status('语音播放失败，请检查设备英语语音是否可用。');};speechSynthesis.speak(u);});
render();

function applyCardMode(){
 const enabled=single&&category!=='sentences';document.body.classList.toggle('single-card',enabled);
 const cards=[...document.querySelectorAll('.card')];cardIndex=Math.min(cardIndex,Math.max(0,cards.length-1));
 cards.forEach((card,i)=>card.hidden=enabled&&i!==cardIndex);
 document.querySelectorAll('.cards').forEach(grid=>{grid.hidden=enabled&&![...grid.children].some(c=>!c.hidden);grid.previousElementSibling.hidden=grid.hidden;});
 document.querySelectorAll('.sentence').forEach(x=>x.hidden=enabled);
 const heading=[...document.querySelectorAll('.section-title')].find(x=>x.textContent.includes('IN CONTEXT'));if(heading)heading.hidden=enabled;
 document.querySelector('#cardpager').hidden=!enabled||!cards.length;
 document.querySelector('#position').textContent=`${cards.length?cardIndex+1:0} / ${cards.length}`;
 document.querySelector('#previous').disabled=cardIndex===0;document.querySelector('#next').disabled=cardIndex>=cards.length-1;
}
document.querySelector('#cardmode').addEventListener('click',e=>{single=!single;cardIndex=0;e.target.setAttribute('aria-pressed',single);e.target.textContent=single?'查看全部卡片':'逐张背词';render();});
document.querySelector('#previous').addEventListener('click',()=>{cardIndex=Math.max(0,cardIndex-1);applyCardMode();});
document.querySelector('#next').addEventListener('click',()=>{cardIndex++;applyCardMode();});
