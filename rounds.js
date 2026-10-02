// ─────────────────────────────────────────────
// ラウンド：ゴルフの予定・作戦・結果
//   決まっている作戦はここ（ROUND_DEFS）に書く。
//   アプリから追加したラウンドは記録（kind:'roundplan'）として保存される。
// ─────────────────────────────────────────────
// ホール：[番, Par, ヤード, ハンデ, 目標, ティーのクラブ, 狙い, 難しさ(easy/mid/hard)]
const ROUND_DEFS=[
 {date:'2026-09-22',course:'三田ゴルフクラブ',time:'',tee:'レギュラー 6,261y・Par72',members:'',plan:'',result:{score:118,putts:0},sources:[['公式 コース','https://sanda-golf.com/course/'],['GDO コース情報','https://reserve.golfdigest.co.jp/golf-course/642105/course-info/']],
  diff:{stars:4,cr:71.6,par:72,yards:6261,bunkers:76,water:5,green:'姫高麗グリーン（秋は8フィート前後）',terrain:'丘陵（坂あり）',why:['コースレートがParに近い（3つの中で一番難しい）','バンカー76個','姫高麗グリーンは芝目が強く、読みにくい']},
 },
 {date:'2026-10-20',course:'東条湖カントリー倶楽部',time:'OUT 7:08',tee:'レギュラー 6,198y・Par72',members:'3名',plan:'セルフ・4人乗りカート付き（昼食は別料金）　1人 5,100円',
  target:95,limit:99,link:'https://claude.ai/artifact/Cq7XPSVNLmbx1azX5LmUY4',mapKey:'tojo',
  diff:{stars:3,cr:69.2,par:72,yards:6198,bunkers:65,water:9,green:'ベントグリーン（秋は8.5フィート前後）',terrain:'丘陵（ブラインドは2・14・16番）',why:['コースレートはやさしめ（GORA 69.2・GDO 69.1）','池が絡むホールが9つ（天然の池を生かしたコース）','フェアウェイが狭いという口コミが多い']},
  summary:'全ホールをボギーで回ると90。難しい4ホールはダブルボギーでよしとして、目標は95。予備が4打あるので、大叩きが1〜2回あっても100を切れる計算です。',
  info:['コースレート 69.2（楽天GORA・レギュラー）。GDOでは69.1。ベントのワングリーン（秋は速さ8.5フィート前後）','バンカー65個・池が絡むホール9つ（GDO）。ブラインドは2番（2打目で木がじゃま）・14番（ピンが見えない）・16番（公式）','カートは5人乗り・自走式で、フェアウェイには入れない（GDO）'],
  rules:[
   ['OBを0にする','トラックマンでは5Wは平均13y左に曲がり、右へのミスは0本。5Wはフェアウェイの右寄りに向けて構え、左に戻ってくる球で真ん中へ。1Wは左右どちらにも±24yぶれるので、狭いホールでは使わない。'],
   ['短いミドルは5番ウッドか4H','フェアウェイが狭いという口コミが多い。距離より、次を打ちやすい場所が大事。'],
   ['グリーンは真ん中を狙う','ピンは見ない。バンカーが深いので、ピンがバンカーの近くなら反対側へ。'],
   ['林やラフからは1打で出す','フェアウェイに横へ出すのが正解。無理に狙うのが大叩きの原因。'],
   ['パットは1m以内に寄せる','デコボコと傾斜があるグリーン。3パットを減らすことを優先。'],
  ],
  order:['out','in'],
  holes:[
   [1,4,307,13,5,'5W / 4H','短いミドル。ドライバーは不要。フェアウェイに置く。グリーンはやや高いので、2打目は1番手大きめで真ん中へ。','easy'],
   [2,5,485,1,7,'ドライバー','一番難しいホール（平均7点台）。1打目はやや打ち上げで右寄りが狙い目。2打目は池越えなので、無理せず池の手前に刻み、3打目で越える。グリーン奥は危険。','hard'],
   [3,4,330,11,5,'5W / 4H','ティー前方に池（65〜125y）。4Hで池を越えて右寄りの真ん中へ。左ドッグレッグだが角は狙わない。グリーン奥は危険なので手前から。','mid'],
   [4,4,418,3,6,'ドライバー','長いミドル。2打でのせようとしない。3打目で100y以内に残せればダブルボギーまでで上がれる。','hard'],
   [5,4,345,9,5,'5W / 4H','真っすぐのミドル。右はOB。左に行きすぎると2打目でグリーンを狙えないので、4Hで真ん中に置く。','mid'],
   [6,3,189,15,4,'5W','右側に池があるショート。4Hのキャリー153yでは届かないので5W（キャリー170y・左に戻る球）。グリーンはやや右に傾いているので、左側から攻める。右に外すのが一番のミス。','easy'],
   [7,4,430,5,6,'ドライバー','OUTで一番長いミドル。3打で乗せる計画で、2打目は得意な距離を残す。','hard'],
   [8,5,487,7,6,'5W','OB率42%（GDO・同じレベル）。2打目から右はOBが出やすい（公式）ので、1打目は5Wで右側、2打目は7Iで左側へ（公式の狙い）。','hard'],
   [9,3,137,17,4,'7I','池越えの短いショート。9Iのキャリーは126yで届かないこともあるので、ブレの小さい7I（キャリー140y・ブレ±3y）で真ん中へ。','easy'],
   [10,4,360,4,6,'ドライバー','GDOの同じレベル（96〜105）の平均5.90・難易度3位。1打目はクロスバンカーの右側（公式）。グリーン左は深い谷なので、2打目は右寄りへ。6（ダブルボギー）までならOK。','hard'],
   [11,4,370,12,5,'5W / 4H','1打目は左のクロスバンカー方向へ4H。2打目は打ち下ろしで、グリーン奥は禁物。右手前に池。','mid'],
   [12,5,487,2,7,'5W','難易度2位・OB率46%（GDO・同じレベル）。1Wは持たず5Wで中央へ（公式は「第1打中央」）。2打目はフェアウェイ左側（公式）。5W→7I→短いクラブで4打目にグリーン。','hard'],
   [13,4,350,10,5,'5W / 4H','ティー前方の左に大きな池。フェアウェイは右に傾いていて、右はOB。中央より左に置く。','mid'],
   [14,3,151,14,4,'5I','打ち上げでピンが見えない。右側が安全（公式）。打ち上げなので1番手大きく、5I（キャリー152y）で真ん中〜右へ。','easy'],
   [15,5,480,8,6,'5W','OB率45%（GDO・同じレベル）。1打目は5Wでフェアウェイ中央（公式）。左右に落とし穴あり（公式）。3打目は前下がりでグリーンも速いので、手前から（公式）。','easy'],
   [16,4,311,16,5,'5W / 4H','やや打ち上げのブラインド。ドライバーは我慢してフェアウェイ右側に置く。2打目はグリーン左に外さない。','mid'],
   [17,3,147,18,4,'6I','一番易しいホール。6I（キャリー148y）で真ん中に乗せる。2段グリーンなので1パット目を丁寧に。','easy'],
   [18,4,414,6,5,'ドライバー','打ち下ろし。正面の楠の木を狙う（公式）。2打目は左側から。グリーン右は要注意。同じレベルの平均5.55なので、ボギーを取りにいくホール。','mid'],
  ],
  checks:['9番を終えて<b>50以内</b>なら予定どおり。INも同じ回り方でOK。','<b>51〜54</b>なら、INの短いミドル（11・13・16番）は全部5番ウッドか4Hにして、ボギーを確実に取る。','<b>55以上</b>でも、INで44なら99。ロング（12・15番）で無理をせず、3打目までにグリーン近くに運ぶ。'],
  prep:['スタート前：①可動域の3種＋骨盤分離 片足10回＋ヒップツイスト10回。','練習場（10/19まで）：5Wのティーショットを毎回20球。右寄りに構えて、左に戻る球で真ん中に落とす（今の5Wは平均13y左）。','シャンク対策：ハーフスイングで、かかと寄りに体重を乗せたまま10球。本番で出たら次の1打はハーフスイング。','アプローチ：50y・30y・10yを、クラブ1本（PWか52°）で打ち分ける。'],
  note:'ホールの形と狙いは、ショットナビのホール解説をもとにしています。マップは図なので、当日はカートのナビでも確認してください。',
 },
 {date:'2026-11-29',course:'宝塚クラシックゴルフ倶楽部',time:'IN 7:32',tee:'レギュラー 6,141y・Par71',members:'3名',
  plan:'セルフ・4人乗りカート付き（昼食は別料金）　1人 16,810円',
  target:95,limit:99,link:'',mapKey:'taka',sources:[['公式 コースガイド（スコアカード）','https://www.takarazuka-cgc.com/course.html'],['GDO コース情報','https://reserve.golfdigest.co.jp/golf-course/642302/course-info/'],['楽天GORA コース情報','https://booking.gora.golf.rakuten.co.jp/guide/course_info/disp/c_id/280079'],['じゃらんゴルフ（ホール解説）','https://golf-jalan.net/gc01901/detail/'],['ショットナビ（ホール図・解説）','https://shotnavi.jp/gcguide/cdata/cdata_1961_560.htm']],
  diff:{stars:3,cr:69.2,par:71,yards:6141,bunkers:47,water:4,green:'ベントグリーン（秋は9フィート前後・11月は硬め）',terrain:'丘陵（INの坂がきつい）',why:['コースレートは中くらい（GDO 69.2・GORA 69.5）','INの打ち上げ・打ち下ろし・谷越え','小さめのグリーンと深いバンカー']},
  summary:'Par71なので、全部ボギーで89。難しいホールはダブルボギーでよしとして、目標は95（IN 46・OUT 49）。予備が4打あります。<b>スタートはIN（10番）から</b>です。',
  info:['ベントのワングリーン（小さめで、深いバンカー）。秋の速さは9フィート前後で、東条湖より少し速い','アップダウンが大きく、特にINは打ち上げ・打ち下ろしと谷越えが多い','池・谷が絡むのは4・14・15・17番。13番は左右OBで見えないホール','カートはフェアウェイに入れない。2打目には4H・7I・PW／AWとパターを持って歩く'],
  rules:[
   ['OBを0にする','右OBが多いコース。今の5Wは右へのミスが出ていない（トラックマン）ので、右OBのホールこそ5W。13番（左右OB）も5Wでフェアウェイに置く。'],
   ['打ち上げは1番手大きく、打ち下ろしは1番手小さく','INは坂がきつい。表示の距離のまま打つと、打ち上げで短く、打ち下ろしで大きくなる。'],
   ['池越え・谷越えは「届く番手」で奥を狙う','4・14・15・17番。短いのが一番のミス。グリーンの奥の真ん中でOK。'],
   ['グリーンは手前から','11月はグリーンが硬くなり、上から落とすと止まらない。花道から転がして乗せる。'],
   ['寒さ対策で最初の3ホールを守る','7:32スタートの11月末は5℃前後。重ね着・カイロ。最初の3ホールは全部5番ウッドか4Hでボギー狙い。'],
  ],
  order:['in','out'],
  holes:[
   [10,4,330,'11/16',5,'5W / 4H','1ホール目。右ドッグレッグだが右はすぐOB。4Hでフェアウェイ左寄りに置く。2打目は右に行きやすいので、グリーン真ん中へ。','mid'],
   [11,4,352,'7/6',5,'5W / 4H','少し右に曲がった打ち上げ。右はOB、グリーンオーバーもOB。2打目はグリーンが見えないので、奥の目印より少し手前を狙う。','mid'],
   [12,4,398,'1/2',6,'5W','一番難しいホール。打ち下ろしで左は狭くすぐOB。右に打っても傾斜で戻るので、右半分を狙う。2打目は打ち上げなので1番手大きく。3打で乗せる計画。','hard'],
   [13,5,530,'3/14',7,'5W','左右OBの見えないホール。信号で前の組を確認。5Wでフェアウェイに置き、2打目は7I、3打目は9Iでつなぐ。','hard'],
   [14,3,148,'13/12',4,'5I','谷越えのショート。手前の深いバンカーを越えるため5I（キャリー152y）で奥の真ん中へ。','easy'],
   [15,4,330,'17/8',5,'5W / 4H','距離は短いが、グリーン手前に池、奥はOB。2打目に自信がなければ池の手前に刻み、3打目で手前から乗せる。','easy'],
   [16,4,353,'5/4',5,'4H','右ドッグレッグ。ドライバーは突き抜けてOBの恐れ。4Hで180yに刻む。左はすぐOB。2打目は右から。','mid'],
   [17,3,159,'15/18',4,'5W','谷越えのショート（159y）。4Hのキャリー153yでは谷に届かない恐れ。5Wを短く持って、グリーン右寄りに向けて構える。','easy'],
   [18,4,386,'9/10',5,'ドライバー','少し右に曲がったミドル。右はすぐOB。右へのミスが出ていない5Wで、フェアウェイ中央に置く。前半を締めるホール。','mid'],
   [1,5,500,'14/13',7,'5W','OUTで一番荒れるホール：同じレベル（96〜105）の平均6.86・難易度2位・OB率56%・FWキープ36%（GDO）。打ち下ろしでも1Wは持たず5Wでフェアウェイへ。2打目は右バンカーを避けて7Iで刻み（ショットナビ）、グリーンは右奥から手前に傾いているのでピンの左手前へ。7で上出来。','hard'],
   [2,4,382,'6/5',6,'ドライバー','フェアウェイ中央の松の木を狙う。右はグリーンまでずっとOB。左の林はセーフ。3打で乗せる計画。','hard'],
   [3,4,375,'2/3',6,'ドライバー','難易度1位・FWキープ37%（GDO・同じレベル）。右のバンカーの先はすぐOB（ショットナビ）なので左寄りに置く。左の林はセーフだが脱出困難（ショットナビ）。2段グリーンは距離感重視。3打で乗せる計画。','hard'],
   [4,3,127,'18/17',4,'8I','池越えの短いショート。9Iのキャリー126yでは足りないこともあるので、8I（キャリー131y）で奥の真ん中へ。','easy'],
   [5,5,503,'16/15',6,'ドライバー','フェアウェイが左に傾いているので、右サイド狙い。','easy'],
   [6,3,169,'12/11',4,'4H','グリーン手前にバンカー。4H（キャリー153y・トータル170y）で、手前から転がして乗せる。','easy'],
   [7,4,384,'4/1',6,'5W / 4H','左ドッグレッグ。中央の松の木の右を狙う。グリーン手前に池があるので、3打で乗せる計画。','hard'],
   [8,4,332,'8/9',5,'5W / 4H','短いミドル。右は突き抜けても、跳ねてもOB。4Hで左寄りに置く。3段グリーンは左から右への傾斜がきついので左狙い。','mid'],
   [9,4,383,'10/7',5,'ドライバー','右のフェアウェイから攻めるのが正解。','mid'],
  ],
  checks:['前半（IN）を終えて<b>48以内</b>なら予定どおり。OUTも同じ回り方でOK。','<b>49〜52</b>なら、OUTの1・3・7番（難易度2・1・6位）は3打で乗せる計画を守り、ダブルボギーまでで止める。','<b>53以上</b>でも、OUTで46なら99。1番は5W、5番のロングも無理をせずボギーを取る。'],
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
  if(ROUND_OPEN===null&&up.length)ROUND_OPEN=up[0].date;
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
  const secs=[['rs-diff','難易度',x.diff],['rs-rules','約束',x.rules],...((x.order||['out','in']).map(k=>['rs-'+k,k.toUpperCase(),x.holes])),['rs-checks','途中の確認',x.checks],['rs-prep','当日の朝',x.prep]].filter(a=>a[2]);
  return `<article id="rc-${x.date}" class="card overflow-clip ${open?'ring-2 ring-accent':''}">
   ${open?`<div class="sticky z-10 grid gap-1.5 border-b border-line bg-surface px-3 py-2 shadow-sm" style="top:calc(env(safe-area-inset-top,0px) + var(--hh,57px))">
     <div class="flex items-center gap-2"><span class="min-w-0 flex-1 truncate text-[13px] font-bold">${md(x.date)} ${esc(x.course||'')}</span><button class="btn-sm !min-h-[36px] !border-accent !text-accent" onclick="roundToggle('${x.date}')">▲ 閉じる</button></div>
     ${secs.length?`<div class="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">${secs.map(([id,l])=>`<button class="shrink-0 rounded-full bg-field px-2.5 py-1 text-[12px] font-bold ring-1 ring-line" onclick="roundJump('${id}-${x.date}')">${l}</button>`).join('')}</div>`:''}
    </div>`:''}
   <button class="grid w-full gap-1.5 p-4 text-left" onclick="roundToggle('${x.date}')" aria-expanded="${open}">
    <div class="flex items-center gap-2"><span class="font-bold">${md(x.date)}</span>${left>=0?`<span class="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">${left===0?'今日':'あと'+left+'日'}</span>`:''}
     ${x.result?`<span class="ml-auto num text-xl font-semibold ${x.result.score<100?'text-accent':''}">${x.result.score}</span>`:x.target?`<span class="ml-auto text-[12px] text-muted">目標 <b class="num text-base text-accent">${x.target}</b></span>`:''}<span class="text-muted ${x.result||x.target?'':'ml-auto'}">${open?'▲':'▼'}</span></div>
    <div class="text-lg font-bold leading-snug">${esc(x.course||'コース未定')}</div>
    ${tags.length||x.diff?`<div class="flex flex-wrap items-center gap-1">${x.diff&&x.diff.stars?`<span class="chip k-event">難易度 ${stars(x.diff.stars)}</span>`:''}${tags.map(s=>`<span class="chip k-off">${esc(s)}</span>`).join('')}</div>`:''}
    ${x.plan?`<div class="text-[12px] text-muted">${esc(x.plan)}</div>`:''}
    ${x.result?`<div class="text-[12px] text-muted">結果 ${x.result.score}${x.result.putts?`（${x.result.putts}パット）`:''}${x.target?`／目標 ${x.target}`:''}</div>`:''}
    ${open?'':`<span class="mt-1 flex min-h-[44px] items-center justify-center rounded-xl bg-accent text-[14px] font-bold text-surface">${x.holes?'作戦とホールマップを開く ▼':'開く ▼'}</span>`}
   </button>
   ${open?`<div class="grid gap-5 border-t border-line p-4">${roundStrategy(x).replace(/data-sec="([a-z-]+)"/g,(m,k)=>`id="${k}-${x.date}" style="scroll-margin-top:calc(var(--hh,57px) + 96px)"`)}
     <div class="flex flex-wrap gap-2"><button class="btn-sm" onclick="roundEdit('${x.date}')">予定・メモを直す</button>${x.recId&&!x.builtin?`<button class="btn-sm !text-warn" onclick="busy(this,()=>roundDel('${x.date}'))">削除</button>`:''}${x.link?`<a class="btn-sm" href="${esc(x.link)}" target="_blank" rel="noopener">作戦ページを開く ↗</a>`:''}</div></div>`:''}
   ${open?`<div class="border-t border-line p-3"><button class="btn-sub w-full" onclick="roundToggle('${x.date}')">▲ 作戦を閉じる</button></div>`:''}
  </article>`;
}

function roundStrategy(x){
  const H=x.holes||[];const half=k=>H.filter(h=>k==='out'?h[0]<=9:h[0]>=10);
  const sum=(a,i)=>a.reduce((s,h)=>s+h[i],0);
  const memo=(x.memo||'').split('\n').map(s=>s.trim()).filter(Boolean);
  let out=x.diff?`<div data-sec="rs-diff">${roundDiff(x)}</div>`:'';
  if(x.summary)out+=`<p class="text-[14px] [&_b]:text-accent">${x.summary}</p>`;
  if(H.length){const o=x.order||['out','in'];
    out+=`<div class="grid grid-cols-3 gap-2 text-center">${o.map(k=>`<div class="rounded-xl bg-accent-soft p-2"><div class="num text-2xl font-semibold text-accent">${sum(half(k),4)}</div><div class="lbl">${k==='out'?'OUT':'IN'}の目標</div></div>`).join('')}<div class="rounded-xl bg-warn-soft p-2"><div class="num text-2xl font-semibold text-warn">${x.limit||99}</div><div class="lbl">上限</div></div></div>`;}
  if(x.mapKey)out+=`<div class="rounded-xl bg-accent-soft px-3 py-2 text-[13px] text-accent"><b>⛳ ホールをタップするとマップが開きます。</b>1打目・2打目の狙いと残りの距離、池・バンカー・OBの位置が見られます。</div>`;
  if(x.info)out+=`<ul class="grid gap-1 pl-4 text-[13px] text-muted list-disc">${x.info.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`;
  if(memo.length)out+=`<div class="grid gap-2"><h3 class="font-bold">作戦メモ</h3><ul class="grid gap-1 pl-4 text-[14px] list-disc">${memo.map(s=>`<li>${esc(s)}</li>`).join('')}</ul></div>`;
  if(x.rules)out+=`<div data-sec="rs-rules" class="grid gap-2"><h3 class="font-bold">当日の${x.rules.length}つの約束</h3>${x.rules.map((r,i)=>`<div class="rounded-xl border border-line p-3"><div class="font-bold"><span class="text-accent">${'①②③④⑤⑥⑦'[i]}</span> ${esc(r[0])}</div><div class="text-[13px] text-muted">${esc(r[1])}</div></div>`).join('')}</div>`;
  if(H.length){const o=x.order||['out','in'];
    out+=o.map(k=>{const hs=half(k);return `<div data-sec="rs-${k}" class="grid gap-2"><div class="flex items-baseline gap-2 border-b-2 border-fg pb-1"><h3 class="h2">${k==='out'?'OUT':'IN'}</h3><span class="font-mono text-xs text-muted">${sum(hs,2).toLocaleString()}y・Par${sum(hs,1)}</span><span class="ml-auto text-[13px]">目標 <b class="num text-accent">${sum(hs,4)}</b></span></div>
     <div class="divide-y divide-line">${hs.map(h=>{const c=h[7]==='hard'?'bg-warn':h[7]==='mid'?'bg-sand':'bg-accent';const mp=x.mapKey&&typeof HOLE_MAPS!=='undefined'&&HOLE_MAPS[x.mapKey][h[0]];return `<div class="grid grid-cols-[2.5rem_1fr_auto] gap-x-3 gap-y-1 py-2.5 ${mp?'cursor-pointer':''}" ${mp?`onclick="openHoleMap('${x.date}',${h[0]})"`:''}>
      <div class="row-span-2 grid h-10 w-10 place-items-center rounded-lg ${c} font-mono text-base font-bold text-surface">${h[0]}</div>
      <div class="flex flex-wrap items-baseline gap-x-2 text-[12px] text-muted"><span>Par${h[1]}</span><span class="font-mono">${h[2]}y</span><span>HC ${h[3]}</span><span class="font-semibold text-fg">${esc(h[5])}</span>${(()=>{const sd=x.mapKey&&typeof HOLE_SIDES!=='undefined'&&(HOLE_SIDES[x.mapKey]||{})[h[0]];return sd?`<span class="${sideCls(sd.L)}">左${sideMark(sd.L)}${/OB/.test(sd.L)?'OB':''}</span><span class="${sideCls(sd.R)}">右${sideMark(sd.R)}${/OB/.test(sd.R)?'OB':''}</span>${sd.B?`<span class="text-warn">奥✕</span>`:''}`:'';})()}</div>
      <div class="row-span-2 text-right"><div class="num text-2xl font-semibold leading-none">${h[4]}</div><div class="text-[10px] text-muted">目標</div></div>
      <div class="text-[13px] leading-snug">${esc(h[6])}${mp?`<span class="mt-1 flex w-fit items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-bold text-accent">⛳ マップを見る ›</span>`:''}</div></div>`;}).join('')}</div></div>`;}).join('');
    out+=`<div class="flex flex-wrap gap-3 text-[11px] text-muted"><span><i class="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-accent align-middle"></i>ボギーを取る</span><span><i class="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-sand align-middle"></i>注意</span><span><i class="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-warn align-middle"></i>ダブルボギーでOK</span></div>`;}
  if(x.checks)out+=`<div data-sec="rs-checks" class="grid gap-2"><h3 class="font-bold">途中の確認</h3><ul class="grid gap-1 pl-4 text-[13px] list-disc [&_b]:text-accent">${x.checks.map(s=>`<li>${s}</li>`).join('')}</ul></div>`;
  if(x.prep)out+=`<div data-sec="rs-prep" class="grid gap-2"><h3 class="font-bold">当日の朝と、それまでの練習</h3><ul class="grid gap-1 pl-4 text-[13px] list-disc">${x.prep.map(s=>`<li>${esc(s)}</li>`).join('')}</ul></div>`;
  if(x.note)out+=`<p class="text-[12px] text-muted">${esc(x.note)}</p>`;
  if(x.sources)out+=`<div class="text-[11px] text-muted"><b>出典</b>　${x.sources.map(([t,u])=>`<a class="underline" href="${u}" target="_blank" rel="noopener">${esc(t)}</a>`).join('　')}</div>`;
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
function roundToggle(d){const opening=ROUND_OPEN!==d;ROUND_OPEN=opening?d:'';
  const hh=document.querySelector('header');if(hh)document.documentElement.style.setProperty('--hh',hh.offsetHeight+'px');
  renderRounds().then(()=>{const el=$('rc-'+d);if(el){const y=el.getBoundingClientRect().top+scrollY-(hh?hh.offsetHeight:57)-8;scrollTo({top:y,behavior:opening?'smooth':'auto'});}});}
function roundJump(id){const el=$(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});}
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
