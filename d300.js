// ── 300ヤードへの道（ドライバーの飛距離アップ・プログラム）
// 数字の目安：キャリー ≒ ボールスピード(mph)×1.6（打ち出し・スピンが良い時の一般的な目安）。トータルはキャリー＋約35y（10/9の実測の差）。
const D300_LOG=[ // ドライバーのトラックマン（フルスイング・当たった球の平均）
  {d:'2026-10-03',bs:59.6,bsMax:63.0,carry:194,total:231,best:247,note:''},
  {d:'2026-10-05',bs:59.1,bsMax:62.5,carry:199,total:234,best:256,note:'Qi35試打'},
  {d:'2026-10-06',bs:60.2,bsMax:62.4,carry:205,total:236,best:245,note:''},
  {d:'2026-10-09',bs:62.1,bsMax:65.6,carry:213,total:249,best:265,note:'Qi35新品・初日'},
];
const D300_GOAL=74; // 平均ボールスピード（m/s）
const D300_STAGES=[
  {lv:1,name:'今',bs:62,when:'2026年10月',carry:213,total:249,focus:'当たり方を安定させる（大きなミス0を続ける）'},
  {lv:2,name:'フェーズ1',bs:65,when:'〜2026年12月',carry:233,total:268,focus:'ミート率と打ち出し条件を整える（スピードを上げなくても伸びる部分）'},
  {lv:3,name:'フェーズ2',bs:68,when:'〜2027年3月',carry:243,total:278,focus:'冬に体のパワーを上げる（筋力＋素早く動く練習）'},
  {lv:4,name:'フェーズ3',bs:71,when:'〜2027年9月',carry:254,total:289,focus:'上がったパワーをスイングのスピードにつなげる'},
  {lv:5,name:'300y',bs:74,when:'2027年10月〜',carry:265,total:300,focus:'平均で300y'},
];
const D300_MENU=[
  {k:'speed',t:'① スピード（週3回・15分）',d:'練習の最初、体が元気なうちに。全力で振ることが目的なので、当たらなくてOK。',ex:[
    ['速く振る素振り','軽い棒（またはドライバーを逆さに持つ）→ドライバーの順に、全力で5回ずつ×3セット。左打ちでも同じ回数。'],
    ['重いものを振る素振り','重めの練習器具（なければ2本持ち）で5回×2セット。振り切る感覚をつくる。'],
    ['メディシンボールの横投げ','3kgのボールを壁へ、ゴルフの構えから横に投げる。左右5回×3セット。'],
    ['ジャンプ','その場で高く跳ぶ（反動つき）5回×3セット。ジーニーの⑤⑥ジャンプでもOK。']]},
  {k:'power',t:'② 体のパワー（週2回）',d:'スピードの土台。重さはいつものトレーニングで。',ex:[
    ['下半身の筋トレ','デッドリフトかスクワット。重め3〜5回×3〜4セット。'],
    ['ひねる筋トレ','ケーブルやバーの片側を持って、体をひねる動き。左右6回×3セット。'],
    ['片足の筋トレ','ブルガリアンスクワットなど。左右6〜8回×3セット。']]},
  {k:'impact',t:'③ 当たり方（毎回の練習）',d:'同じスピードでも、芯に当たる・打ち出し条件が良いと飛ぶ。今は目安より約10y損している（10/9：62 m/sなら目安キャリー約222y、実際は213y）。',ex:[
    ['ミート率を見る','ボールスピード÷ヘッドスピード。ドライバーは1.45以上、目標1.48。'],
    ['打ち出し角','13〜15°が目安（10/9は平均約12°）。ティーを少し高く、ボールを左寄りに。'],
    ['芯で打つ','フェースに足の裏用のスプレーなどを付けて、当たった場所を確認。']]},
  {k:'dir',t:'④ 方向（毎回の練習）',d:'右に出る癖を直すと、芯に当たる率も上がる。',ex:[
    ['秋野コーチのドリル','テイクバックでクラブを内側に入れない。スイングタブのチェックリストを使う。'],
    ['打ち出し右3°以内','10球中5球以上が合格。']]},
];
function d300Week(){const t=new Date();const d=new Date(t);d.setDate(t.getDate()-((t.getDay()+6)%7));return d.toISOString().slice(0,10);}
function d300Chk(k){try{return localStorage.getItem('d300:'+d300Week()+':'+k)==='1';}catch{return false;}}
function d300Set(k,v){try{localStorage.setItem('d300:'+d300Week()+':'+k,v?'1':'0');}catch{}renderD300();}
function renderD300(){
  const el=$('golf-body');const L=D300_LOG[D300_LOG.length-1];const first=D300_LOG[0];
  const pct=Math.max(0,Math.min(100,(L.bs-55)/(D300_GOAL-55)*100));
  const cur=D300_STAGES.filter(s=>L.bs>=s.bs-0.5).pop()||D300_STAGES[0];
  const days=['月','火','水','木','金','土','日'];
  const plan=[['月','①スピード＋②パワー'],['火','練習場（③④）'],['水','①スピード'],['木','休み'],['金','①スピード＋②パワー'],['土','練習場・ラウンド（③④）'],['日','休み']];
  el.innerHTML=`
  <div class="grid gap-1"><div class="font-display text-2xl">300ヤードへの道</div><div class="text-[12px] text-muted">ドライバーの平均トータル300yまでのプログラム。数字はトラックマン、目標の距離は一般的な目安からの計算です。</div></div>
  <div class="card grid gap-3 p-4">
   <div class="flex items-end justify-between gap-2"><div><div class="lbl">いまの平均トータル（${+L.d.slice(5,7)}/${+L.d.slice(8)}）</div><div class="flex items-baseline gap-1"><span class="num text-4xl font-semibold text-accent">${L.total}</span><span class="text-sm text-muted">y</span><span class="ml-2 text-[13px] text-muted">ベスト ${L.best}y</span></div></div>
    <div class="text-right"><div class="lbl">目標</div><div class="num text-2xl font-semibold">300<span class="text-sm text-muted">y</span></div></div></div>
   <div><div class="mb-1 flex justify-between text-[12px]"><span>平均ボールスピード <b>${L.bs}</b> m/s</span><span class="text-muted">目標 ${D300_GOAL} m/s（あと${(D300_GOAL-L.bs).toFixed(1)}）</span></div>
    <div class="h-3 overflow-hidden rounded-full bg-line"><div class="h-full rounded-full bg-accent" style="width:${pct}%"></div></div></div>
   <div class="text-[13px]">10月の伸び：平均トータル <b>${first.total}→${L.total}y</b>（＋${L.total-first.total}y）。ほとんどが「当たり方」の改善で、ボールスピードは${first.bs}→${L.bs} m/s。</div>
  </div>
  <div class="grid gap-2"><h3 class="h2 border-b-2 border-fg pb-1">ステップ</h3>
   ${D300_STAGES.map(s=>{const done=L.bs>=s.bs-0.5;const now=s===cur;return `<div class="flex gap-3 rounded-xl border ${now?'border-accent bg-accent-soft':'border-line'} p-3">
     <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full ${done?'bg-accent text-surface':'border border-line text-muted'} font-mono font-bold">${done?'✓':s.lv}</span>
     <div class="min-w-0 flex-1"><div class="flex flex-wrap items-baseline gap-x-2"><b>${s.name}</b><span class="text-[12px] text-muted">${s.when}</span><span class="ml-auto font-mono text-[13px]">${s.bs} m/s → 約${s.total}y</span></div><div class="text-[13px] text-muted">${esc(s.focus)}</div></div></div>`;}).join('')}
   <div class="text-[11px] text-muted">距離はボールスピードからの目安（キャリー≒mph×1.6＋転がり約35y）。時期は、スピードトレーニングで年に数m/s上がる一般的なペースからの目安で、約束ではありません。</div>
  </div>
  <div class="grid gap-2"><h3 class="h2 border-b-2 border-fg pb-1">1週間の流れ（例）</h3>
   <div class="grid grid-cols-7 gap-1 text-center">${plan.map(([d,t])=>`<div class="rounded-lg border border-line p-1"><div class="text-[11px] font-bold">${d}</div><div class="text-[10px] leading-tight text-muted">${t}</div></div>`).join('')}</div>
   <div class="text-[11px] text-muted">仕事と家族の予定に合わせて入れ替えてOK。①は週3回、②は週2回が目安。</div>
  </div>
  ${D300_MENU.map(m=>`<div class="grid gap-2"><div class="flex items-center gap-2 border-b-2 border-fg pb-1"><h3 class="h2">${m.t}</h3><label class="ml-auto flex items-center gap-1 text-[12px]"><input type="checkbox" class="h-5 w-5 accent-[var(--accent)]" ${d300Chk(m.k)?'checked':''} onchange="d300Set('${m.k}',this.checked)">今週やった</label></div>
    <p class="text-[13px] text-muted">${esc(m.d)}</p>
    <div class="grid gap-2 sm:grid-cols-2">${m.ex.map(([a,b])=>`<div class="rounded-lg bg-field px-3 py-2 ring-1 ring-line"><div class="text-[14px] font-bold">${esc(a)}</div><div class="text-[13px] leading-snug text-muted">${esc(b)}</div></div>`).join('')}</div></div>`).join('')}
  <div class="grid gap-2"><h3 class="h2 border-b-2 border-fg pb-1">記録（ドライバー・フルスイング）</h3>
   <div class="overflow-x-auto"><table class="w-full text-center text-[13px]"><tr class="text-[11px] text-muted"><th class="py-1">日付</th><th>ボールスピード</th><th>最速</th><th>キャリー</th><th>トータル</th><th>ベスト</th></tr>
   ${D300_LOG.map(r=>`<tr class="border-t border-line"><td class="py-1.5">${+r.d.slice(5,7)}/${+r.d.slice(8)}${r.note?`<div class="text-[10px] text-muted">${esc(r.note)}</div>`:''}</td><td>${r.bs}</td><td>${r.bsMax}</td><td>${r.carry}</td><td><b>${r.total}</b></td><td>${r.best}</td></tr>`).join('')}</table></div>
   <div class="rounded-lg bg-accent-soft px-3 py-2 text-[13px]"><b class="text-accent">測るもの：</b>2週間に1回、トラックマンで <b>ヘッドスピード・ボールスピード・ミート率・打ち出し角・スピン量</b> の画面を撮って送る → ここに追加して、ステップを更新します。</div>
  </div>`;
}
