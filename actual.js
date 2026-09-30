// ─────────────────────────────────────────────
// 今日の実績（実際にやったメニューを記入）… ホーム画面
//   1日1件の記録として保存（id = 日付×100 + 50）
// ─────────────────────────────────────────────
const GYM_DEFAULTS={
  'スクワット 3×6':[['スクワット',3,6]],
  '上半身':[['ベンチプレス',4,5],['DBワンハンドロウ',3,10],['フェイスプル',3,15]],
  'デッドリフト 3×5':[['デッドリフト',3,5]],
  '脚の筋力':[['スクワット',4,5],['ブルガリアンスプリットスクワット',3,8]],
  '上半身（ベンチ強化）':[['ベンチプレス',5,4],['シーテッドロウ（ケーブル）',3,10],['フェイスプル',3,15]],
  '脚の筋力維持':[['スクワット',3,5]],
};
let ACT_DATE=null;const ACT={};const ACT_DIRTY=new Set();
// 入力するたびに状態へ反映（タブを移っても消えない）
document.addEventListener('input',e=>{if(e.target.closest&&e.target.closest('#act-box')){actRead();ACT_DIRTY.add(ACT_DATE);}});
const dailyId=d=>Number(d.replace(/-/g,''))*100+50;
function lastWeight(recs,name){for(const r of recs){for(const e of (r.exercises||[])){if(!e.kind&&e.name===name){const w=Math.max(0,...(e.sets||[]).map(s=>s.weight||0));if(w)return w;}}}return '';}
function golfCount(d,routine){const all=golfData(routine).flatMap(b=>b.ex).length;return{done:getChk(d,routine).length,all};}

function actInit(d,recs,items){
  const rec=recs.find(r=>Number(r.id)===dailyId(d));
  const form=rec&&(rec.exercises||[]).find(e=>e.kind==='form');
  if(form&&form.data)return JSON.parse(JSON.stringify(form.data));
  return{items:items.map(it=>({st:'',km:'',min:'',sec:'',hr:'',pmin:it.kind==='pilates'?10:'',score:'',putts:'',note:'',
    rows:(it.ex||GYM_DEFAULTS[it.label]||[]).map(([n,s,r])=>({n,w:lastWeight(recs,n),r,s}))})),balls:'',walk:'',memo:''};
}
function actRead(){
  const S=ACT[ACT_DATE];if(!S)return;
  document.querySelectorAll('#act-box [data-f]').forEach(el=>{
    const[p,i,k,j]=el.dataset.f.split('.');
    if(p==='g'){S[k]=el.value;return;}
    const it=S.items[+i];if(!it)return;
    if(k==='rows'){const row=it.rows[+j];if(row)row[el.dataset.c]=el.value;return;}
    it[k]=el.value;
  });
}
const inpS='inp px-2 py-2 text-center';
function actItem(it,i,s,d){
  const st=s.st;const b=(v,l,cls)=>`<button class="flex-1 rounded-lg px-1 py-1.5 text-[12px] font-bold ${st===v?cls:'text-muted'}" onclick="actSet(${i},'${v}')">${l}</button>`;
  let body='';
  if(st==='done'||st==='change'){
    if(it.kind==='run')body=`<div class="grid grid-cols-4 gap-1.5"><label class="grid gap-0.5"><span class="lbl">距離km</span><input data-f="i.${i}.km" value="${esc(s.km)}" placeholder="${it.km||''}" inputmode="decimal" class="${inpS}"></label><label class="grid gap-0.5"><span class="lbl">分</span><input data-f="i.${i}.min" value="${esc(s.min)}" inputmode="numeric" class="${inpS}"></label><label class="grid gap-0.5"><span class="lbl">秒</span><input data-f="i.${i}.sec" value="${esc(s.sec)}" inputmode="numeric" class="${inpS}"></label><label class="grid gap-0.5"><span class="lbl">心拍</span><input data-f="i.${i}.hr" value="${esc(s.hr)}" inputmode="numeric" class="${inpS}"></label></div>`;
    else if(it.kind==='gym')body=`<div class="grid gap-1.5"><div class="grid grid-cols-[1fr_52px_44px_44px_20px] gap-1 text-[11px] text-muted"><span>種目</span><span class="text-center">kg</span><span class="text-center">回</span><span class="text-center">セット</span><span></span></div>
      ${s.rows.map((r,j)=>`<div class="grid grid-cols-[1fr_52px_44px_44px_20px] items-center gap-1"><input list="ex-list" data-f="i.${i}.rows.${j}" data-c="n" value="${esc(r.n)}" placeholder="種目名" class="inp px-2 py-2 text-[13px]"><input data-f="i.${i}.rows.${j}" data-c="w" value="${esc(r.w)}" inputmode="decimal" class="${inpS} px-1"><input data-f="i.${i}.rows.${j}" data-c="r" value="${esc(r.r)}" inputmode="numeric" class="${inpS} px-1"><input data-f="i.${i}.rows.${j}" data-c="s" value="${esc(r.s)}" inputmode="numeric" class="${inpS} px-1"><button class="text-muted" onclick="actRow(${i},${j})">×</button></div>`).join('')}
      <button class="rounded-lg border border-dashed border-line py-1.5 text-xs font-bold text-accent" onclick="actRow(${i},-1)">＋ 種目を追加</button></div>`;
    else if(it.routine){const g=golfCount(d,it.routine);body=`<div class="flex items-center justify-between gap-2 rounded-lg bg-accent-soft px-3 py-2 text-[13px]"><span>写真メニューで <b class="num">${g.done}</b> / ${g.all} 種目チェック</span><button class="btn-sm !border-accent !text-accent" onclick="show('golf',{routine:'${it.routine}${it.part?':'+it.part:''}'})">写真メニュー</button></div>`;}
    else if(it.kind==='pilates')body=`<label class="flex items-center gap-2"><span class="lbl">時間</span><input data-f="i.${i}.pmin" value="${esc(s.pmin)}" inputmode="numeric" class="${inpS} w-20"><span class="text-sm text-muted">分</span></label>`;
    else if(it.kind==='event'&&it.label.includes('ラウンド'))body=`<div class="grid grid-cols-2 gap-2"><label class="grid gap-0.5"><span class="lbl">スコア</span><input data-f="i.${i}.score" value="${esc(s.score)}" inputmode="numeric" class="${inpS}"></label><label class="grid gap-0.5"><span class="lbl">パット数</span><input data-f="i.${i}.putts" value="${esc(s.putts)}" inputmode="numeric" class="${inpS}"></label></div>`;
    else if(it.kind==='event')body=`<div class="grid grid-cols-3 gap-2"><label class="grid gap-0.5"><span class="lbl">距離km</span><input data-f="i.${i}.km" value="${esc(s.km||42.195)}" class="${inpS}"></label><label class="grid gap-0.5"><span class="lbl">分（合計）</span><input data-f="i.${i}.min" value="${esc(s.min)}" inputmode="numeric" class="${inpS}"></label><label class="grid gap-0.5"><span class="lbl">秒</span><input data-f="i.${i}.sec" value="${esc(s.sec)}" inputmode="numeric" class="${inpS}"></label></div>`;
    if(st==='change')body+=`<input data-f="i.${i}.note" value="${esc(s.note)}" placeholder="何に変えたか（例：雨でジムでバイク30分）" class="inp mt-1.5 text-[13px]">`;
  }
  if(st==='skip')body=`<input data-f="i.${i}.note" value="${esc(s.note)}" placeholder="理由（任意）例：子どもの発熱で休み" class="inp text-[13px]">`;
  return `<div class="grid gap-2 py-3">
    <div class="flex items-center gap-2">${chip(it.kind)}<div class="min-w-0 flex-1 font-bold leading-snug">${esc(it.label)}${it.km?` <span class="num text-sm text-sky">${it.km}km</span>`:''}</div></div>
    <div class="flex gap-1 rounded-xl bg-line p-1">${b('done','やった','bg-accent text-surface')}${b('change','変えてやった','bg-sand text-surface')}${b('skip','やってない','bg-surface text-fg')}</div>
    ${body}</div>`;
}
async function renderActual(d){
  ACT_DATE=d||ACT_DATE||today();d=ACT_DATE;
  const box=$('act-box');if(!box)return;
  const recs=await getRecs();
  const items=planFor(d).items.filter(it=>it.kind!=='off');
  if(!ACT[d])ACT[d]=actInit(d,recs,items);
  const S=ACT[d];while(S.items.length<items.length)S.items.push({st:'',rows:[]});
  const saved=recs.some(r=>Number(r.id)===dailyId(d));
  const y=addDays(today(),-1);
  box.innerHTML=`
   <div class="flex flex-wrap items-center justify-between gap-2"><h2 class="h2">実際にやったメニュー</h2>
     <div class="flex items-center gap-1">${[[today(),'今日'],[y,'昨日']].map(([v,l])=>`<button class="btn-sm ${d===v?'!border-fg !text-fg':''}" onclick="actRead();renderActual('${v}')">${l}</button>`).join('')}<input type="date" value="${d}" onchange="actRead();renderActual(this.value)" class="rounded-lg border border-line bg-field px-1.5 py-0.5 text-xs"></div></div>
   <div class="card px-4 py-1">
     <div class="flex items-center justify-between border-b border-line py-2 text-sm"><b>${md(d)}</b>${saved?'<span class="chip k-genie">保存済み・直せます</span>':'<span class="text-[12px] text-muted">未保存</span>'}</div>
     <div class="divide-y divide-line">${items.length?items.map((it,i)=>actItem(it,i,S.items[i],d)).join(''):'<div class="py-3 text-sm text-muted">この日は休みの予定です。やったことがあれば下に書いてください。</div>'}</div>
     <div class="grid gap-2 border-t border-line py-3">
       <div class="grid grid-cols-2 gap-2"><label class="grid gap-0.5"><span class="lbl">練習場（球数）</span><input data-f="g.0.balls" value="${esc(S.balls)}" inputmode="numeric" placeholder="0" class="${inpS}"></label><label class="grid gap-0.5"><span class="lbl">ウォーキング（km）</span><input data-f="g.0.walk" value="${esc(S.walk)}" inputmode="decimal" placeholder="0" class="${inpS}"></label></div>
       <label class="grid gap-0.5"><span class="lbl">予定外にやったこと・体調メモ</span><textarea data-f="g.0.memo" rows="2" class="inp text-[13px]" placeholder="例：寝不足。肩の張りは軽め">${esc(S.memo)}</textarea></label>
     </div>
   </div>
   <button class="btn-main" onclick="busy(this,saveActual)">${saved?'実績を更新する':'実績を保存する'}</button>
   <datalist id="ex-list">${[...new Set([...PRESETS_BY_CAT.full])].map(n=>`<option value="${esc(n)}">`).join('')}</datalist>`;
}
function actSet(i,v){actRead();ACT_DIRTY.add(ACT_DATE);const s=ACT[ACT_DATE].items[i];s.st=s.st===v?'':v;
  const it=planFor(ACT_DATE).items.filter(x=>x.kind!=='off')[i];
  if(v==='done'&&it&&it.kind==='run'&&!s.km)s.km=it.km||'';
  renderActual();}
function actRow(i,j){actRead();ACT_DIRTY.add(ACT_DATE);const rows=ACT[ACT_DATE].items[i].rows;if(j<0)rows.push({n:'',w:'',r:'',s:3});else rows.splice(j,1);renderActual();}
async function saveActual(){
  actRead();const d=ACT_DATE;const S=ACT[d];
  const items=planFor(d).items.filter(it=>it.kind!=='off');
  const ex=[];let runDist=0,runTime=0,runHr=0,hasGym=false,notes=[];
  items.forEach((it,i)=>{const s=S.items[i];if(!s||!s.st)return;
    if(s.st==='skip'){ex.push({name:it.label,kind:it.kind,status:'skip',note:s.note||''});return;}
    if(s.note)notes.push(`${it.label}：${s.note}`);
    if(it.kind==='run'||(it.kind==='event'&&!it.label.includes('ラウンド'))){runDist+=parseFloat(s.km)||0;runTime+=(parseInt(s.min)||0)*60+(parseInt(s.sec)||0);runHr=parseInt(s.hr)||runHr;}
    else if(it.kind==='gym'){(s.rows||[]).filter(r=>r.n&&r.n.trim()).forEach(r=>{hasGym=true;const n=Math.max(1,parseInt(r.s)||1);ex.push({name:r.n.trim(),sets:[...Array(n)].map(()=>({weight:parseFloat(r.w)||0,reps:parseInt(r.r)||0,done:true}))});});}
    else if(it.routine){const g=golfCount(d,it.routine);ex.push({name:it.label,kind:'golf',routine:it.routine,status:s.st,count:g.done});}
    else if(it.kind==='pilates')ex.push({name:'ピラティスチェア',kind:'pilates',status:s.st,min:parseInt(s.pmin)||0});
    else if(it.kind==='event')ex.push({name:it.label,kind:'round',status:s.st,score:parseInt(s.score)||0,putts:parseInt(s.putts)||0});
  });
  if(parseInt(S.balls))ex.push({name:'練習場',kind:'range',balls:parseInt(S.balls)});
  ex.push({name:'_form',kind:'form',data:S});
  const cat=hasGym?(runDist>0?'full':(items.find(it=>it.kind==='gym')?.cat||'full')):(runDist>0?'run':'full');
  const pace=runDist>0&&runTime>0?runTime/runDist:0;
  const rec={id:dailyId(d),date:d,cat,exercises:ex,runDist,runTime,runPaceMin:pace?Math.floor(pace/60):0,runPaceSec:pace?Math.round(pace%60):0,runHr,runCal:0,
    walkDist:parseFloat(S.walk)||0,walkTime:0,note:['[実績]',...notes,S.memo||''].filter(Boolean).join(' ').trim()};
  if(await upsertRec(rec)){ACT_DIRTY.delete(d);delete ACT[d];toast('実績を保存しました');renderToday();}
}
