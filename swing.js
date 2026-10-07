// スイング改善ログ：日にち・改善ポイント・練習メニュー（新しい順）
const SWING_LOG=[
 {date:'2026-10-07',title:'スイングコーチ（ブルックゴルフ部）の添削',src:'コーチ添削：58°とドライバー重点',
  imgs:[['img/swing/20261007_coach.jpg','コーチが線を引いた場面（後方は振り方の通り道の線、正面は体の中心の線）']],
  good:['構え（アドレス）の形は線の上に収まっている','正面から見た頭の位置は、トップまで大きくずれていない'],
  fix:[{t:'① テイクバックからトップの位置（コーチが一番気になった所）',d:'クラブの上げ方とトップの位置。後方の線より手元・クラブが上に外れやすい。トップでシャフトが目標より右を向く（クロス）と同じ問題。'},
       {t:'② ダウンスイング〜インパクトの右足の動き（コーチが一番気になった所）',d:'切り返しから右かかとが早く浮いて、右ひざが前（ボール側）に出る。そうなると上体が起き、手元が浮く（＝頭が沈んで上がる動きにつながる）。'}],
  drill:'練習の順番（毎回この順）：①アプローチ58°（左手片手→右手片手→左足軸→右足ボール踏み 各10球）②アイアン7I（右足つま先ボール踏み→ハーフスイング 各10球）③ドライバー（テイクバックの仕方→トップの位置を素振りで確認→左足軸ドリル10球→普通に10球）。最後に後方と正面を1球ずつ撮る。',
  todo:['アプローチ：左手片手打ち 10球','アプローチ：右手片手打ち 10球','アプローチ：左足軸ドリル 10球','アプローチ：右足ボール踏みドリル 10球','アイアン：右足つま先ボール踏みドリル 10球','アイアン：ハーフスイングドリル 10球','ドライバー：テイクバックの仕方（素振り5回）','ドライバー：トップの位置で1秒止める素振り 5回','ドライバー：左足軸ドリル 10球','動画チェック①後方：トップでシャフトが目標を指し、手元が線より上に出ていない','動画チェック②正面：インパクトまで右かかとが浮いていない'],
  coach:[['左手片手打ち（アプローチ）','左手だけで58°を持って小さく打つ。左手首の角度を保ったまま、体の回転でボールを運ぶ感覚を作る。'],['右手片手打ち（アプローチ）','右手だけで打つ。手首でこねずに、ヘッドの重さとソールを滑らせる感覚をつかむ。'],['左足軸ドリル（アプローチ・ドライバー）','左足に体重を多めに乗せて、左足を軸に回る。体が右に流れたり、打つ時に右に残ったりするのを防ぐ。'],['右足ボール踏みドリル／右足つま先ボール踏み（アプローチ・アイアン）','右足（つま先側）の下にボールを置いて打つ。右かかとが早く浮く・右ひざが前に出る動きができなくなり、前傾を保ったまま打てる。'],['テイクバックの仕方／トップの位置（ドライバー）','上げ始めの方向と、トップで止める位置を覚える。4分の3トップ（左腕が地面と平行より少し上）と同じ方向の修正。'],['ハーフスイングドリル（アイアン）','腰から腰までの振り幅で打つ。体の回転とクラブの通り道をそろえる。']]},
 {date:'2026-10-06',title:'TrackMan：全番手（PW・52°を初計測）',src:'TrackMan',
  good:['左へのミスが0球（全番手・計70球）','5Wが10球すべてまとも（キャリー177y）','4Hのキャリーが161yに伸びた','PWの打ち出し方向のブレが±1°とプロ並みに安定','ドライバーのまともな当たりはキャリー205y・トータル236y'],
  fix:[{t:'全番手が右に3〜7°打ち出す（毎回同じ）',d:'ブレは小さいのに方向がずれる → 構えの向き。ドライバー4.5°・5W 6.0°・4H 6.8°と長いクラブほど右。'},
       {t:'ドライバーの大きなミスは打ち出しが低い球',d:'キャリー140y以下の2球は打ち出し角6〜7°（普段は12°前後）。頭が沈んで上体が起きる動きと同じ原因。'},
       {t:'8Iの球の強さがバラバラ',d:'14球中4球がボールスピード35m/s以下。厚く当たった球と薄い球の差が大きい。'}],
  drill:'足元にクラブを置いて構えの向きをそろえる＋ドライバーは4分の3トップ。次回は1Wと4Hで「打ち出し0〜2°右」を目標に10球ずつ。'},
 {date:'2026-10-06',title:'ドライバーのスイング動画チェック',src:'練習動画（後方・正面）',
  imgs:[['img/swing/20261006_dr_back.jpg','後方：アドレス・トップ・インパクト'],['img/swing/20261006_dr_front.jpg','正面：アドレス・トップ・インパクト後']],
  good:['構え（前傾・ひざ）がきれい','トップで左右のブレが少ない','打った後も頭がボールの後ろに残る','腕が伸びている（左ひじが引けていない）','お尻の位置をインパクトまでキープ'],
  fix:[{t:'頭が沈んで、また上がる',d:'トップで頭が頭半分ほど沈み、その反動でインパクトの手元が浮く。トウ当たり・低い球の原因。'},
       {t:'トップでシャフトが目標より右（クロス）',d:'クラブが内側から下りる → 右に打ち出す球とチーピンの両方が出やすい。'}],
  drill:'ドライバーも「4分の3トップ」（左腕が地面と平行より少し上で止める）。後方から撮って、トップでシャフトが目標を指すかだけ確認。'},
 {date:'2026-10-05',title:'TrackMan：全番手の比較',src:'TrackMan',
  good:['5Wの左へのミス（チーピン）が消えた','7I・5Iの打ち出し方向のブレが±1°と安定','Qi35は大きなミスが約2割（前回より少ない）'],
  fix:[{t:'全番手が右に3〜9°打ち出す',d:'ブレが小さいのに毎回右 → 構えの向き（体が右を向いている）の可能性が高い。'},
       {t:'5Wのブレが大きい（±5.2°）',d:'ティーショットはQi35（広いホール）か4H（狭い・OBが近いホール）に。'}],
  drill:'足元にクラブを1本置いて目標と平行に構え、7Iで10球。打ち出しが右3°→0°前後になるか確認。'},
 {date:'2026-10-03',title:'TrackMan：ドライバー34球',src:'TrackMan',
  good:['スライスが減った','ティーの高さ50mmは適正'],
  fix:[{t:'1W・5Wがチーピン気味',d:'左ひじ・腕の三角形が崩れて、フェースが急に返る。'},
       {t:'伸び上がり（低い打ち出し）',d:'ミスの多くが低い球。前傾が起きて芯を外す。'}],
  drill:'壁ドリル（お尻を壁につけたまま振る）／タオルを両脇に挟んで三角形キープ／フィニッシュでフェースを返しすぎない。'},
];
function renderSwing(){
  const el=$('golf-body');
  el.innerHTML=`<div class="grid gap-1"><div class="font-display text-2xl">スイング改善</div><div class="text-[12px] text-muted">日にちごとの「良いところ」「直すところ」「次の練習」。新しい順。</div></div>
  ${SWING_LOG.map((s,k)=>`<details class="card overflow-hidden" ${k===0?'open':''}>
   <summary class="flex cursor-pointer list-none items-center gap-3 p-4">
     <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent text-surface"><span class="text-center leading-tight"><span class="block text-[11px]">${+s.date.slice(5,7)}月</span><span class="block font-mono text-lg font-bold">${+s.date.slice(8)}</span></span></span>
     <span class="min-w-0 flex-1"><span class="block font-bold">${esc(s.title)}</span><span class="block text-[11px] text-muted">${esc(s.src)}・直すところ ${s.fix.length}つ</span></span><span class="text-muted">▾</span>
   </summary>
   <div class="grid gap-3 border-t border-line p-4">
    ${(s.imgs||[]).map(([u,c])=>`<a href="${u}" target="_blank" rel="noopener"><img src="${u}" alt="${esc(c)}" class="w-full rounded-lg" loading="lazy"><div class="mt-1 text-[11px] text-muted">${esc(c)}（タップで拡大）</div></a>`).join('')}
    <div class="rounded-lg bg-warn-soft px-3 py-2"><div class="mb-1 text-[13px] font-bold text-warn">直すところ</div>
     <ol class="grid gap-2">${s.fix.map((x,i)=>`<li class="text-[13px] leading-snug"><b>${i+1}. ${esc(x.t)}</b><div class="text-muted">${esc(x.d)}</div></li>`).join('')}</ol></div>
    <div class="rounded-lg bg-accent-soft px-3 py-2"><div class="mb-1 text-[13px] font-bold text-accent">次の練習</div><div class="text-[13px] leading-snug">${esc(s.drill)}</div></div>
    ${s.todo?`<div class="rounded-lg border border-line px-3 py-2"><div class="mb-1 text-[13px] font-bold">次回までのチェックリスト</div><div class="grid gap-1">${s.todo.map((t,i)=>{const k='swtodo:'+s.date+':'+i;let on=false;try{on=localStorage.getItem(k)==='1';}catch{}return `<label class="flex items-start gap-2 text-[13px] leading-snug"><input type="checkbox" class="mt-0.5 h-4 w-4 shrink-0" ${on?'checked':''} onchange="try{localStorage.setItem('${k}',this.checked?'1':'0')}catch{}"><span>${esc(t)}</span></label>`;}).join('')}</div></div>`:''}
    ${s.coach?`<div class="px-1"><div class="mb-1 text-[13px] font-bold">コーチのドリルの意味</div><dl class="grid gap-1.5">${s.coach.map(([a,b])=>`<div class="text-[13px] leading-snug"><dt class="font-bold">${esc(a)}</dt><dd class="text-muted">${esc(b)}</dd></div>`).join('')}</dl></div>`:''}
    <div class="px-1"><div class="mb-1 text-[13px] font-bold">良いところ</div><ul class="grid gap-0.5">${s.good.map(g=>`<li class="text-[13px]">◎ ${esc(g)}</li>`).join('')}</ul></div>
   </div></details>`).join('')}`;
}
