// ─────────────────────────────────────────────
// 洋平トレーニング（旧 BP Tracker）
//   記録データ：Supabase training_logs（従来のまま）
// ─────────────────────────────────────────────
const SUPABASE_URL='https://nuqhddzwjknoxrykfcrb.supabase.co';
const SUPABASE_KEY='sb_publishable_6nSJ-7MfHwr4e2p2Esgp8A_0BTGPODN';
const SB_HEADERS={'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY};

const {ROUND,RACE,PHASES,PACE,planFor,plannedKm,longRuns}=window.PLAN;
const {pad,ymd,parse,addDays,diffDays,mondayOf,today}=window.PLAN.util;
const DOW=['日','月','火','水','木','金','土'];
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const md=s=>{const d=parse(s);return `${d.getMonth()+1}/${d.getDate()}（${DOW[d.getDay()]}）`;};
const km1=n=>(Math.round(n*10)/10).toFixed(1);
// 計画が始まる前の月（〜2026年9月）は従来の月70kmを目標にする
const monthTarget=(ym)=>{if(ym<'2026-10')return 70;const[y,m]=ym.split('-').map(Number);const last=ym==='2027-03'?'2027-03-06':window.PLAN.util.ymd(new Date(y,m,0));return window.PLAN.plannedKm(ym+'-01',last);};

function toast(msg,err){const t=$('toast');t.textContent=msg;t.style.background=err?'var(--warn)':'';t.classList.remove('opacity-0','translate-y-2');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.add('opacity-0','translate-y-2'),2400);}

// ── データ ──
let CACHE=null;
function mapRow(row){return{id:Number(row.id),date:row.date,cat:row.cat,exercises:row.exercises||[],runDist:Number(row.run_dist)||0,runTime:row.run_time||0,runPaceMin:row.run_pace_min||0,runPaceSec:row.run_pace_sec||0,runHr:row.run_hr||0,runCal:row.run_cal||0,walkDist:Number(row.walk_dist)||0,walkTime:row.walk_time||0,note:row.note||''};}
async function getRecs(force){
  if(CACHE&&!force)return CACHE;
  try{
    const r=await fetch(SUPABASE_URL+'/rest/v1/training_logs?order=date.desc',{headers:SB_HEADERS});
    if(!r.ok)throw new Error(r.status);
    CACHE=(await r.json()).map(mapRow);
    try{localStorage.setItem('yohei_bp_cache',JSON.stringify(CACHE));}catch(e){}
  }catch(e){
    try{CACHE=JSON.parse(localStorage.getItem('yohei_bp_cache')||localStorage.getItem('yohei_bp_v3')||'[]');}catch{CACHE=[];}
    toast('通信できないため、保存済みの表示です',true);
  }
  return CACHE;
}
function rowOf(rec){return{id:rec.id,date:rec.date,cat:rec.cat,exercises:rec.exercises,run_dist:rec.runDist||0,run_time:rec.runTime||0,run_pace_min:rec.runPaceMin||0,run_pace_sec:rec.runPaceSec||0,run_hr:rec.runHr||0,run_cal:rec.runCal||0,walk_dist:rec.walkDist||0,walk_time:rec.walkTime||0,note:rec.note||''};}
async function postRow(row){
  const r=await fetch(SUPABASE_URL+'/rest/v1/training_logs',{method:'POST',headers:{...SB_HEADERS,'Prefer':'resolution=merge-duplicates'},body:JSON.stringify(row)});
  return r.ok;
}
async function upsertRec(rec){
  try{
    let ok=await postRow(rowOf(rec));
    if(!ok&&rec.cat==='golf'){ // カテゴリに golf が使えない場合の保険
      ok=await postRow(rowOf({...rec,cat:'full',note:'[ゴルフ] '+(rec.note||'')}));
    }
    if(!ok)throw new Error('save failed');
    CACHE=null;return true;
  }catch(e){console.error(e);toast('保存できませんでした。通信を確認してください',true);return false;}
}
async function deleteRec(id){
  try{const r=await fetch(SUPABASE_URL+'/rest/v1/training_logs?id=eq.'+id,{method:'DELETE',headers:SB_HEADERS});if(!r.ok)throw 0;CACHE=null;return true;}
  catch(e){toast('削除できませんでした',true);return false;}
}
const gymEx=r=>(r.exercises||[]).filter(e=>!e.kind&&(e.sets||[]).length);
const isGolf=r=>r.cat==='golf'||(r.note||'').startsWith('[ゴルフ]');
const byDate=recs=>{const m={};recs.forEach(r=>{(m[r.date]=m[r.date]||[]).push(r);});return m;};
function dayActual(list){
  list=list||[];
  const run=list.reduce((s,r)=>s+(r.runDist||0),0);
  const golf=list.filter(isGolf);
  const gym=list.filter(r=>!isGolf(r)&&gymEx(r).length>0);
  const kx=list.flatMap(r=>(r.exercises||[]).filter(e=>e.kind&&e.kind!=='form'));
  const gdone=kx.filter(e=>e.kind==='golf'&&e.status!=='skip');
  return{run,golf,gym,kx,
    genie:golf.some(r=>(r.note||'').includes('ジーニー'))||gdone.some(e=>e.routine==='genie'),
    goltore:golf.some(r=>(r.note||'').includes('ゴルトレ'))||gdone.some(e=>(e.routine||'').startsWith('y')),
    skips:new Set(kx.filter(e=>e.status==='skip').map(e=>e.name)),
    pilates:kx.some(e=>e.kind==='pilates'&&e.status!=='skip'),
    any:list.length>0};
}
function itemDone(it,a){
  if(a.skips&&a.skips.has(it.label))return 'skip';
  if(it.kind==='pilates')return a.pilates?'done':null;
  if(it.kind==='run')return a.run>0?(a.run>=(it.km||0)*0.8?'done':'part'):null;
  if(it.kind==='genie')return a.genie?'done':null;
  if(it.kind==='goltore')return a.goltore?'done':null;
  if(it.kind==='gym')return a.gym.length?'done':null;
  if(it.kind==='prep')return a.golf.length?'done':null;
  return null;
}
const KIND_LABEL={genie:'ジーニー',goltore:'ゴルトレ',run:'ラン',gym:'筋トレ',pilates:'ピラティス',off:'休み',event:'本番',prep:'調整'};
const KIND_DOT={genie:'var(--accent)',goltore:'var(--sand)',run:'var(--sky)',gym:'var(--fg)',pilates:'var(--plum)',off:'var(--line)',event:'var(--warn)',prep:'var(--warn)'};

// ── ルーター ──
const PAGES=['today','golf','marathon','week','month','log','history','stats','import'];
let CUR='today';
function show(p,opt){
  if(!PAGES.includes(p))p='today';CUR=p;
  document.querySelectorAll('#tabs .tab').forEach(b=>b.classList.toggle('on',b.dataset.p===p));
  document.querySelectorAll('.page').forEach(s=>s.classList.toggle('hidden',s.id!=='p-'+p));
  const tb=document.querySelector(`#tabs .tab[data-p="${p}"]`);tb&&tb.scrollIntoView({inline:'center',block:'nearest'});
  if(history.replaceState)history.replaceState(null,'','#'+p);
  window.scrollTo({top:0});
  ({today:renderToday,golf:()=>renderGolf(opt&&opt.routine),marathon:renderMarathon,week:renderWeek,month:renderMonth,history:renderHistory,stats:renderStats,log:()=>{}}[p]||(()=>{}))();
}
document.querySelectorAll('#tabs .tab').forEach(b=>b.addEventListener('click',()=>show(b.dataset.p)));

function headerCount(){
  const t=today();const r=diffDays(t,ROUND),m=diffDays(t,RACE);
  $('hdr-count').textContent=(r>=0?`ラウンドまで${r}日　`:'')+(m>=0?`篠山まで${m}日`:'');
}

// ── 共通パーツ ──
function chip(kind,text){return `<span class="chip k-${kind}">${esc(text||KIND_LABEL[kind]||kind)}</span>`;}
function statusMark(st){if(st==='skip')return '<span class="text-xs font-bold text-muted">休み</span>';return st==='done'?'<span class="num text-sm font-bold text-accent">✓</span>':st==='part'?'<span class="num text-xs font-bold text-sand">途中</span>':'';}
function itemRow(it,a,withAction){
  const st=a?itemDone(it,a):null;
  let act='';
  if(withAction){
    if(it.routine)act=`<button class="btn-sm" onclick="show('golf',{routine:'${it.routine}${it.part?':'+it.part:''}'})">メニュー</button>`;
    else if(it.kind==='run')act=`<button class="btn-sm" onclick="openLog('run')">記録</button>`;
    else if(it.kind==='gym')act=`<button class="btn-sm" onclick="openLog('${it.cat||'full'}')">記録</button>`;
  }
  return `<div class="flex items-start gap-3 py-2.5">
    <div class="pt-0.5">${chip(it.kind)}</div>
    <div class="min-w-0 flex-1"><div class="font-bold leading-snug">${esc(it.label)}${it.km?` <span class="num text-sm text-sky">${it.km}km</span>`:''}</div>
      ${it.detail?`<div class="text-[13px] text-muted">${esc(it.detail)}</div>`:''}${it.extra?`<div class="text-[13px] font-bold text-sand">${esc(it.extra)}</div>`:''}</div>
    <div class="flex shrink-0 items-center gap-2">${statusMark(st)}${act}</div></div>`;
}
function dayCard(s,a,opts){
  const p=planFor(s);const isToday=s===today();
  const act=[];if(a&&a.run>0)act.push(`ラン ${km1(a.run)}km`);if(a&&a.gym.length)act.push(`筋トレ ${a.gym.reduce((n,r)=>n+r.exercises.length,0)}種目`);if(a&&a.golf.length)act.push(`ゴルフ ${a.golf.reduce((n,r)=>n+r.exercises.length,0)}種目`);
  return `<div class="card px-4 py-2 ${isToday?'ring-2 ring-accent':''}">
    <div class="flex items-baseline justify-between border-b border-line py-1.5"><div class="font-bold">${md(s)}${isToday?' <span class="chip k-genie ml-1">今日</span>':''}</div><div class="text-[11px] text-muted">${p.phase?esc(p.phase.name):''}</div></div>
    <div class="divide-y divide-line">${p.items.map(it=>itemRow(it,a,opts&&opts.action)).join('')||'<div class="py-3 text-sm text-muted">予定なし</div>'}</div>
    ${act.length?`<div class="border-t border-line py-2 text-[12px] text-muted">実績：${act.join('・')}</div>`:''}</div>`;
}
function bar(v,max,color){const w=max>0?Math.min(100,v/max*100):0;return `<div class="h-2 overflow-hidden rounded-full bg-line"><div class="h-full rounded-full" style="width:${w.toFixed(0)}%;background:${color||'var(--accent)'}"></div></div>`;}

// ── 今日 ──
async function renderToday(){
  const el=$('p-today');const t=today();
  el.innerHTML='<div class="text-sm text-muted">読み込み中…</div>';
  const recs=await getRecs();const bd=byDate(recs);
  const p=planFor(t);const a=dayActual(bd[t]);
  const r=diffDays(t,ROUND),m=diffDays(t,RACE);
  const mon=mondayOf(t);const days=[...Array(7)].map((_,i)=>addDays(mon,i));
  const wPlan=plannedKm(mon,addDays(mon,6));const wAct=days.reduce((s,d)=>s+dayActual(bd[d]).run,0);
  const tm=addDays(t,1);
  el.innerHTML=`
  <div class="grid grid-cols-2 gap-3">
    ${r>=0?`<div class="card p-4"><div class="lbl">ゴルフ 10/20（火）</div><div class="mt-1 flex items-baseline gap-1"><span class="num text-3xl font-semibold text-accent">${r}</span><span class="text-sm text-muted">日</span></div><div class="text-[12px] text-muted">目標 100切り（前回118）</div></div>`:''}
    ${m>=0?`<div class="card p-4"><div class="lbl">篠山マラソン 3/7（日）</div><div class="mt-1 flex items-baseline gap-1"><span class="num text-3xl font-semibold text-sky">${m}</span><span class="text-sm text-muted">日</span></div><div class="text-[12px] text-muted">目標 サブ4 → 3時間30分</div></div>`:''}
  </div>
  ${p.phase?`<div class="rounded-xl bg-accent-soft px-4 py-2.5 text-sm"><b class="text-accent">${esc(p.phase.name)}</b>　${esc(p.phase.sub)}</div>`:''}
  <div class="grid gap-2"><h2 class="h2">今日のメニュー（予定）</h2>${dayCard(t,a,{action:true})}
    ${(p.note||[]).map(n=>`<p class="text-[13px] text-muted">・${esc(n)}</p>`).join('')}</div>
  <div id="act-box" class="grid gap-2"></div>
  <div class="grid gap-2"><div class="flex items-baseline justify-between"><h2 class="h2">今週</h2><button class="btn-sm" onclick="show('week')">週間を見る</button></div>
    <div class="card grid gap-3 p-4">
      <div class="grid grid-cols-7 gap-1 text-center">${days.map(d=>{const pp=planFor(d);const aa=dayActual(bd[d]);const done=pp.items.some(i=>itemDone(i,aa)==='done')||aa.any;return `<div class="grid gap-1 rounded-lg py-1.5 ${d===t?'bg-accent-soft':''}"><div class="text-[11px] text-muted">${DOW[parse(d).getDay()]}</div><div class="num text-sm font-semibold">${parse(d).getDate()}</div><div class="flex justify-center gap-0.5">${pp.items.filter(i=>i.kind!=='off').slice(0,3).map(i=>`<span class="dot" style="background:${KIND_DOT[i.kind]}"></span>`).join('')||'<span class="dot" style="background:var(--line)"></span>'}</div><div class="h-4 text-xs font-bold text-accent">${done?'✓':''}</div></div>`;}).join('')}</div>
      <div><div class="mb-1 flex justify-between text-[13px]"><span class="text-muted">今週のラン</span><span class="num"><b>${km1(wAct)}</b> / ${wPlan}km</span></div>${bar(wAct,wPlan,'var(--sky)')}</div>
    </div></div>
  <div class="grid gap-2"><h2 class="h2">明日</h2>${dayCard(tm,null)}</div>`;
  if(window.renderActual)renderActual(ACT_DATE||t);
}

// ── ゴルフ ──
let GOLF_R=null,GOLF_PART='';
function golfData(r){if(r==='genie')return window.EX_G;if(r==='check')return window.EX_C;return [window.EX_Y[Number(r.slice(1))-1]];}
const GOLF_NAME={genie:'ジーニールーティン',y1:'ゴルトレ Day1',y2:'ゴルトレ Day2',y3:'ゴルトレ Day3',check:'体のチェック'};
const chkKey=(d,r)=>`golfchk:${d}:${r}`;
function getChk(d,r){try{return JSON.parse(localStorage.getItem(chkKey(d,r))||'[]');}catch{return[];}}
function setChk(d,r,a){try{localStorage.setItem(chkKey(d,r),JSON.stringify(a));}catch{}}
function renderGolf(req){
  if(req){const[r,part]=req.split(':');GOLF_R=r;GOLF_PART=part||'';}
  if(!GOLF_R){const it=planFor(today()).items.find(i=>i.routine);GOLF_R=it?it.routine:'genie';GOLF_PART=it&&it.part||'';}
  document.querySelectorAll('#golf-seg button').forEach(b=>b.classList.toggle('on',b.dataset.r===GOLF_R));
  const r=GOLF_R;const d=today();
  let blocks=golfData(r);
  if(r==='genie'&&GOLF_PART==='short')blocks=blocks.slice(0,4);
  if(r==='genie'&&GOLF_PART==='upper')blocks=[blocks[0],blocks[2]];
  if(r.startsWith('y')&&GOLF_PART==='stretch')blocks=[{...blocks[0],ex:blocks[0].ex.filter(e=>e.id==='y1f')}];
  if(r.startsWith('y')&&GOLF_PART==='short')blocks=[{b:'骨盤の2種目',t:'毎日OK',ex:[...window.EX_Y[1].ex.filter(e=>e.id==='y2a'),...window.EX_Y[2].ex.filter(e=>e.id==='y3a')]}];
  const chk=getChk(d,r);const all=blocks.flatMap(b=>b.ex);let n=0;
  const img=window.EX_IMG;
  const parts=r==='genie'?`<div class="flex flex-wrap gap-1.5">${[['','全部（60分）'],['short','⓪〜③（30分版）'],['upper','⓪＋②（水曜）']].map(([k,l])=>`<button class="btn-sm ${GOLF_PART===k?'!border-accent !text-accent':''}" onclick="GOLF_PART='${k}';renderGolf()">${l}</button>`).join('')}</div>`
    :(r.startsWith('y')&&GOLF_PART?`<div><button class="btn-sm" onclick="GOLF_PART='';renderGolf()">Dayの全種目を表示</button></div>`:'');
  const src=r==='genie'?'香妻陣一朗プロ（ジーニーゴルフ）「飛距離アップする為のトレーニングルーティン」':r==='check'?'ニューヨーク屋敷さん #72 ゴルフボディチェック':'ニューヨーク屋敷さん #72 ゴルフ専門ジムの3日間';
  $('golf-body').innerHTML=`
   <div class="grid gap-2"><div class="font-display text-2xl">${GOLF_NAME[r]}</div><div class="text-[12px] text-muted">出典：${src}。動画の順番どおり。写真は横にスワイプ。</div>${parts}</div>
   ${blocks.map(b=>`<div class="grid gap-3"><div class="flex flex-wrap items-baseline gap-x-3 border-b-2 border-fg pb-1"><h3 class="h2">${esc(b.b)}</h3><span class="font-mono text-xs text-muted">${esc(b.t)}</span>${b.p?`<p class="basis-full text-[13px] text-muted">${esc(b.p)}</p>`:''}</div>
    <div class="grid gap-3 sm:grid-cols-2">${b.ex.map(e=>{const c=img[e.id]||0;const on=chk.includes(e.id);const no=r==='check'?'':String(++n).padStart(2,'0');return `
     <article class="card overflow-hidden ${on?'ring-2 ring-accent':''}">
      <div class="relative"><div class="no-scrollbar flex h-56 snap-x snap-mandatory gap-1 overflow-x-auto bg-photo">${[...Array(c)].map((_,k)=>`<img src="img/${e.id}_${k}.jpg" alt="${esc(e.n)} ${k+1}" loading="lazy" class="block h-full w-auto max-w-none flex-none snap-start">`).join('')}</div>${c>1?`<span class="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black px-2 py-0.5 font-mono text-[11px] text-white opacity-70">写真 ${c}枚 →</span>`:''}</div>
      <div class="grid gap-2 p-3.5">
       <div class="flex flex-wrap items-center gap-2">${no?`<span class="rounded bg-fg px-1.5 font-mono text-xs font-semibold text-bg">${no}</span>`:''}<span class="font-mono text-[11px] text-muted">動画 ${esc(e.tm)}</span>${e.g?'<span class="rounded border border-line px-1 text-[10px] text-muted">推定</span>':''}${e.r?`<span class="ml-auto font-mono text-[13px] font-semibold text-accent">${esc(e.r)}</span>`:''}</div>
       <h4 class="text-base font-bold leading-snug">${esc(e.n)}</h4>
       <ol class="list-decimal pl-5 text-[13px]">${e.st.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
       ${e.tip?`<div class="rounded-lg bg-accent-soft px-2.5 py-1.5 text-[12px] [&_b]:text-accent"><b>ポイント</b>　${e.tip}</div>`:''}
       ${e.alt?`<div class="text-[12px] text-muted">${esc(e.alt)}</div>`:''}
       ${r!=='check'?`<button class="btn ${on?'bg-accent text-surface':'border border-line text-fg'} w-full py-2" onclick="toggleChk('${e.id}')">${on?'✓ できた':'できたらタップ'}</button>`:''}
      </div></article>`;}).join('')}</div></div>`).join('')}
   ${r!=='check'?`<div class="sticky z-10 grid gap-2 rounded-2xl border border-line bg-surface p-3 shadow-lg" style="bottom:calc(env(safe-area-inset-bottom,0px) + 12px)">
     <div class="flex items-center justify-between text-sm"><span>今日 <b class="num">${all.filter(e=>chk.includes(e.id)).length}</b> / ${all.length} 種目</span><button class="btn-sm" onclick="setChk(today(),GOLF_R,[]);renderGolf()">リセット</button></div>
     <button class="btn-main py-2.5" onclick="saveGolf()">今日の記録として保存</button></div>`:''}`;
}
document.querySelectorAll('#golf-seg button').forEach(b=>b.addEventListener('click',()=>{GOLF_R=b.dataset.r;GOLF_PART='';renderGolf();}));
function toggleChk(id){const d=today();const a=getChk(d,GOLF_R);const i=a.indexOf(id);if(i<0)a.push(id);else a.splice(i,1);setChk(d,GOLF_R,a);renderGolf();}
async function saveGolf(){
  const d=today();const r=GOLF_R;const chk=getChk(d,r);
  if(!chk.length){toast('できた種目をタップしてから保存してください',true);return;}
  const all=golfData(r).flatMap(b=>b.ex);const done=all.filter(e=>chk.includes(e.id));
  const code={genie:1,y1:2,y2:3,y3:4}[r]||9;
  const rec={id:Number(d.replace(/-/g,''))*100+code,date:d,cat:'golf',
    exercises:done.map(e=>({name:e.n,sets:[{weight:0,reps:parseInt(e.r)||0,done:true}]})),
    runDist:0,runTime:0,walkDist:0,walkTime:0,note:`${GOLF_NAME[r]}（${done.length}/${all.length}種目）`};
  if(await upsertRec(rec)){toast('保存しました');}
}

// ── マラソン ──
function paceStr(sec){const m=Math.floor(sec/60),s=Math.round(sec%60);return `${m}'${pad(s)}"`;}
function hms(sec){const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=Math.round(sec%60);return `${h}:${pad(m)}:${pad(s)}`;}
async function renderMarathon(){
  const el=$('p-marathon');const t=today();
  const recs=await getRecs();const bd=byDate(recs);
  const m=diffDays(t,RACE);
  const goals=[['サブ4',4*3600],['3時間45分',3.75*3600],['3時間30分',3.5*3600]];
  const months=[['2026-10','10月'],['2026-11','11月'],['2026-12','12月'],['2027-01','1月'],['2027-02','2月'],['2027-03','3月']];
  const monthRows=months.map(([k,l])=>{const[y,mo]=k.split('-').map(Number);const last=ymd(new Date(y,mo,0));const plan=plannedKm(k+'-01',k==='2027-03'?'2027-03-06':last);const act=recs.filter(r=>r.date.startsWith(k)).reduce((s,r)=>s+(r.runDist||0),0);return{k,l,plan,act};});
  const longs=longRuns();
  const runs=recs.filter(r=>r.runDist>0).slice(0,6);
  const cur=PHASES.find(p=>t>=p.from&&t<=p.to);
  el.innerHTML=`
  <div class="card grid gap-1 p-5">
    <div class="lbl">篠山ABCマラソン　2027年3月7日（日）</div>
    <div class="flex items-baseline gap-2"><span class="num text-5xl font-semibold text-sky">${Math.max(0,m)}</span><span class="text-muted">日</span></div>
    <div class="text-sm">まずはサブ4。練習が順調なら3時間30分を狙います。</div>
  </div>
  <div class="grid gap-2"><h2 class="h2">目標ペース</h2>
    <div class="grid grid-cols-3 gap-2">${goals.map(([l,s])=>`<div class="card p-3"><div class="text-[12px] font-bold">${l}</div><div class="num text-xl font-semibold text-sky">${paceStr(s/42.195)}</div><div class="text-[11px] text-muted">/km　中間 ${hms(s/2)}</div></div>`).join('')}</div></div>
  <div class="grid gap-2"><h2 class="h2">練習のペース</h2>
    <div class="card divide-y divide-line px-4">${[['イージー・ジョグ','easy','会話できる強度。一番多く走るペース'],['ロング走','long','土曜のロング。距離を踏むのが目的'],['マラソンペース','mp','サブ4のレースペース'],['テンポ走','tempo','少しきつい。火曜のポイント練習'],['インターバル','interval','1km×3〜5本。心肺を上げる']].map(([n,k,d])=>`<div class="flex items-center justify-between gap-3 py-2.5"><div><div class="font-bold">${n}</div><div class="text-[12px] text-muted">${d}</div></div><div class="num shrink-0 text-sm font-semibold">${PACE[k]}</div></div>`).join('')}</div>
    <p class="text-[12px] text-muted">楽に走れるペースが5〜6分/kmでも、イージーは6分30秒より遅く。故障を防ぎ、サブ3.5の土台になります。</p></div>
  <div class="grid gap-2"><h2 class="h2">3つの期間</h2>
    <div class="grid gap-2">${PHASES.map(p=>`<div class="card flex items-center gap-3 p-3.5 ${cur&&cur.id===p.id?'ring-2 ring-sky':''}"><div class="num w-24 shrink-0 text-[12px] text-muted">${p.from.slice(5).replace('-','/')}〜${p.to.slice(5).replace('-','/')}</div><div><div class="font-bold">${p.name}${cur&&cur.id===p.id?' <span class="chip k-run ml-1">今ここ</span>':''}</div><div class="text-[12px] text-muted">${p.sub}</div></div></div>`).join('')}</div></div>
  <div class="grid gap-2"><h2 class="h2">月間走行距離</h2>
    <div class="card grid gap-3 p-4">${monthRows.map(x=>`<div><div class="mb-1 flex justify-between text-[13px]"><span class="font-bold">${x.l}</span><span class="num"><b>${km1(x.act)}</b> / 計画 ${x.plan}km</span></div>${bar(x.act,x.plan,'var(--sky)')}</div>`).join('')}</div></div>
  <div class="grid gap-2"><h2 class="h2">土曜のロング走</h2>
    <div class="card divide-y divide-line px-4">${longs.map(l=>{const a=dayActual(bd[l.date]).run;const past=l.date<t;const st=a>=l.km*0.8?'✓':(a>0?km1(a):'');return `<div class="flex items-center gap-3 py-2 ${l.date===t?'font-bold':''}"><div class="num w-20 shrink-0 text-[13px] ${past&&!st?'text-muted':''}">${md(l.date)}</div><div class="min-w-0 flex-1 text-[12px] text-muted">${esc(l.note)}</div><div class="num w-12 text-right font-semibold text-sky">${l.km}km</div><div class="w-8 text-right text-sm font-bold text-accent">${st}</div></div>`;}).join('')}</div></div>
  <div class="grid gap-2"><h2 class="h2">最近のラン</h2>
    <div class="card divide-y divide-line px-4">${runs.length?runs.map(r=>`<div class="flex items-center justify-between gap-2 py-2.5 text-sm"><span>${md(r.date)}</span><span class="num"><b>${km1(r.runDist)}</b>km${r.runPaceMin?`　${r.runPaceMin}'${pad(r.runPaceSec||0)}"/km`:''}${r.runHr?`　${r.runHr}bpm`:''}</span></div>`).join(''):'<div class="py-3 text-sm text-muted">まだ記録がありません</div>'}</div></div>`;
}

// ── 週間 ──
let WEEK=null;
async function renderWeek(){
  const el=$('p-week');if(!WEEK)WEEK=mondayOf(today());
  const recs=await getRecs();const bd=byDate(recs);
  const days=[...Array(7)].map((_,i)=>addDays(WEEK,i));
  const acts=days.map(d=>dayActual(bd[d]));
  const plan=plannedKm(WEEK,days[6]);const run=acts.reduce((s,a)=>s+a.run,0);
  const cnt=k=>days.reduce((n,d)=>n+planFor(d).items.filter(i=>i.kind===k).length,0);
  const done=k=>days.reduce((n,d,i)=>n+planFor(d).items.filter(it=>it.kind===k&&itemDone(it,acts[i])==='done').length,0);
  el.innerHTML=`
  <div class="flex items-center justify-between gap-2"><button class="btn-sub px-3 py-2" onclick="WEEK=addDays(WEEK,-7);renderWeek()">←</button><div class="text-center"><div class="font-display text-lg">${md(days[0])} 〜 ${md(days[6])}</div><button class="text-[12px] font-bold text-accent" onclick="WEEK=mondayOf(today());renderWeek()">今週にもどる</button></div><button class="btn-sub px-3 py-2" onclick="WEEK=addDays(WEEK,7);renderWeek()">→</button></div>
  <div class="card grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
    <div class="col-span-2"><div class="mb-1 flex justify-between text-[13px]"><span class="text-muted">ラン</span><span class="num"><b>${km1(run)}</b> / ${plan}km</span></div>${bar(run,plan,'var(--sky)')}</div>
    <div><div class="lbl">ゴルフ体づくり</div><div class="num text-lg font-semibold">${done('genie')+done('goltore')}<span class="text-sm text-muted"> / ${cnt('genie')+cnt('goltore')}</span></div></div>
    <div><div class="lbl">筋トレ</div><div class="num text-lg font-semibold">${done('gym')}<span class="text-sm text-muted"> / ${cnt('gym')}</span></div></div>
  </div>
  <div class="grid gap-3">${days.map((d,i)=>dayCard(d,acts[i],{action:d>=today()})).join('')}</div>`;
}

// ── 月間 ──
let MONTH=null,MSEL=null;
async function renderMonth(){
  const el=$('p-month');const t=today();if(!MONTH)MONTH=t.slice(0,7);
  const recs=await getRecs();const bd=byDate(recs);
  const[y,mo]=MONTH.split('-').map(Number);const first=MONTH+'-01';const last=ymd(new Date(y,mo,0));
  const start=mondayOf(first);const cells=[];let s=start;while(s<=last||cells.length%7){cells.push(s);s=addDays(s,1);}
  if(!MSEL||!MSEL.startsWith(MONTH))MSEL=t.startsWith(MONTH)?t:first;
  const plan=monthTarget(MONTH);const run=recs.filter(r=>r.date.startsWith(MONTH)).reduce((a,r)=>a+(r.runDist||0),0);
  const golfN=recs.filter(r=>r.date.startsWith(MONTH)&&isGolf(r)).length;
  const gymN=new Set(recs.filter(r=>r.date.startsWith(MONTH)&&!isGolf(r)&&gymEx(r).length).map(r=>r.date)).size;
  const prev=ymd(new Date(y,mo-2,1)).slice(0,7),next=ymd(new Date(y,mo,1)).slice(0,7);
  el.innerHTML=`
  <div class="flex items-center justify-between gap-2"><button class="btn-sub px-3 py-2" onclick="MONTH='${prev}';renderMonth()">←</button><div class="text-center"><div class="font-display text-xl">${y}年${mo}月</div><button class="text-[12px] font-bold text-accent" onclick="MONTH=today().slice(0,7);MSEL=null;renderMonth()">今月にもどる</button></div><button class="btn-sub px-3 py-2" onclick="MONTH='${next}';renderMonth()">→</button></div>
  <div class="card overflow-hidden">
    <div class="grid grid-cols-7 border-b border-line text-center text-[11px] text-muted">${['月','火','水','木','金','土','日'].map(w=>`<div class="py-1.5">${w}</div>`).join('')}</div>
    <div class="grid grid-cols-7">${cells.map(c=>{const inM=c.startsWith(MONTH);const pp=planFor(c);const aa=dayActual(bd[c]);const ev=pp.items.find(i=>i.kind==='event');const k=pp.items.reduce((a,i)=>a+(i.km&&i.kind!=='event'?i.km:0),0);const done=aa.any;return `<button onclick="MSEL='${c}';renderMonth()" class="grid min-h-[64px] content-start gap-0.5 border-b border-r border-line p-1 text-left ${inM?'':'opacity-40'} ${c===MSEL?'bg-accent-soft':''} ${ev?'bg-warn-soft':''}">
      <div class="flex items-center justify-between"><span class="num text-xs font-semibold ${c===t?'rounded bg-fg px-1 text-bg':''}">${parse(c).getDate()}</span><span class="text-[11px] font-bold text-accent">${done?'✓':''}</span></div>
      <div class="flex flex-wrap gap-0.5">${pp.items.filter(i=>i.kind!=='off').map(i=>`<span class="dot" style="background:${KIND_DOT[i.kind]}"></span>`).join('')}</div>
      ${ev?`<div class="text-[10px] font-bold leading-tight text-warn">${ev.label.slice(0,6)}</div>`:(k?`<div class="num text-[10px] text-sky">${k}km</div>`:'')}
    </button>`;}).join('')}</div>
  </div>
  <div class="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted">${['genie','goltore','run','gym','pilates','event'].map(k=>`<span class="inline-flex items-center gap-1"><span class="dot" style="background:${KIND_DOT[k]}"></span>${KIND_LABEL[k]}</span>`).join('')}<span>✓ 記録あり</span></div>
  ${dayCard(MSEL,dayActual(bd[MSEL]),{action:MSEL>=t})}
  <div class="card grid gap-3 p-4">
    <div><div class="mb-1 flex justify-between text-[13px]"><span class="text-muted">今月のラン</span><span class="num"><b>${km1(run)}</b> / 計画 ${plan}km</span></div>${bar(run,plan,'var(--sky)')}</div>
    <div class="grid grid-cols-2 gap-3"><div><div class="lbl">ゴルフ体づくり</div><div class="num text-lg font-semibold">${golfN}<span class="text-sm text-muted"> 回</span></div></div><div><div class="lbl">筋トレした日</div><div class="num text-lg font-semibold">${gymN}<span class="text-sm text-muted"> 日</span></div></div></div>
  </div>`;
}

// ── 記録フォーム ──
const GOLF_PRESETS=[...window.EX_G,...window.EX_Y].flatMap(b=>b.ex.map(e=>e.n));
const PRESETS_BY_CAT={
  push:['ベンチプレス','インクラインベンチプレス','スミスベンチプレス','スミスインクラインプレス','DBフラットプレス','DBインクラインプレス','DBフライ','インクラインDBフライ','ケーブルクロスオーバー','ケーブルフライ（上から）','ケーブルフライ（下から）','DBショルダープレス','スミスショルダープレス','DBサイドレイズ','DBフロントレイズ','ケーブルサイドレイズ','フェイスプル','DBリアレイズ','ケーブルトライセプスプッシュダウン','ケーブルオーバーヘッドトライセプス','DBトライセプスキックバック','DBオーバーヘッドトライセプス','クローズグリップベンチプレス'],
  pull:['デッドリフト','スモウデッドリフト','ルーマニアンデッドリフト','ラットプルダウン','チンニング（懸垂）','シーテッドロウ（ケーブル）','Tバーロウ','DBワンハンドロウ','スミスベントオーバーロウ','フリーバーベルロウ','ケーブルロウ（片手）','バーベルカール','DBカール','ハンマーカール','インクラインDBカール','ケーブルカール','コンセントレーションカール'],
  legs:['スクワット','スミススクワット','ブルガリアンスプリットスクワット','レッグプレス','レッグエクステンション','レッグカール','カーフレイズ','DBランジ','アブローラー','ケーブルクランチ','ハンギングレッグレイズ','DBサイドベンド','ロシアンツイスト'],
  golf:GOLF_PRESETS,
  run:[],
};
PRESETS_BY_CAT.full=[...new Set([...PRESETS_BY_CAT.push,...PRESETS_BY_CAT.pull,...PRESETS_BY_CAT.legs])];
let exCount=0;
function addExBlock(name='',sets=[]){
  exCount++;const id=exCount;const presets=PRESETS_BY_CAT[$('rec-cat').value]||[];
  const list=name&&!presets.includes(name)?[name,...presets]:presets;
  const div=document.createElement('div');div.className='ex-block card grid gap-2 p-3.5';div.id='ex-'+id;
  div.innerHTML=`<div class="flex items-center gap-2"><select class="ex-name inp font-bold" id="exsel-${id}"><option value="">── 種目を選ぶ ──</option>${list.map(p=>`<option value="${esc(p)}"${name===p?' selected':''}>${esc(p)}</option>`).join('')}</select><button class="btn-sm shrink-0 !text-warn" onclick="$('ex-${id}').remove()">削除</button></div>
    <div class="grid grid-cols-[24px_1fr_1fr_36px_24px] gap-1.5 text-center text-[11px] text-muted"><span>#</span><span>重量 kg</span><span>回数</span><span>完了</span><span></span></div>
    <div id="sets-${id}" class="grid gap-1.5"></div>
    <button class="rounded-lg border border-dashed border-line py-2 text-xs font-bold text-accent" onclick="addSetRow(${id})">＋ セット追加</button>`;
  $('ex-blocks').appendChild(div);
  if(sets.length)sets.forEach(s=>addSetRow(id,s.weight,s.reps,s.done));else addSetRow(id);
}
function addSetRow(exId,weight='',reps='',done=false){
  const c=$('sets-'+exId);const n=c.children.length+1;
  const row=document.createElement('div');row.className='set-row grid grid-cols-[24px_1fr_1fr_36px_24px] items-center gap-1.5';
  row.innerHTML=`<span class="set-num num text-center text-xs text-muted">${n}</span><input type="number" placeholder="kg" step="0.5" value="${weight||''}" inputmode="decimal" class="inp px-1 py-2 text-center"><input type="number" placeholder="回" step="1" value="${reps||''}" inputmode="numeric" class="inp px-1 py-2 text-center"><input type="checkbox" ${done?'checked':''} class="mx-auto h-5 w-5 accent-[var(--accent)]"><button class="text-lg text-muted" onclick="this.parentElement.remove();renum(${exId})">×</button>`;
  c.appendChild(row);
}
function renum(id){document.querySelectorAll('#sets-'+id+' .set-num').forEach((el,i)=>el.textContent=i+1);}
function collectEx(){
  return[...document.querySelectorAll('.ex-block')].map(b=>{const name=(b.querySelector('.ex-name')||{}).value||'';
    const sets=[...b.querySelectorAll('.set-row')].map(r=>{const inp=r.querySelectorAll('input');return{weight:parseFloat(inp[0].value)||0,reps:parseInt(inp[1].value)||0,done:inp[2].checked};}).filter(s=>s.weight>0||s.reps>0||s.done);
    return{name:name.trim(),sets};}).filter(e=>e.name);
}
const FIELDS=['run-dist','run-time-min','run-time-sec','run-pace-min','run-pace-sec','run-hr','run-cal','walk-dist','walk-time-min','walk-time-sec','rec-note'];
function resetForm(){FIELDS.forEach(id=>$(id).value='');$('ex-blocks').innerHTML='';exCount=0;$('rec-date').value=today();addExBlock();}
function openLog(cat){cancelEdit(true);$('rec-cat').value=cat||'full';resetForm();show('log');}
$('rec-cat').addEventListener('change',()=>{$('ex-blocks').innerHTML='';exCount=0;addExBlock();});
let EDIT_ID=null;
async function saveRecord(){
  const date=$('rec-date').value;if(!date){toast('日付を入力してください',true);return;}
  const v=id=>$(id).value;
  const rec={id:EDIT_ID||Date.now(),date,cat:$('rec-cat').value,exercises:collectEx(),runDist:parseFloat(v('run-dist'))||0,
    runTime:(parseInt(v('run-time-min'))||0)*60+(parseInt(v('run-time-sec'))||0),runPaceMin:parseInt(v('run-pace-min'))||0,runPaceSec:parseInt(v('run-pace-sec'))||0,
    runHr:parseInt(v('run-hr'))||0,runCal:parseInt(v('run-cal'))||0,walkDist:parseFloat(v('walk-dist'))||0,
    walkTime:(parseInt(v('walk-time-min'))||0)*60+(parseInt(v('walk-time-sec'))||0),note:v('rec-note').trim()};
  if(rec.runDist>0&&rec.runTime>0&&!rec.runPaceMin){const p=rec.runTime/rec.runDist;rec.runPaceMin=Math.floor(p/60);rec.runPaceSec=Math.round(p%60);}
  const wasEdit=!!EDIT_ID;
  if(await upsertRec(rec)){toast(wasEdit?'更新しました':'記録しました');cancelEdit(true);resetForm();}
}
function cancelEdit(silent){EDIT_ID=null;$('edit-banner').classList.add('hidden');$('edit-banner').classList.remove('flex');$('save-btn').textContent='記録する';if(!silent)resetForm();}
async function editRec(id){
  const r=(await getRecs()).find(r=>Number(r.id)===Number(id));if(!r)return;
  $('rec-date').value=r.date;$('rec-cat').value=isGolf(r)?'golf':r.cat;
  $('run-dist').value=r.runDist||'';$('run-time-min').value=Math.floor((r.runTime||0)/60)||'';$('run-time-sec').value=(r.runTime||0)%60||'';
  $('run-pace-min').value=r.runPaceMin||'';$('run-pace-sec').value=r.runPaceSec||'';$('run-hr').value=r.runHr||'';$('run-cal').value=r.runCal||'';
  $('walk-dist').value=r.walkDist||'';$('walk-time-min').value=Math.floor((r.walkTime||0)/60)||'';$('walk-time-sec').value=(r.walkTime||0)%60||'';
  $('rec-note').value=r.note||'';$('ex-blocks').innerHTML='';exCount=0;
  (r.exercises&&r.exercises.length?r.exercises:[{name:'',sets:[]}]).forEach(e=>addExBlock(e.name,e.sets));
  EDIT_ID=id;$('edit-banner').classList.remove('hidden');$('edit-banner').classList.add('flex');$('save-btn').textContent='更新する';
  show('log');toast('編集モードにしました');
}
async function delRec(id){if(!confirm('この記録を削除しますか？'))return;if(await deleteRec(id)){toast('削除しました');renderHistory();}}

// ── 履歴 ──
let curMonth=null;
const CAT={push:'プッシュ',pull:'プル',legs:'脚・体幹',run:'ラン',full:'筋トレ＋ラン',golf:'ゴルフ体づくり',walk:'ウォーク'};
const CATK={push:'gym',pull:'gym',legs:'gym',run:'run',full:'gym',golf:'genie',walk:'run'};
async function renderHistory(){
  const recs=await getRecs();
  const months=[...new Set(recs.map(r=>r.date.slice(0,7)))].sort((a,b)=>b.localeCompare(a));
  $('month-bar').innerHTML=[`<button class="btn-sm ${curMonth===null?'!border-fg !text-fg':''}" onclick="curMonth=null;renderHistory()">すべて</button>`,...months.map(m=>`<button class="btn-sm shrink-0 ${curMonth===m?'!border-fg !text-fg':''}" onclick="curMonth='${m}';renderHistory()">${m.slice(2,4)}年${parseInt(m.slice(5))}月</button>`)].join('');
  const list=curMonth?recs.filter(r=>r.date.startsWith(curMonth)):recs;
  $('log-list').innerHTML=list.length?list.map(r=>{
    const g=isGolf(r);const cat=g?'golf':r.cat;
    const kinds=(r.exercises||[]).filter(e=>e.kind&&e.kind!=='form').map(e=>{
      const lab=e.kind==='range'?`練習場 ${e.balls}球`:e.kind==='round'?`${e.name}${e.score?' スコア'+e.score:''}${e.putts?'（'+e.putts+'パット）':''}`:e.kind==='pilates'?`ピラティス ${e.min||''}分`:e.name;
      const k=e.kind==='golf'?((e.routine||'').startsWith('y')?'goltore':'genie'):e.kind==='range'||e.kind==='round'?'event':e.kind==='pilates'?'pilates':e.kind;
      return e.status==='skip'?`<span class="chip k-off">${esc(e.name)} 休み</span>`:`<span class="chip k-${k==='event'?'prep':k}">${esc(lab)}${e.status==='change'?'（変更）':' ✓'}</span>`;}).join('');
    const ex=(r.exercises||[]).filter(e=>!e.kind).map(e=>{
      if(g)return `<span class="chip k-genie">${esc(e.name)} ✓</span>`;
      const mx=Math.max(0,...e.sets.map(s=>s.weight));
      return `<div class="border-b border-line py-1.5 last:border-0"><div class="flex justify-between gap-2"><span class="font-bold">${esc(e.name)}</span><span class="num text-[12px] text-muted">${e.sets.length}セット${mx?' · 最大'+mx+'kg':''}</span></div><div class="num flex flex-wrap gap-x-3 text-[12px] text-muted">${e.sets.map((s,i)=>`<span>${i+1}. ${s.weight?s.weight+'kg':''}${s.weight&&s.reps?'×':''}${s.reps?s.reps+'回':''}${s.done?' <b class="text-accent">✓</b>':''}</span>`).join('')}</div></div>`;}).join('');
    const run=r.runDist>0?`<div class="num flex flex-wrap gap-x-4 text-sm"><span class="text-sky">ラン</span><span><b>${km1(r.runDist)}</b>km</span>${r.runTime?`<span>${Math.floor(r.runTime/60)}'${pad(r.runTime%60)}"</span>`:''}${r.runPaceMin?`<span>${r.runPaceMin}'${pad(r.runPaceSec||0)}"/km</span>`:''}${r.runHr?`<span>${r.runHr}bpm</span>`:''}${r.runCal?`<span>${r.runCal}kcal</span>`:''}</div>`:'';
    const walk=r.walkDist>0?`<div class="num flex gap-x-4 text-sm text-muted"><span>ウォーク</span><span>${km1(r.walkDist)}km</span>${r.walkTime?`<span>${Math.floor(r.walkTime/60)}'${pad(r.walkTime%60)}"</span>`:''}</div>`:'';
    return `<div class="card grid gap-2 p-4"><div class="flex items-start justify-between gap-2"><div><div class="font-bold">${md(r.date)}</div><div class="mt-0.5">${chip(CATK[cat]||'gym',CAT[cat]||cat)}</div></div><div class="flex gap-1.5"><button class="btn-sm !text-accent" onclick="editRec(${r.id})">編集</button><button class="btn-sm !text-warn" onclick="delRec(${r.id})">削除</button></div></div>
      ${kinds?`<div class="flex flex-wrap gap-1">${kinds}</div>`:''}${ex?(g?`<div class="flex flex-wrap gap-1">${ex}</div>`:`<div>${ex}</div>`):''}${run}${walk}${r.note&&r.note.replace(/^\[(ゴルフ|実績)\]\s*/,'')?`<div class="text-[13px] text-muted">${esc(r.note.replace(/^\[(ゴルフ|実績)\]\s*/,''))}</div>`:''}</div>`;
  }).join(''):'<div class="py-10 text-center text-sm text-muted">記録がありません</div>';
}

// ── 進捗 ──
async function renderStats(){
  const recs=await getRecs();const t=today();const thisM=t.slice(0,7);
  const mRecs=recs.filter(r=>r.date.startsWith(thisM));
  const run=mRecs.reduce((s,r)=>s+(r.runDist||0),0);
  const plan=monthTarget(thisM);
  const gymDays=new Set(mRecs.filter(r=>!isGolf(r)&&gymEx(r).length).map(r=>r.date)).size;
  const golfN=mRecs.filter(isGolf).length;
  const allBench=recs.flatMap(r=>(r.exercises||[]).filter(e=>e.name.includes('ベンチ')).flatMap(e=>e.sets.map(s=>({date:r.date,w:s.weight})))).filter(b=>b.w>0);
  const maxBench=allBench.length?Math.max(...allBench.map(b=>b.w)):0;
  const bByDay={};allBench.forEach(b=>{if(!bByDay[b.date]||bByDay[b.date]<b.w)bByDay[b.date]=b.w;});
  const bdates=Object.keys(bByDay).sort().slice(-8).reverse();
  const runByM={};recs.forEach(r=>{if(r.runDist>0){const m=r.date.slice(0,7);runByM[m]=(runByM[m]||0)+r.runDist;}});
  const rmonths=Object.keys(runByM).sort().slice(-6).reverse();
  const card=(v,l,sub,prog)=>`<div class="card grid gap-1 p-4"><div class="num text-2xl font-semibold">${v}</div><div class="lbl">${l}</div>${prog||''}${sub?`<div class="text-[11px] text-muted">${sub}</div>`:''}</div>`;
  $('p-stats').innerHTML=`
   <div class="grid gap-2"><h2 class="h2">今月</h2><div class="grid grid-cols-2 gap-3">
    ${card(km1(run)+'<span class="text-sm text-muted"> km</span>','ラン距離',`計画 ${plan}km`,bar(run,plan,'var(--sky)'))}
    ${card(maxBench?maxBench+'<span class="text-sm text-muted"> kg</span>':'—','ベンチ最大重量','目標 125kg',bar(maxBench,125))}
    ${card(gymDays+'<span class="text-sm text-muted"> 日</span>','筋トレした日')}
    ${card(golfN+'<span class="text-sm text-muted"> 回</span>','ゴルフ体づくり')}
   </div></div>
   <div class="grid gap-2"><h2 class="h2">ベンチプレス最大重量</h2><div class="card grid gap-2.5 p-4">${bdates.length?bdates.map(d=>`<div class="grid grid-cols-[72px_64px_1fr_40px] items-center gap-2 text-sm"><span class="text-[12px] text-muted">${md(d)}</span><b class="num">${bByDay[d]}kg</b>${bar(bByDay[d],125)}<span class="num text-right text-[11px] text-muted">${Math.round(bByDay[d]/125*100)}%</span></div>`).join(''):'<div class="text-sm text-muted">データなし</div>'}</div></div>
   <div class="grid gap-2"><h2 class="h2">月間ラン距離</h2><div class="card grid gap-2.5 p-4">${rmonths.length?rmonths.map(m=>{const mm=Number(m.slice(5));const p=monthTarget(m);return `<div class="grid grid-cols-[48px_64px_1fr_60px] items-center gap-2 text-sm"><span class="text-[12px] text-muted">${mm}月</span><b class="num">${km1(runByM[m])}</b>${bar(runByM[m],p,'var(--sky)')}<span class="num text-right text-[11px] text-muted">/${p}km</span></div>`;}).join(''):'<div class="text-sm text-muted">データなし</div>'}</div><p class="text-[12px] text-muted">10月以降は計画の距離、それ以前は月70kmを目標として表示しています。</p></div>`;
}

// ── 取込 ──
async function importRecords(){
  const text=$('import-text').value.trim();if(!text)return;
  const lines=text.split('\n').filter(l=>l.trim());$('import-result').textContent='処理中…';let ok=0,err=0;
  for(const line of lines){
    const p=line.split(',');if(!p[0]||!p[0].trim())continue;
    const rec={id:Date.now()+Math.floor(Math.random()*1000),date:p[0].trim(),cat:(p[1]||'run').trim(),exercises:[],runDist:parseFloat(p[2])||0,runTime:(parseInt(p[3])||0)*60+(parseInt(p[4])||0),runPaceMin:parseInt(p[5])||0,runPaceSec:parseInt(p[6])||0,runHr:parseInt(p[7])||0,runCal:parseInt(p[8])||0,walkDist:parseFloat(p[9])||0,walkTime:(parseInt(p[10])||0)*60+(parseInt(p[11])||0),note:p.slice(12).join(',').trim()};
    if(await upsertRec(rec))ok++;else err++;
    await new Promise(r=>setTimeout(r,100));
  }
  $('import-result').textContent=`✓ ${ok}件インポートしました`+(err?`（${err}件は失敗）`:'');$('import-text').value='';
}

// ── カラーパレット ──
function openPalette(){
  const T=window.THEME;const cur=T.current();const dk=document.documentElement.style.colorScheme==='dark';
  $('pal-grid').innerHTML=T.THEMES.map(([n],i)=>{const t=T.tokens(i,dk);return `<button onclick="THEME.pick(${i});openPalette()" class="grid justify-items-center gap-1 rounded-xl p-1.5 ${cur.i===i?'ring-2 ring-fg':''}" aria-label="${n}">
    <span class="relative block h-10 w-10 overflow-hidden rounded-full border border-line" style="background:${t['--bg']}"><span class="absolute inset-x-0 bottom-0 h-1/2" style="background:${t['--accent']}"></span></span><span class="text-[10px] leading-tight text-muted">${n}</span></button>`;}).join('');
  document.querySelectorAll('#pal-mode button').forEach(b=>b.classList.toggle('on',b.dataset.m===cur.mode));
  $('palette').classList.remove('hidden');$('palette').classList.add('flex');
}
function closePalette(){$('palette').classList.add('hidden');$('palette').classList.remove('flex');}

// ── 起動 ──
headerCount();
$('rec-date').value=today();addExBlock();
show((location.hash||'#today').slice(1));
window.addEventListener('hashchange',()=>{const h=(location.hash||'#today').slice(1);if(h!==CUR)show(h);});
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
