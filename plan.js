// ─────────────────────────────────────────────
// トレーニング計画（ゴルフ期 → 土台期 → マラソン期）
//   ゴルフ：2026-10-20（火）ラウンド　目標100切り
//   マラソン：2027-03-07（日）篠山ABCマラソン　目標3時間30分切り（4'58/km）
// ─────────────────────────────────────────────
(function(){
const ROUNDS=['2026-10-20','2026-11-29'];
const ROUND=ROUNDS[0];
const RACE='2027-03-07';
const pad=n=>String(n).padStart(2,'0');
const ymd=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const parse=s=>{const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d);};
const addDays=(s,n)=>{const d=parse(s);d.setDate(d.getDate()+n);return ymd(d);};
const diffDays=(a,b)=>Math.round((parse(b)-parse(a))/86400000);
const mondayOf=s=>{const d=parse(s);const w=(d.getDay()+6)%7;d.setDate(d.getDate()-w);return ymd(d);};
const today=()=>ymd(new Date());

const PHASES=[
  {id:'golf',name:'ゴルフ期',sub:'10/20 ラウンドに向けて回旋とパワー',from:'2026-09-28',to:'2026-10-21'},
  {id:'base',name:'土台期',sub:'週30km台まで距離を伸ばす。12月は150km、12/26か27にハーフをレースペースで',from:'2026-10-22',to:'2026-12-27'},
  {id:'marathon',name:'マラソン期',sub:'1月は200km・30km走2回、2月中旬にレースペースで32km（35km）',from:'2026-12-28',to:'2027-03-07'},
];

// ロング走（週の月曜日 → km）。11/16の週からは木曜の朝（水曜でもOK）。土曜は走らない。フルマラソン用に30km級を2回
const LONG={
  '2026-10-19':8,'2026-10-26':10,'2026-11-02':12,'2026-11-09':13,'2026-11-16':14,'2026-11-23':0,
  '2026-11-30':12,'2026-12-07':14,'2026-12-14':0,'2026-12-21':16,
  '2026-12-28':18,'2027-01-04':20,'2027-01-11':24,'2027-01-18':18,'2027-01-25':0,
  '2027-02-01':28,'2027-02-08':32,'2027-02-15':26,'2027-02-22':18,'2027-03-01':0,
};
const LONG_NOTE={
  '2026-11-23':'ラウンド週のためお休み','2026-12-14':'この週は木曜の朝に10kmテスト','2027-01-18':'回復週。距離を落とす','2027-01-25':'この週は木曜の朝にハーフのテスト',
  '2027-01-11':'最後の5kmだけマラソンペース','2027-02-01':'最後の8kmをマラソンペース','2027-02-08':'最長走。給水・補食（ジェル）を本番と同じに',
  '2027-02-15':'最後の12kmをマラソンペース（本番の予行）','2027-02-22':'調整開始。ゆっくり',
};
const longDow=mon=>mon>='2026-11-16'?4:6; // 4＝木曜（水曜に入れ替えOK）、6＝土曜

// ペースは3段階で上げる（3時間30分切り＝4'58/km）。テストの結果で次の段階へ進む
const PACE_STAGES=[
  {from:'2000-01-01',name:'今の力（〜1/3）',why:'11/10の8.1km 5\'14"（心拍167）から',easy:"6'20〜6'55/km",long:"6'10〜6'40/km",mp:"5'25〜5'30/km",tempo:"5'05〜5'10/km",interval:"4'40〜4'45/km"},
  {from:'2027-01-04',name:'1月',why:'12/26か27のハーフをレースペース（4\'58"/km）で走れたら',easy:"5'55〜6'30/km",long:"5'50〜6'20/km",mp:"5'10〜5'15/km",tempo:"4'48〜4'53/km",interval:"4'25〜4'30/km"},
  {from:'2027-02-01',name:'2月〜本番（3時間30分切り）',why:'1/23か24の30km走②で、最後の10kmを5\'05"/kmで走れたら',easy:"5'35〜6'10/km",long:"5'30〜6'00/km",mp:"4'55〜5'00/km",tempo:"4'35〜4'40/km",interval:"4'14〜4'18/km"},
];
const paceAt=s=>PACE_STAGES.filter(x=>s>=x.from).pop();
const PACE=paceAt(today());

function phaseOf(s){return PHASES.find(p=>s>=p.from&&s<=p.to)||(s<PHASES[0].from?null:{id:'after',name:'レース後',sub:'回復',from:RACE,to:'9999'});}

function it(kind,label,extra){return Object.assign({kind,label},extra||{});}
// PPL法（プッシュ・プル・レッグ）… [種目, セット, 回数, メモ]
//   筋肥大は1部位あたり週10セット以上・余力1〜2回（RIR）が目安。ランとの両立は脚の量を控えめに。
const PPL={
  golf:{
    legs:[['スクワット',3,6,'余力2〜3回'],['ルーマニアンデッドリフト',3,8],['カーフレイズ',2,15]],
    push:[['ベンチプレス',4,5,'80〜85kg'],['DBインクラインプレス',3,10],['ケーブルサイドレイズ',3,15],['ケーブルトライセプスプッシュダウン',2,12]],
    pull:[['デッドリフト',3,5,'余力2〜3回'],['ラットプルダウン',3,10],['シーテッドロウ（ケーブル）',3,10],['フェイスプル',2,15],['ハンマーカール',2,12]],
  },
  base:{
    legs:[['スクワット',4,5],['ルーマニアンデッドリフト',3,8],['ブルガリアンスプリットスクワット',3,8,'片脚ずつ']],
    push:[['ベンチプレス',5,4,'125kg計画の重さ'],['DBインクラインプレス',3,10],['ケーブルフライ（下から）',2,12],['DBサイドレイズ',4,15],['ケーブルオーバーヘッドトライセプス',3,12]],
    pull:[['デッドリフト',3,5],['チンニング（懸垂）',3,8,'できなければラットプル'],['DBワンハンドロウ',3,10],['フェイスプル',2,15],['インクラインDBカール',3,12]],
  },
  marathon:{
    legs:[['スクワット',3,5,'重すぎない'],['ルーマニアンデッドリフト',2,8]],
    upper:[['ベンチプレス',3,5],['チンニング（懸垂）',3,8],['DBインクラインプレス',2,10],['DBサイドレイズ',3,15],['シーテッドロウ（ケーブル）',2,10]],
  },
};
const PPL_NAME={legs:'PPL レッグ（脚・お尻）',push:'PPL プッシュ（胸・肩・三頭）',pull:'PPL プル（背中・二頭）',upper:'上半身（プッシュ＋プル）'};
const CAT_OF={legs:'legs',push:'push',pull:'pull',upper:'full'};
function pplItem(phase,day,extra){const ex=PPL[phase][day];return it('gym',PPL_NAME[day],Object.assign({cat:CAT_OF[day],ppl:day,ex,detail:ex.map(e=>`${e[0]} ${e[1]}×${e[2]}${e[3]?'（'+e[3]+'）':''}`).join('・')},extra||{}));}


function planDay(s){
  const ph=phaseOf(s);
  if(!ph)return{phase:null,items:[]};
  const dow=parse(s).getDay(); // 0日〜6土
  const mon=mondayOf(s);
  const items=[];
  const note=[];

  // ── 特別な日 ──
  if(s==='2026-11-29')return{phase:ph,items:[it('event','ラウンド本番（宝塚クラシックGC IN 7:32）',{detail:'早朝プラン：4:15起床・水 → 4:20〜4:40 軽い筋トレ（可動域の3種＋骨盤分離 片足10回＋ヒップツイスト10回＋ジーニー①、汗をかかない程度）→ 4:40〜5:00 朝ごはん → 5:05ごろ出発 → 5:30〜5:55 アコーディア・ガーデン神戸三田（52°ハーフ10球→4H 5球→ドライバー20球。最後の5球は10番のつもりでフェアウェイの真ん中を向いて1球ずつ。引っ掛けが何球出たか数えて、5球中2球以上なら12番は4H）→ 5:55出発（宝塚クラシックまでの時間は当日カーナビで確認）→ 6:30着・受付・着替え → 6:45〜7:05 アプローチ・バンカー → 7:05〜7:20 パター → 7:20 10番ティーへ。3ホールごとに補食'})]};
  if(s==='2026-11-28')return{phase:ph,items:[it('prep','ラウンド前日の調整',{detail:'⓪ほぐし＋骨盤分離＋ヒップツイストだけ。練習場は60球まで',routine:'genie',part:'short'})]};
  if(s==='2026-11-27')return{phase:ph,items:[it('genie','ジーニー ⑤⑥ジャンプ・回旋（15分）',{routine:'genie',part:'power'}),pplItem('base','pull',{extra:'ラウンド2日前。重さは控えめ、各2セットでOK'})]};
  if(s===ROUND)return{phase:ph,items:[it('event','ラウンド本番（東条湖CC OUT 7:08）',{detail:'朝：①可動域の3種＋骨盤分離 片足10回＋ヒップツイスト 10回。3ホールごとに補食。目標100切り！'})]};
  if(s===RACE)return{phase:ph,items:[it('event','篠山マラソン',{detail:"目標3時間30分切り（4'58/km）。最初の5kmは5'05で入り、そこからイーブン。30km以降に余裕があれば上げる。テストの結果しだいで3時間40分（5'12/km）に切り替える",km:42.195})]};
  if(s==='2026-12-17')return{phase:ph,items:[it('run','10kmタイムトライアル（朝）',{km:14,detail:'アップ2km→10kmを全力の一歩手前で（1km 4\'54"より速く＝49分以内）→ダウン2km。49分以内なら1月から1段上のペースへ、46分以内（1km 4\'36"）なら2月のペースへ'})]};
  if(s==='2027-01-28')return{phase:ph,items:[it('run','ハーフのタイムトライアル（朝）',{km:24,detail:'アップ1.5km→21.1kmをレースのつもりで（1km 4\'52"より速く＝1時間43分以内）→ダウン1.5km。届けば2月から3時間30分のペース（1km 4\'58"）へ。補給の練習も'})]};
  if(s==='2026-10-19')return{phase:ph,items:[it('prep','ラウンド前日の調整',{detail:'⓪ほぐし＋骨盤分離＋ヒップツイストだけ。練習場は60球まで',routine:'genie',part:'short'})]};
  if(s==='2026-10-18')return{phase:ph,items:[it('off','完全OFF',{detail:'ストレッチと散歩のみ'})]};
  if(s==='2026-10-21')return{phase:ph,items:[it('off','回復日',{detail:'ラウンドの疲れを抜く。散歩とストレッチ'})]};

  if(ph.id==='golf'){
    const w=Math.min(3,Math.max(1,Math.floor(diffDays('2026-09-28',s)/7)+1));
    const day=w;
    if(dow===1){items.push(it('genie','ジーニールーティン（⓪→⑥）',{routine:'genie',min:60}),pplItem('golf','legs',{extra:'時間がなければ上の2種目だけ'}));}
    if(dow===2){items.push(it('goltore',`ゴルトレ Day${day}`,{routine:'y'+day,extra:w===2?'最後にDay1のケーブル2種目':''}),it('run','イージーラン',{km:5,detail:'会話できるペース '+PACE.easy}));}
    if(dow===3){items.push(it('genie','ジーニー ⓪ほぐし・②肩胸椎',{routine:'genie',part:'upper'}),pplItem('golf','push'),it('pilates','ピラティスチェア 10分'));}
    if(dow===4){items.push(it('goltore',`ゴルトレ Day${day}`,{routine:'y'+day}),it('pilates','ピラティスチェア 10分'),it('run','軽いラン',{km:3}));}
    if(dow===5){items.push(it('genie','ジーニールーティン（⓪→⑥）',{routine:'genie',min:60,extra:s==='2026-10-16'?'ジャンプ・VBTはこの日が最後':''}),pplItem('golf','pull',{extra:'時間がなければ上の2種目だけ'}));}
    if(dow===6){const km=s==='2026-10-17'?6:9;items.push(it('run','ロングラン',{km,detail:(s==='2026-10-17'?'ラウンド前なので短縮。':'8〜10km。')+PACE.long}),it('goltore','ゴルトレ ストレッチ 約10分',{routine:'y1',part:'stretch'}));}
    if(dow===0){items.push(it('off','完全OFF',{detail:'ストレッチと散歩のみ'}));}
    note.push('練習場は毎日OK（100球まで、脚の日は70球）');
  }

  if(ph.id==='base'){
    const P=paceAt(s);
    const wk=Math.floor(diffDays('2026-10-19',s)/7);
    const day=((wk%3)+3)%3+1;
    const late=s>='2026-11-30',later=s>='2026-12-14';
    const easy=s<'2026-11-09'?6:8;const LD=longDow(mon);const lkm=LONG[mon]!=null?LONG[mon]:8;
    const longItem=()=>it('run',LD===4?'ロング走（朝）':'ロング走',{km:lkm,detail:(LONG_NOTE[mon]?LONG_NOTE[mon]+'。':'')+P.long+(LD===4?'。水曜にずらしてもOK（その時は水木を入れ替え）':'')});
    if(dow===1){items.push(it('genie','ジーニー ⓪〜③（30分版）',{routine:'genie',part:'short'}),pplItem('base','legs'));}
    if(dow===2){items.push(it('run',late?'イージーラン＋流し':'イージーラン',{km:late&&s<'2026-12-07'?6:easy,detail:P.easy+(late?'。最後に100m×4本を気持ちよく速く（流し）':'')}));}
    if(dow===3){items.push(it('genie','ジーニー ⓪ほぐし・②肩胸椎',{routine:'genie',part:'upper'}),pplItem('base','push'));if(later)items.push(it('run','ゆっくりジョグ',{km:5,detail:P.easy}));}
    if(dow===4){items.push(it('goltore',`ゴルトレ Day${day}`,{routine:'y'+day}));if(LD===4&&lkm)items.push(longItem());else items.push(it('run','イージーラン',{km:late?6:5,detail:P.easy}));}
    if(dow===5){items.push(it('genie','ジーニー ⑤⑥ジャンプ・回旋（15分）',{routine:'genie',part:'power'}),pplItem('base','pull'));}
    if(dow===6){if(LD===6&&lkm)items.push(longItem());items.push(it('pilates','ピラティスチェア 10分'));}
    if(dow===0){if(late)items.push(it('run','イージーラン＋流し',{km:later?8:6,detail:P.easy+'。最後に100m×4本の流し'}));else items.push(it('off','完全OFF',{detail:'ストレッチと散歩のみ'}));}
  }

  if(ph.id==='marathon'){
    // フルマラソン用：火＝閾値（テンポ／1km）、木の朝＝ロング（マラソンペース入り）、日＝マラソンペース走、土は走らない
    const P=paceAt(s);
    const wk=Math.floor(diffDays('2026-12-28',s)/7);
    const taper=s>='2027-02-22';
    const race=s>='2027-03-01';
    const lkm=LONG[mon]!=null?LONG[mon]:16;
    if(dow===1){items.push(it('genie','ジーニー ⓪〜③（30分版）',{routine:'genie',part:'short'}),(race?it('off','筋トレお休み',{detail:'レース週'}):pplItem('marathon','legs')));}
    if(dow===2){
      if(race)items.push(it('run','刺激走',{km:6,detail:`うち3kmをマラソンペース ${P.mp}`}));
      else if(wk%2===1)items.push(it('run','1kmインターバル',{km:taper?8:10,detail:`1km×${taper?3:5}本 ${P.interval}（つなぎ400mジョグ）。アップ・ダウン込み`}));
      else items.push(it('run','テンポ走',{km:taper||s<'2027-01-11'?8:10,detail:`${taper?4:6}kmを ${P.tempo}。アップ・ダウン込み`}));
    }
    if(dow===3){items.push(pplItem('marathon','upper'));if(!race)items.push(it('run','イージーラン',{km:taper||s<'2027-01-11'?5:6,detail:P.easy}));}
    if(dow===4){if(race)items.push(it('run','イージーラン',{km:5,detail:P.easy}));
      else if(lkm)items.push(it('run','ロング走（朝）',{km:lkm,detail:(LONG_NOTE[mon]?LONG_NOTE[mon]+'。':'')+P.long+'。水曜にずらしてもOK'}));
      else items.push(it('run','イージーラン＋流し',{km:6,detail:P.easy+'。最後に100m×4本の流し'}));
      items.push(it('goltore','骨盤分離＋ヒップツイスト',{routine:'y2',part:'short'}));}
    if(dow===5){if(race)items.push(it('run','刺激走（朝）',{km:3,detail:'ゆっくり3km＋流し2本。あとはよく寝る'}));else items.push(it('off','OFF',{detail:'ストレッチのみ'}));}
    if(dow===6){items.push(it('off','OFF（走らない）',{detail:race?'レース前日。散歩と準備だけ':'ストレッチと散歩'}));}
    if(dow===0){
      if(taper)items.push(it('run','マラソンペース走',{km:10,detail:`うち6kmを ${P.mp}。本番の靴・補給で`}));
      else if(lkm>=26||s<'2027-01-09'||mon==='2027-01-18'||mon==='2027-01-25')items.push(it('run','回復ジョグ',{km:6,detail:'ゆっくり。脚が重ければOFF'}));
      else{const mp=s<'2027-01-23'?6:8;items.push(it('run','マラソンペース走',{km:mp+6,detail:`アップ3km→${mp}kmを ${P.mp}→ダウン3km`}));}
    }
  }

  if(ph.id==='after'){items.push(it('off','回復期',{detail:'2週間は軽めに'}));}
  return{phase:ph,items,note};
}

// ── ランは週ごとのプラン（11/30〜本番）。日ごとに決めず、その週のうちに好きな日で走る（洋平さんの指示）
//   月の目標：12月150km・1月200km。12月にハーフをレースペースで1回、1月に30km走2回、2月中旬にレースペースで32km（または35km）
const RP="4'58\"/km";
const RUN_WEEKS=[
  {mon:'2026-11-30',km:30,title:'12月の入り',key:[['ロング','14km',P=>P.long],['テンポ走','8km（うち5kmを速め）',P=>P.tempo]],easy:'イージー2〜3回（5〜6km）'},
  {mon:'2026-12-07',km:33,title:'距離を伸ばす',key:[['ロング','16km',P=>P.long],['1kmインターバル','10km（1km×5本）',P=>P.interval]],easy:'イージー2〜3回（5〜6km）'},
  {mon:'2026-12-14',km:36,title:'レースペースに慣れる',key:[['ロング','18km',P=>P.long],['マラソンペース走','12km（うち6kmを '+RP+'）',()=>RP]],easy:'イージー2回（6km）'},
  {mon:'2026-12-21',km:38,title:'★ハーフをレースペースで',key:[['ハーフ走（土か日）','21.1kmを '+RP+'（1時間44分50秒）',()=>RP]],easy:'週の前半はイージー3回（5〜8km）＋流し。2日前からは軽く',star:'half'},
  {mon:'2026-12-28',km:32,title:'年末年始・回復',key:[['ロング','20km（ゆっくり）',P=>P.long]],easy:'イージー3回（4〜6km）'},
  {mon:'2027-01-04',km:44,title:'★30km走①',key:[['30km走（土か日）','30km。ゆっくり入り、最後の5kmだけ5\'10"/km',P=>P.long],['テンポ走','8km（うち6km）',P=>P.tempo]],easy:'イージー2回（3日前から軽く）',star:'30a'},
  {mon:'2027-01-11',km:46,title:'スピードとロング',key:[['ロング','22km（最後の8kmをマラソンペース）',P=>P.mp],['1kmインターバル','10km（1km×6本）',P=>P.interval]],easy:'イージー2〜3回'},
  {mon:'2027-01-18',km:46,title:'★30km走②',key:[['30km走（土か日）','30km。最後の10kmを5\'05"/km',P=>P.long],['テンポ走','8km（うち5km）',P=>P.tempo]],easy:'イージー2回（3日前から軽く）',star:'30b'},
  {mon:'2027-01-25',km:50,title:'1月の仕上げ',key:[['ロング','24km（うち12kmを '+RP+'）',()=>RP],['マラソンペース走','14km（うち8kmを '+RP+'）',()=>RP]],easy:'イージー2〜3回'},
  {mon:'2027-02-01',km:44,title:'疲れを抜きつつ',key:[['ロング','20km',P=>P.long],['テンポ走','10km（うち8km）',P=>P.tempo]],easy:'イージー2〜3回'},
  {mon:'2027-02-08',km:50,title:'★レースペースで32km（35km）',key:[['レースペース走（2/13土か2/14日）','32km（調子が良ければ35km）を '+RP+'。給水・ジェルは本番と同じに',()=>RP]],easy:'週の前半はイージー3回（6〜8km）。2日前からは軽く',star:'rp32'},
  {mon:'2027-02-15',km:36,title:'回復してから最後のロング',key:[['ロング','18km（最後の5kmを '+RP+'）',()=>RP],['1kmインターバル','8km（1km×4本）',P=>P.interval]],easy:'週の前半はゆっくりだけ'},
  {mon:'2027-02-22',km:28,title:'調整（テーパー）',key:[['マラソンペース走','12km（うち6kmを '+RP+'）',()=>RP],['ロング','14km（ゆっくり）',P=>P.long]],easy:'イージー1〜2回'},
  {mon:'2027-03-01',km:14,title:'レース週',key:[['刺激走','6km（うち3kmを '+RP+'）',()=>RP]],easy:'あとは3〜5kmのジョグだけ。前日は散歩',star:'race'},
];
const runWeek=s=>RUN_WEEKS.find(w=>w.mon===mondayOf(s))||null;
const weekText=w=>{const P=paceAt(w.mon);return w.key.map(k=>`${k[0]} ${k[1]}（${k[2](P)}）`).join('／')+'／'+w.easy+`（${P.easy}）`;};
function planFor(s){const p=planDay(s);const w=runWeek(s);if(!w||s===RACE||!p.phase)return p;
  const items=p.items.filter(i=>i.kind!=='run'&&!(i.kind==='off'&&/走らない|OFF/.test(i.label)));
  items.push(it('run','今週のラン（週プラン）',{week:true,detail:`今週の合計 ${w.km}km：${weekText(w)}`}));
  return {...p,items};}

function nextRound(t){return ROUNDS.find(r=>r>=t&&!(typeof ROUND_DEFS!=='undefined'&&((ROUND_DEFS.find(x=>x.date===r)||{}).result||{}).score))||null;}
function plannedKm(from,to){let s=from,t=0;while(s<=to){const w=runWeek(s);if(w&&s!==RACE)t+=w.km/7;else planFor(s).items.forEach(i=>{if(i.km&&i.kind!=='event')t+=i.km;});s=addDays(s,1);}return Math.round(t*10)/10;}

function longRuns(){
  return Object.keys(LONG).filter(m=>LONG[m]>0).map(m=>({date:addDays(m,longDow(m)-1),km:LONG[m],note:LONG_NOTE[m]||''}));
}

window.PLAN={RUN_WEEKS,runWeek,weekText,PPL,PPL_NAME,ROUND,ROUNDS,nextRound,RACE,PHASES,PACE,PACE_STAGES,paceAt,planFor,plannedKm,longRuns,phaseOf,util:{pad,ymd,parse,addDays,diffDays,mondayOf,today}};
})();
