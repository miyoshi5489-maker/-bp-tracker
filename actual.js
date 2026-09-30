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
    rows:(it.ex||GYM_DEFAULTS[it.label]||[]).map(([n,s,r])=>({n,w:lastWeight(recs,n),r,s}))})),balls:'',walk:'',weight:'',memo:''};
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
const CHANGE_EG={run:'例：雨でトレッドミル30分にした',gym:'例：ベンチの代わりにスミスでやった',genie:'例：30分版だけやった',goltore:'例：半分だけやった',pilates:'例：ストレッチに変えた',prep:'例：練習場なしにした',event:'例：ハーフで終了'};
function field(label,f,val,opt){opt=opt||{};return `<label class="grid gap-0.5"><span class="lbl">${label}</span><input data-f="${f}" value="${esc(val)}" ${opt.ph!=null?`placeholder="${esc(opt.ph)}"`:''} inputmode="${opt.mode||'numeric'}" aria-label="${label}" class="${inpS}"></label>`;}
function actItem(it,i,s,d){
  const st=s.st;
  const b=(v,l,on)=>`<button type="button" aria-pressed="${st===v}" class="flex min-h-[44px] flex-1 items-center justify-center gap-1 rounded-lg px-1 text-[13px] font-bold ${st===v?on:'text-muted'}" onclick="actSet(${i},'${v}')">${l}</button>`;
  const menuBtn=it.routine?`<button class="btn-sm shrink-0 !border-accent !text-accent" onclick="show('golf',{routine:'${it.routine}${it.part?':'+it.part:''}'})">写真メニュー</button>`:'';
  let body='';
  if(st==='done'||st==='change'){
    if(it.kind==='run')body=`<div class="grid grid-cols-4 gap-1.5">${field('距離 km',`i.${i}.km`,s.km,{ph:it.km||'',mode:'decimal'})}${field('分',`i.${i}.min`,s.min)}${field('秒',`i.${i}.sec`,s.sec)}${field('心拍',`i.${i}.hr`,s.hr)}</div>`;
    else if(it.kind==='gym'){const plan=Object.fromEntries((it.ex||[]).map(e=>[e[0],e[3]||'']));body=`<div class="grid gap-2">
      ${s.rows.map((r,j)=>`<div class="grid gap-1.5 rounded-xl border border-line p-2.5">
        <div class="flex items-center gap-1.5"><input list="ex-list" data-f="i.${i}.rows.${j}" data-c="n" value="${esc(r.n)}" placeholder="種目名" aria-label="種目名" class="inp py-2 font-bold"><button class="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-xl text-muted" aria-label="この種目を消す" onclick="actRow(${i},${j})">×</button></div>
        <div class="grid grid-cols-3 gap-1.5"><label class="grid gap-0.5"><span class="lbl">重さ kg</span><input data-f="i.${i}.rows.${j}" data-c="w" value="${esc(r.w)}" placeholder="${esc((plan[r.n]||'').match(/\d/)?plan[r.n]:'')}" inputmode="decimal" aria-label="重さ" class="${inpS}"></label><label class="grid gap-0.5"><span class="lbl">回数</span><input data-f="i.${i}.rows.${j}" data-c="r" value="${esc(r.r)}" inputmode="numeric" aria-label="回数" class="${inpS}"></label><label class="grid gap-0.5"><span class="lbl">セット</span><input data-f="i.${i}.rows.${j}" data-c="s" value="${esc(r.s)}" inputmode="numeric" aria-label="セット数" class="${inpS}"></label></div>
      </div>`).join('')}
      <button class="min-h-[44px] rounded-lg border border-dashed border-line text-[13px] font-bold text-accent" onclick="actRow(${i},-1)">＋ 種目を追加</button></div>`;}
    else if(it.routine){const g=golfCount(d,it.routine);body=`<div class="rounded-lg bg-accent-soft px-3 py-2 text-[13px]">写真メニューで <b class="num">${g.done}</b> / ${g.all} 種目にチェックが付いています</div>`;}
    else if(it.kind==='pilates')body=`<div class="flex items-end gap-2"><div class="w-24">${field('時間（分）',`i.${i}.pmin`,s.pmin)}</div></div>`;
    else if(it.kind==='event'&&it.label.includes('ラウンド'))body=`<div class="grid grid-cols-2 gap-2">${field('スコア',`i.${i}.score`,s.score)}${field('パット数',`i.${i}.putts`,s.putts)}</div>`;
    else if(it.kind==='event')body=`<div class="grid grid-cols-3 gap-2">${field('距離 km',`i.${i}.km`,s.km||42.195,{mode:'decimal'})}${field('合計（分）',`i.${i}.min`,s.min)}${field('秒',`i.${i}.sec`,s.sec)}</div>`;
    if(st==='change')body+=`<input data-f="i.${i}.note" value="${esc(s.note)}" placeholder="${esc(CHANGE_EG[it.kind]||'何に変えたか')}" aria-label="何に変えたか" class="inp text-[14px]">`;
  }
  if(st==='skip')body=`<input data-f="i.${i}.note" value="${esc(s.note)}" placeholder="理由（任意）例：子どもの発熱で休み" aria-label="やらなかった理由" class="inp text-[14px]">`;
  const showDetail=!st||it.kind!=='gym';
  return `<div class="grid gap-2.5 py-3.5">
    <div class="flex items-start gap-2"><div class="pt-0.5">${chip(it.kind)}</div><div class="min-w-0 flex-1"><div class="font-bold leading-snug">${esc(it.label)}${it.km?` <span class="num text-sm text-sky">${it.km}km</span>`:''}</div>
      ${showDetail&&it.detail?`<div class="text-[13px] text-muted">${esc(it.detail)}</div>`:''}${it.extra?`<div class="text-[13px] font-bold text-sand">${esc(it.extra)}</div>`:''}</div>${menuBtn}</div>
    <div class="flex gap-1 rounded-xl bg-line p-1" role="group" aria-label="${esc(it.label)}の結果">${b('done','✓ やった','bg-accent text-surface shadow-sm')}${b('change','↻ 変えてやった','bg-surface text-fg ring-2 ring-inset ring-fg')}${b('skip','— やってない','bg-surface text-muted')}</div>
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
  const y=addDays(today(),-1);const isToday=d===today();
  box.innerHTML=`
   <div class="flex flex-wrap items-center justify-between gap-2"><h2 class="h2">${isToday?'今日のメニュー':md(d)+'のメニュー'}</h2>
     <div class="flex items-center gap-1">${[[today(),'今日'],[y,'昨日']].map(([v,l])=>`<button class="btn-sm ${d===v?'!border-fg !text-fg':''}" onclick="actRead();renderActual('${v}')">${l}</button>`).join('')}<input type="date" value="${d}" onchange="actRead();renderActual(this.value)" aria-label="日付を選ぶ" class="min-h-[40px] rounded-lg border border-line bg-field px-2 text-[13px]"></div></div>
   <div class="card px-4 py-1">
     <div class="flex items-center justify-between border-b border-line py-2.5 text-sm"><span class="text-muted">終わったら「やった」を押して記入</span>${saved?'<span class="chip k-genie">保存済み</span>':'<span class="chip k-off">まだ保存していません</span>'}</div>
     <div class="divide-y divide-line">${items.length?items.map((it,i)=>actItem(it,i,S.items[i],d)).join(''):'<div class="py-4 text-sm text-muted">この日は休みの予定です。やったことがあれば下に書いてください。</div>'}</div>
     <div class="grid gap-2 border-t border-line py-3.5">
       <div class="grid grid-cols-3 gap-2">${field('練習場（球）','g.0.balls',S.balls,{ph:''})}${field('歩いた km','g.0.walk',S.walk,{ph:'',mode:'decimal'})}${field('体重 kg','g.0.weight',S.weight||'',{ph:'',mode:'decimal'})}</div>
       <label class="grid gap-0.5"><span class="lbl">予定外にやったこと・体調メモ</span><textarea data-f="g.0.memo" rows="2" class="inp text-[14px]" placeholder="例：寝不足。肩の張りは軽め">${esc(S.memo)}</textarea></label>
     </div>
   </div>
   <div class="sticky z-10 -mx-1 rounded-2xl bg-bg px-1 pt-1" style="bottom:calc(env(safe-area-inset-bottom,0px) + 66px)"><button class="btn-main shadow-lg" onclick="busy(this,saveActual)">${saved?'記録を更新する':'記録を保存する'}</button></div>
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
  if(parseFloat(S.weight))ex.push({name:'体重',kind:'body',weight:parseFloat(S.weight)});
  ex.push({name:'_form',kind:'form',data:S});
  const cat=hasGym?(runDist>0?'full':(items.find(it=>it.kind==='gym')?.cat||'full')):(runDist>0?'run':'full');
  const pace=runDist>0&&runTime>0?runTime/runDist:0;
  const rec={id:dailyId(d),date:d,cat,exercises:ex,runDist,runTime,runPaceMin:pace?Math.floor(pace/60):0,runPaceSec:pace?Math.round(pace%60):0,runHr,runCal:0,
    walkDist:parseFloat(S.walk)||0,walkTime:0,note:['[実績]',...notes,S.memo||''].filter(Boolean).join(' ').trim()};
  if(await upsertRec(rec)){ACT_DIRTY.delete(d);delete ACT[d];const wk=(await getRecs()).filter(r=>r.date>=mondayOf(d)&&r.date<=addDays(mondayOf(d),6)).reduce((a,r)=>a+(r.runDist||0),0);toast(`保存しました${runDist?`。今週のラン ${km1(wk)}km`:''}`);renderToday();}
}
