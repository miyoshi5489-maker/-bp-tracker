// ─────────────────────────────────────────────
// ラン：篠山マラソン 3時間30分切り だけを考えたページ（記録はGarminから自動）
// ─────────────────────────────────────────────
(function(){
const GOAL=3.5*3600;                       // 3時間30分
const fmtT=s=>{s=Math.round(s);const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h?`${h}:${pad(m)}:${pad(x)}`:`${m}:${pad(x)}`;};
const hm=s=>{s=Math.round(s/60);return `${Math.floor(s/60)}時間${pad(s%60)}分`;};
const pace=r=>r.runTime/r.runDist;
const ok=r=>r.runDist>=2&&pace(r)>=210&&pace(r)<=600;   // 短いウォームアップや入力ミスを外す
const eff=r=>r.runHr>0?(r.runDist*1000/(r.runTime/60))/r.runHr:0;
const riegel=r=>r.runTime*Math.pow(42.195/r.runDist,1.06); // マラソンの予想（目安）
// GarminのVO2max・フル予想（Garmin自動の記録のメモに入る：「｜VO2max 52｜Garmin予想フル 3:41:20」）
const vo2Of=r=>{const m=(r.note||'').match(/VO2max (\d+(?:\.\d+)?)/);return m?+m[1]:0;};
const gpOf=r=>{const m=(r.note||'').match(/Garmin予想フル (\d+):(\d\d):(\d\d)/);return m?(+m[1])*3600+(+m[2])*60+(+m[3]):0;};
// VO2max（VDOT）からフルの時間：ダニエルズの式（スタミナが十分ある前提なので、速めに出る目安）
const vdotMarathon=v=>{const f=t=>{const vel=42195/t;return (-4.6+0.182258*vel+0.000104*vel*vel)/(0.8+0.1894393*Math.exp(-0.012778*t)+0.2989558*Math.exp(-0.1932605*t))-v;};let a=100,b=500;for(let i=0;i<60;i++){const m=(a+b)/2;if(f(m)>0)a=m;else b=m;}return (a+b)/2*60;};
// 一緒に篠山を走る仲間（Garminのランニングチャレンジ）。Garmin自動取り込みが1時間ごとに RUN_FRIENDS_LIVE を作る
const FRIEND_NAMES={'西田勇貴':'西田勇貴くん','大喜多佑介':'大喜多佑介くん'};
// ── 予想タイム（洋平さんも仲間も同じ計算。VO2maxからの予想は出さない＝洋平さんの指示）
// 練習からの見立て：(a) 直近8週の週平均距離と平均ペース（タンダの式：フルのペース秒/km＝17.1＋140×e^(−0.0053×週km)＋0.55×練習の平均ペース）
//   と (b) 直近6週で一番良い5km以上のランを、その時の心拍の余裕で全力に直してからフルへ（リーゲルの式）、の平均
const runPred=(R0,t)=>{const R=R0.filter(r=>r.km>=0.2&&r.sec>0).sort((a,b)=>a.d<b.d?1:-1);const P=r=>r.sec/r.km;const okp=r=>P(r)>=210&&P(r)<=600;
  const d8=addDays(t,-55);const R8=R.filter(r=>r.d>=d8&&r.d<=t);const first=R8.length?R8[R8.length-1].d:t;const wks=Math.max(1,Math.min(8,(diffDays(first,t)+1)/7));
  const K=R8.reduce((x,r)=>x+r.km,0)/wks;const M=R8.filter(r=>r.km>=2&&okp(r));const Pm=M.length?M.reduce((x,r)=>x+r.sec,0)/M.reduce((x,r)=>x+r.km,0):0;
  const tanda=Pm&&K?(17.1+140*Math.exp(-0.0053*K)+0.55*Pm)*42.195:null;
  const R12=R.filter(r=>r.d>=addDays(t,-83)&&r.km>=3&&r.hr>0&&okp(r));const hrTop=R12.length?Math.max(...R12.map(r=>r.hr)):0;
  const cand=R.filter(r=>r.km>=5&&r.d>=addDays(t,-41)&&okp(r)).map(r=>{const rg=r.sec*Math.pow(42.195/r.km,1.06);const f=r.hr&&hrTop?Math.max(.85,Math.min(1,r.hr/hrTop)):1;return {r,rg,adj:rg*f,f};}).sort((a,b)=>a.adj-b.adj)[0];
  const parts=[tanda,cand?cand.adj:null].filter(Boolean);const pro=parts.length?parts.reduce((x,y)=>x+y,0)/parts.length:null;
  const v=(R.find(r=>r.vo2)||{}).vo2||0;const w7=R.filter(r=>r.d>=addDays(t,-6));
  return {vo2:v,vPred:v?vdotMarathon(v):null,pro,tanda,K,Pm,cand,hrTop,last:R[0],w7n:w7.length,w7km:w7.reduce((x,r)=>x+r.km,0),longest:Math.max(0,...R.filter(r=>r.d>=addDays(t,-41)).map(r=>r.km)),recent:R.slice(0,3),
    month:R.filter(r=>r.d.startsWith(t.slice(0,7))).reduce((x,r)=>x+r.km,0)};};
const proWhy=x=>[x.tanda?`週${km1(x.K)}km・平均${paceStr(x.Pm)}/km → ${fmtT(x.tanda)}`:'',x.cand?`${md(x.cand.r.d)}の${km1(x.cand.r.km)}km（${paceStr(x.cand.r.sec/x.cand.r.km)}/km${x.cand.r.hr?'・心拍'+x.cand.r.hr:''}${x.cand.f<1?`、心拍の余裕${Math.round((1-x.cand.f)*100)}%を足す`:''}）→ ${fmtT(x.cand.adj)}`:''].filter(Boolean).join('／');
const friendView=(p,t)=>({name:FRIEND_NAMES[p.name]||p.name,score:p.score,...runPred(p.runs||[],t)});

// 週の距離：計画（うすい枠）と実際（塗り）
function weekChart(rows,curIdx){
  const W=340,H=170,L=26,R=4,T=16,B=26;const mx=Math.max(20,...rows.map(r=>Math.max(r.v,r.plan)))*1.08;const bw=(W-L-R)/rows.length;
  const Y=v=>T+(H-T-B)*(1-v/mx);let s=`<svg viewBox="0 0 ${W} ${H}" class="w-full" role="img" aria-label="週ごとの距離（計画と実際）">`;
  [0,20,40,60].filter(v=>v<mx).forEach(v=>{s+=`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" style="stroke:var(--line)"/><text x="${L-4}" y="${Y(v)+3}" text-anchor="end" font-size="9" style="fill:var(--muted)">${v}</text>`;});
  rows.forEach((r,i)=>{const x=L+i*bw+bw*.14,w=bw*.72;
    s+=`<rect x="${x}" y="${Y(r.plan)}" width="${w}" height="${Y(0)-Y(r.plan)}" rx="2" style="fill:var(--accent-soft);stroke:var(--accent)" stroke-width=".6" stroke-dasharray="2 1.5"/>`;
    if(r.v>0)s+=`<rect x="${x+w*.15}" y="${Y(r.v)}" width="${w*.7}" height="${Y(0)-Y(r.v)}" rx="2" style="fill:${i===curIdx?'var(--accent2)':'var(--accent)'}"/>`;
    if(i===curIdx)s+=`<text x="${x+w/2}" y="${Math.min(Y(r.v),Y(r.plan))-4}" text-anchor="middle" font-size="9" font-weight="bold" style="fill:var(--accent2)">今週</text>`;
    if(r.d.endsWith('-01')||i%3===0)s+=`<text x="${x+w/2}" y="${H-8}" text-anchor="middle" font-size="9" style="fill:var(--muted)">${+r.d.slice(5,7)}/${+r.d.slice(8)}</text>`;});
  return s+'</svg>';
}

window.toggleRunFriends=function(){try{const v=localStorage.getItem('yohei_run_friends')!=='0';localStorage.setItem('yohei_run_friends',v?'0':'1');}catch{}window.renderRunStats();};
window.renderRunStats=async function(){
  const el=$('p-runstats');const t=today();if(!el.innerHTML)el.innerHTML='<div class="text-sm text-muted">読み込み中…</div>';
  const recs=await getRecs();const bd=byDate(recs);
  const runs=recs.filter(r=>r.runDist>0&&r.runTime>0).sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:a.id-b.id);
  const days=diffDays(t,RACE);
  // 予想タイム：直近6週の5km以上のランから一番良いもの（全力でない日も含むので、実力より遅めに出る目安）
  const recent=runs.filter(r=>ok(r)&&r.runDist>=5&&r.date>=addDays(t,-41));
  const best=recent.sort((a,b)=>riegel(a)-riegel(b))[0];const pred=best?riegel(best):null;
  // VO2max とGarminの予想（一番新しい値）。練習で記録が入るたびに自動で変わる
  const vRuns=runs.filter(r=>vo2Of(r));const vLast=vRuns[vRuns.length-1];const vPred=vLast?vdotMarathon(vo2Of(vLast)):null;
  const gRuns=runs.filter(r=>gpOf(r));const gLast=gRuns[gRuns.length-1];const gPred=gLast?gpOf(gLast):null;
  const ME=runPred(runs.map(r=>({d:r.date,km:r.runDist,sec:r.runTime,hr:r.runHr,vo2:vo2Of(r)})),t);
  const main=ME.pro;
  const gap=main?main-GOAL:null;
  const hist=runs.filter(ok).slice(-8).reverse();
  const fShow=(()=>{try{return localStorage.getItem('yohei_run_friends')!=='0';}catch{return true;}})();
  const FL=window.RUN_FRIENDS_LIVE;
  // 関門
  const runOn=(d,sp)=>runs.filter(r=>sp?(r.date>=addDays(d,sp[0])&&r.date<=addDays(d,sp[1])):r.date===d).sort((a,b)=>b.runDist-a.runDist)[0];
  const gates=[
    {d:'2026-12-27',t:'ハーフをレースペースで（12/26土か27日）',goal:'1時間44分50秒以内',lim:6290,dist:21.0975,span:[-1,0]},
    {d:'2027-01-10',t:'30km走①（1/9土か10日）',goal:'ゆっくり入って、最後まで歩かずに走りきる',dist:30,span:[-1,0]},
    {d:'2027-01-24',t:'30km走②（1/23土か24日）',goal:"最後の10kmを5'05\"/km",dist:30,span:[-1,0]},
    {d:'2027-02-14',t:'レースペースで32km（35km）（2/13土か14日）',goal:'2時間39分以内',lim:9536,dist:32,span:[-1,0]},
    {d:RACE,t:'篠山マラソン',goal:'3時間30分切り',lim:GOAL,dist:42.195},
  ]  .map(g=>({...g,goal:g.lim?`${g.goal}　＝ 1km ${paceStr(Math.floor(g.lim/g.dist))} より速く`:g.goal}))
  .map(g=>{const r=g.d<=t||(g.span&&addDays(g.d,g.span[0])<=t)?runOn(g.d,g.span):null;let res='',st='';
    if(r&&r.runDist>=g.dist*0.95){const tt=g.lim?r.runTime*Math.pow(g.dist/r.runDist,1.06):r.runTime;res=g.lim?fmtT(tt):`${km1(r.runDist)}km`;st=g.lim?(tt<=g.lim?'ok':'ng'):'ok';}
    else if((g.span?addDays(g.d,g.span[1]):g.d)<t)st='miss';return {...g,res,st,left:diffDays(t,g.d)};});
  // 今週
  const mon=mondayOf(t);const week=[...Array(7)].map((_,i)=>addDays(mon,i));
  const RW=window.PLAN.RUN_WEEKS;const curW=window.PLAN.runWeek(t);const wDone=m=>runs.filter(r=>r.date>=m&&r.date<=addDays(m,6)).reduce((x,r)=>x+r.runDist,0);
  const MON_GOAL=[['2026-12',150],['2027-01',200]];const monKm=k=>runs.filter(r=>r.date.startsWith(k)).reduce((x,r)=>x+r.runDist,0);
  // 週の距離（10/26〜本番）
  const w0='2026-10-26';const wk=[];for(let m=w0;m<=mondayOf(RACE);m=addDays(m,7)){const e=addDays(m,6);wk.push({d:m,plan:plannedKm(m,e),v:runs.filter(r=>r.date>=m&&r.date<=e).reduce((s,r)=>s+r.runDist,0)});}
  const curIdx=wk.findIndex(x=>x.d===mon);const thisW=wk[curIdx]||{v:0,plan:0};
  const longest=Math.max(0,...runs.filter(r=>r.date>=addDays(t,-41)).map(r=>r.runDist));
  // 1月からの変化（月ごと）
  const months=[];for(let i=1;i<=12;i++){const k=`2026-${pad(i)}`;if(k>t.slice(0,7))break;const R=runs.filter(r=>r.date.startsWith(k));const M=R.filter(ok);const H=M.filter(r=>r.runHr>0);
    months.push({k,n:+k.slice(5),km:R.reduce((s,r)=>s+r.runDist,0),p:M.length?M.reduce((s,r)=>s+r.runTime,0)/M.reduce((s,r)=>s+r.runDist,0):0,hr:H.length?H.reduce((s,r)=>s+r.runHr,0)/H.length:0,ef:H.length?H.reduce((s,r)=>s+eff(r),0)/H.length:0,lg:Math.max(0,...R.map(r=>r.runDist))});}
  const mm=months.filter(m=>m.ef);const e0=mm[0],e1=mm[mm.length-1];const bestKm=months.reduce((a,b)=>b.km>a.km?b:a,months[0]||{km:0});
  // 一番良かった頃（2019/12〜2020/2/9 神戸バレンタインラブラン）と今を比べる
  const win=(a,b)=>runs.filter(r=>r.date>=a&&r.date<=b);
  const sumUp=(a,b)=>{const R=win(a,b),M=R.filter(ok),H=M.filter(r=>r.runHr>0),wks=(diffDays(a,b)+1)/7;const b10=M.filter(r=>r.runDist>=9.5).sort((x,y)=>pace(x)-pace(y))[0];
    return {kmw:R.reduce((s,r)=>s+r.runDist,0)/wks,nw:new Set(R.map(r=>r.date)).size/wks,ef:H.length?H.reduce((s,r)=>s+eff(r),0)/H.length:0,hard:M.length?M.filter(r=>pace(r)<300).length/wks:0,b10};};
  const race20=runs.find(r=>/バレンタイン/.test(r.note||''));
  const peak=race20?sumUp(addDays(race20.date,-70),addDays(race20.date,-1)):null,now=sumUp(addDays(t,-69),t);
  const P=window.PLAN.paceAt(t);const nextP=window.PLAN.PACE_STAGES.find(x=>x.from>t);
  const dot=st=>st==='ok'?'<span class="text-accent">✓ 達成</span>':st==='ng'?'<span class="text-warn">未達</span>':st==='miss'?'<span class="text-muted">記録なし</span>':'';
  el.innerHTML=`
  <div class="hero p-5"><div class="relative z-[1] grid gap-3">
    <div class="flex items-center justify-between text-[12px] font-bold opacity-90"><span>篠山マラソン 3/7（日）</span><span class="rounded-full bg-white/20 px-2.5 py-0.5">あと ${days} 日</span></div>
    <div class="grid grid-cols-2 gap-2">
      <div class="rounded-2xl bg-white/15 p-3"><div class="text-[11px] font-bold opacity-90">目標</div><div class="num text-[24px] font-semibold leading-tight">3:30:00</div><div class="text-[11px] opacity-90">4'58"/km</div></div>
      <div class="rounded-2xl bg-white/15 p-3"><div class="text-[11px] font-bold opacity-90">今の予想（練習から）</div><div class="num text-[24px] font-semibold leading-tight">${ME.pro?fmtT(ME.pro):'—'}</div><div class="text-[11px] opacity-90">${ME.pro?paceStr(ME.pro/42.195)+'/km':'情報なし'}</div></div>
    </div>
    ${ME.pro?`<div class="text-[14px] font-bold">${ME.pro>GOAL?`あと <span class="num text-xl">${Math.round((ME.pro-GOAL)/60)}</span> 分 縮める`:'目標ペースに届いています'}</div>`:''}
  </div></div>
  <div class="grid gap-2"><h2 class="h2">予想タイムの出し方</h2>
    <div class="card p-4 text-[13px] leading-relaxed">直近8週の練習量・平均ペースから出すタイムと、直近6週で一番良いランを心拍の余裕の分だけ全力に直したタイムの平均。<div class="mt-1 text-[12px] text-muted">${esc(proWhy(ME))}</div></div>
    ${hist.length?`<div class="card overflow-hidden"><table class="w-full text-[13px]"><thead><tr class="text-[11px] text-muted"><th class="px-3 py-2 text-left">練習</th><th class="px-3 py-2 text-right">その時の予想</th></tr></thead><tbody>${hist.map(r=>{const x=runPred(runs.filter(z=>z.date<=r.date).map(z=>({d:z.date,km:z.runDist,sec:z.runTime,hr:z.runHr})),r.date);return `<tr class="border-t border-line"><td class="px-3 py-2">${md(r.date)} ${km1(r.runDist)}km</td><td class="num px-3 py-2 text-right">${x.pro?fmtT(x.pro):'—'}</td></tr>`;}).join('')}</tbody></table></div><p class="text-[11px] text-muted">Garminで走るたびに自動で更新されます。</p>`:''}
  </div>

  <div class="grid gap-2"><div class="flex items-center justify-between"><h2 class="h2">仲間と篠山（ランニングチャレンジ）</h2><button class="chip" onclick="toggleRunFriends()">${fShow?'隠す':'表示する'}</button></div>
    ${fShow?(FL&&FL.people&&FL.people.length?`
    <div class="card overflow-hidden"><table class="w-full text-[13px]"><thead><tr class="text-[11px] text-muted"><th class="px-3 py-2 text-left">${FL.challenge&&FL.challenge.end?`〜${md(FL.challenge.end)}`:''}</th><th class="py-2 text-right">チャレンジ</th><th class="px-3 py-2 text-right">フルの予想</th></tr></thead><tbody>
      ${FL.people.slice().sort((a,b)=>(+b.score||0)-(+a.score||0)).map((p,i)=>{const f=p.me?null:friendView(p,t);return `<tr class="border-t border-line ${p.me?'font-bold':''}"><td class="px-3 py-2">${i+1}. ${p.me?'洋平さん':esc(f.name)}</td><td class="num py-2 text-right">${p.score!=null?km1(+p.score/1000)+'km':'—'}</td>${(x=>`<td class="num px-3 py-2 text-right">${x.pro?fmtT(x.pro):'<span class="text-muted">情報なし</span>'}</td>`)(p.me?ME:f)}</tr>`;}).join('')}
    </tbody></table></div>
    ${[{me:1},...FL.people.filter(p=>!p.me)].map(p=>{const f=p.me?{...ME,name:'洋平さん'}:friendView(p,t);return `<div class="card p-4 text-[13px] leading-relaxed"><div class="mb-1 flex items-baseline justify-between"><b class="text-[15px]">${esc(f.name)}</b><span class="text-[11px] text-muted">${f.last?'最後のラン '+md(f.last.d):'最近のランなし'}</span></div>
      <div>直近7日：<b class="num">${f.w7n}回・${km1(f.w7km)}km</b>　今月：<b class="num">${km1(f.month)}km</b>　6週の最長：<b class="num">${km1(f.longest)}km</b></div>
      <div>フルの予想：<b class="num">${f.pro?fmtT(f.pro):'情報なし'}</b><div class="text-[11.5px] text-muted">${esc(proWhy(f))||'直近の練習が少なく計算できません'}</div></div>
      ${f.recent.length?`<div class="mt-1 text-[12px] text-muted">${f.recent.map(r=>`${md(r.d)} ${km1(r.km)}km ${paceStr(r.sec/r.km)}/km${r.hr?'・心拍'+r.hr:''}`).join('<br>')}</div>`:''}</div>`;}).join('')}
    <p class="text-[11px] text-muted">Garminのランニングチャレンジと2人のランから1時間ごとに自動で更新（${md(FL.at.slice(0,10))} ${FL.at.slice(11)||''}）。予想の出し方は洋平さんと同じ（上の「予想タイムの出し方」）。</p>`
    :'<div class="card p-4 text-[13px] text-muted">Garminのチャレンジをまだ読み込めていません（1時間ごとに自動で読みます）。</div>'):''}
  </div>

  <div class="grid gap-2"><h2 class="h2">次の関門</h2>
    <div class="card divide-y divide-line px-4">${gates.map(g=>`<div class="flex items-center gap-3 py-3"><div class="w-14 shrink-0 text-center"><div class="num text-[13px] font-bold">${+g.d.slice(5,7)}/${+g.d.slice(8)}</div><div class="text-[10px] text-muted">${g.left>0?'あと'+g.left+'日':g.left===0?'今日':''}</div></div>
      <div class="min-w-0 flex-1"><div class="font-bold">${g.t}</div><div class="text-[12px] text-muted">${g.goal}</div></div><div class="shrink-0 text-right text-[12px] font-bold">${g.res?`<div class="num text-sm">${g.res}</div>`:''}${dot(g.st)}</div></div>`).join('')}</div></div>

  <div class="grid gap-2"><h2 class="h2">月の目標</h2>
    <div class="card divide-y divide-line px-4">${MON_GOAL.map(([k,g])=>{const v=monKm(k);return `<div class="py-2.5"><div class="flex items-baseline justify-between text-[13px]"><b>${+k.slice(5)}月 ${g}km</b><span class="num"><b>${km1(v)}</b> / ${g}km</span></div><div class="mt-1 h-2 overflow-hidden rounded-full" style="background:var(--line)"><div class="h-full rounded-full" style="width:${Math.min(100,v/g*100)}%;background:var(--accent)"></div></div></div>`;}).join('')}</div></div>

  <div class="grid gap-2"><div class="flex items-baseline justify-between"><h2 class="h2">今週のラン（週プラン）</h2><span class="num text-[13px] text-muted"><b class="text-fg">${km1(wDone(mon))}</b> / ${curW?curW.km:thisW.plan} km</span></div>
    ${curW?`<div class="card p-4 text-[13px] leading-relaxed"><div class="mb-1 font-bold text-[15px]">${esc(curW.title)}</div>
      ${curW.key.map(k=>`<div class="border-t border-line py-2 first:border-0"><b>${esc(k[0])}</b>　${esc(k[1])}<div class="text-[12px] text-muted">ペース ${esc(k[2](window.PLAN.paceAt(curW.mon)))}</div></div>`).join('')}
      <div class="border-t border-line py-2"><b>残り</b>　${esc(curW.easy)}<div class="text-[12px] text-muted">ペース ${esc(window.PLAN.paceAt(curW.mon).easy)}</div></div>
      <p class="text-[11.5px] text-muted">走る日は週の中で自由に。ポイント練習（ロング・速い練習）は間を1日以上あける。</p></div>`:'<div class="card p-4 text-[13px] text-muted">週プランは11/30の週から始まります。</div>'}
  </div>

  <div class="grid gap-2"><h2 class="h2">週ごとのプラン（本番まで）</h2>
    <div class="card overflow-hidden"><table class="w-full text-[13px]"><tbody>${RW.map(w=>{const past=w.mon<=t;const v=wDone(w.mon);const cur=curW&&w.mon===curW.mon;return `<tr class="border-t border-line first:border-0 ${cur?'font-bold':''}" ${cur?'style="background:var(--accent-soft)"':''}><td class="px-3 py-2 align-top whitespace-nowrap">${+w.mon.slice(5,7)}/${+w.mon.slice(8)}〜</td><td class="py-2 align-top">${esc(w.title)}<div class="text-[11.5px] font-normal text-muted">${esc(w.key.map(k=>k[0]+' '+k[1].replace(/（.*$/,'')).join('・'))}</div></td><td class="num px-3 py-2 text-right align-top whitespace-nowrap">${past?`<b>${km1(v)}</b>/`:''}${w.km}km</td></tr>`;}).join('')}</tbody></table></div>
    <p class="text-[11px] text-muted">月の目標：12月150km・1月200km。ペースは「今の練習ペース」の段階に合わせて自動で変わります。</p>
  </div>

  <div class="grid gap-2"><h2 class="h2">週の距離（計画と実際）</h2>
    <div class="card p-3">${weekChart(wk,curIdx)}
      <div class="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted"><span><i class="mr-1 inline-block h-2.5 w-3 rounded-sm align-middle" style="background:var(--accent-soft);outline:1px dashed var(--accent)"></i>計画</span><span><i class="mr-1 inline-block h-2.5 w-3 rounded-sm align-middle" style="background:var(--accent)"></i>走った距離</span><span>直近6週の最長 <b class="num text-fg">${km1(longest)}km</b>（本番前に32km）</span></div></div></div>

  <div class="grid gap-2"><h2 class="h2">今の練習ペース</h2>
    <div class="card px-4"><div class="py-2.5 text-[12px] font-bold text-accent">${esc(P.name)}<span class="ml-1 font-normal text-muted">${esc(P.why)}</span></div>
    ${[['イージー','easy'],['ロング走','long'],['マラソンペース','mp'],['テンポ走','tempo'],['インターバル','interval']].map(([n,k])=>`<div class="flex items-center justify-between border-t border-line py-2.5"><span class="text-[14px]">${n}</span><span class="num text-[14px] font-semibold">${P[k]}</span></div>`).join('')}
    ${nextP?`<div class="border-t border-line py-2.5 text-[12px] text-muted">次の段階：${esc(nextP.name)}（マラソンペース ${nextP.mp}）</div>`:''}</div></div>

  ${peak?`<div class="grid gap-2"><h2 class="h2">一番良かった頃と比べる</h2>
    <div class="card p-4 text-[13px]"><div class="mb-2 leading-relaxed">${md(race20.date).replace(/（.）/,'')}（${race20.date.slice(0,4)}年）の神戸バレンタインラブラン：<b class="num">${km1(race20.runDist)}km ${fmtT(race20.runTime)}（${paceStr(pace(race20))}/km・心拍${race20.runHr}）</b>。マラソンに直すと約 <b class="num">${fmtT(riegel(race20))}</b> の力です。</div>
    <table class="w-full"><thead><tr class="text-[11px] text-muted"><th class="py-1.5 text-left">直前10週の平均</th><th class="py-1.5 text-right">当時</th><th class="py-1.5 text-right">今</th></tr></thead><tbody>
    ${[['週の距離',x=>km1(x.kmw)+'km'],['走った日（週）',x=>x.nw.toFixed(1)+'日'],['5分/kmより速い練習（週）',x=>x.hard.toFixed(1)+'回'],['効率（心拍1回で進む距離）',x=>x.ef?x.ef.toFixed(2)+'m':'—'],['10km以上で一番速い',x=>x.b10?paceStr(pace(x.b10))+'/km':'—']].map(([n,f])=>`<tr class="border-t border-line"><td class="py-2">${n}</td><td class="num py-2 text-right font-bold">${f(peak)}</td><td class="num py-2 text-right">${f(now)}</td></tr>`).join('')}</tbody></table>
    <p class="mt-2 text-[11.5px] leading-relaxed text-muted">当時は週4日ほど走り、週2回ほど5分/kmより速い練習（10kmを4'14"など）を入れていました。効率がこの頃の水準に近づくほど、3時間30分切りが現実になります。</p></div></div>`:''}
  <div class="grid gap-2"><h2 class="h2">1月からの変化</h2>
    ${e0&&e1?`<p class="text-[13px] leading-relaxed">心拍1回で進む距離（効率）は ${e0.n}月 <b>${e0.ef.toFixed(2)}m</b> → ${e1.n}月 <b>${e1.ef.toFixed(2)}m</b>（${((e1.ef/e0.ef-1)*100).toFixed(0)}%）。月の距離は${bestKm.n}月の ${km1(bestKm.km)}km が最高。</p>`:''}
    <div class="card overflow-hidden"><table class="w-full text-[13px]"><thead><tr class="text-[11px] text-muted"><th class="px-3 py-2 text-left">月</th><th class="py-2 text-right">距離</th><th class="py-2 text-right">平均ペース</th><th class="py-2 text-right">心拍</th><th class="px-3 py-2 text-right">効率</th></tr></thead>
    <tbody>${months.map(m=>`<tr class="border-t border-line"><td class="px-3 py-2">${m.n}月</td><td class="num py-2 text-right ${m===bestKm?'font-bold text-accent':''}">${km1(m.km)}</td><td class="num py-2 text-right">${m.p?paceStr(m.p):'—'}</td><td class="num py-2 text-right">${m.hr?Math.round(m.hr):'—'}</td><td class="num px-3 py-2 text-right ${m===e1?'font-bold text-accent':''}">${m.ef?m.ef.toFixed(2):'—'}</td></tr>`).join('')}</tbody></table></div>
    <p class="text-[11px] text-muted">平均ペース・心拍・効率は2km以上のランだけ。効率＝心拍1回で進む距離（m）。上がるほど同じ心拍で速く走れています。</p></div>

  <div class="grid gap-2"><h2 class="h2">最近のラン</h2>
    <div class="card overflow-hidden"><table class="w-full text-[13px]"><tbody>${runs.slice(-8).reverse().map(r=>`<tr class="border-t border-line first:border-0"><td class="px-3 py-2">${md(r.date)}</td><td class="num py-2 text-right font-bold">${km1(r.runDist)}km</td><td class="num py-2 text-right">${fmtT(r.runTime)}</td><td class="num py-2 text-right">${paceStr(pace(r))}</td><td class="num px-3 py-2 text-right">${r.runHr||'—'}</td></tr>`).join('')}</tbody></table></div>
    <p class="text-[11px] text-muted">Garminで走ると自動で入ります（1〜2時間かかることがあります）。</p></div>`;
};
})();
