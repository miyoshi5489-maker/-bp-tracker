// ─────────────────────────────────────────────
// ランの分析：Garminから自動で入った記録で、距離・ペース・心拍・効率の伸びをグラフと総括で見る
// ─────────────────────────────────────────────
(function(){
const fmtTime=s=>{s=Math.round(s);const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h?`${h}:${pad(m)}:${pad(x)}`:`${m}:${pad(x)}`;};
const avg=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:null;
const eff=r=>r.runHr>0?(r.runDist*1000/(r.runTime/60))/r.runHr:null; // 心拍1回で進む距離（m）
const pace=r=>r.runTime/r.runDist;
// 折れ線（y を反転できる：ペースは速いほど上）
function lineChart(pts,o){
  const W=320,H=150,L=40,R=10,T=12,B=24;if(pts.length<2)return '<div class="py-6 text-center text-[13px] text-muted">データが2回分たまると表示します</div>';
  const ys=pts.map(p=>p.y);let lo=Math.min(...ys,o.bandLo??Infinity),hi=Math.max(...ys,o.bandHi??-Infinity);const pd=(hi-lo)*.12||1;lo-=pd;hi+=pd;
  const X=i=>L+(W-L-R)*(pts.length===1?.5:i/(pts.length-1));const Y=v=>o.inv?T+(H-T-B)*(v-lo)/(hi-lo):T+(H-T-B)*(1-(v-lo)/(hi-lo));
  const ticks=[0,.5,1].map(f=>lo+(hi-lo)*f);
  let s=`<svg viewBox="0 0 ${W} ${H}" class="w-full" role="img" aria-label="${o.label}">`;
  if(o.bandLo!=null){const y1=Y(o.bandLo),y2=Y(o.bandHi);s+=`<rect x="${L}" y="${Math.min(y1,y2)}" width="${W-L-R}" height="${Math.abs(y2-y1)}" style="fill:var(--accent-soft)"/><text x="${W-R-2}" y="${Math.min(y1,y2)+10}" text-anchor="end" font-size="9" style="fill:var(--accent)">${o.bandName}</text>`;}
  ticks.forEach(v=>{s+=`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" style="stroke:var(--line)" stroke-width="1"/><text x="${L-4}" y="${Y(v)+3}" text-anchor="end" font-size="9" style="fill:var(--muted)">${o.fmt(v)}</text>`;});
  // 傾向線（最小二乗）
  const n=pts.length,mx=(n-1)/2,my=avg(ys);let num=0,den=0;ys.forEach((v,i)=>{num+=(i-mx)*(v-my);den+=(i-mx)**2;});const b=den?num/den:0,a0=my-b*mx;
  s+=`<line x1="${X(0)}" y1="${Y(a0)}" x2="${X(n-1)}" y2="${Y(a0+b*(n-1))}" style="stroke:var(--accent2)" stroke-width="2" stroke-dasharray="5 4" opacity=".8"/>`;
  s+=`<polyline fill="none" style="stroke:var(--accent)" stroke-width="2.4" stroke-linejoin="round" points="${pts.map((p,i)=>`${X(i)},${Y(p.y)}`).join(' ')}"/>`;
  pts.forEach((p,i)=>{s+=`<circle cx="${X(i)}" cy="${Y(p.y)}" r="3.2" style="fill:var(--surface);stroke:var(--accent)" stroke-width="2"/>`;});
  const lab=[0,Math.floor((n-1)/2),n-1].filter((v,i,a)=>a.indexOf(v)===i);lab.forEach(i=>{s+=`<text x="${X(i)}" y="${H-6}" text-anchor="middle" font-size="9" style="fill:var(--muted)">${pts[i].d.slice(5).replace('-','/')}</text>`;});
  return s+'</svg>';
}
function barChart(rows){
  const W=320,H=150,L=28,R=6,T=14,B=24;const mx=Math.max(10,...rows.map(r=>Math.max(r.v,r.plan||0)))*1.1;const bw=(W-L-R)/rows.length;
  const Y=v=>T+(H-T-B)*(1-v/mx);let s=`<svg viewBox="0 0 ${W} ${H}" class="w-full" role="img" aria-label="週ごとの距離">`;
  [0,.5,1].forEach(f=>{const v=mx*f;s+=`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" style="stroke:var(--line)"/><text x="${L-4}" y="${Y(v)+3}" text-anchor="end" font-size="9" style="fill:var(--muted)">${Math.round(v)}</text>`;});
  rows.forEach((r,i)=>{const x=L+i*bw+bw*.18,w=bw*.64;s+=`<rect x="${x}" y="${Y(r.v)}" width="${w}" height="${Math.max(0,Y(0)-Y(r.v))}" rx="3" style="fill:${r.cur?'var(--accent2)':'var(--accent)'}"/>`;
    if(r.plan)s+=`<line x1="${x-2}" x2="${x+w+2}" y1="${Y(r.plan)}" y2="${Y(r.plan)}" style="stroke:var(--pop-fill)" stroke-width="2.5"/>`;
    if(r.v>0)s+=`<text x="${x+w/2}" y="${Y(r.v)-3}" text-anchor="middle" font-size="8.5" font-weight="bold" style="fill:var(--fg)">${km1(r.v)}</text>`;
    if(i%2===rows.length%2||r.cur)s+=`<text x="${x+w/2}" y="${H-6}" text-anchor="middle" font-size="9" style="fill:var(--muted)">${r.d.slice(5).replace('-','/')}</text>`;});
  return s+'</svg>';
}
const pct=(a,b)=>b?((a-b)/b*100):0;
window.renderRunStats=async function(){
  const el=$('p-runstats');const t=today();if(!el.innerHTML)el.innerHTML='<div class="text-sm text-muted">読み込み中…</div>';
  const recs=await getRecs();
  const runs=recs.filter(r=>r.runDist>0&&r.runTime>0).sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:a.id-b.id);
  // 傾向は2km以上・ペースが現実的（3'30〜10'00/km）なランだけで見る（短いウォームアップや入力ミスを外す）
  const main=runs.filter(r=>r.runDist>=2&&pace(r)>=210&&pace(r)<=600);
  // 週ごと
  const mon=mondayOf(t);const weeks=[...Array(10)].map((_,i)=>addDays(mon,-7*(9-i)));
  const wk=weeks.map(w=>{const e=addDays(w,6);return {d:w,v:runs.filter(r=>r.date>=w&&r.date<=e).reduce((s,r)=>s+r.runDist,0),plan:plannedKm(w,e),cur:w===mon};});
  const thisW=wk[9],lastW=wk[8];
  const r4=avg(wk.slice(5,9).map(x=>x.v)),p4=avg(wk.slice(1,5).map(x=>x.v));
  // 直近28日と、その前の28日
  const d28=addDays(t,-27),d56=addDays(t,-55);
  const A=main.filter(r=>r.date>=d28),Bp=main.filter(r=>r.date>=d56&&r.date<d28);
  const mPace=x=>avg(x.map(pace)),mHr=x=>avg(x.filter(r=>r.runHr>0).map(r=>r.runHr)),mEff=x=>avg(x.map(eff).filter(v=>v));
  const cmp=A.length>=2&&Bp.length>=2;
  const month=t.slice(0,7);const mKm=runs.filter(r=>r.date.startsWith(month)).reduce((s,r)=>s+r.runDist,0);
  const total=runs.filter(r=>r.date>='2026-10-01').reduce((s,r)=>s+r.runDist,0);
  const longest=main.filter(r=>r.date>=d28).reduce((m,r)=>Math.max(m,r.runDist),0);
  // 総括
  const notes=[];let head='';
  if(cmp){
    const dp=mPace(A)-mPace(Bp),dh=mHr(A)-mHr(Bp),de=pct(mEff(A),mEff(Bp));
    if(de>=2){head='心肺が伸びています';notes.push(['up',`同じ心拍で進む距離が <b>${de.toFixed(1)}%</b> 増えました（直近4週と、その前の4週）。同じ心拍で前より速く走れています。`]);}
    else if(de<=-2){head='少し疲れが出ているかも';notes.push(['down',`同じ心拍で進む距離が <b>${Math.abs(de).toFixed(1)}%</b> 減りました。疲れ・暑さ・寝不足でも下がるので、数日様子を見ます。`]);}
    else{head='安定しています';notes.push(['flat',`同じ心拍で進む距離はほぼ同じ（${de>=0?'+':''}${de.toFixed(1)}%）。今の練習量を続ければ伸びていく段階です。`]);}
    notes.push([dp<0?'up':'flat',`平均ペース ${paceStr(mPace(A))}/km（前の4週 ${paceStr(mPace(Bp))}、${dp<0?Math.round(-dp)+'秒速い':Math.round(dp)+'秒遅い'}）。平均心拍 ${Math.round(mHr(A)||0)}（前 ${Math.round(mHr(Bp)||0)}、${dh>=0?'+':''}${Math.round(dh)}）。`]);
  }else{head='データをためています';notes.push(['flat','2km以上のランが直近4週・その前の4週にそれぞれ2回たまると、伸びを比べて評価します。']);}
  if(r4!=null&&p4!=null)notes.push([r4>=p4?'up':'flat',`週の距離：直近4週の平均 <b>${km1(r4)}km</b>（その前 ${km1(p4)}km）。今週は ${km1(thisW.v)}km／計画 ${thisW.plan}km。`]);
  if(lastW.v>=8&&thisW.v>lastW.v*1.3)notes.push(['warn',`今週は先週（${km1(lastW.v)}km）より3割以上多いです。急に増やすと故障しやすいので、残りの日は軽めに。`]);
  const easyRuns=main.filter(r=>r.date>=d28&&r.runDist>=3);const fast=easyRuns.filter(r=>pace(r)<390&&r.runHr>=145);
  if(easyRuns.length>=2&&fast.length/easyRuns.length>=.5)notes.push(['warn',`直近4週の3km以上のランのうち ${fast.length}/${easyRuns.length} 回が、6'30"/kmより速くて心拍145以上。イージーの日はもう少しゆっくりにすると、疲れを残さず距離を伸ばせます。`]);
  if(longest)notes.push(['flat',`直近4週で一番長いラン：<b>${km1(longest)}km</b>。`]);
  const ic={up:'📈',down:'📉',flat:'➖',warn:'⚠️'};
  const last=runs.slice(-12).reverse();
  const pts=k=>main.slice(-20).map(r=>({d:r.date,y:k(r)})).filter(p=>p.y);
  el.innerHTML=`
  <div class="hero p-5"><div class="relative z-[1] grid gap-2">
    <div class="text-[12px] font-bold opacity-85">ランの総括（Garminから自動）</div>
    <div class="font-display text-2xl">${head}</div>
    <div class="grid grid-cols-3 gap-2 pt-1">
      <div class="rounded-2xl bg-white/15 p-2.5 text-center"><div class="num text-2xl font-semibold leading-tight">${km1(thisW.v)}</div><div class="text-[11px] opacity-90">今週 km</div></div>
      <div class="rounded-2xl bg-white/15 p-2.5 text-center"><div class="num text-2xl font-semibold leading-tight">${km1(mKm)}</div><div class="text-[11px] opacity-90">今月 km</div></div>
      <div class="rounded-2xl bg-white/15 p-2.5 text-center"><div class="num text-2xl font-semibold leading-tight">${km1(total)}</div><div class="text-[11px] opacity-90">10月から km</div></div>
    </div></div></div>
  <div class="card grid gap-2.5 p-4">${notes.map(([k,s])=>`<div class="flex gap-2.5 text-[14px] leading-relaxed"><span class="shrink-0">${ic[k]}</span><span>${s}</span></div>`).join('')}</div>
  <div class="grid gap-2"><h2 class="h2">週ごとの距離</h2><div class="card p-3">${barChart(wk)}<div class="mt-1 flex gap-4 text-[11px] text-muted"><span><i class="mr-1 inline-block h-2 w-3 rounded-sm" style="background:var(--accent)"></i>走った距離</span><span><i class="mr-1 inline-block h-0.5 w-3 align-middle" style="background:var(--pop-fill)"></i>計画</span></div></div></div>
  <div class="grid gap-2"><h2 class="h2">ペース</h2><div class="card p-3">${lineChart(pts(pace),{inv:true,fmt:v=>paceStr(v),label:'ペースの推移',bandLo:390,bandHi:435,bandName:'イージーの目安'})}<p class="mt-1 text-[11px] text-muted">上ほど速い。2km以上のランだけ。点線は傾向。</p></div></div>
  <div class="grid gap-2"><h2 class="h2">平均心拍</h2><div class="card p-3">${lineChart(pts(r=>r.runHr||null),{fmt:v=>Math.round(v),label:'心拍の推移'})}<p class="mt-1 text-[11px] text-muted">同じペースで心拍が下がっていけば、心肺が伸びています。</p></div></div>
  <div class="grid gap-2"><h2 class="h2">効率（心拍1回で進む距離）</h2><div class="card p-3">${lineChart(pts(eff),{fmt:v=>v.toFixed(2)+'m',label:'効率の推移'})}<p class="mt-1 text-[11px] text-muted">上がるほど、同じ心拍で速く走れている＝体力がついているサイン。</p></div></div>
  <div class="grid gap-2"><h2 class="h2">最近のラン</h2>
    <div class="card overflow-hidden"><table class="w-full text-[13px]"><thead><tr class="text-[11px] text-muted"><th class="px-3 py-2 text-left font-bold">日付</th><th class="py-2 text-right font-bold">距離</th><th class="py-2 text-right font-bold">タイム</th><th class="py-2 text-right font-bold">ペース</th><th class="px-3 py-2 text-right font-bold">心拍</th></tr></thead>
    <tbody>${last.map(r=>`<tr class="border-t border-line"><td class="px-3 py-2">${md(r.date)}</td><td class="num py-2 text-right font-bold">${km1(r.runDist)}</td><td class="num py-2 text-right">${fmtTime(r.runTime)}</td><td class="num py-2 text-right">${paceStr(pace(r))}</td><td class="num px-3 py-2 text-right">${r.runHr||'-'}</td></tr>`).join('')||'<tr><td colspan="5" class="px-3 py-4 text-center text-muted">まだ記録がありません</td></tr>'}</tbody></table></div>
    <p class="text-[11px] text-muted">Garminで走ると1時間ごとに自動で入ります（混んでいる時は1〜2時間かかることがあります）。</p></div>`;
};
})();
