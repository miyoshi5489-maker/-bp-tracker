// ─────────────────────────────────────────────
// ラウンド：ゴルフの予定・作戦・結果
//   決まっている作戦はここ（ROUND_DEFS）に書く。
//   アプリから追加したラウンドは記録（kind:'roundplan'）として保存される。
// ─────────────────────────────────────────────
// ホール：[番, Par, ヤード, ハンデ, 目標, ティーのクラブ, 狙い, 難しさ(easy/mid/hard)]
const ROUND_DEFS=[
 {date:'2026-09-22',course:'三田ゴルフクラブ',time:'',tee:'レギュラー 6,261y・Par72',members:'',plan:'',result:{score:118,putts:0},
  diff:{stars:4,cr:71.6,par:72,yards:6261,bunkers:76,water:5,green:'高麗グリーン（秋は8フィート前後）',terrain:'丘陵（坂あり）',why:['コースレートがParに近い（3つの中で一番難しい）','バンカー76個','高麗グリーンは芝目が強く、読みにくい']},
 },
 {date:'2026-10-20',course:'東条湖カントリー倶楽部',time:'OUT 7:08',tee:'レギュラー 6,198y・Par72',members:'3名',plan:'セルフ・4人乗りカート付き（昼食は別料金）　1人 5,100円',
  target:95,limit:99,link:'https://claude.ai/artifact/Cq7XPSVNLmbx1azX5LmUY4',mapKey:'tojo',
  diff:{stars:3,cr:69.2,par:72,yards:6198,bunkers:65,water:9,green:'ベントグリーン（秋は8.5フィート前後）',terrain:'丘陵（見えないホールが多い）',why:['コースレートはやさしめ','池が絡むホールが9つ','フェアウェイが狭く、ブラインドが多い']},
  summary:'全ホールをボギーで回ると90。難しい4ホールはダブルボギーでよしとして、目標は95。予備が4打あるので、大叩きが1〜2回あっても100を切れる計算です。',
  info:['コースレート 69.2。ベントグリーン（秋は速さ8.5フィート前後）','バンカー65個。池が絡むホールが9つ。見えないホール（ブラインド）が多い'],
  rules:[
   ['OBを0にする','スライスが出るので、フェアウェイの左半分に向けて構える。「曲がっても右の真ん中」に落ちる向きで立つ。'],
   ['短いミドルは5番ウッドかUT','フェアウェイが狭く、見えないホールも多い。距離より、次を打ちやすい場所が大事。'],
   ['グリーンは真ん中を狙う','ピンは見ない。バンカーが深いので、ピンがバンカーの近くなら反対側へ。'],
   ['林やラフからは1打で出す','フェアウェイに横へ出すのが正解。無理に狙うのが大叩きの原因。'],
   ['パットは1m以内に寄せる','デコボコと傾斜があるグリーン。3パットを減らすことを優先。'],
  ],
  order:['out','in'],
  holes:[
   [1,4,307,13,5,'5W / UT','短いミドル。ドライバーは不要。フェアウェイに置いて、2打目は短いアイアンでグリーン真ん中。','easy'],
   [2,5,485,1,7,'ドライバー','一番難しいホール（平均7点台）。右ドッグレッグなので、スライスで右の角に入らないよう左半分に構える。3打でグリーン手前まで運べば十分。','hard'],
   [3,4,330,11,5,'5W / UT','ティー前方に池（65〜125y）。UTで池を越えて右寄りの真ん中へ。左ドッグレッグだが角は狙わない。グリーン奥は危険なので手前から。','easy'],
   [4,4,418,3,6,'ドライバー','長いミドル。2打でのせようとしない。3打目で100y以内に残せればダブルボギーまでで上がれる。','hard'],
   [5,4,345,9,5,'5W / UT','真っすぐのミドル。右はOB。左に行きすぎると2打目でグリーンを狙えないので、UTで真ん中に置く。','easy'],
   [6,3,189,15,4,'UT / 5W','池越えのショート（右に池）。届く番手で。グリーンは右に傾いているので、左側から攻める。','mid'],
   [7,4,430,5,6,'ドライバー','OUTで一番長いミドル。3打で乗せる計画で、2打目は得意な距離を残す。','hard'],
   [8,5,487,7,6,'ドライバー','S字のロング。1打目は右側、2打目は左側（2打目から右はOB）。7Iで次の曲がり角まで。','mid'],
   [9,3,137,17,4,'9I / PW','池越えの短いショート。平均スコアが一番良いホール。グリーンの真ん中へ気持ちよく。','easy'],
   [10,4,360,4,5,'ドライバー','ハンデ4。1打目はクロスバンカーの右側。グリーン左は深い谷なので、2打目は右寄りへ。5なら上出来。','mid'],
   [11,4,370,12,5,'5W / UT','1打目は左のクロスバンカー方向へUT。2打目は打ち下ろしで、グリーン奥は禁物。右手前に池。','easy'],
   [12,5,487,2,7,'ドライバー','2番目に難しい。ティーの近くに池。1打目は中央、2打目はフェアウェイ左側へ。4打で乗ればOK。','hard'],
   [13,4,350,10,5,'5W / UT','ティー前方の左に大きな池。フェアウェイは右に傾いていて、右はOB。中央より左に置く。','easy'],
   [14,3,151,14,4,'8I / 7I','打ち上げでピンが見えない。右側が安全。真ん中〜右へ。','easy'],
   [15,5,480,8,6,'ドライバー','INのロング。3打目で100y以内を残せば、ボギーが取れる。','mid'],
   [16,4,311,16,5,'5W / UT','やや打ち上げのブラインド。ドライバーは我慢してフェアウェイ右側に置く。2打目はグリーン左に外さない。','easy'],
   [17,3,147,18,4,'8I','一番易しいホール。2段グリーンなので、真ん中に乗せて1パット目を丁寧に。','easy'],
   [18,4,414,6,6,'ドライバー','打ち下ろし。正面の楠の木を狙う。2打目は左側から。グリーン右は危険。余裕がなければ3打で乗せる。','hard'],
  ],
  checks:['9番を終えて<b>50以内</b>なら予定どおり。INも同じ回り方でOK。','<b>51〜54</b>なら、INの短いミドル（11・13・16番）は全部5番ウッドかUTにして、ボギーを確実に取る。','<b>55以上</b>でも、INで44なら99。ロング（12・15番）で無理をせず、3打目までにグリーン近くに運ぶ。'],
  prep:['スタート前：①可動域の3種＋骨盤分離 片足10回＋ヒップツイスト10回。','練習場（10/19まで）：5番ウッドのティーショットを毎回20球。「左半分に立って、右の真ん中に落とす」。','シャンク対策：ハーフスイングで、かかと寄りに体重を乗せたまま10球。本番で出たら次の1打はハーフスイング。','アプローチ：50y・30y・10yを、クラブ1本（PWかAW）で打ち分ける。'],
  note:'ホールの形と狙いは、ショットナビのホール解説をもとにしています。マップは図なので、当日はカートのナビでも確認してください。',
 },
 {date:'2026-11-29',course:'宝塚クラシックゴルフ倶楽部',time:'IN 7:32',tee:'レギュラー 6,141y・Par71',members:'3名',
  plan:'セルフ・4人乗りカート付き（昼食は別料金）　1人 16,810円',
  target:95,limit:99,link:'',mapKey:'taka',
  diff:{stars:3,cr:69.2,par:71,yards:6141,bunkers:47,water:4,green:'ベントグリーン（秋は9フィート前後・11月は硬め）',terrain:'丘陵（INの坂がきつい）',why:['コースレートは中くらい','INの打ち上げ・打ち下ろし・谷越え','小さめのグリーンと深いバンカー']},
  summary:'Par71なので、全部ボギーで89。難しいホールはダブルボギーでよしとして、目標は95（IN 47・OUT 48）。予備が4打あります。<b>スタートはIN（10番）から</b>です。',
  info:['ベントのワングリーン（小さめで、深いバンカー）。秋の速さは9フィート前後で、東条湖より少し速い','アップダウンが大きく、特にINは打ち上げ・打ち下ろしと谷越えが多い','池・谷が絡むのは4・14・15・17番。13番は左右OBで見えないホール','カートはフェアウェイに入れない。2打目にはUT・7I・PW／AWとパターを持って歩く'],
  rules:[
   ['OBを0にする','構えはフェアウェイの左半分。13番（左右OB）は5番ウッドでフェアウェイに置く。'],
   ['打ち上げは1番手大きく、打ち下ろしは1番手小さく','INは坂がきつい。表示の距離のまま打つと、打ち上げで短く、打ち下ろしで大きくなる。'],
   ['池越え・谷越えは「届く番手」で奥を狙う','4・14・15・17番。短いのが一番のミス。グリーンの奥の真ん中でOK。'],
   ['グリーンは手前から','11月はグリーンが硬くなり、上から落とすと止まらない。花道から転がして乗せる。'],
   ['寒さ対策で最初の3ホールを守る','7:32スタートの11月末は5℃前後。重ね着・カイロ。最初の3ホールは全部5番ウッドかUTでボギー狙い。'],
  ],
  order:['in','out'],
  holes:[
   [10,4,330,'11/16',5,'5W / UT','1ホール目。右ドッグレッグだが右はすぐOB。UTでフェアウェイ左寄りに置く。2打目は右に行きやすいので、グリーン左半分へ。','easy'],
   [11,4,352,'7/6',5,'5W / UT','少し右に曲がった打ち上げ。右はOB、グリーンオーバーもOB。2打目はグリーンが見えないので、奥の目印より少し手前を狙う。','mid'],
   [12,4,398,'1/2',6,'5W','一番難しいホール。打ち下ろしで左は狭くすぐOB。右に打っても傾斜で戻るので、右半分を狙う。3打で乗せる計画。','hard'],
   [13,5,530,'3/14',7,'5W','左右OBの見えないホール。信号で前の組を確認。5Wでフェアウェイに置き、2打目は7I、3打目は9Iでつなぐ。','hard'],
   [14,3,148,'13/12',4,'8I','谷越えのショート。届く番手で、グリーンの奥の真ん中へ。','mid'],
   [15,4,330,'17/8',5,'5W / UT','距離は短いが、グリーン手前に池、奥はOB。2打目に自信がなければ池の手前に刻み、3打目で手前から乗せる。','mid'],
   [16,4,353,'5/4',6,'UT','右ドッグレッグ。ドライバーは突き抜けてOBの恐れ。UTで180yに刻む。左はすぐOB。2打目は右から。','hard'],
   [17,3,159,'15/18',4,'7I','谷越えのショート。1番手大きめで奥の真ん中へ。','easy'],
   [18,4,386,'9/10',5,'ドライバー','少し右に曲がったミドル。右はすぐOB。左半分に構えて1Wを振り切る。前半を締めるホール。','mid'],
   [1,5,500,'14/13',6,'ドライバー','打ち下ろしのロング。2打目は右のバンカーを避ける。グリーンは右奥から手前に傾いているので、ピンの左手前へ。','easy'],
   [2,4,382,'6/5',6,'ドライバー','フェアウェイ中央の松の木を狙う。右はグリーンまでずっとOB。左の林はセーフ。3打で乗せる計画。','hard'],
   [3,4,375,'2/3',6,'ドライバー','真っすぐだが難しい。右のバンカーの先はすぐOBなので、左寄りに置く。2段グリーンは距離感重視。','hard'],
   [4,3,127,'18/17',4,'PW / 9I','池越えの短いショート。届く番手で奥の真ん中へ。','easy'],
   [5,5,503,'16/15',6,'ドライバー','フェアウェイが左に傾いているので、右サイド狙い。スライスと相性のいいホール。','easy'],
   [6,3,169,'12/11',4,'UT / 7I','グリーン手前にバンカー。短いとバンカーなので、奥目を狙う。','mid'],
   [7,4,384,'4/1',6,'5W / UT','左ドッグレッグ。中央の松の木の右を狙う。グリーン手前に池があるので、3打で乗せる計画。','hard'],
   [8,4,332,'8/9',5,'5W / UT','短いミドル。右は突き抜けても、跳ねてもOB。UTで左寄りに置く。3段グリーンは左から右への傾斜がきついので左狙い。','mid'],
   [9,4,383,'10/7',5,'ドライバー','右のフェアウェイから攻めるのが正解。スライスと相性のいいホール。','mid'],
  ],
  checks:['前半（IN）を終えて<b>50以内</b>なら予定どおり。OUTも同じ回り方でOK。','<b>51〜54</b>なら、OUTの2・3・7番は3打で乗せる計画を守り、ダブルボギーまでで止める。','<b>55以上</b>でも、OUTで44なら99。1番・5番のロングで無理をせず、ボギーを取る。'],
  prep:['スタート前：①可動域の3種＋骨盤分離 片足10回＋ヒップツイスト10回。寒いので、いつもより5分長く体を温める。','練習場：5番ウッドのティーショット20球（13番用）。7番アイアンで1番手大きく打つ練習（打ち上げ・谷越え用）。','アプローチ：花道から転がすランニングアプローチ（8Iか9I）を10球。','パット：9フィートの速さに合わせて、3mの距離感を練習グリーンで確認。'],
  note:'ハンデはGDO／楽天GORAで違うので両方載せています。ホールの形と狙いは、ショットナビ・じゃらんゴルフのホール解説をもとにしています。10/20の結果を入れたら、ここを直します。',
 },
];
const ROUND_BASE=d=>ROUND_DEFS.find(x=>x.date===d);
const isRoundPlan=r=>(r.exercises||[]).some(e=>e.kind==='roundplan');
const roundPlanId=d=>Number(d.replace(/-/g,''))*100+70;
let ROUND_OPEN=null,ROUND_EDIT=null;

// 決まっている作戦＋アプリで追加・直した分をまとめる
function roundList(recs){
  const m={};
  ROUND_DEFS.forEach(x=>{m[x.date]={...x,builtin:true};});
  recs.filter(isRoundPlan).forEach(r=>{const e=r.exercises.find(x=>x.kind==='roundplan');const d=r.date;
    const b=m[d]||{date:d};const o={...b,recId:r.id};
    ['course','time','tee','members','plan','memo','link'].forEach(k=>{if(e[k])o[k]=e[k];});
    if(parseInt(e.target))o.target=parseInt(e.target);
    if(parseInt(e.stars)||parseFloat(e.cr))o.diff={...(b.diff||{}),...(parseInt(e.stars)?{stars:parseInt(e.stars)}:{}),...(parseFloat(e.cr)?{cr:parseFloat(e.cr)}:{})};
    if(parseInt(e.score))o.result={score:parseInt(e.score),putts:0};
    m[d]=o;});
  // 結果（今日の記入欄で入れたスコア）
  recs.forEach(r=>(r.exercises||[]).forEach(e=>{if(e.kind==='round'&&num(e.score)>0&&m[r.date])m[r.date].result={score:num(e.score),putts:num(e.putts)};}));
  return Object.values(m).sort((a,b)=>a.date.localeCompare(b.date));
}
// 予定表（ホームの「次のゴルフ」）にも追加したラウンドを反映
function syncRounds(recs){
  const R=window.PLAN.ROUNDS;
  roundList(recs).forEach(x=>{if(!R.includes(x.date))R.push(x.date);});R.sort();
}

async function renderRounds(){
  const el=$('golf-body');const recs=await getRecs();syncRounds(recs);
  const list=roundList(recs);const t=today();
  const up=list.filter(x=>x.date>=t),past=list.filter(x=>x.date<t).reverse();
  if(!ROUND_OPEN&&up.length)ROUND_OPEN=up[0].date;
  el.innerHTML=`
  <div class="flex flex-wrap items-end justify-between gap-2"><div><div class="font-display text-2xl">ラウンド</div><div class="text-[12px] text-muted">予定と作戦。タップで作戦を開きます。</div></div>
   <button class="btn-sm !border-accent !text-accent" onclick="roundEdit('new')">＋ ラウンドを追加</button></div>
  ${roundHistory(list)}
  ${ROUND_EDIT?roundForm(list):''}
  <div class="grid gap-3">${up.length?up.map(x=>roundCard(x,t)).join(''):'<div class="card p-4 text-sm text-muted">予定しているラウンドはありません。「＋ ラウンドを追加」から入れてください。</div>'}</div>
  ${past.length?`<div class="grid gap-3"><h2 class="h2">これまでのラウンド</h2>${past.map(x=>roundCard(x,t)).join('')}</div>`:''}`;
}

function roundCard(x,t){
  const open=ROUND_OPEN===x.date;const left=diffDays(t,x.date);
  const tags=[x.time,x.tee,x.members].filter(Boolean);
  return `<article class="card overflow-hidden">
   <button class="grid w-full gap-1.5 p-4 text-left" onclick="roundToggle('${x.date}')">
    <div class="flex items-center gap-2"><span class="font-bold">${md(x.date)}</span>${left>=0?`<span class="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">${left===0?'今日':'あと'+left+'日'}</span>`:''}
     ${x.result?`<span class="ml-auto num text-xl font-semibold ${x.result.score<100?'text-accent':''}">${x.result.score}</span>`:x.target?`<span class="ml-auto text-[12px] text-muted">目標 <b class="num text-base text-accent">${x.target}</b></span>`:''}<span class="text-muted ${x.result||x.target?'':'ml-auto'}">${open?'▲':'▼'}</span></div>
    <div class="text-lg font-bold leading-snug">${esc(x.course||'コース未定')}</div>
    ${tags.length||x.diff?`<div class="flex flex-wrap items-center gap-1">${x.diff&&x.diff.stars?`<span class="chip k-event">難易度 ${stars(x.diff.stars)}</span>`:''}${tags.map(s=>`<span class="chip k-off">${esc(s)}</span>`).join('')}</div>`:''}
    ${x.plan?`<div class="text-[12px] text-muted">${esc(x.plan)}</div>`:''}
    ${x.result?`<div class="text-[12px] text-muted">結果 ${x.result.score}${x.result.putts?`（${x.result.putts}パット）`:''}${x.target?`／目標 ${x.target}`:''}</div>`:''}
   </button>
   ${open?`<div class="grid gap-5 border-t border-line p-4">${roundStrategy(x)}
     <div class="flex flex-wrap gap-2"><button class="btn-sm" onclick="roundEdit('${x.date}')">予定・メモを直す</button>${x.recId&&!x.builtin?`<button class="btn-sm !text-warn" onclick="busy(this,()=>roundDel('${x.date}'))">削除</button>`:''}${x.link?`<a class="btn-sm" href="${esc(x.link)}" target="_blank" rel="noopener">作戦ページを開く ↗</a>`:''}</div></div>`:''}
  </article>`;
}

function roundStrategy(x){
  const H=x.holes||[];const half=k=>H.filter(h=>k==='out'?h[0]<=9:h[0]>=10);
  const sum=(a,i)=>a.reduce((s,h)=>s+h[i],0);
  const memo=(x.memo||'').split('\n').map(s=>s.trim()).filter(Boolean);
  let out=x.diff?roundDiff(x):'';
  if(x.summary)out+=`<p class="text-[14px] [&_b]:text-accent">${x.summary}</p>`;
  if(H.length){const o=x.order||['out','in'];
    out+=`<div class="grid grid-cols-3 gap-2 text-center">${o.map(k=>`<div class="rounded-xl bg-accent-soft p-2"><div class="num text-2xl font-semibold text-accent">${sum(half(k),4)}</div><div class="lbl">${k==='out'?'OUT':'IN'}の目標</div></div>`).join('')}<div class="rounded-xl bg-warn-soft p-2"><div class="num text-2xl font-semibold text-warn">${x.limit||99}</div><div class="lbl">上限</div></div></div>`;}
  if(x.mapKey)out+=`<div class="rounded-xl bg-accent-soft px-3 py-2 text-[13px] text-accent"><b>⛳ ホールをタップするとマップが開きます。</b>1打目・2打目の狙いと残りの距離、池・バンカー・OBの位置が見られます。</div>`;
  if(x.info)out+=`<ul class="grid gap-1 pl-4 text-[13px] text-muted list-disc">${x.info.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`;
  if(memo.length)out+=`<div class="grid gap-2"><h3 class="font-bold">作戦メモ</h3><ul class="grid gap-1 pl-4 text-[14px] list-disc">${memo.map(s=>`<li>${esc(s)}</li>`).join('')}</ul></div>`;
  if(x.rules)out+=`<div class="grid gap-2"><h3 class="font-bold">当日の${x.rules.length}つの約束</h3>${x.rules.map((r,i)=>`<div class="rounded-xl border border-line p-3"><div class="font-bold"><span class="text-accent">${'①②③④⑤⑥⑦'[i]}</span> ${esc(r[0])}</div><div class="text-[13px] text-muted">${esc(r[1])}</div></div>`).join('')}</div>`;
  if(H.length){const o=x.order||['out','in'];
    out+=o.map(k=>{const hs=half(k);return `<div class="grid gap-2"><div class="flex items-baseline gap-2 border-b-2 border-fg pb-1"><h3 class="h2">${k==='out'?'OUT':'IN'}</h3><span class="font-mono text-xs text-muted">${sum(hs,2).toLocaleString()}y・Par${sum(hs,1)}</span><span class="ml-auto text-[13px]">目標 <b class="num text-accent">${sum(hs,4)}</b></span></div>
     <div class="divide-y divide-line">${hs.map(h=>{const c=h[7]==='hard'?'bg-warn':h[7]==='mid'?'bg-sand':'bg-accent';const mp=x.mapKey&&typeof HOLE_MAPS!=='undefined'&&HOLE_MAPS[x.mapKey][h[0]];return `<div class="grid grid-cols-[2.5rem_1fr_auto] gap-x-3 gap-y-1 py-2.5 ${mp?'cursor-pointer':''}" ${mp?`onclick="openHoleMap('${x.date}',${h[0]})"`:''}>
      <div class="row-span-2 grid h-10 w-10 place-items-center rounded-lg ${c} font-mono text-base font-bold text-surface">${h[0]}</div>
      <div class="flex flex-wrap items-baseline gap-x-2 text-[12px] text-muted"><span>Par${h[1]}</span><span class="font-mono">${h[2]}y</span><span>HC ${h[3]}</span><span class="font-semibold text-fg">${esc(h[5])}</span></div>
      <div class="row-span-2 text-right"><div class="num text-2xl font-semibold leading-none">${h[4]}</div><div class="text-[10px] text-muted">目標</div></div>
      <div class="text-[13px] leading-snug">${esc(h[6])}${mp?`<span class="mt-1 flex w-fit items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-bold text-accent">⛳ マップを見る ›</span>`:''}</div></div>`;}).join('')}</div></div>`;}).join('');
    out+=`<div class="flex flex-wrap gap-3 text-[11px] text-muted"><span><i class="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-accent align-middle"></i>ボギーを取る</span><span><i class="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-sand align-middle"></i>注意</span><span><i class="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-warn align-middle"></i>ダブルボギーでOK</span></div>`;}
  if(x.checks)out+=`<div class="grid gap-2"><h3 class="font-bold">途中の確認</h3><ul class="grid gap-1 pl-4 text-[13px] list-disc [&_b]:text-accent">${x.checks.map(s=>`<li>${s}</li>`).join('')}</ul></div>`;
  if(x.prep)out+=`<div class="grid gap-2"><h3 class="font-bold">当日の朝と、それまでの練習</h3><ul class="grid gap-1 pl-4 text-[13px] list-disc">${x.prep.map(s=>`<li>${esc(s)}</li>`).join('')}</ul></div>`;
  if(x.note)out+=`<p class="text-[12px] text-muted">${esc(x.note)}</p>`;
  if(!x.holes&&!memo.length&&!x.result)out+='<p class="text-sm text-muted">作戦はまだありません。「予定・メモを直す」から作戦メモを書けます。</p>';
  return out;
}

function roundForm(list){
  const x=ROUND_EDIT==='new'?{}:(list.find(r=>r.date===ROUND_EDIT)||{});
  const v=k=>esc(x[k]==null?'':String(x[k]));
  const f=(id,l,type,val,ph)=>`<label class="grid gap-1"><span class="lbl">${l}</span><input id="rf-${id}" type="${type}" class="inp" value="${val}" placeholder="${ph||''}"></label>`;
  return `<div class="card grid gap-3 p-4">
   <div class="font-bold">${ROUND_EDIT==='new'?'ラウンドを追加':'予定・メモを直す'}</div>
   <div class="grid grid-cols-2 gap-3">${f('date','日付','date',v('date')||'',)}${f('time','スタート','text',v('time'),'例：IN 7:32')}</div>
   ${f('course','ゴルフ場','text',v('course'),'例：〇〇カントリー倶楽部')}
   <div class="grid grid-cols-2 gap-3">${f('tee','ティー','text',v('tee'),'例：レギュラー')}${f('members','人数','text',v('members'),'例：3名')}</div>
   ${f('plan','プラン内容','text',v('plan'),'例：セルフ・カート付き・昼食別')}
   <div class="grid grid-cols-2 gap-3">${f('target','目標スコア','number',v('target'),'例：95')}${f('link','作戦ページのURL','url',x.builtin?'':v('link'),'なくてもOK')}</div>
   <div class="grid grid-cols-3 gap-3">${f('stars','難易度（1〜5）','number',x.diff&&x.diff.stars||'','例：3')}${f('cr','コースレート','number',x.diff&&x.diff.cr||'','例：70.1')}${f('score','スコア（終わったら）','number',x.result?x.result.score:'','例：98')}</div>
   <label class="grid gap-1"><span class="lbl">作戦メモ（1行に1つ）</span><textarea id="rf-memo" rows="4" class="inp" placeholder="例：OBを0にする&#10;短いミドルは5番ウッド">${v('memo')}</textarea></label>
   <div class="flex gap-2"><button class="btn-main flex-1" onclick="busy(this,roundSave)">保存</button><button class="btn-sub" onclick="ROUND_EDIT=null;renderRounds()">やめる</button></div>
  </div>`;
}
const stars=n=>'★'.repeat(n)+'☆'.repeat(Math.max(0,5-n));
function roundDiff(x){const d=x.diff;const gap=d.cr&&d.par?Math.round((d.cr-d.par)*10)/10:null;
  const facts=[d.yards?['距離',d.yards.toLocaleString()+'y']:null,d.par?['Par',d.par]:null,d.bunkers?['バンカー',d.bunkers+'個']:null,d.water?['池が絡む',d.water+'ホール']:null].filter(Boolean);
  return `<div class="grid gap-3 rounded-xl border border-line p-3">
   <div class="flex items-baseline gap-2"><h3 class="font-bold">難易度</h3><span class="text-lg tracking-wider text-sand">${stars(d.stars||0)}</span>${d.cr?`<span class="ml-auto text-[12px] text-muted">コースレート <b class="num text-base text-fg">${d.cr}</b></span>`:''}</div>
   ${gap!==null?`<p class="text-[13px] text-muted">上手な人（ハンデ0）がふつうに回ると${d.cr}くらい。Parより<b class="text-fg">${Math.abs(gap)}打${gap<0?'やさしい':'むずかしい'}</b>コースです。</p>`:''}
   ${facts.length?`<div class="grid grid-cols-${facts.length} gap-2 text-center">${facts.map(([k,v])=>`<div class="rounded-lg bg-field p-1.5 ring-1 ring-line"><div class="num text-[15px] font-semibold">${v}</div><div class="text-[10px] text-muted">${k}</div></div>`).join('')}</div>`:''}
   ${d.green||d.terrain?`<div class="text-[12px] text-muted">${[d.green,d.terrain].filter(Boolean).map(esc).join('　／　')}</div>`:''}
   ${d.why?`<ul class="grid gap-0.5 pl-4 text-[13px] list-disc">${d.why.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`:''}
  </div>`;}
function roundHistory(list){const done=list.filter(x=>x.result&&x.result.score);if(!done.length)return '';
  const nx=list.find(x=>x.date>=today()&&!x.result);
  return `<div class="card grid gap-2 p-4"><div class="lbl">スコアの流れ</div>
   <div class="flex flex-wrap items-end gap-x-4 gap-y-2">${done.map(x=>`<div><div class="num text-2xl font-semibold ${x.result.score<100?'text-accent':''}">${x.result.score}</div><div class="text-[11px] text-muted">${md(x.date)} ${esc(x.course||'')}</div></div>`).join('<span class="pb-4 text-muted">→</span>')}
   ${nx&&nx.target?`<span class="pb-4 text-muted">→</span><div><div class="num text-2xl font-semibold text-accent">${nx.target}</div><div class="text-[11px] text-muted">${md(nx.date)} 目標</div></div>`:''}</div></div>`;}
function roundToggle(d){ROUND_OPEN=ROUND_OPEN===d?'':d;renderRounds();}
function roundEdit(d){ROUND_EDIT=d;renderRounds().then(()=>{const e=$('rf-course');if(e)e.scrollIntoView({block:'center',behavior:'smooth'});});}
async function roundSave(){
  const g=k=>($('rf-'+k)?$('rf-'+k).value.trim():'');
  const d=g('date');if(!d){toast('日付を入れてください',true);return;}
  if(!g('course')&&!ROUND_BASE(d)){toast('ゴルフ場を入れてください',true);return;}
  const e={name:'ラウンド予定',kind:'roundplan',course:g('course'),time:g('time'),tee:g('tee'),members:g('members'),plan:g('plan'),target:parseInt(g('target'))||0,link:g('link'),memo:g('memo'),stars:Math.min(5,Math.max(0,parseInt(g('stars'))||0)),cr:parseFloat(g('cr'))||0,score:parseInt(g('score'))||0};
  const old=ROUND_EDIT&&ROUND_EDIT!=='new'&&ROUND_EDIT!==d?roundPlanId(ROUND_EDIT):null;
  const rec={id:roundPlanId(d),date:d,cat:'full',exercises:[e],runDist:0,runTime:0,walkDist:0,walkTime:0,note:`[ラウンド予定] ${e.course||ROUND_BASE(d).course}`};
  if(await upsertRec(rec)){
    if(old&&(await getRecs()).some(r=>Number(r.id)===old))await deleteRec(old);
    ROUND_EDIT=null;ROUND_OPEN=d;toast('保存しました');renderRounds();
  }
}
async function roundDel(d){
  if(!confirm('このラウンドを削除しますか？'))return;
  await deleteRec(roundPlanId(d));ROUND_OPEN=null;renderRounds();
}
if(typeof CUR!=='undefined'&&CUR==='golf'&&GOLF_R==='rounds')renderRounds();
