// スイング改善ログ：日にち・改善ポイント・練習メニュー（新しい順）
const SWING_LOG=[
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
    <div class="px-1"><div class="mb-1 text-[13px] font-bold">良いところ</div><ul class="grid gap-0.5">${s.good.map(g=>`<li class="text-[13px]">◎ ${esc(g)}</li>`).join('')}</ul></div>
   </div></details>`).join('')}`;
}
