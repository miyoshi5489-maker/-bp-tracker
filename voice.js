// ─────────────────────────────────────────────
// 音声入力：話した内容から種目・重さ・回数・セット・ランを読み取って記録フォームに入れる
//   例）「ベンチプレス80キロ5回3セット、インクラインダンベル24キロ10回3セット、ラン5キロ32分」
// ─────────────────────────────────────────────
const VOICE_ALIAS={
  'インクラインベンチ':'インクラインベンチプレス','スミスベンチ':'スミスベンチプレス','ベンチ':'ベンチプレス',
  'インクラインDB':'DBインクラインプレス','インクラインプレス':'DBインクラインプレス','インクライン':'DBインクラインプレス',
  'DBプレス':'DBフラットプレス','DBフライ':'DBフライ','ケーブルフライ':'ケーブルフライ（下から）','クロスオーバー':'ケーブルクロスオーバー',
  'ショルダープレス':'DBショルダープレス','ケーブルサイドレイズ':'ケーブルサイドレイズ','サイドレイズ':'DBサイドレイズ','フロントレイズ':'DBフロントレイズ',
  'フェイスプル':'フェイスプル','リアレイズ':'DBリアレイズ','プッシュダウン':'ケーブルトライセプスプッシュダウン','トライセプス':'ケーブルトライセプスプッシュダウン',
  'フレンチプレス':'ケーブルオーバーヘッドトライセプス','キックバック':'DBトライセプスキックバック','ナローベンチ':'クローズグリップベンチプレス',
  'ルーマニアン':'ルーマニアンデッドリフト','RDL':'ルーマニアンデッドリフト','スモウ':'スモウデッドリフト','デッド':'デッドリフト',
  'ラットプル':'ラットプルダウン','懸垂':'チンニング（懸垂）','チンニング':'チンニング（懸垂）','シーテッドロー':'シーテッドロウ（ケーブル）','シーテッドロウ':'シーテッドロウ（ケーブル）',
  'ワンハンドロー':'DBワンハンドロウ','ワンハンドロウ':'DBワンハンドロウ','DBロー':'DBワンハンドロウ','DBロウ':'DBワンハンドロウ','Tバー':'Tバーロウ','ベントオーバー':'フリーバーベルロウ',
  'バーベルカール':'バーベルカール','ハンマーカール':'ハンマーカール','インクラインカール':'インクラインDBカール','ケーブルカール':'ケーブルカール','レッグカール':'レッグカール','カール':'DBカール',
  'スミススクワット':'スミススクワット','スクワット':'スクワット','ブルガリアン':'ブルガリアンスプリットスクワット','レッグプレス':'レッグプレス','レッグエクステンション':'レッグエクステンション',
  'カーフ':'カーフレイズ','ランジ':'DBランジ','アブローラー':'アブローラー','腹筋ローラー':'アブローラー','ケーブルクランチ':'ケーブルクランチ','レッグレイズ':'ハンギングレッグレイズ',
  'サイドベンド':'DBサイドベンド','ロシアンツイスト':'ロシアンツイスト','プランク':'プランク',
};
const RUN_WORDS=['ランニング','ジョギング','ジョグ','ロング走','走った','ラン'];
const WALK_WORDS=['ウォーキング','散歩','歩いた'];

function jaNum(s){ // 漢数字 → 数字（八十→80、百二十→120、十二→12）
  const d={'〇':0,'零':0,'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9};
  return s.replace(/[〇零一二三四五六七八九十百]+/g,m=>{
    let total=0,cur=0;for(const c of m){if(c in d)cur=cur*10+d[c];else if(c==='十'){total+=(cur||1)*10;cur=0;}else if(c==='百'){total+=(cur||1)*100;cur=0;}}
    return String(total+cur);
  });
}
function voiceNorm(s){
  return jaNum(s.normalize('NFKC')).replace(/ダンベル/g,'DB').replace(/(\d+)\s*キロ\s*半/g,(m,a)=>`${a}.5キロ`).replace(/(\d+)\s*点\s*(\d)/g,'$1.$2').replace(/かける|掛ける|x|X/g,'×');
}
function voiceKeys(){
  const presets=[...new Set([...PRESETS_BY_CAT.full,...GOLF_PRESETS])].map(p=>voiceNorm(p));
  const keys=[...Object.keys(VOICE_ALIAS).map(k=>[voiceNorm(k),VOICE_ALIAS[k]]),...presets.map(p=>[p,p]),...RUN_WORDS.map(w=>[w,'__run']),...WALK_WORDS.map(w=>[w,'__walk'])];
  return keys.sort((a,b)=>b[0].length-a[0].length);
}
function parseVoice(text){
  const s=voiceNorm(text);const keys=voiceKeys();
  const marks=[];let i=0;
  while(i<s.length){const k=keys.find(([key])=>s.startsWith(key,i));if(k){marks.push({pos:i,end:i+k[0].length,name:k[1]});i+=k[0].length;}else i++;}
  const segs=[];
  if(!marks.length)segs.push({name:null,body:s});
  else{ if(marks[0].pos>0)segs.push({name:null,body:s.slice(0,marks[0].pos)});
    marks.forEach((m,j)=>segs.push({name:m.name,body:s.slice(m.end,j+1<marks.length?marks[j+1].pos:s.length)}));}
  const out={ex:[],run:null,walk:null};let last=null;
  for(const seg of segs){
    const b=seg.body;
    if(seg.name==='__run'){
      const r=out.run||{};const km=b.match(/(\d+(?:\.\d+)?)\s*(?:キロ|km)/i);
      const PACE_RE=/(?:(?<![\d.]\s{0,2})キロ|ペース)\s*(\d+)\s*分\s*(?:(\d+)\s*秒?)?/;
      const pace=b.match(PACE_RE);const tm=b.replace(PACE_RE,'').match(/(\d+)\s*分\s*(?:(\d+)\s*秒)?/);
      const hr=b.match(/心拍\s*(\d+)/);
      if(km)r.km=parseFloat(km[1]);if(tm){r.min=+tm[1];r.sec=+(tm[2]||0);}if(pace){r.pmin=+pace[1];r.psec=+(pace[2]||0);}if(hr)r.hr=+hr[1];
      out.run=r;last=null;continue;
    }
    if(seg.name==='__walk'){const km=b.match(/(\d+(?:\.\d+)?)\s*(?:キロ|km)/i);const tm=b.match(/(\d+)\s*分/);out.walk={km:km?parseFloat(km[1]):0,min:tm?+tm[1]:0};last=null;continue;}
    // 筋トレ：重さ・回数・セット（「、」で区切られた重さ違いのセットにも対応）
    const parts=b.split(/[、,。．.\n]|そのあと|次に|次/).filter(x=>x.trim());
    const setsFrom=p=>{
      let w=null,r=null,n=null;
      const x=p.match(/(\d+(?:\.\d+)?)\s*×\s*(\d+)(?:\s*×\s*(\d+))?/);
      if(x){w=parseFloat(x[1]);r=+x[2];n=x[3]?+x[3]:null;}
      const mw=p.match(/(\d+(?:\.\d+)?)\s*(?:キロ|kg|㎏)/i);if(mw)w=parseFloat(mw[1]);
      const mr=p.match(/(\d+)\s*(?:回|レップ|rep)/i);if(mr)r=+mr[1];
      const ms=p.match(/(\d+)\s*(?:セット|set)/i);if(ms)n=+ms[1];
      if(w===null&&r===null&&n===null){const nums=(p.match(/\d+(?:\.\d+)?/g)||[]).map(Number);if(nums.length>=2){w=nums[0];r=nums[1];n=nums[2]||null;}}
      if(w===null&&r===null)return[];
      return [...Array(Math.max(1,n||1))].map(()=>({weight:w||0,reps:r||0,done:true}));
    };
    if(seg.name){last={name:seg.name,sets:[]};out.ex.push(last);}
    for(const p of (parts.length?parts:[b])){const ss=setsFrom(p);if(!ss.length)continue;if(!last){last={name:'',sets:[]};out.ex.push(last);}last.sets.push(...ss);}
  }
  out.ex=out.ex.filter(e=>e.name||e.sets.length);
  return out;
}
function applyVoice(){
  const text=$('voice-text').value.trim();if(!text){toast('話した内容がありません',true);return;}
  const v=parseVoice(text);
  if(!v.ex.length&&!v.run&&!v.walk){toast('種目を読み取れませんでした。種目名・重さ・回数をはっきり話してください',true);return;}
  if(v.ex.length){
    // 空の種目枠は消してから追加
    document.querySelectorAll('.ex-block').forEach(b=>{const n=(b.querySelector('.ex-name')||{}).value;const filled=[...b.querySelectorAll('.set-row input[type=number]')].some(i=>i.value);if(!n&&!filled)b.remove();});
    const inCat=c=>v.ex.every(e=>!e.name||PRESETS_BY_CAT[c].includes(e.name));
    const cat=['push','pull','legs'].find(inCat)||(v.ex.every(e=>GOLF_PRESETS.includes(e.name))?'golf':'full');
    const hasOther=!!document.querySelector('.ex-block');
    $('rec-cat').value=hasOther||v.run?'full':cat;
    v.ex.forEach(e=>addExBlock(e.name,e.sets));
  }else if(v.run&&!document.querySelector('.ex-block .ex-name option:checked[value]:not([value=""])'))$('rec-cat').value='run';
  if(v.run){const r=v.run;if(r.km)$('run-dist').value=r.km;if(r.min!=null){$('run-time-min').value=r.min;$('run-time-sec').value=r.sec||'';}if(r.pmin){$('run-pace-min').value=r.pmin;$('run-pace-sec').value=r.psec||'';}if(r.hr)$('run-hr').value=r.hr;}
  if(v.walk){if(v.walk.km)$('walk-dist').value=v.walk.km;if(v.walk.min)$('walk-time-min').value=v.walk.min;}
  const msg=[v.ex.length?`筋トレ${v.ex.length}種目`:'',v.run?'ラン':'',v.walk?'ウォーキング':''].filter(Boolean).join('・');
  toast(`${msg}を入れました。確認して「記録する」を押してください`);
  $('voice-text').value='';
}

// ── マイク（対応ブラウザは話すと文字になる。非対応ならキーボードのマイクを使う） ──
let REC=null;
function micToggle(targetId,btn){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  const ta=$(targetId);
  if(!SR){ta.focus();toast('キーボードのマイクボタンで話してください');return;}
  if(REC){REC.stop();return;}
  const rec=new SR();rec.lang='ja-JP';rec.interimResults=true;rec.continuous=true;
  const base=ta.value?ta.value.trim()+'、':'';let finalText='';
  rec.onresult=e=>{let interim='';for(let i=e.resultIndex;i<e.results.length;i++){const t=e.results[i][0].transcript;if(e.results[i].isFinal)finalText+=t+'、';else interim+=t;}ta.value=base+finalText+interim;};
  rec.onerror=e=>{toast(e.error==='not-allowed'?'マイクの使用を許可してください':'うまく聞き取れませんでした。もう一度どうぞ',true);};
  rec.onend=()=>{REC=null;btn.classList.remove('!bg-warn','!text-surface');btn.textContent='🎤 話す';ta.value=ta.value.replace(/、$/,'');};
  REC=rec;rec.start();btn.classList.add('!bg-warn','!text-surface');btn.textContent='■ 止める';
}
