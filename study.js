// ─────────────────────────────────────────────
// 学習（ポーカー・麻雀）… 学習時間と実戦を記録してレベルアップ
//   保存先は同じ training_logs（exercises に kind:'study' を1件入れる）
// ─────────────────────────────────────────────
const STUDY={
  mahjong:{name:'麻雀（三麻・雀魂）',acts:['何切る問題','牌譜検討','AI解析（NAGAなど）','動画・本','実戦'],goal:'魂天'},
  poker:{name:'ポーカー',acts:['ハンドレビュー','GTO・ソルバー','動画・本','クイズ・レンジ練習','実戦'],goal:''},
};
const MJ_RANKS=['初心1','初心2','初心3','雀士1','雀士2','雀士3','雀傑1','雀傑2','雀傑3','雀豪1','雀豪2','雀豪3','雀聖1','雀聖2','雀聖3','魂天'];
let STUDY_G='mahjong',STUDY_FORM=null;
const isStudy=r=>(r.exercises||[]).some(e=>e.kind==='study');
const studyOf=r=>(r.exercises||[]).find(e=>e.kind==='study');
function xpOf(s){return (s.min||0)+(s.games||0)*(s.game==='poker'?10:5)+(s.acts||[]).filter(a=>a!=='実戦').length*5;}
function levelOf(xp){let lv=1,need=60,acc=0;while(xp>=acc+need){acc+=need;lv++;need=Math.round(60+lv*20);}return{lv,into:xp-acc,need};}
function streak(dates){const set=new Set(dates);let d=today(),n=0;if(!set.has(d))d=addDays(d,-1);while(set.has(d)){n++;d=addDays(d,-1);}return n;}
const LV_TITLE=['見習い','初段の卵','研究家','理論派','勝負師','達人','名人','鬼','神'];

async function renderStudy(){
  const el=$('p-study');const recs=await getRecs();const g=STUDY_G;const G=STUDY[g];
  const logs=recs.filter(isStudy).map(r=>({r,s:studyOf(r)})).filter(x=>x.s.game===g);
  const xp=logs.reduce((a,x)=>a+xpOf(x.s),0);const L=levelOf(xp);
  const totalMin=logs.reduce((a,x)=>a+(x.s.min||0),0);const mon=today().slice(0,7);
  const monthMin=logs.filter(x=>x.r.date.startsWith(mon)).reduce((a,x)=>a+(x.s.min||0),0);
  const st=streak(logs.map(x=>x.r.date));
  const rank=(logs.find(x=>x.s.rank)||{s:{}}).s.rank||'';
  if(!STUDY_FORM||STUDY_FORM.game!==g)STUDY_FORM={game:g,date:today(),min:'',acts:[],games:'',r1:'',r2:'',r3:'',pl:'',rank:rank,note:''};
  const F=STUDY_FORM;
  const ri=MJ_RANKS.indexOf(rank);
  el.innerHTML=`
  <div class="seg grid grid-cols-2" id="study-seg">${Object.entries(STUDY).map(([k,v])=>`<button class="${k===g?'on':''}" onclick="studyRead();STUDY_G='${k}';STUDY_FORM=null;renderStudy()">${k==='mahjong'?'麻雀':'ポーカー'}</button>`).join('')}</div>
  <div class="card grid gap-3 p-5">
    <div class="flex items-end justify-between gap-3"><div><div class="lbl">${esc(G.name)}</div><div class="flex items-baseline gap-2"><span class="font-display text-4xl text-accent">Lv.${L.lv}</span><span class="text-sm font-bold">${LV_TITLE[Math.min(LV_TITLE.length-1,Math.floor((L.lv-1)/3))]}</span></div></div>
      <div class="text-right"><div class="num text-sm"><b>${L.into}</b> / ${L.need} XP</div><div class="text-[11px] text-muted">次のレベルまで ${L.need-L.into} XP</div></div></div>
    ${bar(L.into,L.need)}
    <div class="grid grid-cols-3 gap-2 text-center">
      <div><div class="num text-lg font-semibold">${(totalMin/60).toFixed(1)}<span class="text-xs text-muted">時間</span></div><div class="lbl">累計</div></div>
      <div><div class="num text-lg font-semibold">${(monthMin/60).toFixed(1)}<span class="text-xs text-muted">時間</span></div><div class="lbl">今月</div></div>
      <div><div class="num text-lg font-semibold">${st}<span class="text-xs text-muted">日</span></div><div class="lbl">連続</div></div>
    </div>
    <p class="text-[11px] text-muted">XP：学習1分＝1、${g==='poker'?'実戦1セッション＝10':'実戦1局＝5'}、学習メニュー1つ＝5</p>
  </div>
  ${g==='mahjong'?`<div class="card grid gap-2 p-4"><div class="flex items-baseline justify-between"><h2 class="h2">段位</h2><span class="text-sm">現在 <b>${esc(rank||'未記録')}</b> → 目標 <b class="text-accent">魂天</b></span></div>
    <div class="grid grid-cols-8 gap-1">${MJ_RANKS.map((r,i)=>`<div class="rounded px-0.5 py-1 text-center text-[10px] leading-tight ${i===ri?'bg-accent text-surface font-bold':i<ri?'bg-accent-soft text-accent':'bg-line text-muted'}">${r}</div>`).join('')}</div></div>`:''}
  <div class="grid gap-2"><h2 class="h2">今日の学習を記録</h2>
   <div class="card grid gap-3 p-4">
    <div class="grid grid-cols-2 gap-2"><label class="grid gap-0.5"><span class="lbl">日付</span><input type="date" id="st-date" value="${F.date}" class="inp py-2"></label>
      <label class="grid gap-0.5"><span class="lbl">学習時間（分）</span><input id="st-min" value="${esc(F.min)}" inputmode="numeric" placeholder="30" class="inp py-2 text-center"></label></div>
    <div class="flex flex-wrap gap-1.5">${[15,30,45,60,90].map(m=>`<button class="btn-sm" onclick="studyRead();STUDY_FORM.min=${m};renderStudy()">${m}分</button>`).join('')}</div>
    <div class="grid gap-1"><span class="lbl">やったこと（複数OK）</span><div class="flex flex-wrap gap-1.5">${G.acts.map(a=>`<button class="rounded-full border px-3 py-1 text-[13px] font-bold ${F.acts.includes(a)?'border-accent bg-accent text-surface':'border-line text-muted'}" onclick="studyAct('${a}')">${a}</button>`).join('')}</div></div>
    ${F.acts.includes('実戦')?(g==='mahjong'?`<div class="grid grid-cols-4 gap-2"><label class="grid gap-0.5"><span class="lbl">対局数</span><input id="st-games" value="${esc(F.games)}" inputmode="numeric" class="inp px-1 py-2 text-center"></label><label class="grid gap-0.5"><span class="lbl">1位</span><input id="st-r1" value="${esc(F.r1)}" inputmode="numeric" class="inp px-1 py-2 text-center"></label><label class="grid gap-0.5"><span class="lbl">2位</span><input id="st-r2" value="${esc(F.r2)}" inputmode="numeric" class="inp px-1 py-2 text-center"></label><label class="grid gap-0.5"><span class="lbl">3位</span><input id="st-r3" value="${esc(F.r3)}" inputmode="numeric" class="inp px-1 py-2 text-center"></label></div>
       <label class="grid gap-0.5"><span class="lbl">今の段位</span><select id="st-rank" class="inp py-2"><option value="">変わらない・未記録</option>${MJ_RANKS.map(r=>`<option ${F.rank===r?'selected':''}>${r}</option>`).join('')}</select></label>`
      :`<div class="grid grid-cols-2 gap-2"><label class="grid gap-0.5"><span class="lbl">セッション数</span><input id="st-games" value="${esc(F.games)}" inputmode="numeric" class="inp py-2 text-center"></label><label class="grid gap-0.5"><span class="lbl">収支（任意）</span><input id="st-pl" value="${esc(F.pl)}" placeholder="+30BB など" class="inp py-2 text-center"></label></div>`):''}
    <div class="grid gap-1"><div class="flex items-center justify-between"><span class="lbl">学んだこと・気づき</span><button class="btn-sm" onclick="micToggle('st-note',this)">🎤 話す</button></div>
      <textarea id="st-note" rows="3" class="inp text-[13px]" placeholder="${g==='mahjong'?'例：北抜きの押し引き。親リーチには2シャンテンから降りる':'例：BTNのオープンレンジを見直した。3ベット後のCBは小さく'}">${esc(F.note)}</textarea></div>
    <button class="btn-main" onclick="saveStudy()">記録してXPをもらう</button>
   </div></div>
  <div class="grid gap-2"><h2 class="h2">最近の記録</h2>
   <div class="card divide-y divide-line px-4">${logs.length?logs.slice(0,15).map(({r,s})=>`<div class="grid gap-1 py-2.5"><div class="flex items-center justify-between gap-2"><span class="font-bold">${md(r.date)}</span><span class="flex items-center gap-2"><span class="num text-[12px] text-accent">+${xpOf(s)}XP</span><button class="btn-sm !text-warn" onclick="delStudy(${r.id})">削除</button></span></div>
     <div class="flex flex-wrap gap-1 text-[12px]">${s.min?`<span class="chip k-genie">${s.min}分</span>`:''}${(s.acts||[]).map(a=>`<span class="chip k-off">${esc(a)}</span>`).join('')}${s.games?`<span class="chip k-run">${g==='poker'?s.games+'セッション':s.games+'局'}${s.res?' '+esc(s.res):''}</span>`:''}${s.rank?`<span class="chip k-goltore">${esc(s.rank)}</span>`:''}</div>
     ${s.note?`<div class="text-[13px] text-muted">${esc(s.note)}</div>`:''}</div>`).join(''):'<div class="py-4 text-sm text-muted">まだ記録がありません。最初の1件を入れてみましょう。</div>'}</div></div>`;
}
function studyRead(){const F=STUDY_FORM;if(!F)return;const v=id=>{const e=$(id);return e?e.value:undefined;};
  ['date','min','games','r1','r2','r3','pl','rank','note'].forEach(k=>{const x=v('st-'+k);if(x!==undefined)F[k]=x;});}
function studyAct(a){studyRead();const A=STUDY_FORM.acts;const i=A.indexOf(a);if(i<0)A.push(a);else A.splice(i,1);renderStudy();}
async function saveStudy(){
  studyRead();const F=STUDY_FORM;const g=STUDY_G;
  const min=parseInt(F.min)||0;if(!min&&!F.acts.length){toast('学習時間か、やったことを入れてください',true);return;}
  const games=parseInt(F.games)||0;
  const res=g==='mahjong'?[F.r1,F.r2,F.r3].some(x=>x)?`1位${F.r1||0}・2位${F.r2||0}・3位${F.r3||0}`:'':(F.pl||'');
  const s={name:g==='mahjong'?'麻雀の学習':'ポーカーの学習',kind:'study',game:g,min,acts:F.acts,games,res,rank:g==='mahjong'?(F.rank||''):'',note:F.note||''};
  const before=levelOf((await getRecs()).filter(isStudy).map(studyOf).filter(x=>x.game===g).reduce((a,x)=>a+xpOf(x),0)).lv;
  const rec={id:Date.now(),date:F.date||today(),cat:'study',exercises:[s],runDist:0,runTime:0,walkDist:0,walkTime:0,note:`[学習] ${s.name}`};
  if(await upsertRec(rec)){
    const after=levelOf((await getRecs(true)).filter(isStudy).map(studyOf).filter(x=>x.game===g).reduce((a,x)=>a+xpOf(x),0)).lv;
    toast(after>before?`レベルアップ！ Lv.${after} になりました`:`+${xpOf(s)}XP 記録しました`);
    STUDY_FORM=null;renderStudy();
  }
}
async function delStudy(id){if(!confirm('この学習記録を削除しますか？'))return;if(await deleteRec(id)){toast('削除しました');renderStudy();}}

// 起動時に学習ページが開いていたら描画
if(typeof CUR!=='undefined'&&CUR==='study')renderStudy();
