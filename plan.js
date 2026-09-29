// ─────────────────────────────────────────────
// トレーニング計画（ゴルフ期 → 土台期 → マラソン期）
//   ゴルフ：2026-10-20（火）ラウンド　目標100切り
//   マラソン：2027-03-07（日）篠山ABCマラソン　目標サブ4 → 3時間30分
// ─────────────────────────────────────────────
(function(){
const ROUND='2026-10-20';
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
  '2026-10-19':8,'2026-10-26':10,'2026-11-02':12,'2026-11-09':13,'2026-11-16':14,'2026-11-23':10,
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

function planFor(s){
  const ph=phaseOf(s);
  if(!ph)return{phase:null,items:[]};
  const dow=parse(s).getDay(); // 0日〜6土
  const mon=mondayOf(s);
  const items=[];
  const note=[];

  // ── 特別な日 ──
  if(s===ROUND)return{phase:ph,items:[it('event','ラウンド本番',{detail:'朝：①可動域の3種＋骨盤分離 片足10回＋ヒップツイスト 10回。3ホールごとに補食。目標100切り！'})]};
  if(s===RACE)return{phase:ph,items:[it('event','篠山マラソン',{detail:"目標サブ4（5'41/km）。前半はイーブン、30km以降で余裕があれば上げる",km:42.195})]};
  if(s==='2026-10-19')return{phase:ph,items:[it('prep','ラウンド前日の調整',{detail:'⓪ほぐし＋骨盤分離＋ヒップツイストだけ。練習場は60球まで',routine:'genie',part:'short'})]};
  if(s==='2026-10-18')return{phase:ph,items:[it('off','完全OFF',{detail:'ストレッチと散歩のみ'})]};
  if(s==='2026-10-21')return{phase:ph,items:[it('off','回復日',{detail:'ラウンドの疲れを抜く。散歩とストレッチ'})]};

  if(ph.id==='golf'){
    const w=Math.min(3,Math.max(1,Math.floor(diffDays('2026-09-28',s)/7)+1));
    const day=w;
    if(dow===1){items.push(it('genie','ジーニールーティン（⓪→⑥）',{routine:'genie',min:60}),it('gym','スクワット 3×6',{detail:'余力2〜3回残す',cat:'legs'}));}
    if(dow===2){items.push(it('goltore',`ゴルトレ Day${day}`,{routine:'y'+day,extra:w===2?'最後にDay1のケーブル2種目':''}),it('run','イージーラン',{km:5,detail:'会話できるペース '+PACE.easy}));}
    if(dow===3){items.push(it('genie','ジーニー ⓪ほぐし・②肩胸椎',{routine:'genie',part:'upper'}),it('gym','上半身',{detail:'ベンチ 4×5（80〜85kg）・ワンアームDBロウ 3×10・フェイスプル 3×15',cat:'push'}),it('pilates','ピラティスチェア 10分'));}
    if(dow===4){items.push(it('goltore',`ゴルトレ Day${day}`,{routine:'y'+day}),it('pilates','ピラティスチェア 10分'),it('run','軽いラン',{km:3}));}
    if(dow===5){items.push(it('genie','ジーニールーティン（⓪→⑥）',{routine:'genie',min:60,extra:s==='2026-10-16'?'ジャンプ・VBTはこの日が最後':''}),it('gym','デッドリフト 3×5',{detail:'余力2〜3回残す',cat:'pull'}));}
    if(dow===6){const km=s==='2026-10-17'?6:9;items.push(it('run','ロングラン',{km,detail:(s==='2026-10-17'?'ラウンド前なので短縮。':'8〜10km。')+PACE.long}),it('goltore','ゴルトレ ストレッチ 約10分',{routine:'y1',part:'stretch'}));}
    if(dow===0){items.push(it('off','完全OFF',{detail:'ストレッチと散歩のみ'}));}
    note.push('練習場は毎日OK（100球まで、脚の日は70球）');
  }

  if(ph.id==='base'){
    const wk=Math.floor(diffDays('2026-10-26',s)/7);
    const day=((wk%3)+3)%3+1;
    const easy=s<'2026-11-09'?6:8;
    if(dow===1){items.push(it('genie','ジーニールーティン（⓪→⑥）',{routine:'genie',min:60}),it('gym','脚の筋力',{detail:'スクワット 4×5・ブルガリアン 3×8',cat:'legs'}));}
    if(dow===2){items.push(it('run','イージーラン',{km:easy,detail:PACE.easy}));}
    if(dow===3){items.push(it('genie','ジーニー ⓪ほぐし・②肩胸椎',{routine:'genie',part:'upper'}),it('gym','上半身（ベンチ強化）',{detail:'ベンチ 5×3〜5・ロウ・フェイスプル',cat:'push'}));}
    if(dow===4){items.push(it('goltore',`ゴルトレ Day${day}`,{routine:'y'+day}),it('run','イージーラン',{km:5,detail:PACE.easy}));}
    if(dow===5){items.push(it('genie','ジーニールーティン（⓪→⑥）',{routine:'genie',min:60}),it('gym','デッドリフト 3×5',{cat:'pull'}));}
    if(dow===6){const km=LONG[mon]!=null?LONG[mon]:8;items.push(it('run','ロング走',{km,detail:(LONG_NOTE[mon]?LONG_NOTE[mon]+'。':'')+PACE.long}),it('pilates','ピラティスチェア 10分'));}
    if(dow===0){items.push(it('off','完全OFF',{detail:'ストレッチと散歩のみ'}));}
  }

  if(ph.id==='marathon'){
    const wk=Math.floor(diffDays('2026-12-28',s)/7);
    const taper=s>='2027-02-22';
    const race=s>='2027-03-01';
    if(dow===1){items.push(it('genie','ジーニー ⓪〜③（30分版）',{routine:'genie',part:'short'}),it('gym','脚の筋力維持',{detail:race?'お休み':'スクワット 3×5（重すぎない）',cat:'legs'}));}
    if(dow===2){
      if(race)items.push(it('run','刺激走',{km:6,detail:"うち3kmを5'35/km"}));
      else if(wk%2===0)items.push(it('run','インターバル',{km:taper?6:8,detail:`1km×${taper?3:5}本 ${PACE.interval}（つなぎ400mジョグ）。アップ・ダウン込み`}));
      else items.push(it('run','テンポ走',{km:taper?6:8,detail:`${taper?4:5}kmを ${PACE.tempo}。アップ・ダウン込み`}));
    }
    if(dow===3){items.push(it('gym','上半身',{detail:'ベンチ維持・ロウ',cat:'push'}),it('pilates','ピラティスチェア 10分'));}
    if(dow===4){items.push(it('run','イージーラン',{km:race?5:(taper?5:(s<'2027-01-25'?6:8)),detail:PACE.easy}),it('goltore','骨盤分離＋ヒップツイスト',{routine:'y2',part:'short'}));}
    if(dow===5){items.push(it('off','OFF',{detail:race?'レース2日前。よく寝る':'ストレッチのみ'}));}
    if(dow===6){const km=LONG[mon]!=null?LONG[mon]:16;items.push(it('run',race?'前日刺激走':'ロング走',{km,detail:(LONG_NOTE[mon]?LONG_NOTE[mon]+'。':'')+(race?'':PACE.long)}));}
    if(dow===0){items.push(race?it('off','OFF'):it('run','回復ジョグ',{km:taper?4:5,detail:'ゆっくり。脚が重ければOFF'}));}
  }

  if(ph.id==='after'){items.push(it('off','回復期',{detail:'2週間は軽めに'}));}
  return{phase:ph,items,note};
}

function plannedKm(from,to){let s=from,t=0;while(s<=to){planFor(s).items.forEach(i=>{if(i.km&&i.kind!=='event')t+=i.km;});s=addDays(s,1);}return t;}

function longRuns(){
  return Object.keys(LONG).filter(m=>LONG[m]>0).map(m=>({date:addDays(m,5),km:LONG[m],note:LONG_NOTE[m]||''}));
}

window.PLAN={ROUND,RACE,PHASES,PACE,planFor,plannedKm,longRuns,phaseOf,util:{pad,ymd,parse,addDays,diffDays,mondayOf,today}};
})();
