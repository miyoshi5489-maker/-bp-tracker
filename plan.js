// ─────────────────────────────────────────────
// トレーニング計画（ゴルフ期 → 土台期 → マラソン期）
//   ゴルフ：2026-10-20（火）ラウンド　目標100切り
//   マラソン：2027-03-07（日）篠山ABCマラソン　目標サブ4 → 3時間30分
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
  {id:'base',name:'土台期',sub:'ゴルフの体づくり＋走れる脚をつくる',from:'2026-10-22',to:'2026-12-27'},
  {id:'marathon',name:'マラソン期',sub:'篠山でサブ4、余裕があれば3時間30分',from:'2026-12-28',to:'2027-03-07'},
];

// 土曜ロング走（週の月曜日 → km）
const LONG={
  '2026-10-19':8,'2026-10-26':10,'2026-11-02':12,'2026-11-09':13,'2026-11-16':14,'2026-11-23':0,
  '2026-11-30':15,'2026-12-07':16,'2026-12-14':18,'2026-12-21':12,
  '2026-12-28':18,'2027-01-04':20,'2027-01-11':22,'2027-01-18':16,'2027-01-25':24,
  '2027-02-01':26,'2027-02-08':30,'2027-02-15':20,'2027-02-22':16,'2027-03-01':3,
};
const LONG_NOTE={
  '2027-01-18':'回復週。距離を落とす','2026-11-23':'回復週。距離を落とす','2026-12-21':'回復週。距離を落とす',
  '2027-02-08':'最長走。給水・補食の練習も','2027-02-15':'うち10kmをマラソンペース（5:35〜5:40/km）',
  '2027-02-22':'調整開始。疲れを抜く','2027-03-01':'前日の刺激走。ゆっくり3km',
};

const PACE={
  easy:"6'30〜7'15/km",long:"6'15〜6'45/km",mp:"5'35〜5'40/km",tempo:"5'15〜5'30/km",interval:"4'40〜4'55/km",
};

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


function planFor(s){
  const ph=phaseOf(s);
  if(!ph)return{phase:null,items:[]};
  const dow=parse(s).getDay(); // 0日〜6土
  const mon=mondayOf(s);
  const items=[];
  const note=[];

  // ── 特別な日 ──
  if(s==='2026-11-29')return{phase:ph,items:[it('event','ラウンド本番（11/29）',{detail:'朝：①可動域の3種＋骨盤分離 片足10回＋ヒップツイスト 10回。3ホールごとに補食。10/20の反省を1つだけ意識する'})]};
  if(s==='2026-11-28')return{phase:ph,items:[it('prep','ラウンド前日の調整',{detail:'⓪ほぐし＋骨盤分離＋ヒップツイストだけ。練習場は60球まで',routine:'genie',part:'short'}),it('run','軽いジョグ',{km:4,detail:'ロング走はお休み。'+PACE.easy})]};
  if(s==='2026-11-27')return{phase:ph,items:[it('genie','ジーニー ⑤⑥ジャンプ・回旋（15分）',{routine:'genie',part:'power'}),pplItem('base','pull',{extra:'ラウンド2日前。重さは控えめ、各2セットでOK'})]};
  if(s===ROUND)return{phase:ph,items:[it('event','ラウンド本番',{detail:'朝：①可動域の3種＋骨盤分離 片足10回＋ヒップツイスト 10回。3ホールごとに補食。目標100切り！'})]};
  if(s===RACE)return{phase:ph,items:[it('event','篠山マラソン',{detail:"目標サブ4（5'41/km）。前半はイーブン、30km以降で余裕があれば上げる",km:42.195})]};
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
    const wk=Math.floor(diffDays('2026-10-19',s)/7);
    const day=((wk%3)+3)%3+1;
    const easy=s<'2026-11-09'?6:8;
    if(dow===1){items.push(it('genie','ジーニー ⓪〜③（30分版）',{routine:'genie',part:'short'}),pplItem('base','legs'));}
    if(dow===2){items.push(it('run','イージーラン',{km:easy,detail:PACE.easy}));}
    if(dow===3){items.push(it('genie','ジーニー ⓪ほぐし・②肩胸椎',{routine:'genie',part:'upper'}),pplItem('base','push'));}
    if(dow===4){items.push(it('goltore',`ゴルトレ Day${day}`,{routine:'y'+day}),it('run','イージーラン',{km:5,detail:PACE.easy}));}
    if(dow===5){items.push(it('genie','ジーニー ⑤⑥ジャンプ・回旋（15分）',{routine:'genie',part:'power'}),pplItem('base','pull'));}
    if(dow===6){const km=LONG[mon]!=null?LONG[mon]:8;items.push(it('run','ロング走',{km,detail:(LONG_NOTE[mon]?LONG_NOTE[mon]+'。':'')+PACE.long}),it('pilates','ピラティスチェア 10分'));}
    if(dow===0){items.push(it('off','完全OFF',{detail:'ストレッチと散歩のみ'}));}
  }

  if(ph.id==='marathon'){
    const wk=Math.floor(diffDays('2026-12-28',s)/7);
    const taper=s>='2027-02-22';
    const race=s>='2027-03-01';
    if(dow===1){items.push(it('genie','ジーニー ⓪〜③（30分版）',{routine:'genie',part:'short'}),(race?it('off','筋トレお休み',{detail:'レース週'}):pplItem('marathon','legs')));}
    if(dow===2){
      if(race)items.push(it('run','刺激走',{km:6,detail:"うち3kmを5'35/km"}));
      else if(wk%2===1)items.push(it('run','インターバル',{km:taper?6:8,detail:`1km×${taper?3:5}本 ${PACE.interval}（つなぎ400mジョグ）。アップ・ダウン込み`}));
      else items.push(it('run','テンポ走',{km:taper?6:8,detail:`${taper?4:5}kmを ${PACE.tempo}。アップ・ダウン込み`}));
    }
    if(dow===3){items.push(pplItem('marathon','upper'),it('pilates','ピラティスチェア 10分'));}
    if(dow===4){items.push(it('run','イージーラン',{km:race?5:(taper?5:(s<'2027-01-25'?6:8)),detail:PACE.easy}),it('goltore','骨盤分離＋ヒップツイスト',{routine:'y2',part:'short'}));}
    if(dow===5){items.push(it('off','OFF',{detail:race?'レース2日前。よく寝る':'ストレッチのみ'}));}
    if(dow===6){const km=LONG[mon]!=null?LONG[mon]:16;items.push(it('run',race?'前日刺激走':'ロング走',{km,detail:(LONG_NOTE[mon]?LONG_NOTE[mon]+'。':'')+(race?'':PACE.long)}));}
    if(dow===0){items.push(race?it('off','OFF'):it('run','回復ジョグ',{km:taper?4:5,detail:'ゆっくり。脚が重ければOFF'}));}
  }

  if(ph.id==='after'){items.push(it('off','回復期',{detail:'2週間は軽めに'}));}
  return{phase:ph,items,note};
}

function nextRound(t){return ROUNDS.find(r=>r>=t)||null;}
function plannedKm(from,to){let s=from,t=0;while(s<=to){planFor(s).items.forEach(i=>{if(i.km&&i.kind!=='event')t+=i.km;});s=addDays(s,1);}return t;}

function longRuns(){
  return Object.keys(LONG).filter(m=>LONG[m]>0).map(m=>({date:addDays(m,5),km:LONG[m],note:LONG_NOTE[m]||''}));
}

window.PLAN={PPL,PPL_NAME,ROUND,ROUNDS,nextRound,RACE,PHASES,PACE,planFor,plannedKm,longRuns,phaseOf,util:{pad,ymd,parse,addDays,diffDays,mondayOf,today}};
})();
