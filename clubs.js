// ─────────────────────────────────────────────
// マイ飛距離（キャディ用）… トラックマンのデータから、クラブごとの距離とブレを持つ
//   kind:'tm'   … トラックマン1回分のまとめ（クラブごとの平均）
//   kind:'clubs'… 手で直した値（トラックマンより優先）
// ─────────────────────────────────────────────
const CLUB_ORDER=['1W','3W','5W','7W','UT','4I','5I','6I','7I','8I','9I','PW','AW','SW','LW'];
// トラックマンを入れるまでの仮の値（聞いた話：ドライバー約250y・7番170y）
const CLUB_DEFAULT={'1W':{carry:230,total:250},'5W':{carry:205,total:220},'UT':{carry:190,total:200},'5I':{carry:182,total:190},'6I':{carry:176,total:183},'7I':{carry:168,total:175},'8I':{carry:156,total:162},'9I':{carry:144,total:149},'PW':{carry:130,total:134},'AW':{carry:110,total:113},'SW':{carry:88,total:90}};
const isClubRec=r=>(r.exercises||[]).some(e=>e.kind==='tm'||e.kind==='clubs');

function clubNorm(s){s=String(s||'').trim().toUpperCase().replace(/\s+/g,'');
  if(/^(DR|DRIVER|1W|ドライバー|D)$/.test(s))return '1W';
  let m=s.match(/^(\d)(W|WOOD|ウッド)$/);if(m)return m[1]+'W';
  if(/(HYBRID|UT|ユーティリティ|^\dH$|^H\d$)/.test(s))return 'UT';
  m=s.match(/^(\d)(I|IRON|アイアン|番)?$/);if(m&&+m[1]>=3)return m[1]+'I';
  if(/^(PW|P|PITCHING|ピッチング)/.test(s))return 'PW';
  if(/^(AW|GW|A|G|GAP|APPROACH|アプローチ|5[0-2]°?)$/.test(s))return 'AW';
  if(/^(SW|S|SAND|サンド|5[4-8]°?)$/.test(s))return 'SW';
  if(/^(LW|LOB|6\d°?)$/.test(s))return 'LW';
  return s;}
const mean=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
const sd=a=>{if(a.length<2)return 0;const m=mean(a);return Math.sqrt(a.reduce((x,y)=>x+(y-m)**2,0)/(a.length-1));};
const r1=n=>Math.round(n*10)/10;

// トラックマンのCSV（英語・日本語どちらの列名でも）→ クラブごとの平均
function parseTM(text){
  const rows=text.trim().split(/\r?\n/).map(l=>l.split(/[,\t;]/).map(x=>x.replace(/^"|"$/g,'').trim())).filter(r=>r.some(Boolean));
  if(rows.length<2)return {err:'データが読み取れませんでした'};
  let hi=rows.findIndex(r=>r.some(x=>/club|クラブ/i.test(x)));if(hi<0)return {err:'「Club（クラブ）」の列が見つかりません'};
  const H=rows[hi].map(x=>x.toLowerCase());
  const col=(...keys)=>H.findIndex(h=>keys.some(k=>h.includes(k)));
  const C={club:col('club','クラブ'),carry:col('carry','キャリー'),total:col('total','トータル'),
    side:H.findIndex(h=>/(side|左右|サイド)/.test(h)&&!/spin|スピン/.test(h)),
    bs:col('ball speed','ボールスピード','ボール速度'),cs:col('club speed','クラブスピード','ヘッドスピード'),
    la:col('launch angle','打ち出し角','打出角'),spin:H.findIndex(h=>/(spin rate|スピン量|^spin$)/.test(h)),smash:col('smash','ミート')};
  if(C.carry<0)return {err:'「Carry（キャリー）」の列が見つかりません'};
  const meters=H.some(h=>/\(m\)|\[m\]|meter|メートル/.test(h));const k=meters?1.0936:1;
  const by={};
  rows.slice(hi+1).forEach(r=>{const c=clubNorm(r[C.club]);const carry=parseFloat(r[C.carry]);if(!c||!(carry>0))return;
    const g=by[c]=by[c]||{carry:[],total:[],side:[],bs:[],cs:[],la:[],spin:[],smash:[]};
    const v=(i)=>{if(i<0)return NaN;let s=String(r[i]||'');let n=parseFloat(s.replace(/[^\d.\-]/g,''));if(/L/i.test(s)&&n>0)n=-n;return n;};
    g.carry.push(carry*k);const t=v(C.total);if(t>0)g.total.push(t*k);const sd0=v(C.side);if(!isNaN(sd0))g.side.push(sd0*k);
    [['bs',C.bs],['cs',C.cs],['la',C.la],['spin',C.spin],['smash',C.smash]].forEach(([n,i])=>{const x=v(i);if(!isNaN(x))g[n].push(x);});});
  const clubs=Object.entries(by).map(([c,g])=>({c,n:g.carry.length,carry:r1(mean(g.carry)),sdCarry:r1(sd(g.carry)),total:g.total.length?r1(mean(g.total)):0,side:g.side.length?r1(mean(g.side)):null,sdSide:g.side.length?r1(sd(g.side)):null,
    bs:g.bs.length?r1(mean(g.bs)):null,cs:g.cs.length?r1(mean(g.cs)):null,la:g.la.length?r1(mean(g.la)):null,spin:g.spin.length?Math.round(mean(g.spin)):null,smash:g.smash.length?Math.round(mean(g.smash)*100)/100:null}));
  if(!clubs.length)return {err:'ショットが1つも読み取れませんでした'};
  clubs.sort((a,b)=>CLUB_ORDER.indexOf(a.c)-CLUB_ORDER.indexOf(b.c));
  return {clubs,shots:clubs.reduce((s,x)=>s+x.n,0)};
}

// 今使うクラブ表：仮の値 → トラックマン（新しい順）→ 手で直した値
let MYCLUBS={};
function buildClubs(recs){
  const T={};Object.entries(CLUB_DEFAULT).forEach(([c,v])=>T[c]={c,...v,src:'仮'});
  recs.filter(r=>(r.exercises||[]).some(e=>e.kind==='tm')).sort((a,b)=>a.date.localeCompare(b.date)||a.id-b.id).forEach(r=>{
    const e=r.exercises.find(x=>x.kind==='tm');(e.clubs||[]).forEach(x=>{T[x.c]={...(T[x.c]||{}),...x,src:'TM',date:r.date};});});
  const man=recs.filter(r=>(r.exercises||[]).some(e=>e.kind==='clubs')).sort((a,b)=>b.id-a.id)[0];
  if(man)(man.exercises.find(x=>x.kind==='clubs').clubs||[]).forEach(x=>{if(x.carry>0)T[x.c]={...(T[x.c]||{c:x.c}),carry:x.carry,total:x.total||T[x.c]&&T[x.c].total||x.carry,src:T[x.c]&&T[x.c].src==='TM'?'TM+手':'手'};});
  MYCLUBS=T;return T;
}
const clubList=()=>CLUB_ORDER.filter(c=>MYCLUBS[c]).map(c=>MYCLUBS[c]);
function clubCode(s){const m=String(s||'').match(/1W|3W|5W|7W|UT|[4-9]I|PW|AW|SW|LW/);return m?m[0]:null;}
// 残り距離にいちばん合うクラブ（キャリーが残り距離以上で一番短いもの）
function clubFor(dist){const L=clubList().filter(x=>x.carry>0).sort((a,b)=>a.carry-b.carry);if(!L.length)return null;
  return L.find(x=>x.carry>=dist-3)||L[L.length-1];}

// ── 画面 ──
let TM_OPEN=false,CLUB_EDIT=false;
async function renderClubs(){
  const el=$('golf-body');const recs=await getRecs();buildClubs(recs);const L=clubList();
  const ses=recs.filter(r=>(r.exercises||[]).some(e=>e.kind==='tm')).sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id);
  const tmN=L.filter(x=>x.src.startsWith('TM')).length;
  el.innerHTML=`
  <div class="grid gap-1"><div class="font-display text-2xl">マイ飛距離</div><div class="text-[12px] text-muted">ラウンドのマップのクラブ選び・残り距離のおすすめ・ブレの範囲は、この表を使います。</div></div>
  ${tmN?'':`<div class="rounded-xl bg-warn-soft px-3 py-2 text-[13px] text-warn">まだトラックマンのデータがありません。いまは<b>仮の距離</b>（ドライバー約250y・7番170yから計算）です。</div>`}
  <div class="card overflow-hidden">
   <div class="grid grid-cols-[3rem_1fr_1fr_1.3fr] gap-2 border-b border-line bg-field px-3 py-2 text-[11px] font-bold text-muted"><span>クラブ</span><span class="text-right">キャリー</span><span class="text-right">トータル</span><span class="text-right">左右のブレ</span></div>
   ${L.map(x=>`<div class="grid grid-cols-[3rem_1fr_1fr_1.3fr] items-center gap-2 border-b border-line px-3 py-2 last:border-0">
     <span class="font-mono font-bold">${x.c}</span>
     ${CLUB_EDIT?`<input data-cl="${x.c}" data-k="carry" type="number" inputmode="numeric" value="${Math.round(x.carry)}" class="inp !px-2 !py-1 text-right"><input data-cl="${x.c}" data-k="total" type="number" inputmode="numeric" value="${Math.round(x.total||x.carry)}" class="inp !px-2 !py-1 text-right">`:
      `<span class="text-right"><b class="num text-lg">${Math.round(x.carry)}</b><span class="text-[11px] text-muted">y</span>${x.sdCarry?`<div class="text-[10px] text-muted">±${Math.round(x.sdCarry)}</div>`:''}</span><span class="num text-right">${Math.round(x.total||x.carry)}<span class="text-[11px] text-muted">y</span></span>`}
     <span class="text-right text-[12px]">${x.side!=null?`<b class="${Math.abs(x.side)>=8?'text-warn':''}">${x.side>0?'右':'左'}${Math.abs(Math.round(x.side))}y</b> <span class="text-muted">±${Math.round(x.sdSide||0)}</span>`:`<span class="chip ${x.src==='仮'?'k-off':'k-genie'}">${x.src==='仮'?'仮':x.src}</span>`}</span>
   </div>`).join('')}
  </div>
  <div class="flex gap-2">${CLUB_EDIT?`<button class="btn-main flex-1" onclick="busy(this,saveClubEdit)">この距離で保存</button><button class="btn-sub" onclick="CLUB_EDIT=false;renderClubs()">やめる</button>`:`<button class="btn-sub flex-1" onclick="CLUB_EDIT=true;renderClubs()">距離を手で直す</button><button class="btn-main flex-1" onclick="TM_OPEN=!TM_OPEN;renderClubs()">トラックマンを入れる</button>`}</div>
  ${TM_OPEN?`<div class="card grid gap-3 p-4">
    <div class="font-bold">トラックマンのデータを入れる</div>
    <ol class="list-decimal pl-5 text-[13px] leading-relaxed text-muted">
     <li><b class="text-fg">いちばん簡単：</b>トラックマンのアプリで、その日のセッションの「クラブごとの平均」や「ショット一覧」の画面をスクショして、Claudeに送る → 私が読み取って入れます。</li>
     <li><b class="text-fg">CSVがある時：</b>CSVの中身をそのまま下に貼り付けて「読み込む」。</li>
    </ol>
    <label class="grid gap-1"><span class="lbl">日付</span><input id="tm-date" type="date" value="${today()}" class="inp"></label>
    <textarea id="tm-csv" rows="6" class="inp font-mono text-[12px]" placeholder="Club,Carry,Total,Side,Ball Speed,Launch Angle,Spin Rate&#10;Driver,228.4,247.1,12.3R,...&#10;7 Iron,165.2,172.0,3.1L,..."></textarea>
    <div id="tm-prev" class="text-[13px]"></div>
    <div class="flex gap-2"><button class="btn-sub flex-1" onclick="tmPreview()">読み込む</button><button class="btn-main flex-1" onclick="busy(this,tmSave)">保存</button></div>
   </div>`:''}
  ${clubAdvice(L)}
  ${ses.length?`<div class="grid gap-2"><h2 class="h2">トラックマンの記録</h2>${ses.slice(0,10).map((r,i)=>{const e=r.exercises.find(x=>x.kind==='tm');const prev=ses[i+1]&&ses[i+1].exercises.find(x=>x.kind==='tm');
     return `<div class="card grid gap-1.5 p-3"><div class="flex items-center gap-2"><b>${md(r.date)}</b><span class="text-[12px] text-muted">${e.shots||''}球・${(e.clubs||[]).length}本</span><button class="btn-sm ml-auto !text-warn" onclick="busy(this,()=>tmDel(${r.id}))">削除</button></div>
      <div class="flex flex-wrap gap-1">${(e.clubs||[]).map(x=>{const p=prev&&(prev.clubs||[]).find(y=>y.c===x.c);const d=p?Math.round(x.carry-p.carry):0;return `<span class="chip k-off">${x.c} ${Math.round(x.carry)}y${d?`<span class="${d>0?'text-accent':'text-warn'}"> ${d>0?'+':''}${d}</span>`:''}</span>`;}).join('')}</div>
      ${e.note?`<div class="text-[12px] text-muted">${esc(e.note)}</div>`:''}</div>`;}).join('')}</div>`:''}`;
}
// ブレと傾向からのアドバイス
function clubAdvice(L){
  const T=L.filter(x=>x.side!=null&&x.n>=3);if(!T.length)return '';
  const tips=[];
  const woods=T.filter(x=>/W|UT/.test(x.c));const irons=T.filter(x=>/I$/.test(x.c));
  const avg=a=>a.length?mean(a.map(x=>x.side)):0;
  if(woods.length&&Math.abs(avg(woods))>=6)tips.push(`ウッド・UTは平均<b>${avg(woods)>0?'右':'左'}${Math.abs(Math.round(avg(woods)))}y</b>。ティーショットは、その分だけ${avg(woods)>0?'左':'右'}に向けて構える（マップの黄色い楕円がボールの集まる範囲です）。`);
  if(irons.length&&Math.abs(avg(irons))>=5)tips.push(`アイアンは平均<b>${avg(irons)>0?'右':'左'}${Math.abs(Math.round(avg(irons)))}y</b>。グリーンを狙う時は、ピンより${avg(irons)>0?'左':'右'}を向く。`);
  const wide=T.filter(x=>x.sdSide>=15);if(wide.length)tips.push(`${wide.map(x=>x.c).join('・')}は左右のブレが大きい（±15y以上）。狭いホールでは使わず、ブレの小さいクラブで置く。`);
  const best=T.slice().sort((a,b)=>a.sdSide-b.sdSide)[0];if(best)tips.push(`一番まっすぐ飛ぶのは<b>${best.c}</b>（左右±${Math.round(best.sdSide)}y）。困ったらこのクラブ。`);
  const gaps=[];const s=L.filter(x=>x.carry>0).sort((a,b)=>b.carry-a.carry);for(let i=1;i<s.length;i++){const g=s[i-1].carry-s[i].carry;if(g>=20)gaps.push(`${s[i-1].c}と${s[i].c}の間が${Math.round(g)}y空いている`);if(g<=4)gaps.push(`${s[i-1].c}と${s[i].c}がほぼ同じ距離`);}
  if(gaps.length)tips.push('番手の間隔：'+gaps.join('、')+'。');
  return `<div class="card grid gap-2 p-4"><div class="font-bold">キャディのひとこと</div><ul class="grid gap-1.5 pl-4 text-[13px] leading-relaxed list-disc [&_b]:text-accent">${tips.map(t=>`<li>${t}</li>`).join('')}</ul></div>`;
}
let TM_PARSED=null;
function tmPreview(){const r=parseTM($('tm-csv').value);const el=$('tm-prev');
  if(r.err){TM_PARSED=null;el.innerHTML=`<span class="text-warn">${esc(r.err)}</span>`;return;}
  TM_PARSED=r;el.innerHTML=`<div class="font-bold">${r.shots}球・${r.clubs.length}本を読み取りました</div><div class="flex flex-wrap gap-1 pt-1">${r.clubs.map(x=>`<span class="chip k-genie">${x.c} ${Math.round(x.carry)}y${x.side!=null?` ${x.side>0?'右':'左'}${Math.abs(Math.round(x.side))}`:''}（${x.n}球）</span>`).join('')}</div>`;}
async function tmSave(){if(!TM_PARSED)tmPreview();if(!TM_PARSED){toast('先にデータを読み込んでください',true);return;}
  const d=$('tm-date').value||today();
  const rec={id:uid(),date:d,cat:'full',exercises:[{name:'トラックマン',kind:'tm',clubs:TM_PARSED.clubs,shots:TM_PARSED.shots}],runDist:0,runTime:0,walkDist:0,walkTime:0,note:'[トラックマン]'};
  if(await upsertRec(rec)){TM_PARSED=null;TM_OPEN=false;toast('保存しました。マップにも反映されます');renderClubs();}}
async function tmDel(id){if(!confirm('この記録を削除しますか？'))return;await deleteRec(id);renderClubs();}
async function saveClubEdit(){
  const clubs=CLUB_ORDER.filter(c=>document.querySelector(`[data-cl="${c}"]`)).map(c=>({c,carry:parseFloat(document.querySelector(`[data-cl="${c}"][data-k=carry]`).value)||0,total:parseFloat(document.querySelector(`[data-cl="${c}"][data-k=total]`).value)||0}));
  const rec={id:uid(),date:today(),cat:'full',exercises:[{name:'マイ飛距離',kind:'clubs',clubs}],runDist:0,runTime:0,walkDist:0,walkTime:0,note:'[マイ飛距離]'};
  if(await upsertRec(rec)){CLUB_EDIT=false;toast('保存しました');renderClubs();}}
